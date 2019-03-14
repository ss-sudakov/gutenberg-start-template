<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function gutenberg_blocks_block_assets() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'gutenberg_blocks-bootstrap-style-css', // Handle.
		get_template_directory_uri() . '/admin assets/css/bootstrap-grid.min.css',
		array( 'wp-editor' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
	wp_enqueue_style(
		'gutenberg_blocks-style-css', // Handle.
		 get_template_directory_uri() . '/css/main.min.css', // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'gutenberg_blocks_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function gutenberg_blocks_editor_assets() { // phpcs:ignore
	// Scripts.
	wp_enqueue_script(
		'gutenberg_blocks-block-js', // Handle.
		get_template_directory_uri() . '/js/blocks.build.js', // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: File modification time.
		true // Enqueue the script in the footer.
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'gutenberg_blocks_editor_assets' );


function register_blocks_category( $categories, $post ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug' => 'template-blocks',
				'title' => __( 'Template blocks', 'template-blocks' ),
			),
		)
	);
}
add_filter( 'block_categories', 'register_blocks_category', 10, 2);

function gutenberg_blocks_editor_workspace_width() {

	echo('<style type="text/css">
		.wp-block { 
			max-width: 100% !important; 
		}
		.margin-15
		{
			margin-bottom: 15px;
		}
	</style>');
}

add_action( 'admin_print_styles', 'gutenberg_blocks_editor_workspace_width' );