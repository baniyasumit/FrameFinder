import React, { useEffect, useRef, useState } from 'react'
import './WithdrawModal.css'
import { toast } from 'sonner';
import { FaDollarSign } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { SiTicktick } from "react-icons/si";
import { checkTransferability, createStripeAccount, getWalletDetails, withdraw } from '../../services/WalletService';

const WithdrawModal = ({ setShowWithdrawModal, setSummary }) => {
    const modelRef = useRef();
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [stripeAccountCheck, setStripeAccountCheck] = useState(false)
    const [url, setUrl] = useState("")
    const [checkLoading, setCheckLoading] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                setShowWithdrawModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowWithdrawModal]);


    useEffect(() => {
        const fetchTransferabiltiyCheck = async () => {
            try {
                setCheckLoading(true)
                const result = await checkTransferability();
                console.log(result);
                setStripeAccountCheck(result.verified)
                if (!result.verified) {
                    setUrl(result.url)
                }
            } catch (error) {
                console.error("Transferability Check Error: ", error)

            } finally {
                setCheckLoading(false)
            }
        };
        fetchTransferabiltiyCheck();
    }, [setStripeAccountCheck]);



    const handleAccountCreation = async (e) => {
        e.preventDefault();
        if (url !== "") {
            window.location.href = url
            return;
        };
        try {
            const response = await createStripeAccount();
            window.location.href = response.url;
        } catch (err) {
            console.error("Save error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        } finally {
            setShowWithdrawModal(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await withdraw(withdrawAmount);
            console.log(result.message);
            toast.success('Transaction Successful');
            setSummary((prev) => ({
                ...prev,
                availableBalance: result.wallet.availableBalance,
                totalWithdrawn: result.wallet.totalWithdrawn,
            }));
        } catch (err) {
            console.error("Save error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        } finally {
            setShowWithdrawModal(false);
            await getWalletDetails()
        }
    }

    return (
        <div className="review-overlay">
            <form className="review-modal" ref={modelRef} onSubmit={handleSubmit}>
                <button className="close-icon" onClick={() => setShowWithdrawModal(false)}>
                    ×
                </button>
                <div className="withdraw-header">
                    <h1 className="withdraw-title">Withdraw your money</h1>
                    {!stripeAccountCheck && <p className='withdraw-message'>Please connect your account first in order to procced with withdrawal.</p>}
                </div>
                <div className='service-inputs-container'>
                    <input type='number'
                        className='service-inputs' name='price'
                        placeholder="Price"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        disabled={!stripeAccountCheck}
                    />

                    <span className='service-input-icons price'><span><FaDollarSign /></span></span>
                </div>

                <div className='submit-button-container withdraw-modal'>
                    {stripeAccountCheck ?
                        <p className='stripe-account connected'>
                            Account Connected <SiTicktick />
                        </p> :
                        <button className='stripe-account not-connected' onClick={handleAccountCreation} disabled={checkLoading}>
                            {checkLoading && <span className="loader"></span>} No account connected <RxCross2 />
                        </button>
                    }
                    <button type='submit' className='submit-button' disabled={!stripeAccountCheck}>
                        Withdraw
                    </button>
                </div>
            </form>
        </div>
    )
}

export default WithdrawModal;