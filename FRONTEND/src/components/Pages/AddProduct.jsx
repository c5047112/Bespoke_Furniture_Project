import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    length: "",
    width: "",
    height: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/all/")
      .then((res) => setCategories(res.data.data || []));
  }, []);

  const handleImages = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    const temp = [...images];
    temp.splice(index, 1);
    setImages(temp);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    images.forEach((img) => {
      formData.append("images", img);
    });

    await axios.post("http://127.0.0.1:8000/api/products/add/", formData);

    alert("Product Added");
    navigate("/admin-dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "73vh",
        p: { xs: 2, sm: 3, md: 5 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
      {/* FORM CONTAINER */}
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(15px)",
          color: "#fff",
          animation: "fadeIn 0.8s ease",

          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* TITLE */}
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
          ➕ Add Product
        </Typography>

        {/* FORM GRID */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              onChange={(e) => setData({ ...data, price: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              onChange={(e) => setData({ ...data, stock: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          {/* DIMENSIONS */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Length"
              onChange={(e) => setData({ ...data, length: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Width"
              onChange={(e) => setData({ ...data, width: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Height"
              onChange={(e) => setData({ ...data, height: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          {/* CATEGORY */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ddd" } }}
            />
          </Grid>

          {/* IMAGE UPLOAD */}
          <Grid item xs={12}>
            <Button
              component="label"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
                color: "#000",
              }}
            >
              Upload Images
              <input type="file" hidden multiple onChange={handleImages} />
            </Button>
          </Grid>

          {/* IMAGE PREVIEW */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {images.map((img, i) => (
                <Grid item key={i}>
                  <Card
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="120"
                      image={URL.createObjectURL(img)}
                    />

                    <IconButton
                      onClick={() => removeImage(i)}
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* SUBMIT */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                background: "linear-gradient(135deg,#667eea,#764ba2)",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Add Product
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default AddProduct;
