async function doSearch(evt) {
	// if triggered by the input field event, prevent default handling of the event.
	if (evt) {
		evt.preventDefault();
	}
	// get the search term from the input field
	const query = document.getElementById('queryInput').value.trim();
	if (query.length > 0) {
		console.log(`Executing search for: "${query}"`);
		const { liteClient } = window["algoliasearch/lite"];
		const client = liteClient("3GOZDBYV4K", "df8b2d02bb72c7d1d5b92b1b8308d993");
		const response = await client.search([
			{ indexName: "site-search", params: { query, hitsPerPage: 20 } }
		]);
		const hits = response.results[0].hits;
		console.dir(hits);

		const results = document.querySelector("#searchResults");
		results.innerHTML = hits
			.map((hit) => `<article><h4><a href="${hit.url}">${hit.title || hit.name || hit.objectID}</a></h4></article>`)
			.join("");
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
