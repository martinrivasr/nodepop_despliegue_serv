import createError from 'http-errors'
import { Product } from '../models/index.js'

export async function indexNew(req, res, next) {
  res.render('products/new')
}

export async function postNew(req, res, next) {
  try {
    const userId = req.session.userId
    const productData = req.body

    // creamos una instancia de producto en memoria
    const product = new Product(productData)
    product.owner = userId
    product.tags = product.tags?.filter(tag => !!tag) // filter blank tags
    product.image = req.file?.filename
    console.log("este es el producto a grabar:", product)
    // la persistimos en la BD
    const savedProduct = await product.save()

    res.redirect('/');
  } catch (error) {
    console.log("este es el error ", error)
    next(error)
  }
}

export async function deleteOne(req, res, next) {
  try {
    const userId = req.session.userId
    const productId = req.params.productId

    // validar que el producto que queremos borrar es propiedad del usuario!!!!
    const product = await Product.findOne({ _id: productId })

    // verificar que existe
    if (!product) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto inexistente (${productId})`)
      return next(createError(404, 'Not found'))
    }

    // product.owner viene de la base de datos y es un ObjectId
    if (product.owner.toString() !== userId) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto (${productId}) propiedad de otro usuario (${product.owner})`)
      return next(createError(401, 'No autorizado'))
    }

    await Product.deleteOne({ _id: productId })

    res.redirect('/')

  } catch (error) {
    next(error)
  }
}

export async function indexUpdate(req, res, next) {
  const productId = req.params.productId

  const userId = req.session.userId

  const defaultTags = ['motor', 'lifestyle', 'mobile', 'work']
  const [dbTags, product] = await Promise.all([
    Product.distinct('tags'),
    Product.findOne({
      _id: productId,
      owner: userId // validar owner!!
    })
  ])
  // unify default tags and user created tags
  const tags = [...new Set([...defaultTags, ...dbTags.map(t => t.toLowerCase())])].sort()

  res.render('products/update', { product, tags })
}

export async function postUpdate(req, res, next) {
  try {
    const userId = req.session.userId
    const productId = req.params.productId
    const productData = req.body
    productData.image = req.file?.filename

    const updatedProduct = await Product.findOneAndUpdate({
        _id: productId,
        owner: userId // validar que el producto que queremos actualizar es propiedad del usuario!!!!
      },
      productData
    )

    res.redirect('/')
  } catch (error) {
    next(error)
  }
}
