import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your store's featured images.
          </p>
        </div>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="featured">Featured Images</TabsTrigger>
          <TabsTrigger value="upload">Upload New Image</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Featured Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              {featureImageList && featureImageList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featureImageList.map((featureImgItem, index) => (
                    <div
                      key={index}
                      className="group relative rounded-lg overflow-hidden border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <div className="aspect-video w-full relative">
                        <img
                          src={featureImgItem.image || "/placeholder.svg"}
                          alt={`Featured image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium truncate">
                            Featured Image {index + 1}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Added on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No featured images</h3>
                  <p className="text-muted-foreground mt-1">
                    Upload images to showcase on your homepage
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold">
                Upload New Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-primary/5 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle>Featured Images</AlertTitle>
                <AlertDescription>
                  These images will be displayed in the carousel on the
                  homepage. For best results, use high-quality images with a
                  16:9 aspect ratio.
                </AlertDescription>
              </Alert>

              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
              />

              <Separator className="my-6" />

              <Button
                onClick={handleUploadFeatureImage}
                className="w-full py-6 text-base font-semibold"
                disabled={!uploadedImageUrl || imageLoadingState}
              >
                {imageLoadingState ? "Uploading..." : "Upload Featured Image"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
