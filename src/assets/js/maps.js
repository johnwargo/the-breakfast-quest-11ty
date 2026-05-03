const locationData = 'https://breakfastquest.netlify.app/api/locations.json';
// const locationData = 'https://thebreakfastquest.com/api/locations.json';

(() => {
    console.log('Initialized maps.js');

    // fetch the locations file/data
    fetch(locationData)
        // convert the response to JSON
        .then(response => response.json())
        .then(locations => {
            console.dir(locations);
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 4,
                center: { lat: -28, lng: 137 },
            });
            map.data.loadGeoJson(locations);
        })
        .catch(error => console.error("Error loading locations:", error));

})();
