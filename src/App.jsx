import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Carousel } from 'react-bootstrap';
import "./App.css";
// import "./index.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Login from './components/AuthPage/login';
import AboutPage from './components/AuthPage/AboutPage';
import DetectionPage from './components/AuthPage/detection';
import Dashboard from './components/AuthPage/dashboard';
import SignupPage from './components/AuthPage/signup';
import Progress from './components/AuthPage/progress';
import Logout from './components/AuthPage/logout';
import ForgetPassword from './components/AuthPage/ForgetPassword';


function Home() {
  return (
    <div style={{ paddingTop: "10px", paddingBottom: "80px" }}>
    {/* Carousel posts */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="max-w-6xl mx-auto mt-16 px-6">
    <Carousel fade interval={2000} className="mt-5">
      <Carousel.Item>
        <img
          className="d-block mx-auto"
          src="/post1.jpg"  // your first post image
          alt="First slide"
          style={{ height: "400px", objectFit: "cover", width: "100%" }}
        />
        <Carousel.Caption>
          <h3 style={{ color: "black" }} >Scan. Detect. Understand your skin in seconds.</h3>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block mx-auto"
          src="/post2.jpg"  // second post
          alt="Second slide"
          style={{ height: "400px", objectFit: "cover", width: "100%" }}
        />
        <Carousel.Caption>
          <h3 style={{ color: "black" }}>Let AI reveal what your skin really needs</h3>
         
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block mx-auto"
          src="/post3.jpg"  // third post
          alt="Third slide"
          style={{ height: "400px", objectFit: "cover", width: "100%" }}
        />
        <Carousel.Caption>
          <h3 style={{ color: "black" }}>Your journey to clearer skin starts with AcneAI.</h3>
         
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>

  </motion.div>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto px-6 py-16"
        id="get-started">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">AcneAI</h1>
        <p className="text-lg text-gray-700 mb-8">
          Smart AI-powered acne detection and personalized skincare recommendations.
        </p>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto w-full px-6"
        id="how-it-works">

        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
          <CardContent className="p-6 text-center">
            <Upload className="mx-auto mb-4 w-12 h-12 text-indigo-600" />
            <h2 className="text-xl font-semibold mb-2">1. Upload Image</h2>
            <p className="text-gray-600">Upload a clear face photo for accurate acne detection.</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">2. AI Analysis</h2>
            <p className="text-gray-600">Our model processes the image and identifies acne types & severity.</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">3. Get Results</h2>
            <p className="text-gray-600">View personalized skin insights and recommended treatments.</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Get Started Button */}
      <div className="flex justify-center mt-8">
        <NavLink to="/login">
          <Button className="px-8 py-4 text-lg rounded-2xl shadow-md bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300">
            Get Started
          </Button>
        </NavLink>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* Navbar */}
      <Navbar bg="dark" data-bs-theme="dark" expand="lg" fixed="top">
        <Container fluid>
        <Navbar.Brand href="/">
        <img
          src="/logo1.png"  // or import it if it's in src folder: import logo from './logo1.png'
          width="40"
          height="40"
          className="d-inline-block align-top me-2"
          alt="AcneAI Logo"/>
            AcneAI
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto gap-4">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/login">Sign In</Nav.Link>
              <Nav.Link as={NavLink} to="/AboutPage">About Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AboutPage" element={<AboutPage />} />
        <Route path="/detection" element={<DetectionPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />

      </Routes>

      {/* Footer */}
      <footer className="bg-dark text-white w-full fixed bottom-0 py-3 text-center">
        © 2025 AcneAi. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;