package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/controllers"
	"github.com/ivanovski-viktor/student_forum/server/middleware"
)

func RegisterRoutes(server *gin.Engine) {

	// **USERS**
	user := server.Group("/users")
	{
		user.POST("/register", controllers.RegisterUser)
		user.POST("/login", controllers.LoginUser)
		user.GET("/:id", controllers.GetUser)

		// AUTHENTICATED ROUTES
		authUser := user.Group("/me").Use(middleware.Authenticate)
		authUser.GET("", controllers.GetAuthenticatedUser)
		authUser.PATCH("/change-password", controllers.ChangeUserPassword)
		authUser.POST("/profile-image", controllers.UploadProfileImage)
	}

	// **GROUPS**
	group := server.Group("/groups")
	{
		group.GET("", controllers.GetAllGroups)
		group.GET("/:name", controllers.GetGroup)
		group.GET("/:name/posts", controllers.GetPostsForGroup)
	}

	// AUTHENTICATED ROUTES
	authGroup := group.Use(middleware.Authenticate)
	{
		authGroup.POST("", controllers.CreateGroup)
		authGroup.PUT("/:name", controllers.UpdateGroup)
		authGroup.DELETE("/:name", controllers.DeleteGroup)
		authGroup.POST("/:name/join", controllers.JoinGroup)
		authGroup.POST("/:name/posts", controllers.CreatePostInGroup)
		authGroup.POST("/:name/group-image", controllers.UploadGroupImage)
		authGroup.POST("/:name/group-cover", controllers.UploadCoverImage)
	}

	// **POSTS**
	post := server.Group("/posts")
	{
		post.GET("", controllers.GetAllPosts)
		post.GET("/:id", controllers.GetPost)
		post.GET("/:id/comments", controllers.GetCommentsForPost)

		// AUTHENTICATED ROUTES
		authPost := post.Group("").Use(middleware.Authenticate)
		authPost.POST("", controllers.CreatePost)
		authPost.PUT("/:id", controllers.UpdatePost)
		authPost.DELETE("/:id", controllers.DeletePost)
		authPost.POST("/:id/vote", controllers.VoteOnPost)
		authPost.GET("/:id/vote", controllers.GetUserVote)
		authPost.DELETE("/:id/vote", controllers.DeleteUserVote)
		authPost.POST("/:id/comments", controllers.CreateComment)
	}

	// **COMMENTS**
	comment := server.Group("/comments")
	{
		comment.GET("/:id", controllers.GetComment)
		comment.GET("/:id/replies", controllers.GetCommentReplies)

		// AUTHENTICATED ROUTES
		authComment := comment.Use(middleware.Authenticate)
		authComment.PUT("/:id", controllers.UpdateComment)
		authComment.DELETE("/:id", controllers.DeleteComment)
	}
}
