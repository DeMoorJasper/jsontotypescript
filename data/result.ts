export class Input {
	station: Array<StationItem>;

	constructor(InputJson:any) {
		let stationres = []
		for (let i=0; i < InputJson["station"].length; i++) {
			stationres.push(new StationItem(InputJson["station"][i]));
		}
		this.station = stationres;
	}
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
	testarr: Array<string>;

	constructor(StationItemJson:any) {
		this.id = StationItemJson["id"];
		let alternativeres = []
		for (let i=0; i < StationItemJson["alternative"].length; i++) {
			alternativeres.push(new AlternativeItem(StationItemJson["alternative"][i]));
		}
		this.alternative = alternativeres;
		this.avgStopTimes = StationItemJson["avgStopTimes"];
		this.country = StationItemJson["country"];
		this.latitude = StationItemJson["latitude"];
		this.longitude = StationItemJson["longitude"];
		this.name = StationItemJson["name"];
		this.standardname = StationItemJson["standardname"];
		this.testarr = StationItemJson["testarr"];
	}
}

export class AlternativeItem {
	language: string;
	value: string;

	constructor(AlternativeItemJson:any) {
		this.language = AlternativeItemJson["@language"];
		this.value = AlternativeItemJson["@value"];
	}
}