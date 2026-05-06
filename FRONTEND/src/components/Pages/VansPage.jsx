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
} from "@mui/material";
import axios from "axios";

function VansPage() {
  const [vans, setVans] = useState([]);
  const [form, setForm] = useState({
    vehicle_number: "",
    type: "SMALL",
    capacity: "", // ✅ ADDED
  });

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchVans = () => {
    axios
      .get("http://127.0.0.1:8000/api/admin/vans/")
      .then((res) => setVans(res.data.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchVans();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.vehicle_number) {
      alert("Vehicle number required");
      return;
    }

    if (!form.capacity) {
      alert("Capacity required");
      return;
    }

    if (editId) {
      axios
        .put(`http://127.0.0.1:8000/api/admin/vans/${editId}/update/`, form)
        .then(() => {
          fetchVans();
          resetForm();
        });
    } else {
      axios.post("http://127.0.0.1:8000/api/admin/vans/add/", form).then(() => {
        fetchVans();
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setForm({
      vehicle_number: "",
      type: "SMALL",
      capacity: "", // ✅ RESET ADDED
    });
    setEditId(null);
  };

  const handleEdit = (v) => {
    setForm(v);
    setEditId(v.id);
  };

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/admin/vans/${deleteId}/delete/`)
      .then(() => {
        fetchVans();
        setDeleteId(null);
      });
  };

  return (
    <Box
      p={{ xs: 2, sm: 3, md: 4 }}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #eef2ff, #fdf2f8)",
      }}
    >
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        fontSize={{ xs: "1.6rem", md: "2.2rem" }}
      >
        🚚 Van Management
      </Typography>

      {/* FORM CARD */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" mb={2}>
          {editId ? "✏️ Edit Van" : "➕ Add Van"}
        </Typography>

        <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
          <TextField
            label="Vehicle Number"
            name="vehicle_number"
            value={form.vehicle_number}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            name="type"
            value={form.type}
            onChange={handleChange}
            sx={{ minWidth: 140 }}
            fullWidth
          >
            <MenuItem value="SMALL">Small</MenuItem>
            <MenuItem value="LARGE">Large</MenuItem>
          </TextField>

          {/* ✅ CAPACITY FIELD */}
          <TextField
            label="Capacity"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            sx={{ minWidth: 140 }}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              height: 55,
            }}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </Box>
      </Card>

      {/* TABLE */}
      <Paper
        sx={{
          borderRadius: 3,
          overflowX: "auto",
          boxShadow: 3,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ background: "#f1f5f9" }}>
            <TableRow>
              <TableCell>
                <b>Vehicle</b>
              </TableCell>
              <TableCell>
                <b>Type</b>
              </TableCell>
              <TableCell>
                <b>Capacity</b>
              </TableCell>{" "}
              {/* ✅ ADDED */}
              <TableCell>
                <b>Availability</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vans.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.vehicle_number}</TableCell>

                <TableCell>
                  <Chip label={v.type} color="primary" size="small" />
                </TableCell>

                {/* ✅ CAPACITY DISPLAY */}
                <TableCell>{v.capacity}</TableCell>

                <TableCell>
                  <Chip
                    label={v.availability}
                    color={
                      v.availability === "AVAILABLE" ? "success" : "warning"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={1}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEdit(v)}
                      fullWidth
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteId(v.id)}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* DELETE DIALOG */}
      <Dialog open={!!deleteId}>
        <DialogTitle>⚠️ Are you sure you want to delete this van?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VansPage;
