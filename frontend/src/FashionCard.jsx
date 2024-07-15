// src/components/FashionCard.js
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const FashionCard = ({ trendData, locationName }) => {
    console.log(trendData);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Fashion Trends in {locationName}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography><strong>Brand Name:</strong> {trendData.BrandName}</Typography>
            <Typography><strong>Category:</strong> {trendData.Category}</Typography>
            <Typography><strong>Individual Category:</strong> {trendData.Individual_Category}</Typography>
            <Typography><strong>Material:</strong> {trendData.Material}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Pattern:</strong> {trendData.Pattern}</Typography>
            <Typography><strong>Primary Color:</strong> {trendData.PrimaryColor}</Typography>
            <Typography><strong>Sales Data (units):</strong> {trendData['Sales Data (units)']}</Typography>
            <Typography><strong>Size:</strong> {trendData.Size}</Typography>
            <Typography><strong>Sub-Style:</strong> {trendData['Sub-Style']}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FashionCard;
