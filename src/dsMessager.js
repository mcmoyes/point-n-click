export function dsMessager () {

	const D_events = {

		/* drag */
		item_drag_start: 		{ addClasses: 'draggable-item--dragging' },
		item_dragging: 			{},
		item_drag_end: 			{ removeClasses: 'draggable-item--dragging' },
		// the next three are applied to the container element (the workspace).
		drag_start:				{ addClasses: 'dragging' },
		dragging:				{},
		drag_end:				{ removeClasses: 'dragging' },

		/* drag -- touch specific */
		// item_drag_start_touch: 	{ addClasses: 'draggable-item--dragging--touch' },
		// item_dragging_touch: 	{},
		// item_drag_end_touch: 	{ removeClasses: 'draggable-item--dragging--touch' },

		/* select */
		item_selected: 			{ addClasses: 'draggable-item--selected' },
		item_unselected: 		{ removeClasses: 'draggable-item--selected' },
		// the next two are applied to the container element (the workspace).
		has_selected:			{ addClasses: 'workspace-has-selected'},
		has_unselected:			{ removeClasses: 'workspace-has-selected'},

		/* containers */
		// container_dropped_onto: { addClasses: 'draggable-container--occupied'},
		// container_emptied:  	{ removeClasses: 'draggable-container--occupied' },
		container_over: 		{ addClasses: 'droppable-container--over'},
		container_out: 			{ removeClasses: 'droppable-container--over'},

		/* actions */
		attempt_combine: 		{},

	};

	let _publish = (eventName, receiver, data, bubbles = true) => {
		let event = new CustomEvent(eventName, {
			detail: data,
			bubbles: bubbles
		});
		receiver.dispatchEvent(event);
		if (data.target && D_events[eventName]) {
			data.target.classList.add(D_events[eventName].addClasses);
			data.target.classList.remove(D_events[eventName].removeClasses);
		}

	}

	return {
		publish: _publish
	}

}
