import session from 'express-session'
import MongoStore from 'connect-mongo'

// expiración de la sesión por inactividad
const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2

// middleware para gestionar sesiones
export const middleware = session({
  name: 'nodepop-session', // nombre de la cookie
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  // las sesiones se guardan en MongoDB
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI})
})

export function useSessionInViews(req, res, next) {
  res.locals.session = req.session
  next()
}

// hacemos que el objeto session esté disponible al renderizar las vistas
export function guard(req, res, next) {
  // si el cliente que hace la petición, no tiene en su sesión la variable userId
  // le redirigimos al login porque no le conocemos
  // y añadimos en la query string la página a donde quiere acceder
  if (!req.session.userId) {
    res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`)
    return
  }
  next()
}