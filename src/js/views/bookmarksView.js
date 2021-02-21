import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
	_parentEl = document.querySelector('.bookmarks__list');
	_errorMessage = 'No bookmarks yet, find a nice recipe and bookmark it ;)';

	handlerLoadBookmark(handler){
		window.addEventListener('load', handler)
	}
	_generateMarkup() {
		return this._data
			.map((bookmark) => previewView.render(bookmark, false))
			.join();
	}
}

export default new BookmarksView();
