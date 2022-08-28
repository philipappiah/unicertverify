import { Document, Schema, model, Types } from 'mongoose';

export interface Notification extends Document {
    message:string;
    notificationtype:String;
    from:String;
    to:String;
    hasRead:Boolean;
    isActive: Boolean;
}



const notificationSchema = new Schema<Notification>({

    message: {
        type: String,
        required:[true, "message is required"]
      },

      notificationtype:{
        type:String
      },
      
    from:{
        type:String
      },
      to:{
        type:String,

      },
      hasRead:{
        type:Boolean,
        default:false
      },

    
      isActive: {
       type: Boolean,
      default: true,
      select: false
     }

 
},{ timestamps: true })


  
notificationSchema.virtual('id').get(function(){
    return this._id.toHexString();
  });
  
  
  
  notificationSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   
      delete ret._id 
     }
  });
  






export const NotificationModel = model<Notification>("Notification", notificationSchema);