import { useState, useRef, useEffect } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export function SelectCyclone({ cyclones, selectedCycloneId, handleSelectedCycloneId }) {
    const handleChange = (event) => {
      handleSelectedCycloneId(event.target.value);
    };

    const cycloneNames = Object.keys(cyclones);

    return (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCycloneId}
          onChange={handleChange}
          label="Cyclones"
          style={{width: "100%"}}
        >
         { cycloneNames.map(cycloneName => <MenuItem value={cyclones[cycloneName].id}>{cyclones[cycloneName].name}</MenuItem>) } 
        </Select>
    );
}
