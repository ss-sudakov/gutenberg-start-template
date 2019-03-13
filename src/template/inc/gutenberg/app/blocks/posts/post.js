import { Component } from '@wordpress/element';

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


export default class PostInner extends Component {

	constructor()
	{
		super(...arguments)

		const 
		{ 
			setAttributes,
			attributes,
			posts,
			edit_post
		} = this.props;
	}

	onChangeTitle = (post, title) => 
	{
		this.props.edit_post({post, title})
    }

    get_post_thumbnail = (post) =>
    {
    	let img;

    	if(post._embedded['wp:featuredmedia']){

			return img = post._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;

		}else{

			return img = null;

		}
    }

	render(){
		const 
		{ 
			attributes,
			posts,
			link
		} = this.props;

		var posts_render;
		if(posts){
			if(link){
				posts_render = posts.map((post, index) => 
					
					<a 
						key={post.id}
						href={post.link} 
						target="_blank" 
						className="post__item" 
						style={{backgroundImage:"url(" + this.get_post_thumbnail(post) + ")"}}
					>
						<div className="post__content">
							<div className="post__title" dangerouslySetInnerHTML={{ __html: post.title.rendered }}></div>
							<div className="post__read-more">Read more</div>
						</div>
					</a>
					
				)
			}else{
				posts_render = posts.map((post, index) =>
					<div 
						key={post.id}
						className="post__item" 
						style={{backgroundImage:"url(" + this.get_post_thumbnail(post) + ")"}}
					>
						<div className="post__content">
							<div className="post__title">
								<RichText
									placeholder="Title Text"
									value={post.title.rendered} 
									autoFocus
									onChange={ (title) => { this.onChangeTitle( post, title ) } }
								/>
							</div>
							<div className="post__read-more">Read more</div>
						</div>
					</div>
				)
			}
				
		}else{
			posts_render = '';
		}

		return(

			posts_render

		)
	}
}
