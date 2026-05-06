import React, { useEffect, useState } from "react";
import { Box, Grid, Card, Typography, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/wishlist/${userId}/`);
      setWishlist(res.data?.data); // safe access
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      setWishlist(null);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/wishlist/delete/${id}/`);
      fetchWishlist(); // refresh after delete
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!wishlist) {
    return (
      <h3 style={{ color: "white", textAlign: "center", marginTop: 50 }}>
        Loading...
      </h3>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
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
      {/* HEADER */}
      <Typography
        variant="h4"
        mb={4}
        fontWeight="bold"
        color="#fff"
        textAlign="center"
      >
        ❤️ My Wishlist
      </Typography>

      {/* GRID */}
      <Grid container spacing={3}>
        {wishlist?.items?.length > 0 ? (
          wishlist.items.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  color: "#fff",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.03)",
                  },
                }}
              >
                {/* IMAGE */}
                <Box textAlign="center">
                  <img
                    src={
                      item.product_image || "https://via.placeholder.com/150"
                    }
                    alt={item.product_name}
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "contain",
                      borderRadius: 10,
                    }}
                  />
                </Box>

                {/* NAME */}
                <Typography mt={2} fontWeight="bold">
                  {item.product_name}
                </Typography>

                {/* DELETE */}
                <IconButton
                  onClick={() => removeItem(item.id)}
                  sx={{
                    mt: 1,
                    background: "rgba(255,0,0,0.2)",
                    color: "#fff",
                    "&:hover": {
                      background: "rgba(255,0,0,0.4)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    borderRadius: 3,
                    textTransform: "none",
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                  onClick={() => navigate(`/product/${item.product_id}`)}
                >
                  View Product 🛍️
                </Button>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography color="#fff" textAlign="center" width="100%">
            No items in wishlist
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default WishlistPage;
