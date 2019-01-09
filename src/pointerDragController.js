import { dsMessager } from './dsMessager.js'

export default class PointerDragController {
	constructor(el, selectController) {
		this.pointerPosition = {
			x: 0,
			y: 0,
			origX: 0,
			origY: 0
		}
		this._pressStartTime = null;
		this._clickMaxTime = 150;

		this._prevPositionStyle = null;

		this._isDragging = false;
		this.myContainerEl = el;
		this._selectController = selectController;
		this._potentialSelect = null;

		// we're going to store the targets at pressStart, so that we're not reevaluating 
		// the select function on every pressMove event.
		this._currentTargets = [];
		if (this._selectController.settings.positionRelativeTo) {
			this.myContainerEl.style.position = "relative";
		}
	}


	// Generic pointer event handlers
	_onPressStart(e) {

		var target = e.currentTarget;

		this._pressStartTime = (new Date).getTime();

		// Check if the mousedown is on a selectable element.
		if (this._selectController.isSelectable(target)) 
		{
			this.pointerPosition.origX = target.getBoundingClientRect().left;
			this.pointerPosition.origY = target.getBoundingClientRect().top;
			this._potentialSelect = target;
			e.stopPropagation();
		} 
	}

	_onPressMove(e, x, y) {

		// this gets set before we know if it's a drag or click.
		if (this._potentialSelect) {
			var target = this._potentialSelect;
			if (!this._isDragging && this._isMove()) {
				// drag start
				target.style.pointerEvents = "none";
				this._isDragging = true;
				this._selectController.setSelectedItem(target);

				this.trigger('item_drag_start', target);
				this.trigger('drag_start', this.myContainerEl);
				this._prepareDragStyles(target);
				this._potentialSelect = null;
				this._currentTargets = this._selectController.getTargets();
			}

		}
		if (this._selectController.hasSelectedItem()) {
			var target = this._selectController.getSelectedItem();


			if (this._isDragging && this._selectController.hasSelectedItem()) {

				this.trigger('item_dragging', target);
				this.trigger('dragging', this.myContainerEl);
				this.pointerPosition.x = x;
				this.pointerPosition.y = y;

				this.moveElToPosition(target, this.pointerPosition.x, this.pointerPosition.y);
				var targetElement = this.getTopmostTarget(this.pointerPosition.x, this.pointerPosition.y);

				if (targetElement) {
					if (this._selectController.getActiveTarget() !== targetElement) {
						if (this._selectController.hasActiveTarget()) {
							this._cancelHover();
						}
						// this fires the first time we go over a target.
						this._selectController.setActiveTarget(targetElement);
						this.trigger('container_over', targetElement);

					}
					
				} else if (this._selectController.hasActiveTarget()) {
					this._cancelHover();
				}
 
			}

			e.preventDefault();

		}

	}

	_onPressEnd(e) {
		this._pressStartTime = null;
		this._potentialSelect = null;
		this._currentTargets = [];
		var target = e.currentTarget;

		if (this._isDragging) {
			target = this._selectController.getSelectedItem();
			this._isDragging = false;

			// if dropped onto a valid element, broadcast.
			if (this._selectController.hasActiveTarget()) {
				this._selectController.combine();
			}

			this.trigger('item_drag_end', target);
			this.trigger('drag_end', this.myContainerEl);
			this._removeDragStyles(target);
			this._cancelHover();

			this._selectController.unsetSelectedItem();
			this._selectController.unsetActiveTarget();
			e.stopPropagation();
			target.style.pointerEvents = "auto";
		} 

	}

	_cancelHover() {
		if (this._selectController.hasActiveTarget()) {
			// we've left a the target.
			this.trigger('container_out', this._selectController.getActiveTarget());
			this._selectController.unsetActiveTarget();

		}
	}

	// find topmost element that is a target (or null)
	// modified from: https://github.com/Shopify/draggable/blob/master/src/shared/utils/closest/closest.js
	getTopmostTarget(x, y) {
		let el = document.elementFromPoint(x, y);

		do {
			if (!el) return;
			if (this._currentTargets.includes(el)) {
				return el;
			}
			el = el.parentNode;
		} while (el && el !== this.myContainerEl && el !== document.body && el !== document);

		return null;
	}

	// DOM manipulation

	moveElToPosition(el, posX, posY) {

		if (this._selectController.settings.positionRelativeTo) {
			var viewportOffset = this._selectController.settings.positionRelativeTo.getBoundingClientRect();
			// these are relative to the viewport
			posX = posX - viewportOffset.left;
			posY = posY - viewportOffset.top;

		}
	
		el.style.left = posX + 'px';
		el.style.top = posY + 'px';
	}

	_prepareDragStyles(target) {
		this.prevPositionStyle = target.style.position;
		if (this._selectController.settings.positionRelativeTo) {
			target.style.position = 'absolute';
		} else {
			target.style.position = 'fixed';
		}

	}

	_removeDragStyles(target) {
		this.moveElToPosition(target, this.pointerPosition.origX, this.pointerPosition.origY);
		target.style.position = this._prevPositionStyle;
		target.style.left = null;
		target.style.top = null;
		this._prevPositionStyle = null;
	}

	// State functions

	_isMove() {
		if (this._pressStartTime === null) {
			return false;
		}
		return ((new Date).getTime() - this._pressStartTime > this._clickMaxTime);
	}


	// events
	trigger(eventName, target) {
		dsMessager().publish(eventName, target, {
	  		pointerPosition: this.pointerPosition,
	  		target: target
	  	});
	}

} 

