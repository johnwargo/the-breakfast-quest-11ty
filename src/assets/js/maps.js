const locationData = '/api/locations.json';
// const locationData = 'https://breakfastquest.netlify.app/api/locations.json';
// const locationData = 'https://thebreakfastquest.com/api/locations.json';

function initMap() {
	console.log('Initialized maps');

	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 4,
		center: { lat: 41.0812, lng: -81.5188 },
	});

	// https://stackoverflow.com/questions/55780421/how-do-i-add-hover-boxes-that-display-a-geojson-property-over-a-marker-in-googl
	var infowindow = new google.maps.InfoWindow({
		pixelOffset: new google.maps.Size(0, -40)
	});

	// This extends the window to show all markers
	var bounds = new google.maps.LatLngBounds();
	map.data.addListener('addfeature', function (evt) {
		if (evt.feature.getGeometry().getType() == 'Point') {
			bounds.extend(evt.feature.getGeometry().get());
			map.fitBounds(bounds);
		}
	})

	console.log('Fetching location data from:', locationData);
	map.data.loadGeoJson(locationData);

	map.data.addListener('mouseover', function (evt) {
		const featureName = evt.feature.getProperty('name');
		const description = evt.feature.getProperty('description');
		if (description) {
			infowindow.setContent(`<div style="padding:5px;"><strong>${featureName}</strong><br>${description}</div>`);
		} else {
			infowindow.setContent(`<div style="padding:5px;"><strong>${featureName}</strong></div>`);
		}
		infowindow.setPosition(evt.feature.getGeometry().get());
		infowindow.open(map);
	});

	map.data.addListener('click', function(event) {
    const url = event.feature.getProperty('url');
    if (url) {	// this should always be true
			// open the website in a new tab
			window.open(url, '_blank');
		}
});

}

(() => {
	console.log('Initialized maps.js');
})();

