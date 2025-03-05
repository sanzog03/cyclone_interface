import moment from "moment";
import { STACItem, STACCollection, FeatureCollection, FeatureItem, CycloneShapeDataset } from "../../../dataModel";

import { CycloneRasterDataset, RasterDataProduct, VectorDataProduct, Cyclone, CycloneMap, VisualizationType } from "../../../dataModel"

// NEW!!!

interface RasterCollectionDictionary {
    [key: string]: STACCollection
}

interface VectorCollectionDictionary {
    [key: string]: FeatureCollection
}

export function dataTransformationCyclone(STACCollections: STACCollection[][], STACItemsList: STACItem[][], FeatureCollections: FeatureCollection[][], FeatureItemsList: FeatureItem[][]) {
    // transforms the data from STAC api to Cyclone models.
    console.log("1Herenow>>>>>", STACCollections)
    console.log("2Herenow>>>>>", FeatureCollections)
    console.log("3Herenow>>>>>", STACItemsList)
    console.log("4Herenow2>>>>>", FeatureItemsList)
    const cycloneDictionary: CycloneMap = {};
    
    const rasterCollectionDictionary: RasterCollectionDictionary = {};     
    const vectorCollectionDictionary: VectorCollectionDictionary = {};     

    STACCollections.forEach((collectionArr: STACCollection[]) => {
        collectionArr.forEach((collection: STACCollection) => {
            const collectionId = collection.id
            if (!(collectionId in rasterCollectionDictionary)) {
                rasterCollectionDictionary[collectionId] = collection;
            }
        });
    });

    FeatureCollections.forEach((collectionArr: FeatureCollection[]) => {
        collectionArr.forEach((collection: FeatureCollection) => {
            const collectionId = collection.id
            if (!(collectionId in vectorCollectionDictionary)) {
                vectorCollectionDictionary[collectionId] = collection;
            }
        });
    });

    STACItemsList.forEach((items: STACItem[]) => {
        // create a RasterDataProduct
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

        // create CycloneRasterDataset
        let [lon, lat] = sortedData[0].geometry.coordinates[0][0];
        const cycloneDataset: CycloneRasterDataset = {
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
            getNearestDateTime: (dateTime: string) => {
                if (!dateTime) return dateTime;
                const dateTimeNoTimezone = moment(dateTime).format('YYYY-MM-DD HH:mm:ss'); // remove the timezone information that might
                // be attached with the target datetime
                const index = findNearestDatetimeIndex(cycloneDataset.subDailyAssets, dateTimeNoTimezone)
                const nearestAsset: STACItem = cycloneDataset.subDailyAssets[index];
                if (nearestAsset && nearestAsset.properties && nearestAsset.properties.datetime) {
                    const formattedDt = moment.utc(nearestAsset.properties.datetime).format('YYYY-MM-DD hh:mm:ss A'); // remove the timezone information that might
                    return formattedDt;
                }
                return dateTime;
            }
        };
        
        // create RasterDataProduct
        const dataProduct:RasterDataProduct = {
            id: dataProductName+"-cyclone-"+cycloneName,
            type: VisualizationType.Raster,
            name: dataProductName,
            dataset: cycloneDataset,
            description: rasterCollectionDictionary[collectionName].description,
            datetimes: rasterCollectionDictionary[collectionName].summaries.datetime,
            assets: rasterCollectionDictionary[collectionName].renders.dashboard.assets[0],
            rescale: rasterCollectionDictionary[collectionName].renders.dashboard.rescale,
            colormap: rasterCollectionDictionary[collectionName].renders.dashboard.colormap_name,
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

    FeatureItemsList.forEach((items: FeatureItem[]) => {
        // create a RasterDataProduct
        const collectionName = items[0].collection; // <satellite/data_product>-cyclone-<cyclone_name>
        const acc = collectionName.split("_");
        const lenAcc = acc.length;
        const dataProductNameArr = acc.slice(0, lenAcc-2)

        const cycloneName = acc[lenAcc-1];
        const dataProductName = dataProductNameArr.join("_");

        // create CycloneShapeDataset
        const cycloneShapeDataset: CycloneShapeDataset = {
            id: dataProductName+"_cyclone_"+cycloneName,
            subDailyAssets: [...items],
        };

        // create VectorDataProduct
        const dataProduct:VectorDataProduct = {
            id: dataProductName+"_cyclone_"+cycloneName,
            type: VisualizationType.Vector,
            name: dataProductName,
            dataset: cycloneShapeDataset,
            description: vectorCollectionDictionary[collectionName].id,
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

export function findNearestDatetimeIndex(sortedStacItems: STACItem[], targetDatetime: string) {
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

// export function
