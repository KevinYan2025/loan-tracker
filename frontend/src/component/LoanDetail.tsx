import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import apiClient from "../configs/axiosConfig";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
interface Loan {
  id: string;
  title: string;
  description: string;
  initialAmount: number;
  remainingAmount: number;
  interestRate: number;
  accruedInterest: number;
  lastPaymentDate: string | null;
  lender: string;
  createdAt: string; // ISO format date string
}

const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [payments, setPayments] = useState<any[]>([]); // To store payment history
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");


  const deleteLoan = async () => {
    try {
      setLoading(true);
      // Placeholder for the delete API call
      await apiClient.delete(`/loans/${id}`);
      navigate("/"); // Navigate back to the home page after successful deletion
    } catch (error) {
      console.error("Error deleting loan:", error);
      alert("Failed to delete the loan.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await apiClient.get(`/payments/${id}`);
      (response.data);
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to load payment history.");
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      fetchPayments();
      const loanResponse = await apiClient.get(`/loans/${id}`);
      setLoan(loanResponse.data);
    } catch (error) {
      
    } finally{
      setLoading(false);  
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
          const loanResponse = await apiClient.get(`/loans/${id}`);
          
          setLoan(loanResponse.data);

        const fileResponse = await apiClient.get(`/loans/s3/${id}`);
        if (fileResponse.status === 404) {
          setUrls([]);
        } else {
          const fileUrls = fileResponse.data.map((item: any) => item.url);
          setUrls(fileUrls);
        }

        await fetchPayments(); // Fetch payment history
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderFile = (url: string, index: number) => {
    const fileType = url.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(fileType || "")) {
      return (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <img
            src={url}
            alt={`File ${index + 1}`}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </Box>
      );
    } else if (fileType === "pdf") {
      return (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <iframe
            src={url}
            title={`File ${index + 1}`}
            style={{
              width: "100%",
              height: "500px",
              border: "none",
            }}
          />
        </Box>
      );
    } else {
      return (
        <Typography key={index} variant="body1">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View or Download File {index + 1}
          </a>
        </Typography>
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!loan) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert severity="info">Loan details are unavailable.</Alert>
      </Box>
    );
  }


  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 600, width: "100%", marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Loan Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Title:</strong> {loan.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Description:</strong> {loan.description}
          </Typography>
                  <Typography variant="body1">
            Total Amount: ${+loan.remainingAmount + +loan.accruedInterest}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Remaining Principal:</strong> ${loan.remainingAmount.toLocaleString()}
          </Typography>
                  <Typography variant="body1">
                    Remaining Interest: ${loan.accruedInterest}
                  </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Interest Rate:</strong> {loan.interestRate}%
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Lender:</strong> {loan.lender}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Initial Amount:</strong> ${loan.initialAmount.toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Created At:</strong> {new Date(loan.createdAt).toISOString()}
          </Typography>
        </CardContent>
      </Card>

      {urls.length > 0 ? (
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Typography variant="h5" gutterBottom>
            Attached Files
          </Typography>
          <Box>
            {urls.map((url, index) => renderFile(url, index))}
          </Box>
        </Box>
      ) : (
        <Typography variant="body1">No files attached.</Typography>
      )}

      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Payment History
      </Typography>
      {payments.length > 0 ? (
        <List sx={{ width: "100%", maxWidth: 600 }}>
          {payments.map((payment, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={`Payment of $${payment.amount.toLocaleString()}`}
                  secondary={`Principal Paid: $${payment.principal.toLocaleString()}, Interest Paid: $${payment.interest.toLocaleString()}, Remaining Loan Amount: $${payment.outstanding}, Date: ${new Date(payment.createdAt).toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No payment history available.
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 4 }}
        onClick={() => setIsPaymentModalOpen(true)}
      >
        Make a Payment
      </Button>

      <PaymentModal
        loan={loan}
        handlePaymentSuccess={handlePaymentSuccess}
        open={isPaymentModalOpen}
        onClose={() => {setIsPaymentModalOpen(false)}}
      />
      <Button
        variant="contained"
        color="error"
        sx={{ marginTop: 4 }}
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        Delete Loan
      </Button>

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 4 }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this loan? This action is
            irreversible and will permanently delete all associated files and
            data. To confirm, please type <strong>CONFIRM</strong> in the box
            below.
          </DialogContentText>
          <TextField
            label="Type CONFIRM to delete"
            fullWidth
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteLoan}
            color="error"
            disabled={loading || confirmationText !== "CONFIRM"}
            autoFocus
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanDetail;
