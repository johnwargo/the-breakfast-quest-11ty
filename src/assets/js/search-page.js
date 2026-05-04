
function doSearch(evt) {
	// if triggered by the input field event, prevent default handling of the event.
	if (evt) {
		evt.preventDefault();
	}
	// get the search term from the input field
	const query = document.getElementById('queryInput').value.trim();
	if (query.length > 0) {
		console.log(`Executing search for: ${query}`);
		// perform the search here
	}
};

(() => {
	document.addEventListener('DOMContentLoaded', () => {
		const query = new URLSearchParams(window.location.search).get('query');
		if (query && query.length > 0) {
			console.log(`Query parameter: ${query}`);
			// populate the search field
			document.getElementById('queryInput').value = query;
			// execute the search
			doSearch();
		}
	});
})();
