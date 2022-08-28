import { CatchExpressError } from "../utils/errorHandlers";
import { ResponseHandlers } from "../utils/responseHandler";
import { Response, Request, NextFunction } from 'express'
import { NotificationModel } from "../models/notification.model";

class UserController {


    createNotification = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const document = await NotificationModel.create(req.body)

        res.status(201).send({
            transaction:document
        })


    })

    getNotification = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const documents = new ResponseHandlers(NotificationModel.find(), req.query).filter().sort().limitFields().paginate()
        const data = await documents.model

        res.status(200).send(data)

    })


    getNotifications = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const document = await NotificationModel.findById(req.params.id)

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