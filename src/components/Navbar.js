// src/components/Navbar.js
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const drawerWidth = 240;

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Welcome', path: '/#welcome', type: 'hash' },
    { label: 'Experience', path: '/#experience', type: 'hash' },
    { label: 'Projects', path: '/#projects', type: 'hash' },
    { label: 'Education', path: '/#education', type: 'hash' },
    { label: 'Blog', path: '/blog', type: 'route' }, // Blog is a separate route
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Leonardo Matone
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navLinks.map((item) => {
          const Component = item.type === 'hash' ? HashLink : Link;
          return (
            <ListItem
              button
              key={item.label}
              component={Component}
              to={item.path}
              smooth={item.type === 'hash'} // enables smooth scroll only for HashLinks
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <>
      {/* AppBar to hold menu icon */}
      <Toolbar
        sx={{
          position: 'fixed',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      {/* Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}

export default Navbar;
