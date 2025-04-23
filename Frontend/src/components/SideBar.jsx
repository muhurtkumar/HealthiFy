import { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Tooltip, Collapse, ListItemButton } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

const SidebarWrapper = styled('div')(({ theme, variant }) => ({
  width: variant === 'compact' ? 125 : 240,
  height: 'calc(100vh - 64px)',
  position: 'fixed',
  top: 64,
  left: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  overflowX: 'hidden',
  zIndex: 1100,
  transition: 'width 0.3s ease',
}));

const Sidebar = ({ userRole, variant = 'full' }) => {
  const theme = useTheme();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  const [openDoctorsDropdown, setOpenDoctorsDropdown] = useState(false);

  const toggleDoctorsDropdown = () => {
    setOpenDoctorsDropdown(!openDoctorsDropdown);
  };

  const sidebarItems = userRole === "Admin" ? [
    { path: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { 
        label: "Doctors", 
        icon: <MedicalIcon />,
        dropdown: true,
        items: [
          { path: "/admin/doctors/add", label: "Add Doctor" },
          { path: "/admin/doctors/manage", label: "Manage Doctors" },
        ],
      },
    { path: "/admin/patients", label: "Patients", icon: <PeopleIcon /> },
    { path: "/admin/appointments", label: "Appointments", icon: <CalendarIcon /> },
    { path: "/admin/settings", label: "Settings", icon: <SettingsIcon /> },
  ] : [
    { path: "/doctor/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/doctor/appointments", label: "Appointments", icon: <CalendarIcon /> },
    { path: "/doctor/patients", label: "Patients", icon: <PeopleIcon /> },
    { path: "/doctor/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  // Improved active path detection
  const isItemActive = (path) => {
    return location.pathname === path || 
           (path !== "/" && location.pathname.startsWith(path));
  };

  const renderListItem = (item) => {
    const isActive = isItemActive(item.path);
    return (
      <Tooltip 
        title={item.label} 
        placement="right"
        key={`tooltip-${item.path}`}
        disableInteractive
        enterDelay={300}
        enterTouchDelay={100}
      >
        <ListItem 
          button 
          component={NavLink}
          to={item.path}
          selected={isActive}
          onMouseEnter={() => setActiveItem(item.path)}
          onMouseLeave={() => setActiveItem(null)}
          sx={{
            minHeight: 56,
            px: variant === 'compact' ? 1.5 : 2.5,
            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              '& .MuiListItemIcon-root': { 
                color: theme.palette.primary.main 
              },
              '& .MuiListItemText-root': {
                color: theme.palette.primary.main,
                fontWeight: 600
              }
            },
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              '&:not(.Mui-selected)': {
                borderLeft: `4px solid ${theme.palette.action.hover}`
              }
            },
            transition: 'all 0.2s ease',
          }}
          key={item.path}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0, 
              mr: variant === 'compact' ? 1.5 : 3,
              justifyContent: 'center',
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label}
            primaryTypographyProps={{
              variant: 'body2',
              sx: {
                fontSize: variant === 'compact' ? '0.7rem' : '0.875rem',
                lineHeight: 1.2,
                fontWeight: isActive ? 600 : (variant === 'compact' ? 500 : 'normal'),
                color: isActive ? theme.palette.primary.main : 'inherit'
              }
            }}
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          />
        </ListItem>
      </Tooltip>
    );
  };

  return (
    <SidebarWrapper variant={variant}>
      <List>
        {sidebarItems.map((item) => {
          if (item.dropdown) {
            return (
              <div key={item.label}>
                <ListItemButton 
                  onClick={toggleDoctorsDropdown}
                  sx={{
                    minHeight: 56,
                    px: variant === 'compact' ? 1.5 : 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    '& .MuiListItemIcon-root': {
                      minWidth: 0,
                      mr: variant === 'compact' ? 1.5 : 3,
                      justifyContent: 'center',
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: {
                        fontSize: variant === 'compact' ? '0.7rem' : '0.875rem',
                        lineHeight: 1.2,
                        fontWeight: variant === 'compact' ? 500 : 'normal',
                      }
                    }}
                  />
                  {openDoctorsDropdown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
                <Collapse in={openDoctorsDropdown} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items.map((subItem) => {
                      const isSubItemActive = isItemActive(subItem.path);
                      return (
                        <ListItemButton
                          key={subItem.path}
                          component={NavLink}
                          to={subItem.path}
                          selected={isSubItemActive}
                          sx={{
                            pl: variant === 'compact' ? 4 : 6,
                            minHeight: 48,
                            '&.Mui-selected': {
                              backgroundColor: theme.palette.action.selected,
                              borderLeft: `4px solid ${theme.palette.primary.main}`,
                              '& .MuiListItemText-root': {
                                color: theme.palette.primary.main,
                                fontWeight: 600
                              }
                            },
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            }
                          }}
                        >
                          <ListItemText 
                            primary={subItem.label}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: {
                                fontSize: variant === 'compact' ? '0.65rem' : '0.8rem',
                                fontWeight: isSubItemActive ? 600 : 'normal',
                              }
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </div>
            );
          }
          return renderListItem(item);
        })}
      </List>
    </SidebarWrapper>
  );
};

export default Sidebar;