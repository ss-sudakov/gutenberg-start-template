import { Component } from '@wordpress/element';

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

	onImageSelect = (imageObject) =>
	{
	    this.props.set_image({ image: imageObject })
	}

	removeImage = (image) =>
	{
		this.props.remove_image({ image: image })
	}

	imageRender = (image) =>
	{
		let render


		if(image)
		{
			render = 
					<div>
						<img src={image.sizes.thumbnail.url} alt={image.title} />
						<button onClick={(e) => { this.removeImage(image, e) } } >Remove Image</button>
					</div>


		}
		return render
	}

	uploadImageButton = (image) =>
	{
		
		let render
		if(!image)
		{
			render =
						<MediaUpload
							onSelect={(imageObject) => {this.onImageSelect(imageObject)}}
							type="image"
							value={image}
							render={({ open }) => (
								<button onClick={open}>
									Upload Image!
								</button>
							)}
						/>
		}
		return render 
			
	}

	render(){

			const {
				image,
			} = this.props

			let a = this.imageRender(image)
			let b = this.uploadImageButton(image)
			
			return(

				[a,b]

			)

	}
}