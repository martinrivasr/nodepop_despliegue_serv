import 'dotenv/config'; // alternative: node -r dotenv/config initDB.js

import readline from 'node:readline';
import connectMongoose from './lib/connectMongoose.js';
import { User, Product } from './models/index.js';

/**
 * Main
 */

// espero a que se conecte a la base de datos
console.log('Connecting to MongoDB...')
const { connection: mongooseConnection } = await connectMongoose()
console.log('Connected to MongoDB:', mongooseConnection.name)

const initQuestionResponse = await ask(
  'Estas seguro de que quieres borrar la base de datos y cargar datos iniciales? '
)
if (initQuestionResponse?.toLowerCase() !== 'si') {
  process.exit();
}

await initUsers();
await initProducts();
mongooseConnection.close();

/**
 * Functions
 */

async function initUsers() {
  // eliminar
  const deleted = await User.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // crear
  const inserted = await User.insertMany([
    { name: 'admin', email: 'admin@example.com', password: await User.hashPassword('1234')},
    { name: 'user1', email: 'user1@example.com', password: await User.hashPassword('1234')},
  ]);
  console.log(`Creados ${inserted.length} usuarios.`)
}

async function initProducts() {
  // borrar todos los documentos de la colección de agentes
  const deleted = await Product.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} productos.`);

  const [ userAdmin, user1 ] = await Promise.all([
    User.findOne({ email: 'admin@example.com'}),
    User.findOne({ email: 'user1@example.com' })
  ])

  // crear productos iniciales
  const inserted = await Product.insertMany([
    { name: 'Bicicleta',  price: 230.15, image: 'bici.jpg', owner: userAdmin._id, tags: [ 'lifestyle', 'motor'] },
    { name: 'Iphone',     price: 50.00,  image: 'iphone.png', owner: userAdmin._id, tags: [ 'lifestyle', 'mobile'] },
    { name: 'Zapatillas', price: 20.00,  image: 'zapas.jpg', owner: user1._id, tags: [ 'lifestyle'] }
  ]);
  console.log(`Creados ${inserted.length} productos.`);
}

function ask(text) {
  return new Promise((resolve, reject) => {
    // conectar readline con la consola
    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    ifc.question(text, answer => {
      ifc.close();
      resolve(answer);
    })
  });
}