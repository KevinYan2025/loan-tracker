import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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
  }
}

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
}));

const Loan: React.FC<LoanProps> = ({ loan }) => {
    const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/loans/${loan.id}`,{state: { loan }});
  }
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="div">
          {loan.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loan.description}
        </Typography>
        <Typography variant="body1">
          Initial Amount: ${loan.initialAmount}
        </Typography>
        <Typography variant="body1">
          Remaining Amount: ${loan.remainingAmount}
        </Typography>
        <Typography variant="body1">
          Interest Rate: {loan.interestRate}%
        </Typography>
        <Typography variant="body1">
          Term Count: {loan.termCount}
        </Typography>
        <Typography variant="body1">
          Term Payment: ${loan.termPayment}
        </Typography>
        <Typography variant="body1">
          Counterparty: {loan.counterparty}
        </Typography>
        <Typography variant="body1">
          Role: {loan.role}
        </Typography>
        <Typography variant="body1">
          Created At: {new Date(loan.createdAt).toLocaleString()}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewDetails}
          style={{ marginTop: '16px' }}
        >
          View Details
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default Loan;
