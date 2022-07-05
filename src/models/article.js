import { DataTypes } from 'sequelize'
import { Blogs } from "../configs/index.js";

export const Articles = Blogs.define("articles", {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    title : {
        type : DataTypes.STRING({ length : 100 }),
        allowNull : false
    },
    avatar : {
        type : DataTypes.TEXT,
    },
    category : {
        type : DataTypes.STRING({ length: 50 })
    },
    content : {
        type : DataTypes.TEXT
    },
    create : {
        type : DataTypes.TEXT,
        defaultValue : DataTypes.DATE
    },
    timeRead : {
        type  : DataTypes.STRING({ length : 50 })
    },
    loved : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    seen : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    slug : {
        type : DataTypes.TEXT,
        allowNull : false
    }
},{
    timestamps : false
})

Articles.sync({
    alter :  true
})