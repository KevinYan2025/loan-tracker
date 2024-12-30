import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import LoanForm from "../component/LoanForm";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import apiClient from "../configs/axiosConfig";
import Loan from "../component/Loan";

const Home: React.FC = () => {
  const authContext = useAuth();
  const [loans, setLoans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmitSuccess = () => {
    alert('Loan created successfully!');
    fetchLoans();
    setIsModalOpen(false);
  };

  const fetchLoans = async () => {
    try {
      const response = await apiClient.get('/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Home
      </Typography>
      <Button variant="contained" color="primary" onClick={authContext.handleLogout}>
        Logout
      </Button>
      <Button variant="contained" color="secondary" onClick={handleOpenModal} style={{ marginLeft: '10px' }}>
        Create Loan
      </Button>
      <LoanForm open={isModalOpen} onClose={handleCloseModal} onSubmitSuccess={handleFormSubmitSuccess} />
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {loans && loans.map((loan: any) => (
          <Grid item xs={12} sm={6} md={4} key={loan.id}>
            <Loan loan={loan} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;