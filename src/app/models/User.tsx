import { model, models, Schema } from "mongoose";

export interface User extends Document {
  id: string;
  email: string;
  name?: string;
  points?: number;
  achievements?: string[];
}

const UserSchema = new Schema<User>({
  id: { type: String, required: true, unique: true }, // Clerk's User ID
  email: { type: String, required: true, unique: true },
  name: String,
  points: { type: Number, default: 0 },
  achievements: { type: [String], default: [] },
});

const UserModel = models.User || model<User>("User", UserSchema);

export default UserModel;
