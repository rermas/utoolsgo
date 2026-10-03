<?php
/**
 * Funções auxiliares: detecção de idioma, construção de URL e roteamento.
 */

define('SITE_LANGS', ['pt', 'en', 'es']);
define('SITE_DEFAULT_LANG', 'en'); // fallback quando o idioma do navegador não é suportado

function t(array $i18n, string $lang, string $key) {
    return $i18n[$lang][$key] ?? $i18n[SITE_DEFAULT_LANG][$key] ?? '';
}

/** Detecta o melhor idioma a partir do header Accept-Language. */
function detect_browser_lang(?string $acceptLanguage): string {
    if (!$acceptLanguage) return SITE_DEFAULT_LANG;
    $parts = explode(',', $acceptLanguage);
    foreach ($parts as $part) {
        $code = strtolower(trim(explode(';', $part)[0]));
        $primary = explode('-', $code)[0];
        if ($primary === 'pt') return 'pt';
        if ($primary === 'es') return 'es';
        if ($primary === 'en') return 'en';
    }
    return SITE_DEFAULT_LANG; // idioma não suportado -> inglês
}

/**
 * Idioma exclusivo de uma ferramenta, se houver.
 * - multilingual = true e sem 'onlyLang': null (existe em todos os idiomas).
 * - multilingual = false e sem 'onlyLang': 'pt' (comportamento histórico — ex: CPF/CNPJ, trabalhista).
 * - 'onlyLang' explícito: vence sempre (usado por entradas EN-only/ES-only, ex: diferença entre palavras).
 */
function tool_only_lang(array $tool): ?string {
    if (isset($tool['onlyLang'])) return $tool['onlyLang'];
    return $tool['multilingual'] ? null : 'pt';
}

/** Se a ferramenta tem versão de conteúdo no idioma informado. */
function tool_available_in(array $tool, string $lang): bool {
    $only = tool_only_lang($tool);
    return $only === null || $only === $lang;
}

/** Monta a URL de uma ferramenta ou de uma home/categoria em determinado idioma. */
function build_url(string $lang, array $i18n, array $tools, ?string $toolId = null, ?string $category = null): string {
    $prefix = $lang === 'pt' ? '' : "/$lang";

    if ($toolId !== null && isset($tools[$toolId])) {
        $tool = $tools[$toolId];
        if (!tool_available_in($tool, $lang)) {
            // ferramenta só existe em outro idioma (ex: CPF/CNPJ só PT, ou um par de palavras só EN/ES)
            return "/";
        }
        $catSlug = $i18n[$lang]['category_slugs'][$tool['category']];
        $toolSlug = $tool['slugs'][$lang] ?? null;
        if ($toolSlug === null) return "/";
        return "$prefix/$catSlug/$toolSlug/";
    }

    if ($category !== null) {
        $catSlug = $i18n[$lang]['category_slugs'][$category];
        return "$prefix/$catSlug/";
    }

    return $prefix === '' ? '/' : "$prefix/";
}

/**
 * Resolve a URI da requisição em [lang, remaining segments].
 */
function resolve_lang_and_segments(string $uri): array {
    $path = parse_url($uri, PHP_URL_PATH) ?? '/';
    $path = rawurldecode($path);
    $segments = array_values(array_filter(explode('/', $path), fn($s) => $s !== ''));

    if (isset($segments[0]) && $segments[0] === 'en') {
        return ['en', array_slice($segments, 1)];
    }
    if (isset($segments[0]) && $segments[0] === 'es') {
        return ['es', array_slice($segments, 1)];
    }
    return ['pt', $segments];
}

/** Encontra o tool id a partir da categoria+slug traduzidos, para um idioma. */
function find_tool_by_slugs(array $tools, array $i18n, string $lang, string $catSlug, string $toolSlug): ?string {
    foreach ($tools as $id => $tool) {
        if (!tool_available_in($tool, $lang)) continue;
        $expectedCatSlug = $i18n[$lang]['category_slugs'][$tool['category']] ?? null;
        $expectedToolSlug = $tool['slugs'][$lang] ?? null;
        if ($expectedCatSlug === $catSlug && $expectedToolSlug === $toolSlug) {
            return $id;
        }
    }
    return null;
}

/** Encontra o category id a partir do slug traduzido, para um idioma. */
function find_category_by_slug(array $i18n, string $lang, string $slug): ?string {
    foreach ($i18n[$lang]['category_slugs'] as $catId => $catSlug) {
        if ($catSlug === $slug) return $catId;
    }
    return null;
}

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
