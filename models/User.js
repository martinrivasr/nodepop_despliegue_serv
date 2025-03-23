import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// creamos esquema
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true},
  password: String
});

// método estático: hace un hash de una password
userSchema.statics.hashPassword = function(clearPassword) {
  return bcrypt.hash(clearPassword, 7);
}

// método de instancia: comprueba la password de un usuario
userSchema.methods.comparePassword = function(clearPassword) {
  return bcrypt.compare(clearPassword, this.password)
}

// creamos el modelo
const User = mongoose.model('User', userSchema);

// exportar modelo (opcional)
export default User;
