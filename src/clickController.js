export default class ClickController {
	constructor(el, selectController) {
		
		this.myContainerEl = el;
		this._selectController = selectController;
		
		this._onClick = this._onClick.bind(this);

		this._selectController.getAllItems().forEach(
			item => this.registerEl(item)
		);
	}

	registerEl(el) {
		el.removeEventListener('click', this._onClick);
		el.addEventListener('click', this._onClick);
	}

	_onClick(e) {
		let target = e.currentTarget;

		if (target === this._selectController.getSelectedItem()) {
			return;
		}
		if (this._selectController.isTarget(target) && this._selectController.hasSelectedItem()) {
			this._selectController.combine(this._selectController.getSelectedItem(), target);
			this._selectController.unsetActiveTarget();
			e.stopPropagation();
			return;
		}
		if (this._selectController.isSelectable(target)) {
			if (this._selectController.hasSelectedItem()) {
				this._selectController.unsetSelectedItem();
			}
			this._selectController.setSelectedItem(target);
			e.stopPropagation();
		}
	}

}			



