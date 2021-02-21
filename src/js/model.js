import { async } from 'regenerator-runtime';
import { API_URL, API_KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		page: 1,
		resultsPerPage: 10,
	},
	bookmarks: [],
};

const createRecipeObject = function(data){
	const { recipe } = data.data;
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		image: recipe.image_url,
		sourceUrl: recipe.source_url,
		ingredients: recipe.ingredients,
		...(recipe.key && {key: recipe.key})
	};
}

export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}`);

		state.recipe = createRecipeObject(data)

		if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
			state.recipe.bookmarked = true;
		} else {
			state.recipe.bookmarked = false;
		}
	} catch (err) {
		throw err;
	}
};

export const loadSearch = async function (query) {
	try {
		const data = await getJSON(`${API_URL}?search=${query}`);
		state.search.results = data.data.recipes.map((recipe) => {
			return {
				id: recipe.id,
				title: recipe.title,
				publisher: recipe.publisher,
				image: recipe.image_url,
			};
		});
		state.search.page = 1;
	} catch (err) {
		throw err;
	}
};

export const getSearchResPage = function (page = state.search.page) {
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;
	state.search.page = page;

	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((ing) => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});

	state.recipe.servings = newServings;
};

const setLocalStorage = function () {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
	// add recipe as bookmarked
	state.bookmarks.push(recipe);

	// mark current recipe as bookmarked
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
	setLocalStorage();
};

export const deleteBookmark = function (id) {
	// delete recipe from bookmarks array
	const index = state.bookmarks.findIndex((el) => el.id === id);
	state.bookmarks.splice(index, 1);

	if (id === state.recipe.id) state.recipe.bookmarked = false;
	setLocalStorage();
};

const getLocalStorage = function () {
	const data = JSON.parse(localStorage.getItem('bookmarks'));
	if (!data) return;
	state.bookmarks.push(...data);
};

getLocalStorage();

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
			.map((ing) => {
				const ingArr = ing[1].replaceAll(' ', '').split(',');

				if (ingArr.length !== 3) throw new Error('Invalid Ingredient Format');

				const [quantity, unit, description] = ingArr;

				return { quantity: quantity? +quantity : null, unit, description };
			});
		
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};
		console.log(recipe)

		const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
		state.recipe = createRecipeObject(data);

		addBookmark(state.recipe)

	} catch (err) {
		throw err;
	}
};
