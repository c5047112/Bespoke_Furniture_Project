import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Stack,
  Divider,
} from "@mui/material";

function OrderCard({ order, onStart, onComplete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "info";
      case "OUT_FOR_DELIVERY":
        return "warning";
      case "DELIVERED":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        transition: "0.3s",
        background: "linear-gradient(145deg, #ffffff, #f3f6ff)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
        },
      }}
    >
      <CardContent>
        {/* HEADER */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight="bold" fontSize="1.1rem">
            📦 Order #{order.id}
          </Typography>

          <Chip
            label={order.delivery_status}
            color={getStatusColor(order.delivery_status)}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* TOTAL */}
        <Typography fontSize="1rem" fontWeight="600" color="text.secondary">
          💰 Total Amount
        </Typography>

        <Typography fontSize="1.3rem" fontWeight="bold" color="primary.main">
        £ {order.grand_total}
        </Typography>

        {/* ACTIONS */}
        <Box mt={3} display="flex" gap={2}>
          {order.delivery_status === "ASSIGNED" && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => onStart(order.id)}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(135deg,#42a5f5,#478ed1)",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              🚚 Start Delivery
            </Button>
          )}

          {order.delivery_status === "OUT_FOR_DELIVERY" && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => onComplete(order.id)}
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              ✅ Mark Delivered
            </Button>
          )}

          {order.delivery_status === "DELIVERED" && (
            <Chip
              label="Completed"
              color="success"
              sx={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default OrderCard;
