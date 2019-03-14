/**
 * BLOCK: mphar-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import { Component } from '@wordpress/element';
import ImageControl from '../libs/imageControl/imageControl';
import { Button, TextareaControl } from '@wordpress/components';
import Modal from 'react-responsive-modal';

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

		initialState()
		{
			const rows = this.props.rows;

			if( rows.length != 0 )
			{
				return this.state = {rows: rows};
			}
			else
			{
				return this.state = {rows: []};
			}

				
		}

		constructor()
		{
			super(...arguments)

			const 
			{ 
				attributes,
				className,
				setState
			} = this.props;

			this.initialState();

			
		}

		get_prefix = () =>
		{
			const prefix = this.props.prefix

			return prefix
		}

		set_image = (attr) =>
		{
			attr.instans.slide.image = attr.image

			let prevState = this.state.rows;

			$.each(prevState, function(index, _slide) {
				if(attr.instans.slide.id == _slide.id){
					_slide = attr.instans;
				}
			});

			let newState = prevState;

			this.setState({rows: newState});
			this.props.save_slider({rows: newState})
		}

		remove_image = (attr) =>
		{
			let slideID = attr.instans.slide.id;
			let prevState = this.state.rows;

			$.each(prevState, function(index, row) {

				if(slideID === row.slide.id){
					row.slide.image = {};
				}
			});

			let newState = prevState;

			this.setState({rows: newState})
			this.props.save_slider({rows: newState})
		    
		}

		on_change_title = (title, slide) =>
		{
			slide.title = title

			let prevState = this.state.rows;

			$.each(prevState, function(index, _slide) {
				if(slide.id == _slide.id){
					_slide = slide
				}
			});

			let newState = prevState;

			this.setState({rows: newState})
			this.props.save_slider({rows: newState})

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
			this.props.save_slider(newState)
			
		}

		remove_row = (row) =>
		{
			let prevState = this.state.rows;

			let newState = prevState.filter(function(_row) { 
			    return _row !== row
			})

			this.setState({rows: newState});
			this.props.save_slider({rows: newState})
		}

		get_rows = () => 
		{
			let rows

			rows = this.props.rows

			if(!rows)
			{
				rows = this.state.rows
			}

			return rows
		}

		render_rows = () => {

			const rows = this.get_rows()
			let image;
			let rendeRows = []
			let _this = this
			
			$.each(rows,function( index, row ) {

				rendeRows.push(

					<div className="row margin-15" key={row.slide.id} >
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
					);
			});

			return rendeRows
		}

		toggle_modal = () =>
		{
			this.setState({ isOpen: !this.state.isOpen })
		}

		render_modal = () =>
		{
			let isOpen = this.state.isOpen;

			let ModalWindow = 
							    <div>
							        <Button isDefault onClick={ () => { this.toggle_modal() }  }>Open Modal</Button>
							        { isOpen && (
							            <Modal open={isOpen} onClose={ this.toggle_modal } center>
							            	<br/>
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