import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Chip,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { isValidUrl, isValidShortcode, isValidDuration } from '../utils/validation';
import logger from '../utils/logger';

const UrlShortener = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const generateShortcode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];
    const newResults = [];
    
    
    urls.forEach((url, index) => {
      const error = {};
      
      if (!url.longUrl) {
        error.longUrl = 'URL is required';
      } else if (!isValidUrl(url.longUrl)) {
        error.longUrl = 'Invalid URL format';
      }
      
      if (url.validity && !isValidDuration(parseInt(url.validity))) {
        error.validity = 'Validity must be a positive integer';
      }
      
      if (url.shortcode && !isValidShortcode(url.shortcode)) {
        error.shortcode = 'Shortcode must be 5-20 alphanumeric characters';
      }
      
      if (Object.keys(error).length > 0) {
        newErrors[index] = error;
      } else {
        
        const shortcode = url.shortcode || generateShortcode();
        const validityMinutes = url.validity ? parseInt(url.validity) : 30;
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60000);
        
        newResults[index] = {
          longUrl: url.longUrl,
          shortUrl: `${window.location.origin}/${shortcode}`,
          shortcode,
          createdAt,
          expiresAt,
          clicks: 0,
          clickData: []
        };
        
        logger.info('URL shortened successfully', {
          longUrl: url.longUrl,
          shortcode,
          validityMinutes
        });
      }
    });
    
    setErrors(newErrors);
    
    if (newResults.length > 0) {
      setResults(newResults.filter(Boolean));
      
   
      const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      const updatedUrls = [...existingUrls, ...newResults.filter(Boolean)];
      localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        URL Shortener
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={url.longUrl}
                  onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
                  error={!!errors[index]?.longUrl}
                  helperText={errors[index]?.longUrl}
                  placeholder="https://example.com"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validity (minutes, optional)"
                  type="number"
                  value={url.validity}
                  onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                  error={!!errors[index]?.validity}
                  helperText={errors[index]?.validity || "Defaults to 30 minutes if empty"}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={10} sm={5}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  value={url.shortcode}
                  onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
                  error={!!errors[index]?.shortcode}
                  helperText={errors[index]?.shortcode || "5-20 alphanumeric characters"}
                />
              </Grid>
              
              <Grid item xs={2} sm={1}>
                {urls.length > 1 && (
                  <IconButton onClick={() => removeUrlField(index)} color="error">
                    <Delete />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Box>
        ))}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={addUrlField}
            disabled={urls.length >= 5}
            startIcon={<Add />}
          >
            Add URL {urls.length >= 5 ? '(Max 5)' : ''}
          </Button>
          
          <Button type="submit" variant="contained" color="primary">
            Shorten URLs
          </Button>
        </Box>
      </Box>
      
      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Shortened URLs
          </Typography>
          
          {results.map((result, index) => (
            <Box key={index} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Original: {result.longUrl}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Short URL:
                </Typography>
                <Chip
                  label={result.shortUrl}
                  clickable
                  onClick={() => window.open(result.shortUrl, '_blank')}
                  color="primary"
                />
              </Box>
              
              <Typography variant="body2" sx={{ mt: 1 }}>
                Expires: {result.expiresAt.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UrlShortener;