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
        overflow: "hidden",
        position: "relative",
        background:
          "radial-gradient(circle at top, #667eea, #764ba2, #6dd5ed, #ff9a9e)",
      }}
    >
      {/* 🌈 Floating blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 250,
          height: 250,
          background: "#ff6ec4",
          filter: "blur(120px)",
          top: "10%",
          left: "10%",
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 250,
          height: 250,
          background: "#00c6ff",
          filter: "blur(120px)",
          bottom: "10%",
          right: "10%",
          opacity: 0.5,
        }}
      />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card
          sx={{
            width: 380,
            borderRadius: 4,
            p: 2,
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(25px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <CardContent>
            {/* TITLE */}
            <Typography
              variant="h4"
              textAlign="center"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg,#ff512f,#dd2476,#24c6dc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
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
              />

              {/* BUTTON */}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    mt: 3,
                    py: 1.4,
                    borderRadius: 3,
                    fontWeight: "bold",
                    fontSize: "15px",
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
