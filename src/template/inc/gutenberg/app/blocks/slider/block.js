/**
 * BLOCK: mphar-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import { Component } from '@wordpress/element';
import ImageControl from '../libs/imageControl/imageControl.js';
import SliderModal from './sliderModal.js';
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


class Slider extends Component {

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
		}

		onChangeTitle = (value) => 
		{
			
			this.props.setAttributes({
				title: value
			});
	    }

	    onChangeDescription = (value) =>
	    {
			this.props.setAttributes({
				description: value
			});
	    }

		set_image = (image) =>
		{

		    this.props.setAttributes({
		        backgroundImage: image.image
		    });
		}

		remove_image = (image) =>
		{

			// console.log(image)
		    this.props.setAttributes({
		        backgroundImage: null
		    });
		}

		render()
		{

			const {
				title,
				description,
				backgroundImage,
				slides
			} = this.props.attributes;

			return [
				<InspectorControls>
					<SliderModal slides={slides} prefix="slide-"/>
			    </InspectorControls>,
				<div className="root-app">
					<section className="hero">
						<div 
						className="hero__inner" 
						>
							<div className="hero__content">
								<div className="title">

								</div>
								<div className="hero__description">
								</div>
							</div>
							<div className="hero__triangles">
							</div>
						</div>
					</section>
				</div>
			];
		}
		
}
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-slider-blocks', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Slider' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'mphar-blocks — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	attributes: {
	    title: {
	        type: 'string',
	        source: 'html',
	        selector: 'h1',
	    },
	    description: {
	        type: 'string',
	        source: 'html',
	        selector: 'p',
	    },
	    rows: {
			type: 'array',
			query: {
				slide: {
					id: 'string',
					image: {},
					title: {
						type: 'string',
						default: ""
					},
				}
			},
			default: []
	    }
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: Slider,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {

		const {
            attributes: {
                title,
                description,
                backgroundImage
            }
        } = props;

		return (
			<section className="hero">
				<div 
				className="hero__inner wrapper" 
				>
					<div className="hero__content">
						<div className="title">
						</div>
						<div className="hero__description">
						</div>
					</div>
					<div className="hero__triangles"></div>
				</div>
			</section>
		);
	},
} );
