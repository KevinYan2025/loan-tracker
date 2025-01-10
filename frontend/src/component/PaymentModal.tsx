import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
    accruedInterest: number | 0;
    lastPaymentDate: string | null;
    lender: string;
    createdAt: string; // Assuming createdAt is a string in ISO format
  };
}

interface PaymentModalProps {
  loan: LoanProps["loan"];
  open: boolean;
  handlePaymentSuccess: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  loan,
  open,
  onClose,
  handlePaymentSuccess,
}) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [principal, setPrincipal] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation dialog

  // Update calculations and remaining loan amount when totalAmount changes
  useEffect(() => {
    const calculatePayment = () => {
      if (totalAmount <= loan.accruedInterest) {
        setInterest(totalAmount);
        setPrincipal(0);
      } else {
        setInterest(loan.accruedInterest);
        setPrincipal(totalAmount - loan.accruedInterest);
      }
    };
    calculatePayment();
  }, [totalAmount]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post(`/payments`, {
        loanId: loan.id,
        paymentAmount: totalAmount,
        principal,
        interest,
        note,
      });
      if (response.status === 201) {
        handlePaymentSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    setConfirmOpen(true); // Open the confirmation dialog
  };

  const handleConfirmClose = (confirmed: boolean) => {
    setConfirmOpen(false); // Close the dialog
    if (confirmed) {
      handlePayment(); // Proceed with the payment if confirmed
    }
  };

  return (
    <>
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
            label="Payment Amount"
            type="number"
            fullWidth
            margin="normal"
            value={totalAmount || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = parseFloat(value);

              if (!isNaN(numericValue) && numericValue >= 0) {
                setTotalAmount(numericValue);
              } else if (value === "") {
                setTotalAmount(0);
              }
            }}
            onBlur={() => {
              if (totalAmount < 0 || isNaN(totalAmount)) {
                setTotalAmount(0);
              }
            }}
            error={
              ((loan.remainingAmount - totalAmount) ? (loan.remainingAmount - totalAmount) : loan.remainingAmount) < 0 ||
              totalAmount <= 0
            }
            helperText={
              totalAmount <= 0
                ? "Payment amount must be greater than 0."
                : totalAmount > loan.remainingAmount
                ? "Total amount exceeds remaining loan."
                : ""
            }
          />

          <Typography variant="body2" sx={{ margin: "8px 0" }}>
            <strong>Principal pay:</strong> ${principal}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "8px" }}>
            <strong>Interest pay:</strong> ${interest}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "16px" }}>
            <strong>Remaining Loan Amount:</strong> $
            {+loan.remainingAmount + +loan.accruedInterest - totalAmount}
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmPayment}
              disabled={
                loading ||
                !totalAmount ||
                totalAmount <= 0 ||
                loan.remainingAmount - totalAmount < 0
              }
            >
              {loading ? <CircularProgress size={24} /> : "Submit Payment"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={confirmOpen} onClose={() => handleConfirmClose(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to make this payment? Once submitted, it
            cannot be changed or removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleConfirmClose(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentModal;
