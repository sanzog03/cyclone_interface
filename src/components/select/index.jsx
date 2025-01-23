import { useState, useRef, useEffect } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export function SelectCyclone({ cyclones, selectedCyclone, handleSelectedCyclone }) {
    const handleChange = (event) => {
      handleSelectedCyclone(event.target.value);
    };

    const cycloneNames = Object.keys(cyclones);

    return (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCyclone}
          onChange={handleChange}
          label="Cyclones"
          style={{width: "100%"}}
        >
         { cycloneNames.map(cycloneName => <MenuItem value={cyclones[cycloneName].id}>{cyclones[cycloneName].name}</MenuItem>) } 
        </Select>
    );
}
