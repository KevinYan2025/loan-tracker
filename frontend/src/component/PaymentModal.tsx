import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import apiClient from "../configs/axiosConfig";

interface LoanProps {
  loan: {
    id: string;
    title: string;
    description: string;
    initialAmount: number;
    remainingAmount: number;
    interestRate: number;
    termCount: number;
    termPayment: number;
    counterparty: string;
    role: string;
    createdAt: string; // Assuming createdAt is a string in ISO format
  };
}

interface PaymentModalProps {
  loan: LoanProps["loan"];
  open: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  loan,
  open,
  onClose,
  onPaymentSuccess,
}) => {
  const [totalAmount, setTotalAmount] = useState<string>("0");
  const [note, setNote] = useState("");
  const [principal, setPrincipal] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to calculate principal and interest
  const calculatePayment = (amount: number) => {
    const interestPaid = amount * (loan.interestRate / 100);
    const principalPaid = amount - interestPaid;

    setInterest(parseFloat(interestPaid.toFixed(2)));
    setPrincipal(parseFloat(principalPaid.toFixed(2)));
  };

  // Update calculations and remaining loan amount when totalAmount changes
  useEffect(() => {
    const parsedAmount = parseFloat(totalAmount);
    if (!isNaN(parsedAmount)) {
      calculatePayment(parsedAmount);
    } else {
      setPrincipal(0);
      setInterest(0);
    }
  }, [totalAmount, loan.remainingAmount]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post(`/payments`, {
        loanId: loan.id,
        paymentAmount: parseFloat(totalAmount),
        principal,
        interest,
        note,
      });
      console.log("Payment response:", response.data);
      const updatedLoan = await apiClient.get(`/loans/${loan.id}`);
      loan = updatedLoan.data;
      if (response.status === 201) {
        onPaymentSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "400px",
          margin: "100px auto",
          background: "white",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Make a Payment for {loan.title}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Total Amount"
          type="number"
          fullWidth
          margin="normal"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          error={(loan.remainingAmount - parseFloat(totalAmount)) < 0}
          helperText={(loan.remainingAmount - parseFloat(totalAmount))  < 0 ? "Total amount exceeds remaining loan." : ""}
        />

        <Typography variant="body2" sx={{ margin: "8px 0" }}>
          <strong>Principal:</strong> ${principal.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: "8px" }}>
          <strong>Interest:</strong> ${interest.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: "16px" }}>
  <strong>Remaining Loan Amount:</strong> $
  {Number.isFinite((loan.remainingAmount - parseFloat(totalAmount)) ) ? (loan.remainingAmount - parseFloat(totalAmount)) .toFixed(2) : "0.00"}
</Typography>

        <TextField
          label="Note"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={loading || !totalAmount || parseFloat(totalAmount) <= 0 || (loan.remainingAmount - parseFloat(totalAmount))  < 0}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Payment"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
