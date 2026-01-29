import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const steps = [
  "Personal Information",
  "Contact information",
  "Check and Submit",
];

function StepThrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [canSubmit, setCanSubmit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: "", email: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">Review your information:</Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "left",
              }}
            >
              <Typography>Name: {formData.name}</Typography>
              <Typography>Email: {formData.email}</Typography>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={canSubmit}
                  onChange={(e) => setCanSubmit(e.target.checked)}
                />
              }
              label="I confirm my information is correct"
              sx={{ mt: 2 }}
            />
          </Box>
        );
      default:
        return null;
    }
  }

  function validateStep(step) {
    let errors = { name: "", email: "" };
    if (step === 0) {
      if (!formData.name.trim()) errors.name = "Name is required";
    }
    if (step === 1) {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Email is invalid";
      }
    }
    setFormErrors(errors);
    // Return true if no errors
    return !errors.name && !errors.email;
  }

  function handleNext() {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submit = () => {
    setOpenDialog(true);
  };

  return (
    <Box sx={{ width: "75%", mt: 4, mx: "auto" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, mb: 1 }}>
        {/* TODO: Replace this with your own step content */}
        {getStepContent(activeStep)}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            disabled={!canSubmit}
            onClick={submit}
          >
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={activeStep === steps.length}>
            Next
          </Button>
        )}
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Form Submitted</DialogTitle>
        <DialogContent>Form submitted for {formData.name}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StepThrough;
