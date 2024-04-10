import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import axios from "axios";

const Navbar = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    async function getUserDataFunc() {
      try {
        let id = localStorage.getItem("email");
        const response = await axios.get(
          `http://localhost:3000/api/auth/allData`
        );
        console.log(response.data.user)
        const userName = response.data.user.find(
          (obj) => obj.email === id
        ).name;

        const userRole=response.data.user.find(
          (obj) => obj.email === id
        ).role;

        setUsername(userName);
        setUserRole(userRole);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    getUserDataFunc();
  }, [localStorage.getItem("email")]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          
        Employee Training Management System
        
        </Typography>

        <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
          {username.toUpperCase()} ({userRole.toUpperCase()})
        </Typography>
        <Avatar
          alt="User Avatar"
          src="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png"
          sx={{ marginRight: 2 }}
        />
        <Button onClick={logout} color="inherit">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
