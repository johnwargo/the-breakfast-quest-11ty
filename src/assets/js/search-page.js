
function doSearch(evt) {
	// if triggered by the input field event, prevent default handling of the event.
	if (evt) {
		evt.preventDefault();
	}
	// get the search term from the input field
	const query = document.getElementById('queryInput').value.trim();
	if (query.length > 0) {
		console.log(`Executing search for: "${query}"`);
		const client = algoliasearch('3GOZDBYV4K', 'df8b2d02bb72c7d1d5b92b1b8308d993');
		const index = client.initIndex('site-search');

		// Perform a search
		index.search(query).then(({ hits }) => {
			console.dir(hits);
		});
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
