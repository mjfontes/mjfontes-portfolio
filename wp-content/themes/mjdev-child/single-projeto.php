<?php
/**
 * Single template for 'projeto' custom post type
 */
if (!defined('ABSPATH')) exit;

if (!have_posts()) {
    wp_redirect(home_url('/'));
    exit;
}

the_post();

$cat_name  = '';
$year      = get_the_date('Y');
$prev_p    = get_previous_post();
$next_p    = get_next_post();

$cats = get_the_terms(get_the_ID(), 'categoria-projeto');
if ($cats && !is_wp_error($cats)) {
    $cat_name = esc_html($cats[0]->name);
}

// URL do portfólio (página que usa o template custom)
$portfolio_pages = get_pages([
    'meta_key'   => '_wp_page_template',
    'meta_value' => 'page-templates/template-portfolio.php',
]);
$portfolio_url = (!empty($portfolio_pages) ? get_permalink($portfolio_pages[0]->ID) : home_url('/')) . '#projects';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php the_title(); ?> — Maria João Fontes</title>
    <?php wp_head(); ?>
</head>
<body <?php body_class('single-projeto-page'); ?>>

<!-- Cortina de transição -->
<div id="page-transition"></div>

<!-- Cursor -->
<div id="cursor"></div>

<!-- Header -->
<header class="sp-header">
    <a href="<?php echo esc_url($portfolio_url); ?>" class="sp-back" id="sp-back">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L6 9L12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Portfólio</span>
    </a>
    <div class="sp-header-logo">MARIA JOÃO FONTES®</div>
</header>

<!-- Hero -->
<section class="sp-hero">

    <div class="sp-hero-left">
        <?php if ($cat_name): ?>
            <p class="sp-category"><?php echo $cat_name; ?></p>
        <?php endif; ?>

        <h1 class="sp-title"><?php the_title(); ?></h1>

        <div class="sp-meta">
            <div class="sp-meta-item">
                <span class="sp-meta-label">Ano</span>
                <span class="sp-meta-value"><?php echo esc_html($year); ?></span>
            </div>
            <?php if ($cat_name): ?>
            <div class="sp-meta-item">
                <span class="sp-meta-label">Área</span>
                <span class="sp-meta-value"><?php echo $cat_name; ?></span>
            </div>
            <?php endif; ?>
        </div>

        <?php
        $website_url = get_post_meta(get_the_ID(), '_projeto_website_url', true);
        if ($website_url): ?>
        <a href="<?php echo esc_url($website_url); ?>" class="sp-visit-website" target="_blank" rel="noopener noreferrer">
            Visit Website <span>↗</span>
        </a>
        <?php endif; ?>
    </div>

    <div class="sp-hero-right">
        <?php if (has_post_thumbnail()): ?>
            <div class="sp-hero-img-wrap">
                <?php the_post_thumbnail('full', ['class' => 'sp-hero-img', 'alt' => get_the_title()]); ?>
            </div>
        <?php endif; ?>
    </div>

</section>

<!-- Conteúdo do projeto -->
<?php if (have_posts()): the_post(); endif; ?>
<section class="sp-content">
    <?php the_content(); ?>
</section>

<!-- Navegação prev/next -->
<nav class="sp-nav">
    <?php if ($prev_p): ?>
        <a href="<?php echo esc_url(get_permalink($prev_p->ID)); ?>" class="sp-nav-link sp-nav-prev">
            <span class="sp-nav-label">← Anterior</span>
            <span class="sp-nav-title"><?php echo esc_html(get_the_title($prev_p->ID)); ?></span>
        </a>
    <?php else: ?>
        <div></div>
    <?php endif; ?>

    <a href="<?php echo esc_url($portfolio_url); ?>" class="sp-nav-center">Ver todos</a>

    <?php if ($next_p): ?>
        <a href="<?php echo esc_url(get_permalink($next_p->ID)); ?>" class="sp-nav-link sp-nav-next">
            <span class="sp-nav-label">Seguinte →</span>
            <span class="sp-nav-title"><?php echo esc_html(get_the_title($next_p->ID)); ?></span>
        </a>
    <?php else: ?>
        <div></div>
    <?php endif; ?>
</nav>

<!-- Footer -->
<footer class="sp-footer">
    <h2>Let's work<br>together</h2>
    <a href="mailto:hello@mariajoaofontes.com">hello@mariajoaofontes.com</a>
    <p>©<?php echo date('Y'); ?> Maria João Fontes</p>
</footer>

<?php wp_footer(); ?>
</body>
</html>
