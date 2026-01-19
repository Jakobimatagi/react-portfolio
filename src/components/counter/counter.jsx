import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        justifyContent: "center",
        mt: 5,
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setCount(count - 1)}
        startIcon={<RemoveIcon />}
      >
        Decrement
      </Button>
      <Typography variant="h4" component="span">
        {count}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setCount(count + 1)}
        startIcon={<AddIcon />}
      >
        Increment
      </Button>
    </Box>
  );
}

export default Counter;
