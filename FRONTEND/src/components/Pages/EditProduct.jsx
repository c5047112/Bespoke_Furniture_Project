import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    length: "",
    width: "",
    height: "",
    is_active: true,
    images: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  // 📥 Fetch product
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);

      if (res.data?.data) {
        setProduct(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // ✏️ Handle text change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ➕ Add new images
  const handleImageChange = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  // ❌ Remove existing image (with DB tracking)
  const removeExistingImage = (imgId) => {
    console.log("Clicked ID:", imgId);

    setDeletedImages((prev) => [...prev, imgId]);

    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imgId),
    }));
  };

  // ❌ Remove new image
  const removeNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  // 💾 Update product
  const updateProduct = async () => {
    try {
      const formData = new FormData();

      // text fields
      Object.keys(product).forEach((key) => {
        if (key !== "images") {
          formData.append(key, product[key]);
        }
      });

      // deleted images
      deletedImages.forEach((imgId) => {
        formData.append("deleted_images", imgId);
      });

      // new images
      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await axios.put(
        `http://127.0.0.1:8000/api/products/update/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product updated successfully ✅");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      background: "#fff",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background:
          "linear-gradient(-45deg, #667eea, #764ba2, #6dd5ed, #2193b0)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 10s ease infinite",
        "@keyframes gradientMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        color="white"
        textAlign="center"
      >
        ✏️ Edit Product
      </Typography>

      <Card
        sx={{
          maxWidth: 900,
          margin: "auto",
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          p: 3,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            {/* ID */}
            <Grid item xs={12}>
              <TextField
                label="Product ID"
                fullWidth
                value={product.id}
                InputProps={{ readOnly: true }}
                sx={fieldStyle}
              />
            </Grid>

            {/* NAME */}
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                name="name"
                fullWidth
                value={product.name}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            {/* DESCRIPTION */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={3}
                fullWidth
                value={product.description}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            {/* PRICE & STOCK */}
            <Grid item xs={6}>
              <TextField
                label="Price (£)"
                name="price"
                type="number"
                fullWidth
                value={product.price}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                fullWidth
                value={product.stock}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            {/* DIMENSIONS */}
            <Grid item xs={4}>
              <TextField
                label="Length"
                name="length"
                fullWidth
                value={product.length}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Width"
                name="width"
                fullWidth
                value={product.width}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Height"
                name="height"
                fullWidth
                value={product.height}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            {/* EXISTING IMAGES */}
            <Grid item xs={12}>
              <Typography fontWeight="bold" mb={1}>
                Existing Images
              </Typography>

              <Grid container spacing={2}>
                {product.images?.map((img) => (
                  <Grid item key={img.id}>
                    <Box position="relative">
                      <img
                        src={img.image}
                        width={100}
                        height={100}
                        style={{
                          borderRadius: 10,
                          objectFit: "cover",
                          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                        }}
                      />

                      <IconButton
                        onClick={() => removeExistingImage(img.id)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: "#fff",
                          boxShadow: 2,
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* UPLOAD BUTTON */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg,#2193b0,#6dd5ed)",
                }}
              >
                Upload Images
                <input
                  hidden
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>

            {/* NEW IMAGES */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {newImages.map((img, index) => (
                  <Grid item key={index}>
                    <Box position="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        width={100}
                        height={100}
                        style={{
                          borderRadius: 10,
                          objectFit: "cover",
                          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                        }}
                      />

                      <IconButton
                        onClick={() => removeNewImage(index)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: "#fff",
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* ACTION BUTTONS */}
            <Grid item xs={12} mt={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={updateProduct}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  background: "linear-gradient(135deg,#00c853,#64dd17)",
                }}
              >
                Update Product
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/admin-dashboard")}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EditProduct;
