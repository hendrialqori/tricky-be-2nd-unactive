import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const authHeaders = req.headers.authorization
    const Token = authHeaders?.split(" ")[1]
    console.log("Token =>",Token)
    if(Token === null || undefined ) return res.sendStatus(401)

    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if(err) return res.status(403)
        next();
    })
} 