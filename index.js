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

function getRandomChoice(list) {
	const i = Math.floor(Math.random() * list.length);
	return list[i];
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

	// TODO: Improve UI
	// TODO: Allow parameters for maxResultCount + rankPreference + Location
	// TODO: Maybe use react
	// TODO: display a google map embed of the chosen restaurant
	// TODO: Add link to choosener
	// TODO: Add feature to cross out restraunts from list
	// TODO: Add feature to refresh list
	// TODO: Get actual API Key
	const els = {
		choiceDiv: document.querySelector('div.choice'),
		choiceName: document.getElementById('choice-name'),
		choiceAddress: document.getElementById('choice-address'),
		choiceLink: document.getElementById('choice-link'),
		choices: document.getElementById('choices'),
		places: document.getElementById('places'),
		chooseButton: document.getElementById('choose-button'),
		backButton: document.getElementById('back-button'),
	};

	const places = await getNearbyRestaurants();
	for(const place of places) {
		const li = document.createElement('li')
		li.innerText = place.displayName
		els.places.appendChild(li);
	}

	els.chooseButton.addEventListener('click', () => {
		els.choices.classList.toggle('hidden');
		els.choiceDiv.classList.toggle('hidden');
		const choice = getRandomChoice(places);
		els.choiceName.innerText = choice.displayName;
		els.choiceAddress.innerText = choice.formattedAddress;
		els.choiceLink.href = choice.googleMapsURI;
	});

	els.backButton.addEventListener('click', () => {
		els.choices.classList.toggle('hidden');
		els.choiceDiv.classList.toggle('hidden');
	});

}

main();
