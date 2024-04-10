import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const Assessment = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);

  const handleOpenDialog = async () => {
    try {
      // Fetch data for the dialog here
      const response = await axios.get(
        `http://localhost:3000/api/auth/module`
      );
      // console.log(response);

      const moduleNames = response.data.modules;
      console.log(moduleNames);

      setDialogData(moduleNames);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching data for dialog:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData(null);
  };

  return (
    <>
      <Button onClick={handleOpenDialog} color="inherit">
        Assessment
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assessment Dialog</DialogTitle>
        <DialogContent>
          {/* Display data in the dialog */}
          {dialogData &&
            dialogData.map((item) => (
              <Link to={`/navbar/${item._id}`} key={item._id}>
                <Typography>{item.moduleName}</Typography>
              </Link>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Assessment;
