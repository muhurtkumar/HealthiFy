import { Alert } from "@mui/material";
import React from "react";

const FormAlert = ({ type, message }) => {
  if (!message) return null;
  
  return <Alert severity={type}>{message}</Alert>;
};

export default FormAlert;