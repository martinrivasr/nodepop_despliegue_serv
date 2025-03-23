import express from 'express'
import logger from 'morgan'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import connectMongoose from './lib/connectMongoose.js'
import * as sessionManager from './lib/sessionManager.js'
import * as jwtAuth from './lib/jwtAuthMiddleware.js'
import swaggerMiddleware from './lib/swaggerMiddleware.js'
import {
  homeController,
  loginController,
  productsController,
  langController
} from './controllers/index.js'
import {
  apiLoginController,
  apiProductsController,
} from './controllers/api/index.js'
import upload from './lib/uploadConfigure.js'
import i18n from './lib/i18nSetup.js'

// espero a que se conecte a la base de datos
console.log('Connecting to DB...')
const { connection: mongooseConnection } = await connectMongoose()
console.log('Conectado a MongoDB en', mongooseConnection.name)

const app = express()

// view engine setup
app.set('views', 'views')
app.set('view engine', 'ejs')

app.locals.siteTitle = 'NodePop'

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))

/**
 * API Routes
 */
app.post('/api/login', apiLoginController.postAPILogin)
app.get( '/api/products', jwtAuth.guard, apiProductsController.apiProductList)
app.get( '/api/products/:productId', jwtAuth.guard, apiProductsController.apiProductGetOne)
app.post('/api/products',
  jwtAuth.guard,
  upload.single('image'),
  apiProductsController.apiProductNew
)
app.delete('/api/products/:productId', jwtAuth.guard, apiProductsController.apiProductDelete)
app.put('/api/products/:productId',
  jwtAuth.guard,
  upload.single('image'),
  apiProductsController.apiProductUpdate
)


/**
 * Website routes
 */
app.use(sessionManager.middleware, sessionManager.useSessionInViews)
app.use(i18n.init)
app.get('/change-locale/:locale', langController.changeLocale);

app.get('/', homeController.index)
// session
app.get('/login', loginController.indexLogin)
app.post('/login', loginController.postLogin)
app.all('/logout', loginController.logout)
{ // products
  const productsRouter = express.Router()
  // productsRouter.use(session.guard) -- optional
  productsRouter.get('/new', productsController.indexNew)
  productsRouter.post('/new', upload.single('image'), productsController.postNew)
  productsRouter.get('/delete/:productId', productsController.deleteOne)
  productsRouter.get('/update/:productId', productsController.indexUpdate)
  productsRouter.post('/update/:productId', upload.single('image'), productsController.postUpdate)
  app.use('/products', sessionManager.guard, productsRouter)
}
app.use('/api-doc', sessionManager.guard, swaggerMiddleware);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)

  // API error, send with JSON format
  if (req.originalUrl.startsWith('/api/')) {
    return res.json({ error: err.message })
  }

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.render('error')
})

export default app
