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
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { label: "Home", path: "/" },

    ...(user && user.role !== "ADMIN"
      ? [{ label: "Products", path: "/products" }]
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
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 1, sm: 2, md: 4 },
            minHeight: { xs: 60, sm: 70 },
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: {
                xs: "0.95rem",
                sm: "1.1rem",
                md: "1.25rem",
              },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flexGrow: 1,
            }}
          >
            🪑 Bespoke Furniture
          </Typography>

          {/* Mobile / Tablet */}
          {isTablet ? (
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={{ md: 1, lg: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{ fontSize: "0.9rem" }}
                >
                  {item.label}
                </Button>
              ))}

              {!user ? (
                <>
                  <Button color="inherit" onClick={() => navigate("/login")}>
                    Login
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      background: "#ff9800",
                      "&:hover": { background: "#e68900" },
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    Signup
                  </Button>
                </>
              ) : (
                <>
                  {user.role !== "ADMIN" && (
                    <>
                      <IconButton
                        sx={iconStyle}
                        onClick={() => navigate("/wishlist")}
                      >
                        <FavoriteBorderIcon />
                      </IconButton>

                      <IconButton
                        sx={iconStyle}
                        onClick={() => navigate("/cart")}
                      >
                        <ShoppingCartIcon />
                      </IconButton>

                      <IconButton
                        sx={iconStyle}
                        onClick={() => navigate(`/orders/${user.id}`)}
                      >
                        <ReceiptLongIcon />
                      </IconButton>
                    </>
                  )}

                  <Avatar
                    sx={{
                      cursor: "pointer",
                      bgcolor: "#ff9800",
                      width: 38,
                      height: 38,
                    }}
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
                      {user.name} ({user.role})
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

      {/* Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <Box
          sx={{
            width: { xs: 220, sm: 260 },
            pt: 2,
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  toggleDrawer();
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

            <Divider />

            {!user ? (
              <>
                <ListItemButton onClick={() => navigate("/login")}>
                  <ListItemText primary="Login" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/signup")}>
                  <ListItemText primary="Signup" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

const iconStyle = {
  color: "white",
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#2a2a40",
    transform: "scale(1.1)",
  },
};

export default Navbar;
