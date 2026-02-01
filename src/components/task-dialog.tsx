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
  type: 'text' | 'number' | 'email' | 'select' | 'textarea';
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
}

export default function TaskDialog({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  submitLabel
}: TaskDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
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
            <InputLabel sx={{ color: "#fbbf24" }}>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={{
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fbbf24",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d9a021",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fbbf24",
                },
                "& .MuiSelect-icon": {
                  color: "#fbbf24",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "rgba(0, 0, 0, 0.95)",
                    border: "1px solid #fbbf24",
                    "& .MuiMenuItem-root": {
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(251, 191, 36, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(251, 191, 36, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(251, 191, 36, 0.3)",
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
                color: "#fbbf24",
              },
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "#fbbf24",
                },
                "&:hover fieldset": {
                  borderColor: "#d9a021",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fbbf24",
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
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#fbbf24",
              },
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "#fbbf24",
                },
                "&:hover fieldset": {
                  borderColor: "#d9a021",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fbbf24",
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
          background: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(20px)",
          border: "2px solid #fbbf24",
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle
        sx={{
          color: "#fbbf24",
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
            color: "#999",
            textTransform: "none",
            "&:hover": {
              color: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#fbbf24",
            color: "#000",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#d9a021",
            },
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}