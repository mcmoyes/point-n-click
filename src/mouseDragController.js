import PointerDragController from './pointerDragController.js'

export default class MouseDragController extends PointerDragController {
	constructor(el, selectController) {
		super(el, selectController);

		this._onMouseDown = this._onMouseDown.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);

		selectController.getSelectables().forEach(
			draggable => this.registerEl(draggable)
		);
		window.addEventListener('mousemove', this._onMouseMove);
		window.addEventListener('mouseup', this._onMouseUp);

	}

	registerEl(el) {
		el.removeEventListener('mousedown', this._onMouseDown);
		el.addEventListener('mousedown', this._onMouseDown);
	}

	_onMouseDown(e) {
		if (e.button == 0) {
			this._onPressStart(e);
			// Note that if we don't prevent default here, dragging sometimes
			// tries to use OS-level (or maybe browser-level) drag functionality.
			// We can't do this in the pointerDragController though, because
			// if we preventDefault on a touchStart, 'clicks' never go through
			// (ie even when it's not a drag.)
			e.preventDefault();			
		}
	}

	_onMouseMove(e) {
		if (e.button == 0) {
			this._onPressMove(e, e.clientX, e.clientY);
		}	
		// changedTouches[0].pageX
	}

	_onMouseUp(e) {
		if (e.button == 0) {
			this._onPressEnd(e);
			e.preventDefault();			
		}
	}

} 

