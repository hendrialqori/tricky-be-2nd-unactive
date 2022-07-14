import { Articles } from "../models/article.js"
import slug from "slug"
import { config } from 'dotenv'
import fs from 'fs/promises'

config()
export const getArticles = async (req, res) => {
    try {
        
        if(req.query.category) {
            const articlesByCategory = await Articles.findAll({
                where : {
                    category : req.query.category
                }
            })
            res.status(200).send(articlesByCategory)
        }else {
            const articles = await Articles.findAll()
            res.status(200).send(articles)
        }

    } catch (error) {
        res.json({
            message : `Error => ${error?.message}`
        })
    }
}


export const getDetailArticle = async (req, res) => {
    try {
        const { slug } = req.params    
        const detailArticle = await Articles.findAll({
            where : {
                slug : slug
            }
        })

        await Articles.update({
            seen : detailArticle[0].seen == 0 ? 1 : detailArticle[0].seen + 1
        },{
            where : {
                slug : slug 
            }
        })

        res.status(200).send(detailArticle)

    } catch (error) {
        res.json({
            message : `Error => ${error?.message}`
        })
    }
}

export const getLovedArticle = async (req, res) => {
    try {
        
        const detailArticle = await Articles.findAll({
            where : {
                id : req.params.id
            }
        })

         await Articles.update({
            loved : detailArticle[0].loved + 1
         },{
            where : {
                id : req.params.id
            }
         }) 

        //  await fs.rm(`${detailArticle[0].avatar}`)

         res.status(200).json({
            message : "Loved increment 1"
         })

    } catch (error) {
        res.json({
            message : `Error => ${error?.message}`
        })
    }
}

export const postArticles = async (req, res) => {  
    try {    
        const { title, category, content, create, timeRead } = req.body
        const avatar = req.file?.path
        const slugify = slug(`${title}`)

        // if(!req.originalUrl.includes(`api_key=${process.env.API_KEY}`)) return res.sendStatus(401)

        await Articles.create({
            title : title,
            avatar : avatar,
            category : category,
            content : content,
            create : create,
            timeRead : timeRead,
            slug : slugify
        })

        res.status(200).json({
            message : `Success create new article - "${title}"`
        })

    } catch (error) {
        res.json({
            message : `Error => ${error.message}`
        })
    }
}

export const updateArticles = async (req, res) => {
    try {
        const { id } = req.params
        const { title, category, content, create, timeRead } = req.body
        const avatar = req.file?.path
        const slugify = slug(`${title}`)

        const data = await Articles.findAll({
            where : {
                id : id
            }
        })

        await Articles.update({
            title : title,
            avatar : avatar,
            category : category,
            content : content,
            create : create,
            timeRead : timeRead,
            slug : slugify
        },{
            where : {
                id : id
            }
        })
        res.sendStatus(200)
        data[0]?.avatar && await fs.rm(`${data[0]?.avatar}`)

    } catch (error) {
        res.json({
            message : `Error => ${error.message}`
        })
    }
}

export const destroyArticles = async (req, res) => {
    
    try {
        const { id } = req.params
        // if(!req.originalUrl.includes(`api_key=${process.env.API_KEY}`)) return res.sendStatus(401)
        
        const data = await Articles.findAll({
            where : {
                id : id
            }
        })
        
        if(!data[0].title) return res.sendStatus(404)
        
        await Articles.destroy({
            where : {
                id : id
            }
        })
        res.sendStatus(200)

        data[0]?.avatar && await fs.rm(`${data[0]?.avatar}`)
        
    } catch (error) {
        res.json({
            message : `Error => ${error.message}`
        })
    }
}

export const truncateArticles = async (req, res) => {
    try {
        await Articles.destroy({
            truncate : true
        })
        res.sendStatus(200)
    } catch (error) {
        res.json({
            message : `Error => ${error.message}`
        })
    }
}