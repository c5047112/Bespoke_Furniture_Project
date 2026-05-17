import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Paper,
  Divider,
  Stack,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000";

function CheckoutPage() {
  const { userId, addressId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [openOtp, setOpenOtp] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    fetchCheckout();
  }, []);

  const fetchCheckout = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/order/checkout/${userId}/${addressId}/`
    );
    setData(res.data.data);
  };

  const speakSummary = () => {
    if (!data) return;

    const msg = new SpeechSynthesisUtterance(
      `Order summary. Total is ${data.price_details.total} pounds. 
       Tax is ${data.price_details.tax}. 
       Delivery charges are ${data.price_details.delivery}. 
       Discount is ${data.price_details.discount}. 
       Final amount is ${data.price_details.grand_total} pounds.`
    );

    window.speechSynthesis.speak(msg);
  };

  const handleSendOtp = async () => {
    if (!identifier) return alert("Enter email or phone");

    const res = await axios.post(`${BASE_URL}/api/order/send-otp/`, {
      user_id: userId,
      identifier,
    });

    if (res.data.success) {
      alert(res.data.message);
      setOtpSent(true);
    } else {
      alert(res.data.error);
    }
  };

  const handleConfirmOrder = async () => {
    const res = await axios.post(`${BASE_URL}/api/order/confirm/`, {
      user_id: userId,
      address_id: addressId,
      otp,
      identifier,
    });

    if (res.data.success) {
      setOrderId(res.data.order_id);
      alert("Order created ✅");
      setOpenOtp(false);
    } else {
      alert(res.data.error);
    }
  };

  const handlePayment = async () => {
    if (!orderId) return alert("Order not created");

    try {
      const res = await axios.post(`${BASE_URL}/api/payment/dummy/`, {
        order_id: orderId,
        method: paymentMethod,
      });

      if (res.data.success) {
        alert("🎉 Payment Successful");
        navigate(`/orders/${userId}`);
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Payment error");
    }
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background:
          "linear-gradient(-45deg, #667eea, #764ba2, #6dd5ed, #2193b0)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite",

        "@keyframes gradientMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3} color="#fff">
        🛒 Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {data.items.map((item, i) => (
              <Card
                key={i}
                sx={{
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
                  color: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "100%",
                          borderRadius: 10,
                          height: 80,
                          objectFit: "cover",
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Typography>Qty: {item.quantity}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "#FFD700", fontSize: 18 }}
                      >
                        £ {item.total_price}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {/* ADDRESS */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                backdropFilter: "blur(12px)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
                color: "#fff",
              }}
            >
              <Typography fontWeight="bold">📍 Delivery Address</Typography>
              <Divider sx={{ my: 1, borderColor: "#fff" }} />
              <Typography>{data.address.name}</Typography>
              <Typography>{data.address.address}</Typography>
              <Typography>
                {data.address.city}, {data.address.state}
              </Typography>
              <Typography>{data.address.pincode}</Typography>
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 5,
              position: "sticky",
              top: 20,
              backdropFilter: "blur(12px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
              color: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              💰 Price Details
            </Typography>

            <Stack spacing={1}>
              <Typography sx={{ color: "#FFD700" }}>
                Total: £ {data.price_details.total}
              </Typography>
              <Typography sx={{ color: "#FFD700" }}>
                Tax: £ {data.price_details.tax}
              </Typography>
              <Typography sx={{ color: "#FFD700" }}>
                Delivery: £ {data.price_details.delivery}
              </Typography>
              <Typography sx={{ color: "#FF6B6B" }}>
                Discount: £ {data.price_details.discount}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "#fff" }} />

            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#FFD700" }}
            >
              Grand Total: £ {data.price_details.grand_total}
            </Typography>

            {/* BUTTONS */}
            <Button
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 3,
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.5)",
                "&:hover": { background: "rgba(255,255,255,0.1)" },
              }}
              onClick={speakSummary}
            >
              🔊 Hear Details
            </Button>

            {!orderId ? (
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  background: "linear-gradient(135deg,#ff7e5f,#feb47b)",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => setOpenOtp(true)}
              >
                Confirm Order
              </Button>
            ) : (
              <>
                <TextField
                  select
                  fullWidth
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="COD">Cash on Delivery</MenuItem>
                  <MenuItem value="CARD">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                    background: "linear-gradient(135deg,#43cea2,#185a9d)",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={handlePayment}
                >
                  Pay Now 💳
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* OTP DIALOG */}
      {/* OTP DIALOG */}
<Dialog
  open={openOtp}
  onClose={() => setOpenOtp(false)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "24px",
      overflow: "hidden",
      background: "#111827",
      color: "#fff",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    },
  }}
>
  {/* TOP HEADER */}
  <Box
    sx={{
      height: 120,
      background: "linear-gradient(135deg,#7F5AF0,#00C2FF)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    <Typography variant="h4">🔐</Typography>

    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{ mt: 1 }}
    >
      OTP Verification
    </Typography>
  </Box>

  <DialogContent sx={{ p: 4 }}>
    {!otpSent ? (
      <>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Enter your email or phone number to receive OTP
        </Typography>

        <TextField
          fullWidth
          label="Email or Phone"
          variant="outlined"
          size="small"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          sx={{
            mt: 1,

            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#fff",
            },

            "& .MuiOutlinedInput-input": {
              color: "#000",
            },

            "& .MuiInputLabel-root": {
              color: "#666",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },

            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#00C2FF",
                borderWidth: "2px",
              },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.3,
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "15px",
            background:
              "linear-gradient(135deg,#7F5AF0,#00C2FF)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",

            "&:hover": {
              transform: "translateY(-2px)",
              background:
                "linear-gradient(135deg,#6842E3,#00AEEF)",
            },
          }}
          onClick={handleSendOtp}
        >
          Send OTP 🚀
        </Button>
      </>
    ) : (
      <>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Enter the OTP sent to your device
        </Typography>

        <TextField
          fullWidth
          label="Enter OTP"
          variant="outlined"
          size="small"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{
            mt: 1,

            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#fff",
            },

            "& .MuiOutlinedInput-input": {
              color: "#000",
              letterSpacing: "4px",
              fontWeight: "bold",
            },

            "& .MuiInputLabel-root": {
              color: "#666",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },

            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#00C2FF",
                borderWidth: "2px",
              },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.3,
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "15px",
            background:
              "linear-gradient(135deg,#ff7e5f,#feb47b)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",

            "&:hover": {
              transform: "translateY(-2px)",
              background:
                "linear-gradient(135deg,#ff6a4a,#fda763)",
            },
          }}
          onClick={handleConfirmOrder}
        >
          Place Order ✅
        </Button>
      </>
    )}
  </DialogContent>
</Dialog>
    </Box>
  );
}

export default CheckoutPage;
