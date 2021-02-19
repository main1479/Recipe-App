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
	}
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
		// console.log(recipe);
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
		
	} catch (err) {
		throw err;
	}
};

export const getSearchResPage = function(page = state.search.page){

	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;
	state.search.page = page
	return state.search.results.slice(start, end)
}
