import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Radio,
  Stack,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/address/${user.id}/`);
      setAddresses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async () => {
    try {
      if (
        !form.name ||
        !form.phone ||
        !form.address_line ||
        !form.city ||
        !form.state ||
        !form.pincode
      ) {
        alert("Fill all fields");
        return;
      }

      await axios.post(`${BASE_URL}/api/address/add/`, {
        user: user.id,
        ...form,
      });

      setOpen(false);

      setForm({
        name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
      });

      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,

        /* 🌈 BACKGROUND */
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
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        color="#fff"
      >
        📍 Select Address
      </Typography>

      {/* ADDRESS LIST */}
      {addresses.length === 0 ? (
        <Typography color="#fff" textAlign="center">
          No address found
        </Typography>
      ) : (
        addresses.map((addr) => (
          <Paper
            key={addr.id}
            sx={{
              p: 2,
              mt: 2,
              borderRadius: 4,

              /* ✨ GLASS EFFECT */
              backdropFilter: "blur(12px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",

              color: "#fff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",

              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
              },
            }}
          >
            <Stack direction="row" alignItems="center">
              <Radio
                checked={selected === addr.id}
                onChange={() => setSelected(addr.id)}
                sx={{ color: "#fff" }}
              />

              <Box>
                <Typography fontWeight="bold">{addr.name}</Typography>
                <Typography variant="body2">
                  {addr.address_line}, {addr.city}, {addr.state}
                </Typography>
                <Typography variant="body2">{addr.pincode}</Typography>
                <Typography variant="body2">{addr.phone}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))
      )}

      {/* ADD BUTTON */}
      <Button
        fullWidth
        sx={{
          mt: 4,
          borderRadius: 3,
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.4)",
        }}
        onClick={() => setOpen(true)}
      >
        + Add New Address
      </Button>

      {/* CONTINUE BUTTON */}
      <Button
        variant="contained"
        fullWidth
        disabled={!selected}
        sx={{
          mt: 2,
          borderRadius: 3,
          fontWeight: "bold",
          background: "linear-gradient(135deg,#ff9800,#ff5722)",
        }}
        onClick={() => navigate(`/checkout/${user.id}/${selected}`)}
      >
        Continue to Checkout 🚀
      </Button>

      {/* DIALOG */}
      {/* DIALOG */}
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="xs" // SMALLER SIZE
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
  {/* HEADER */}
  <Box
    sx={{
      height: 100,
      background: "linear-gradient(135deg,#7F5AF0,#00C2FF)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h5" fontWeight="bold">
      📍 Add Address
    </Typography>
  </Box>

  {/* CONTENT */}
  <DialogContent sx={{ p: 3 }}>
    {[
      "name",
      "phone",
      "address_line",
      "city",
      "state",
      "pincode",
    ].map((field) => (
      <TextField
        key={field}
        label={field.replace("_", " ").toUpperCase()}
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          mt: 2,

          /* TEXTBOX STYLE */
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            background: "#fff", // WHITE BACKGROUND
          },

          "& .MuiInputLabel-root": {
            color: "#555",
            fontWeight: 500,
          },

          "& .MuiOutlinedInput-input": {
            color: "#000",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },

          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#7F5AF0",
            },

          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#00C2FF",
              borderWidth: "2px",
            },
        }}
        value={form[field]}
        onChange={(e) =>
          setForm({ ...form, [field]: e.target.value })
        }
      />
    ))}

    {/* BUTTONS */}
    <Stack direction="row" spacing={2} mt={3}>
      <Button
        fullWidth
        variant="outlined"
        sx={{
          borderRadius: "12px",
          color: "#fff",
          borderColor: "#555",

          "&:hover": {
            borderColor: "#fff",
          },
        }}
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: "12px",
          fontWeight: "bold",
          background: "linear-gradient(135deg,#7F5AF0,#00C2FF)",
        }}
        onClick={handleAddAddress}
      >
        Save 🚀
      </Button>
    </Stack>
  </DialogContent>
</Dialog>
    </Box>
  );
}

export default AddressPage;
