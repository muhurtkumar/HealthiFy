import { Button, CircularProgress } from "@mui/material";
import React from "react";

const SubmitButton = ({ loading, label, fullWidth = true }) => { 
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={loading}
      className={`${fullWidth ? "w-full" : ""} py-3 text-lg`}
      sx={{ minWidth: '200px' }} 
    >
      {loading ? <CircularProgress size={24} /> : label}
    </Button>
  );
};

export default SubmitButton;