import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ICONS
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ background: "#1e1e2f" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LOGO */}
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/")}
        >
          🪑 Bespoke Furniture
        </Typography>

        {/* RIGHT SIDE */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* COMMON */}
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
          </Button>

          {/* ================= USER NAV ================= */}
          {user && user.role !== "ADMIN" && (
            <>
              <Button color="inherit" onClick={() => navigate("/products")}>
                Products
              </Button>

              <IconButton onClick={() => navigate("/wishlist")} sx={iconStyle}>
                <FavoriteBorderIcon />
              </IconButton>

              <IconButton onClick={() => navigate("/cart")} sx={iconStyle}>
                <ShoppingCartIcon />
              </IconButton>

              <IconButton
                onClick={() => navigate(`/orders/${user.id}`)}
                sx={iconStyle}
              >
                <ReceiptLongIcon />
              </IconButton>
            </>
          )}

          {/* ================= ADMIN NAV ================= */}
          {user && user.role === "ADMIN" && (
            <>
              <Button
                onClick={() => navigate("/admin-products")}
                color="inherit"
              >
                Products
              </Button>

              <Button onClick={() => navigate("/admin-staff")} color="inherit">
                Staff
              </Button>

              <Button onClick={() => navigate("/admin/vans")} color="inherit">
                Vans
              </Button>
            </>
          )}

          {/* ================= AUTH ================= */}
          {!user ? (
            <>
              <Button onClick={() => navigate("/login")} color="inherit">
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ background: "#ff9800" }}
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </>
          ) : (
            <>
              <Avatar
                sx={{ cursor: "pointer", bgcolor: "#ff9800" }}
                onClick={handleMenuOpen}
              >
                {user.name[0]}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  👤 {user.name} ({user.role})
                </MenuItem>

                {user.role === "ADMIN" && (
                  <MenuItem onClick={() => navigate("/admin-dashboard")}>
                    Dashboard
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const iconStyle = {
  color: "white",
  borderRadius: "50%",
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#2a2a40",
    transform: "scale(1.1)",
  },
};

export default Navbar;
