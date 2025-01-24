import moment from "moment";
import { PlumeRegion, Plume, SubDailyPlume, PlumeMeta, PlumeRegionMeta } from "../../../dataModel";
import { STACItem, STACCollection } from "../../../dataModel";

import { SubDailyAsset, CycloneDataset, SatelliteSystem, DataProduct, Cyclone, CycloneMap } from "../../../dataModel"

// NEW!!!

interface CollectionDictionary {
    [key: string]: STACCollection
}

export function dataTransformationCyclone(collections: STACCollection[][], items: STACItem[][], satelliteName: string="GOES", cycloneName: string="Beryl") {
    // transforms the data from STAC api to Cyclone models.
    const cycloneDictionary: CycloneMap = {};
    
    const collectionDictionary: CollectionDictionary = {};     

    collections.forEach((collectionArr: STACCollection[]) => {
        collectionArr.forEach((collection: STACCollection) => {
            const collectionId = collection.id
            if (!(collectionId in collectionDictionary)) {
                collectionDictionary[collectionId] = collection;
            }
        });
    });

    items.forEach((items: STACItem[]) => {
        const collectionName = items[0].collection; // <satellite/data_product>-cyclone-<cyclone_name>
        const acc = collectionName.split("-");
        const lenAcc = acc.length;
        const dataProductNameArr = acc.slice(0, lenAcc-2)

        const cycloneName = acc[lenAcc-1];
        const dataProductName = dataProductNameArr.join("-");

        // sort by data by time
        const sortedData = items.sort((prev: STACItem, next: STACItem): number => {
            const prev_date = new Date(prev.properties.datetime).getTime();
            const next_date = new Date(next.properties.datetime).getTime();
            return prev_date - next_date;
        });

        // create CycloneDataset
        let [lon, lat] = sortedData[0].geometry.coordinates[0][0];
        const cycloneDataset: CycloneDataset = {
            id: dataProductName+"-cyclone-"+cycloneName,
            satellite: dataProductName,
            representationalAsset: sortedData[(0)],
            location: [lon, lat],
            startDate: sortedData[0].properties.datetime,
            endDate: sortedData[sortedData.length - 1].properties.datetime,
            subDailyAssets: [...sortedData],
            getAsset: (dateTime: string) => {
                if (!dateTime) return cycloneDataset.subDailyAssets[0];
                const dateTimeNoTimezone = moment(dateTime).format('YYYY-MM-DD HH:mm:ss'); // remove the timezone information that might
                // be attached with the target datetime
                const index = findNearestDatetimeIndex(cycloneDataset.subDailyAssets, dateTimeNoTimezone)
                const nearestAsset: STACItem = cycloneDataset.subDailyAssets[index];
                return nearestAsset;
            },
        };
        
        // create DataProduct
        const dataProduct:DataProduct = {
            id: dataProductName+"-cyclone-"+cycloneName,
            name: dataProductName,
            dataset: cycloneDataset,
            description: collectionDictionary[collectionName].description,
            datetimes: collectionDictionary[collectionName].summaries.datetime,
            rescale: collectionDictionary[collectionName].renders.dashboard.rescale,
            colormap: collectionDictionary[collectionName].renders.dashboard.colormap_name,
        }

        if (!(cycloneName in cycloneDictionary)) {
            // Create Cyclone
            const cyclone:Cyclone = {
                id: "cyclone-"+cycloneName,
                name: cycloneName,
                dataProducts: {}
            }
            cycloneDictionary[cycloneName] = cyclone;
        }
        cycloneDictionary[cycloneName]["dataProducts"][`${dataProductName}`] = dataProduct;
    });

    return cycloneDictionary;
}

function findNearestDatetimeIndex(sortedStacItems: STACItem[], targetDatetime: string) {
    let l=0;
    let r=sortedStacItems.length - 1;

    const momentTargetDatetime = moment.utc(targetDatetime, 'YYYY-MM-DD HH:mm:ss'); // ignore the timezone information that might be 
    // attached with the target datetime and treat it as utc offset. Its for a fair comparision as the datasets datetime is in UTC.
    let momentLeftIdxDatetime = moment(sortedStacItems[l].properties.datetime);
    let momentRightIdxDatetime = moment(sortedStacItems[r].properties.datetime);

    // edge cases
    if (momentTargetDatetime <= momentLeftIdxDatetime) {
        return l;
    }
    if (momentTargetDatetime >= momentRightIdxDatetime) {
        return r;
    }

    let minNearestNeighbourScore = Infinity;
    let nearestNeighborIdx = 0;

    while (l <= r) {
        const mid = Math.floor((r + l) / 2);
        const midDatetime = sortedStacItems[mid].properties.datetime;
        const momentMidDatetime = moment(midDatetime);

        if (momentMidDatetime === momentTargetDatetime) {
            return mid;
        }
        // else
        if (momentTargetDatetime < momentMidDatetime) {
            // go left
            r = mid-1;
        } else {
            // go right
            l = mid+1
        }
        // also find the nearest neighbour (in the context of datetime)
        let neighbourScore = Math.abs(momentTargetDatetime.diff(momentMidDatetime));
        if (neighbourScore < minNearestNeighbourScore) {
            minNearestNeighbourScore = neighbourScore;
            nearestNeighborIdx = mid;
        }
    }
    // if no exact match found
    return nearestNeighborIdx;
}

// old stuffs below

interface PlumeRegionMap {
    [key: string]: PlumeRegion;
}

