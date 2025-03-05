import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useMapbox } from "../../context/mapContext";
import { HamburgerControl } from "./hamburger";
import { MeasureDistanceControl } from "./measureDistance";
import { ClearMeasurementControl } from "./clearMeasurement";
import { LayerVisibilityControl } from "./layerVisibility";
import { HomeControl } from "./home";
import { IntensityControl } from "./intensity";

import "./index.css";

export const MapControls = ({
  measureMode,
  onClickHamburger,
  onClickMeasureMode,
  onClickClearIcon,
  clearMeasurementIcon,
  mapScaleUnit,
  handleResetHome,
  openDrawer,
  selectedDataProductIds,
  selectedCycloneId,
  dataTreeCyclone,
  selectedStartDate //needed for the intensity picker tool, to show the intensity of the selected layer
}) => {
  const [ intensityControlEnabled, setIntensityControlEnabled ] = useState(false);
  const { map } = useMapbox();
  const customControlContainer = useRef();

  useEffect(() => {
    if (!map) return;

    const hamburgerControl = new HamburgerControl(onClickHamburger);
    const mapboxNavigation = new mapboxgl.NavigationControl({showCompass: false});
    const layerVisibilityControl = new LayerVisibilityControl();
    const homeControl = new HomeControl(handleResetHome);

    const hamburgerControlElem = hamburgerControl.onAdd(map);
    const homeControlElem = homeControl.onAdd(map);
    // const restoreControlElem = restoreControl.onAdd(map);
    const mapboxNavigationElem = mapboxNavigation.onAdd(map);
    const layerVisibilityControlElem = layerVisibilityControl.onAdd(map);

    const mapboxCustomControlContainer = customControlContainer.current;
    mapboxCustomControlContainer.append(hamburgerControlElem);
    mapboxCustomControlContainer.append(homeControlElem);
    // mapboxCustomControlContainer.append(restoreControlElem);
    mapboxCustomControlContainer.append(mapboxNavigationElem);
    mapboxCustomControlContainer.append(layerVisibilityControlElem);

    return () => {
      // clean ups
        if (hamburgerControl) hamburgerControl.onRemove();
        if (mapboxNavigation) mapboxNavigation.onRemove();
        if (layerVisibilityControl) layerVisibilityControl.onRemove();
        if (homeControl) homeControl.onRemove();
        // if (restoreControl) restoreControl.onRemove();
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const measurementControl = new MeasureDistanceControl(
      measureMode,
      onClickMeasureMode
    );

    if (measurementControl) {
      const mapboxCustomControlContainer = document.querySelector("#mapbox-custom-controls");
      const measurementControlElem = measurementControl.onAdd(map);
      mapboxCustomControlContainer.append(measurementControlElem);
    }

    return () => {
      // clean ups
      if (measurementControl) {
        measurementControl.onRemove();
      }
    };
  }, [map, measureMode]);

  useEffect(() => {
    const unit = mapScaleUnit === "km" ? "metric" : "imperial";
    if (!map) return;
    const scaleControl = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: unit,
    });

    if (scaleControl) {
      map.addControl(scaleControl);
    }

    return () => {
      // clean ups
      if (scaleControl) map.removeControl(scaleControl);
    };
  }, [map, mapScaleUnit, measureMode]);

  useEffect(() => {
    if (!map) return;
    let popup = null;
    let popupElem = null;

    const mouseClickHandler = async (e) => {
      if (popupElem) popupElem.remove();
      // get the value from the pointer
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      let resultHTML = ""

      if (!selectedDataProductIds.length || !selectedCycloneId) {
        resultHTML = "<p>No data products Selected</p>";
      } else {
        const promises = selectedDataProductIds.map((dp) => {
          const dataProductItem = dataTreeCyclone.current[selectedCycloneId]["dataProducts"][dp].dataset.getAsset(selectedStartDate);
          const { assets } = dataTreeCyclone.current[selectedCycloneId]["dataProducts"][dp];
          const { collection: collectionId, id: itemId } = dataProductItem;
          return fetchIntensityData(lng, lat, collectionId, itemId, assets);
        });
        const data = await Promise.all(promises);
        data.forEach((res, idx) => { // assuming the promise.all will retain order
          resultHTML+= `
            <b>${selectedDataProductIds[idx]}</b>
            <div>${res}</div>
            <br>
          `
        });
      }
      // show it in the tooltip
      const el = document.createElement('div');
      popupElem = el;
      el.className = 'marker';
      addTooltip(el, lng, lat, resultHTML);
    }

    const addTooltip = (element, longitude, latitude, text) => {
      let marker = new mapboxgl.Marker(element)
      .setLngLat([longitude, latitude])
      .addTo(map);

      const tooltipContent = text;
      popup = new mapboxgl.Popup({
          closeButton: false,
          anchor: 'bottom'
      }).setHTML(tooltipContent);
      marker.setPopup(popup);
      popup.addTo(map);
      // popup.remove() //TODO: do this on another click.
      return marker;
    }

    const intensityControlClickHandler = () => {
      setIntensityControlEnabled(!intensityControlEnabled);
    }

    if (intensityControlEnabled) {
      map.on("click", mouseClickHandler);
    }

    const intensityControl = new IntensityControl(intensityControlClickHandler, intensityControlEnabled);
    const intensityControlElem = intensityControl.onAdd(map);
    const mapboxCustomControlContainer = customControlContainer.current;
    // Get the reference to the last child
    const lastChild = mapboxCustomControlContainer.lastChild;
    // Insert the new child before the last child
    mapboxCustomControlContainer.insertBefore(intensityControlElem, lastChild);

    return () => {
      if (intensityControl) intensityControl.onRemove();
      if (map) map.off("click", mouseClickHandler);
      if (popup) popup.remove();
    }
  }, [map, intensityControlEnabled, selectedDataProductIds, dataTreeCyclone, dataTreeCyclone.current, selectedStartDate]);

  return (
    <div id="mapbox-custom-controls" ref={customControlContainer} style={{ right: openDrawer ? "30.7rem" : "0.5rem" }}></div>
  );
};

const fetchIntensityData = async (lng, lat, collectionId, itemId, assets) => {
  let resultHTML = "";
  try {
    const url = `http://dev.openveda.cloud/api/raster/collections/${collectionId}/items/${itemId}/point/${lng},${lat}?bidx=1&assets=${assets}&unscale=false&resampling=nearest&reproject=nearest`
    const response = await fetch(url);
    const result = await response.json();
    resultHTML = `
      <div>
        Value: ${result.values[0]} \n
      </div>
      <div>
        Band Name: ${result.band_names}
      </div>
    `;

  } catch(error) {
    resultHTML = "<p>No Data for the clicked location</p>"
  }
  return resultHTML;
}
