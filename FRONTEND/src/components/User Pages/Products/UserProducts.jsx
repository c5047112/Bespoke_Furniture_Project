import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Paper,
  InputAdornment,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

function UserProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [wishlistItems, setWishlistItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchWishlist();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, selectedCategory, priceRange, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/active/`);
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Product fetch error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/categories/`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));

      const res = await axios.get(`${BASE_URL}/api/wishlist/${user.id}/`);

      const items = res.data?.data?.items || [];

      // store product ids
      setWishlistItems(items.map((i) => i.product_id));
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  const applyFilters = () => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      data = data.filter((p) => p.category_name === selectedCategory);
    }

    if (priceRange === "low") {
      data = data.filter((p) => Number(p.price) <= 1000);
    } else if (priceRange === "mid") {
      data = data.filter(
        (p) => Number(p.price) > 1000 && Number(p.price) <= 5000
      );
    } else if (priceRange === "high") {
      data = data.filter((p) => Number(p.price) > 5000);
    }

    setFilteredProducts(data);
  };

  const getImage = (p) => p.images?.[0]?.image || null;

  const addToWishlist = async (productId) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        return;
      }

      await axios.post(`${BASE_URL}/api/wishlist/add/`, {
        user_id: user.id,
        product_id: productId,
      });

      setWishlistItems((prev) => [...prev, productId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,

        /* 🌈 ANIMATED BACKGROUND */
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
      {/* 🔍 FILTER BAR */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,

          /* ✨ GLASS EFFECT */
          backdropFilter: "blur(12px)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",

          /* 🌈 GRADIENT BORDER */
          border: "2px solid transparent",
          backgroundImage:
            "linear-gradient(#fff,#fff) padding-box, linear-gradient(45deg,#667eea,#764ba2,#6dd5ed) border-box",

          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",

          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",

          transition: "0.3s",

          "&:hover": {
            boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {/* 🔍 Search */}
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 250,
            bgcolor: "#fff",
            borderRadius: 2,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* 🏷 Category */}
        <TextField
          select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{
            minWidth: 200,
            bgcolor: "#fff",
            borderRadius: 2,
          }}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat, index) => {
            const name = typeof cat === "string" ? cat : cat.name;
            return (
              <MenuItem key={cat.id || index} value={name}>
                {name}
              </MenuItem>
            );
          })}
        </TextField>

        {/* 💰 Price */}
        <TextField
          select
          label="Price"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          sx={{
            minWidth: 180,
            bgcolor: "#fff",
            borderRadius: 2,
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="low">£0 - £1000</MenuItem>
          <MenuItem value="mid">£1000 - £5000</MenuItem>
          <MenuItem value="high">£5000+</MenuItem>
        </TextField>
      </Paper>

      {/* 🧾 HEADER */}
      <Typography variant="h5" fontWeight="bold" mb={3} color="#fff">
        🛍 Products ({filteredProducts.length})
      </Typography>

      {/* 🧱 GRID */}
      <Grid container spacing={3}>
        {filteredProducts.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Card
              sx={{
                borderRadius: 4,
                p: 2,
                background: "#fff",
                boxShadow: 2,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box position="relative" textAlign="center">
                {getImage(p) && (
                  <img
                    src={getImage(p)}
                    alt={p.name}
                    style={{
                      height: 180,
                      objectFit: "contain",
                    }}
                  />
                )}

                <IconButton
                  onClick={() => addToWishlist(p.id)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  <FavoriteBorderIcon
                    sx={{
                      color: wishlistItems.includes(p.id) ? "red" : "blue",
                      fill: wishlistItems.includes(p.id) ? "red" : "blue",
                    }}
                  />
                </IconButton>
              </Box>

              <Typography mt={2} fontWeight="bold">
                {p.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {p.category_name}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#2e7d32",
                }}
              >
                £{p.price}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                }}
                onClick={() => navigate(`/product/${p.id}`)}
              >
                View Product
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default UserProducts;
