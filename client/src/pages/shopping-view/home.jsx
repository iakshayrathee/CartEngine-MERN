"use client";

import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { motion, AnimatePresence } from "framer-motion";

// Extracted constants for better maintainability
const CATEGORIES_WITH_ICON = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const BRANDS_WITH_ICON = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

// Custom hook for slide management
const useSlideManagement = (imageList) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleSlideChange = useCallback(
    (newSlide) => {
      setDirection(newSlide > currentSlide ? 1 : -1);
      setCurrentSlide(newSlide);
    },
    [currentSlide]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % imageList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, handleSlideChange, imageList.length]);

  return { currentSlide, direction, handleSlideChange };
};

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Memoized slide variants for performance
  const slideVariants = useMemo(
    () => ({
      enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
      },
      exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      }),
    }),
    []
  );

  // Memoized event handlers
  const handleNavigateToListingPage = useCallback(
    (getCurrentItem, section) => {
      sessionStorage.removeItem("filters");
      const currentFilter = {
        [section]: [getCurrentItem.id],
      };

      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      navigate(`/shop/listing`);
    },
    [navigate]
  );

  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
  );

  const handleAddtoCart = useCallback(
    (getCurrentProductId) => {
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Product is added to cart",
          });
        }
      });
    },
    [dispatch, user, toast]
  );

  // Slide management
  const { currentSlide, direction, handleSlideChange } =
    useSlideManagement(featureImageList);

  // Initial data fetching
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
  }, [dispatch]);

  // Product details dialog management
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen overflow-x-hidden relative"
    >
      {/* Subtle background gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] 
        bg-gradient-to-br from-primary/5 via-white to-primary/5 
        opacity-50 blur-3xl"
      />

      <div className="relative w-full h-[600px] overflow-hidden shadow-xl rounded-b-lg bg-gradient-to-r from-primary/5 to-primary/10">
        {featureImageList && featureImageList.length > 0 ? (
          <>
            <AnimatePresence initial={false} custom={direction}>
              {featureImageList.map(
                (slide, index) =>
                  index === currentSlide && (
                    <motion.div
                      key={index}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      className="absolute inset-0"
                    >
                      <img
                        src={slide?.image || "/placeholder.svg"}
                        alt={`Featured promotion ${index + 1}`}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute bottom-0 left-0 right-0 p-8 text-white"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                          {slide?.title || "Seasonal Collection"}
                        </h2>
                        <p className="text-lg md:text-xl max-w-xl mb-4">
                          {slide?.description ||
                            "Discover our latest arrivals and trending styles"}
                        </p>
                        <Button
                          className="bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Shop Now
                        </Button>
                      </motion.div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featureImageList.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/50"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <motion.div
              className="absolute top-1/2 left-4 transform -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleSlideChange(
                    (currentSlide - 1 + featureImageList.length) %
                      featureImageList.length
                  )
                }
                className="bg-white/80 hover:bg-white transition-all duration-300 rounded-full h-10 w-10"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleSlideChange(
                    (currentSlide + 1) % featureImageList.length
                  )
                }
                className="bg-white/80 hover:bg-white transition-all duration-300 rounded-full h-10 w-10"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </>
        ) : null}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              CATEGORIES
            </span>
            <h2 className="text-4xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Explore our wide range of products across different categories
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.2,
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {CATEGORIES_WITH_ICON.map((categoryItem) => (
              <motion.div
                key={categoryItem.id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer group overflow-hidden transition-all duration-300 rounded-xl border-0 shadow-md hover:shadow-xl"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-primary/5 transform scale-0 group-hover:scale-100 rounded-xl transition-transform duration-300" />
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <categoryItem.icon className="w-8 h-8 text-primary transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <span className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                      {categoryItem.label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="relative overflow-hidden rounded-xl group h-64">
              <img
                src="/images/landingPage1.webp"
                alt="Special Offer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
                <span className="text-white/80 text-sm font-medium mb-2">
                  LIMITED TIME
                </span>
                <h3 className="text-white text-2xl font-bold mb-2">
                  Summer Collection
                </h3>
                <p className="text-white/90 mb-4">
                  Up to 50% off on selected items
                </p>
                <Button
                  variant="outline"
                  className="w-fit bg-white text-black hover:bg-white/90 transition-all duration-300"
                  onClick={() => navigate("/shop/listing")}
                >
                  Shop Now
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl group h-64">
              <img
                src="/images/landingPage2.webp"
                alt="New Arrivals"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
                <span className="text-white/80 text-sm font-medium mb-2">
                  JUST ARRIVED
                </span>
                <h3 className="text-white text-2xl font-bold mb-2">
                  New Arrivals
                </h3>
                <p className="text-white/90 mb-4">
                  Check out our latest collection
                </p>
                <Button
                  variant="outline"
                  className="w-fit bg-white text-black hover:bg-white/90 transition-all duration-300"
                  onClick={() => navigate("/shop/listing")}
                >
                  Discover
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-t from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              BRANDS
            </span>
            <h2 className="text-4xl font-bold text-gray-800">Shop by Brand</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Discover products from your favorite brands
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.2,
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {BRANDS_WITH_ICON.map((brandItem) => (
              <motion.div
                key={brandItem.id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card
                  onClick={() =>
                    handleNavigateToListingPage(brandItem, "brand")
                  }
                  className="cursor-pointer group overflow-hidden transition-all duration-300 rounded-xl border-0 shadow-md hover:shadow-xl"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-primary/5 transform scale-0 group-hover:scale-100 rounded-xl transition-transform duration-300" />
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <brandItem.icon className="w-8 h-8 text-primary transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <span className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                      {brandItem.label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              FEATURED
            </span>
            <h2 className="text-4xl font-bold text-gray-800">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Handpicked selections just for you
            </p>
          </div>

          {productList && productList.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.2,
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8"
            >
              {productList.map((productItem) => (
                <motion.div
                  key={productItem.id}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="transform transition-all duration-300 hover:-translate-y-2"
                >
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBasket className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">
                No products available at the moment
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="px-8 py-6 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => navigate("/shop/listing")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-16 bg-primary/5"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm hover:border-primary/30 transition-all duration-300"
              />
              <Button className="whitespace-nowrap">Subscribe</Button>
            </div>
          </div>
        </div>
      </motion.section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </motion.div>
  );
}

export default ShoppingHome;
