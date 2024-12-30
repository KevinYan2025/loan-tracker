import React, { useState, useEffect } from 'react';
import apiClient from '../configs/axiosConfig';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

interface LoanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ open, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    role: 'lender', // Default value
    title: '',
    description: '',
    initialAmount: '',
    remainingAmount: '',
    interestRate: '',
    termCount: '',
    termPayment: '',
    counterparty: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateMonthlyPayment = (principal: number, annualInterestRate: number, numberOfPayments: number) => {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    return (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
  };

  useEffect(() => {
    const { remainingAmount, interestRate, termCount } = formData;
    if (remainingAmount && interestRate && termCount) {
      const monthlyPayment = calculateMonthlyPayment(
        parseFloat(remainingAmount),
        parseFloat(interestRate),
        parseInt(termCount)
      );
      setFormData((prevData) => ({
        ...prevData,
        termPayment: monthlyPayment.toFixed(2),
      }));
    }
  }, [formData.initialAmount, formData.interestRate, formData.termCount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/loans', formData);
      console.log('Loan created:', response.data);
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Loan</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="loan-form">
          <TextField
            select
            label="You are the"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="lender">Lender</MenuItem>
            <MenuItem value="borrower">Borrower</MenuItem>
          </TextField>
          <TextField
            label="Loan Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Loan Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Initial Loan Amount"
            name="initialAmount"
            value={formData.initialAmount}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
          />
          <TextField
            label="Remaining Loan Amount"
            name="remainingAmount"
            value={formData.remainingAmount}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
          />
          <TextField
            label="Interest Rate (%)"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            type="number"
            inputProps={{ step: "0.01" }}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Number of Terms (months)"
            name="termCount"
            value={formData.termCount}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Estimated Monthly Payment"
            name="termPayment"
            value={formData.termPayment}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
            disabled
          />
          <TextField
            label="Counterparty Name"
            name="counterparty"
            value={formData.counterparty}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create Loan
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoanForm;