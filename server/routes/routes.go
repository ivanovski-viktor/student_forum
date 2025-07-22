package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/controllers"
	"github.com/ivanovski-viktor/student_forum/server/middleware"
)

func RegisterRoutes(server *gin.Engine) {
	user := server.Group("/users")
	{
		user.POST("/register", controllers.RegisterUser)
		user.GET("/:id", controllers.GetUser)

		// AUTHENTICATED ROUTES
		authUser := user.Group("").Use(middleware.Authenticate)
		authUser.GET("/me", controllers.GetAuthenticatedUser)
		authUser.PATCH("/me/change-password", controllers.ChangeUserPassword)
	}

	post := server.Group("/posts")
	{
		post.GET("", controllers.GetAllPosts)
		post.GET("/:id", controllers.GetPost)

		// AUTHENTICATED ROUTES
		protectedPosts := post.Group("").Use(middleware.Authenticate)
		protectedPosts.POST("", controllers.CreatePost)
		protectedPosts.PUT("/:id", controllers.UpdatePost)
		protectedPosts.DELETE("/:id", controllers.DeletePost)
	}

}
