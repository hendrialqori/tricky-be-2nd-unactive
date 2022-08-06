import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()
const DB = process.env
export const Blogs =  new Sequelize(`${process.env.DATABASE_URI}`)

                    // new Sequelize(`postgres://${DB.DB_USER}:${DB.DB_PASSWORD}@${DB.DB_HOST}:${DB.DB_PORT}/${DB.DB_NAME}`) :

export const dbAuthenticate = async () => {
    try {
        await Blogs.authenticate()
        console.log("Database connected ...")
    } catch (error) {
        console.log("Error =>", error)
    }
}