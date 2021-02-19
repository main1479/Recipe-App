import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
	_parentEl = document.querySelector('.pagination');

   handlerPagination(handler, data){
      this._parentEl.addEventListener('click', function(e){
         const btn = e.target.closest('.btn--inline');
         console.log(btn)
         if(!btn) return

         if (btn.classList.contains('pagination__btn--next')) data.page++;
         handler(data.page);
         if (btn.classList.contains('pagination__btn--prev')) data.page--;
         handler(data.page);
      })
   }
	_generateMarkup() {
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		const currPage = this._data.page;

		console.log(currPage);
		// First page and there are other pages
		if (currPage === 1 && numPages > 1) {
			return `
         <button class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
		}
		// last page
		if (currPage === numPages && numPages > 1) {
			return `
         <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
      `;
		}

		// other pages
		if (currPage > 1 && currPage < numPages) {
			return `
            <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
          
         <button class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
         `;
		}

		// First page and there are no other pages
		return '';
	}
}

export default new PaginationView();
