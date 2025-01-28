import * as d3 from "d3";

const COLOR_MAP = {
    magma: d3.interpolateMagma, //imerg
    reds: d3.interpolateReds, //sst
    bupu_r: d3.interpolateBuPu, //viirs,modis: "viridis"
    viridis: d3.interpolateViridis, //cygnss
    gist_earth: (t) => d3.interpolateGreys(1-t), //goes (reversed)
    default: d3.interpolatePlasma
}

export const createColorbar = (colorbar, VMIN=-92, VMAX=100, STEP=30, colorMap="default") => {
    // Create a color scale using D3
    const colorScale = d3
        .scaleSequential(COLOR_MAP[colorMap])
        .domain([VMIN, VMAX]); // Set VMIN and VMAX as your desired min and max values

    colorbar
        .append("svg")
        .attr("class", "colorbar-svg")
        .append("g")
        .selectAll("rect")
        .data(d3.range(VMIN, VMAX, (VMAX - VMIN) / 100)) // Adjust the number of color segments as needed
        .enter()
        .append("rect")
        .attr("height", 12) // height of the svg color segment portion
        .attr("width", "100%") // Adjust the width of each color segment
        .attr("x", (d, i) => i * 3)
        .attr("fill", (d) => colorScale(d));

    // Define custom scale labels
    const scaleLabels = generateScale(VMIN, VMAX, STEP);

    // Create a container for color labels
    colorbar
        .append("div")
        .attr("class", "colorbar-scale-tick-label-container")
        .selectAll("div")
        .data(scaleLabels)
        .enter()
        .append("div")
        .attr("class", "colorbar-scale-tick-label")
        .text((d) => d); // Set the tick label text
}

function generateScale(min, max, step) {
    const numbers = [];
    for (let i = min; i <= max; i += step) {
        numbers.push(i);
    }
    numbers[numbers.length - 1] += "+";
    return numbers;
}
  