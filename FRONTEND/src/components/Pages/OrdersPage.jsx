import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://127.0.0.1:8000/api/admin/orders/")
      .then((res) => setOrders(res.data.data))
      .catch(console.error);
  };

  const openProductDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "info";
      case "ASSIGNED":
        return "primary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
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
      <Typography variant="h4" fontWeight="bold" mb={4} color="white">
        📦 Orders Dashboard
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} lg={4} key={order.id}>
            <Card
              sx={{
                borderRadius: 4,
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight="bold">
                    🧾 Order #{order.id}
                  </Typography>

                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.3)" }} />

                <Typography variant="body2">
                  📍 {order.address?.city}, {order.address?.state}
                </Typography>

                <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.3)" }} />

                <Typography variant="body2">
                  Driver: <b>{order.driver_name || "Not Assigned"}</b>
                </Typography>

                <Typography variant="body2">
                  Van: <b>{order.van_number || "Not Assigned"}</b>
                </Typography>

                <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.3)" }} />

                <Typography fontWeight="bold">
                  💰 £{order.grand_total}
                </Typography>

                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    sx={{
                      flex: 1,
                      background: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
                      color: "#000",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                    onClick={() => openProductDialog(order)}
                  >
                    View Products
                  </Button>

                  {order.status !== "DELIVERED" && (
                    <Button
                      variant="contained"
                      sx={{
                        flex: 1,
                        background:
                          order.status === "ASSIGNED"
                            ? "linear-gradient(135deg,#f7971e,#ffd200)" // 🔁 reassign
                            : "linear-gradient(135deg,#43cea2,#185a9d)", // 🚚 assign
                        "&:hover": {
                          transform: "scale(1.03)",
                        },
                      }}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      {order.status === "ASSIGNED"
                        ? "🔁 Re-Assign"
                        : "🚚 Assign"}
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔥 DIALOG */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "#1e1e2f",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>
          🪑 Order #{selectedOrder?.id}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 10, top: 10, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ background: "#1e1e2f", p: 3 }}>
          {selectedOrder?.items?.map((item, i) => (
            <Card
              key={i}
              sx={{
                mb: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg,#2a2a40,#1c1c2e)",
                color: "#fff",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  {/* 🔥 IMAGE SECTION */}
                  <Grid item xs={12} md={5}>
                    {/* MAIN IMAGE */}
                    <img
                      src={
                        item.images?.[0] || "https://via.placeholder.com/300"
                      }
                      alt="main"
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 12,
                        marginBottom: 10,
                      }}
                    />

                    {/* 🔥 THUMBNAILS */}
                    <Box
                      display="flex"
                      gap={1}
                      sx={{
                        overflowX: "auto",
                        "&::-webkit-scrollbar": { display: "none" },
                      }}
                    >
                      {item.images?.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="thumb"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "2px solid transparent",
                            transition: "0.3s",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.border = "2px solid #6dd5ed")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.border = "2px solid transparent")
                          }
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* 🔥 DETAILS */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {item.product_name}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Quantity: {item.quantity}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Price: £{item.price}
                    </Typography>

                    <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />

                    <Typography variant="h6" fontWeight="bold">
                      Total: £{item.total}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.3)" }} />

          <Typography
            textAlign="right"
            fontWeight="bold"
            fontSize={20}
            sx={{
              background: "linear-gradient(90deg,#6dd5ed,#2193b0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Grand Total: £{selectedOrder?.grand_total}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default OrdersPage;
