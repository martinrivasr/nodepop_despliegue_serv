import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import { User } from '../../models/index.js'

/**
 * @openapi
 * /api/login:
 *  post:
 *    description: |
 *      Return a JWT token.
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: Returns JSON Web Token
 */
export async function postAPILogin(req, res, next) {
  try {
    const { email, password } = req.body

    // buscar el usuario en la BD
    const user = await User.findOne({ email: email })

    // si no lo encuentro o no coincide la contraseña --> error
    if (!user || !(await user.comparePassword(password))) {
      return next(createError(401, 'invalid credentials'))
    }

    // si lo encuentro y la contraseña está bien --> emitir un JWT
    const tokenJWT = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    })

    res.json({ tokenJWT: tokenJWT })

  } catch (error) {
    next(error)
  }
}