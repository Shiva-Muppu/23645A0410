import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import { ExpandMore, OpenInNew } from '@mui/icons-material';
import logger from '../utils/logger';

const Statistics = () => {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  useEffect(() => {
    
    const urls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    setShortenedUrls(urls);
    
    logger.info('Statistics page loaded', { count: urls.length });
  }, []);

  const handleRedirect = (shortUrl) => {
 
    const updatedUrls = shortenedUrls.map(url => {
      if (url.shortUrl === shortUrl) {
        const clickData = {
          timestamp: new Date(),
          source: 'statistics_page',
          location: 'Unknown' 
        };
        
        return {
          ...url,
          clicks: url.clicks + 1,
          clickData: [...url.clickData, clickData]
        };
      }
      return url;
    });
    
    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    
    logger.info('URL accessed from statistics', { shortUrl });
    
 
    window.open(shortUrl, '_blank');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>
      
      {shortenedUrls.length === 0 ? (
        <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
          No shortened URLs yet. Create some on the homepage!
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shortenedUrls.map((url, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={url.shortUrl}
                        onClick={() => handleRedirect(url.shortUrl)}
                        clickable
                        color="primary"
                        variant="outlined"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRedirect(url.shortUrl)}
                      >
                        <OpenInNew />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(url.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(url.expiresAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={url.clicks}
                      color={url.clicks > 0 ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">View Click Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {url.clickData.length === 0 ? (
                          <Typography variant="body2" color="textSecondary">
                            No clicks recorded yet
                          </Typography>
                        ) : (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {url.clickData.map((click, clickIndex) => (
                                <TableRow key={clickIndex}>
                                  <TableCell>
                                    {new Date(click.timestamp).toLocaleString()}
                                  </TableCell>
                                  <TableCell>{click.source}</TableCell>
                                  <TableCell>{click.location}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default Statistics;