import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface LoanProps {
  loan: {
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

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
}));

const Loan: React.FC<LoanProps> = ({ loan }) => {
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
          Initial Loan Amount: ${loan.initialAmount}
        </Typography>
        <Typography variant="body1">
          Remaining Loan Amount: ${loan.remainingAmount}
        </Typography>
        <Typography variant="body1">
          Interest Rate: {loan.interestRate}%
        </Typography>
        <Typography variant="body1">
          Number of Terms (months): {loan.termCount}
        </Typography>
        <Typography variant="body1">
          Estimated Monthly Payment: ${loan.termPayment}
        </Typography>
        <Typography variant="body1">
          Counterparty Name: {loan.counterparty}
        </Typography>
        <Typography variant="body1">
          Role: {loan.role}
        </Typography>
        <Typography variant="body1">
          Created At: {new Date(loan.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default Loan;