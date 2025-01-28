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
    const dataTreeCyclone = useRef(null);

    const [ plumeMetaData, setPlumeMetaData ] = useState({});

    const [ loadingData, setLoadingData ] = useState(true);

    // constants
    const DATAPRODUCTS = {
        "IMERG": {
            id: "gpm_imerg",
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
        "GOESC13": {
            id: "goes_16_l1b_C13",
            name: "GOES-16 (C13)"
        },
        "GOESM02": {
            id: "goes_16_l1b_M02",
            name: "GOES-16 (2)"
        },
        "GOESM08": {
            id: "goes_16_l1b_M08",
            name: "GOES-16 (8)"
        },
        "GOESM13": {
            id: "goes_16_l1b_M13",
            name: "GOES-16 (13)"
        },
        "MODIS": {
            id: "modis_mosaic",
            name: "MODIS IR"
        },
        "VIIRS": {
            id: "viirs_mosaic",
            name: "VIRS IR"
        },
    }

    const CYCLONES = {
        "BERYL": {
            id: "beryl",
            name: "Beryl (2024)",
            dataProducts: [ DATAPRODUCTS["IMERG"], DATAPRODUCTS["SPORT"], DATAPRODUCTS["CYGNSS"],
                            DATAPRODUCTS["GOESM02"], DATAPRODUCTS["GOESM08"], DATAPRODUCTS["GOESM13"],
                            DATAPRODUCTS["MODIS"], DATAPRODUCTS["VIIRS"], DATAPRODUCTS["GOESC13"], ]
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
                }));
                const data = await Promise.allSettled(dataProductsFetchPromises);
                const collectionData = [];
                const collectionItemData = [];
                // const data = await Promise.all(Object.entries(dataProductsFetchPromises).map(([key, promise]) => promise.then(value => [key, value])));
                // const jsonData = Object.fromEntries(data)
                data.forEach(d => {
                    console.log(d)
                    if (!d || !d.value || !d.value.length || d.status==="rejected") return;
                    if (d.value[0].type === "Collection") collectionData.push(d.value)
                    else if (d.value[0].type === "Feature") collectionItemData.push(d.value)
                });
                const cycloneDictionary = dataTransformationCyclone(collectionData, collectionItemData)
                console.log(cycloneDictionary)
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
            dataTree={dataTree}
            dataTreeCyclone={dataTreeCyclone}
            plumeMetaData={plumeMetaData}
            cyclones={CYCLONES}
            dataProducts={DATAPRODUCTS}
            loadingData={loadingData}
        />
    );
}
