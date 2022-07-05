import { Router } from 'express'
import { getArticles,
        getDetailArticle,
        getLovedArticle,
        postArticles,
        updateArticles,
        destroyArticles,
        truncateArticles
     } from '../controllers/articles.js'

export const route = Router()


route.get("/api/v1/article", getArticles)
route.get("/api/v1/article/:slug", getDetailArticle)


route.post("/api/v1/article&api_key=:key", postArticles)
route.put("/api/v1/article/update/:id&api_key=:key", updateArticles)
route.put("/api/v1/article/getLoved/:id", getLovedArticle)


route.delete("/api/v1/article/delete/:id", destroyArticles)
route.delete("/api/v1/article/truncate", truncateArticles)
