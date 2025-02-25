import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard/index.jsx';
import { fetchAllFromSTACAPI } from "../../services/api";
import { fetchAllFromFeaturesAPI } from "../../services/apiFeatures";
import { dataTransformationCyclone } from './helper/dataTransform';

export function DashboardContainer() {
    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ zoomLocation, setZoomLocation ] = useState (searchParams.get('zoom-location') || []); // let default zoom location be controlled by map component
    const [ zoomLevel, setZoomLevel ] = useState (searchParams.get('zoom-level') || null); // let default zoom level be controlled by map component

    const dataTreeCyclone = useRef(null);

    const [ loadingData, setLoadingData ] = useState(true);

    // constants
    const DATAPRODUCTS = {
        "gpm_imerg": {
            id: "gpm_imerg",
            name: "IMERG",
            fullName: "Integrated Multi-satellitE Retrievals for GPM (IMERG)"
        },
        "sst": {
            id: "sst",
            name: "SPoRT SST",
            fullName: "SPoRT Sea Surface Temperature (SST)"
        },
        "cygnss": {
            id: "cygnss",
            name: "CYGNSS",
            fullName: "Cyclone Global Navigation Satellite System (CYGNSS)"
        },
        "goes_radF_l1b_C02": {
            id: "goes_radF_l1b_C02",
            name: "GOES (Channel 2)",
            fullName: "GOES (Channel 2)"
        },
        "goes_radF_l1b_C08": {
            id: "goes_radF_l1b_C08",
            name: "GOES (Channel 8)",
            fullName: "GOES (Channel 8)"
        },
        "goes_radF_l1b_C13": {
            id: "goes_radF_l1b_C13",
            name: "GOES (Channel 13)",
            fullName: "GOES (Channel 13)"
        },
        "modis_mosaic": {
            id: "modis_mosaic",
            name: "MODIS (Band 31)",
            fullName: "MODIS (Band 31)"
        },
        "viirs_mosaic": {
            id: "viirs_mosaic",
            name: "VIIRS (Band I5)",
            fullName: "VIIRS (Band I5)"
        },
        "public.path_point": {
            id: "public.path_point",
            name: "Cyclone Point Path",
            fullName: "Cyclone Point Path",
            type: "FEATURES"
        },
        "public.path_line": {
            id: "public.path_line",
            name: "Cyclone Line Path",
            fullName: "Cyclone Line Path",
            type: "FEATURES"
        },
        "public.wind_polygon": {
            id: "public.wind_polygon",
            name: "Cyclone Wind Polygon",
            fullName: "Cyclone Wind Polygon",
            type: "FEATURES"
        },
    }

    const CYCLONES = {
        "BERYL": {
            id: "beryl",
            name: "Beryl (2024)",
            dataProducts: [ 
                            DATAPRODUCTS["gpm_imerg"], DATAPRODUCTS["sst"], DATAPRODUCTS["cygnss"],
                            DATAPRODUCTS["goes_radF_l1b_C02"], DATAPRODUCTS["goes_radF_l1b_C08"], DATAPRODUCTS["goes_radF_l1b_C13"],
                            DATAPRODUCTS["modis_mosaic"], 
                            DATAPRODUCTS["viirs_mosaic"],
                            // DATAPRODUCTS["public.path_point"],
                            // DATAPRODUCTS["public.path_line"],
                            DATAPRODUCTS["public.wind_polygon"]
                        ]
        },
        "MILTON": {
            id: "milton",
            name: "Milton (2024)",
            dataProducts: []
        },
        "IAN": {
            id: "ian",
            name: "Ian (2022)",
            dataProducts: []
        },
        "NICOLE": {
            id: "nicole",
            name: "Nicole (2022)",
            dataProducts: []
        },
        "IDA": {
            id: "ida",
            name: "Ida (2021)",
            dataProducts: []
        }
    }

    useEffect(() => {
        setLoadingData(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps

        const fetchData = async () => {
            try {
                const dataProductsFetchPromises = [];
                // const dataProductsFetchPromises = {};
                Object.keys(CYCLONES).forEach((cyclone => {
                    const { dataProducts, id: cycloneId } = CYCLONES[cyclone];
                    dataProducts.forEach(dataProduct => {
                        if (dataProduct.type === "FEATURES") {
                            const collectionId = dataProduct.id + "_cyclone_" + cycloneId;
                            const collectionUrl = `${process.env.REACT_APP_FEATURES_API_URL}/collections/${collectionId}`;
                            const collectionItemUrl = `${collectionUrl}/items`;

                            // get the collection details
                            const collectionPromise = fetch(collectionUrl).then(async metaData => metaData.json()).then(result => [result])
                                                        .catch(err => console.error("Error fetching data: ", err));
                            dataProductsFetchPromises.push(collectionPromise);

                            // get all the collection items
                            const itemPromise = fetchAllFromFeaturesAPI(collectionItemUrl);
                            dataProductsFetchPromises.push(itemPromise);
                        } else { // STAC by default
                            const collectionId = dataProduct.id + "-cyclone-" + cycloneId;
                            const collectionUrl = `${process.env.REACT_APP_STAC_API_URL}/collections/${collectionId}`;
                            const collectionItemUrl = `${collectionUrl}/items`;
    
                            // get the collection details
                            const collectionPromise = fetch(collectionUrl).then(async metaData => metaData.json()).then(result => [result])
                                                        .catch(err => console.error("Error fetching data: ", err));
                            dataProductsFetchPromises.push(collectionPromise);

                            // get all the collection items
                            const itemPromise = fetchAllFromSTACAPI(collectionItemUrl);
                            dataProductsFetchPromises.push(itemPromise);
                            // dataProductsFetchPromises[cycloneName+"-"+dataProduct.id] = promise;
                        }
                    });
                }));
                const data = await Promise.allSettled(dataProductsFetchPromises);
                const collectionData = [];
                const collectionItemData = [];
                // const data = await Promise.all(Object.entries(dataProductsFetchPromises).map(([key, promise]) => promise.then(value => [key, value])));
                // const jsonData = Object.fromEntries(data)
                data.forEach(d => {
                    if (!d || !d.value || !d.value.length || d.status==="rejected") return;
                    if (d.value[0].type === "Collection" || d.value[0].itemType === "feature") collectionData.push(d.value)
                    else if (d.value[0].type === "Feature") collectionItemData.push(d.value)
                });
                const cycloneDictionary = dataTransformationCyclone(collectionData, collectionItemData)
                dataTreeCyclone.current = cycloneDictionary;
                // remove loading
                setLoadingData(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().catch(console.error);
    }, []); // only on initial mount

    return (
        <Dashboard
            zoomLocation={zoomLocation}
            zoomLevel={zoomLevel}
            setZoomLocation={setZoomLocation}
            setZoomLevel={setZoomLevel}
            dataTreeCyclone={dataTreeCyclone}
            cyclones={CYCLONES}
            dataProducts={DATAPRODUCTS}
            loadingData={loadingData}
        />
    );
}
