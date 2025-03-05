import { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export function DatasetCheckbox({ dataProducts, dataTreeCyclone, selectedCycloneId, selectedDataProductIds, setSelectedDataProductIds, selectedDataProductIdsOpacity, setSelectedDataProductIdsOpacity, handleSelectedDatasetForAnimation, setPlumesForAnimation, setOpenDrawer, selectedProductIdForAnimation, setSelectedProductIdForAnimation, selectedStartDate }) {
    const [checked, setChecked] = useState([]);
    const [ dataProductCorrectedMapping, setDataProductCorrectedMapping ] = useState({});

    const handleToggle = (value) => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
      setSelectedDataProductIds(newChecked);
    };

    useEffect(() => {
        if (!!selectedDataProductIds.length) {
            setOpenDrawer(true);
        } else {
            setOpenDrawer(false);
        }
        setSelectedProductIdForAnimation();//reset
        setChecked(selectedDataProductIds);
    }, [selectedDataProductIds]);

    useEffect(() => {
        if (!selectedProductIdForAnimation) return;
        setChecked([selectedProductIdForAnimation])
    }, [selectedProductIdForAnimation]);

    useEffect(() => {
        // TODO: think of removing this process all together
        const temp = {};
        Object.keys(dataProducts).forEach(dataProduct => {
            temp[`${dataProducts[dataProduct].id}`] = dataProducts[dataProduct];
        });
        setDataProductCorrectedMapping(temp);
    }, [dataProducts, selectedStartDate]);

    return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        { dataTreeCyclone.current && selectedCycloneId && dataTreeCyclone.current[`${selectedCycloneId}`].dataProducts && Object.keys(dataProductCorrectedMapping).length && selectedStartDate ?
          Object.keys(dataTreeCyclone.current[`${selectedCycloneId}`].dataProducts).map((dataProduct) => {
            const name = dataProductCorrectedMapping[dataProduct].name;
            const id = dataProduct;
            const labelId = `checkbox-list-label-${id}`;
            const nearesetDateTime = dataTreeCyclone.current[selectedCycloneId].dataProducts[dataProduct].dataset.getNearestDateTime(selectedStartDate);
            return (
            <ListItem
                key={labelId}
                disablePadding
            >
                {/* <div style={{ display: "flex", flexDirection: "vertical", width: "100%" }}> */}
                <ListItemButton role={undefined} dense>
                    <ListItemIcon>
                        <Checkbox
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(id)
                                setPlumesForAnimation([]);
                            }}
                            edge="start"
                            checked={checked.includes(id)}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <div style={{ display:"flex", width: "100%" }}>
                            <ListItemText sx={{width: "50%"}} id={labelId} primary={name} />
                            <Tooltip title="Play Animation">
                                <PlayArrowIcon
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectedDatasetForAnimation(id);
                                    }}
                                    sx={{width: "20%"}}
                                />
                            </Tooltip>
                            <Tooltip title="Change layer opacity">
                                <Slider
                                    onChange={(event, newValue) => {
                                        event.stopPropagation();
                                        const va = {...selectedDataProductIdsOpacity};
                                        va[id] = newValue
                                        setSelectedDataProductIdsOpacity(va)
                                    }}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    sx={{width: "30%"}}
                                    value={selectedDataProductIdsOpacity[id] || 1}
                                    aria-label="Disabled slider"
                                />
                            </Tooltip>
                        </div>
                        { nearesetDateTime &&
                            <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                                <Typography variant="caption">
                                    {`Datetime (UTC): ${nearesetDateTime}`}
                                </Typography>
                            </div>
                        }
                    </div>
                </ListItemButton>
                {/* </div> */}

            </ListItem>
            );
        }): "Loading..."}
    </List>
    );
}
