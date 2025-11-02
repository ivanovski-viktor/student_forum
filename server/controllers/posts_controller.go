package controllers

import (
	"fmt"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

func CreatePost(c *gin.Context) {

	var post models.Post
	err := c.ShouldBindJSON(&post)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	userId := c.GetInt64("userId")
	post.UserID = userId

	err = post.Create()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to create post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Created post!", "post": post})
}

func GetAllPosts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	// Get paginated posts
	posts, err := models.GetAll(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting posts!"})
		return
	}

	// ✅ Get total count
	totalCount, err := models.GetTotalPostsCount()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting total count!"})
		return
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))

	c.JSON(http.StatusOK, gin.H{
		"posts":       posts,
		"page":        page,
		"limit":       limit,
		"total_posts": totalCount,
		"total_pages": totalPages,
	})
}


func GetPost(c *gin.Context) {

	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	post, err := models.GetPostById(postId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Unable to get post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"post": post})
}

func DeletePost(c *gin.Context) {

	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	post, err := models.GetPostById(postId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to get post!"})
		return
	}

	userId := c.GetInt64("userId")

	if post.UserID != userId {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not authorized to delete the post!"})
		return
	}

	err = post.Delete()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Unable to find and delete the post!"})
		return
	}

	c.Status(http.StatusNoContent)
}

func UpdatePost(c *gin.Context) {

	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	post, err := models.GetPostById(postId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not get post!"})
		return
	}

	err = c.ShouldBindJSON(&post)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	userId := c.GetInt64("userId")

	if post.UserID != userId {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not authorized to update the post!"})
		return
	}

	err = post.Update()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to update post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"post": post})
}

func UploadPostMedia(c *gin.Context) {
    postId, err := utils.ParseParamToInt("id", c)
	userId := c.GetInt64("userId")

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
        return
    }

    form, err := c.MultipartForm()
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
        return
    }

    files := form.File["post_media"]
    if len(files) == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No media files uploaded"})
        return
    }

    if len(files) > 3 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "You can upload a maximum of 3 files"})
        return
    }

    post, err := models.GetPostById(postId)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

	if post.UserID != userId {
		 c.JSON(http.StatusUnauthorized, gin.H{"message": "Not Authorized"})
		 return
	}


    folderPath := fmt.Sprintf("post_media/%d", postId)

    // Delete all existing media in the folder before uploading new files

	err = utils.DeleteFolderContents(folderPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

    uploadedMedia := []models.Media{}

    for _, fileHeader := range files {
        file, err := fileHeader.Open()
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
            return
        }
        defer file.Close()

        // Upload to Cloudinary
        imageURL, err := utils.UploadFileToCloudinary(file, fileHeader, folderPath)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file: " + err.Error()})
            return
        }

        uploadedMedia = append(uploadedMedia, models.Media{
            URL:  imageURL,
            Type: fileHeader.Header.Get("Content-Type"),
        })
    }

    // Save the new media
    err = post.UpdateMedia(uploadedMedia)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    post.Media = uploadedMedia

    c.JSON(http.StatusOK, gin.H{
        "message": "Uploaded media successfully",
        "media":   post.Media,
    })
}