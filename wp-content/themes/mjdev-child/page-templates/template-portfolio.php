<?php
/**
 * Template Name: Portfolio MJ
 * Template Post Type: page
 * Version: 3.3 - Com secção Quem Sou
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portfolio de Maria João Fontes - Designer & Developer">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<!-- Cursor -->
<div id="cursor"></div>

<!-- Splash Screen -->
<section id="splash">
    <h1 class="splash-letters">Maria João Fontes</h1>
    <p class="splash-text">Designer & Developer criando experiências digitais<br>únicas e memoráveis.</p>
    <div class="splash-btns">
        <button class="scroll-indicator">
            <span>Scroll para entrar</span>
            <div class="mouse">
                <div class="wheel"></div>
            </div>
        </button>
    </div>
</section>

<!-- Header -->
<header id="header">
    <div class="logo">MARIA JOÃO FONTES®</div>
    <button class="menu-btn">
        <span></span>
        <span></span>
        <span></span>
    </button>
</header>

<!-- Menu -->
<nav id="menu">
    <ul>
        <li><a href="#home">Início</a></li>
        <li><a href="#about">Quem Sou</a></li>
        <li><a href="#projects">Projetos</a></li>
        <li><a href="#contact">Contacto</a></li>
    </ul>
</nav>

<!-- Main -->
<main id="main">
    
    <!-- Hero -->
    <section id="home" class="hero">
        <h1>Projects</h1>
        <p>À procura de um parceiro criativo?</p>
        <a href="mailto:hello@mariajoao.pt">hello@mariajoao.pt</a>
    </section>
    
    <!-- NOVA SECÇÃO: Quem Sou -->
    <section id="about" class="about-section">
        <div class="about-container">
            <h2 class="about-title">Quem Sou</h2>
            
            <div class="about-images">
                <!-- Imagem 1 - Entra da ESQUERDA -->
                <div class="about-image about-image-left" data-direction="left">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" alt="Workspace" loading="lazy">
                </div>
                
                <!-- Imagem 2 - Entra da DIREITA -->
                <div class="about-image about-image-right" data-direction="right">
                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop" alt="Creative tools" loading="lazy">
                </div>
                
                <!-- Imagem 3 - Entra da ESQUERDA -->
                <div class="about-image about-image-left" data-direction="left">
                    <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop" alt="Design process" loading="lazy">
                </div>
            </div>
        </div>
    </section>
    
    <!-- Filtros -->
    <div id="projects" class="filters">
        <button class="filter active" data-filter="all">Todos</button>
        <?php
        $cats = get_terms(array(
            'taxonomy' => 'categoria-projeto', 
            'hide_empty' => true
        ));
        
        if (!is_wp_error($cats) && !empty($cats)) {
            foreach($cats as $cat) {
                echo '<button class="filter" data-filter="' . esc_attr($cat->slug) . '">' . esc_html($cat->name) . '</button>';
            }
        }
        ?>
    </div>
    
    <!-- Grid -->
    <div class="grid">
        <?php
        $args = array(
            'post_type' => 'projeto', 
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC'
        );
        $query = new WP_Query($args);
        
        if ($query->have_posts()) :
            while($query->have_posts()) : $query->the_post();
                $cats = get_the_terms(get_the_ID(), 'categoria-projeto');
                $cat_slug = ($cats && !is_wp_error($cats)) ? $cats[0]->slug : '';
                $cat_name = ($cats && !is_wp_error($cats)) ? $cats[0]->name : 'Sem categoria';
        ?>
        
        <article class="project" data-cat="<?php echo esc_attr($cat_slug); ?>">
            <div class="img">
                <?php 
                if (has_post_thumbnail()) {
                    the_post_thumbnail('large', array(
                        'alt' => get_the_title(),
                        'loading' => 'lazy'
                    ));
                } else {
                    echo '<img src="' . get_stylesheet_directory_uri() . '/assets/images/placeholder.jpg" alt="' . esc_attr(get_the_title()) . '" loading="lazy">';
                }
                ?>
            </div>
            <h3><?php the_title(); ?></h3>
            <p><?php echo esc_html($cat_name); ?></p>
        </article>
        
        <?php 
            endwhile; 
        else : 
        ?>
        
        <div class="no-projects">
            <p>Nenhum projeto encontrado.</p>
        </div>
        
        <?php 
        endif;
        wp_reset_postdata(); 
        ?>
    </div>
    
    <!-- Footer -->
    <footer id="contact">
        <h2>Vamos trabalhar<br>juntos</h2>
        <a href="mailto:hello@mariajoao.pt">hello@mariajoao.pt</a>
        <p>©<?php echo date('Y'); ?> Maria João Fontes</p>
    </footer>
    
</main>

<?php wp_footer(); ?>
</body>
</html>