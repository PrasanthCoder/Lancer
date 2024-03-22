import mongoose, { Types} from "mongoose";
import User, { Users} from "./User";

export interface Profiles extends mongoose.Document {
  user: Types.ObjectId | Users;
  rating: Number;
  profilepic: string;
  location: string;
  availability_status: string;
  acc_date: Date;
  description: Text;
  languages: string[];
}

/* ProfileSchema will correspond to a collection in your MongoDB database. */
const ProfileSchema = new mongoose.Schema<Profiles>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "used id is manditory"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  profilepic: {
    data: Buffer, // Storing image data as a Buffer
    contentType: String // Storing content type (e.g., 'image/jpeg', 'image/png')
  },

  location: {
    /* Url to pet image */

    required: [true, "Please provide an image url for this pet."],
    type: String,
  },
  availability_status: {
    type: String,
  },
  acc_date: {
    type: Date,
  },
  description: {
    type: Text,
  },
  languages: {
    type: [String],
  }
});

export default mongoose.models.Profile || mongoose.model<Profiles>("Profile", ProfileSchema);