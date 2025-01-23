import { useState, useRef, useEffect } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export function SelectCyclone({ cyclones, handleSelectedCyclone }) {
    const [cyclone, setCyclone] = useState("Beryl");

    const handleChange = (event) => {
      handleSelectedCyclone(event.target.value);
    };

    return (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={cyclone}
          onChange={handleChange}
          label="Cyclones"
          style={{width: "100%"}}
        >
          <MenuItem value={"Beryl"}>Beryl (2024)</MenuItem>
          <MenuItem value={"Milton"}>Milton (2024)</MenuItem>
          <MenuItem value={"Ian"}>Ian (2022)</MenuItem>
          <MenuItem value={"Nicole"}>Nicole (2022)</MenuItem>
          <MenuItem value={"Ida"}>Ida (2021)</MenuItem>
        </Select>
    );
}
