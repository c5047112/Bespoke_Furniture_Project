import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Divider,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (userId) fetchCart();
    else setLoading(false);
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/cart/${userId}/`);
      setCart(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (id, qty) => {
    await axios.put(`${BASE_URL}/api/cart/update/${id}/`, {
      quantity: qty,
    });
    fetchCart();
  };

  const removeItem = async (id) => {
    await axios.delete(`${BASE_URL}/api/cart/delete/${id}/`);
    fetchCart();
  };

  if (!userId) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5">Please login to view your cart</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return <Typography sx={{ p: 4, color: "#fff" }}>Loading...</Typography>;
  }

  if (!cart || !cart.items?.length) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          color: "#fff",

          /* SAME BACKGROUND ANIMATION */
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
        {/* BIG EMPTY CART MESSAGE */}
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            mb: 2,
            textShadow: "0 5px 20px rgba(0,0,0,0.4)",
          }}
        >
          🛒 Your Cart is Empty
        </Typography>

        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            mb: 4,
          }}
        >
          Looks like you haven’t added anything yet
        </Typography>

        {/* BUTTON TO SHOP */}
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/products")}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
            background: "linear-gradient(135deg,#ff9800,#ff5722)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          Start Shopping 🛍️
        </Button>
      </Box>
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
      <Grid container spacing={4}>
        {/* LEFT */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold" mb={3} color="#fff">
            🛒 My Cart ({cart.items.length})
          </Typography>

          {cart.items.map((item) => (
            <Card
              key={item.id}
              sx={{
                mb: 3,
                borderRadius: 4,
                backdropFilter: "blur(12px)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                color: "#fff",
              }}
            >
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  {/* IMAGE */}
                  <Grid item xs={12} sm={3}>
                    <Avatar
                      variant="rounded"
                      src={
                        item.product_image
                          ? `${BASE_URL}${item.product_image}`
                          : "https://via.placeholder.com/150"
                      }
                      sx={{ width: "100%", height: 120, borderRadius: 3 }}
                    />
                  </Grid>

                  {/* DETAILS */}
                  <Grid item xs={12} sm={5}>
                    <Typography fontWeight="bold">
                      {item.product_name}
                    </Typography>

                    <Chip
                      label={`Stock: ${item.stock}`}
                      size="small"
                      sx={{
                        mt: 1,
                        background: "#00e676",
                        color: "#000",
                      }}
                    />

                    {/* ✅ PRICE COLOR FIX */}
                    <Typography
                      sx={{
                        mt: 1,
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "#FFD700", // GOLD COLOR
                      }}
                    >
                      £ {item.price}
                    </Typography>

                    <Button
                      size="small"
                      sx={{ mt: 1, color: "#ff5252" }}
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Grid>

                  {/* QUANTITY */}
                  <Grid item xs={12} sm={4}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.2)",
                        p: 0.5,
                      }}
                    >
                      {/* DECREASE */}
                      <IconButton
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQty(item.id, item.quantity - 1)
                        }
                        sx={{ color: "#fff" }}
                      >
                        <RemoveIcon />
                      </IconButton>

                      <Typography fontWeight="bold">{item.quantity}</Typography>

                      {/* INCREASE WITH STOCK CHECK */}
                      <IconButton
                        onClick={() => {
                          if (item.quantity < item.stock) {
                            updateQty(item.id, item.quantity + 1);
                          } else {
                            alert(`Only ${item.stock} items available ⚠️`);
                          }
                        }}
                        sx={{ color: "#fff" }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 5,
              position: "sticky",
              top: 20,
              backdropFilter: "blur(12px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              color: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              💰 Price Summary
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Total</Typography>
                <Typography>£ {cart.total_price}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography>Tax</Typography>
                <Typography>£ {cart.tax}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography>Delivery</Typography>
                <Typography>£ {cart.delivery_charge}</Typography>
              </Stack>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />

              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight="bold">Grand Total</Typography>
                <Typography fontWeight="bold" color="#00e676">
                  £ {cart.grand_total}
                </Typography>
              </Stack>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{
                mt: 3,
                borderRadius: 3,
                fontWeight: "bold",
                background: "linear-gradient(135deg,#ff9800,#ff5722)",
              }}
              onClick={() => navigate("/address")}
            >
              Proceed to Checkout 🚀
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CartPage;
