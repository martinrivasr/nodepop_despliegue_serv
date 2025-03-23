import mongoose, { Schema } from 'mongoose';

// definir el esquema de los productos
const productSchema = new Schema({
  name: { type: String, index: true },
  owner: { ref: 'User', type: Schema.Types.ObjectId, index: true },
  price: { type: Number, index: true },
  image: String,
  tags: { type: [String], index: true },
});

// método estático: método que está en el modelo (p.e. Product.list())
productSchema.statics.list = function(filter, skip, limit, sort, fields) {
  const query = Product.find(filter); // devuelve un objeto de tipo query que es un thenable
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec();
}

// método de instancia: método que tienen las instancias (p.e. product.saluda())
productSchema.methods.saluda = function() {
  console.log('Hola, soy  ' + this.name);
}

// crear el modelo
const Product = mongoose.model('Product', productSchema);

// exportar modelo (opcional)
export default Product;
