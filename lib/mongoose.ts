import mongoose from "mongoose";

const mongoConnectionUri = process.env.MONGO_CONNECTION_URI ?? "";

const connectDb = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(mongoConnectionUri);
};

export default connectDb;
