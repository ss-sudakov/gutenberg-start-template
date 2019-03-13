/**
 * BLOCK: mphar-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { Component } from '@wordpress/element';
import { SelectControl, Dashicon, Draggable, Panel, PanelBody } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import PostInner from './post.js';

const { __ } = wp.i18n; // Import __() from wp.i18n

const {
    RichText,
    Editable,
    InspectorControls,
} = wp.editor;

const {
    registerBlockType,
    BlockControls,
    AlignmentToolbar
} = wp.blocks; // Import registerBlockType() from wp.blocks


class PostList extends Component {

		getInitialState = () =>
		{
			this.state = { 
				categories: this.get_categories(), 
			};
		}

		constructor()
		{
			super(...arguments)

			const 
			{ 
				setAttributes, 
				attributes,
				state,
				setState
			} = this.props;

			this.getInitialState()
		}

		edit_post = (attr) => {

			const 
			{ 
				post, 
				title,
			} = attr

			var allposts = this.get_saved_posts()

			var postSearch = allposts.filter((posts) => posts.id === post.id);
			postSearch[0].title.rendered = title

			$.each(allposts, function(index, _post) {
				if(postSearch.id == _post.id){
					_post = postSearch
				}
			});
			
			this.save_get_posts_category_handler(allposts)

			this.props.setAttributes({
				update: true
			});

			this.setState((state, props) => {

				return {update: true};

			})

			console.log(this)

		}

		onChangeTitle = (value) => 
		{
			
			this.props.setAttributes({
				title: value
			});

	    }

	    get_categories = () =>
	    {
	    	const path = '/wp-json/wp/v2/categories';
	    	const categories = [];

			apiFetch( { path: path } ).then( cats => {
				categories.push({label: "Select a Category", value: 0});
				$.each( cats, function( index, cat ) {
			        categories.push({label: cat.name, value: cat.id});
			    });
				return categories;
			} );
			

			return categories;
	    }

	    select_category = (value) =>
	    {
    		this.setState((state, props) => {

			  return {displayCat: value};

			})

	    	this.props.setAttributes({
				displayCat: value
			});

			this.get_posts_category(value)

	    }

	    save_get_posts_category_handler = (posts) =>
	    {
	    	this.props.setAttributes({
				posts: posts
			});

	    	this.setState({posts: posts})

	    }

	    get_posts_category = (cat) =>
	    {

	    	var displayCat = cat ? cat : this.props.attributes.displayCat
	    	
	    	if(!displayCat){
	    		return;
	    	}

	    	const path = '/wp-json/wp/v2/posts?_embed&categories='+displayCat+'&per_page=2';
	    
			apiFetch( { path: path } )
			.then( posts => {
				this.save_get_posts_category_handler(posts)
			} );
	    }

	    get_saved_posts = () =>
	    {
	    	let posts;

	    	posts = this.state.posts

	    	if(!posts){

	    		posts = this.props.attributes.posts

	    	}

	    	return posts;
	    }


		render(){

			const {
				title,
				displayCat
			} = this.props.attributes

			const categories = this.state.categories
			const posts = this.get_saved_posts()

			let post;
			
			if(posts){
				post = <PostInner posts={ posts } link={ false } edit_post={ this.edit_post } />
			}
			return [
				<InspectorControls>
					<SelectControl
					    label="Select category for display"
					    value={displayCat}
					    options={categories}
					    onChange={ (value) => { this.select_category(value) } }
					/>
			    </InspectorControls>,
				<div className="root-app">
					<section className="posts">
						<div className="posts__inner">
							<div className="title">
								<RichText
									tagName="h2"
									placeholder="Title Text"
									value={title}
									autoFocus
									onChange={this.onChangeTitle}
								/>
							</div>				
							<div className="posts__list">
								{post}
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
registerBlockType( 'cgb/post-template-blocks', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Posts block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'template-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Posts block' ),
	],
	attributes: {
	    title: {
	        type: 'string',
	        source: 'html',
	        selector: 'h2',
	    },
	    displayCat: {
	        type: 'string',
	        default: null
	    },
	    posts: {
	    	type: 'array',
	    	default: []
	    },
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: PostList,

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
                posts
            }
        } = props;

        let postListRender;
        
		if(posts){
			postListRender = <PostInner posts={posts} link={true} />
		}
        
		return (
			<section className="posts">
				<div className="posts__inner  wrapper">
					<div className="title">
						<h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
					</div>				
					<div className="posts__list">
						{postListRender}
					</div>
				</div>
			</section>
		);
	},
} );
