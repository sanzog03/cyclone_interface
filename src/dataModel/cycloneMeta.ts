export interface CycloneMeta {
    id: string,
    title: string,
    description: string
    citation: {
        description: string;
        link: VerboseLink;
    };
    atbd: {
        description: string;
        link: VerboseLink;
    };
    references: VerboseLink[];
}

interface VerboseLink {
    description: string;
    link: string;
}
