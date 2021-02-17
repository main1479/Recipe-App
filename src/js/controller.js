import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

// support for older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		// rendering spinner
		recipeView.renderSpinner();

		// loading recipe
		await model.loadRecipe(id);
		const recipe = model.state.recipe;

		// render recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		// console.error(err);
		recipeView.renderError();
	}
};

const controlLoadSearch = async function (query) {
	query = searchView.getQuery();
	if (!query) return;
	await model.loadSearch(query);
	console.log(model.state.search.results);
};

const init = function () {
	recipeView.handlerRecipeView(controlRecipes);
	searchView.handlerSearch(controlLoadSearch);
};

init();
