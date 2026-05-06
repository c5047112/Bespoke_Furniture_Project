import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/admin/users/")
      .then((res) => {
        if (res.data?.success) {
          setUsers(res.data.data || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔥 VIEW ORDERS
  const handleViewOrders = (user) => {
    setSelectedUser(user);
    setOpen(true);
    setOrders([]);

    axios
      .get(`http://127.0.0.1:8000/api/admin/user-orders/${user.id}/`)
      .then((res) => {
        if (res.data?.success) {
          setOrders(res.data.data || []);
        } else {
          setOrders([]);
        }
      })
      .catch(() => setOrders([]));
  };

  // 👤 VIEW USER DETAILS
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
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
        mb={3}
        color="white"
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          animation: "fadeIn 0.8s ease-in-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(-10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        👥 Users Management
      </Typography>

      {/* TABLE CARD */}
      <Card
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          borderRadius: 3,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          overflowX: "auto",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff" }}>Orders</TableCell>
                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
                  sx={{
                    transition: "0.3s",
                    "&:hover": {
                      background: "rgba(255,255,255,0.1)",
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  <TableCell sx={{ color: "#fff" }}>{u.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{u.email}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{u.phone}</TableCell>

                  <TableCell>
                    <Chip
                      label={u.order_count || 0}
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleViewOrders(u)}
                      sx={{
                        mr: 1,
                        background: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
                        color: "#000",
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      Orders
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewUser(u)}
                      sx={{ color: "#fff", borderColor: "#fff" }}
                    >
                      User
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* ================= ORDERS DIALOG ================= */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          📦 Orders of {selectedUser?.name}
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: "70vh" }}>
          {orders?.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {/* ORDER HEADER */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography fontWeight="bold">Order #{order.id}</Typography>

                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      background:
                        order.status === "DELIVERED"
                          ? "#4caf50"
                          : order.status === "SHIPPED"
                          ? "#2196f3"
                          : "#ff9800",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                {/* ITEMS */}
                <Box>
                  {order.items?.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 0.5,
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Typography>{item.product_name}</Typography>
                      <Typography>
                        {item.quantity} × ₹{item.total}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            ))
          ) : (
            <Typography textAlign="center" mt={3}>
              No Orders Found
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= USER DIALOG ================= */}
      <Dialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            minWidth: { xs: "90%", sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>👤 User Details</DialogTitle>

        <DialogContent>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
            }}
          >
            <Typography sx={{ mb: 1 }}>
              <b>Name:</b> {selectedUser?.name}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <b>Email:</b> {selectedUser?.email}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <b>Phone:</b> {selectedUser?.phone}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <b>Total Orders:</b> {selectedUser?.order_count}
            </Typography>
          </Card>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AdminUsers;
