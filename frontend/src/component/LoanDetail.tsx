import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
} from "@mui/material";

const LoanDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(location.state?.loan || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [payments, setPayments] = useState<any[]>([]); // To store payment history
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentSuccess = () => {
    fetchPayments(); // Refresh the payment history after a successful payment
  };

  const fetchPayments = async () => {
    try {
      const response = await apiClient.get(`/payments/${loan.id}`);
      console.log(response.data);
      
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to load payment history.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!loan) {
          const loanResponse = await apiClient.get(`/api/loans/${id}`);
          setLoan(loanResponse.data);
        }

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
  }, [id, loan]);

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
          <Typography variant="body1" gutterBottom>
            <strong>Initial Amount:</strong> ${loan.initialAmount.toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Remaining Amount:</strong> ${loan.remainingAmount.toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Interest Rate:</strong> {loan.interestRate}%
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Term Count:</strong> {loan.termCount} months
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Term Payment:</strong> ${loan.termPayment.toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Counterparty:</strong> {loan.counterparty}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Role:</strong> {loan.role}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Created At:</strong> {new Date(loan.createdAt).toLocaleString()}
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
                  secondary={`Principal: $${payment.principal.toLocaleString()}, Interest: $${payment.interest.toLocaleString()}, Date: ${new Date(payment.paymentDate).toLocaleString()}`}
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
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 4 }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default LoanDetail;
