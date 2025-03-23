import mongoose from 'mongoose';

mongoose.connection.on('error', err => {
  console.log('Error de conexión', err);
});

/**
 * Connect to MongoDB
 * @returns {mongoose} mongoose
 */
export default function connectMongoose() {
  return mongoose.connect(process.env.MONGODB_URI)
}
