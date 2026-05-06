import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        p: { xs: 2, sm: 3, md: 5 },
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
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        color="white"
        sx={{
          animation: "fadeIn 0.8s ease",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(-10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        📦 Product Management
      </Typography>

      <Grid container spacing={3}>
        {/* ➕ ADD PRODUCT */}
        <Grid item xs={12} md={6}>
          <Card
            onClick={() => navigate("/add-product")}
            sx={{
              p: 4,
              cursor: "pointer",
              textAlign: "center",
              borderRadius: 4,
              color: "#fff",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                background: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                ➕ Add Product
              </Typography>

              <Typography mt={1} fontSize="14px" sx={{ opacity: 0.8 }}>
                Create new product with images, pricing & stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 📦 VIEW PRODUCTS */}
        <Grid item xs={12} md={6}>
          <Card
            onClick={() => navigate("/view-products")}
            sx={{
              p: 4,
              cursor: "pointer",
              textAlign: "center",
              borderRadius: 4,
              color: "#fff",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                background: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                📦 View Products
              </Typography>

              <Typography mt={1} fontSize="14px" sx={{ opacity: 0.8 }}>
                Manage, edit and monitor all products
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminProducts;
