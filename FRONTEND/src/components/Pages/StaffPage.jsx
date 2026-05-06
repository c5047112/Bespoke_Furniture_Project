import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogActions,
  Card,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "DRIVER",
  });

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // 🔄 Fetch staff
  const fetchStaff = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/admin/staff/")
      .then((res) => setStaff(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 🧠 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📤 Submit
  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert("Name and Phone required");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
    };

    if (editId) {
      axios
        .put(
          `http://127.0.0.1:8000/api/admin/staff/${editId}/update/`,
          payload
        )
        .then(() => {
          fetchStaff();
          resetForm();
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/admin/staff/add/", payload)
        .then(() => {
          fetchStaff();
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "DRIVER",
    });
    setEditId(null);
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      email: s.email || "",
      phone: s.phone,
      password: "",
      role: s.role,
    });
    setEditId(s.id);
  };

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/admin/staff/${deleteId}/delete/`)
      .then(() => {
        fetchStaff();
        setDeleteId(null);
      });
  };

  return (
    <Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #eef2ff, #fdf2f8)",
      }}
    >
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        👷 Staff Management
      </Typography>

      {/* FORM */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" mb={2}>
          {editId ? "✏️ Edit Staff" : "➕ Add Staff"}
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setForm({ ...form, phone: value });
            }}
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="DRIVER">Driver</MenuItem>
            <MenuItem value="HELPER">Helper</MenuItem>
          </TextField>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ height: 55, fontWeight: "bold" }}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </Box>
      </Card>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 3, overflowX: "auto", boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ background: "#f1f5f9" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>

                  <TableCell>
                    <Chip label={s.role} color="primary" size="small" />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={s.availability}
                      color={
                        s.availability === "AVAILABLE"
                          ? "success"
                          : "warning"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => setDeleteId(s.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* DELETE DIALOG */}
      <Dialog open={!!deleteId}>
        <DialogTitle>Delete staff?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StaffPage;