<?php
/**
 * MJDev Child Theme - Functions SAFE
 * Versão: 4.1.0 - Com animações SplitType
 * 
 * @package MJDev_Child
 * @since 4.0.3
 */

// Prevenir acesso direto ao ficheiro
if (!defined('ABSPATH')) {
    exit;
}

/**
 * 1. CSS do tema filho
 * 
 * @since 4.0.3
 * @return void
 */
function mjdev_child_styles() {
    wp_enqueue_style(
        'mjdev-child-style', 
        get_stylesheet_uri(), 
        array(), 
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'mjdev_child_styles');

/**
 * 2. Portfolio scripts e styles
 * 
 * @since 4.0.3
 * @return void
 */
function mjdev_portfolio_scripts() {
    // GSAP - carregar sempre (da CDN oficial)
    wp_enqueue_script(
        'gsap', 
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 
        array(), 
        '3.12.5', 
        array(
            'strategy'  => 'defer',
            'in_footer' => true,
        )
    );
    
    wp_enqueue_script(
        'gsap-scrolltrigger', 
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', 
        array('gsap'), 
        '3.12.5', 
        array(
            'strategy'  => 'defer',
            'in_footer' => true,
        )
    );
    
    // SplitType para animações de texto
    wp_enqueue_script(
        'split-type', 
        'https://unpkg.com/split-type@0.3.4/umd/index.min.js', 
        array(), 
        '0.3.4', 
        array(
            'strategy'  => 'defer',
            'in_footer' => true,
        )
    );
    
    // Animações personalizadas
    wp_enqueue_script(
        'mjdev-text-animations', 
        get_stylesheet_directory_uri() . '/assets/js/text-animations.js', 
        array('gsap', 'gsap-scrolltrigger', 'split-type'), 
        '1.0.0', 
        array(
            'strategy'  => 'defer',
            'in_footer' => true,
        )
    );
    
    // Fontes 
    wp_enqueue_style(
        'mjdev-fonts', 
        get_stylesheet_directory_uri() . '/assets/fonts/fonts.css', 
        array(), 
        '1.0'
    );
    
    // Scripts e styles específicos do template portfolio
    if (is_page_template('page-templates/template-portfolio.php')) {
        // CSS do Portfolio (depende das fontes)
        wp_enqueue_style(
            'portfolio-css', 
            get_stylesheet_directory_uri() . '/assets/css/portfolio.css', 
            array('mjdev-fonts'),
            '3.8'
        );
        
        // CSS da composição About (carrega DEPOIS do portfolio.css)
        wp_enqueue_style(
            'about-composition', 
            get_stylesheet_directory_uri() . '/assets/css/about-composition.css', 
            array('portfolio-css'),
            '2.6'
        );

        //REvelar o nome
        wp_enqueue_script(
            'splash-reveal',
            get_stylesheet_directory_uri() . '/assets/js/splash-reveal.js',
            array(), // sem dependências
            '1.0.0',
            false    // no <head> para carregar cedo
        );
        
        // JS do Portfolio
        wp_enqueue_script(
            'portfolio-js', 
            get_stylesheet_directory_uri() . '/assets/js/portfolio.js', 
            array('jquery', 'gsap', 'gsap-scrolltrigger'), 
            '3.8', 
            array(
                'strategy'  => 'defer',
                'in_footer' => true,
            )
        );
        
        // JS da composição About
        wp_enqueue_script(
            'about-composition', 
            get_stylesheet_directory_uri() . '/assets/js/about-composition.js', 
            array('jquery', 'gsap', 'gsap-scrolltrigger'), 
            '2.2', 
            array(
                'strategy'  => 'defer',
                'in_footer' => true,
            )
        );
    }
}
add_action('wp_enqueue_scripts', 'mjdev_portfolio_scripts');

/**
 * 2b. Scripts e styles da página de projeto individual
 */
function mjdev_single_projeto_scripts() {
    if (!is_singular('projeto')) return;

    wp_enqueue_style(
        'mjdev-fonts',
        get_stylesheet_directory_uri() . '/assets/fonts/fonts.css',
        array(),
        '1.0'
    );

    wp_enqueue_style(
        'single-projeto-css',
        get_stylesheet_directory_uri() . '/assets/css/single-projeto.css',
        array('mjdev-fonts'),
        '1.0'
    );

    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        array(),
        '3.12.5',
        array('strategy' => 'defer', 'in_footer' => true)
    );

    wp_enqueue_script(
        'gsap-scrolltrigger',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        array('gsap'),
        '3.12.5',
        array('strategy' => 'defer', 'in_footer' => true)
    );

    wp_enqueue_script(
        'split-type',
        'https://unpkg.com/split-type@0.3.4/umd/index.min.js',
        array(),
        '0.3.4',
        array('strategy' => 'defer', 'in_footer' => true)
    );

    wp_enqueue_script(
        'single-projeto-js',
        get_stylesheet_directory_uri() . '/assets/js/single-projeto.js',
        array('gsap', 'gsap-scrolltrigger', 'split-type'),
        '1.0',
        array('strategy' => 'defer', 'in_footer' => true)
    );
}
add_action('wp_enqueue_scripts', 'mjdev_single_projeto_scripts');

