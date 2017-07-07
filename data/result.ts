export class Input {
    station: StationItem;
}

export class StationItem {
    id: string;
    alternative: AlternativeItem;
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