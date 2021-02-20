import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

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

export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}`);

		const { recipe } = data.data;
		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			image: recipe.image_url,
			sourceUrl: recipe.source_url,
			ingredients: recipe.ingredients,
		};
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

export const addBookmark = function (recipe) {
	// add recipe as bookmarked
	state.bookmarks.push(recipe);

	// mark current recipe as bookmarked
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
	// delete recipe from bookmarks array
	const index = state.bookmarks.findIndex((el) => el.id === id);
	state.bookmarks.splice(index, 1);

	if (id === state.recipe.id) state.recipe.bookmarked = false;
};
