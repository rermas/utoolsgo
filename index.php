<?php
/**
 * Front controller único do uToolsGo.
 * Todas as requisições passam por aqui (.htaccess reescreve tudo pra cá).
 * Resolve idioma (PT na raiz, /en/ e /es/ como prefixo), casa a URL com
 * uma ferramenta/categoria/home e renderiza a página.
 */

require __DIR__ . '/includes/functions.php';

$tools = require __DIR__ . '/data/tools.php';
$i18n  = require __DIR__ . '/data/i18n.php';
$content = require __DIR__ . '/data/content.php';
foreach (require __DIR__ . '/data/extra.php' as $xid => $xl) {
    foreach ($xl as $xlang => $x) {
        $content[$xid][$xlang]['article'] .= $x['article'];
        $content[$xid][$xlang]['faq'] = array_merge($content[$xid][$xlang]['faq'] ?? [], $x['faq'] ?? []);
    }
}

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$rawPath = parse_url($requestUri, PHP_URL_PATH) ?? '/';

/** URL de asset com versão (mtime) para cache longo sem servir arquivo velho. */
function asset(string $path): string {
    $f = __DIR__ . $path;
    return $path . (is_file($f) ? '?v=' . filemtime($f) : '');
}

/** Grava o cookie de idioma só quando muda (evita Set-Cookie em toda resposta). */
function set_lang_cookie(string $l): void {
    if (($_COOKIE['lang'] ?? null) !== $l) {
        setcookie('lang', $l, time() + 60 * 60 * 24 * 365, '/');
    }
}

// Forma canônica da URL: sem barras duplicadas e com barra final (exceto arquivos).
$normPath = preg_replace('#/{2,}#', '/', $rawPath);
if ($normPath !== '/' && substr($normPath, -1) !== '/' && strpos(basename($normPath), '.') === false) {
    $normPath .= '/';
}
if ($normPath !== $rawPath) {
    $qs = $_SERVER['QUERY_STRING'] ?? '';
    header('Location: ' . $normPath . ($qs !== '' ? '?' . $qs : ''), true, 301);
    exit;
}

// ------------------------------------------------------------------
// Detecção/redirecionamento de idioma (só na raiz "/")
// ------------------------------------------------------------------
if ($rawPath === '/') {
    $forcedLang = $_GET['lang'] ?? null;
    $cookieLang = $_COOKIE['lang'] ?? null;
    if ($forcedLang && in_array($forcedLang, SITE_LANGS, true)) {
        // Clique explícito no seletor de idioma: sempre vence, ignora cookie antigo.
        $chosen = $forcedLang;
    } elseif ($cookieLang && in_array($cookieLang, SITE_LANGS, true)) {
        $chosen = $cookieLang;
    } elseif (!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $chosen = detect_browser_lang($_SERVER['HTTP_ACCEPT_LANGUAGE']);
    } else {
        // Sem Accept-Language (ex.: Googlebot): serve a home em PT, sem redirecionar.
        $chosen = 'pt';
    }
    if ($chosen !== 'pt') {
        set_lang_cookie($chosen);
        header('Vary: Accept-Language, Cookie');
        header('Location: /' . $chosen . '/', true, 302);
        exit;
    }
    // chosen === 'pt': segue e renderiza a home em PT (raiz)
}

[$lang, $segments] = resolve_lang_and_segments($requestUri);
set_lang_cookie($lang);

$baseUrl = 'https://utoolsgo.com';

// ------------------------------------------------------------------
// Roteamento
// ------------------------------------------------------------------
$view = null;
$viewData = [];

if (count($segments) === 0) {
    $view = 'home';
} elseif (count($segments) === 1) {
    $catId = find_category_by_slug($i18n, $lang, $segments[0]);
    if ($catId) {
        $view = 'category';
        $viewData['category'] = $catId;
    }
} elseif (count($segments) === 2) {
    $toolId = find_tool_by_slugs($tools, $i18n, $lang, $segments[0], $segments[1]);
    if ($toolId) {
        $view = 'tool';
        $viewData['toolId'] = $toolId;
    }
}

// Ferramenta que mudou de categoria (ex.: /financeiras/regra-de-tres/): 301 para a URL atual se o slug for único no idioma.
if ($view === null && count($segments) === 2) {
    $moved = [];
    foreach ($tools as $id => $t) {
        if (($t['slugs'][$lang] ?? null) === $segments[1] && tool_available_in($t, $lang)) $moved[] = $id;
    }
    if (count($moved) === 1) {
        header('Location: ' . build_url($lang, $i18n, $tools, $moved[0]), true, 301);
        exit;
    }
}

if ($view === null) {
    http_response_code(404);
    $view = '404';
}

$T = $i18n[$lang];

// ------------------------------------------------------------------
// Helpers de renderização
// ------------------------------------------------------------------
function hreflang_links(string $lang, array $i18n, array $tools, ?string $toolId, ?string $category): string {
    $out = '';
    $langsToLink = SITE_LANGS;
    foreach ($langsToLink as $l) {
        if ($toolId !== null && !tool_available_in($tools[$toolId], $l)) continue;
        if ($category !== null && !isset($i18n[$l]['category_slugs'][$category])) continue;
        $url = build_url($l, $i18n, $tools, $toolId, $category);
        $out .= '<link rel="alternate" hreflang="' . ($l === 'pt' ? 'pt-BR' : $l) . '" href="https://utoolsgo.com' . h($url) . '">' . "\n";
    }
    $defaultLang = ($toolId !== null) ? (tool_only_lang($tools[$toolId]) ?? 'pt') : 'pt';
    $defaultUrl = build_url($defaultLang, $i18n, $tools, $toolId, $category);
    $out .= '<link rel="alternate" hreflang="x-default" href="https://utoolsgo.com' . h($defaultUrl) . '">' . "\n";
    return $out;
}

