import {
  AlertCircle,
  FileIcon,
  Image,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setError(null);
      setImageFile(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(droppedFile.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
        return;
      }

      // Validate file size (5MB max)
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setError(null);
      setImageFile(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl(null);
    setError(null);
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    setError(null);
    setUploadProgress(0);

    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      clearInterval(progressInterval);

      if (response?.data?.success) {
        setUploadProgress(100);
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      } else {
        setError("Failed to upload image. Please try again.");
        setImageLoadingState(false);
      }
    } catch (error) {
      setError("An error occurred while uploading. Please try again.");
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-base font-semibold mb-2 flex items-center gap-2">
        <Image className="h-4 w-4 text-primary" />
        Product Image
      </Label>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-4 transition-all duration-300
          ${
            isEditMode
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-primary/50 hover:bg-primary/5"
          }
          ${uploadedImageUrl ? "border-green-300 bg-green-50" : "border-border"}
        `}
      >
        <Input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`
              flex flex-col items-center justify-center h-32 gap-2
              ${isEditMode ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <UploadCloudIcon className="w-10 h-10 text-primary/60 mb-2" />
            <span className="text-center text-muted-foreground">
              Drag & drop or click to upload image
            </span>
            <span className="text-xs text-muted-foreground">
              Supports JPEG, PNG, GIF, WEBP (Max 5MB)
            </span>
          </Label>
        ) : imageLoadingState ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="w-6 h-6 text-primary" />
                <div className="flex flex-col">
                  <p className="text-sm font-medium line-clamp-1">
                    {imageFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(imageFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-primary">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="w-6 h-6 text-green-600" />
                <div className="flex flex-col">
                  <p className="text-sm font-medium line-clamp-1">
                    {imageFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(imageFile.size / 1024).toFixed(1)} KB • Uploaded
                    successfully
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>

            {uploadedImageUrl && (
              <div className="relative h-32 w-full overflow-hidden rounded-md border bg-muted/20">
                <img
                  src={uploadedImageUrl || "/placeholder.svg"}
                  alt="Uploaded preview"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        For best results, use high-quality images with a 1:1 aspect ratio
      </p>
    </div>
  );
}

export default ProductImageUpload;
