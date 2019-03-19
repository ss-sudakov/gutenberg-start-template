import { Component } from '@wordpress/element';
import ImageControl from '../libs/imageControl/imageControl';
import { Button, TextareaControl } from '@wordpress/components';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import ItemTypes from '../libs/dnd types/dnd-types'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	margin: '.5rem',
	backgroundColor: 'white',
	cursor: 'move'
};

const slideSource = {

	beginDrag(props) {		
		return {			
			index: props.index,
			listId: props.listId,
			slide: props.slide
		};
	},

	endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();	

		if ( dropResult && dropResult.listId !== item.listId ) {
			props.removeSlide(item.index);
		}
	}
};



const slideTarget = {

	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;
		const sourceListId = monitor.getItem().listId;	

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		if ( props.listId === sourceListId ) {
			props.moveSlide(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			monitor.getItem().index = hoverIndex;
		}		
	}
};

class SlideItem extends Component {

	constructor()
	{
		super(...arguments)

		const 
		{ 
			setAttributes,
			attributes,
		} = this.props;
	}

	render_slide_item = () =>
	{
		const {row, index, _this, isDragging, connectDragSource, connectDropTarget} = this.props;
		const opacity = isDragging ? 0 : 1;

		let render = <div className="row margin-15" key={row.slide.id} index={ index }  style={{ ...style, opacity }}>
						<div className="col-sm">
							<div className="thumbnail">
								<ImageControl image={row.slide.image} instans={ row } set_image={ (image) => { _this.set_image( image ) } }  remove_image={ (row) => { _this.remove_image( row ) } } />
							</div>
						</div>
						<div className="col-sm">
							<div className="title">
								<TextareaControl
									lable="Slide title"
									help="Etern slide title here"
									value={row.title}
									autoFocus
									onChange={ (title) => { _this.on_change_title(title, row) } }
								/>
							</div>
						</div>
						<div className="col-sm">
						<Button 
							isDefault 
							onClick={ (e) => { _this.remove_row(row) } }>
							Remove slide
						</Button>
						</div>
					</div>
		return  connectDragSource(connectDropTarget(render));
	}

	render()
	{
		return this.render_slide_item();
	}
}

export default DropTarget(ItemTypes.SLIDE, slideTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
  DragSource(ItemTypes.SLIDE, slideSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(SlideItem),
)