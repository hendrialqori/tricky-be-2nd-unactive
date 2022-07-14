import { DataTypes } from 'sequelize'
import { Blogs } from "../configs/index.js";

export const Users = Blogs.define("users", {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    email : {
        type : DataTypes.STRING({ length: 50 })
    },
    password : {
        type : DataTypes.TEXT
    },
    role : {
        type : DataTypes.STRING()
    },
    refreshToken : {
        type : DataTypes.TEXT,
        allowNull : true
    } 
})

Users.sync({ alter:true })

