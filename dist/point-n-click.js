this["PointNClick"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.dsMessager = dsMessager;
function dsMessager() {

	var D_events = {

		/* drag */
		item_drag_start: { addClasses: 'draggable-item--dragging' },
		item_dragging: {},
		item_drag_end: { removeClasses: 'draggable-item--dragging' },
		// the next three are applied to the container element (the workspace).
		drag_start: { addClasses: 'dragging' },
		dragging: {},
		drag_end: { removeClasses: 'dragging' },

		/* drag -- touch specific */
		// item_drag_start_touch: 	{ addClasses: 'draggable-item--dragging--touch' },
		// item_dragging_touch: 	{},
		// item_drag_end_touch: 	{ removeClasses: 'draggable-item--dragging--touch' },

		/* select */
		item_selected: { addClasses: 'draggable-item--selected' },
		item_unselected: { removeClasses: 'draggable-item--selected' },
		// the next two are applied to the container element (the workspace).
		has_selected: { addClasses: 'workspace-has-selected' },
		has_unselected: { removeClasses: 'workspace-has-selected' },

		/* containers */
		// container_dropped_onto: { addClasses: 'draggable-container--occupied'},
		// container_emptied:  	{ removeClasses: 'draggable-container--occupied' },
		container_over: { addClasses: 'droppable-container--over' },
		container_out: { removeClasses: 'droppable-container--over' },

		/* actions */
		attempt_combine: {}

	};

	var _publish = function _publish(eventName, receiver, data) {
		var bubbles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		var event = new CustomEvent(eventName, {
			detail: data,
			bubbles: bubbles
		});
		receiver.dispatchEvent(event);
		if (data.target && D_events[eventName]) {
			data.target.classList.add(D_events[eventName].addClasses);
			data.target.classList.remove(D_events[eventName].removeClasses);
		}
	};

	return {
		publish: _publish
	};
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dsMessager = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PointerDragController = function () {
	function PointerDragController(el, selectController) {
		_classCallCheck(this, PointerDragController);

		this.pointerPosition = {
			x: 0,
			y: 0,
			origX: 0,
			origY: 0
		};
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


	_createClass(PointerDragController, [{
		key: "_onPressStart",
		value: function _onPressStart(e) {

			var target = e.currentTarget;

			this._pressStartTime = new Date().getTime();

			// Check if the mousedown is on a selectable element.
			if (this._selectController.isSelectable(target)) {
				this.pointerPosition.origX = target.getBoundingClientRect().left;
				this.pointerPosition.origY = target.getBoundingClientRect().top;
				this._potentialSelect = target;
				e.stopPropagation();
			}
		}
	}, {
		key: "_onPressMove",
		value: function _onPressMove(e, x, y) {

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
	}, {
		key: "_onPressEnd",
		value: function _onPressEnd(e) {
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
	}, {
		key: "_cancelHover",
		value: function _cancelHover() {
			if (this._selectController.hasActiveTarget()) {
				// we've left a the target.
				this.trigger('container_out', this._selectController.getActiveTarget());
				this._selectController.unsetActiveTarget();
			}
		}

		// find topmost element that is a target (or null)
		// modified from: https://github.com/Shopify/draggable/blob/master/src/shared/utils/closest/closest.js

	}, {
		key: "getTopmostTarget",
		value: function getTopmostTarget(x, y) {
			var el = document.elementFromPoint(x, y);

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

	}, {
		key: "moveElToPosition",
		value: function moveElToPosition(el, posX, posY) {

			if (this._selectController.settings.positionRelativeTo) {
				var viewportOffset = this._selectController.settings.positionRelativeTo.getBoundingClientRect();
				// these are relative to the viewport
				posX = posX - viewportOffset.left;
				posY = posY - viewportOffset.top;
			}

			el.style.left = posX + 'px';
			el.style.top = posY + 'px';
		}
	}, {
		key: "_prepareDragStyles",
		value: function _prepareDragStyles(target) {
			this.prevPositionStyle = target.style.position;
			if (this._selectController.settings.positionRelativeTo) {
				target.style.position = 'absolute';
			} else {
				target.style.position = 'fixed';
			}
		}
	}, {
		key: "_removeDragStyles",
		value: function _removeDragStyles(target) {
			this.moveElToPosition(target, this.pointerPosition.origX, this.pointerPosition.origY);
			target.style.position = this._prevPositionStyle;
			target.style.left = null;
			target.style.top = null;
			this._prevPositionStyle = null;
		}

		// State functions

	}, {
		key: "_isMove",
		value: function _isMove() {
			if (this._pressStartTime === null) {
				return false;
			}
			return new Date().getTime() - this._pressStartTime > this._clickMaxTime;
		}

		// events

	}, {
		key: "trigger",
		value: function trigger(eventName, target) {
			(0, _dsMessager.dsMessager)().publish(eventName, target, {
				pointerPosition: this.pointerPosition,
				target: target
			});
		}
	}]);

	return PointerDragController;
}();

exports.default = PointerDragController;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _selectController = __webpack_require__(3);

var _selectController2 = _interopRequireDefault(_selectController);

var _touchDragController = __webpack_require__(4);

var _touchDragController2 = _interopRequireDefault(_touchDragController);

var _mouseDragController = __webpack_require__(5);

var _mouseDragController2 = _interopRequireDefault(_mouseDragController);

var _keyboardController = __webpack_require__(6);

var _keyboardController2 = _interopRequireDefault(_keyboardController);

var _clickController = __webpack_require__(7);

var _clickController2 = _interopRequireDefault(_clickController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PointNClick = {
	SelectController: _selectController2.default,
	TouchDragController: _touchDragController2.default,
	MouseDragController: _mouseDragController2.default,
	KeyboardController: _keyboardController2.default,
	ClickController: _clickController2.default
};

module.exports = PointNClick;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Select Controller
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     options = {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     	selectables: [domEl, domEl, ...] || selector (string)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     	targets: [domEl, domEl, ...] || selector (string)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     TODO: the problem with allowing an array of dom elements is that you have to
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     update the array if any elements get added/removed. There's currently no mechanism
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     for that.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _dsMessager = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pushIfNotContains = function pushIfNotContains(el, arr) {
	if (Array.isArray(arr) && !arr.includes(el)) {
		arr.push(el);
	}
};

var SelectController = function () {
	function SelectController(myContainerEl) {
		var _this = this;

		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, SelectController);

		var defaults = {
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
			SELECTED_ID: 'data-selected-draggable-id'
		};

		if (this.settings.registerElsOnInit) {
			this.getAllItems().forEach(function (item) {
				return _this.registerEl(item);
			});
		}
	}

	// This returns the selectables if no selectedItem is specified,
	// and targets if a selectedItem is specified.


	_createClass(SelectController, [{
		key: "defaultFilterFn",
		value: function defaultFilterFn(selectedItem) {
			var filterSettings = null;
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

	}, {
		key: "registerEl",
		value: function registerEl(el) {
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
	}, {
		key: "getAllItems",
		value: function getAllItems() {
			return this._getElsBySelector("." + this.settings.itemClass);
		}

		// selectables fns

	}, {
		key: "isSelectable",
		value: function isSelectable(el) {
			return this.getSelectables().includes(el);
		}
	}, {
		key: "getSelectables",
		value: function getSelectables() {
			return this.settings.itemFilterFn();
		}

		// targets fns

	}, {
		key: "isTarget",
		value: function isTarget(el) {
			return this.getTargets().includes(el);
		}
	}, {
		key: "getTargets",
		value: function getTargets() {
			return this.settings.itemFilterFn(this._selectedItem);
		}

		/* currently selected item */

	}, {
		key: "hasSelectedItem",
		value: function hasSelectedItem() {
			return this._selectedItem !== null;
		}
	}, {
		key: "isSelectedItem",
		value: function isSelectedItem(el) {
			return el === this._selectedItem;
		}
	}, {
		key: "getSelectedItem",
		value: function getSelectedItem() {
			return this._selectedItem;
		}

		// NOTE: this also disables the selectables and enables targets, handles focus, etc.

	}, {
		key: "setSelectedItem",
		value: function setSelectedItem(el) {
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

	}, {
		key: "unsetSelectedItem",
		value: function unsetSelectedItem() {
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

	}, {
		key: "hasActiveTarget",
		value: function hasActiveTarget() {
			return this._activeTarget !== null;
		}
	}, {
		key: "getActiveTarget",
		value: function getActiveTarget() {
			return this._activeTarget;
		}
	}, {
		key: "setActiveTarget",
		value: function setActiveTarget(el) {
			if (!el) {
				this.unsetActiveTarget();
				return;
			}
			this._activeTarget = el;
			// this.trigger('item_selected', el);
		}
	}, {
		key: "unsetActiveTarget",
		value: function unsetActiveTarget() {
			if (!this._activeTarget) {
				return;
			}
			this._activeTarget = null;
		}
	}, {
		key: "combine",
		value: function combine(item, target) {
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

	}, {
		key: "enableSelectables",
		value: function enableSelectables(callback) {
			this._enableEls(this.getSelectables(), callback);
		}
	}, {
		key: "disableSelectables",
		value: function disableSelectables(callback) {
			this._disableEls(this.getSelectables(), callback);
		}
	}, {
		key: "enableTargets",
		value: function enableTargets(callback) {
			this._enableEls(this.getTargets(), callback);
		}
	}, {
		key: "disableTargets",
		value: function disableTargets(callback) {
			this._disableEls(this.getTargets(), callback);
		}
	}, {
		key: "_enableEl",
		value: function _enableEl(el, callback) {
			el.removeAttribute('tabindex');
			el.setAttribute('role', 'button');
			el.classList.add('ready');
			if (typeof callback == 'function') {
				callback(el);
			}
		}
	}, {
		key: "_disableEl",
		value: function _disableEl(el, callback) {
			el.setAttribute('tabindex', -1);
			el.removeAttribute('role');
			el.classList.remove('ready');
			if (typeof callback == 'function') {
				callback(el);
			}
		}
	}, {
		key: "_enableEls",
		value: function _enableEls(els, callback) {
			var _this2 = this;

			els.forEach(function (el) {
				return _this2._enableEl(el, callback);
			});
		}
	}, {
		key: "_disableEls",
		value: function _disableEls(els, callback) {
			var _this3 = this;

			els.forEach(function (el) {
				return _this3._disableEl(el, callback);
			});
		}

		// utils

		// [].slice.call is for EDGE, so we get an array from querySelectorAll,
		// like we do in other browsers.

	}, {
		key: "_getElsBySelector",
		value: function _getElsBySelector(selector) {
			return [].slice.call(this.myContainerEl.querySelectorAll(selector));
		}

		// events

	}, {
		key: "trigger",
		value: function trigger(eventName, target, requester) {
			(0, _dsMessager.dsMessager)().publish(eventName, target, {
				target: target,
				requester: requester
			});
		}
	}]);

	return SelectController;
}();

exports.default = SelectController;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pointerDragController = __webpack_require__(1);

var _pointerDragController2 = _interopRequireDefault(_pointerDragController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TouchDragController = function (_PointerDragControlle) {
	_inherits(TouchDragController, _PointerDragControlle);

	function TouchDragController(el, selectController) {
		_classCallCheck(this, TouchDragController);

		var _this = _possibleConstructorReturn(this, (TouchDragController.__proto__ || Object.getPrototypeOf(TouchDragController)).call(this, el, selectController));

		_this._onTouchStart = _this._onTouchStart.bind(_this);
		_this._onTouchMove = _this._onTouchMove.bind(_this);
		_this._onTouchEnd = _this._onTouchEnd.bind(_this);

		_this.myContainerEl.ontouchmove = function (e) {
			e.preventDefault();
		};

		selectController.getSelectables().forEach(function (draggable) {
			return _this.registerEl(draggable);
		});
		_this.myContainerEl.addEventListener('touchmove', _this._onTouchMove);
		window.addEventListener('touchend', _this._onTouchEnd);
		return _this;
	}

	_createClass(TouchDragController, [{
		key: 'registerEl',
		value: function registerEl(el) {
			el.removeEventListener('touchstart', this._onTouchStart);
			el.addEventListener('touchstart', this._onTouchStart);
		}
	}, {
		key: '_onTouchStart',
		value: function _onTouchStart(e) {
			// figure out how to add touch-specific classes, events etc.
			this._onPressStart(e);
		}
	}, {
		key: '_onTouchMove',
		value: function _onTouchMove(e) {
			this._onPressMove(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
			e.preventDefault();
		}
	}, {
		key: '_onTouchEnd',
		value: function _onTouchEnd(e) {
			this._onPressEnd(e);
		}
	}]);

	return TouchDragController;
}(_pointerDragController2.default);

exports.default = TouchDragController;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pointerDragController = __webpack_require__(1);

var _pointerDragController2 = _interopRequireDefault(_pointerDragController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseDragController = function (_PointerDragControlle) {
	_inherits(MouseDragController, _PointerDragControlle);

	function MouseDragController(el, selectController) {
		_classCallCheck(this, MouseDragController);

		var _this = _possibleConstructorReturn(this, (MouseDragController.__proto__ || Object.getPrototypeOf(MouseDragController)).call(this, el, selectController));

		_this._onMouseDown = _this._onMouseDown.bind(_this);
		_this._onMouseMove = _this._onMouseMove.bind(_this);
		_this._onMouseUp = _this._onMouseUp.bind(_this);

		selectController.getSelectables().forEach(function (draggable) {
			return _this.registerEl(draggable);
		});
		window.addEventListener('mousemove', _this._onMouseMove);
		window.addEventListener('mouseup', _this._onMouseUp);

		return _this;
	}

	_createClass(MouseDragController, [{
		key: 'registerEl',
		value: function registerEl(el) {
			el.removeEventListener('mousedown', this._onMouseDown);
			el.addEventListener('mousedown', this._onMouseDown);
		}
	}, {
		key: '_onMouseDown',
		value: function _onMouseDown(e) {
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
	}, {
		key: '_onMouseMove',
		value: function _onMouseMove(e) {
			if (e.button == 0) {
				this._onPressMove(e, e.clientX, e.clientY);
			}
			// changedTouches[0].pageX
		}
	}, {
		key: '_onMouseUp',
		value: function _onMouseUp(e) {
			if (e.button == 0) {
				this._onPressEnd(e);
				e.preventDefault();
			}
		}
	}]);

	return MouseDragController;
}(_pointerDragController2.default);

exports.default = MouseDragController;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyboardController = function () {
	function KeyboardController(el, selectController) {
		var _this = this;

		_classCallCheck(this, KeyboardController);

		this._onKeyDown = this._onKeyDown.bind(this);
		this.myContainerEl = el;
		this._selectController = selectController;

		this._selectController.getAllItems().forEach(function (item) {
			return _this.registerEl(item);
		});
	}

	_createClass(KeyboardController, [{
		key: 'registerEl',
		value: function registerEl(el) {
			el.removeEventListener('keydown', this._onKeyDown);
			el.addEventListener('keydown', this._onKeyDown);
		}
	}, {
		key: '_onKeyDown',
		value: function _onKeyDown(e) {
			var ESC = 27,
			    ENTER = 13;

			var target = e.target;

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
	}]);

	return KeyboardController;
}();

exports.default = KeyboardController;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClickController = function () {
	function ClickController(el, selectController) {
		var _this = this;

		_classCallCheck(this, ClickController);

		this.myContainerEl = el;
		this._selectController = selectController;

		this._onClick = this._onClick.bind(this);

		this._selectController.getAllItems().forEach(function (item) {
			return _this.registerEl(item);
		});
	}

	_createClass(ClickController, [{
		key: 'registerEl',
		value: function registerEl(el) {
			el.removeEventListener('click', this._onClick);
			el.addEventListener('click', this._onClick);
		}
	}, {
		key: '_onClick',
		value: function _onClick(e) {
			var target = e.currentTarget;

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
	}]);

	return ClickController;
}();

exports.default = ClickController;

/***/ })
/******/ ]);
//# sourceMappingURL=point-n-click.js.map