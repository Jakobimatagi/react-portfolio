import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

interface DialogField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  title: string;
  fields: DialogField[];
  submitLabel: string;
  accentColor?: string;
  initialData?: Record<string, any>;
}

export default function TaskDialog({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  submitLabel,
  accentColor = "#fbbf24",
  initialData = {}
}: TaskDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when dialog opens
  React.useEffect(() => {
    if (open) {
      const initializedData: Record<string, any> = {};
      fields.forEach(field => {
        initializedData[field.name] = initialData[field.name] || "";
      });
      setFormData(initializedData);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const field = fields.find(f => f.name === name);
    if (field && value) {
      const newErrors = { ...errors };
      
      // Email validation
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[name] = 'Please enter a valid email address';
        } else {
          delete newErrors[name];
        }
      }
      
      // Number validation
      if (field.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          newErrors[name] = 'Please enter a valid number';
        } else if (num < 0) {
          newErrors[name] = 'Please enter a positive number';
        } else {
          delete newErrors[name];
        }
      }
      
      // Phone number validation - digits only with optional formatting
      if (field.type === 'phone') {
        const phoneRegex = /^[0-9+\s()-]*$/;
        if (!phoneRegex.test(value)) {
          newErrors[name] = 'Please enter numbers only';
        } else if (value.replace(/[^0-9]/g, '').length < 10) {
          newErrors[name] = 'Phone number must be at least 10 digits';
        } else {
          delete newErrors[name];
        }
      }
      
      // Text/textarea minimum length
      if ((field.type === 'text' || field.type === 'textarea') && field.required) {
        if (value.trim().length < 2) {
          newErrors[name] = `${field.label} must be at least 2 characters`;
        } else {
          delete newErrors[name];
        }
      }
      
      setErrors(newErrors);
    } else if (errors[name]) {
      // Clear error when field is emptied
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.name];
      
      // Required field validation
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Email validation - more comprehensive
      if (field.type === 'email' && value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }

      // Number validation with range check
      if (field.type === 'number' && value) {
        const num = Number(value);
        if (isNaN(num)) {
          newErrors[field.name] = 'Please enter a valid number';
        } else if (num < 0) {
          newErrors[field.name] = 'Please enter a positive number';
        }
      }

      // Phone number validation - digits only with optional formatting
      if (field.type === 'phone' && value) {
        const phoneRegex = /^[0-9+\s()-]*$/;
        const digitsOnly = value.replace(/[^0-9]/g, '');
        
        if (!phoneRegex.test(value)) {
          newErrors[field.name] = 'Please enter numbers only';
        } else if (digitsOnly.length < 10) {
          newErrors[field.name] = 'Phone number must be at least 10 digits';
        } else if (digitsOnly.length > 15) {
          newErrors[field.name] = 'Phone number must not exceed 15 digits';
        }
      }

      // Text minimum length validation
      if ((field.type === 'text' || field.type === 'textarea') && value && field.required) {
        if (value.trim().length < 2) {
          newErrors[field.name] = `${field.label} must be at least 2 characters`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({});
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  const renderField = (field: DialogField) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];

    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth margin="normal" error={!!error}>
            <InputLabel sx={{ color: accentColor }}>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={{
                color: "#000000",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
                "& .MuiSelect-icon": {
                  color: accentColor,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#ffffff",
                    border: `1px solid ${accentColor}`,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    "& .MuiMenuItem-root": {
                      color: "#000000",
                      "&:hover": {
                        backgroundColor: `${accentColor}15`,
                      },
                      "&.Mui-selected": {
                        backgroundColor: `${accentColor}25`,
                        "&:hover": {
                          backgroundColor: `${accentColor}35`,
                        },
                      },
                    },
                  },
                },
              }}
            >
              {field.options?.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <Typography variant="caption" color="error">{error}</Typography>}
          </FormControl>
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            margin="normal"
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            multiline
            rows={3}
            error={!!error}
            helperText={error}
            required={field.required}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#666666",
                "&.Mui-focused": {
                  color: accentColor,
                },
              },
              "& .MuiOutlinedInput-root": {
                color: "#000000",
                "& fieldset": {
                  borderColor: "#cccccc",
                },
                "&:hover fieldset": {
                  borderColor: accentColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: accentColor,
                },
              },
            }}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            margin="normal"
            label={field.label}
            type={field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            inputProps={{
              min: field.type === 'number' ? 0 : undefined,
              step: field.type === 'number' ? 'any' : undefined,
              inputMode: field.type === 'phone' ? 'tel' : field.type === 'number' ? 'decimal' : 'text',
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#666666",
                "&.Mui-focused": {
                  color: accentColor,
                },
              },
              "& .MuiOutlinedInput-root": {
                color: "#000000",
                "& fieldset": {
                  borderColor: "#cccccc",
                },
                "&:hover fieldset": {
                  borderColor: accentColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: accentColor,
                },
              },
            }}
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "#ffffff",
          backdropFilter: "none",
          border: `2px solid ${accentColor}`,
          borderRadius: 2,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        }
      }}
    >
      <DialogTitle
        sx={{
          color: "#000000",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "1.5rem",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {fields.map(field => (
            <Box key={field.name}>
              {renderField(field)}
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: "#666666",
            textTransform: "none",
            "&:hover": {
              color: "#000000",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: accentColor,
            color: "#000000",
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              backgroundColor: accentColor,
              opacity: 0.9,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}