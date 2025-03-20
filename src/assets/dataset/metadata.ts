import { CycloneMeta } from "../../dataModel";

interface CycloneMetaDict {
    [key: string]: CycloneMeta
}

export const CycloneMetas: CycloneMetaDict = {
    "gpm_imerg": {
        id: "gpm_imerg",
        title: "IMERG",
        description: "The Integrated Multi-satellitE Retrievals for GPM (IMERG) is a NASA precipitation dataset that provides global rainfall and snowfall estimates. It merges data from multiple satellites, ground-based sources, and numerical models. IMERG offers near real-time and research-quality precipitation products at high spatial (0.1°) and temporal (30-minute) resolutions, supporting weather and climate studies.",
        citation: {
            description: "IMERG data is publicly available through NASA’s Precipitation Processing System (PPS) and the GES DISC archive. Proper citation ensures recognition of data sources and supports continued data availability. To access and cite IMERG data, visit: IMERG Data Product Citation",
            link: {
                description: "IMERG Data Product Citation",
                link: "https://gpm.nasa.gov/data/directory"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) explains the processing methodology for IMERG precipitation estimates, including data fusion techniques and uncertainty assessments. The latest ATBD can be found at:",
            link: {
                description: "IMERG ATBD",
                link: "https://gpm.nasa.gov/resources/documents/imerg-v07-atbd"
            }
        },
        references: [
            {
                description: `Huffman, G.J., Bolvin, D.T., Braithwaite, D., et al. (2020). "Integrated Multi-satellite Retrievals for GPM (IMERG) Algorithm Development."`,
                link: ""    
            },
            {
                description: `Tan, J., Huffman, G.J., Adler, R.F., et al. (2019). "IMERG V06: Global Precipitation Data from the GPM Mission."`,
                link: ""    
            }
        ]
    },
    "sst": {
        id: "sst",
        title: "SPoRT SST",
        description: "The Short-term Prediction Research and Transition (SPoRT) Sea Surface Temperature (SST) product provides high-resolution sea surface temperature data derived from multiple satellite sensors, including GOES, VIIRS, and MODIS. The product is designed to support weather forecasting, tropical cyclone analysis, and oceanographic studies by offering improved spatial and temporal SST measurements compared to traditional datasets.",
        citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: `Haines, S.L., Smith, T.M., and Jedlovec, G.J. (2014). "Advances in High-Resolution Satellite SST Data for Numerical Weather Prediction Applications."`,
                link: ""    
            },
            {
                description: `Jedlovec, G.J., Haines, S.L., and Feltz, W.F. (2016). "Validation of SPoRT SST Products for Improved Regional Weather Prediction."`,
                link: ""
            }
        ]
    }, "cygnss":    {
        id: "cygnss",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "goes_radF_l1b_C02":    {
        id: "goes_radF_l1b_C02",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "goes_radF_l1b_C08":    {
        id: "goes_radF_l1b_C08",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "goes_radF_l1b_C13":    {
        id: "goes_radF_l1b_C13",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "modis_mosaic":    {
        id: "modis_mosaic",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "viirs_mosaic":    {
        id: "viirs_mosaic",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "public.path_point":    {
        id: "public.path_point",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "public.path_line":    {
        id: "public.path_line",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "public.wind_polygon":    {
        id: "public.wind_polygon",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "public.wind_vectors":    {
        id: "public.wind_vectors",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    }, "public.modis_swath":    {
        id: "public.modis_swath",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
                citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: "",
                link: ""    
            }
        ]
    },
}
