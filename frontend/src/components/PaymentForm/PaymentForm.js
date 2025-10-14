import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from 'sonner';
import './PaymentForm.css';
import { useNavigate } from 'react-router-dom';
import { updateAfterPayment } from '../../services/TransactionService';

const PaymentForm = ({ amount, bookingId }) => {
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
        console.log("Intent ID", paymentIntent.id)
        if (stripeError) {
            setError(stripeError.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
                const result = updateAfterPayment(bookingId);
                console.log(result)
                toast.success('Booking successful')
                navigate(`/view-booking/${bookingId}`)
                toast.success("Payment successful!");
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

            <div className="payment-summary">
                <h3>Payment Summary</h3>
                <p>Booking Fee (30%): ${(amount * 0.3)}</p>
                <p>Platform Fee (5%): ${(amount * 0.05)}</p>
                <p><strong>Total to Pay: ${amount}</strong></p>
            </div>
        </div>
    );
};

export default PaymentForm;
