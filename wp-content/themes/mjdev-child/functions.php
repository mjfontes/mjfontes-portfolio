<?php
/**
 * MJDev Child Theme - Functions SAFE
 * Versão: 4.0.1 - Sem erros
 */

// 1. CSS do tema filho
function mjdev_child_styles() {
    wp_enqueue_style('mjdev-child-style', get_stylesheet_uri(), array(), '4.0.1');
}
add_action('wp_enqueue_scripts', 'mjdev_child_styles');

function mjdev_portfolio_scripts() {
    // GSAP - carregar sempre
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), '3.12.2', false);
    wp_enqueue_script('gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), '3.12.2', false);
    
    if (is_page_template('page-templates/template-portfolio.php')) {
        // CSS do Portfolio
        wp_enqueue_style('portfolio-css', get_stylesheet_directory_uri() . '/assets/css/portfolio.css', array(), '1.0.1');
        
        // JS do Portfolio
        wp_enqueue_script('portfolio-js', get_stylesheet_directory_uri() . '/assets/js/portfolio.js', array('jquery', 'gsap', 'gsap-scrolltrigger'), '1.0.1', false);
        
        // ========================================
        // 🆕 ADICIONAR AQUI - Composição About
        // ========================================
        
        // CSS da composição About
        wp_enqueue_style(
            'about-composition', 
            get_stylesheet_directory_uri() . '/assets/css/about-composition.css', 
            array(), 
            '1.0.0'
        );
        
        // JS da composição About
        wp_enqueue_script(
            'about-composition', 
            get_stylesheet_directory_uri() . '/assets/js/about-composition.js', 
            array('jquery', 'gsap', 'gsap-scrolltrigger'), 
            '1.0.0', 
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'mjdev_portfolio_scripts');

// 3. Custom Post Type - Projetos
function mjdev_projetos_post_type() {
    register_post_type('projeto', array(
        'labels' => array(
            'name' => 'Projetos',
            'singular_name' => 'Projeto',
        ),
        'public' => true,
        'has_archive' => false,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-portfolio',
        'show_in_rest' => true,
    ));
}
add_action('init', 'mjdev_projetos_post_type');

// 4. Taxonomia - Categorias
function mjdev_projetos_taxonomy() {
    register_taxonomy('categoria-projeto', 'projeto', array(
        'labels' => array(
            'name' => 'Categorias',
            'singular_name' => 'Categoria',
        ),
        'hierarchical' => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'mjdev_projetos_taxonomy');