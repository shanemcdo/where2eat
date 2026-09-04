const defaultCenter = {
	'lat': 37.7937,
	'lng': -122.3965
}
const radius = 5000;
const maxResultCount = 10;

async function getLocation(){
	return new Promise(resolve => {
		navigator.geolocation.getCurrentPosition(response => resolve({
			'lat': response.coords.latitude,
			'lng': response.coords.longitude
		}));
	});
}

async function getNearbyRestaurants() {
	const {Place, SearchNearbyRankPreference} = await google.maps.importLibrary("places");

	const center = await getLocation();

	const request = {
		// required parameters
		fields: [
			'displayName',
			'location',
			'formattedAddress',
			'googleMapsURI',
		],
		locationRestriction: {
			center,
			radius,
		},
		// optional parameters
		includedPrimaryTypes: ['restaurant'],
		maxResultCount,
		rankPreference: SearchNearbyRankPreference.POPULARITY,
	};

	const { places } = await Place.searchNearby(request);

	return places;
}

async function main(){
	const places = await getNearbyRestaurants();

	console.log(places);

	for(const place of places) {
		console.log(place.displayName, place.formattedAddress);
	}
}

main();
