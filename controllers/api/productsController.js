import createError from 'http-errors'
import { Product } from '../../models/index.js'

/**
 * API Products Controller
 */

/**
 * @openapi
 * /api/products:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    description: |
 *      Return list of products
 *      <br />
 *      <b>Examples:</b>
 *      pagination:      http://127.0.0.1:3000/api/products?skip=2&limit=2
 *      sorting:         http://127.0.0.1:3000/api/products?sort=-price%20name
 *      field selection: http://127.0.0.1:3000/api/products?fields=price%20-_id
 *    parameters:
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Returns JSON
 */
export async function apiProductList(req, res, next) {
  const userId = req.apiUserId;
  const skip = parseInt(req.query.skip) || 0
  const limit = parseInt(req.query.limit) || 1000 // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id'
  const fields = req.query.fields
  const filter = { owner: userId }

  if (typeof req.query.tag !== 'undefined') {
    filter.tags = req.query.tag
  }

  if (typeof req.query.price !== 'undefined' && req.query.price !== '-') {
    if (req.query.price.indexOf('-') !== -1) {
      filter.price = {}
      let range = req.query.price.split('-')
      if (range[0] !== '') {
        filter.price.$gte = range[0]
      }

      if (range[1] !== '') {
        filter.price.$lte = range[1]
      }
    } else {
      filter.price = req.query.price
    }
  }

  if (typeof req.query.name !== 'undefined') {
    filter.name = new RegExp('^' + req.query.name, 'i')
  }

  const products = await Product.list(filter, skip, limit, sort, fields)
  res.json({ results: products })
}

export async function apiProductGetOne(req, res, next) {
  try {
    const userId = req.apiUserId
    const productId = req.params.productId

    const product = await Product.findOne({ _id: productId, owner: userId })

    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}

export async function apiProductNew(req, res, next) {
  try {
    const userId = req.apiUserId
    const productData = req.body

    // creamos una instancia de producto en memoria
    const product = new Product(productData)
    product.owner = userId
    product.tags = product.tags?.filter(tag => !!tag).map(t => t.toLowerCase()) // filter blank tags
    product.image = req.file?.filename

    // la persistimos en la BD
    const savedProduct = await product.save()

    res.status(201).json({ result: savedProduct })
  } catch (error) {
    next(error)
  }
}

export async function apiProductDelete(req, res, next) {
  try {
    const userId = req.apiUserId
    const productId = req.params.productId

    // validar que el producto que queremos borrar es propiedad del usuario!!!!
    const product = await Product.findOne({ _id: productId })

    // verificar que existe
    if (!product) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto inexistente (${productId})`)
      return next(createError(404))
    }

    // product.owner viene de la base de datos y es un ObjectId
    if (product.owner.toString() !== userId) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto (${productId}) propiedad de otro usuario (${product.owner})`)
      return next(createError(401))
    }

    await Product.deleteOne({ _id: productId })

    res.status(200).json()

  } catch (error) {
    next(error)
  }
}

export async function apiProductUpdate(req, res, next) {
  try {
    const userId = req.apiUserId
    const productId = req.params.productId
    const productData = req.body
    productData.image = req.file?.filename
    productData.tags = productData.tags?.filter(tag => !!tag).map(t => t.toLowerCase()) // filter blank tags

    // validar que el producto que queremos actualizar es propiedad del usuario!!!!
    const updatedProduct = await Product.findOneAndUpdate({
        _id: productId,
        owner: userId
      },
      productData,
      { new: true }
    )

    res.status(200).json({ result: updatedProduct })
  } catch (error) {
    next(error)
  }
}
