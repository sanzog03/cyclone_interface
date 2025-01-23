import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard/index.jsx';
import { fetchAllFromSTACAPI } from "../../services/api";
import { dataTransformationPlume, dataTransformationPlumeRegion, dataTransformationCyclone, dataTransformationPlumeMeta, dataTransformationPlumeRegionMeta, metaDatetimeFix } from './helper/dataTransform';
import { PlumeMetas } from '../../assets/dataset/metadata.ts';

export function DashboardContainer() {
    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ zoomLocation, setZoomLocation ] = useState (searchParams.get('zoom-location') || []); // let default zoom location be controlled by map component
    const [ zoomLevel, setZoomLevel ] = useState (searchParams.get('zoom-level') || null); // let default zoom level be controlled by map component

    const dataTree = useRef(null);
    const [ plumeMetaData, setPlumeMetaData ] = useState({});

    const [ loadingData, setLoadingData ] = useState(true);

    // constants
    const DATAPRODUCTS = {
        "IMERG": {
            id: "gpm-imerg",
            name: "IMERG"
        },
        "SPORT": {
            id: "sst",
            name: "SPoRT SST"
        },
        "CYGNSS": {
            id: "cygnss",
            name: "CYGNSS"
        },
        "GOES": {
            id: "",
            name: "GOES-16 (2, 8, 13)"
        },
        "MODIS": {
            id: "",
            name: "MODIS IR/VIRS IR"
        },
    }

    const CYCLONES = {
        "beryl": {
            id: "beryl",
            name: "Beryl (2024)",
            dataProducts: [DATAPRODUCTS["IMERG"], DATAPRODUCTS["SPORT"], DATAPRODUCTS["CYGNSS"], 
                // DATAPRODUCTS["GOES"], DATAPRODUCTS["MODIS"]
            ]
        },
        "milton": {
            id: "milton",
            name: "Milton (2024)",
            dataProducts: []
        },
        "ian": {
            id: "ian",
            name: "Ian (2022)",
            dataProducts: []
        },
        "nicole": {
            id: "nicole",
            name: "Nicole (2022)",
            dataProducts: []
        },
        "ida": {
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
                Object.keys(CYCLONES).forEach((cycloneName => {
                    const { dataProducts } = CYCLONES[cycloneName];
                    dataProducts.forEach(dataProduct => {
                        const collectionId = dataProduct.id + "-cyclone-" + cycloneName;
                        // get all the collection items
                        const collectionItemUrl = `${process.env.REACT_APP_STAC_API_URL}/collections/${collectionId}/items`;
                        const promise = fetchAllFromSTACAPI(collectionItemUrl);
                        dataProductsFetchPromises.push(promise);
                        // dataProductsFetchPromises[cycloneName+"-"+dataProduct.id] = promise;
                    });
                }));
                const data = await Promise.all(dataProductsFetchPromises);
                // const data = await Promise.all(Object.entries(dataProductsFetchPromises).map(([key, promise]) => promise.then(value => [key, value])));
                // const jsonData = Object.fromEntries(data)

                const cycloneDictionary = dataTransformationCyclone(data)
                // dataTree.current = cycloneDictionary;

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
            dataTree={dataTree}
            plumeMetaData={plumeMetaData}
            cyclones={CYCLONES}
            dataProducts={DATAPRODUCTS}
            loadingData={loadingData}
        />
    );
}
