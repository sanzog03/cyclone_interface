export type SubDailyAsset = STACItem; // This is the smallest working unit of data. Format: <satellite>_<product>_<datetime>. e.g. "GOES_16b__2019-05-21T17:31:00Z"

// type datetime = string;

export interface CycloneDataset {
    id: string; // Format: <satellite>_hurricane_<hurricane_name>. e.g. GOES16_hurricane_beryl
    satellite: string; // e.g. GOES, IMERG, SPoRT, MODIS, CYGNSS
    representationalAsset: SubDailyAsset;
    location: [Lon, Lat]; // [lon, lat]
    startDate: DateTime;
    endDate: DateTime;
    subDailyAssets: SubDailyAsset[];
    getAsset: (dateTime: string) => SubDailyAsset;
    // getNearestDateTime: (dateTime: datetime) => datetime; 
}

export type SatelliteSystem = DataProduct;

export interface DataProduct { // ~ Collection
    id: string;
    name: string; // e.g. GOES-16, IMERG, SPoRT-SST, MODIS-IR, CYGNSS
    dataset: CycloneDataset;
    description: string;
    datetimes: string[];
    rescale: [number, number]; // [min, max]
    colormap: string;
}

export interface Cyclone {
    id: string;
    name: string; // e.g. Beryl, Milton, Ian, Nicole, Ida
    dataProducts: {
        [key: string]: DataProduct
    }
}

export interface CycloneMap {
    [key: string]: Cyclone;
}

// helpers

export type DateTime = string;
export type Lon = string;
export type Lat = string;

// Stac collection defination

export interface STACCollection {
    type: 'Collection';
    stac_version: string;
    id: string;
    description: string;
    license: string;
    extent: {
        spatial: {
        bbox: number[][];
        };
        temporal: {
            interval: [string | null, string | null][];
        };
    };
    links: Array<{
        rel: string;
        href: string;
        type?: string;
        title?: string;
    }>;
    title?: string;
    stac_extensions?: string[];
    keywords?: string[];
    providers?: Array<{
        name: string;
        description?: string;
        roles?: string[];
        url?: string;
    }>;
    renders: {
        dashboard: {
            assets: string[];
            colormap_name: string;
            rescale: [number, number]; //[min, max]
        }
    }
    summaries: {
        datetime: string[];
        [key: string]: any;
    };
    assets?: {
        [key: string]: {
        href: string;
        title?: string;
        description?: string;
        type?: string;
        roles?: string[];
        };
    };
    item_assets?: {
        [key: string]: {
        title?: string;
        description?: string;
        type?: string;
        roles?: string[];
        };
    };
}


// Stac Item defination
export interface STACItem {
    id: string;
    bbox: number[];
    type: string;
    links: Link[];
    assets: {
        rad: Asset;
        rendered_preview: Asset;
    };
    geometry: Geometry;
    collection: string;
    properties: {
        datetime: string;
    };
    stac_version: string;
    stac_extensions: string[];
}

interface Link {
    rel: string;
    type: string;
    href: string;
    title?: string;
}

interface Asset {
    href: string;
    type: string;
    roles?: string[];
    title: string;
    "proj:bbox"?: number[];
    "proj:epsg"?: number;
    "proj:wkt2"?: string;
    "proj:shape"?: number[];
    description?: string;
    "raster:bands"?: RasterBand[];
    "proj:geometry"?: Geometry;
    "proj:projjson"?: ProjJSON;
    "proj:transform"?: number[];
}

interface RasterBand {
    scale: number;
    nodata: string;
    offset: number;
    sampling: string;
    data_type: string;
    histogram: Histogram;
    statistics: Statistics;
}

interface Histogram {
    max: number;
    min: number;
    count: number;
    buckets: number[];
}

interface Statistics {
    mean: number;
    stddev: number;
    maximum: number;
    minimum: number;
    valid_percent: number;
}

interface Geometry {
    type: string;
    coordinates: string[][][];
}

interface ProjJSON {
    id: {
        code: number;
        authority: string;
    };
    name: string;
    type: string;
    datum: {
        name: string;
        type: string;
        ellipsoid: {
            name: string;
            semi_major_axis: number;
            inverse_flattening: number;
        };
    };
    $schema: string;
    coordinate_system: {
        axis: Axis[];
        subtype: string;
    };
}

interface Axis {
    name: string;
    unit: string;
    direction: string;
    abbreviation: string;
}
