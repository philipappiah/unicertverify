import { Document, Schema, model } from 'mongoose';

export interface Transaction extends Document {
    txType:string;
    from:String;
    to:String;
    gasPrice:Number;
    txHash:String;
    isConfirmed:Boolean;
}



const transactionSchema = new Schema<Transaction>({

    txType: {
        type: String,
        required:[true, "Transaction name is required"]
      },

      from:{
        type:String
      },
      to:{
        type:String,

      },
      
    gasPrice:{
        type:Number
      },
      txHash:{
        type:String
      },
      
      isConfirmed:{
        type:Boolean,
        default:false
      }
 
},{ timestamps: true })


  
transactionSchema.virtual('id').get(function(){
    return this._id.toHexString();
  });
  
  
  
  transactionSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   
      delete ret._id 
     }
  });
  
export const TransactionModel = model<Transaction>("Transaction", transactionSchema);