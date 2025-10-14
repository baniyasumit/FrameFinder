import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { initatePayment } from '../../services/TransactionService';
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import { useRef } from 'react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
    const { bookingId } = useParams();
    const [clientSecret, setClientSecret] = useState("");
    const didFetch = useRef(false);
    useEffect(() => {

        const fetchClientSecret = async () => {
            const result = await initatePayment(bookingId);
            setClientSecret(result.clientSecret);
        };

        if (!didFetch.current) {
            didFetch.current = true;
            fetchClientSecret();
        }
    }, [bookingId]);

    if (!clientSecret) return <p>Loading payment...</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm bookingId={bookingId} />
        </Elements>
    );
};

export default Payment;
