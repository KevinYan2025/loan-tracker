import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../configs/axiosConfig';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const resetForm = () => {
    setFormData({
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
    setFiles([]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files; // Get selected files

    if (newFiles) {
      // Combine current and new files
      const totalFiles = [...files, ...Array.from(newFiles)];

      if (totalFiles.length > 3) {
        fileInputRef.current!.value = ''; // Clear the file input
        alert('You can only upload up to 3 files.');

        return;
      }

      setFiles(totalFiles); // Update the state with the new files
    }
  };

  const calculateMonthlyPayment = (
    principal: number,
    annualInterestRate: number,
    numberOfPayments: number
  ) => {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    return (principal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
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
  }, [formData.remainingAmount, formData.interestRate, formData.termCount]);

  const handleRemoveFile = (fileName: string) => {
    const upadtedFiles = files.filter((file) => file.name !== fileName);
    setFiles(upadtedFiles);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    // Append other form data
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
  
    // Append all files under the 'files' field
    files.forEach((file) => {
      formDataToSend.append('files', file);
    });
  
    try {
      const response = await apiClient.post('/loans', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Loan created:', response.data);
      onSubmitSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => {
      resetForm(); // Clear form data and files when dialog closes
      onClose();
    }} fullWidth maxWidth="sm">
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
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              readOnly: true,
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
          <input
            ref={fileInputRef}
            type="file"
            name='files'
            accept=".png,.pdf,.jpeg"
            onChange={handleFileChange}
            multiple
          />
          {files.length > 0 && (
            <div>
              <Typography variant="body2" color="text.secondary">
                Uploaded files:
              </Typography>
              <ul>
                {files.map((file) => (
                  <li key={file.name} style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" style={{ flexGrow: 1 }}>
                      {file.name}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveFile(file.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
