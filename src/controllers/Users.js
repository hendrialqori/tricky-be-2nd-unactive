import { config } from "dotenv"
import { Users } from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

config()

export const UserList = async (req, res) => {
    const users = await Users.findAll()
    res.send(users)
}

export const Register = async(req, res) => {
    try {
        const { email, password  } = req.body
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)

        await Users.create({
            email : email,
            password : hashPassword,
            role : "Superuser"
        })
        res.json({
            message : `${email} has been created`
        })


     } catch (error) {
        res.json({
            message : `Error => ${error.message}`
        })
    }
}


export const Login = async(req, res) => {

    const { email, password  } = req.body

    try {
        const findUser = await Users.findAll({
            where : {
                email : req.body.email
            }
        })
        const matchPassword = await bcrypt.compare(password, findUser[0]?.password)
        if(!matchPassword) return res.status(403).json({ msg : "Password salah" })

        const userID = findUser[0].id
        const userEmail = findUser[0].email
        const userRole = findUser[0].role
        const accessToken = jwt.sign({ userID, userEmail, userRole }, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : "60s"
        })
        const refreshToken = jwt.sign({ userID, userEmail, userRole }, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn : "1d"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            sameSite : "none",
            secure : process.env.NODE_ENV == 'production',
            maxAge : 24 * 60 * 60 * 1000,
        })

        await Users.update({
            refreshToken : refreshToken
        }, { where : { id : userID } })

        res.json({ accessToken })

    } catch (error) {
        res.status(404).json({
            message : "Email tidak terdaftar"
        })
    }
}


export const Logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.sendStatus(204)

        const findUser = await Users.findAll({ where : {
            refreshToken : refreshToken
        }}) 

        if(!findUser[0]) return res.sendStatus(204)

        await Users.update({ refreshToken : "" },{
            where : {
                id : findUser[0].id
            }
        })

        res.clearCookie("refreshToken")
        res.sendStatus(200)

    } catch (error) {
        res.json({
            message : error?.message
        })
    }
}



