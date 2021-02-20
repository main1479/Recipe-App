import icons from 'url:../../img/icons.svg';

export default class View {
	_data;
	render(data, render = true) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();
		this._data = data;
		if (!data) return;
		const markup = this._generateMarkup();
		if(!render) return markup;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}

	update(data) {
		if (!data || (Array.isArray(data) && data.length === 0))
			this._data = data;
		if (!data) return;

		const newMarkup = this._generateMarkup();
		const newDOM = document.createRange().createContextualFragment(newMarkup);

		const newElements = Array.from(newDOM.querySelectorAll('*'));
		const currElements = Array.from(this._parentEl.querySelectorAll('*'));

		newElements.forEach((newEl, i) => {
			const currEl = currElements[i];

			if (!newEl.isEqualNode(currEl) && newEl.firstChild?.nodeValue.trim() !== '')
				currEl.textContent = newEl.textContent;
			

			if(!newEl.isEqualNode(currEl))
				Array.from(newEl.attributes).forEach(attr => currEl.setAttribute(attr.name, attr.value))
		});
	}
	renderSpinner() {
		const markup = `
         <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
         </div>
         `;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}

	_clear() {
		this._parentEl.innerHTML = '';
	}

	renderError(message = this._errorMessage) {
		const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}
}
