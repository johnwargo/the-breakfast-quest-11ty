
function handleSearch(event) {	
	event.preventDefault(); 
	const queryStr = document.getElementById('query').value.replace(/\s+/g, ' ').trim();
	window.location.href = `/search/?query=${encodeURIComponent(queryStr)}`;
}
