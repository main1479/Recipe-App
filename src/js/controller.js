import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView';
import {UPLOAD_FORM_CLOSING_TIME} from './config.js'

// support for older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		// rendering spinner
		recipeView.renderSpinner();

		resultsView.update(model.getSearchResPage());

		// loading recipe
		await model.loadRecipe(id);
		// const recipe = model.state.recipe;

		// render recipe
		recipeView.render(model.state.recipe);

		// Updating Bookmarks View
		bookmarksView.update(model.state.bookmarks);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlLoadSearch = async function (query) {
	resultsView.renderSpinner();
	// getting search query
	query = searchView.getQuery();
	if (!query && query === '' && query === ' ') return;
	// Loading search from API
	await model.loadSearch(query);

	// render search results
	resultsView.render(model.getSearchResPage());

	// render pagination buttons
	paginationView.render(model.state.search);
};

const controlPagination = function (currPage) {
	resultsView.render(model.getSearchResPage(currPage));
	paginationView.render(model.state.search);
};

const controlServings = function (newServings = model.state.recipe.servings) {
	model.updateServings(newServings);

	recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);
	// update recipeView
	recipeView.update(model.state.recipe);

	bookmarksView.render(model.state.bookmarks);
};

const conrtolLoadBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
	try {
		await model.uploadRecipe(newRecipe);

		recipeView.render(model.state.recipe);

		// render Bookmarks View
		bookmarksView.render(model.state.bookmarks);

		addRecipeView.renderSpinner()

		addRecipeView.renderMessage()

		setTimeout(function(){
			addRecipeView.toggleWindow()
		}, UPLOAD_FORM_CLOSING_TIME * 1000)

	} catch (err) {
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	bookmarksView.handlerLoadBookmark(conrtolLoadBookmarks);
	recipeView.handlerRecipeView(controlRecipes);
	searchView.handlerSearch(controlLoadSearch);
	paginationView.handlerPagination(controlPagination, model.state.search);
	recipeView.handlerServings(controlServings);
	recipeView.handlerBookmark(controlBookmarks);

	addRecipeView.handlerUpload(controlUploadRecipe);
};

init();
