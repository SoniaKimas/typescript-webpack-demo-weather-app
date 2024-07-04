export type NonEmptyString = string & { kind: "non-empty" };

export interface Coords {
    lat: number;
    lng: number;
}   
