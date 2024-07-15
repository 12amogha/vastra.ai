import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Grid, Container, Card, CardContent, Typography, CircularProgress, createTheme, ThemeProvider } from '@mui/material';
import LinePlot from './LinePlot';
import BarGraph from './BarGraph';
import ScatterPlot from './ScatterPlot';
import FashionCard from './FashionCard';
import { getHistoricalData, postPredictionRequest } from './services/api';

const currentYear = new Date().getFullYear();
const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });

const locations = [
  'Bangalore', 'Mumbai', 'Ahmedabad', 'Delhi', 'Jaipur', 'Pune',
  'Hyderabad', 'Kolkata', 'Chennai', 'Chandigarh', 'All'
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Purple
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    error: {
      main: '#9c27b0', // Pink
    },
    background: {
      default: '#ffffff', // White background
    },
  },
});

const InputForm = () => {
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(nextMonth);
  const [location, setLocation] = useState('All');
  const [historicalData, setHistoricalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulating a delay of 2 seconds
        setTimeout(async () => {
          const data = await getHistoricalData();
          setHistoricalData(data);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePredictionRequest = async () => {
    try {
      setLoading(true);
      // Simulating a delay of 3 seconds
      setTimeout(async () => {
        const response = await postPredictionRequest({
          "year": year,
          "month": month,
          "geographic_location": location
        });
        setResponseData(response);
        filterData(); // Update filtered data based on response
        setLoading(false); // Turn off loading state after request completes
      }, 3000);

    } catch (error) {
      console.error('Error predicting data:', error);
      setLoading(false); // Ensure loading state is turned off on error
    }
  };

  const filterData = () => {
    let filtered = historicalData.filter(item => {
      const monthMatch = item.month === month;
      const locationMatch = location === 'All' || item.location === location;
      return monthMatch && locationMatch;
    });
    setFilteredData(filtered);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
    filterData();
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    filterData();
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    filterData();
  };

  const scatterData = () => {
    if (responseData) {
      return responseData.top_influencers.map(influencer => ({
        influencer_id: influencer.influencer_id,
        engagement_metrics: influencer.engagement_metrics,
        followers: influencer.followers
      }));
    }
    return [];
  };

  const barData = () => {
    if (responseData) {
      return responseData.top_influencers.map(influencer => ({
        influencer_id: influencer.influencer_id,
        brand_fit_score: influencer.brand_fit_score,
      }));
    }
    return [];
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Year"
              value={year}
              onChange={handleYearChange}
              fullWidth
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i} value={currentYear + i}>
                  {currentYear + i}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Month"
              value={month}
              onChange={handleMonthChange}
              fullWidth
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Location"
              value={location}
              onChange={handleLocationChange}
              fullWidth
            >
              {locations.map((location, index) => (
                <MenuItem key={index} value={location}>
                  {location}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handlePredictionRequest} disabled={loading} sx={{padding:'2px'}}>
              Predict
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Grid container justifyContent="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        )}

        {responseData && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FashionCard trendData={responseData.fashion_trends} location={location} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sales Trend
                  </Typography>
                  <LinePlot data={filteredData} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Influencers
                  </Typography>
                  <ScatterPlot influencerData={scatterData()} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Brand Fit Score
                  </Typography>
                  <BarGraph data={barData()} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default InputForm;
