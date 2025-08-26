import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import logger from '../utils/logger';

const Redirect = () => {
  const { shortcode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirectToUrl = () => {
      try {
        // Get all shortened URLs from localStorage
        const urls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
        const urlData = urls.find(url => url.shortcode === shortcode);
        
        if (!urlData) {
          setError('Short URL not found');
          logger.error('Redirect failed - short URL not found', { shortcode });
          return;
        }
        
        // Check if URL has expired
        if (new Date() > new Date(urlData.expiresAt)) {
          setError('This short URL has expired');
          logger.warn('Redirect failed - URL expired', { 
            shortcode, 
            expiresAt: urlData.expiresAt 
          });
          return;
        }
        
        // Record click data
        const updatedUrls = urls.map(url => {
          if (url.shortcode === shortcode) {
            const clickData = {
              timestamp: new Date(),
              source: 'direct_access',
              location: 'Unknown' // In a real app, you'd get this from a geolocation API
            };
            
            return {
              ...url,
              clicks: url.clicks + 1,
              clickData: [...url.clickData, clickData]
            };
          }
          return url;
        });
        
        localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
        
        logger.info('Redirect successful', { 
          shortcode, 
          longUrl: urlData.longUrl 
        });
        
        // Redirect to the original URL
        window.location.href = urlData.longUrl;
        
      } catch (err) {
        setError('An error occurred during redirection');
        logger.error('Redirect failed - unexpected error', { 
          shortcode, 
          error: err.message 
        });
      } finally {
        setLoading(false);
      }
    };

    redirectToUrl();
  }, [shortcode]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Redirecting...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          Please check the URL or contact the website administrator.
        </Typography>
      </Paper>
    );
  }

  return null;
};

export default Redirect;