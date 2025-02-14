import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';

const PaymentModal = ({ show, handleClose, handleOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = () => {
    handleOrder(paymentMethod);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Payment Method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="radio"
            label="Card"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={handlePaymentChange}
          />
          <Form.Check
            type="radio"
            label="UPI"
            name="paymentMethod"
            value="upi"
            checked={paymentMethod === 'upi'}
            onChange={handlePaymentChange}
          />
          <Form.Check
            type="radio"
            label="Cash on Delivery (COD)"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={handlePaymentChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;