/**
 * 3. Custom Post Type - Projetos
 * 
 * @since 4.0.3
 * @return void
 */
function mjdev_projetos_post_type() {
    $labels = array(
        'name'                  => _x('Projetos', 'Post type general name', 'mjdev-child'),
        'singular_name'         => _x('Projeto', 'Post type singular name', 'mjdev-child'),
        'menu_name'             => _x('Projetos', 'Admin Menu text', 'mjdev-child'),
        'add_new'               => __('Adicionar Novo', 'mjdev-child'),
        'add_new_item'          => __('Adicionar Novo Projeto', 'mjdev-child'),
        'edit_item'             => __('Editar Projeto', 'mjdev-child'),
        'new_item'              => __('Novo Projeto', 'mjdev-child'),
        'view_item'             => __('Ver Projeto', 'mjdev-child'),
        'search_items'          => __('Pesquisar Projetos', 'mjdev-child'),
        'not_found'             => __('Nenhum projeto encontrado', 'mjdev-child'),
        'not_found_in_trash'    => __('Nenhum projeto no lixo', 'mjdev-child'),
    );
    
    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'projeto', 'with_front' => false),
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array('title', 'editor', 'thumbnail'),
        'show_in_rest'       => true,
    );
    
    register_post_type('projeto', $args);
}
add_action('init', 'mjdev_projetos_post_type');

/**
 * 4. Taxonomia - Categorias de Projetos
 * 
 * @since 4.0.3
 * @return void
 */
function mjdev_projetos_taxonomy() {
    $labels = array(
        'name'              => _x('Categorias', 'taxonomy general name', 'mjdev-child'),
        'singular_name'     => _x('Categoria', 'taxonomy singular name', 'mjdev-child'),
        'search_items'      => __('Pesquisar Categorias', 'mjdev-child'),
        'all_items'         => __('Todas as Categorias', 'mjdev-child'),
        'parent_item'       => __('Categoria Pai', 'mjdev-child'),
        'parent_item_colon' => __('Categoria Pai:', 'mjdev-child'),
        'edit_item'         => __('Editar Categoria', 'mjdev-child'),
        'update_item'       => __('Atualizar Categoria', 'mjdev-child'),
        'add_new_item'      => __('Adicionar Nova Categoria', 'mjdev-child'),
        'new_item_name'     => __('Nome da Nova Categoria', 'mjdev-child'),
        'menu_name'         => __('Categorias', 'mjdev-child'),
    );
    
    $args = array(
        'labels'            => $labels,
        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'categoria-projeto'),
        'show_in_rest'      => true,
    );
    
    register_taxonomy('categoria-projeto', array('projeto'), $args);
}
add_action('init', 'mjdev_projetos_taxonomy');

/**
 * 5. Flush rewrite rules na ativação do tema
 * 
 * @since 4.1.0
 * @return void
 */
function mjdev_theme_activation() {
    mjdev_projetos_post_type();
    mjdev_projetos_taxonomy();
    flush_rewrite_rules();
}

/**
 * 6. Meta box: Website URL para projetos
 */
function mjdev_projeto_website_metabox() {
    add_meta_box(
        'mjdev_projeto_website',
        'Website do Projeto',
        'mjdev_projeto_website_metabox_html',
        'projeto',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'mjdev_projeto_website_metabox');

function mjdev_projeto_website_metabox_html($post) {
    wp_nonce_field('mjdev_projeto_website_nonce', 'mjdev_projeto_website_nonce');
    $url = get_post_meta($post->ID, '_projeto_website_url', true);
    ?>
    <label for="projeto_website_url" style="font-weight:600;">URL do website:</label>
    <input type="url" id="projeto_website_url" name="projeto_website_url"
           value="<?php echo esc_attr($url); ?>"
           style="width:100%;margin-top:6px;"
           placeholder="https://exemplo.com">
    <?php
}

function mjdev_projeto_website_metabox_save($post_id) {
    if (!isset($_POST['mjdev_projeto_website_nonce'])) return;
    if (!wp_verify_nonce($_POST['mjdev_projeto_website_nonce'], 'mjdev_projeto_website_nonce')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['projeto_website_url'])) {
        update_post_meta($post_id, '_projeto_website_url', esc_url_raw(trim($_POST['projeto_website_url'])));
    }
}
add_action('save_post_projeto', 'mjdev_projeto_website_metabox_save');
add_action('after_switch_theme', 'mjdev_theme_activation');