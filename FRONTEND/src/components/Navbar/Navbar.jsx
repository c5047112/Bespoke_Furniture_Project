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
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// ICONS
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MenuIcon from "@mui/icons-material/Menu";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: "Home", path: "/" },
    ...(user && user.role !== "ADMIN"
      ? [
          { label: "Products", path: "/products" },
          { label: "Wishlist", path: "/wishlist" },
          { label: "Cart", path: "/cart" },
          { label: "Orders", path: `/orders/${user.id}` },
        ]
      : []),
    ...(user && user.role === "ADMIN"
      ? [
          { label: "Products", path: "/admin-products" },
          { label: "Staff", path: "/admin-staff" },
          { label: "Vans", path: "/admin/vans" },
        ]
      : []),
  ];

  return (
    <>
      <AppBar position="sticky" sx={{ background: "#1e1e2f" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* LOGO */}
          <Typography
            variant="h6"
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
            onClick={() => navigate("/")}
          >
            🪑 Bespoke Furniture
          </Typography>

          {/* MOBILE MENU */}
          {isMobile ? (
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              <Button color="inherit" onClick={() => navigate("/")}>
                Home
              </Button>

              {user && user.role !== "ADMIN" && (
                <>
                  <Button color="inherit" onClick={() => navigate("/products")}>
                    Products
                  </Button>

                  <IconButton
                    onClick={() => navigate("/wishlist")}
                    sx={iconStyle}
                  >
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

              {user && user.role === "ADMIN" && (
                <>
                  <Button
                    onClick={() => navigate("/admin-products")}
                    color="inherit"
                  >
                    Products
                  </Button>
                  <Button
                    onClick={() => navigate("/admin-staff")}
                    color="inherit"
                  >
                    Staff
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/vans")}
                    color="inherit"
                  >
                    Vans
                  </Button>
                </>
              )}

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
          )}
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  toggleDrawer();
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {!user ? (
              <>
                <ListItem button onClick={() => navigate("/login")}>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button onClick={() => navigate("/signup")}>
                  <ListItemText primary="Signup" />
                </ListItem>
              </>
            ) : (
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
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
