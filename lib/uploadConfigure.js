import multer from 'multer'
import path from 'node:path'
import { __dirname } from './utils.js'

// declaro una configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    const ruta = path.join(__dirname, '..', 'public', 'images', 'products');
    callback(null, ruta);
  },
  filename: function(req, file, callback) {
    const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
})

// declaro una configuración de upload
const upload = multer({ storage });

export default upload;