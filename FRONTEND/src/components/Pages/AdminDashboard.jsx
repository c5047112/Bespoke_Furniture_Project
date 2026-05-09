import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import BoltIcon from "@mui/icons-material/Bolt";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate, user]);

  // 📊 FETCH DATA
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/admin/dashboard/")
      .then((res) => {
        if (res.data.success) setData(res.data.data);
      })
      .catch(console.error);
  }, []);

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
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" mb={4} color="white">
        👑 Admin Dashboard
      </Typography>

      {/* STATS */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            icon={<PeopleIcon />}
            title="Users"
            value={data?.total_users}
            gradient="#3b82f6"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            icon={<InventoryIcon />}
            title="Products"
            value={data?.total_products}
            gradient="#22c55e"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            icon={<ShoppingCartIcon />}
            title="Orders"
            value={data?.total_orders}
            gradient="#f59e0b"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            icon={<PeopleIcon />}
            title="Staff"
            value={data?.total_staff}
            gradient="#ec4899"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            icon={<BoltIcon />}
            title="Vans"
            value={data?.total_vans}
            gradient="#14b8a6"
          />
        </Grid>
      </Grid>

      {/* ORDER FLOW */}
      <Box mt={10}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="white">
          📦 Order Flow
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FlowChip label="Pending" color="warning" />
            <FlowChip label="Confirmed" color="info" />
            <FlowChip label="Assigned" color="primary" />
            <FlowChip label="Shipped" color="secondary" />
            <FlowChip label="Delivered" color="success" />
          </Stack>
        </Card>
      </Box>

      {/* RECENT ORDERS */}
      <Box mt={10}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="white">
          🕒 Recent Orders
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
          }}
        >
          {data?.recent_orders?.length ? (
            data.recent_orders.map((order) => (
              <Box
                key={order.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Box>
                  <Typography fontWeight="bold">
                    🧾 Order #{order.id}
                  </Typography>
                  <Typography fontSize="0.9rem" sx={{ opacity: 0.8 }}>
                    {order.customer_name}
                  </Typography>
                </Box>

                <Chip label={order.status} />

                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
                    color: "#000",
                  }}
                  onClick={() => navigate("/admin/orders")}
                >
                  Manage
                </Button>
              </Box>
            ))
          ) : (
            <Typography>No recent orders</Typography>
          )}
        </Card>
      </Box>

      {/* QUICK ACTIONS */}
      <Box mt={10}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="white">
          ⚡ Quick Actions
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <ActionCard
              title="Products"
              icon={<InventoryIcon />}
              onClick={() => navigate("/admin-products")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ActionCard
              title="Staff"
              icon={<PeopleIcon />}
              onClick={() => navigate("/admin-staff")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ActionCard
              title="Vans"
              icon={<BoltIcon />}
              onClick={() => navigate("/admin/vans")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ActionCard
              title="Orders"
              icon={<ShoppingCartIcon />}
              onClick={() => navigate("/admin/orders")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ActionCard
              title="Users"
              icon={<PeopleIcon />}
              onClick={() => navigate("/admin-users")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

/* ================= DASHBOARD CARD ================= */
function DashboardCard({ icon, title, value, gradient }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.15)",
        color: "#fff",
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <CardContent>
        <Box
          sx={{
            background: gradient,
            width: 50,
            height: 50,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 1,
          }}
        >
          {icon}
        </Box>

        <Typography>{title}</Typography>
        <Typography variant="h4" fontWeight="bold">
          {value || 0}
        </Typography>
      </CardContent>
    </Card>
  );
}

/* ================= FLOW CHIP ================= */
function FlowChip({ label, color }) {
  return (
    <Chip
      label={label}
      color={color}
      sx={{ px: 2, py: 1, fontWeight: "bold" }}
    />
  );
}

/* ================= ACTION CARD ================= */
function ActionCard({ title, icon, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        p: 3,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: 4,
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.15)",
        color: "#fff",
        transition: "0.3s",
        "&:hover": {
          transform: "scale(1.08)",
          background: "rgba(255,255,255,0.25)",
        },
      }}
    >
      <Box mb={1}>{icon}</Box>
      <Typography fontWeight="bold">{title}</Typography>
    </Card>
  );
}

export default AdminDashboard;
