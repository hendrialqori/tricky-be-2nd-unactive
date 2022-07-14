import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const authHeaders = req.headers["authorization"]
    const Token = authHeaders?.split(" ")[1]
    if(Token === null) res.sendStatus(401)

    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if(err) res.sendStatus(403)

        next()
    })
} 