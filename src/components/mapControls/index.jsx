import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMapbox } from "../../context/mapContext";
import { HamburgerControl } from "./hamburger";
import { MeasureDistanceControl } from "./measureDistance";
import { ClearMeasurementControl } from "./clearMeasurement";
import { LayerVisibilityControl } from "./layerVisibility";
import { HomeControl } from "./home";

import "./index.css";

export const MapControls = ({
  measureMode,
  onClickHamburger,
  onClickMeasureMode,
  onClickClearIcon,
  clearMeasurementIcon,
  mapScaleUnit,
  handleResetHome,
  openDrawer
}) => {
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
    if (!map) return;

    const clearMeasurementControl = clearMeasurementIcon
      ? new ClearMeasurementControl(onClickClearIcon)
      : null;

    if (clearMeasurementIcon) {
      const mapboxCustomControlContainer = document.querySelector("#mapbox-custom-controls");
      const clearMeasurementControlElem = clearMeasurementControl.onAdd(map);
      mapboxCustomControlContainer.append(clearMeasurementControlElem);
    }

    return () => {
      // clean ups
      if (clearMeasurementControl && clearMeasurementIcon) {
        clearMeasurementControl.onRemove();
      }
    };
  }, [map, clearMeasurementIcon, measureMode]);

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

  return (
    <div id="mapbox-custom-controls" ref={customControlContainer} style={{ right: openDrawer ? "30.7rem" : "0.5rem" }}></div>
  );
};
