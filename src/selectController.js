/* Select Controller

options = {
	selectables: [domEl, domEl, ...] || selector (string)
	targets: [domEl, domEl, ...] || selector (string)
}

TODO: the problem with allowing an array of dom elements is that you have to
update the array if any elements get added/removed. There's currently no mechanism
for that.
*/

import { dsMessager } from './dsMessager.js'

let pushIfNotContains = (el, arr) => {
	if (Array.isArray(arr) && !arr.includes(el)) {	
		arr.push(el);
	}
}

export default class SelectController {
	constructor(myContainerEl, options = {}) {
		const defaults = {
			itemFilterFn: this.defaultFilterFn.bind(this),
			itemClass: "point-n-click",
			selectables: ".draggable",
			targets: ".droppable",
			registerElsOnInit: true,
			positionRelativeTo: false
		};
		// See README.md for info about the different options. 
		this.settings = Object.assign({}, defaults, options);

		// myContainerEl
		this.myContainerEl = myContainerEl;
		this._selectedItem = null;
		this._activeTarget = null;

		this.D_dom_attributes = {
			SELECTED_ID: 'data-selected-draggable-id',
		}

		if (this.settings.registerElsOnInit) {
			this.getAllItems().forEach(
				item => this.registerEl(item)
			);
		}

	}

	// This returns the selectables if no selectedItem is specified,
	// and targets if a selectedItem is specified.
	defaultFilterFn (selectedItem) {
		let filterSettings = null;
		if (!selectedItem) {
			// use selectables
			filterSettings = this.settings.selectables;
		} else {
			filterSettings = this.settings.targets;
		}

		if (typeof filterSettings === 'string') {
			// this is a selector
			return this._getElsBySelector(filterSettings);
		} else if (Array.isArray(filterSettings)) {
			// this should be an array of html els.
			return filterSettings;
		}
	}

	// registration fns

	// So... because we're allowing people to add elements as selectables or targets
	// post-init, we need a way to run the init on just the element, 
	// activating elements, so that they are tabbable etc.

	registerEl(el) {
		if (this.settings.itemFilterFn(this._selectedItem).includes(el)) {
			this._enableEl(el);
		} else {
			this._disableEl(el);
		} 
		if (this.isSelectable(el)) {
			pushIfNotContains(el, this.settings.selectables);
		} else {
			pushIfNotContains(el, this.settings.targets);
		}
	}

	getAllItems() {
		return this._getElsBySelector("." + this.settings.itemClass);
	}

	// selectables fns

	isSelectable(el) {
		return this.getSelectables().includes(el);
	}

	getSelectables() {
		return this.settings.itemFilterFn();
	}

	// targets fns

	isTarget(el) {
		return this.getTargets().includes(el);
	}

	getTargets() {
		return this.settings.itemFilterFn(this._selectedItem);
	}

	/* currently selected item */

	hasSelectedItem() {
		return this._selectedItem !== null; 
	}

	isSelectedItem(el) {
		return el === this._selectedItem;
	}

	getSelectedItem() {
		return this._selectedItem;
	}

	// NOTE: this also disables the selectables and enables targets, handles focus, etc.
	setSelectedItem(el) {
		if (!el) {
			this._unsetSelectedItem();
			return;
		}
		this.myContainerEl.setAttribute(this.D_dom_attributes.SELECTED_ID, el.id);
		this._selectedItem = el;
		el.setAttribute('aria-grabbed', true);
		this.trigger('item_selected', el);
		this.trigger('has_selected', this.myContainerEl);
		this.disableSelectables();
		this.enableTargets();
		el.focus();
	}

	// this unsets the selected item. NOTE: It also disables targets (if enabled) and enables
	// selectables (if disabled). Should we rename to reflect that?
	unsetSelectedItem() {
		if (!this._selectedItem) {
			return;			
		}
		this._selectedItem.setAttribute('aria-grabbed', false);
		this.trigger('item_unselected', this._selectedItem);
		this.trigger('has_unselected', this.myContainerEl);
		// careful, the order here was finicky. disableTargets has to happen
		// before _selectedItem = null, in case the user has passed a fn 
		// (requiring _selectedItem) to identify targets.
		this.disableTargets();
		this._selectedItem.blur();
		this._selectedItem = null;
		this.myContainerEl.removeAttribute(this.D_dom_attributes.SELECTED_ID);

		this.enableSelectables();

	}

	/* active target fns */

	hasActiveTarget() {
		return this._activeTarget !== null; 
	}

	getActiveTarget() {
		return this._activeTarget;
	}

	setActiveTarget(el) {
		if (!el) {
			this.unsetActiveTarget();
			return;
		}
		this._activeTarget = el;
		// this.trigger('item_selected', el);
	}

	unsetActiveTarget() {
		if (!this._activeTarget) {
			return;			
		}
		this._activeTarget = null;
	}

	combine(item, target) {
		item = item || this.getSelectedItem();
		target = target || this.getActiveTarget();
		if (!item || !target) {
			return;
		}
		this.trigger('attempt-combine', target, item);
		this.unsetSelectedItem();
	}

	// enable and disable groups functions (adds tabindex, roles, classes to
	// selectables and targets). These are called as needed by setSelectedItem()
	// and unsetSelectedItem(), so most of the time, we won't need to call these explicitly.
	// I've left these with 'public' notation (not _enableSelectables()) just in case
	// there's a use case I'm not anticipating.

	enableSelectables(callback) {
		this._enableEls(this.getSelectables(), callback);
	}

	disableSelectables(callback) {
		this._disableEls(this.getSelectables(), callback);
	}

	enableTargets(callback) {
		this._enableEls(this.getTargets(), callback);
	}

	disableTargets(callback) {
		this._disableEls(this.getTargets(), callback);
	}

	_enableEl(el, callback) {
		el.removeAttribute('tabindex');
		el.setAttribute('role', 'button');
		el.classList.add('ready');
		if (typeof callback == 'function') {
			callback(el);
		}
	}

	_disableEl(el, callback) {
		el.setAttribute('tabindex', -1);
		el.removeAttribute('role');	
		el.classList.remove('ready');
		if (typeof callback == 'function') {
			callback(el);
		}
	}

	_enableEls(els, callback) {
		els.forEach(el => this._enableEl(el, callback));
	}

	_disableEls(els, callback) {
		els.forEach(el => this._disableEl(el, callback));
	}

	// utils

	// [].slice.call is for EDGE, so we get an array from querySelectorAll,
	// like we do in other browsers.
	_getElsBySelector(selector) {
		return [].slice.call(this.myContainerEl.querySelectorAll(selector));
	}

	// events
	trigger(eventName, target, requester) {
		dsMessager().publish(eventName, target, {
	  		target: target,
	  		requester: requester 
	  	});
	}
}
