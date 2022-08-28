import { CatchExpressError } from "../utils/errorHandlers";
import { ResponseHandlers } from "../utils/responseHandler";
import { Response, Request, NextFunction } from 'express'
import { TransactionModel } from "../models/transaction.model";

class UserController {


    createTransaction = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const document = await TransactionModel.create(req.body)

        res.status(201).send({
            transaction:document
        })


    })

    getTransaction = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const documents = new ResponseHandlers(TransactionModel.find(), req.query).filter().sort().limitFields().paginate()
        const data = await documents.model

        res.status(200).send(data)

    })


    getTransactions = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const document = await TransactionModel.findById(req.params.id)

        if (!document) {
            return (res.status(404).send({
                status: 'fail',
                message: 'No document found!'

            }))

        }

        res.status(200).send(document)

    })

}


export default UserController