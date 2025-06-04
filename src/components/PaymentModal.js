// filepath: c:\Users\Administrator\Desktop\Organic\src\components\PaymentModal.js
import React from 'react';

const PaymentModal = ({ amount, currency }) => {
  const handlePayment = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });

      const order = await response.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Organic Store',
        description: 'Purchase Products',
        order_id: order.id,
        handler: (response) => {
          alert('Payment Successful!');
          console.log(response);
        },
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
          contact: '9999999999',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default PaymentModal;