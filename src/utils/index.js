export const addSourceLayerToMap = (map, feature, sourceId, layerId, VMIN=250, VMAX=300, colorMap="magma") => {
    if (!map || (sourceExists(map, sourceId) && layerExists(map, layerId))) return;

    const collection = feature.collection; // feature.collection

    // const assets = "rad"; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
    const assets = "cog_default"; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
    let itemId = feature.id;

    const TILE_URL =
        `${process.env.REACT_APP_RASTER_API_URL}/collections/${collection}/items/${itemId}/tiles/WebMercatorQuad/{z}/{x}/{y}@1x` +
        "?assets=" + assets +
        "&bidx=1" +
        "&colormap_name=" + colorMap +
        "&rescale=" + VMIN + "%2C" + VMAX;
        // "&nodata=-9999";

    map.addSource(sourceId, {
        type: "raster",
        tiles: [TILE_URL],
        tileSize: 256,
        bounds: feature.bbox,
    });

    map.addLayer({
        id: layerId,
        type: "raster",
        source: sourceId,
        layout: {
            visibility: 'none',  // Set the layer to be hidden initially
        },
        paint: { }
    });
}

export const addSourcePolygonToMap = (map, feature, polygonSourceId, polygonLayerId) => {
    if (!map || (sourceExists(map, polygonSourceId) && layerExists(map, polygonLayerId))) return;

    map.addSource(polygonSourceId, {
        type: "geojson",
        data: feature
    });

    map.addLayer({
        id: polygonLayerId,
        type: "line",
        source: polygonSourceId,
        layout: {},
        paint: {
            "line-color": "#20B2AA",
            "line-width": 2
        }
    });
}


export const getSourceId = (idx) => {
    return "raster-source-" + idx;
} 

export const getLayerId = (idx) => {
    return "raster-layer-" + idx;
}

export function layerExists(map, layerId) {
    return !!map.getLayer(layerId);
}

export function sourceExists(map, sourceId) {
    return !!map.getSource(sourceId);
}
