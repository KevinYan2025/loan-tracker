import express from 'express'
import cors from 'cors'
import userRoute from './routes/user'
import loanRoute from './routes/loan'
import paymentRoute from './routes/payment'
const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())
app.use('/users',userRoute)
app.use('/loans',loanRoute)
app.use('/payments',paymentRoute)
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})