import View from './view.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
	_parentEl = document.querySelector('.results');
	_errorMessage = 'Can NOT find that recipe, please try another one ;(';

	_generateMarkup() {
		return this._data
			.map((recipe) => {
				const id = window.location.hash.slice(1);
				return `
         <li class="preview">
            <a class="preview__link preview__link--${
							id === recipe.id ? 'active' : ''
						}" href="#${recipe.id}">
            
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
              </div>
            </a>
          </li>
      `;
			})
			.join('');
	}
}

export default new ResultsView();
