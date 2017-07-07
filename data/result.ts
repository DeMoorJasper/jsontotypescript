export class Input {
    station: Array<StationItem>;
}

export class StationItem {
    id: string;
    alternative: Array<AlternativeItem>;
    avgStopTimes: string;
    country: string;
    latitude: string;
    longitude: string;
    name: string;
    standardname: string;
}

export class AlternativeItem {
    @language: string;
    @value: string;
}