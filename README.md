# point-n-click.js

Point and click input library, for selecting items and dropping them onto other items. Contains modules for click-only, mouse drag, touch drag, and keyboard controls.

Items can be selectable and/or targets for selectables.

Emits events when an item is selected, dragged, and dropped (or combined with a target).

## Install

Use the distribution file at `https://dcc.ilc.org/point-n-click/dist/point-n-click.js` 
or build:

```
npm install
npm run build
```

That will build the packaged js into /dist/point-n-click.js

Or:

```
npm run watch
```

To automatically rebuild the package whenever a change to the source files is saved.

## Usage

First, instantiate your selectController. In its simplest form:

```javascript
var myApp = document.getElementById('myApp');
var selectController = new PointNClick.SelectController(myApp);
```
By default, it will make anything with the `.draggable` class selectable, and anything 
with the `.droppable` class targets for those selectables.

You can also specify options in the selectController:

```javascript
var options = {
	itemFilterFn: function(selectedItem) {},
	itemClass: string, // a class that identifies all dom elements which will
					   // be either selectables or targets
	selectables: [domEl, domEl, ...] || selector (string),
	targets: [domEl, domEl, ...] || selector (string),
	registerElsOnInit: bool // you can register elements yourself if you've got
							// fancy criteria. (otherwise, this will run registerEl() 
							// on all elements with itemClass, which enables 
							// selectables and disables targets.
}

var selectController = new PointNClick.SelectController(myApp, options)
```

Note that you can either specify the selectables and targets, or an itemFilterFn. If you specify an itemFilterFn, pointNClick will ignore the selectables and targets options.

### selectables, targets 
can be either a selector (like `".draggable"`) or an array of DOM elements.

### itemFilterFn(selectedItem)
_return: array of DOM elements_

If you specify an itemFilterFn, pointNClick will evaluate the function at runtime, on init or whenever the selectedItem changes. It will pass the selectedItem as an argument (if anything is selected). This is useful for evaluating available targets based on the selected item, for example. But the simplest example just implements the default behaviour:
```javascript
function myFilterFn(selectedItem) {
	if (!selectedItem) {
		// We have no selected item, return everything 
		// that's selectable.
		return document.querySelectorAll(".selectable");
	} else {
		return document.querySelectorAll(".target");
		// or return a subset of targets based on the selectable...
	}
}
// I'm using document.querySelectorAll() for simplicity; be aware
// that it doesn't return an array in EDGE. Use
// [].slice.call(document.querySelectorAll()) instead.

var selectController = new PointNClick.SelectController(myApp, {
	itemFilterFn: myFilterFn
})
```


Next add any input controllers you want. You can add all or just one.

```javascript
new PointNClick.ClickController(myApp, selectController);
new PointNClick.MouseDragController(myApp, selectController);
new PointNClick.TouchDragController(myApp, selectController);
new PointNClick.KeyboardController(myApp, selectController);
```

Attach your eventListeners and callbacks.

```javascript
function _onAttemptCombine(e) {
		console.log("attempted combine! Requester: " + e.detail.requester.id + " Target:" +  e.detail.target.id );
}

myApp.addEventListener('attempt-combine', _onAttemptCombine);

```
See `src/dsMessager.js` for a full list of events emitted, and the css classes that get added/removed with each event.

That's it. Note that point-n-click doesn't handle your combine logic, you'll need to write that yourself.

## Gotchas

For keyboard access, selectables currently need to be focusable elements: buttons, links, etc. It would be possible to manipulate tabindex, but setting it arbitrarily to '1' or similar can make the tab order a little wonky if there are other elements on the page.


