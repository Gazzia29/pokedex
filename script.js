const $list = document.getElementById("list");
const $description = document.getElementById("description");

const api = "https://pokeapi.co/api/v2/pokemon?limit=50";

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
function createItem(data) {
	const $item = document.createElement("li");
	const $name = document.createElement("div");
	$name.className = "name";
	const $thumbnail = document.createElement("img");
	$thumbnail.className = "thumbnail";

	$name.innerHTML = data.name;
	$thumbnail.src = data.sprites.front_default;

	$item.appendChild($thumbnail);
	$item.appendChild($name);
	$list.appendChild($item);
	$item.addEventListener("click", () => {
		showDescription(data);
	});
}

/**
 * fill the item list with values
 */
function fillList(json) {
	emptyList();
	console.log(json.results.length);
	var dataList = json.results;
	Promise.all(
		dataList.map((item) => {
			return fetch(item.url).then(transformToJson);
		})
	).then((pokemonList) => {
		pokemonList
			.sort((a, b) => {
				return a.id - b.id;
			})
			.forEach((pokemon) => {
				console.log("pokemon :>> ", pokemon);
				createItem(pokemon);
			});
	});
}

/**
 * Fill and display the description
 */
function showDescription(data) {
	$description.classList.add("show");
	const $img = $description.querySelectorAll(".content img");
	const $fields = $description.querySelectorAll("dd");

	$img[0].src = data.sprites.other["official-artwork"].front_default;

	//pour chaque dédé
	$fields.forEach(($dd) => {
		var classe = $dd.classList[0];

		//si sa class #1 est pas "types"
		if (classe != "types") {
			//on définit son texte comme la valeur correspondant à la propriété dans "data" du même nom que la classe
			$dd.innerText = data[classe];
		} else {
			//comme data.types est un objet, on ne peut pas faire pareil, sinon cela affiche une erreur. La méthode est donc différente:

			$dd.innerText = "";

			//on itère data.types pour tous les afficher côte à côte

			data.types.forEach((type) => {
				$dd.innerHTML += `<div class="type ${type.type.name}">${type.type.name}</div>`;
			});
		}
	});
}

/**
 * Hide the description
 */
function hideDescription() {
	$description.classList.remove("show");
}

// Fetch the API end-point and fill the list
fetch(api).then(transformToJson).then(fillList);
