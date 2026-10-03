<?php
chdir(__DIR__);
$base = '/mnt/user-data/outputs/utoolsgo';
require $base . '/includes/functions.php';
$tools = include $base . '/data/tools.php';
$i18n = include $base . '/data/i18n.php';
$baseUrl = 'https://utoolsgo.com';

$urls = [];
$urls[] = $baseUrl . '/';
$urls[] = $baseUrl . build_url('en', $i18n, $tools, null, null);
$urls[] = $baseUrl . build_url('es', $i18n, $tools, null, null);

// Category pages: derive categories dynamically from tools.php
$cats = [];
foreach ($tools as $t) { $cats[$t['category']] = true; }
$cats = array_keys($cats);
foreach ($cats as $cat) {
    foreach (['pt', 'en', 'es'] as $lang) {
        // A category exists in a language if at least one tool in it is available in that language.
        $any = false;
        foreach ($tools as $t) {
            if ($t['category'] === $cat && tool_available_in($t, $lang)) { $any = true; break; }
        }
        if (!$any) continue;
        $urls[] = $baseUrl . build_url($lang, $i18n, $tools, null, $cat);
    }
}

// Tool pages
foreach ($tools as $id => $t) {
    foreach (['pt', 'en', 'es'] as $lang) {
        if (!tool_available_in($t, $lang)) continue;
        $urls[] = $baseUrl . build_url($lang, $i18n, $tools, $id);
    }
}

$urls = array_values(array_unique($urls));
sort($urls);

$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as $u) {
    $xml .= '  <url><loc>' . htmlspecialchars($u, ENT_XML1) . '</loc></url>' . "\n";
}
$xml .= '</urlset>' . "\n";

file_put_contents($base . '/sitemap.xml', $xml);
echo "Total URLs: " . count($urls) . "\n";
