import PointerDragController from './pointerDragController.js'

export default class TouchDragController extends PointerDragController {
	constructor(el, selectController) {
		super(el, selectController);

		this._onTouchStart = this._onTouchStart.bind(this);
		this._onTouchMove = this._onTouchMove.bind(this);
		this._onTouchEnd = this._onTouchEnd.bind(this);

		this.myContainerEl.ontouchmove = function(e){ e.preventDefault(); }

		selectController.getSelectables().forEach(
			draggable => this.registerEl(draggable)
		);
		this.myContainerEl.addEventListener('touchmove', this._onTouchMove);
		window.addEventListener('touchend', this._onTouchEnd);
	}

	registerEl(el) {
		el.removeEventListener('touchstart', this._onTouchStart);
		el.addEventListener('touchstart', this._onTouchStart);
	}

	_onTouchStart(e) {
		// figure out how to add touch-specific classes, events etc.
		this._onPressStart(e);
	}

	_onTouchMove(e) {
		this._onPressMove(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		e.preventDefault();
	}

	_onTouchEnd(e) {
		this._onPressEnd(e);
	}

} 
