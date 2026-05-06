import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [vans, setVans] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVan, setSelectedVan] = useState("");

  useEffect(() => {
    fetchOrder();
    fetchResources();
  }, []);

  const fetchOrder = () => {
    axios
      .get(`http://127.0.0.1:8000/api/admin/orders/${id}/`)
      .then((res) => setOrder(res.data.data));
  };

  const fetchResources = () => {
    axios
      .get("http://127.0.0.1:8000/api/admin/staff/")
      .then((res) => setDrivers(res.data.data));

    axios
      .get("http://127.0.0.1:8000/api/admin/vans/")
      .then((res) => setVans(res.data.data));
  };

  const handleAssign = () => {
    axios
      .post(`http://127.0.0.1:8000/api/admin/orders/${id}/assign/`, {
        driver_id: selectedDriver,
        van_id: selectedVan,
      })
      .then(() => {
        alert("✅ Assigned Successfully");
        fetchOrder();
      });
  };

  if (!order) return <p>Loading...</p>;

  return (
    <Fade in timeout={600}>
      <Box
        p={4}
        sx={{
          minHeight: "100vh",
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
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="contained"
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg,#667eea,#764ba2)",
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Typography variant="h4" fontWeight="bold" color="white">
            📦 Order #{order.id}
          </Typography>
        </Stack>

        {/* SUMMARY */}
        <Card
          sx={{
            mt: 3,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.8)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            transition: "0.3s",
            "&:hover": { transform: "scale(1.01)" },
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Status</Typography>
                <Chip label={order.status} color="primary" sx={{ mt: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography>Delivery</Typography>
                <Chip
                  label={order.delivery_status}
                  color="secondary"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography>Driver</Typography>
                <Typography fontWeight="bold">
                  {order.driver_name || "Not Assigned"}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Van</Typography>
                <Typography fontWeight="bold">
                  {order.van_number || "Not Assigned"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* PRODUCTS */}
        <Typography variant="h6" mt={4} mb={2} color="white">
          🪑 Products
        </Typography>

        <Grid container spacing={3}>
          {order.items?.map((item, i) => {
            const imageUrl = item.images?.[0]?.startsWith("http")
              ? item.images[0]
              : `http://127.0.0.1:8000${item.images?.[0]}`;

            return (
              <Grid item xs={12} md={6} key={i}>
                <Card
                  sx={{
                    borderRadius: 4,
                    backdropFilter: "blur(12px)",
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    transition: "0.4s",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.03)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        src={imageUrl || "https://via.placeholder.com/150"}
                        variant="rounded"
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: 3,
                          border: "2px solid #667eea",
                        }}
                        imgProps={{ style: { objectFit: "cover" } }}
                      />

                      <Box>
                        <Typography fontWeight="bold">
                          {item.product_name}
                        </Typography>

                        <Typography variant="body2">
                          Qty: {item.quantity}
                        </Typography>

                        <Typography variant="body2">
                          Price: £{item.price}
                        </Typography>

                        <Typography fontWeight="bold">
                          Total: £{item.total}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* BILL */}
        <Card
          sx={{
            mt: 4,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <CardContent>
            <Typography variant="h6">💰 Billing</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography>Total: £{order.total_price}</Typography>
            <Typography>Tax: £{order.tax}</Typography>
            <Typography>Delivery: £{order.delivery_charge}</Typography>
            <Typography>Discount: £{order.discount}</Typography>

            <Typography
              fontWeight="bold"
              fontSize={20}
              mt={2}
              sx={{
                background: "linear-gradient(90deg,#6dd5ed,#2193b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Grand Total: £{order.grand_total}
            </Typography>
          </CardContent>
        </Card>

        {/* ASSIGN */}
        {order.status !== "DELIVERED" && (
          <Card
            sx={{
              mt: 4,
              borderRadius: 4,
              backdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <CardContent>
              <Typography variant="h6">
                {order.status === "ASSIGNED"
                  ? "🔁 Re-Assign Order"
                  : "🚚 Assign Order"}
              </Typography>

              <Stack direction="row" spacing={2} mt={2}>
                <FormControl fullWidth>
                  <InputLabel>Driver</InputLabel>
                  <Select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                  >
                    {drivers.map((d) => {
                      const isBusy = d.availability !== "AVAILABLE";
                      return (
                        <MenuItem key={d.id} value={d.id} disabled={isBusy}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <span>{d.name}</span>
                            <Chip
                              label={isBusy ? "Busy" : "Available"}
                              color={isBusy ? "error" : "success"}
                              size="small"
                            />
                          </Stack>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Van</InputLabel>
                  <Select
                    value={selectedVan}
                    onChange={(e) => setSelectedVan(e.target.value)}
                  >
                    {vans.map((v) => {
                      const isBusy = v.availability !== "AVAILABLE";
                      return (
                        <MenuItem key={v.id} value={v.id} disabled={isBusy}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <span>{v.vehicle_number}</span>
                            <Chip
                              label={isBusy ? "In Use" : "Available"}
                              color={isBusy ? "error" : "success"}
                              size="small"
                            />
                          </Stack>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>

              <Button
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  transition: "0.3s",
                  background:
                    order.status === "ASSIGNED"
                      ? "linear-gradient(135deg,#f7971e,#ffd200)"
                      : "linear-gradient(135deg,#43cea2,#185a9d)",
                  "&:hover": { transform: "scale(1.03)" },
                }}
                variant="contained"
                disabled={!selectedDriver || !selectedVan}
                onClick={handleAssign}
              >
                {order.status === "ASSIGNED"
                  ? "🔁 Re-Assign"
                  : "🚀 Assign Order"}
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Fade>
  );
}

export default OrderDetailsPage;
