import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

export const ScatterometerLegend = () => {
  // List of colors and their corresponding ranges
  const colors = [
    { value: '0', color: '#808080' }, // Gray
    { value: '5', color: '#00BFFF' }, // Light Blue
    { value: '10', color: '#0000FF' }, // Blue
    { value: '15', color: '#00FF00' }, // Green
    { value: '20', color: '#FFFF00' }, // Yellow
    { value: '25', color: '#FFA500' }, // Orange
    { value: '30', color: '#FF0000' }, // Red
    { value: '35', color: '#A52A2A' }, // Brown
    { value: '40', color: '#FF00FF' }, // Magenta
    { value: '45', color: '#800080' }, // Purple
    { value: '50+', color: '#4B0082' }, // Dark Purple
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {/* Render each color box */}
        {colors.map((item, index) => (
          <Grid item key={index} xs={1} sx={{ textAlign: 'center' }}>
            {/* Color box */}
            <Box
              sx={{
                width: 34,
                height: 34,
                backgroundColor: item.color,
                borderRadius: 1,
                marginBottom: 1,
              }}
            />
            {/* Corresponding value */}
            <Typography variant="body2">{item.value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
