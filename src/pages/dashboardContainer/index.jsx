import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard/index.jsx';
import { fetchAllFromSTACAPI, fetchAllFromFeaturesAPI } from "../../services/api";
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
            fullName: "Integrated Multi-satellitE Retrievals for GPM (IMERG)",
            type: "STAC"
        },
        "sst": {
            id: "sst",
            name: "SPoRT SST",
            fullName: "SPoRT Sea Surface Temperature (SST)",
            type: "STAC"
        },
        "cygnss": {
            id: "cygnss",
            name: "CYGNSS",
            fullName: "Cyclone Global Navigation Satellite System (CYGNSS)",
            type: "STAC"
        },
        "goes_radF_l1b_C02": {
            id: "goes_radF_l1b_C02",
            name: "GOES (Channel 2)",
            fullName: "GOES (Channel 2)",
            type: "STAC"
        },
        "goes_radF_l1b_C08": {
            id: "goes_radF_l1b_C08",
            name: "GOES (Channel 8)",
            fullName: "GOES (Channel 8)",
            type: "STAC"
        },
        "goes_radF_l1b_C13": {
            id: "goes_radF_l1b_C13",
            name: "GOES (Channel 13)",
            fullName: "GOES (Channel 13)",
            type: "STAC"
        },
        "modis_mosaic": {
            id: "modis_mosaic",
            name: "MODIS (Band 31)",
            fullName: "MODIS (Band 31)",
            type: "STAC"
        },
        "viirs_mosaic": {
            id: "viirs_mosaic",
            name: "VIIRS (Band I5)",
            fullName: "VIIRS (Band I5)",
            type: "STAC"
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
        "public.wind_vectors": {
            id: "public.wind_vectors",
            name: "Cyclone Wind Barbs Vector",
            fullName: "Cyclone Wind Barbs Vector",
            type: "FEATURES"
        },
        "public.modis_swath": {
            id: "public.modis_swath",
            name: "Modis Swath",
            fullName: "Modis Swath",
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
                DATAPRODUCTS["public.path_point"],
                DATAPRODUCTS["public.path_line"],
                DATAPRODUCTS["public.wind_polygon"],
                DATAPRODUCTS["public.wind_vectors"],
                DATAPRODUCTS["public.modis_swath"]
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

                Object.keys(CYCLONES).forEach((cyclone) => {
                    const { dataProducts, id: cycloneId } = CYCLONES[cyclone];
                    const RasterDataProducts = [];
                    const VectorDataProducts = [];
                    dataProducts.forEach((dp) => {
                        if (dp.type === "FEATURES") {
                            VectorDataProducts.push(dp);
                        } else if (dp.type === "STAC") {
                            RasterDataProducts.push(dp);
                        }
                    });

                    RasterDataProducts.forEach(dataProduct => {
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
                    });

                    VectorDataProducts.forEach(dataProduct => {
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
                    });
                });

                const data = await Promise.allSettled(dataProductsFetchPromises);
                const STACCollectionData = [];
                const STACCollectionItemData = [];
                const FeatureCollectionData = [];
                const FeatureCollectionItemData = [];
                data.forEach(d => {
                    if (!d || !d.value || !d.value.length || d.status==="rejected") return;
                    let sample = d.value[0]
                    if (sample.type === "Collection" && !!sample.item_assets) STACCollectionData.push(d.value)
                    else if (sample.itemType === "feature" && !sample.item_assets) FeatureCollectionData.push(d.value)
                    else if (sample.type === "Feature" && !!sample.assets) STACCollectionItemData.push(d.value)
                    else if (sample.type === "Feature" && !sample.assets) FeatureCollectionItemData.push(d.value)
                });
                const cycloneDictionary = dataTransformationCyclone(STACCollectionData, STACCollectionItemData, FeatureCollectionData, FeatureCollectionItemData);
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
