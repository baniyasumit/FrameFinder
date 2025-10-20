import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from 'sonner';
import './PaymentForm.css';
import { useNavigate } from 'react-router-dom';
import { updateAfterPayment } from '../../services/TransactionService';

const PaymentForm = ({ totalCharge, bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;


        setLoading(true);
        setError(null);

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });
        if (stripeError) {
            setError(stripeError.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
                const result = await updateAfterPayment(bookingId);
                console.log(result.message)
                toast.success('Payment as well as Booking successful')
                navigate(`/view-booking/${bookingId}`, { replace: true })
            } catch (err) {
                console.error("Save error:", err);
                toast.error(err, {
                    position: 'top-center',
                });
            }
        }

        setLoading(false);
    };

    return (
        <div className="payment-page">
            <div className="payment-summary">
                <h3>Payment Summary</h3>
                <p>Duration: <span>{totalCharge.duration} day</span></p>
                <p>Standard Charge: <span>${totalCharge.standardCharge}</span></p>
                <p>Package Charge: <span>${totalCharge.packageCharge}</span> </p>
                <p>Total Charge: <span>${totalCharge.total}</span> </p>
                <hr></hr>
                <p className='total'>To Pay:</p>
                <p className='total'>30% of Total Charge:  <span>${totalCharge.total * 0.30}</span></p>
                <p className='total'>Stripe processing Charge(4%):  <span>${(totalCharge.total * 0.30) * 0.04}</span> </p>
                <hr></hr>
                <p className='total'>Total to Pay(30% of total):  <span>${(totalCharge.total * 0.30) + (totalCharge.total * 0.30) * 0.04}</span></p>
                <p className='message'>You are charged the 30% of total amount. This will be refunded if the photographer doesn't accept or decides to decline.</p>
                <p className='message'>Note: You will be charge 5% of the total amount if you decide to cancel after the photographer has accepted your offer.</p>
            </div>
            <div className="payment-form-container">
                <h2 className="payment-heading">Complete Your Payment</h2>
                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="payment-element-wrapper">
                        <PaymentElement options={{ layout: "accordion" }} />
                    </div>
                    {error && <p className="payment-error">{error}</p>}
                    <button type="submit" disabled={!stripe || loading} className="payment-button">
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>


        </div>
    );
};

export default PaymentForm;