interface PlumeMap {
    [key: string]: Plume;
}

type DataTree = PlumeRegionMap;

export function dataTransformationPlume(data: STACItem[], plumeMetaData: PlumeMetaMap): PlumeMap {
    // format of FeatureCollection Id: <something>_<region>_<plumeid>_<datetime>
    // goes_ch4_<country>_<administrativeDivision>_<plumeSourceId>_<plumeId>_<datetime>
    const plumeMap: PlumeMap = {};

    // sort by data by time
    const sortedData = data.sort((prev: STACItem, next: STACItem): number => {
        const prev_date = new Date(prev.properties.datetime).getTime();
        const next_date = new Date(next.properties.datetime).getTime();
        return prev_date - next_date;
    });

    // create a plumemap
    sortedData.forEach((item: STACItem) => {
        const itemId = item.id;
        const destructuredId = itemId.split("_");
        // goes-ch4_<country>_<administrativeDivision>_<plumeSourceId>_<plumeId>_<datetime>
        const [ _, country, administrativeDivision, region, plumeId, __ ] = destructuredId;
        const newPlumeId:string = `${country}_${administrativeDivision}_${region}_${plumeId}`;
        if (!(newPlumeId in plumeMap)) {
            let [lon, lat] = item.geometry.coordinates[0][0];
            if (newPlumeId in plumeMetaData) {
                lon = plumeMetaData[newPlumeId].lon;
                lat = plumeMetaData[newPlumeId].lat;
            }
            const plume: Plume = {
                id: newPlumeId,
                region: region,
                representationalPlume: item,
                location: [lon, lat],
                startDate: item.properties.datetime,
                endDate: item.properties.datetime,
                subDailyPlumes: [],

            };
            plumeMap[newPlumeId] = plume;
        }
        plumeMap[newPlumeId].subDailyPlumes.push(item);
    });

    return plumeMap;
}

export function dataTransformationPlumeRegion(plumeMap: PlumeMap):PlumeRegionMap {
    const dataTree: DataTree = {};
    // create a data tree
    Object.keys(plumeMap).forEach(plumeId => {
        // datetime correction in the plume. Note: plumes are in sorted order (by datetime)
        const noOfSubDailyPlumes:number = plumeMap[plumeId].subDailyPlumes.length;
        const firstSubDailyPlume:SubDailyPlume = plumeMap[plumeId].subDailyPlumes[0];
        const lastSubDailyPlume:SubDailyPlume = plumeMap[plumeId].subDailyPlumes[noOfSubDailyPlumes - 1];
        plumeMap[plumeId].startDate = firstSubDailyPlume.properties.datetime;
        plumeMap[plumeId].endDate = lastSubDailyPlume.properties.datetime;
        // datetime correction end

        const plume = plumeMap[plumeId];
        const region = plume.region;

        if (!(region in dataTree)) {
            const plumeRegion: PlumeRegion = {
                id: region,
                location: plume.location,
                startDate: plume.startDate,
                endDate: plume.endDate,
                plumes: []
            }
            dataTree[region] = plumeRegion;
        }
        dataTree[region].plumes.push(plume);
        dataTree[region].endDate = plume.endDate; // to get realistic endDate for the PlumeRegion.
    });

    return dataTree;
}


interface PlumeMetaMap {
    [key: string]: PlumeMeta
}

interface PlumeRegionMetaMap {
    [key: string]: PlumeRegionMeta
}

export function dataTransformationPlumeMeta(plumeMetas: PlumeMeta[]): PlumeMetaMap {
    // basically array to hashmap conversion.
    const plumeMetaMap:PlumeMetaMap = {};
    plumeMetas.forEach((plumeMeta:PlumeMeta) => {
        if (!(plumeMeta.id in plumeMetaMap)) {
            plumeMetaMap[plumeMeta.id] = plumeMeta;
        }
    });
    return plumeMetaMap;
}

export function dataTransformationPlumeRegionMeta(plumeMetaMap: PlumeMetaMap): PlumeRegionMetaMap {
    const plumeRegionMetaMap:PlumeRegionMetaMap = {};

    Object.keys(plumeMetaMap).forEach((plumeId) => {
        let plumeMeta:PlumeMeta = plumeMetaMap[plumeId];
        if (!(plumeMeta.plumeSourceId in plumeRegionMetaMap)) {
            const plumeRegionMeta: PlumeRegionMeta = {
                id: plumeMeta.plumeSourceId, // Format: <region>. e.g. BV1
                plumeSourceName: plumeMeta.plumeSourceName,
                country: plumeMeta.country,
                administrativeDivision: plumeMeta.administrativeDivision,
                plumes: []
            }
            plumeRegionMetaMap[plumeMeta.plumeSourceId] = plumeRegionMeta;
        }
        plumeRegionMetaMap[plumeMeta.plumeSourceId].plumes.push(plumeMeta);
    });
    return plumeRegionMetaMap;
}

// using the dataset, update the metadata
export function metaDatetimeFix(plumeMetaMap: PlumeMetaMap, plumeMap: PlumeMap) {
    Object.keys(plumeMap).forEach(plumeId => {
        if (!(plumeId in plumeMetaMap)) return;
        plumeMetaMap[plumeId].startDatetime = plumeMap[plumeId].startDate;
        plumeMetaMap[plumeId].endDatetime = plumeMap[plumeId].endDate;
    });
    return plumeMetaMap;
}



// export function
