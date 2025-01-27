import { styled as styledmui } from '@mui/material/styles';
import styled from "styled-components";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { PlumeCard } from '../card';
import { useEffect, useState } from 'react';

import { CycloneMetas } from '../../assets/dataset/metadata';

import "./index.css";

const drawerWidth = "30rem";

const Main = styledmui('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    /**
     * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
     * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
     * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
     * proper interaction with the underlying content.
     */
    position: 'relative',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: 0,
        },
      },
    ],
  }),
);

const DrawerHeader = styledmui('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;

export function PersistentDrawerRight({open, setOpen, selectedPlumes, plumeMetaData, plumesMap, handleSelectedPlumeCard, setHoveredPlumeId, hoveredPlumeId}) {
  const [ selectedPlumeMetas, setSelectedPlumeMetas ] = useState([]);
  const [ location, setLocation ] = useState("Cyclone Observations");
  const [ numberOfPlumes, setNumberOfPlumes ] = useState(0);

  let VMIN = 0;
  let VMAX = 0.4;
  let colorMap = "plasma";

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Main open={open}>
        <DrawerHeader />
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          marginRight: "5px",
          marginTop: "5px",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            marginRight: "5px",
            marginTop: "5px",
            // height: 'calc(100vh - var(--colorbar-height) - 3.5%)', //colobar is up 3% from bottom
            height: 'calc(100vh - 3.5%)', // 3% up from bottom
            borderRadius: '3px',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader className="drawer-head">
          <HorizontalLayout>
            <Typography
                  variant="h6"
                  component="div"
                  fontWeight="bold"
                  className='drawer-head-content'
            >
              { location }
            </Typography>
          </HorizontalLayout>
        </DrawerHeader>
          { !!CycloneMetas.length &&
            CycloneMetas.map(cycloneMeta => (
              <PlumeCard
                key={cycloneMeta.id}
                title={cycloneMeta.title}
                description={cycloneMeta.description}
              />
            ))
          }
      </Drawer>
    </Box>
  );
}
