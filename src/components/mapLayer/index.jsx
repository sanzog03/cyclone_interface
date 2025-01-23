import { useEffect, useState } from "react";
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, addSourcePolygonToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const MapLayer = ({ dataProduct, rescale, colormap, handleLayerClick, plumeId, hoveredPlumeId, setHoveredPlumeId, startDate }) => {
    const { map } = useMapbox();
    const [VMIN, VMAX] = rescale[0];

    useEffect(() => {
        if (!map || !dataProduct) return;

        const feature = dataProduct;
        const rasterSourceId = getSourceId("raster"+plumeId);
        const rasterLayerId = getLayerId("raster"+plumeId);
        const polygonSourceId = getSourceId("polygon"+plumeId);
        const polygonLayerId = getLayerId("polygon"+plumeId);

        addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId, VMIN, VMAX, colormap);
        addSourcePolygonToMap(map, feature, polygonSourceId, polygonLayerId);

        const onClickHandler = (e) => {
            // handleLayerClick(plumeId);
        }

        const onHoverHandler = (e) => {
            // setHoveredPlumeId(plumeId);
        }

        map.setLayoutProperty(rasterLayerId, 'visibility', 'visible');
        map.on("click", polygonLayerId, onClickHandler);
        map.on("mousemove", polygonLayerId, onHoverHandler);

        return () => {
            // cleanups
            if (map) {
                if (layerExists(map, rasterLayerId)) map.removeLayer(rasterLayerId);
                if (sourceExists(map, rasterSourceId)) map.removeSource(rasterSourceId);
                if (layerExists(map, polygonLayerId)) map.removeLayer(polygonLayerId);
                if (sourceExists(map, polygonSourceId)) map.removeSource(polygonSourceId);
                map.off("click", "clusters", onClickHandler);
            }
        }
    }, [dataProduct, map, handleLayerClick, plumeId, setHoveredPlumeId]);

    useEffect(() => {
        if (!map || !hoveredPlumeId || !plumeId ) return;

        const polygonLayerId = getLayerId("polygon"+plumeId);
        const rasterLayerId = getLayerId("raster"+plumeId);

        if (hoveredPlumeId !== plumeId) {
            // when the plume is not hovered
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#20B2AA');
            }
            if (layerExists(map, rasterLayerId)) {
                map.setLayoutProperty(rasterLayerId, 'visibility', 'none');
            }
        }

        if (hoveredPlumeId === plumeId) {
            // when the plume is hovered
            if (layerExists(map, rasterLayerId)) {
                map.moveLayer(rasterLayerId);
            }
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#0000ff');
            }
        }
    }, [hoveredPlumeId, map, plumeId]);

    return null;
}


export const MapLayers = ({ dataTreeCyclone, plumes, startDate, hoveredPlumeId, showPlumeLayers, handleLayerClick, setHoveredPlumeId, selectedCycloneId, selectedDataProductId }) => {
    const { map } = useMapbox();
    const [ dataProducts, setDataProducts ] = useState();

    useEffect(() => {
        if (!map || !dataTreeCyclone) return

        let dataProducts = selectedDataProductId.length && selectedDataProductId.map(productId => {
            try {
                let temp = dataTreeCyclone["current"][selectedCycloneId]["dataProducts"][productId];

                // *** can change the asset to be shown wrt date time here
                const STACItemBasedOnDate = temp.dataset.getAsset();

                return temp;
            } catch (err) {
                console.error(err);
                return null;
            }
        }).filter(elem => elem);

        setDataProducts(dataProducts);
    }, [startDate, map, dataTreeCyclone, selectedDataProductId, selectedCycloneId])

    return (<>
        {dataProducts && dataProducts.length && dataProducts.map((dataProduct) =>
            <MapLayer
                key={dataProduct.dataset.id}
                plumeId={dataProduct.dataset.id}
                // dataProduct={dataProduct.dataset.representationalAsset}

                // *** can change the asset to be shown wrt date time here
                dataProduct={dataProduct.dataset.getAsset(startDate) || dataProduct.dataset.representationalAsset}

                rescale={dataProduct.rescale}
                colormap={dataProduct.colormap}
                handleLayerClick={handleLayerClick}
                hoveredPlumeId={hoveredPlumeId}
                setHoveredPlumeId={setHoveredPlumeId}
            >
            </MapLayer>
        )}
        </>
    );
}
