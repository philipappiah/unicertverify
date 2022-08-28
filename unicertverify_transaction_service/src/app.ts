import express, {Response, Request} from 'express'
import transactionRoutes from './routes/transaction.routes'
import notificationRoutes from './routes/notification.routes'


import {swaggerDocs} from './swagger'

const cors = require('cors');
const cookieParser = require('cookie-parser')
const swaggerUI = require('swagger-ui-express')
const swaggerJsdoc = require("swagger-jsdoc")

const app = express()

app.use(express.json())
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig))
app.use(cookieParser())

const specs = swaggerJsdoc(swaggerDocs);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))



app.use('/api/v1/transactions', transactionRoutes)  
app.use('/api/v1/notifications', notificationRoutes)  


app.get("/", (req:Request, res:Response) => res.json({message: `UnicertVerify transaction service API V1. Visit 'http://localhost:4000/api-docs' to view open api docs and endpoints`}));

export default app;