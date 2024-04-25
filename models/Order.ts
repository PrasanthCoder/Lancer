import mongoose, {Types} from "mongoose";
import Gig, {Gigs} from "./Gig";
import User, { Users} from "./User";

export interface Orders extends mongoose.Document {
  gig_ordered: Types.ObjectId | Gigs;
  buyer: Types.ObjectId | Users;
  accepted_date: Date;
  budget: number;
  deadline: Date;
  completed_date: Date;
}

const OrderSchema = new mongoose.Schema<Orders>({
  gig_ordered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: [true, "gig id is manditory"],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "buyer id is manditory"],
  },
  accepted_date: {
    type: Date,
    required: [true, "Please provide accepteed date"],
  },
  budget: {
    type: Number,
    required: [true, "Please provide minimum budget of the gig"],
  },
  deadline: {
    type: Date,
    required: [true, "Please provide deadline"],
  },
  completed_date: {
    type: Date,
  }
});

export default mongoose.models.Order || mongoose.model<Orders>("Order", OrderSchema);
