import SelectController from "./src/selectController.js"
import TouchDragController from "./src/touchDragController.js"
import MouseDragController from "./src/mouseDragController.js"
import KeyboardController from "./src/keyboardController.js"
import ClickController from "./src/clickController.js"


var PointNClick = {
	SelectController: SelectController,
	TouchDragController: TouchDragController,
	MouseDragController: MouseDragController,
	KeyboardController: KeyboardController,
	ClickController: ClickController
};

module.exports = PointNClick;

