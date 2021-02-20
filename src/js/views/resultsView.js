import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
	_parentEl = document.querySelector('.results');
	_errorMessage =
		'Can NOT find any recipe with query, please try another one ;(';

	_generateMarkup() {
		return this._data.map((result) => previewView.render(result, false)).join();
	}
}

export default new ResultsView();
