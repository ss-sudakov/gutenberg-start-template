/**
 * BLOCK: mphar-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import { Component } from '@wordpress/element';
import ImageControl from '../libs/imageControl/imageControl.js';
import { Button, Modal } from '@wordpress/components';
import { withState } from '@wordpress/compose';

const { __ } = wp.i18n; // Import __() from wp.i18n

const {
    RichText,
    PlainText,
    Editable,
    InspectorControls,
    MediaUpload,
} = wp.editor;

const {
    registerBlockType,
    BlockControls,
    AlignmentToolbar
} = wp.blocks; // Import registerBlockType() from wp.blocks

export default class SliderModal extends Component {

		constructor()
		{
			super(...arguments)

			const 
			{ 
				setAttributes, 
				attributes,
				className,
				setState
			} = this.props;

			this.state = {rows: []}
			
		}

		get_prefix = () =>
		{
			const prefix = this.props.prefix

			return prefix
		}

		set_image = (image) =>
		{

		    console.log(image)
		}

		remove_image = (image) =>
		{

			console.log(image)
		    
		}

		on_change_title = (title) =>
		{

		}

		add_row = () =>
		{

			let newRow = {slide: {
							id: _.uniqueId(this.get_prefix()),
							image: {},
							title: {}
						}};

			let prevState = this.state;

			

			var newState = prevState;

			newState.rows.push(newRow);

			this.setState(newState);
			
		}

		get_rows = () => 
		{
			let rows

			rows = this.props.rows

			if(! rows)
			{
				rows = this.state.rows
			}

			return rows
		}

		render_rows = () => {

			const rows = this.get_rows()
			let image;
			let rendeRows = []
			
			$.each(rows,function( index, row ) {

				let slide = row;

				rendeRows.push(

					<div className="row" key={slide.id} >
						<div className="col-sm">
							<div className="thumbnail">
								<ImageControl image={slide.image} set_image={this.set_image} remove_image={this.remove_image}/>
							</div>
						</div>
						<div className="col-sm">
							<div className="title">
								<RichText
									tagName="p"
									placeholder="Slide title"
									value={slide.title}
									autoFocus
									onChange={this.on_change_title}
								/>
							</div>
						</div>
					</div>
					)
			});

			return rendeRows
		}

		logic_modal = () =>
		{
			this.setState({ isOpen: !this.state.isOpen })
		}

		render_modal = () =>
		{
			let isOpen = this.state.isOpen;

			console.log( this);

			let ModalWindow = 
							    <div>
							        <Button isDefault onClick={ () => { this.logic_modal() }  }>Open Modal</Button>
							        { isOpen && (
							            <Modal
							                title="Slides collection"
							                onRequestClose={ () => { this.logic_modal() } }>
							                <div className="container">
							                	{ this.render_rows() }
							                	<div className="row" >
									                <Button 
														isDefault 
														onClick={() => { this.add_row() } }>
									                	Add slide
									                </Button>
							                	</div>
						                	</div>
							            </Modal>
							        ) }
							    </div>

			return ModalWindow
		}

		render(){
			return this.render_modal()
		}
		
}