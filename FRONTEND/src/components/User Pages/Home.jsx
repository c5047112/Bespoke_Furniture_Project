import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  TextField,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChairIcon from "@mui/icons-material/Chair";
import WeekendIcon from "@mui/icons-material/Weekend";
import KingBedIcon from "@mui/icons-material/KingBed";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";

function Home() {
  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",

        /* 🌈 BACKGROUND ANIMATION */
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
      {/* 🔥 HERO */}
      <Box sx={{ height: "90vh" }}>
        <Swiper loop autoplay={{ delay: 2500 }}>
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <Box
                sx={{
                  height: "90vh",
                  background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Typography variant="h2" fontWeight="bold">
                    Dream Furniture
                  </Typography>

                  <Typography mt={2}>
                    Style • Comfort • Luxury Living
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{
                      mt: 4,
                      borderRadius: 5,
                      px: 5,
                      py: 1.5,
                      background: "linear-gradient(45deg,#ff9800,#ff5722)",
                      "&:hover": { transform: "scale(1.08)" },
                    }}
                    onClick={() => navigate("/products")}
                  >
                    Explore Now
                  </Button>
                </motion.div>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* 🪑 CATEGORY SECTION (SOLID BACKGROUND FOR SEPARATION) */}
      <Box sx={{ py: 10, background: "rgba(0,0,0,0.2)" }}>
        <Container>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#fff"
          >
            Shop by Category
          </Typography>

          <Grid container spacing={4} mt={2}>
            {[
              { name: "Chairs", icon: <ChairIcon sx={{ fontSize: 60 }} /> },
              { name: "Sofas", icon: <WeekendIcon sx={{ fontSize: 60 }} /> },
              { name: "Beds", icon: <KingBedIcon sx={{ fontSize: 60 }} /> },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div whileHover={{ scale: 1.08, y: -10 }}>
                  <Card
                    sx={{
                      height: 280,
                      borderRadius: 5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",

                      background: "#ffffff",
                      color: "#111",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",

                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#667eea,#764ba2)",
                        color: "#fff",
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography variant="h6" fontWeight="bold">
                      {item.name}
                    </Typography>

                    <Typography fontSize="0.9rem" color="gray">
                      Explore premium {item.name.toLowerCase()}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 🔥 TRENDING (GLASS SECTION) */}
      <Box sx={{ py: 10 }}>
        <Container>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#fff"
          >
            Trending Designs
          </Typography>

          <Swiper slidesPerView={3} spaceBetween={20} autoplay loop>
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Box
                    component="img"
                    src={img}
                    sx={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      borderRadius: 4,
                      objectFit: "cover",
                      boxShadow: 6,
                      border: "3px solid rgba(255,255,255,0.3)",
                    }}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>

      {/* 🛋 PRODUCTS */}
      <Box sx={{ py: 10, background: "rgba(0,0,0,0.25)" }}>
        <Container>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#fff"
          >
            Featured Products
          </Typography>

          <Grid container spacing={4} mt={2}>
            {images.map((img, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div whileHover={{ y: -15 }}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "#fff",
                      color: "#111",
                      boxShadow: 8,
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />

                    <CardContent>
                      <Typography fontWeight="bold">
                        Premium Sofa {i + 1}
                      </Typography>

                      <Stack direction="row" spacing={1} mt={1}>
                        <Chip label="New" color="success" size="small" />
                        <Chip label="Hot" color="error" size="small" />
                      </Stack>

                      <Typography mt={1} color="green">
                        ₹ 7,999
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 📩 CONTACT */}
      <Box sx={{ py: 12, display: "flex", justifyContent: "center" }}>
        <Container maxWidth="md">
          <Grid
            container
            spacing={6}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            {/* FORM */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  sx={{
                    p: 5,
                    borderRadius: 5,
                    backdropFilter: "blur(12px)",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    color: "#fff",
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    Get In Touch
                  </Typography>

                  <Typography sx={{ mt: 1, opacity: 0.8 }}>
                    Have questions about our furniture? Send us a message.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Name"
                    sx={{ mt: 3, bgcolor: "#fff", borderRadius: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    sx={{ mt: 2, bgcolor: "#fff", borderRadius: 2 }}
                  />

                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    label="Message"
                    sx={{ mt: 2, bgcolor: "#fff", borderRadius: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: "bold",
                      background: "linear-gradient(135deg,#ff9800,#ff5722)",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    Send Message 🚀
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            {/* IMAGE + TEXT BELOW */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Box mt={4} color="#fff">
                  <motion.img
                    src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0"
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      borderRadius: 20,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                      margin: "auto",
                      display: "block",
                    }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  />

                  <Typography mt={3} variant="h6" fontWeight="bold">
                    Design Your Dream Space 🏡
                  </Typography>

                  <Typography mt={1} sx={{ opacity: 0.8 }}>
                    We help you create a home that reflects your personality.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 🔻 FOOTER */}
      <Box sx={{ background: "#020617", py: 6, color: "white" }}>
        <Container>
          <Typography textAlign="center">© 2026 Furniture Store</Typography>

          <Box textAlign="center" mt={2}>
            <IconButton color="inherit">
              <InstagramIcon />
            </IconButton>
            <IconButton color="inherit">
              <YouTubeIcon />
            </IconButton>
            <IconButton color="inherit">
              <FacebookIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
