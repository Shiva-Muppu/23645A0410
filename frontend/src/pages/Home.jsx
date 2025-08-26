import React from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import UrlShortener from '../components/UrlShortener';
import Statistics from '../components/Statistics';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Home = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="URL Shortener" />
        <Tab label="Statistics" />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        <UrlShortener />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Statistics />
      </TabPanel>
    </Container>
  );
};

export default Home;