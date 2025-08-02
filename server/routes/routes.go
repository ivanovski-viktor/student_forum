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
		user.POST("/login", controllers.LoginUser)
		user.GET("/:id", controllers.GetUser)

		// AUTHENTICATED ROUTES
		authUser := user.Group("/me").Use(middleware.Authenticate)
		authUser.GET("", controllers.GetAuthenticatedUser)
		authUser.PATCH("/change-password", controllers.ChangeUserPassword)
		authUser.POST("/profile-picture", controllers.UploadProfilePicture)
	}

	post := server.Group("/posts")
	{
		post.GET("", controllers.GetAllPosts)
		post.GET("/:id", controllers.GetPost)
		post.GET("/:id/comments", controllers.GetCommentsForPost)

		// AUTHENTICATED ROUTES
		protectedPosts := post.Group("").Use(middleware.Authenticate)
		protectedPosts.POST("", controllers.CreatePost)
		protectedPosts.PUT("/:id", controllers.UpdatePost)
		protectedPosts.DELETE("/:id", controllers.DeletePost)
		protectedPosts.POST("/:id/vote", controllers.VoteOnPost)
		protectedPosts.POST("/:id/comments", controllers.CreateComment)
	}

	// AUTHENTICATED COMMENTS
	comment := server.Group("/comments").Use(middleware.Authenticate)
	{
		comment.PUT("/:id", controllers.UpdateComment)
		comment.DELETE("/:id", controllers.DeleteComment)
	}
}
