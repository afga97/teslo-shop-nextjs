import mongoose, { model, Model, Schema } from 'mongoose';
import { IOrder } from '../interfaces';

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    _id      : { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title    : { type: String, required: true },
    size     : { type: String, required: true },
    quantity : { type: Number, required: true },
    slug     : { type: String, required: true },
    image    : { type: String, required: true },
    price    : { type: Number, required: true },
  }],
  shippingAddress: {
    address2  : { type: String, required: false },
    city      : { type: String, required: true},
    country   : { type: String, required: true},
    firstName : { type: String, required: true},
    address   : { type: String, required: true},
    lastName  : { type: String, required: true},
    phone     : { type: String, required: true},
    zip       : { type: String, required: true},
    // gender    : { type: String, required: true},
  },
  numberOfItems : { type: Number, required: true },
  subTotal      : { type: Number, required: true },
  tax           : { type: Number, required: true },
  total         : { type: Number, required: true },
  isPaid        : { type: Boolean, required: true },
  paidAt        : { type: String},

  transactionId: { type: String },
}, {
  timestamps: true
})

const OrderModel: Model<IOrder> = mongoose.models.Order || model('Order', OrderSchema)

export default OrderModel