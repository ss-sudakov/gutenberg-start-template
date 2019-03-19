import { Component } from '@wordpress/element';
import { Button } from '@wordpress/components';
import functions from '../../../functions.jsx';

const {
    MediaUpload,
} = wp.editor;

export default class ImageControl extends Component {

	constructor()
	{
		super(...arguments)

		const 
		{ 
			setAttributes,
			attributes,
		} = this.props;

	}

	set_image__handler = (instans, imageObject) =>
	{
	    this.props.set_image({ instans: instans, image: imageObject })
	}

	remove_image__handler = (instans) =>
	{
		this.props.remove_image({ instans: instans })
	}

	render_image = (instans, image) =>
	{
		let render
		if( functions.isset(image) )
		{

			render = 
					<div>
						<img src={ functions.isset(image.sizes.thumbnail) ? image.sizes.thumbnail.url : image.sizes.full.url } alt={image.title} />
						<Button isDefault onClick={(event) => { this.remove_image__handler(instans, event) } } >Remove Image</Button>
					</div>


		}
		return render
	}

	upload_image = (instans, image) =>
	{
		let render;
		
		if( !functions.isset(image) )
		{
			render =
						<MediaUpload
							onSelect={(imageObject) => {this.set_image__handler(instans, imageObject)}}
							type="image"
							value={image}
							render={({ open }) => (
								<Button isDefault onClick={open}>
									Upload Image!
								</Button>
							)}
						/>
		}
		return render 
			
	}

	render(){

			const {
				instans,
				image,
			} = this.props
			
			let a = this.render_image(instans, image)
			let b = this.upload_image(instans, image)
			
			return(

				[a,b]

			)

	}
}