import { API_URL } from './config.js';
import {getJSON} from './helpers.js'


export const state = {
	recipe: {},
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
		console.log(recipe);
	} catch (err) {
		console.error(err);
	}
};
