import { Router } from 'express'
import { getArticles,
        getDetailArticle,
        getLovedArticle,
        postArticles,
        updateArticles,
        destroyArticles,
        truncateArticles
     } from '../controllers/articles.js'

import { Login, Register, Logout, UserList } from '../controllers/Users.js'

import { verifyToken } from '../middleware/verify.js'
import { refreshToken } from '../middleware/refreshToken.js'

export const route = Router()

route.get("/api/v1/article", getArticles)
route.get("/api/v1/article/:slug", getDetailArticle)

route.post("/api/v1/article", verifyToken ,postArticles)
route.put("/api/v1/article/update/:id" , verifyToken ,updateArticles)
route.put("/api/v1/article/getLoved/:id", getLovedArticle)


route.delete("/api/v1/article/delete/:id", verifyToken ,destroyArticles)
// route.delete("/api/v1/article/truncate", truncateArticles)

// route.get("/api/v1/users", UserList)
route.post("/api/v1/login", Login)
// route.post("/api/v1/register", Register)
route.delete("/api/v1/logout", Logout)
route.get("/api/v1/refresh", refreshToken)