function render_head(string $lang, array $T, string $title, string $meta, string $canonical, string $hreflangs, string $jsonLd = '', bool $noindex = false): void {
    ?>
<!DOCTYPE html>
<html lang="<?= h($T['html_lang']) ?>">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= h($title) ?></title>
<meta name="description" content="<?= h($meta) ?>">
<?php if ($noindex): ?>
<meta name="robots" content="noindex">
<?php else: ?>
<link rel="canonical" href="<?= h($canonical) ?>">
<?php endif; ?>
<?= $hreflangs ?>
<link rel="icon" href="/assets/img/favicon.png" type="image/png">
<meta property="og:title" content="<?= h($title) ?>">
<meta property="og:description" content="<?= h($meta) ?>">
<meta property="og:type" content="website">
<?php if (!$noindex): ?>
<meta property="og:url" content="<?= h($canonical) ?>">
<?php endif; ?>
<meta property="og:locale" content="<?= h($T['locale_og']) ?>">
<meta property="og:site_name" content="uToolsGo">
<meta property="og:image" content="https://utoolsgo.com/assets/img/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= h($title) ?>">
<meta name="twitter:description" content="<?= h($meta) ?>">
<meta name="twitter:image" content="https://utoolsgo.com/assets/img/og-image.png">
<?= $jsonLd ?>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JB041HJPG4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JB041HJPG4');
</script>
<link rel="stylesheet" href="<?= h(asset('/assets/css/style.css')) ?>">
</head>
<body>
    <?php
}

/** Categorias core na barra principal; o resto entra no grupo "Mais". Mantido em sincronia com $homeCats na home. */
const NAV_MAIN_CATS = ['calculators', 'everyday', 'generators', 'converters', 'images', 'network'];
const NAV_MORE_CATS = ['health', 'pets', 'seo', 'personal-finance', 'text-productivity', 'word-differences', 'education', 'construction', 'holidays', 'fashion', 'travel', 'events', 'minimum-wage', 'readability', 'photography'];

function render_nav(string $lang, array $T, array $tools, array $i18n): void {
    $home = build_url($lang, $i18n, $tools);
    $moreCats = NAV_MORE_CATS;
    if ($lang === 'pt') $moreCats[] = 'trabalhista';
    ?>
<header class="site-header">
  <a class="logo" href="<?= h($home) ?>"><img src="/assets/img/logo-utoolsgo.webp" alt="uToolsGo" height="36" width="135"></a>
  <nav>
    <?php foreach (NAV_MAIN_CATS as $catId): ?>
    <a href="<?= h(build_url($lang, $i18n, $tools, null, $catId)) ?>"><?= h($T['categories'][$catId]) ?></a>
    <?php endforeach; ?>
    <div class="nav-more">
      <button type="button" class="nav-more-btn" aria-haspopup="true" aria-expanded="false"><?= h($T['nav_more']) ?> ▾</button>
      <div class="nav-more-menu">
        <?php foreach ($moreCats as $catId): ?>
        <a href="<?= h(build_url($lang, $i18n, $tools, null, $catId)) ?>"><?= h($T['categories'][$catId]) ?></a>
        <?php endforeach; ?>
      </div>
    </div>
    <span class="lang-switch">
      <a href="/?lang=pt" class="<?= $lang === 'pt' ? 'active' : '' ?>">PT</a>
      <a href="/en/" class="<?= $lang === 'en' ? 'active' : '' ?>">EN</a>
      <a href="/es/" class="<?= $lang === 'es' ? 'active' : '' ?>">ES</a>
    </span>
  </nav>
</header>
<script>
(function(){
  document.querySelectorAll('.nav-more-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = btn.parentElement.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(){
    document.querySelectorAll('.nav-more.open').forEach(function(el){ el.classList.remove('open'); });
  });
})();
</script>
    <?php
}

function render_footer(array $T): void {
    ?>
<footer class="site-footer">
  <p><?= h($T['footer_text']) ?></p>
</footer>
</body>
</html>
    <?php
}

function render_field(array $field, array $c): void {
    $id = $field['id'];
    $label = $c['fieldLabels'][$id] ?? $id;
    echo '<div class="field">';
    if ($field['type'] !== 'checkbox') {
        echo '<label for="' . h($id) . '">' . h($label) . '</label>';
    }
    switch ($field['type']) {
        case 'select':
            echo '<select id="' . h($id) . '">';
            foreach ($field['options'] as $opt) {
                $optLabel = $c['unitLabels'][$opt] ?? $c['optionLabels'][$opt] ?? $opt;
                $sel = (isset($field['value']) && (string)$field['value'] === (string)$opt) ? ' selected' : '';
                echo '<option value="' . h($opt) . '"' . $sel . '>' . h($optLabel) . '</option>';
            }
            echo '</select>';
            break;
        case 'checkbox':
            $checked = !empty($field['checked']) ? 'checked' : '';
            echo '<label class="checkbox-label"><input type="checkbox" id="' . h($id) . '" ' . $checked . '> ' . h($label) . '</label>';
            break;
        case 'range':
            $min = h($field['min'] ?? '1');
            $max = h($field['max'] ?? '100');
            $val = h($field['value'] ?? $min);
            echo '<input type="range" id="' . h($id) . '" min="' . $min . '" max="' . $max . '" value="' . $val . '" oninput="document.getElementById(\'' . h($id) . 'Val\').textContent=this.value">';
            echo ' <span id="' . h($id) . 'Val" class="range-val">' . $val . '</span>';
            break;
        case 'text':
            $ph = isset($c['fieldPlaceholders'][$id]) ? ' placeholder="' . h($c['fieldPlaceholders'][$id]) . '"' : '';
            echo '<input type="text" id="' . h($id) . '"' . $ph . '>';
            break;
        case 'textarea':
            $ph = isset($c['fieldPlaceholders'][$id]) ? ' placeholder="' . h($c['fieldPlaceholders'][$id]) . '"' : '';
            echo '<textarea id="' . h($id) . '"' . $ph . '></textarea>';
            break;
        case 'time':
            $val = isset($field['value']) ? ' value="' . h($field['value']) . '"' : '';
            echo '<input type="time" id="' . h($id) . '"' . $val . '>';
            break;
        case 'date':
            $val = isset($field['value']) ? ' value="' . h($field['value']) . '"' : '';
            echo '<input type="date" id="' . h($id) . '"' . $val . '>';
            break;
        default:
            $attrs = '';
            foreach (['step', 'min', 'max', 'value'] as $a) {
                if (isset($field[$a])) $attrs .= ' ' . $a . '="' . h($field[$a]) . '"';
            }
            echo '<input type="number" id="' . h($id) . '" inputmode="decimal"' . $attrs . '>';
    }
    echo '</div>';
}

