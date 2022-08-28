import { Router} from 'express'
import NotificationController from '../controllers/notification.controller'



const router = Router()
const notificationController = new NotificationController()


router
  .route('/')
  .post(notificationController.createNotification)

router
  .route('/')
  .get(notificationController.getNotifications)

router
  .route('/:id')
  .get(notificationController.getNotification)

export default router
