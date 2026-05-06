import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function ViewProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
      const data = res.data?.data;

      setProduct(data);
      setSelectedImage(data?.images?.[0]?.image);
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        return;
      }

      await axios.post("http://127.0.0.1:8000/api/cart/add/", {
        product_id: product.id,
        quantity: quantity,
        user_id: user.id,
      });

      alert("Added to cart ✅");
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 5,

        /* 🌈 SAME ANIMATED BACKGROUND */
        background:
          "linear-gradient(-45deg, #667eea, #764ba2, #6dd5ed, #2193b0)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite",

        "@keyframes gradientMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* BACK BUTTON */}
      <Button
        variant="contained"
        sx={{
          mb: 3,
          background: "linear-gradient(135deg,#ff9800,#ff5722)",
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      {/* MAIN CARD */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 5,

          /* ✨ GLASS EFFECT */
          backdropFilter: "blur(12px)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",

          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          color: "#fff",
        }}
      >
        <Grid container spacing={4}>
          {/* LEFT - IMAGES */}
          <Grid item xs={12} md={6}>
            {/* MAIN IMAGE */}
            <Box
              sx={{
                height: 400,
                borderRadius: 4,
                overflow: "hidden",
                mb: 2,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={selectedImage}
                alt="product"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            {/* THUMBNAILS */}
            <Stack direction="row" spacing={2}>
              {product.images?.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(img.image)}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedImage === img.image
                        ? "2px solid #ff9800"
                        : "1px solid rgba(255,255,255,0.3)",

                    transition: "0.3s",

                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <img
                    src={img.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* RIGHT - DETAILS */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>

            <Typography mt={1} sx={{ opacity: 0.8 }}>
              Category: {product.category_name}
            </Typography>

            <Typography variant="h5" mt={2} color="#00e676">
              £ {product.price}
            </Typography>

            <Typography mt={2} sx={{ opacity: 0.9 }}>
              {product.description}
            </Typography>

            <Typography mt={2}>
              <b>Stock:</b> {product.stock}
            </Typography>

            {/* DIMENSIONS */}
            <Box
              mt={3}
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.15)",
              }}
            >
              <Typography fontWeight="bold" mb={1}>
                Product Dimensions
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2">Length</Typography>
                  <Typography fontWeight="bold">
                    {product.length || "-"} cm
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2">Width</Typography>
                  <Typography fontWeight="bold">
                    {product.width || "-"} cm
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2">Height</Typography>
                  <Typography fontWeight="bold">
                    {product.height || "-"} cm
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* QUANTITY */}
            <Box mt={4}>
              <Typography fontWeight="bold" mb={1}>
                Quantity
              </Typography>

              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={decreaseQty}
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                >
                  <RemoveIcon />
                </IconButton>

                <Typography>{quantity}</Typography>

                <IconButton
                  onClick={increaseQty}
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* BUTTON */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 3,
                background: "linear-gradient(135deg,#ff9800,#ff5722)",

                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Add to Cart 🛒
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ViewProduct;
