import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Card from '@mui/material/Card';

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
  return <DiscreteColorBarMapper colorValueMapArray={colors}></DiscreteColorBarMapper>
};

export const BestTrackPointLegend = () => {
  // List of colors and their corresponding ranges
  const colors = [
    { value: "EX", color: '#E1E1E1' },
    { value: "TD", color: '#CCCCCC' },
    { value: "TS", color: '#00C5FF' },
    { value: "C1", color: '#55FF00' },
    { value: "C2", color: '#FFFF73' },
    { value: "C3", color: '#FFAA00' },
    { value: "C4", color: '#E60000' },
    { value: "C5", color: '#FF00C5' },
  ];
  return <DiscreteColorBarMapper colorValueMapArray={colors}></DiscreteColorBarMapper>
};

export const BestTrackLineLegend = () => {
  // List of colors and their corresponding ranges
  const colors = [
    { value: 'path', color: '#000000' },
    { value: 'default', color: '#20B2AA' }
  ];
  return <DiscreteColorBarMapper colorValueMapArray={colors}></DiscreteColorBarMapper>
};

export const WindSwathLegend = () => {
  // List of colors and their corresponding ranges
  const colors = [
    { value: '34', color: '#FFFF73' },
    { value: '50', color: '#FFAA00' },
    { value: '64', color: '#E60000' },
  ];
  return <DiscreteColorBarMapper colorValueMapArray={colors}></DiscreteColorBarMapper>
};

const DiscreteColorBarMapper = ({colorValueMapArray}) => {
  return (
    <Card id="colorbar">
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {/* Render each color box */}
          {colorValueMapArray.map((item, index) => (
            <Grid item key={index} xs={1} sx={{ textAlign: 'center' }}>
              {/* Color box */}
              <Box
                sx={{
                  width: 34,
                  height: 15,
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
    </Card>
  );
}
