export default class KeyboardController {
	constructor(el, selectController) {

		this._onKeyDown = this._onKeyDown.bind(this);
		this.myContainerEl = el;
		this._selectController = selectController;

		this._selectController.getAllItems().forEach(
			item => this.registerEl(item)
		);
	}

	registerEl(el) {
		el.removeEventListener('keydown', this._onKeyDown);
		el.addEventListener('keydown', this._onKeyDown);
	}


	_onKeyDown(e) {
		const ESC = 27,
			  ENTER = 13;

		let target = e.target; 

		//Escape is the abort keystroke (for any target element)
		if (e.keyCode == ESC) {
			this._selectController.unsetSelectedItem();
			this._selectController.getSelectables()[0].focus();
			this._selectController.unsetActiveTarget();
		}

		// select
		if (e.keyCode == ENTER) {
			e.preventDefault();
			e.stopImmediatePropagation();
			if (target === this._selectController.getSelectedItem()) {
				return;
			}

			// is selecting a target
			if (this._selectController.isTarget(target) && this._selectController.hasSelectedItem()) {
				this._selectController.combine(this._selectController.getSelectedItem(), target);
				target = null;
			}
			this._selectController.unsetSelectedItem();
			this._selectController.unsetActiveTarget();

			// is selecting a selectable
			if (this._selectController.isSelectable(target)) {
				this._selectController.setSelectedItem(target);
				this._selectController.getTargets()[0].focus();
			}

		}

	}

} 
