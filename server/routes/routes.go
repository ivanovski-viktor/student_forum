package routes

import "github.com/gin-gonic/gin"

//GET, POST, PUT, PATCH, DELETE
func RegisterRoutes(server *gin.Engine) {
	server.POST("/posts", createPost)
	server.GET("/posts", getAllPosts)
	server.GET("/posts/:id", getPost)
	server.DELETE("/posts/:id", deletePost)
}