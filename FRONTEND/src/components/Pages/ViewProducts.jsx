import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  CardMedia,
  Snackbar,
  Alert,
  Checkbox,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const hasFetched = useRef(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [activeImage, setActiveImage] = useState(null);

  const handleOpenProductDetails = (product) => {
    setSelectedProduct(product);
    setActiveImage(product.images?.[0]?.image);
    setOpen(true);
  };

  // FETCH PRODUCTS
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products/all/");
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProducts();
      hasFetched.current = true;
    }
  }, [fetchProducts]);

  // SELECT PRODUCT
  const handleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // OPEN CONFIRM
  const handleToggleClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  // SINGLE TOGGLE (FIXED)
  const confirmToggle = async () => {
    try {
      setLoadingId(selectedId);

      const res = await axios.put(
        `http://127.0.0.1:8000/api/products/toggle/${selectedId}/`
      );

      if (res.data.success) {
        const updatedProduct = res.data.data;

        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );

        setSelectedProducts((prev) => prev.filter((id) => id !== selectedId));

        setToast({
          open: true,
          message: updatedProduct.is_active
            ? "Product Activated"
            : "Product Deactivated",
          severity: "success",
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: "Error updating product",
        severity: "error",
      });
    } finally {
      setLoadingId(null);
      setConfirmOpen(false);
    }
  };

  // BULK TOGGLE (FIXED)
  const bulkToggle = async () => {
    try {
      const requests = selectedProducts.map((id) =>
        axios.put(`http://127.0.0.1:8000/api/products/toggle/${id}/`)
      );

      const results = await Promise.all(requests);

      const updatedProducts = results.map((r) => r.data.data);

      setProducts((prev) =>
        prev.map((p) => {
          const updated = updatedProducts.find((u) => u.id === p.id);
          return updated ? updated : p;
        })
      );

      setSelectedProducts([]);

      setToast({
        open: true,
        message: "Bulk update success",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Bulk update failed",
        severity: "error",
      });
    }
  };

  const openPopup = (p) => {
    setSelectedProduct(p);
    setOpen(true);
  };

  const getImage = (p) =>
    p.images?.[0]?.image || "https://via.placeholder.com/300";

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
      <Typography variant="h4" fontWeight="bold" mb={4} color="white">
        📦 Product Dashboard
      </Typography>

      <Button
        variant="contained"
        disabled={!selectedProducts.length}
        onClick={bulkToggle}
        sx={{
          mb: 3,
          background: "linear-gradient(135deg,#ff6a00,#ee0979)",
        }}
      >
        Toggle Selected ({selectedProducts.length})
      </Button>

      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Card
              sx={{
                height: "80vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",

                // 🎨 Dynamic background based on status
                background: p.is_active
                  ? "linear-gradient(145deg,#ffffff,#e8f7ff)"
                  : "linear-gradient(145deg,#ffffff,#fff1f1)",

                // 🎯 Status accent border
                borderLeft: p.is_active
                  ? "6px solid #00c853"
                  : "6px solid #ff5252",

                boxShadow: p.is_active
                  ? "0 10px 30px rgba(0,200,83,0.15)"
                  : "0 10px 30px rgba(255,82,82,0.15)",

                transition: "all 0.3s ease",

                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: p.is_active
                    ? "0 20px 45px rgba(0,200,83,0.25)"
                    : "0 20px 45px rgba(255,82,82,0.25)",
                },
              }}
            >
              {/* IMAGE SECTION */}
              <Box position="relative">
                <CardMedia
                  component="img"
                  image={getImage(p)}
                  sx={{
                    height: 190,
                    width: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.95)",
                  }}
                />

                {/* SELECT CHECKBOX */}
                <Checkbox
                  checked={selectedProducts.includes(p.id)}
                  onChange={() => handleSelect(p.id)}
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    color: "#fff",
                  }}
                />

                {/* STATUS BADGE */}
                <Chip
                  label={p.is_active ? "ACTIVE" : "INACTIVE"}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    fontWeight: "bold",
                    color: "#fff",
                    background: p.is_active
                      ? "linear-gradient(135deg,#00c853,#64dd17)"
                      : "linear-gradient(135deg,#ff5252,#d50000)",
                  }}
                />
              </Box>

              {/* CONTENT */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  fontWeight="bold"
                  fontSize="17px"
                  sx={{ mb: 0.5, color: "#1a1a1a" }}
                  noWrap
                >
                  {p.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#1976d2",
                    mb: 1,
                  }}
                >
                  £ {p.price}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#666",
                    height: 42,
                    overflow: "hidden",
                  }}
                >
                  {p.description}
                </Typography>
              </CardContent>

              {/* BUTTON SECTION */}
              <Stack spacing={1} sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    borderColor: "#1976d2",
                    color: "#1976d2",
                  }}
                  onClick={() => handleOpenProductDetails(p)}
                >
                  View Details
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    background: "linear-gradient(135deg,#2193b0,#6dd5ed)",
                  }}
                  onClick={() => navigate(`/edit-product/${p.id}`)}
                >
                  Edit Product
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    background: p.is_active
                      ? "linear-gradient(135deg,#ff416c,#ff4b2b)"
                      : "linear-gradient(135deg,#00c853,#64dd17)",
                  }}
                  onClick={() => handleToggleClick(p.id)}
                >
                  {p.is_active ? "Deactivate" : "Activate"}
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CONFIRM DIALOG */}
      <Dialog
        open={confirmOpen}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            minWidth: 350,
            background: "linear-gradient(145deg,#ffffff,#f7f9ff)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1976d2",
          }}
        >
          Confirm Action
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              textAlign: "center",
              mb: 3,
              color: "#555",
            }}
          >
            Are you sure you want to change the product status?
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              onClick={() => setConfirmOpen(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={confirmToggle}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
                px: 3,
              }}
            >
              Yes, Confirm
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* PRODUCT DETAILS POPUP */}
      {/* PRODUCT DETAILS POPUP */}
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            overflow: "hidden",
            background: "linear-gradient(145deg,#ffffff,#eef3ff)",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg,#2193b0,#6dd5ed)",
            color: "#fff",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
          }}
        >
          Product Details
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ p: 4 }}>
          {selectedProduct && (
            <Grid container spacing={4}>
              {/* LEFT SIDE - IMAGES */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mt: 2 }}>
                  {/* MAIN IMAGE */}
                  <Box
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                      mb: 2,
                    }}
                  >
                    <img
                      src={activeImage}
                      width="100%"
                      style={{
                        height: 380,
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  {/* THUMBNAILS */}
                  <Stack direction="row" spacing={2}>
                    {selectedProduct.images?.map((img) => (
                      <Box
                        key={img.id}
                        onClick={() => setActiveImage(img.image)}
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          border:
                            activeImage === img.image
                              ? "3px solid #1976d2"
                              : "2px solid #ddd",
                          cursor: "pointer",
                          transition: "0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <img
                          src={img.image}
                          width={75}
                          height={75}
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* RIGHT SIDE - DETAILS */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mt: 2 }}>
                  {/* NAME */}
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {selectedProduct.name}
                  </Typography>

                  {/* STATUS */}
                  <Chip
                    label={selectedProduct.is_active ? "ACTIVE" : "INACTIVE"}
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      color: "#fff",
                      px: 1.5,
                      background: selectedProduct.is_active
                        ? "linear-gradient(135deg,#00c853,#64dd17)"
                        : "linear-gradient(135deg,#ff5252,#d50000)",
                    }}
                  />

                  {/* PRICE */}
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "#1976d2", mb: 2 }}
                  >
                    £ {selectedProduct.price}
                  </Typography>

                  {/* CATEGORY */}
                  <Typography sx={{ mb: 1 }}>
                    <b>Category:</b> {selectedProduct.category_name}
                  </Typography>

                  {/* STOCK */}
                  <Typography sx={{ mb: 1 }}>
                    <b>Stock:</b> {selectedProduct.stock}
                  </Typography>

                  {/* DIMENSIONS */}
                  <Typography sx={{ mb: 1 }}>
                    <b>Dimensions:</b> {selectedProduct.length} ×{" "}
                    {selectedProduct.width} × {selectedProduct.height} cm
                  </Typography>

                  {/* WEIGHT */}
                  <Typography sx={{ mb: 2 }}>
                    <b>Weight:</b> {selectedProduct.weight} kg
                  </Typography>

                  {/* DESCRIPTION */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 3,
                      background: "#f9fbff",
                      border: "1px solid #e3e8ff",
                    }}
                  >
                    <Typography fontWeight="bold" mb={1}>
                      Description
                    </Typography>
                    <Typography sx={{ color: "#555", fontSize: 14 }}>
                      {selectedProduct.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ViewProducts;
