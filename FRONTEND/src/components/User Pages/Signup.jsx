import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [show, setShow] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendEmailOTP = async () => {
    await axios.post("http://127.0.0.1:8000/api/auth/send-email-otp/", {
      email: form.email,
    });

    alert("OTP has Shared to the Email");
  };

  const verifyEmailOTP = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/auth/verify-email-otp/",
      { email: form.email, otp: emailOtp }
    );

    if (res.data.success) setEmailVerified(true);
    alert("Email is Verified");
  };

  const registerUser = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/api/auth/register/", form);
    alert("Registered Successfully");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #ff9a9e, #fad0c4, #a18cd1, #fbc2eb)",
        overflow: "hidden", // ✅ NO SCROLL
        position: "relative",
        p: 2,
      }}
    >
      {/* 🌈 Floating Blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          background: "#ff6ec4",
          filter: "blur(100px)",
          top: "10%",
          left: "10%",
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          background: "#7873f5",
          filter: "blur(100px)",
          bottom: "10%",
          right: "10%",
          opacity: 0.5,
        }}
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ zIndex: 1 }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 4,
            p: 2,
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(25px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.3)",
            overflow: "hidden", // ✅ FIX SCROLL
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
              🪑 Create Account
            </Typography>

            {/* STEPPER */}
            <Stepper activeStep={emailVerified ? 1 : 0} sx={{ mt: 2 }}>
              <Step>
                <StepLabel>Email</StepLabel>
              </Step>
              <Step>
                <StepLabel>Register</StepLabel>
              </Step>
            </Stepper>

            {/* FORM */}
            <form onSubmit={registerUser}>
              <Grid container spacing={1} mt={2}>
                {/* NAME */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    onChange={handleChange}
                    sx={{ background: "white", borderRadius: 2 }}
                    required
                  />
                </Grid>

                {/* EMAIL */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    sx={{ background: "white", borderRadius: 2 }}
                    required
                  />
                </Grid>

                <Grid item xs={3}>
                  <Button
                    fullWidth
                    onClick={sendEmailOTP}
                    sx={{
                      height: "100%",
                      background: "linear-gradient(135deg,#43e97b,#38f9d7)",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    OTP
                  </Button>
                </Grid>

                <Grid item xs={3}>
                  <Chip
                    label={emailVerified ? "Verified ✔" : "Pending"}
                    sx={{
                      width: "100%",
                      background: emailVerified
                        ? "linear-gradient(135deg,#00c9ff,#92fe9d)"
                        : "linear-gradient(135deg,#f093fb,#f5576c)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Grid>

                {/* OTP */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    sx={{ background: "white", borderRadius: 2 }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={verifyEmailOTP}
                    sx={{
                      background: "linear-gradient(135deg,#667eea,#764ba2)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Verify
                  </Button>
                </Grid>

                {/* PHONE */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    onChange={handleChange}
                    sx={{ background: "white", borderRadius: 2 }}
                    required
                  />
                </Grid>

                {/* PASSWORD */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type={show ? "text" : "password"}
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    sx={{ background: "white", borderRadius: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShow(!show)}>
                            {show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>
              </Grid>

              {/* SUBMIT */}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  fullWidth
                  type="submit"
                  disabled={!emailVerified}
                  sx={{
                    mt: 3,
                    py: 1.4,
                    borderRadius: 3,
                    fontWeight: "bold",
                    fontSize: "15px",
                    background:
                      "linear-gradient(90deg,#ff6a00,#ee0979,#00c6ff)",
                    color: "white",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  }}
                >
                  🚀 Create Account
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default Signup;
