const list = document.getElementById("list");
const description = document.getElementById("description");

const api = "https://pokeapi.co/api/v2/pokemon?limit=150";

/**
 * Try to parse a response as JSON data
 */
function transformToJson(response) {
	if (response.ok) {
		return response.json();
	}

	throw Error("Content not loaded");
}

/**
 * Clear the list of all its items
 */
function emptyList() {
	// ...
}

/**
 * Create an item, fetch its data and setup event listener
 */
function createItem(pokemon) {
	const item = document.createElement("li");
	const $name = document.createElement("div");
	const $thumbnail = document.createElement("img");
	$name.className = "name";
	$thumbnail.className = "thumbnail";

	fetch(pokemon.url)
		.then(transformToJson)
		.then((data) => {
			$name.innerHTML = data.name;
			$thumbnail.src = data.sprites.front_default;
			item.appendChild($thumbnail);
			item.appendChild($name);
			list.appendChild(item);
			item.addEventListener("click", (e) => {
				console.log("coucou");
				if (!description.classList.contains("show")) {
					showDescription(data);
				}
			});
		});
}

/**
 * fill the item list with values
 */
function fillList(json) {
	emptyList();
	console.log(json.results.length);
	json.results.forEach(createItem);
}

/**
 * Fill and display the description
 */
function showDescription(data) {
	console.log("data :>> ", data);
	description.classList.add("show");

	const fields = description.querySelectorAll("dd");
	fields.forEach((dd) => {
		if (dd.classList[0] != types) dd.innerText = data[dd.classList[0]];
		else {
			if (data.types) {
				data.types.forEach((type) => {
					dd.innerText = type.type.name;
				});
			}
		}
	});
}

/**
 * Hide the description
 */
function hideDescription() {
	description.classList.remove("show");
}

// Fetch the API end-point and fill the list
fetch(api).then(transformToJson).then(fillList);
