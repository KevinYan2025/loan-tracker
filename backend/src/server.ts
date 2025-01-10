import express from 'express'
import cors from 'cors'
import userRoute from './routes/user'
import loanRoute from './routes/loan'
import paymentRoute from './routes/payment'
import updateLoanAccruedInterest from './utils/Loan-interest-cron'
import path from 'path'
const app = express()
const PORT: any = process.env.PORT || 8080
const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));
app.use(cors())
app.use(express.json())
updateLoanAccruedInterest.start();
app.use('/api/users',userRoute)
app.use('/api/loans',loanRoute)
app.use('/api/payments',paymentRoute)
// Fallback Route for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });