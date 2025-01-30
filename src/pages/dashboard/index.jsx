import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import styled from "styled-components";
import moment from "moment";

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayers } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { MapZoom } from '../../components/mapZoom';
import { ColorBar } from '../../components/colorBar';
import { LoadingSpinner } from '../../components/loading';
import { PersistentDrawerRight } from "../../components/drawer";
import { Title } from "../../components/title";
import { Search } from "../../components/search";
import { SelectCyclone } from '../../components/select';
import { DatasetCheckbox } from "../../components/checkbox";
import { FilterByDate } from '../../components/filter';
import { Divider, Typography } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

import "./index.css";
import { MeasurementLayer } from '../../components/measurementLayer';


const HorizontalLayout = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 12px;
`;

const scaleUnits = {
  KM: "km",
  MILES: "mi",
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "90%",
  height: "90%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 2000,
};

const BERYL_START_DATETIME = "2024-06-26";

export function Dashboard({ dataTree, dataTreeCyclone, plumeMetaData, cyclones, dataProducts, zoomLocation, setZoomLocation, zoomLevel, setZoomLevel, loadingData }) {
  // states for data
  const [ selectedCycloneId, setSelectedCycloneId ] = useState(cyclones[Object.keys(cyclones)[0]].id);
  const [ selectedDataProductIds, setSelectedDataProductIds ] = useState([]);
  const [ selectedDataProductIdsOpacity, setSelectedDataProductIdsOpacity ] = useState({}); // [key: string(dataProductId)]: number

  const [startDate, setStartDate] = useState(moment(BERYL_START_DATETIME).format()); // TODO: get this time based on the selected cyclone.

  // for animation
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]); // list of subdaily_plumes used for animation
  const [ VMIN, setVMIN] = useState(250);
  const [ VMAX, setVMAX] = useState(300);
  const [ colorMap, setColorMap ] = useState("magma");
  const [ selectedProductIdForAnimation, setSelectedProductIdForAnimation ] = useState();
  // end for animation

  // for modal

  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // end for modal

  const [ plumes, setPlumes ] = useState([]); // store all available plumes
  const [ selectedRegionId, setSelectedRegionId ] = useState(""); // region_id of the selected region (marker)
  const prevSelectedRegionId = useRef(""); // to be able to restore to previously selected region.
  const [ selectedPlumes, setSelectedPlumes ] = useState([]); // all plumes for the selected region (marker)
  const [ hoveredPlumeId, setHoveredPlumeId ] = useState(""); // plume_id of the plume which was hovered over

  const [ filteredRegions, setFilteredRegions ] = useState([]); // all regions with the filter applied
  const [ filteredSelectedPlumes, setFilteredSelectedPlumes ] = useState([]); // plumes for the selected region with the filter applied

  const [ plumeIds, setPlumeIds ] = useState([]); // list of plume_ids for the search feature.

  const [ showPlumeLayers, setShowPlumeLayers ] = useState(true);

  // states for components/controls
  const [ openDrawer, setOpenDrawer ] = useState(false);
  const [ measureMode, setMeasureMode ] = useState(false);
  const [ clearMeasurementIcon, setClearMeasurementIcon ] = useState(false)
  const [ clearMeasurementLayer, setClearMeasurementLayer ] = useState(false)
  const [ mapScaleUnit, setMapScaleUnit ] = useState(scaleUnits.MILES);

  // handler functions
  const handleSelectedDatasetForAnimation = (dataProductId) => {
    if (!selectedCycloneId || !dataTreeCyclone.current || !dataProductId || !(dataProductId in dataTreeCyclone.current[selectedCycloneId]["dataProducts"])) return;

    setSelectedDataProductIds([]); // reset the layers selected
    setSelectedDataProductIdsOpacity({}) // reset the layers opacity
    // prepare animation
    const stacItemsForAnimation = dataTreeCyclone.current[selectedCycloneId]["dataProducts"][dataProductId].dataset.subDailyAssets;
    const { colormap, rescale } = dataTreeCyclone.current[selectedCycloneId]["dataProducts"][dataProductId];
    const vmin = rescale[0][0];
    const vmax = rescale[0][1];
    setColorMap(colormap);
    setVMIN(vmin);
    setVMAX(vmax);
    setSelectedProductIdForAnimation(dataProductId);
    setPlumesForAnimation(stacItemsForAnimation);
  }

  const handleResetHome = () => {
    setSelectedDataProductIds([]); // reset the layers selected
    setSelectedDataProductIdsOpacity({}) // reset the layers opacity
    setPlumesForAnimation([]); // reset the animation
    setSelectedProductIdForAnimation();
    setOpenDrawer(false);
    setZoomLevel(3);
    setZoomLocation([-78.771556, 32.967243]);
    setStartDate(moment(BERYL_START_DATETIME).format());
  }

  // old ones

  const handleSelectedRegion = (regionId) => {
    if (!dataTree.current || !Object.keys(dataTree.current).length || !regionId) return;
    setSelectedRegionId(regionId); // an useEffect handles it further
    setShowPlumeLayers(true); // all the available plumes layers should be visible when region is selected
    prevSelectedRegionId.current = regionId;
    const region = dataTree.current[regionId];
    setZoomLocation(region.location);
    setZoomLevel(null); // take the default zoom level
    setOpenDrawer(true);
    setSelectedPlumes([]); // reset the plumes shown, to trigger re-evaluation of selected plume
  }

  const handleSelectedPlume = (plumeId) => {
    if (!plumes || !plumeId) return;

    const plume = plumes[plumeId];
    const { location } = plume;
    handleSelectedPlumeSearch(plumeId);
    handleAnimationReady(plumeId);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the plume that was shown
  }

  const handleAnimationReady = (plumeId) => {
    // will make the plume ready for animation.
    if (!plumes || !plumeId) return;

    const plume = plumes[plumeId];
    setPlumesForAnimation(plume.subDailyPlumes);
    // just clear the previous plume layers and not the cards
    setShowPlumeLayers(false);
  }

  const handleSelectedPlumeSearch = (plumeId) => {
    // will focus on the plume along with its plume metadata card
    // will react to update the metadata on the sidedrawer
    if (!plumes || !plumeId) return;
    const plume = plumes[plumeId];
    const { location } = plume;

    setSelectedPlumes([plume]);
    setOpenDrawer(true);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the plume that was shown
    setPlumesForAnimation([]); // to reset the previous animation
  }

  const handleResetToSelectedRegion = () => {
    setHoveredPlumeId("");
    setPlumesForAnimation([]);
    if (!prevSelectedRegionId.current) {
      return handleResetHome();
    }
    handleSelectedRegion(prevSelectedRegionId.current);
  }

  // Component Effects
  useEffect(() => {
    if (!dataTree.current) return;

    const plumes = {}; // plumes[string] = Plume
    const regions = []; // string[]
    const plumeIds = []; // string[] // for search
    Object.keys(dataTree.current).forEach(region => {
      regions.push(dataTree.current[region]);
      dataTree.current[region].plumes.forEach(plume => {
        // check what plume is in dataModels.ts
        plumes[plume.id] = plume;
        plumeIds.push(plume.id);
      });
    });
    setPlumes(plumes);
    setPlumeIds(plumeIds); // for search
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current]);

  useEffect(() => {
    if (!dataTree.current || !selectedRegionId) return;
    const plumes = dataTree.current[selectedRegionId].plumes;
    setSelectedPlumes(plumes);
    setPlumesForAnimation([]); // reset the animation
    setShowPlumeLayers(true); // all the available plumes layers should be visible when region is selected
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current, selectedRegionId]);

  // JSX
  return (
    <Box className="fullSize">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div style={{display: "flex", justifyContent: "flex-end"}}>
            <CloseIcon onClick={handleClose}></CloseIcon>
          </div>
          <iframe
            src="https://deploy-preview-568--visex.netlify.app/stories/cyclones-beryl"
            width="100%"
            height="100%"
            title="Embedded Content"
          />
        </Box>
      </Modal>
      <div id="dashboard-map-container">
        <MainMap>
          <Title>
          <HorizontalLayout>
              <Typography>
                Cyclones
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              <SelectCyclone
                cyclones={cyclones}
                selectedCycloneId={selectedCycloneId}
                setSelectedCycloneId={setSelectedCycloneId}
                setOpenDrawer={setOpenDrawer}
              >
              </SelectCyclone>
           </HorizontalLayout>

            <HorizontalLayout>
              <Typography>
                Data Products
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              {<DatasetCheckbox
                setOpenDrawer={setOpenDrawer}
                setPlumesForAnimation={setPlumesForAnimation}
                dataProducts={dataProducts}
                selectedDataProductIds={selectedDataProductIds}
                setSelectedDataProductIds={setSelectedDataProductIds}
                selectedDataProductIdsOpacity={selectedDataProductIdsOpacity}
                setSelectedDataProductIdsOpacity={setSelectedDataProductIdsOpacity}
                handleSelectedDatasetForAnimation={handleSelectedDatasetForAnimation}
                selectedProductIdForAnimation={selectedProductIdForAnimation}
                setSelectedProductIdForAnimation={setSelectedProductIdForAnimation}
              ></DatasetCheckbox> }
            </HorizontalLayout>

            <HorizontalLayout>
              <Typography>
                Selected Datetime (UTC)
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              <DateTimePicker
                sx={{width: "100%"}}
                label="Selected Datetime (UTC)"
                value={moment(startDate)}
                onChange={(newValue) => {
                    setStartDate(newValue.format())
                  }}
              />
            </HorizontalLayout>

            <HorizontalLayout>
              <PlumeAnimation
                plumes={plumesForAnimation}
                colorMap={colorMap}
                vmin={VMIN}
                vmax={VMAX}
              />
            </HorizontalLayout>
          </Title>
          <MapLayers
            // plumes={filteredSelectedPlumes}
            // handleLayerClick={handleSelectedPlume}
            // hoveredPlumeId={hoveredPlumeId}
            // setHoveredPlumeId={setHoveredPlumeId}
            dataTreeCyclone={dataTreeCyclone}
            selectedCycloneId={selectedCycloneId}
            selectedDataProductIds={selectedDataProductIds}
            startDate={startDate}
            selectedDataProductIdsOpacity={selectedDataProductIdsOpacity}
          />
          <MapControls
            openDrawer={openDrawer}
            measureMode={measureMode}
            onClickHamburger={() => {
              setOpenDrawer((openDrawer) => !openDrawer);
            }}
            onClickMeasureMode={() => {
              setMeasureMode((measureMode) => !measureMode);
            }}
            onClickClearIcon={() => {
              setClearMeasurementLayer(true);
            }}
            clearMeasurementIcon={clearMeasurementIcon}
            mapScaleUnit={mapScaleUnit}
            setMapScaleUnit={setMapScaleUnit}
            handleResetHome={handleResetHome}
            handleResetToSelectedRegion={handleResetToSelectedRegion}
          />
          <MapZoom zoomLocation={zoomLocation} zoomLevel={zoomLevel} />
          <MeasurementLayer
            measureMode={measureMode}
            setMeasureMode={setMeasureMode}
            setClearMeasurementIcon={setClearMeasurementIcon}
            clearMeasurementLayer={clearMeasurementLayer}
            setClearMeasurementLayer={setClearMeasurementLayer}
            mapScaleUnit={mapScaleUnit}
          />
        </MainMap>
        <PersistentDrawerRight
          open={openDrawer}
          setOpen={setOpenDrawer}
          dataTree={dataTreeCyclone}
          selectedCycloneId={selectedCycloneId}
          selectedPlumes={filteredSelectedPlumes}
          plumeMetaData={plumeMetaData}
          plumesMap={plumes}
          handleSelectedPlumeCard={handleSelectedPlume}
          hoveredPlumeId={hoveredPlumeId}
          setHoveredPlumeId={setHoveredPlumeId}
          selectedDataProductIds={selectedDataProductIds}
          dataProductsTemp={dataProducts}
        />
      </div>
      {loadingData && <LoadingSpinner/>}
    </Box>
  );
}
