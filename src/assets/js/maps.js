const locationData = '/api/locations.json';
// const locationData = 'https://breakfastquest.netlify.app/api/locations.json';
// const locationData = 'https://thebreakfastquest.com/api/locations.json';

function initMap() {
	console.log('Initialized maps');
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 4,
		center: { lat: 41.0812, lng: -81.5188 },
	});
	console.log('Fetching location data from:', locationData);
	map.data.loadGeoJson(locationData);
}

(() => {
	console.log('Initialized maps.js');
})();


// function initMap() {
// 	// fetch the locations file/data
// 	console.log('Fetching location data from:', locationData);
// 	fetch(locationData)
// 		// convert the response to JSON
// 		.then(response => response.json())
// 		.then(locations => {
// 			console.log('Loaded location data');
// 			console.dir(locations);
// 			const map = new google.maps.Map(document.getElementById("map"), {
// 				zoom: 4,
// 				center: { lat: 41.0812, lng: -81.5188 },
// 			});
// 			// map.data.loadGeoJson(locations);

// 			console.log('1');
// 			// const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
// 			console.log('2');
// 			locations.forEach(location => {
// 				new AdvancedMarkerElement({
// 					map: map,
// 					position: { lat: location.latitude, lng: location.longitude },
// 					title: location.name
// 				});
// 			});

// 		})
// 		.catch(error => console.error("Error loading locations:", error));
// }
