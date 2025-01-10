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
    accruedInterest: number | 0;
    lastPaymentDate: string | null;
    lender: string;
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
    navigate(`/loans/${loan.id}`);
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
  Total Amount: ${+loan.remainingAmount + +loan.accruedInterest}
</Typography>
        <Typography variant="body1">
          Remaining Principal: ${loan.remainingAmount}
        </Typography>
        <Typography variant="body1">
          Remaining Interest: ${loan.accruedInterest}
        </Typography>
        <Typography variant="body1">
          Interest Rate: {loan.interestRate}%
        </Typography>
        <Typography variant="body1">
          Lender Name: {loan.lender}
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
