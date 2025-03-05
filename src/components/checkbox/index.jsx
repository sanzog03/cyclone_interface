import { useState, useRef, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Tooltip from '@mui/material/Tooltip';

export function DatasetCheckbox({ dataProducts, selectedDataProductIds, setSelectedDataProductIds, selectedDataProductIdsOpacity, setSelectedDataProductIdsOpacity, handleSelectedDatasetForAnimation, setPlumesForAnimation, setOpenDrawer, selectedProductIdForAnimation, setSelectedProductIdForAnimation }) {
    const [checked, setChecked] = useState([]);

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

    return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {Object.keys(dataProducts).map((dataProduct) => {
            const name = dataProducts[dataProduct].name;
            const id = dataProducts[dataProduct].id;
            const labelId = `checkbox-list-label-${id}`;

            return (
            <ListItem
                key={labelId}
                disablePadding
            >
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
                </ListItemButton>
            </ListItem>
            );
        })}
    </List>
    );
}
