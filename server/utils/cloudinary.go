package utils

import (
	"context"
	"fmt"
	"mime/multipart"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadFileToCloudinary(file multipart.File, fileHeader *multipart.FileHeader, folderPath string) (string, error) {
	defer file.Close()

	// Init Cloudinary using CLOUDINARY_URL from env
	cld, err := cloudinary.New()
	if err != nil {
		return "", fmt.Errorf("cloudinary init failed: %v", err)
	}

	// Upload the file
	uploadParams := uploader.UploadParams{
		Folder: folderPath, // example: "profile_images"
	}

	uploadResult, err := cld.Upload.Upload(context.Background(), file, uploadParams)
	if err != nil {
		return "", fmt.Errorf("failed to upload to cloudinary: %v", err)
	}

	// Return the secure URL
	return uploadResult.SecureURL, nil
}

func DeleteFolderContents(folderPath string) error {
	cld, err := cloudinary.New()
	if err != nil {
		return fmt.Errorf("cloudinary init failed: %w", err)
	}

	ctx := context.Background()

	_, err = cld.Admin.DeleteAssetsByPrefix(ctx, admin.DeleteAssetsByPrefixParams{
		Prefix: []string{folderPath + "/"},
	})
	if err != nil {
		return fmt.Errorf("failed to delete assets in folder '%s': %w", folderPath, err)
	}

	return nil
}
