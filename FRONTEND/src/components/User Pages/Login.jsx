import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        identifier: identifier.trim().toLowerCase(),
        password: password.trim(),
      });

      if (res.data.success) {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        alert("✅ Login Successful!");
        res.data.user.role === "ADMIN"
          ? navigate("/admin-dashboard")
          : navigate("/");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, sm: 3, md: 0 },
        py: { xs: 3, sm: 4, md: 0 },
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #667eea, #764ba2, #6dd5ed, #ff9a9e)",
      }}
    >
      {/* 🌈 Floating blobs */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 120, sm: 180, md: 250 },
          height: { xs: 120, sm: 180, md: 250 },
          background: "#ff6ec4",
          filter: {
            xs: "blur(70px)",
            sm: "blur(90px)",
            md: "blur(120px)",
          },
          top: "10%",
          left: "10%",
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: { xs: 120, sm: 180, md: 250 },
          height: { xs: 120, sm: 180, md: 250 },
          background: "#00c6ff",
          filter: {
            xs: "blur(70px)",
            sm: "blur(90px)",
            md: "blur(120px)",
          },
          bottom: "10%",
          right: "10%",
          opacity: 0.5,
        }}
      />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: {
              xs: "100%",
              sm: 420,
              md: 380,
            },
            maxWidth: "100%",
            borderRadius: 4,
            p: {
              xs: 1,
              sm: 2,
              md: 2,
            },
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(25px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 3,
                md: 3,
              },
            }}
          >
            {/* TITLE */}
            <Typography
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.4rem",
                },
                background: "linear-gradient(90deg,#ff512f,#dd2476,#24c6dc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              textAlign="center"
              fontWeight="bold"
            >
              🪑 Login
            </Typography>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* IDENTIFIER */}
              <TextField
                fullWidth
                label="Email or Phone"
                margin="normal"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                sx={{
                  background: "white",
                  borderRadius: 2,
                }}
                inputProps={{
                  style: {
                    fontSize: window.innerWidth < 600 ? "14px" : "16px",
                  },
                }}
              />

              {/* PASSWORD */}
              <TextField
                fullWidth
                type={show ? "text" : "password"}
                label="Password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  background: "white",
                  borderRadius: 2,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow(!show)}>
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    fontSize: window.innerWidth < 600 ? "14px" : "16px",
                  },
                }}
              />

              {/* BUTTON */}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    mt: 3,
                    py: { xs: 1.2, sm: 1.4 },
                    fontSize: {
                      xs: "14px",
                      sm: "15px",
                      md: "16px",
                    },
                    borderRadius: 3,
                    fontWeight: "bold",
                    color: "white",
                    background:
                      "linear-gradient(90deg,#ff6a00,#ee0979,#00c6ff)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                  }}
                >
                  🚀 Login
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default Login;