function render_faq(array $faq, string $faqTitle): void {
    if (empty($faq)) return;
    echo '<h2>' . h($faqTitle) . '</h2><div class="faq">';
    foreach ($faq as $item) {
        // Respostas com links/código (HTML próprio do conteúdo) saem com tags permitidas; as demais, escapadas.
        $ans = preg_match('/<(a|code|strong|em)\b/i', $item['a'])
            ? strip_tags($item['a'], '<a><code><strong><em>')
            : h($item['a']);
        echo '<details><summary>' . h($item['q']) . '</summary><p>' . $ans . '</p></details>';
    }
    echo '</div>';
}

function faq_schema(array $faq): string {
    if (empty($faq)) return '';
    $entities = array_map(function ($item) {
        return [
            '@type' => 'Question',
            'name' => $item['q'],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a']],
        ];
    }, $faq);
    $schema = ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $entities];
    return '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}

function breadcrumb_schema(array $items): string {
    $list = [];
    foreach ($items as $i => [$name, $url]) $list[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $name, 'item' => $url];
    $schema = ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $list];
    return '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}

function webapp_schema(string $name, string $url, string $lang): string {
    $currency = ['pt' => 'BRL', 'en' => 'USD', 'es' => 'USD'][$lang] ?? 'USD';
    $schema = [
        '@context' => 'https://schema.org', '@type' => 'WebApplication', 'name' => $name, 'url' => $url,
        'applicationCategory' => 'UtilitiesApplication', 'operatingSystem' => 'Web',
        'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => $currency],
        'inLanguage' => $lang,
    ];
    return '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}

// ------------------------------------------------------------------
// Renderização por view
// ------------------------------------------------------------------
if ($view === 'home') {
    $canonical = $baseUrl . build_url($lang, $i18n, $tools);
    $siteLd = '<script type="application/ld+json">' . json_encode(['@context' => 'https://schema.org', '@type' => 'WebSite', 'name' => 'uToolsGo', 'url' => $canonical, 'inLanguage' => $T['html_lang'], 'description' => $T['home_meta']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
    render_head($lang, $T, $T['home_title'], $T['home_meta'], $canonical, hreflang_links($lang, $i18n, $tools, null, null), $siteLd);
    render_nav($lang, $T, $tools, $i18n);
    ?>
<main>
  <h1><?= h($T['home_h1']) ?></h1>
  <p class="subtitle"><?= h($T['home_subtitle']) ?></p>
  <?php
    $homeCats = array_merge(NAV_MAIN_CATS, NAV_MORE_CATS);
    if ($lang === 'pt') $homeCats[] = 'trabalhista';
  ?>
  <?php foreach ($homeCats as $catId): ?>
  <section class="cat-block">
    <h2><?= h($T['categories'][$catId]) ?></h2>
    <ul class="tool-list">
      <?php foreach ($tools as $id => $tool):
          if ($tool['category'] !== $catId) continue;
          if (!tool_available_in($tool, $lang)) continue;
          if (!empty($tool['hideFromIndex'])) continue;
          $c = $content[$id][$lang] ?? null;
          if (!$c) continue;
      ?>
      <li><a href="<?= h(build_url($lang, $i18n, $tools, $id)) ?>"><?= h($c['h1']) ?></a></li>
      <?php endforeach; ?>
    </ul>
  </section>
  <?php endforeach; ?>
</main>
    <?php
    render_footer($T);

} elseif ($view === 'category') {
    $catId = $viewData['category'];
    $canonical = $baseUrl . build_url($lang, $i18n, $tools, null, $catId);
    $catName = $T['categories'][$catId];
    $names = [];
    $len = 0;
    foreach ($tools as $tid => $ctool) {
        if ($ctool['category'] !== $catId || !tool_available_in($ctool, $lang) || !empty($ctool['hideFromIndex'])) continue;
        $cc = $content[$tid][$lang] ?? null;
        if (!$cc) continue;
        $nm = trim(preg_replace('/\s*\(.*$/u', '', $cc['h1']));
        if ($nm === '' || $len + mb_strlen($nm) > 70) { if (count($names) >= 2) break; else continue; }
        $names[] = $nm;
        $len += mb_strlen($nm) + 2;
        if (count($names) >= 4) break;
    }
    $title = sprintf($T['cat_title'], $catName);
    $catMeta = $names ? sprintf($T['cat_meta'], $catName, implode(', ', $names)) : $T['home_meta'];
    while (count($names) > 1 && mb_strlen($catMeta) > 158) {
        array_pop($names);
        $catMeta = sprintf($T['cat_meta'], $catName, implode(', ', $names));
    }
    render_head($lang, $T, $title, $catMeta, $canonical, hreflang_links($lang, $i18n, $tools, null, $catId));
    render_nav($lang, $T, $tools, $i18n);
    ?>
<main>
  <h1><?= h($T['categories'][$catId]) ?></h1>
  <ul class="tool-list">
    <?php foreach ($tools as $id => $tool):
        if ($tool['category'] !== $catId) continue;
        if (!tool_available_in($tool, $lang)) continue;
        if (!empty($tool['hideFromIndex'])) continue;
        $c = $content[$id][$lang] ?? null;
        if (!$c) continue;
    ?>
    <li><a href="<?= h(build_url($lang, $i18n, $tools, $id)) ?>"><?= h($c['h1']) ?></a> — <?= h($c['subtitle']) ?></li>
    <?php endforeach; ?>
  </ul>
</main>
    <?php
    render_footer($T);

} elseif ($view === 'tool') {
    $toolId = $viewData['toolId'];
    $tool = $tools[$toolId];
    $c = $content[$toolId][$lang];
    $canonical = $baseUrl . build_url($lang, $i18n, $tools, $toolId);
    $schema = webapp_schema($c['h1'], $canonical, $lang === 'pt' ? 'pt-BR' : $lang) . faq_schema($c['faq'] ?? [])
        . breadcrumb_schema([
            [$T['breadcrumb_home'], $baseUrl . build_url($lang, $i18n, $tools)],
            [$T['categories'][$tool['category']], $baseUrl . build_url($lang, $i18n, $tools, null, $tool['category'])],
            [$c['h1'], $canonical],
        ]);
    render_head($lang, $T, $c['title'], $c['meta'], $canonical, hreflang_links($lang, $i18n, $tools, $toolId, null), $schema);
    render_nav($lang, $T, $tools, $i18n);
    ?>
<main>
  <h1><?= h($c['h1']) ?></h1>
  <p class="subtitle"><?= h($c['subtitle']) ?></p>

  <?php if (($tool['special'] ?? null) !== 'article'): ?>
  <div class="card" data-tool="<?= h($tool['jsKey']) ?>" data-lang="<?= h($lang) ?>">
    <?php if (($tool['special'] ?? null) === 'generator'): ?>
      <?php if (!empty($c['notice'])): ?><div class="notice"><?= h($c['notice']) ?></div><?php endif; ?>
      <?php foreach ($tool['fields'] as $f) render_field($f, $c); ?>
      <button type="button" class="btn-primary" data-action="generate"><?= h($T['generate']) ?></button>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
      <?php if (!empty($tool['yearPages'])): ?>
        <?php
          $ypLinks = [];
          foreach ($tool['yearPages'] as $ypId) {
              if (!isset($tools[$ypId])) continue;
              $ypLang = tool_only_lang($tools[$ypId]);
              if ($ypLang === null) continue;
              $ypc = $content[$ypId][$ypLang] ?? null;
              if (!$ypc) continue;
              $ypLinks[] = [
                  'url' => build_url($ypLang, $i18n, $tools, $ypId),
                  'label' => $ypc['h1'],
                  'lang' => $ypLang,
              ];
          }
        ?>
        <?php if (!empty($ypLinks)): ?>
        <div class="year-pages-block">
          <h3><?= h($T['browse_by_year']) ?></h3>
          <ul class="tool-list">
            <?php foreach ($ypLinks as $yl): ?>
            <li>
              <a href="<?= h($yl['url']) ?>"><?= h($yl['label']) ?></a><?php if ($yl['lang'] !== $lang): ?> <span class="lang-tag">(<?= h(strtoupper($yl['lang'])) ?>)</span><?php endif; ?>
            </li>
            <?php endforeach; ?>
          </ul>
        </div>
        <?php endif; ?>
      <?php endif; ?>

    <?php elseif (($tool['special'] ?? null) === 'textarea'): ?>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="input" placeholder="<?= h($c['strings']['placeholder']) ?>"></textarea>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="format"><?= h($T['format']) ?></button>
        <button type="button" class="btn-primary" data-action="minify"><?= h($T['minify']) ?></button>
        <button type="button" class="btn-primary" data-action="validate"><?= h($T['validate']) ?></button>
        <button type="button" class="btn-secondary" data-action="copy"><?= h($T['copy']) ?></button>
        <button type="button" class="btn-secondary" data-action="clear"><?= h($T['clear']) ?></button>
      </div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'codec'): ?>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="input" placeholder="<?= h($c['strings']['placeholder']) ?>"></textarea>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="encode"><?= h($c['strings']['encode']) ?></button>
        <button type="button" class="btn-primary" data-action="decode"><?= h($c['strings']['decode']) ?></button>
        <button type="button" class="btn-secondary" data-action="copy"><?= h($T['copy']) ?></button>
        <button type="button" class="btn-secondary" data-action="clear"><?= h($T['clear']) ?></button>
      </div>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="output" readonly placeholder="<?= h($c['strings']['outputPlaceholder']) ?>"></textarea>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'analyze'): ?>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="input" placeholder="<?= h($c['strings']['placeholder']) ?>"></textarea>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="calc"><?= h($T['calculate']) ?></button>
        <button type="button" class="btn-secondary" data-action="clear"><?= h($T['clear']) ?></button>
      </div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>

    <?php elseif (($tool['special'] ?? null) === 'typingtest'): ?>
      <div class="typing-sample" data-role="sample"></div>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="typingInput" class="typing-input" placeholder="<?= h($c['strings']['inputPlaceholder']) ?>" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
      <div class="typing-stats">
        <span><?= h($c['strings']['timeLabel']) ?>: <strong data-role="typingTime">0:00</strong></span>
        <span><?= h($c['strings']['wpmLabel']) ?>: <strong data-role="typingWpm">0</strong></span>
        <span><?= h($c['strings']['accuracyLabel']) ?>: <strong data-role="typingAccuracy">100%</strong></span>
      </div>
      <div class="actions">
        <button type="button" class="btn-secondary" data-action="restart"><?= h($c['strings']['restartBtn']) ?></button>
      </div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>

    <?php elseif (($tool['special'] ?? null) === 'color'): ?>
      <div class="color-top">
        <input type="color" id="colorPicker" value="#2c65f2" aria-label="<?= h($c['h1']) ?>">
        <div class="color-swatch" data-role="swatch"></div>
        <button type="button" class="btn-secondary" data-action="random"><?= h($c['strings']['randomBtn']) ?></button>
      </div>
      <div class="color-grid">
        <div class="color-field">
          <label for="colorHex">HEX</label>
          <div class="color-field-row">
            <input type="text" id="colorHex" autocomplete="off" spellcheck="false">
            <button type="button" class="copy-btn" data-copy="colorHex"><?= h($T['copy']) ?></button>
          </div>
        </div>
        <div class="color-field">
          <label for="colorRgb">RGB</label>
          <div class="color-field-row">
            <input type="text" id="colorRgb" autocomplete="off" spellcheck="false">
            <button type="button" class="copy-btn" data-copy="colorRgb"><?= h($T['copy']) ?></button>
          </div>
        </div>
        <div class="color-field">
          <label for="colorHsl">HSL</label>
          <div class="color-field-row">
            <input type="text" id="colorHsl" autocomplete="off" spellcheck="false">
            <button type="button" class="copy-btn" data-copy="colorHsl"><?= h($T['copy']) ?></button>
          </div>
        </div>
        <div class="color-field">
          <label for="colorHsb">HSB / HSV</label>
          <div class="color-field-row">
            <input type="text" id="colorHsb" autocomplete="off" spellcheck="false">
            <button type="button" class="copy-btn" data-copy="colorHsb"><?= h($T['copy']) ?></button>
          </div>
        </div>
        <div class="color-field">
          <label for="colorCmyk">CMYK</label>
          <div class="color-field-row">
            <input type="text" id="colorCmyk" autocomplete="off" spellcheck="false">
            <button type="button" class="copy-btn" data-copy="colorCmyk"><?= h($T['copy']) ?></button>
          </div>
        </div>
      </div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'jwt'): ?>
      <div class="notice"><?= h($c['strings']['privacyNotice']) ?></div>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="input" placeholder="<?= h($c['strings']['placeholder']) ?>"></textarea>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="decode"><?= h($c['strings']['decodeBtn']) ?></button>
        <button type="button" class="btn-secondary" data-action="clear"><?= h($T['clear']) ?></button>
      </div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'timestamp'): ?>
      <div class="field">
        <label for="tsInput"><?= h($c['fieldLabels']['tsInput']) ?></label>
        <div class="color-field-row">
          <input type="text" id="tsInput" autocomplete="off" placeholder="<?= h($c['strings']['tsPlaceholder']) ?>">
          <button type="button" class="btn-secondary" data-action="now"><?= h($c['strings']['nowBtn']) ?></button>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="toDate"><?= h($c['strings']['toDateBtn']) ?></button>
      </div>
      <div class="result-box" role="status" aria-live="polite" data-role="resultDate"></div>

      <div class="field" style="margin-top:24px">
        <label for="dtInput"><?= h($c['fieldLabels']['dtInput']) ?></label>
        <input type="datetime-local" id="dtInput">
      </div>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="toTimestamp"><?= h($c['strings']['toTimestampBtn']) ?></button>
      </div>
      <div class="result-box" role="status" aria-live="polite" data-role="resultTimestamp"></div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'regex'): ?>
      <div class="field">
        <label for="regexPattern"><?= h($c['fieldLabels']['regexPattern']) ?></label>
        <input type="text" id="regexPattern" autocomplete="off" spellcheck="false" placeholder="<?= h($c['strings']['patternPlaceholder']) ?>">
      </div>
      <div class="field">
        <label for="regexFlags"><?= h($c['fieldLabels']['regexFlags']) ?></label>
        <input type="text" id="regexFlags" autocomplete="off" spellcheck="false" placeholder="g, i, m, s...">
      </div>
      <div class="field">
        <label for="regexInput"><?= h($c['fieldLabels']['regexInput']) ?></label>
        <textarea id="regexInput" placeholder="<?= h($c['strings']['inputPlaceholder']) ?>"></textarea>
      </div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>

    <?php elseif (($tool['special'] ?? null) === 'diff'): ?>
      <div class="field">
        <label for="diffA"><?= h($c['fieldLabels']['diffA']) ?></label>
        <textarea id="diffA" placeholder="<?= h($c['strings']['placeholderA']) ?>"></textarea>
      </div>
      <div class="field">
        <label for="diffB"><?= h($c['fieldLabels']['diffB']) ?></label>
        <textarea id="diffB" placeholder="<?= h($c['strings']['placeholderB']) ?>"></textarea>
      </div>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="calc"><?= h($c['strings']['compareBtn']) ?></button>
        <button type="button" class="btn-secondary" data-action="clear"><?= h($T['clear']) ?></button>
      </div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'secretsanta'): ?>
      <div class="notice"><?= h($c['strings']['privacyNotice']) ?></div>
      <?php foreach ($tool['fields'] as $f) render_field($f, $c); ?>
      <button type="button" class="btn-primary" data-action="draw"><?= h($c['strings']['drawBtn']) ?></button>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
      <div class="secret-santa-reveal" data-role="revealBox" style="display:none">
        <div class="field">
          <label for="secretSantaWho"><?= h($c['strings']['whoAreYou']) ?></label>
          <select id="secretSantaWho"></select>
        </div>
        <button type="button" class="btn-primary" data-action="reveal"><?= h($c['strings']['revealBtn']) ?></button>
        <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
      </div>

    <?php elseif (($tool['special'] ?? null) === 'beautify'): ?>
      <?php foreach ($tool['fields'] as $f) render_field($f, $c); ?>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="input" placeholder="<?= h($c['strings']['placeholder']) ?>"></textarea>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="format"><?= h($T['format']) ?></button>
        <button type="button" class="btn-secondary" data-action="copy"><?= h($T['copy']) ?></button>
        <button type="button" class="btn-secondary" data-action="clear"><?= h($T['clear']) ?></button>
      </div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'lines'): ?>
      <textarea aria-label="<?= h($c['h1']) ?>" data-role="input" placeholder="<?= h($c['strings']['placeholder']) ?>"></textarea>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="sortAsc"><?= h($c['strings']['sortAscBtn']) ?></button>
        <button type="button" class="btn-primary" data-action="sortDesc"><?= h($c['strings']['sortDescBtn']) ?></button>
        <button type="button" class="btn-primary" data-action="dedupe"><?= h($c['strings']['dedupeBtn']) ?></button>
        <button type="button" class="btn-primary" data-action="removeEmpty"><?= h($c['strings']['removeEmptyBtn']) ?></button>
        <button type="button" class="btn-secondary" data-action="copy"><?= h($T['copy']) ?></button>
        <button type="button" class="btn-secondary" data-action="clear"><?= h($T['clear']) ?></button>
      </div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'contrast'): ?>
      <div class="color-grid">
        <div class="color-field">
          <label for="contrastFgHex"><?= h($c['fieldLabels']['contrastFg']) ?></label>
          <div class="color-field-row">
            <input type="color" id="contrastFg" value="#14181f" aria-label="<?= h($c['fieldLabels']['contrastFg']) ?>">
            <input type="text" id="contrastFgHex" value="#14181f" autocomplete="off" spellcheck="false">
          </div>
        </div>
        <div class="color-field">
          <label for="contrastBgHex"><?= h($c['fieldLabels']['contrastBg']) ?></label>
          <div class="color-field-row">
            <input type="color" id="contrastBg" value="#ffffff" aria-label="<?= h($c['fieldLabels']['contrastBg']) ?>">
            <input type="text" id="contrastBgHex" value="#ffffff" autocomplete="off" spellcheck="false">
          </div>
        </div>
      </div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

    <?php elseif (($tool['special'] ?? null) === 'image'): ?>
      <div class="img-tool" data-from="<?= h($tool['imgFrom']) ?>" data-to="<?= h($tool['imgTo']) ?>" data-to-mime="<?= h($tool['imgToMime']) ?>" data-to-ext="<?= h($tool['imgToExt']) ?>" data-max-mb="<?= h((string) $tool['maxSizeMb']) ?>">
        <div class="img-drop" data-role="dropzone" tabindex="0" role="button" aria-label="<?= h($c['h1']) ?>">
          <input aria-label="<?= h($c['h1']) ?>" type="file" id="imgFile" accept="<?= h($tool['imgAccept']) ?>" hidden>
          <p class="img-drop-text"><?= h($c['strings']['dropText']) ?></p>
          <button type="button" class="btn-primary" data-action="choose"><?= h($c['strings']['chooseBtn']) ?></button>
          <p class="img-drop-hint"><?= h($c['strings']['sizeHint']) ?></p>
        </div>
        <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
        <div class="img-preview-grid" data-role="previewGrid">
          <div class="img-preview-box">
            <div class="img-preview-label"><?= h($c['strings']['originalLabel']) ?></div>
            <img data-role="originalImg" alt="">
            <div class="img-meta" data-role="originalMeta"></div>
          </div>
          <div class="img-preview-box">
            <div class="img-preview-label"><?= h($c['strings']['convertedLabel']) ?></div>
            <div class="img-placeholder" data-role="convertedPlaceholder"><?= h($c['strings']['convertedPending']) ?></div>
            <img data-role="convertedImg" alt="" style="display:none">
            <div class="img-meta" data-role="convertedMeta"></div>
          </div>
        </div>
        <?php if (in_array($tool['imgTo'], ['jpg', 'webp'], true)): ?>
        <div class="field img-quality" data-role="qualityField">
          <label for="imgQuality"><?= h($c['strings']['qualityLabel']) ?>: <span data-role="qualityVal">90</span>%</label>
          <input type="range" id="imgQuality" min="10" max="100" value="90">
        </div>
        <?php endif; ?>
        <div class="actions">
          <button type="button" class="btn-primary" data-action="convert" data-role="convertBtn" disabled><?= h($c['strings']['convertBtn']) ?></button>
          <a class="btn-secondary" data-action="download" data-role="downloadBtn" style="display:none" download><?= h($c['strings']['downloadBtn']) ?></a>
          <button type="button" class="btn-secondary" data-action="reset"><?= h($T['clear']) ?></button>
        </div>
      </div>

    <?php elseif (in_array($tool['special'] ?? null, ['img2pdf', 'pdfmerge'], true)): ?>
      <div class="multi-file-tool" data-mode="<?= h($tool['special']) ?>" data-accept="<?= h($tool['multiAccept']) ?>" data-max-mb="<?= h((string) $tool['maxSizeMb']) ?>" data-max-files="<?= h((string) ($tool['maxFiles'] ?? 30)) ?>">
        <div class="img-drop" data-role="dropzone" tabindex="0" role="button" aria-label="<?= h($c['h1']) ?>">
          <input aria-label="<?= h($c['h1']) ?>" type="file" id="multiFile" accept="<?= h($tool['multiAccept']) ?>" multiple hidden>
          <p class="img-drop-text"><?= h($c['strings']['dropText']) ?></p>
          <button type="button" class="btn-primary" data-action="choose"><?= h($c['strings']['chooseBtn']) ?></button>
          <p class="img-drop-hint"><?= h($c['strings']['sizeHint']) ?></p>
        </div>
        <ul class="file-list" data-role="fileList"></ul>
        <p class="file-list-empty" data-role="fileListEmpty"><?= h($c['strings']['noFiles']) ?></p>
        <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
        <div class="actions">
          <button type="button" class="btn-primary" data-action="process" data-role="processBtn" disabled><?= h($c['strings']['processBtn']) ?></button>
          <a class="btn-secondary" data-action="download" data-role="downloadBtn" style="display:none" download><?= h($c['strings']['downloadBtn']) ?></a>
          <button type="button" class="btn-secondary" data-action="reset"><?= h($T['clear']) ?></button>
        </div>
        <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
      </div>

    <?php elseif (in_array($tool['special'] ?? null, ['pdf2img', 'pdfsplit', 'pdfcompress'], true)): ?>
      <div class="pdf-tool" data-mode="<?= h($tool['special']) ?>" data-max-mb="<?= h((string) $tool['maxSizeMb']) ?>">
        <div class="img-drop" data-role="dropzone" tabindex="0" role="button" aria-label="<?= h($c['h1']) ?>">
          <input aria-label="<?= h($c['h1']) ?>" type="file" id="pdfFile" accept="application/pdf" hidden>
          <p class="img-drop-text"><?= h($c['strings']['dropText']) ?></p>
          <button type="button" class="btn-primary" data-action="choose"><?= h($c['strings']['chooseBtn']) ?></button>
          <p class="img-drop-hint"><?= h($c['strings']['sizeHint']) ?></p>
        </div>
        <div class="status-box" role="status" aria-live="polite" data-role="status"></div>

        <?php if ($tool['special'] === 'pdf2img'): ?>
        <div class="field">
          <label for="pdfImgFormat"><?= h($c['strings']['formatLabel']) ?></label>
          <select id="pdfImgFormat">
            <option value="png">PNG</option>
            <option value="jpg">JPEG</option>
          </select>
        </div>
        <div class="field img-quality" data-role="qualityField" style="display:none">
          <label for="pdfImgQuality"><?= h($c['strings']['qualityLabel']) ?>: <span data-role="qualityVal">90</span>%</label>
          <input type="range" id="pdfImgQuality" min="10" max="100" value="90">
        </div>
        <?php endif; ?>

        <?php if ($tool['special'] === 'pdfcompress'): ?>
        <div class="field">
          <label for="pdfCompressLevel"><?= h($c['strings']['levelLabel']) ?></label>
          <select id="pdfCompressLevel">
            <option value="low"><?= h($c['strings']['levelLow']) ?></option>
            <option value="medium" selected><?= h($c['strings']['levelMedium']) ?></option>
            <option value="high"><?= h($c['strings']['levelHigh']) ?></option>
          </select>
        </div>
        <?php endif; ?>

        <div class="actions">
          <button type="button" class="btn-primary" data-action="process" data-role="processBtn" disabled><?= h($c['strings']['processBtn']) ?></button>
          <a class="btn-secondary" data-action="download" data-role="downloadBtn" style="display:none" download><?= h($c['strings']['downloadBtn']) ?></a>
          <button type="button" class="btn-secondary" data-action="reset"><?= h($T['clear']) ?></button>
        </div>
        <div class="progress-bar-track" data-role="progressTrack"><div class="progress-bar-fill" data-role="progressFill"></div></div>
        <p class="progress-label" data-role="progressLabel"></p>
        <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
      </div>

    <?php elseif (in_array($tool['special'] ?? null, ['imgcompress', 'imgresize'], true)): ?>
      <div class="img-tool2" data-mode="<?= h($tool['special']) ?>" data-max-mb="<?= h((string) $tool['maxSizeMb']) ?>">
        <div class="img-drop" data-role="dropzone" tabindex="0" role="button" aria-label="<?= h($c['h1']) ?>">
          <input aria-label="<?= h($c['h1']) ?>" type="file" id="imgFile2" accept="image/*" hidden>
          <p class="img-drop-text"><?= h($c['strings']['dropText']) ?></p>
          <button type="button" class="btn-primary" data-action="choose"><?= h($c['strings']['chooseBtn']) ?></button>
          <p class="img-drop-hint"><?= h($c['strings']['sizeHint']) ?></p>
        </div>
        <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
        <div class="img-preview-grid" data-role="previewGrid">
          <div class="img-preview-box">
            <div class="img-preview-label"><?= h($c['strings']['originalLabel']) ?></div>
            <img data-role="originalImg" alt="">
            <div class="img-meta" data-role="originalMeta"></div>
          </div>
          <div class="img-preview-box">
            <div class="img-preview-label"><?= h($c['strings']['convertedLabel']) ?></div>
            <div class="img-placeholder" data-role="convertedPlaceholder"><?= h($c['strings']['convertedPending']) ?></div>
            <img data-role="convertedImg" alt="" style="display:none">
            <div class="img-meta" data-role="convertedMeta"></div>
          </div>
        </div>

        <?php if ($tool['special'] === 'imgcompress'): ?>
        <div class="field">
          <label for="compressFormat"><?= h($c['strings']['formatLabel']) ?></label>
          <select id="compressFormat">
            <option value="keep"><?= h($c['strings']['formatKeep']) ?></option>
            <option value="jpg">JPEG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>
        <div class="field img-quality">
          <label for="compressQuality"><?= h($c['strings']['qualityLabel']) ?>: <span data-role="qualityVal">80</span>%</label>
          <input type="range" id="compressQuality" min="10" max="100" value="80">
        </div>
        <?php endif; ?>

        <?php if ($tool['special'] === 'imgresize'): ?>
        <div class="resize-row">
          <div class="field">
            <label for="resizeWidth"><?= h($c['strings']['widthLabel']) ?></label>
            <input type="number" id="resizeWidth" inputmode="numeric" min="1">
          </div>
          <div class="field">
            <label for="resizeHeight"><?= h($c['strings']['heightLabel']) ?></label>
            <input type="number" id="resizeHeight" inputmode="numeric" min="1">
          </div>
          <label class="resize-lock checkbox-label"><input type="checkbox" id="resizeLock" checked> <?= h($c['strings']['lockAspect']) ?></label>
        </div>
        <?php endif; ?>

        <div class="actions">
          <button type="button" class="btn-primary" data-action="process" data-role="processBtn" disabled><?= h($c['strings']['processBtn']) ?></button>
          <a class="btn-secondary" data-action="download" data-role="downloadBtn" style="display:none" download><?= h($c['strings']['downloadBtn']) ?></a>
          <button type="button" class="btn-secondary" data-action="reset"><?= h($T['clear']) ?></button>
        </div>
      </div>

    <?php elseif (($tool['special'] ?? null) === 'ocr'): ?>
      <div class="ocr-tool" data-max-mb="<?= h((string) $tool['maxSizeMb']) ?>">
        <div class="img-drop" data-role="dropzone" tabindex="0" role="button" aria-label="<?= h($c['h1']) ?>">
          <input aria-label="<?= h($c['h1']) ?>" type="file" id="ocrFile" accept="image/*" hidden>
          <p class="img-drop-text"><?= h($c['strings']['dropText']) ?></p>
          <button type="button" class="btn-primary" data-action="choose"><?= h($c['strings']['chooseBtn']) ?></button>
          <p class="img-drop-hint"><?= h($c['strings']['sizeHint']) ?></p>
        </div>
        <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
        <div class="img-preview-grid" data-role="previewGrid">
          <div class="img-preview-box" style="grid-column:1/-1">
            <div class="img-preview-label"><?= h($c['strings']['originalLabel']) ?></div>
            <img data-role="originalImg" alt="">
            <div class="img-meta" data-role="originalMeta"></div>
          </div>
        </div>
        <div class="field">
          <label for="ocrLang"><?= h($c['strings']['langLabel']) ?></label>
          <select id="ocrLang">
            <option value="por">Português</option>
            <option value="eng">English</option>
            <option value="spa">Español</option>
          </select>
        </div>
        <div class="actions">
          <button type="button" class="btn-primary" data-action="process" data-role="processBtn" disabled><?= h($c['strings']['processBtn']) ?></button>
          <button type="button" class="btn-secondary" data-action="reset"><?= h($T['clear']) ?></button>
        </div>
        <div class="progress-bar-track" data-role="progressTrack"><div class="progress-bar-fill" data-role="progressFill"></div></div>
        <p class="progress-label" data-role="progressLabel"></p>
        <div class="field" data-role="outputField" style="display:none; margin-top:20px">
          <label><?= h($c['strings']['outputLabel']) ?></label>
          <textarea class="ocr-output" aria-label="<?= h($c['strings']['outputLabel']) ?>" data-role="output" readonly></textarea>
          <div class="actions">
            <button type="button" class="btn-secondary" data-action="copy"><?= h($T['copy']) ?></button>
          </div>
        </div>
      </div>

    <?php elseif (($tool['special'] ?? null) === 'timezone'): ?>
      <div class="field">
        <label for="tzWhen"><?= h($c['fieldLabels']['tzWhen']) ?></label>
        <input type="datetime-local" id="tzWhen">
      </div>
      <div class="field">
        <label for="tzFrom"><?= h($c['fieldLabels']['tzFrom']) ?></label>
        <select id="tzFrom"></select>
      </div>
      <div class="field">
        <label for="tzTo"><?= h($c['fieldLabels']['tzTo']) ?></label>
        <select id="tzTo"></select>
      </div>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="calc"><?= h($T['calculate']) ?></button>
        <button type="button" class="btn-secondary" data-action="swap"><?= h($c['strings']['swapBtn']) ?></button>
      </div>
      <div class="status-box" role="status" aria-live="polite" data-role="status"></div>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>

    <?php else: ?>
      <?php if (!empty($c['notice'])): ?><div class="notice"><?= h($c['notice']) ?></div><?php endif; ?>
      <?php foreach ($tool['fields'] as $f) render_field($f, $c); ?>
      <button type="button" class="btn-primary" data-action="calc"><?= h($T['calculate']) ?></button>
      <div class="result-box" role="status" aria-live="polite" data-role="result"></div>
    <?php endif; ?>
  </div>
  <?php endif; ?>

  <?php
    $jsStrings = $c['strings'] ?? [];
    $jsStrings['copy'] = $T['copy'];
    $jsStrings['copied'] = $T['copied'];
    if (isset($c['unitLabels'])) $jsStrings['units'] = $c['unitLabels'];
    if (($tool['special'] ?? null) === 'image') {
        $jsStrings['maxSizeMb'] = $tool['maxSizeMb'];
        $jsStrings['toMime'] = $tool['imgToMime'];
        $jsStrings['toExt'] = $tool['imgToExt'];
    }
    if (in_array($tool['special'] ?? null, ['img2pdf', 'pdfmerge', 'pdf2img', 'pdfsplit', 'pdfcompress', 'imgcompress', 'imgresize', 'ocr'], true)) {
        $jsStrings['maxSizeMb'] = $tool['maxSizeMb'];
    }
  ?>
  <script id="tool-strings" type="application/json"><?= json_encode($jsStrings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>

  <article>
    <?= $c['article'] ?? '' ?>
    <?php render_faq($c['faq'] ?? [], $T['faq_title']); ?>
  </article>

  <?php
    // Links internos: imagens lista todas as conversões; demais categorias, as 6 seguintes em ordem circular (cada ferramenta recebe 6 links).
    $sib = [];
    foreach ($tools as $rid => $rtool) {
        if (($rtool['category'] ?? null) === $tool['category'] && tool_available_in($rtool, $lang) && isset($content[$rid][$lang])) $sib[] = $rid;
    }
    $pos = array_search($toolId, $sib, true);
    $isImg = $tool['category'] === 'images';
    $related = [];
    for ($k = 1; $k < count($sib) && ($isImg || count($related) < 6); $k++) $related[] = $sib[($pos + $k) % count($sib)];
  ?>
  <?php if ($related): ?>
  <div class="related-conversions">
    <h2><?= h($isImg ? $T['related_conversions'] : $T['related_tools']) ?></h2>
    <ul class="tool-list">
      <?php foreach ($related as $rid): $rc = $content[$rid][$lang]; ?>
      <li><a href="<?= h(build_url($lang, $i18n, $tools, $rid)) ?>"><?= h($rc['h1']) ?></a></li>
      <?php endforeach; ?>
    </ul>
  </div>
  <?php endif; ?>
</main>
<?php if (($tool['special'] ?? null) !== 'article'): ?>
<?php foreach ($tool['vendorScripts'] ?? [] as $vs): ?>
<script defer src="<?= h(asset('/assets/js/' . $vs)) ?>"></script>
<?php endforeach; ?>
<script defer src="<?= h(asset('/assets/js/tools.js')) ?>"></script>
<?php endif; ?>
    <?php
    render_footer($T);

} else { // 404
    $canonical = $baseUrl . ($lang === 'pt' ? '/' : "/$lang/");
    render_head($lang, $T, $T['not_found_title'], $T['not_found_text'], $canonical, '', '', true);
    render_nav($lang, $T, $tools, $i18n);
    ?>
<main>
  <h1><?= h($T['not_found_title']) ?></h1>
  <p><?= h($T['not_found_text']) ?></p>
  <p><a href="<?= h(build_url($lang, $i18n, $tools)) ?>"><?= h($T['back_home']) ?></a></p>
</main>
    <?php
    render_footer($T);
}
