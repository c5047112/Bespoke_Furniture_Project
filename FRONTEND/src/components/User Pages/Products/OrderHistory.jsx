import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8000";

function OrderHistory() {
  const { userId } = useParams();
  const [orders, setOrders] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/order/history/${userId}/`);
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ff9800";
      case "CONFIRMED":
        return "#2196f3";
      case "SHIPPED":
        return "#9c27b0";
      case "DELIVERED":
        return "#4caf50";
      case "CANCELLED":
        return "#f44336";
      default:
        return "#aaa";
    }
  };

  if (!orders) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
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
      <Typography variant="h4" fontWeight="bold" mb={4} color="#fff">
        📦 My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography color="#fff">No Orders Found</Typography>
      ) : (
        <Stack spacing={3}>
          {orders.map((order) => (
            <Card
              key={order.id}
              sx={{
                p: 3,
                borderRadius: 4,
                backdropFilter: "blur(12px)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
                color: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <Grid container spacing={3} alignItems="center">
                {/* LEFT */}
                <Grid item xs={12} md={4}>
                  <Typography fontWeight="bold" mb={0.5}>
                    Order #{order.id}
                  </Typography>
                  <Typography fontSize="0.85rem">{order.created_at}</Typography>
                </Grid>

                {/* CENTER */}
                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip
                      label={order.status}
                      sx={{
                        background: getStatusColor(order.status),
                        color: "#fff",
                      }}
                    />
                    <Chip
                      label={order.payment_status}
                      sx={{
                        background:
                          order.payment_status === "SUCCESS"
                            ? "#4caf50"
                            : "#ff9800",
                        color: "#fff",
                      }}
                    />
                  </Stack>
                </Grid>

                {/* RIGHT */}
                <Grid item xs={12} md={4} textAlign="right">
                  <Typography
                    fontWeight="bold"
                    sx={{ color: "#FFD700", fontSize: 18, mb: 1 }}
                  >
                    £ {order.final_amount}
                  </Typography>

                  <Button
                    size="small"
                    sx={{
                      borderRadius: 3,
                      px: 2,
                      py: 0.5,
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.5)",
                      "&:hover": {
                        background: "rgba(255,255,255,0.1)",
                      },
                    }}
                    onClick={() => handleOpen(order)}
                  >
                    View Details
                  </Button>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>
      )}

      {/* 🔥 DIALOG */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backdropFilter: "blur(20px)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>📄 Order Details</DialogTitle>

        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2}>
              <Box>
                <Typography fontWeight="bold">
                  Order ID: {selectedOrder.id}
                </Typography>
                <Typography fontSize="0.9rem">
                  {selectedOrder.created_at}
                </Typography>
              </Box>

              {/* PRODUCTS */}
              <Box>
                {selectedOrder.items.map((item, i) => (
                  <Box key={i} mb={3}>
                    <Typography fontWeight="bold">
                      {item.product_name}
                    </Typography>

                    <Grid container spacing={1} mt={1}>
                      {item.images?.map((img, index) => (
                        <Grid item xs={4} sm={3} md={2} key={index}>
                          <Box
                            component="img"
                            src={img}
                            sx={{
                              width: "100%",
                              height: 80,
                              borderRadius: 2,
                              objectFit: "cover",
                              transition: "0.3s",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    <Typography fontSize="0.8rem" mt={1}>
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ borderColor: "#fff" }} />

              {/* PRICE */}
              <Stack spacing={0.5}>
                <Typography sx={{ color: "#FFD700" }}>
                  Total: £ {selectedOrder.total_amount}
                </Typography>
                <Typography sx={{ color: "#ff6b6b" }}>
                  Discount: £ {selectedOrder.discount}
                </Typography>
                <Typography
                  fontWeight="bold"
                  sx={{ color: "#FFD700", fontSize: 18 }}
                >
                  Final: £ {selectedOrder.final_amount}
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: 3,
              px: 3,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrderHistory;
