import jwt from 'jsonwebtoken'
import { Users } from '../models/users.js';

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.status(404).json({
            message : "Cookie not found"
        })

        const findUser = await Users.findAll({
            where : {
                refreshToken : refreshToken
            }
        })

        if(!findUser[0]) return res.redirect("/api/v1/article")

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) return res.sendStatus(403)

            const userID = findUser[0].id
            const userEmail = findUser[0].email
            const userRole = findUser[0].role

            const refreshToken = jwt.sign({ userID, userEmail, userRole },process.env.ACCESS_TOKEN_SECRET,{
                expiresIn : "15s"
            })

            res.json({ refreshToken })

        })

    } catch (error) {
        res.json({ 
            message : error.message
         })
    }
}