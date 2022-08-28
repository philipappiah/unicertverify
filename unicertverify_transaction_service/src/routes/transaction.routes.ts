import { Router} from 'express'
import TransactionController from '../controllers/transaction.controller'



const router = Router()
const transactionController = new TransactionController()


router
  .route('/')
  .post(transactionController.createTransaction)

router
  .route('/')
  .get(transactionController.getTransactions)

router
  .route('/:id')
  .get(transactionController.getTransaction)

export default router
