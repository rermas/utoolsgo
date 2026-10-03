<?php
/**
 * Registro central de ferramentas.
 * Cada entrada define: categoria, se é multilíngue, slugs por idioma,
 * a função JS responsável (em assets/js/tools.js) e os campos de formulário
 * (id/tipo, independentes de idioma — os rótulos vêm de data/content.php).
 */
return [

    'bmi' => [
        'category' => 'health',
        'multilingual' => true,
        'jsKey' => 'bmi',
        'slugs' => ['pt' => 'imc', 'en' => 'bmi', 'es' => 'imc'],
        'fields' => [
            ['id' => 'weight', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'height', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
        ],
    ],

    'percentage' => [
        'category' => 'calculators',
        'multilingual' => true,
        'jsKey' => 'percentage',
        'slugs' => ['pt' => 'porcentagem', 'en' => 'percentage', 'es' => 'porcentaje'],
        'fields' => [
            ['id' => 'value', 'type' => 'number', 'step' => '0.01'],
            ['id' => 'percent', 'type' => 'number', 'step' => '0.01'],
        ],
    ],

    'temperature' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'temperature',
        'slugs' => ['pt' => 'temperatura', 'en' => 'temperature', 'es' => 'temperatura'],
        'fields' => [
            ['id' => 'tempValue', 'type' => 'number', 'step' => '0.1', 'value' => '0'],
            ['id' => 'tempUnit', 'type' => 'select', 'options' => ['C', 'F', 'K']],
        ],
    ],

    'password' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'password',
        'special' => 'generator',
        'slugs' => ['pt' => 'senha', 'en' => 'password', 'es' => 'contrasena'],
        'fields' => [
            ['id' => 'length', 'type' => 'range', 'min' => '4', 'max' => '64', 'value' => '16'],
            ['id' => 'upper', 'type' => 'checkbox', 'checked' => true],
            ['id' => 'lower', 'type' => 'checkbox', 'checked' => true],
            ['id' => 'numbers', 'type' => 'checkbox', 'checked' => true],
            ['id' => 'symbols', 'type' => 'checkbox', 'checked' => false],
        ],
    ],

    'json-formatter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'jsonFormatter',
        'special' => 'textarea',
        'slugs' => ['pt' => 'formatador-json', 'en' => 'json-formatter', 'es' => 'formateador-json'],
        'fields' => [],
    ],

    'cpf' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'cpf',
        'special' => 'generator',
        'slugs' => ['pt' => 'cpf'],
        'fields' => [
            ['id' => 'formato', 'type' => 'select', 'options' => ['mascara', 'numeros']],
        ],
    ],

    'cnpj' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'cnpj',
        'special' => 'generator',
        'slugs' => ['pt' => 'cnpj'],
        'fields' => [
            ['id' => 'formato', 'type' => 'select', 'options' => ['mascara', 'numeros']],
        ],
    ],

    // ---------------------------------------------- Codificação / texto
    'charcode' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'charCode',
        'special' => 'analyze',
        'slugs' => ['pt' => 'ascii-unicode-utf8', 'en' => 'ascii-unicode-utf8', 'es' => 'ascii-unicode-utf8'],
        'fields' => [],
    ],

    'url-encode' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'urlEncode',
        'special' => 'codec',
        'slugs' => ['pt' => 'url-encode-decode', 'en' => 'url-encode-decode', 'es' => 'url-encode-decode'],
        'fields' => [],
    ],

    'html-encode' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'htmlEncode',
        'special' => 'codec',
        'slugs' => ['pt' => 'html-encode-decode', 'en' => 'html-encode-decode', 'es' => 'html-encode-decode'],
        'fields' => [],
    ],

    'base64' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'base64',
        'special' => 'codec',
        'slugs' => ['pt' => 'base64-encode-decode', 'en' => 'base64-encode-decode', 'es' => 'base64-encode-decode'],
        'fields' => [],
    ],

    'color-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'colorConverter',
        'special' => 'color',
        'slugs' => ['pt' => 'conversor-de-cores', 'en' => 'color-converter', 'es' => 'conversor-de-colores'],
        'fields' => [],
    ],

    // ---------------------------------------------- Conversor de imagens (100% no navegador)
    'img-png-to-jpg' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'png', 'imgTo' => 'jpg', 'imgAccept' => 'image/png', 'imgToMime' => 'image/jpeg', 'imgToExt' => 'jpg', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-png-para-jpg', 'en' => 'convert-png-to-jpg', 'es' => 'convertir-png-a-jpg'],
        'fields' => [],
    ],
    'img-jpg-to-png' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'jpg', 'imgTo' => 'png', 'imgAccept' => 'image/jpeg', 'imgToMime' => 'image/png', 'imgToExt' => 'png', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-jpg-para-png', 'en' => 'convert-jpg-to-png', 'es' => 'convertir-jpg-a-png'],
        'fields' => [],
    ],
    'img-png-to-webp' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'png', 'imgTo' => 'webp', 'imgAccept' => 'image/png', 'imgToMime' => 'image/webp', 'imgToExt' => 'webp', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-png-para-webp', 'en' => 'convert-png-to-webp', 'es' => 'convertir-png-a-webp'],
        'fields' => [],
    ],
    'img-webp-to-png' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'webp', 'imgTo' => 'png', 'imgAccept' => 'image/webp', 'imgToMime' => 'image/png', 'imgToExt' => 'png', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-webp-para-png', 'en' => 'convert-webp-to-png', 'es' => 'convertir-webp-a-png'],
        'fields' => [],
    ],
    'img-jpg-to-webp' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'jpg', 'imgTo' => 'webp', 'imgAccept' => 'image/jpeg', 'imgToMime' => 'image/webp', 'imgToExt' => 'webp', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-jpg-para-webp', 'en' => 'convert-jpg-to-webp', 'es' => 'convertir-jpg-a-webp'],
        'fields' => [],
    ],
    'img-webp-to-jpg' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'webp', 'imgTo' => 'jpg', 'imgAccept' => 'image/webp', 'imgToMime' => 'image/jpeg', 'imgToExt' => 'jpg', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-webp-para-jpg', 'en' => 'convert-webp-to-jpg', 'es' => 'convertir-webp-a-jpg'],
        'fields' => [],
    ],
    'img-gif-to-jpg' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'gif', 'imgTo' => 'jpg', 'imgAccept' => 'image/gif', 'imgToMime' => 'image/jpeg', 'imgToExt' => 'jpg', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-gif-para-jpg', 'en' => 'convert-gif-to-jpg', 'es' => 'convertir-gif-a-jpg'],
        'fields' => [],
    ],
    'img-gif-to-png' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'gif', 'imgTo' => 'png', 'imgAccept' => 'image/gif', 'imgToMime' => 'image/png', 'imgToExt' => 'png', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-gif-para-png', 'en' => 'convert-gif-to-png', 'es' => 'convertir-gif-a-png'],
        'fields' => [],
    ],
    'img-bmp-to-png' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'bmp', 'imgTo' => 'png', 'imgAccept' => 'image/bmp,image/x-ms-bmp', 'imgToMime' => 'image/png', 'imgToExt' => 'png', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-bmp-para-png', 'en' => 'convert-bmp-to-png', 'es' => 'convertir-bmp-a-png'],
        'fields' => [],
    ],
    'img-bmp-to-jpg' => [
        'category' => 'images', 'multilingual' => true, 'jsKey' => 'imageConverter', 'special' => 'image',
        'imgFrom' => 'bmp', 'imgTo' => 'jpg', 'imgAccept' => 'image/bmp,image/x-ms-bmp', 'imgToMime' => 'image/jpeg', 'imgToExt' => 'jpg', 'maxSizeMb' => 20,
        'slugs' => ['pt' => 'converter-bmp-para-jpg', 'en' => 'convert-bmp-to-jpg', 'es' => 'convertir-bmp-a-jpg'],
        'fields' => [],
    ],

    // ---------------------------------------------- SEO
    'word-counter' => [
        'category' => 'seo',
        'multilingual' => true,
        'jsKey' => 'wordCounter',
        'special' => 'analyze',
        'slugs' => ['pt' => 'contador-de-palavras', 'en' => 'word-counter', 'es' => 'contador-de-palabras'],
        'fields' => [],
    ],

    'keyword-density' => [
        'category' => 'seo',
        'multilingual' => true,
        'jsKey' => 'keywordDensity',
        'special' => 'analyze',
        'slugs' => ['pt' => 'densidade-de-palavras-chave', 'en' => 'keyword-density-checker', 'es' => 'densidad-de-palabras-clave'],
        'fields' => [],
    ],

    'meta-tag-generator' => [
        'category' => 'seo',
        'multilingual' => true,
        'jsKey' => 'metaTagGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-meta-tags', 'en' => 'meta-tag-generator', 'es' => 'generador-de-meta-tags'],
        'fields' => [
            ['id' => 'metaTitle', 'type' => 'text'],
            ['id' => 'metaDescription', 'type' => 'textarea'],
            ['id' => 'metaUrl', 'type' => 'text'],
        ],
    ],

    'serp-simulator' => [
        'category' => 'seo',
        'multilingual' => true,
        'jsKey' => 'serpSimulator',
        'special' => 'generator',
        'slugs' => ['pt' => 'simulador-de-resultado-google', 'en' => 'serp-simulator', 'es' => 'simulador-de-resultado-google'],
        'fields' => [
            ['id' => 'serpTitle', 'type' => 'text'],
            ['id' => 'serpUrl', 'type' => 'text'],
            ['id' => 'serpDescription', 'type' => 'textarea'],
        ],
    ],

    // ---------------------------------------------- Trabalhista (CLT, só PT)
    'ferias' => [
        'category' => 'trabalhista',
        'multilingual' => false,
        'jsKey' => 'ferias',
        'slugs' => ['pt' => 'calculadora-de-ferias'],
        'fields' => [
            ['id' => 'salario', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'meses', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '12', 'value' => '12'],
            ['id' => 'diasAbono', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '10', 'value' => '0'],
        ],
    ],

    'decimo-terceiro' => [
        'category' => 'trabalhista',
        'multilingual' => false,
        'jsKey' => 'decimoTerceiro',
        'slugs' => ['pt' => 'calculadora-de-decimo-terceiro'],
        'fields' => [
            ['id' => 'salario', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'meses', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '12', 'value' => '12'],
            ['id' => 'adiantamento', 'type' => 'checkbox', 'checked' => false],
        ],
    ],

    'horas-extras' => [
        'category' => 'trabalhista',
        'multilingual' => false,
        'jsKey' => 'horasExtras',
        'slugs' => ['pt' => 'calculadora-de-horas-extras'],
        'fields' => [
            ['id' => 'salario', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'cargaHoraria', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '220'],
            ['id' => 'horasExtras', 'type' => 'number', 'step' => '0.5', 'min' => '0', 'value' => '0'],
            ['id' => 'adicional', 'type' => 'select', 'options' => ['50', '100']],
        ],
    ],

    'fgts' => [
        'category' => 'trabalhista',
        'multilingual' => false,
        'jsKey' => 'fgts',
        'slugs' => ['pt' => 'calculadora-de-fgts'],
        'fields' => [
            ['id' => 'salario', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'meses', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '12'],
            ['id' => 'tipoRescisao', 'type' => 'select', 'options' => ['nenhuma', 'sem_justa_causa', 'acordo', 'pedido_demissao', 'justa_causa']],
            ['id' => 'saldoInformado', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    'rescisao' => [
        'category' => 'trabalhista',
        'multilingual' => false,
        'jsKey' => 'rescisao',
        'slugs' => ['pt' => 'calculadora-de-rescisao-trabalhista'],
        'fields' => [
            ['id' => 'salario', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'admissao', 'type' => 'date'],
            ['id' => 'desligamento', 'type' => 'date'],
            ['id' => 'tipoRescisao', 'type' => 'select', 'options' => ['sem_justa_causa', 'acordo', 'pedido_demissao', 'justa_causa']],
            ['id' => 'avisoPrevio', 'type' => 'select', 'options' => ['indenizado', 'trabalhado']],
            ['id' => 'feriasVencidas', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '0'],
        ],
    ],

    // ---------------------------------------------- Financeiras
    'simple-interest' => [
        'category' => 'calculators',
        'multilingual' => true,
        'jsKey' => 'simpleInterest',
        'slugs' => ['pt' => 'juros-simples', 'en' => 'simple-interest', 'es' => 'interes-simple'],
        'fields' => [
            ['id' => 'capital', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'taxa', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'periodo', 'type' => 'number', 'step' => '1', 'min' => '1'],
        ],
    ],

    'compound-interest' => [
        'category' => 'calculators',
        'multilingual' => true,
        'jsKey' => 'compoundInterest',
        'slugs' => ['pt' => 'juros-compostos', 'en' => 'compound-interest', 'es' => 'interes-compuesto'],
        'fields' => [
            ['id' => 'capital', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'taxa', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'periodo', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'aporte', 'type' => 'number', 'step' => '0.01', 'min' => '0', 'value' => '0'],
        ],
    ],

    'loan-calculator' => [
        'category' => 'calculators',
        'multilingual' => true,
        'jsKey' => 'loanInstallments',
        'slugs' => ['pt' => 'calculadora-de-financiamento', 'en' => 'loan-calculator', 'es' => 'calculadora-de-prestamo'],
        'fields' => [
            ['id' => 'valor', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'taxa', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'parcelas', 'type' => 'number', 'step' => '1', 'min' => '1'],
        ],
    ],

    'rule-of-three' => [
        'category' => 'calculators',
        'multilingual' => true,
        'jsKey' => 'ruleOfThree',
        'slugs' => ['pt' => 'regra-de-tres', 'en' => 'rule-of-three', 'es' => 'regla-de-tres'],
        'fields' => [
            ['id' => 'a', 'type' => 'number', 'step' => 'any'],
            ['id' => 'b', 'type' => 'number', 'step' => 'any'],
            ['id' => 'c', 'type' => 'number', 'step' => 'any'],
            ['id' => 'tipo', 'type' => 'select', 'options' => ['direta', 'inversa']],
        ],
    ],

    'tip-calculator' => [
        'category' => 'calculators',
        'multilingual' => true,
        'jsKey' => 'tipCalculator',
        'slugs' => ['pt' => 'calculadora-de-gorjeta', 'en' => 'tip-calculator', 'es' => 'calculadora-de-propina'],
        'fields' => [
            ['id' => 'valorConta', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'percentual', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '10'],
            ['id' => 'pessoas', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '1'],
        ],
    ],

    // ---------------------------------------------- Dia a dia
    'age-calculator' => [
        'category' => 'everyday',
        'multilingual' => true,
        'jsKey' => 'ageCalculator',
        'slugs' => ['pt' => 'calculadora-de-idade', 'en' => 'age-calculator', 'es' => 'calculadora-de-edad'],
        'fields' => [
            ['id' => 'nascimento', 'type' => 'date'],
            ['id' => 'referencia', 'type' => 'date'],
        ],
    ],

    'date-difference' => [
        'category' => 'everyday',
        'multilingual' => true,
        'jsKey' => 'dateDiff',
        'slugs' => ['pt' => 'diferenca-entre-datas', 'en' => 'date-difference', 'es' => 'diferencia-entre-fechas'],
        'fields' => [
            ['id' => 'dataInicial', 'type' => 'date'],
            ['id' => 'dataFinal', 'type' => 'date'],
        ],
    ],

    'bill-split' => [
        'category' => 'everyday',
        'multilingual' => true,
        'jsKey' => 'billSplit',
        'slugs' => ['pt' => 'divisao-de-conta', 'en' => 'bill-split-calculator', 'es' => 'division-de-cuenta'],
        'fields' => [
            ['id' => 'valorTotal', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'pessoas', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '2'],
            ['id' => 'gorjeta', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '0'],
        ],
    ],

    'fuel-consumption' => [
        'category' => 'everyday',
        'multilingual' => true,
        'jsKey' => 'fuelEfficiency',
        'slugs' => ['pt' => 'calculadora-de-consumo-de-combustivel', 'en' => 'fuel-consumption-calculator', 'es' => 'calculadora-de-consumo-de-combustible'],
        'fields' => [
            ['id' => 'distancia', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'litros', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'precoLitro', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    'alcool-gasolina' => [
        'category' => 'everyday',
        'multilingual' => false,
        'jsKey' => 'alcoolGasolina',
        'slugs' => ['pt' => 'alcool-ou-gasolina'],
        'fields' => [
            ['id' => 'precoGasolina', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'precoAlcool', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
        ],
    ],

    'pace-corrida' => [
        'category' => 'everyday',
        'multilingual' => true,
        'jsKey' => 'paceCalculator',
        'slugs' => ['pt' => 'calculadora-de-pace-corrida', 'en' => 'running-pace-calculator', 'es' => 'calculadora-de-ritmo-de-carrera'],
        'fields' => [
            ['id' => 'distancia', 'type' => 'number', 'step' => '0.01', 'min' => '0.01', 'value' => '5'],
            ['id' => 'horas', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '0'],
            ['id' => 'minutos', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '59', 'value' => '25'],
            ['id' => 'segundos', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '59', 'value' => '0'],
        ],
    ],

    'calculadora-de-troco' => [
        'category' => 'everyday',
        'multilingual' => false,
        'jsKey' => 'trocoCalculator',
        'slugs' => ['pt' => 'calculadora-de-troco'],
        'fields' => [
            ['id' => 'valorCompra', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'valorPago', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    'conversor-de-unidades' => [
        'category' => 'everyday',
        'multilingual' => true,
        'jsKey' => 'unitConverter',
        'slugs' => ['pt' => 'conversor-de-unidades', 'en' => 'unit-converter', 'es' => 'conversor-de-unidades'],
        'fields' => [
            ['id' => 'tipoUnidade', 'type' => 'select', 'options' => ['comprimento', 'peso', 'volume']],
            ['id' => 'valorUnidade', 'type' => 'number', 'step' => 'any', 'value' => '1'],
            ['id' => 'unidadeDe', 'type' => 'select', 'options' => ['km', 'm', 'cm', 'mm', 'mi', 'yd', 'ft', 'in']],
        ],
    ],

    'area-perimetro' => [
        'category' => 'everyday',
        'multilingual' => true,
        'jsKey' => 'geometryCalculator',
        'slugs' => ['pt' => 'area-e-perimetro-de-figuras-geometricas', 'en' => 'area-and-perimeter-calculator', 'es' => 'calculadora-de-area-y-perimetro'],
        'fields' => [
            ['id' => 'figura', 'type' => 'select', 'options' => ['quadrado', 'retangulo', 'triangulo', 'circulo', 'trapezio', 'paralelogramo', 'losango']],
            ['id' => 'inA', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'inB', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'inC', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'inD', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    // ---------------------------------------------- Geradores (novos)
    'uuid-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'uuidGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-uuid', 'en' => 'uuid-generator', 'es' => 'generador-de-uuid'],
        'fields' => [
            ['id' => 'quantidade', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '50', 'value' => '1'],
            ['id' => 'formato', 'type' => 'select', 'options' => ['padrao', 'sem-hifen', 'maiusculo']],
        ],
    ],

    'qr-code-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'qrCodeGenerator',
        'special' => 'generator',
        'vendorScripts' => ['vendor/qrcode.js'],
        'slugs' => ['pt' => 'gerador-de-qr-code', 'en' => 'qr-code-generator', 'es' => 'generador-de-codigo-qr'],
        'fields' => [
            ['id' => 'texto', 'type' => 'textarea'],
            ['id' => 'tamanho', 'type' => 'select', 'options' => ['pequeno', 'medio', 'grande']],
            ['id' => 'nivel', 'type' => 'select', 'options' => ['L', 'M', 'Q', 'H']],
        ],
    ],

    'lorem-ipsum-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'loremIpsumGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-lorem-ipsum', 'en' => 'lorem-ipsum-generator', 'es' => 'generador-de-lorem-ipsum'],
        'fields' => [
            ['id' => 'quantidade', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '50', 'value' => '3'],
            ['id' => 'tipo', 'type' => 'select', 'options' => ['paragrafos', 'frases', 'palavras']],
        ],
    ],

    'hash-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'hashGenerator',
        'special' => 'generator',
        'vendorScripts' => ['vendor/md5.min.js'],
        'slugs' => ['pt' => 'gerador-de-hash', 'en' => 'hash-generator', 'es' => 'generador-de-hash'],
        'fields' => [
            ['id' => 'texto', 'type' => 'textarea'],
            ['id' => 'algoritmo', 'type' => 'select', 'options' => ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']],
        ],
    ],

    'random-number-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'randomNumberGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-numeros-aleatorios', 'en' => 'random-number-generator', 'es' => 'generador-de-numeros-aleatorios'],
        'fields' => [
            ['id' => 'min', 'type' => 'number', 'step' => '1', 'value' => '1'],
            ['id' => 'max', 'type' => 'number', 'step' => '1', 'value' => '100'],
            ['id' => 'quantidade', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '50', 'value' => '1'],
            ['id' => 'decimais', 'type' => 'checkbox', 'checked' => false],
            ['id' => 'semRepetir', 'type' => 'checkbox', 'checked' => false],
        ],
    ],

    'rg-generator' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'rgGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-rg'],
        'fields' => [
            ['id' => 'formato', 'type' => 'select', 'options' => ['mascara', 'numeros']],
        ],
    ],

    'placa-generator' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'placaGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-placa-de-carro'],
        'fields' => [
            ['id' => 'tipo', 'type' => 'select', 'options' => ['mercosul', 'antiga']],
        ],
    ],

    'pis-pasep-generator' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'pisPasepGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-pis-pasep'],
        'fields' => [
            ['id' => 'formato', 'type' => 'select', 'options' => ['mascara', 'numeros']],
        ],
    ],

    'cartao-teste-generator' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'cartaoTesteGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-cartao-de-credito-para-teste'],
        'fields' => [
            ['id' => 'bandeira', 'type' => 'select', 'options' => ['visa', 'mastercard', 'amex']],
            ['id' => 'quantidade', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '10', 'value' => '1'],
        ],
    ],

    'placeholder-image-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'placeholderGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-imagem-placeholder', 'en' => 'placeholder-image-generator', 'es' => 'generador-de-imagen-placeholder'],
        'fields' => [
            ['id' => 'largura', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '5000', 'value' => '600'],
            ['id' => 'altura', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '5000', 'value' => '400'],
            ['id' => 'corFundo', 'type' => 'text'],
            ['id' => 'corTexto', 'type' => 'text'],
            ['id' => 'textoPersonalizado', 'type' => 'text'],
            ['id' => 'formato', 'type' => 'select', 'options' => ['png', 'jpg']],
        ],
    ],

    'vcard-qrcode-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'vcardQrGenerator',
        'special' => 'generator',
        'vendorScripts' => ['vendor/qrcode.js'],
        'slugs' => ['pt' => 'gerador-de-qr-code-vcard', 'en' => 'vcard-qr-code-generator', 'es' => 'generador-de-codigo-qr-vcard'],
        'fields' => [
            ['id' => 'nome', 'type' => 'text'],
            ['id' => 'sobrenome', 'type' => 'text'],
            ['id' => 'telefone', 'type' => 'text'],
            ['id' => 'email', 'type' => 'text'],
            ['id' => 'empresa', 'type' => 'text'],
            ['id' => 'cargo', 'type' => 'text'],
            ['id' => 'site', 'type' => 'text'],
            ['id' => 'tamanho', 'type' => 'select', 'options' => ['pequeno', 'medio', 'grande']],
        ],
    ],

    'ean13-generator' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'ean13Generator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-codigo-de-barras-ean-13', 'en' => 'ean-13-barcode-generator', 'es' => 'generador-de-codigo-de-barras-ean-13'],
        'fields' => [
            ['id' => 'codigo', 'type' => 'text'],
            ['id' => 'tamanho', 'type' => 'select', 'options' => ['pequeno', 'medio', 'grande']],
        ],
    ],

    // ---------------------------------------------- Conversores para desenvolvedores (novos)
    'number-base-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'baseConverter',
        'slugs' => ['pt' => 'conversor-de-base-numerica', 'en' => 'number-base-converter', 'es' => 'conversor-de-base-numerica'],
        'fields' => [
            ['id' => 'numero', 'type' => 'text'],
            ['id' => 'baseOrigem', 'type' => 'select', 'options' => ['2', '8', '10', '16']],
        ],
    ],

    'jwt-decoder' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'jwtDecoder',
        'special' => 'jwt',
        'slugs' => ['pt' => 'decodificador-de-jwt', 'en' => 'jwt-decoder', 'es' => 'decodificador-de-jwt'],
        'fields' => [],
    ],

    'timestamp-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'timestampConverter',
        'special' => 'timestamp',
        'slugs' => ['pt' => 'conversor-de-timestamp-unix', 'en' => 'unix-timestamp-converter', 'es' => 'conversor-de-timestamp-unix'],
        'fields' => [],
    ],

    'case-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'caseConverter',
        'special' => 'analyze',
        'slugs' => ['pt' => 'conversor-de-case', 'en' => 'case-converter', 'es' => 'conversor-de-case'],
        'fields' => [],
    ],

    'string-escape' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'stringEscape',
        'special' => 'codec',
        'slugs' => ['pt' => 'escape-de-string', 'en' => 'string-escape', 'es' => 'escape-de-cadena'],
        'fields' => [],
    ],

    'slug-generator' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'slugGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-slug', 'en' => 'slug-generator', 'es' => 'generador-de-slug'],
        'fields' => [
            ['id' => 'texto', 'type' => 'textarea'],
        ],
    ],

    'csv-json-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'csvJsonConverter',
        'special' => 'codec',
        'slugs' => ['pt' => 'conversor-csv-json', 'en' => 'csv-to-json-converter', 'es' => 'conversor-csv-json'],
        'fields' => [],
    ],

    // ---------------------------------------------- Mais conversores para desenvolvedores (novos)
    'regex-tester' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'regexTester',
        'special' => 'regex',
        'slugs' => ['pt' => 'testador-de-regex', 'en' => 'regex-tester', 'es' => 'probador-de-regex'],
        'fields' => [],
    ],

    'diff-checker' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'diffChecker',
        'special' => 'diff',
        'slugs' => ['pt' => 'comparador-de-texto', 'en' => 'diff-checker', 'es' => 'comparador-de-texto'],
        'fields' => [],
    ],

    'code-formatter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'codeFormatter',
        'special' => 'beautify',
        'vendorScripts' => ['vendor/beautifier.min.js'],
        'slugs' => ['pt' => 'formatador-de-codigo', 'en' => 'code-formatter', 'es' => 'formateador-de-codigo'],
        'fields' => [
            ['id' => 'linguagem', 'type' => 'select', 'options' => ['js', 'css', 'html']],
        ],
    ],

    'sql-formatter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'sqlFormatter',
        'special' => 'beautify',
        'vendorScripts' => ['vendor/sql-formatter.min.js'],
        'slugs' => ['pt' => 'formatador-de-sql', 'en' => 'sql-formatter', 'es' => 'formateador-de-sql'],
        'fields' => [],
    ],

    'yaml-json-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'yamlJsonConverter',
        'special' => 'codec',
        'vendorScripts' => ['vendor/js-yaml.min.js'],
        'slugs' => ['pt' => 'conversor-yaml-json', 'en' => 'yaml-to-json-converter', 'es' => 'conversor-yaml-json'],
        'fields' => [],
    ],

    'xml-json-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'xmlJsonConverter',
        'special' => 'codec',
        'slugs' => ['pt' => 'conversor-xml-json', 'en' => 'xml-to-json-converter', 'es' => 'conversor-xml-json'],
        'fields' => [],
    ],

    'cidr-calculator' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'cidrCalculator',
        'slugs' => ['pt' => 'calculadora-de-sub-rede-cidr', 'en' => 'cidr-subnet-calculator', 'es' => 'calculadora-de-subred-cidr'],
        'fields' => [
            ['id' => 'cidr', 'type' => 'text'],
        ],
    ],

    'user-agent-parser' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'userAgentParser',
        'special' => 'analyze',
        'slugs' => ['pt' => 'analisador-de-user-agent', 'en' => 'user-agent-parser', 'es' => 'analizador-de-user-agent'],
        'fields' => [],
    ],

    'cron-explainer' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'cronExplainer',
        'vendorScripts' => ['vendor/cronstrue-i18n.min.js'],
        'slugs' => ['pt' => 'explicador-de-cron', 'en' => 'cron-expression-explainer', 'es' => 'explicador-de-cron'],
        'fields' => [
            ['id' => 'expressao', 'type' => 'text'],
        ],
    ],

    'line-sorter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'lineSorter',
        'special' => 'lines',
        'slugs' => ['pt' => 'ordenar-remover-duplicatas', 'en' => 'sort-remove-duplicate-lines', 'es' => 'ordenar-eliminar-duplicados'],
        'fields' => [],
    ],

    'roman-numeral-converter' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'romanNumeralConverter',
        'special' => 'codec',
        'slugs' => ['pt' => 'conversor-de-numeros-romanos', 'en' => 'roman-numeral-converter', 'es' => 'conversor-de-numeros-romanos'],
        'fields' => [],
    ],

    'contrast-checker' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'contrastChecker',
        'special' => 'contrast',
        'slugs' => ['pt' => 'verificador-de-contraste-wcag', 'en' => 'wcag-contrast-checker', 'es' => 'verificador-de-contraste-wcag'],
        'fields' => [],
    ],

    // ---------------------------------------------- Documentos e imagens (novos, categoria "Imagens")
    'img-to-pdf' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'imgToPdf',
        'special' => 'img2pdf',
        'multiAccept' => 'image/png,image/jpeg,image/webp',
        'maxSizeMb' => 20,
        'maxFiles' => 30,
        'vendorScripts' => ['vendor/pdf-lib.min.js'],
        'slugs' => ['pt' => 'converter-imagem-para-pdf', 'en' => 'image-to-pdf', 'es' => 'convertir-imagen-a-pdf'],
        'fields' => [],
    ],

    'pdf-to-img' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'pdfToImg',
        'special' => 'pdf2img',
        'maxSizeMb' => 30,
        'vendorScripts' => ['vendor/pdfjs/pdf.min.js', 'vendor/jszip.min.js'],
        'slugs' => ['pt' => 'converter-pdf-para-imagem', 'en' => 'pdf-to-image', 'es' => 'convertir-pdf-a-imagen'],
        'fields' => [],
    ],

    'pdf-merge' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'pdfMerge',
        'special' => 'pdfmerge',
        'multiAccept' => 'application/pdf',
        'maxSizeMb' => 30,
        'maxFiles' => 20,
        'vendorScripts' => ['vendor/pdf-lib.min.js'],
        'slugs' => ['pt' => 'juntar-pdf', 'en' => 'merge-pdf', 'es' => 'unir-pdf'],
        'fields' => [],
    ],

    'pdf-split' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'pdfSplit',
        'special' => 'pdfsplit',
        'maxSizeMb' => 30,
        'vendorScripts' => ['vendor/pdf-lib.min.js', 'vendor/jszip.min.js'],
        'slugs' => ['pt' => 'dividir-pdf', 'en' => 'split-pdf', 'es' => 'dividir-pdf'],
        'fields' => [],
    ],

    'img-compress' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'imgCompress',
        'special' => 'imgcompress',
        'maxSizeMb' => 20,
        'slugs' => ['pt' => 'comprimir-imagem', 'en' => 'compress-image', 'es' => 'comprimir-imagen'],
        'fields' => [],
    ],

    'img-resize' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'imgResize',
        'special' => 'imgresize',
        'maxSizeMb' => 20,
        'slugs' => ['pt' => 'redimensionar-imagem', 'en' => 'resize-image', 'es' => 'redimensionar-imagen'],
        'fields' => [],
    ],

    'pdf-compress' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'pdfCompress',
        'special' => 'pdfcompress',
        'maxSizeMb' => 40,
        'vendorScripts' => ['vendor/pdfjs/pdf.min.js', 'vendor/pdf-lib.min.js'],
        'slugs' => ['pt' => 'comprimir-pdf', 'en' => 'compress-pdf', 'es' => 'comprimir-pdf'],
        'fields' => [],
    ],

    'img-ocr' => [
        'category' => 'images',
        'multilingual' => true,
        'jsKey' => 'imgOcr',
        'special' => 'ocr',
        'maxSizeMb' => 20,
        'vendorScripts' => ['vendor/tesseract/tesseract.min.js'],
        'slugs' => ['pt' => 'extrair-texto-de-imagem-ocr', 'en' => 'image-to-text-ocr', 'es' => 'extraer-texto-de-imagen-ocr'],
        'fields' => [],
    ],

    // ---------------------------------------------- Muito buscados no Brasil
    'numero-por-extenso' => [
        'category' => 'converters',
        'multilingual' => false,
        'jsKey' => 'numeroPorExtenso',
        'slugs' => ['pt' => 'numero-por-extenso'],
        'fields' => [
            ['id' => 'valor', 'type' => 'text'],
            ['id' => 'moeda', 'type' => 'checkbox', 'checked' => true],
        ],
    ],

    'data-por-extenso' => [
        'category' => 'converters',
        'multilingual' => false,
        'jsKey' => 'dataPorExtenso',
        'slugs' => ['pt' => 'data-por-extenso'],
        'fields' => [
            ['id' => 'data', 'type' => 'date'],
            ['id' => 'diaSemana', 'type' => 'checkbox'],
        ],
    ],

    'validador-cpf-cnpj' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'validadorCpfCnpj',
        'slugs' => ['pt' => 'validador-de-cpf-cnpj'],
        'fields' => [
            ['id' => 'documento', 'type' => 'text'],
        ],
    ],

    'whatsapp-link' => [
        'category' => 'generators',
        'multilingual' => true,
        'jsKey' => 'whatsappLink',
        'slugs' => ['pt' => 'gerador-de-link-whatsapp', 'en' => 'whatsapp-link-generator', 'es' => 'generador-de-enlace-whatsapp'],
        'fields' => [
            ['id' => 'telefone', 'type' => 'text'],
            ['id' => 'mensagem', 'type' => 'textarea'],
        ],
    ],

    'loteria-numeros' => [
        'category' => 'generators',
        'multilingual' => false,
        'jsKey' => 'lotteryGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-numeros-da-loteria'],
        'fields' => [
            ['id' => 'jogo', 'type' => 'select', 'options' => ['mega-sena', 'lotofacil']],
            ['id' => 'numerosFixos', 'type' => 'text'],
        ],
    ],

    'fuso-horario' => [
        'category' => 'converters',
        'multilingual' => true,
        'jsKey' => 'timezoneConverter',
        'special' => 'timezone',
        'slugs' => ['pt' => 'conversor-de-fuso-horario', 'en' => 'timezone-converter', 'es' => 'conversor-de-zona-horaria'],
        'fields' => [],
    ],

    // ---------------------------------------------- Redes
    'subnet-mask-converter' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'subnetMaskConverter',
        'slugs' => ['pt' => 'conversor-de-mascara-de-sub-rede', 'en' => 'subnet-mask-converter', 'es' => 'conversor-de-mascara-de-subred'],
        'fields' => [
            ['id' => 'entrada', 'type' => 'text'],
        ],
    ],

    'vlsm-calculator' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'vlsmCalculator',
        'slugs' => ['pt' => 'calculadora-vlsm', 'en' => 'vlsm-calculator', 'es' => 'calculadora-vlsm'],
        'fields' => [
            ['id' => 'enderecoBase', 'type' => 'text'],
            ['id' => 'prefixoBase', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '32', 'value' => '24'],
            ['id' => 'subredes', 'type' => 'textarea'],
        ],
    ],

    'ip-in-subnet-checker' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'ipInSubnetChecker',
        'slugs' => ['pt' => 'verificador-de-ip-em-sub-rede', 'en' => 'ip-in-subnet-checker', 'es' => 'verificador-de-ip-en-subred'],
        'fields' => [
            ['id' => 'ipVerificar', 'type' => 'text'],
            ['id' => 'cidrRede', 'type' => 'text'],
        ],
    ],

    'cidr-overlap-checker' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'cidrOverlapChecker',
        'slugs' => ['pt' => 'comparador-de-cidrs', 'en' => 'cidr-overlap-checker', 'es' => 'comparador-de-cidrs'],
        'fields' => [
            ['id' => 'cidrA', 'type' => 'text'],
            ['id' => 'cidrB', 'type' => 'text'],
        ],
    ],

    'ip-bin-hex-converter' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'ipBinHexConverter',
        'slugs' => ['pt' => 'conversor-de-ip-para-binario-hexadecimal', 'en' => 'ip-to-binary-hex-converter', 'es' => 'conversor-de-ip-a-binario-hexadecimal'],
        'fields' => [
            ['id' => 'ipConverter', 'type' => 'text'],
        ],
    ],

    'data-unit-converter' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'dataUnitConverter',
        'slugs' => ['pt' => 'conversor-de-unidades-de-dados', 'en' => 'data-unit-converter', 'es' => 'conversor-de-unidades-de-datos'],
        'fields' => [
            ['id' => 'valorDados', 'type' => 'number', 'step' => 'any', 'value' => '1'],
            ['id' => 'unidadeDados', 'type' => 'select', 'options' => ['bit', 'byte', 'KB', 'MB', 'GB', 'TB', 'KiB', 'MiB', 'GiB', 'TiB']],
        ],
    ],

    'common-ports-table' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'commonPortsTable',
        'slugs' => ['pt' => 'tabela-de-portas-comuns', 'en' => 'common-ports-table', 'es' => 'tabla-de-puertos-comunes'],
        'fields' => [
            ['id' => 'buscaPorta', 'type' => 'text'],
        ],
    ],

    'http-status-table' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'httpStatusTable',
        'slugs' => ['pt' => 'tabela-de-codigos-de-status-http', 'en' => 'http-status-codes-table', 'es' => 'tabla-de-codigos-de-estado-http'],
        'fields' => [
            ['id' => 'buscaStatus', 'type' => 'text'],
        ],
    ],

    'mac-address-tool' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'macAddressTool',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-e-validador-de-endereco-mac', 'en' => 'mac-address-generator-validator', 'es' => 'generador-y-validador-de-direccion-mac'],
        'fields' => [
            ['id' => 'enderecoMac', 'type' => 'text'],
            ['id' => 'separadorMac', 'type' => 'select', 'options' => ['dois-pontos', 'hifen']],
        ],
    ],

    'download-time-calculator' => [
        'category' => 'network',
        'multilingual' => true,
        'jsKey' => 'downloadTimeCalculator',
        'slugs' => ['pt' => 'calculadora-de-tempo-de-download', 'en' => 'download-time-calculator', 'es' => 'calculadora-de-tiempo-de-descarga'],
        'fields' => [
            ['id' => 'tamanhoArquivo', 'type' => 'number', 'step' => '0.01', 'min' => '0.01', 'value' => '100'],
            ['id' => 'unidadeArquivo', 'type' => 'select', 'options' => ['KB', 'MB', 'GB']],
            ['id' => 'velocidadeConexao', 'type' => 'number', 'step' => '0.1', 'min' => '0.01', 'value' => '50'],
            ['id' => 'unidadeVelocidade', 'type' => 'select', 'options' => ['Kbps', 'Mbps', 'MBps']],
        ],
    ],

    // ---------------------------------------------- Saúde e Fitness
    'bmr-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'bmrCalculator',
        'slugs' => ['pt' => 'calculadora-de-tmb-e-calorias', 'en' => 'bmr-calorie-calculator', 'es' => 'calculadora-de-tmb-y-calorias'],
        'fields' => [
            ['id' => 'sexo', 'type' => 'select', 'options' => ['masculino', 'feminino']],
            ['id' => 'idade', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '120'],
            ['id' => 'peso', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'altura', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'atividade', 'type' => 'select', 'options' => ['sedentario', 'leve', 'moderado', 'ativo', 'muito-ativo']],
        ],
    ],
    'ideal-weight-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'idealWeightCalculator',
        'slugs' => ['pt' => 'calculadora-de-peso-ideal', 'en' => 'ideal-weight-calculator', 'es' => 'calculadora-de-peso-ideal'],
        'fields' => [
            ['id' => 'sexo', 'type' => 'select', 'options' => ['masculino', 'feminino']],
            ['id' => 'altura', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
        ],
    ],
    'body-fat-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'bodyFatCalculator',
        'slugs' => ['pt' => 'calculadora-de-percentual-de-gordura-corporal', 'en' => 'body-fat-calculator', 'es' => 'calculadora-de-grasa-corporal'],
        'fields' => [
            ['id' => 'sexo', 'type' => 'select', 'options' => ['masculino', 'feminino']],
            ['id' => 'altura', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'pescoco', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'cintura', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'quadril', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
        ],
    ],
    'macro-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'macroCalculator',
        'slugs' => ['pt' => 'calculadora-de-macronutrientes', 'en' => 'macro-calculator', 'es' => 'calculadora-de-macronutrientes'],
        'fields' => [
            ['id' => 'calorias', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '2000'],
            ['id' => 'objetivo', 'type' => 'select', 'options' => ['emagrecer', 'manter', 'ganhar-massa']],
        ],
    ],
    'heart-rate-zone-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'heartRateZoneCalculator',
        'slugs' => ['pt' => 'calculadora-de-frequencia-cardiaca-de-treino', 'en' => 'heart-rate-zone-calculator', 'es' => 'calculadora-de-frecuencia-cardiaca-de-entrenamiento'],
        'fields' => [
            ['id' => 'idade', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '120'],
            ['id' => 'fcRepouso', 'type' => 'number', 'step' => '1', 'min' => '30', 'max' => '150', 'value' => '70'],
        ],
    ],
    'water-intake-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'waterIntakeCalculator',
        'slugs' => ['pt' => 'calculadora-de-consumo-de-agua-diario', 'en' => 'water-intake-calculator', 'es' => 'calculadora-de-consumo-de-agua-diario'],
        'fields' => [
            ['id' => 'peso', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'nivelAtividade', 'type' => 'select', 'options' => ['sedentario', 'moderado', 'intenso']],
            ['id' => 'clima', 'type' => 'select', 'options' => ['normal', 'quente']],
        ],
    ],
    'one-rep-max-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'oneRepMaxCalculator',
        'slugs' => ['pt' => 'calculadora-de-repeticao-maxima-1rm', 'en' => 'one-rep-max-calculator', 'es' => 'calculadora-de-repeticion-maxima-1rm'],
        'fields' => [
            ['id' => 'pesoLevantado', 'type' => 'number', 'step' => '0.5', 'min' => '1'],
            ['id' => 'repeticoes', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '15'],
        ],
    ],
    'pregnancy-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'pregnancyCalculator',
        'slugs' => ['pt' => 'calculadora-de-semanas-de-gestacao-e-dpp', 'en' => 'pregnancy-due-date-calculator', 'es' => 'calculadora-de-semanas-de-embarazo-y-fpp'],
        'fields' => [
            ['id' => 'dataUltimaMenstruacao', 'type' => 'date'],
        ],
    ],

    // ---------------------------------------------- Culinária
    'cooking-measure-converter' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'cookingMeasureConverter',
        'slugs' => ['pt' => 'conversor-de-medidas-culinarias', 'en' => 'cooking-measure-converter', 'es' => 'conversor-de-medidas-de-cocina'],
        'fields' => [
            ['id' => 'quantidade', 'type' => 'number', 'step' => 'any', 'min' => '0.01', 'value' => '1'],
            ['id' => 'unidadeOrigem', 'type' => 'select', 'options' => ['xicara', 'colher-sopa', 'colher-cha', 'ml', 'litro', 'g', 'kg']],
            ['id' => 'ingrediente', 'type' => 'select', 'options' => ['agua', 'leite', 'farinha-trigo', 'acucar', 'manteiga', 'oleo', 'arroz-cru', 'mel']],
        ],
    ],
    'recipe-scaler-calculator' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'recipeScalerCalculator',
        'slugs' => ['pt' => 'calculadora-de-escala-de-receita', 'en' => 'recipe-scaler-calculator', 'es' => 'calculadora-de-escala-de-receta'],
        'fields' => [
            ['id' => 'porcoesOriginais', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '4'],
            ['id' => 'porcoesDesejadas', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '8'],
            ['id' => 'ingredientesReceita', 'type' => 'textarea'],
        ],
    ],
    'oven-temp-converter' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'ovenTempConverter',
        'slugs' => ['pt' => 'conversor-de-temperatura-de-forno', 'en' => 'oven-temperature-converter', 'es' => 'conversor-de-temperatura-de-horno'],
        'fields' => [
            ['id' => 'valorForno', 'type' => 'number', 'step' => '1', 'value' => '180'],
            ['id' => 'unidadeForno', 'type' => 'select', 'options' => ['celsius', 'fahrenheit']],
        ],
    ],


    // ---------------------------------------------- Matemática (categoria "Calculadoras")
    'gcd-lcm-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'gcdLcmCalculator',
        'slugs' => ['pt' => 'calculadora-de-mdc-e-mmc', 'en' => 'gcd-lcm-calculator', 'es' => 'calculadora-de-mcd-y-mcm'],
        'fields' => [['id' => 'numeros', 'type' => 'text']],
    ],
    'quadratic-equation-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'quadraticEquationCalculator',
        'slugs' => ['pt' => 'calculadora-de-equacao-de-2-grau', 'en' => 'quadratic-equation-calculator', 'es' => 'calculadora-de-ecuacion-de-segundo-grado'],
        'fields' => [
            ['id' => 'coefA', 'type' => 'number', 'step' => 'any'],
            ['id' => 'coefB', 'type' => 'number', 'step' => 'any'],
            ['id' => 'coefC', 'type' => 'number', 'step' => 'any'],
        ],
    ],
    'factorial-combinatorics-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'factorialCombinatoricsCalculator',
        'slugs' => ['pt' => 'calculadora-de-fatorial-combinacao-e-permutacao', 'en' => 'factorial-combinations-permutations-calculator', 'es' => 'calculadora-de-factorial-combinacion-y-permutacion'],
        'fields' => [
            ['id' => 'modo', 'type' => 'select', 'options' => ['fatorial', 'combinacao', 'permutacao']],
            ['id' => 'n', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '170'],
            ['id' => 'r', 'type' => 'number', 'step' => '1', 'min' => '0'],
        ],
    ],
    'prime-number-checker' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'primeNumberChecker',
        'slugs' => ['pt' => 'verificador-de-numero-primo', 'en' => 'prime-number-checker', 'es' => 'verificador-de-numero-primo'],
        'fields' => [['id' => 'numeroPrimo', 'type' => 'number', 'step' => '1', 'min' => '1']],
    ],
    'average-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'averageCalculator',
        'slugs' => ['pt' => 'calculadora-de-media', 'en' => 'average-calculator', 'es' => 'calculadora-de-promedio'],
        'fields' => [
            ['id' => 'modoMedia', 'type' => 'select', 'options' => ['aritmetica', 'ponderada', 'geometrica', 'harmonica']],
            ['id' => 'valoresMedia', 'type' => 'text'],
        ],
    ],
    'percentage-change-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'percentageChangeCalculator',
        'slugs' => ['pt' => 'calculadora-de-variacao-percentual', 'en' => 'percentage-change-calculator', 'es' => 'calculadora-de-variacion-porcentual'],
        'fields' => [
            ['id' => 'valorInicial', 'type' => 'number', 'step' => 'any'],
            ['id' => 'valorFinal', 'type' => 'number', 'step' => 'any'],
        ],
    ],

    // ---------------------------------------------- Design e Cores (categoria "Conversores")
    'color-palette-generator' => [
        'category' => 'converters', 'multilingual' => true, 'jsKey' => 'colorPaletteGenerator',
        'slugs' => ['pt' => 'gerador-de-paleta-de-cores', 'en' => 'color-palette-generator', 'es' => 'generador-de-paleta-de-colores'],
        'fields' => [
            ['id' => 'corBase', 'type' => 'text', 'value' => '#2C65F2'],
            ['id' => 'esquema', 'type' => 'select', 'options' => ['complementar', 'analoga', 'triade', 'tetradica', 'monocromatica']],
        ],
    ],
    'css-gradient-generator' => [
        'category' => 'converters', 'multilingual' => true, 'jsKey' => 'cssGradientGenerator',
        'slugs' => ['pt' => 'gerador-de-gradiente-css', 'en' => 'css-gradient-generator', 'es' => 'generador-de-degradado-css'],
        'fields' => [
            ['id' => 'corGrad1', 'type' => 'text', 'value' => '#2C65F2'],
            ['id' => 'corGrad2', 'type' => 'text', 'value' => '#FF7A3D'],
            ['id' => 'tipoGradiente', 'type' => 'select', 'options' => ['linear', 'radial']],
            ['id' => 'anguloGradiente', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '360', 'value' => '90'],
        ],
    ],
    'box-shadow-generator' => [
        'category' => 'converters', 'multilingual' => true, 'jsKey' => 'boxShadowGenerator',
        'slugs' => ['pt' => 'gerador-de-box-shadow-css', 'en' => 'box-shadow-generator', 'es' => 'generador-de-box-shadow-css'],
        'fields' => [
            ['id' => 'boxShadowX', 'type' => 'number', 'step' => '1', 'value' => '0'],
            ['id' => 'boxShadowY', 'type' => 'number', 'step' => '1', 'value' => '4'],
            ['id' => 'boxShadowBlur', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '12'],
            ['id' => 'boxShadowSpread', 'type' => 'number', 'step' => '1', 'value' => '0'],
            ['id' => 'boxShadowCor', 'type' => 'text', 'value' => 'rgba(0,0,0,0.25)'],
            ['id' => 'boxShadowInset', 'type' => 'checkbox'],
        ],
    ],
    'border-radius-generator' => [
        'category' => 'converters', 'multilingual' => true, 'jsKey' => 'borderRadiusGenerator',
        'slugs' => ['pt' => 'gerador-de-border-radius-css', 'en' => 'border-radius-generator', 'es' => 'generador-de-border-radius-css'],
        'fields' => [
            ['id' => 'radiusTL', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '16'],
            ['id' => 'radiusTR', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '16'],
            ['id' => 'radiusBR', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '16'],
            ['id' => 'radiusBL', 'type' => 'number', 'step' => '1', 'min' => '0', 'value' => '16'],
        ],
    ],
    'random-color-generator' => [
        'category' => 'converters', 'multilingual' => true, 'jsKey' => 'randomColorGenerator', 'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-cores-aleatorias', 'en' => 'random-color-generator', 'es' => 'generador-de-colores-aleatorios'],
        'fields' => [
            ['id' => 'quantidadeCores', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '10', 'value' => '5'],
            ['id' => 'formatoCor', 'type' => 'select', 'options' => ['hex', 'rgb', 'hsl']],
        ],
    ],

    // ---------------------------------------------- Datas e Curiosidades (categoria "Dia a Dia")
    'day-of-week-calculator' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'dayOfWeekCalculator',
        'slugs' => ['pt' => 'calculadora-de-dia-da-semana', 'en' => 'day-of-week-calculator', 'es' => 'calculadora-de-dia-de-la-semana'],
        'fields' => [['id' => 'dataConsulta', 'type' => 'date']],
    ],
    'countdown-calculator' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'countdownCalculator',
        'slugs' => ['pt' => 'contador-regressivo-para-data', 'en' => 'countdown-calculator', 'es' => 'contador-regresivo-para-fecha'],
        'fields' => [['id' => 'dataAlvo', 'type' => 'date']],
    ],
    'day-of-year-week-calculator' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'dayOfYearWeekCalculator',
        'slugs' => ['pt' => 'calculadora-de-dia-do-ano-e-semana-iso', 'en' => 'day-of-year-week-calculator', 'es' => 'calculadora-de-dia-del-ano-y-semana-iso'],
        'fields' => [['id' => 'dataConsultaAno', 'type' => 'date']],
    ],
    'zodiac-sign-calculator' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'zodiacSignCalculator',
        'slugs' => ['pt' => 'calculadora-de-signo-do-zodiaco', 'en' => 'zodiac-sign-calculator', 'es' => 'calculadora-de-signo-del-zodiaco'],
        'fields' => [['id' => 'dataNascimentoZodiaco', 'type' => 'date']],
    ],
    'date-to-roman-numerals-converter' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'dateToRomanConverter',
        'slugs' => ['pt' => 'conversor-de-data-para-numeros-romanos', 'en' => 'date-to-roman-numerals-converter', 'es' => 'conversor-de-fecha-a-numeros-romanos'],
        'fields' => [['id' => 'dataRomanos', 'type' => 'date']],
    ],

    // ================================================= FINANÇAS PESSOAIS
    'budget-503020-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'budget503020Calculator',
        'slugs' => ['pt' => 'calculadora-de-orcamento-50-30-20', 'en' => 'budget-50-30-20-calculator', 'es' => 'calculadora-de-presupuesto-50-30-20'],
        'fields' => [['id' => 'rendaMensal', 'type' => 'number', 'step' => '0.01', 'min' => '0']],
    ],
    'emergency-fund-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'emergencyFundCalculator',
        'slugs' => ['pt' => 'calculadora-de-reserva-de-emergencia', 'en' => 'emergency-fund-calculator', 'es' => 'calculadora-de-fondo-de-emergencia'],
        'fields' => [
            ['id' => 'despesasMensais', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'mesesCobertura', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '6'],
            ['id' => 'poupancaAtual', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'aporteMensal', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'financial-independence-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'financialIndependenceCalculator',
        'slugs' => ['pt' => 'calculadora-de-independencia-financeira', 'en' => 'financial-independence-calculator', 'es' => 'calculadora-de-independencia-financiera'],
        'fields' => [
            ['id' => 'poupancaAtualFi', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'aporteMensalFi', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'taxaAnualFi', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'anosFi', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'metaValorFi', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'savings-goal-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'savingsGoalCalculator',
        'slugs' => ['pt' => 'calculadora-de-meta-de-poupanca', 'en' => 'savings-goal-calculator', 'es' => 'calculadora-de-meta-de-ahorro'],
        'fields' => [
            ['id' => 'valorMetaSg', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'dataMetaSg', 'type' => 'date'],
            ['id' => 'poupancaAtualSg', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'taxaAnualSg', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'debt-payoff-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'debtPayoffCalculator',
        'slugs' => ['pt' => 'calculadora-de-quitacao-de-dividas', 'en' => 'debt-payoff-calculator', 'es' => 'calculadora-de-pago-de-deudas'],
        'fields' => [
            ['id' => 'dividasLista', 'type' => 'textarea'],
            ['id' => 'extraMensalDivida', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'markup-margin-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'markupMarginCalculator',
        'slugs' => ['pt' => 'calculadora-de-markup-e-margem-de-lucro', 'en' => 'markup-margin-calculator', 'es' => 'calculadora-de-markup-y-margen'],
        'fields' => [
            ['id' => 'custoMm', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'modoMm', 'type' => 'select', 'options' => ['markup', 'margin']],
            ['id' => 'percentualMm', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'freelancer-rate-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'freelancerRateCalculator',
        'slugs' => ['pt' => 'calculadora-de-valor-da-hora-freelancer', 'en' => 'freelancer-rate-calculator', 'es' => 'calculadora-de-tarifa-freelance'],
        'fields' => [
            ['id' => 'rendaDesejadaFr', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'custosMensaisFr', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'horasSemanaisFr', 'type' => 'number', 'step' => '0.5', 'min' => '1', 'max' => '80'],
            ['id' => 'semanasFeriasFr', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '51', 'value' => '4'],
        ],
    ],
    'breakeven-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'breakevenCalculator',
        'slugs' => ['pt' => 'calculadora-de-ponto-de-equilibrio', 'en' => 'breakeven-calculator', 'es' => 'calculadora-de-punto-de-equilibrio'],
        'fields' => [
            ['id' => 'custosFixosBe', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'custoVariavelBe', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'precoVendaBe', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    // ================================================= TEXTO E PRODUTIVIDADE
    'text-case-converter' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'textCaseConverter',
        'slugs' => ['pt' => 'conversor-de-maiusculas-e-minusculas', 'en' => 'text-case-converter', 'es' => 'conversor-de-mayusculas-y-minusculas'],
        'fields' => [
            ['id' => 'textoCase', 'type' => 'textarea'],
            ['id' => 'modoCase', 'type' => 'select', 'options' => ['upper', 'lower', 'title', 'sentence', 'toggle']],
        ],
    ],
    'accent-remover' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'accentRemover',
        'slugs' => ['pt' => 'removedor-de-acentos', 'en' => 'accent-remover', 'es' => 'eliminador-de-acentos'],
        'fields' => [['id' => 'textoAccent', 'type' => 'textarea']],
    ],
    'reading-time-calculator' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'readingTimeCalculator',
        'slugs' => ['pt' => 'calculadora-de-tempo-de-leitura', 'en' => 'reading-time-calculator', 'es' => 'calculadora-de-tiempo-de-lectura'],
        'fields' => [
            ['id' => 'textoReading', 'type' => 'textarea'],
            ['id' => 'palavrasPorMinuto', 'type' => 'number', 'step' => '1', 'min' => '50', 'max' => '600', 'value' => '200'],
        ],
    ],
    'text-cleaner' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'textCleaner',
        'slugs' => ['pt' => 'removedor-de-linhas-e-espacos-extras', 'en' => 'text-cleaner', 'es' => 'limpiador-de-texto'],
        'fields' => [
            ['id' => 'textoCleaner', 'type' => 'textarea'],
            ['id' => 'trimLinhas', 'type' => 'checkbox', 'checked' => true],
            ['id' => 'colapsarLinhasVazias', 'type' => 'checkbox', 'checked' => true],
            ['id' => 'colapsarEspacos', 'type' => 'checkbox', 'checked' => true],
        ],
    ],
    'email-url-extractor' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'emailUrlExtractor',
        'slugs' => ['pt' => 'extrator-de-emails-e-urls', 'en' => 'email-url-extractor', 'es' => 'extractor-de-emails-y-urls'],
        'fields' => [['id' => 'textoExtract', 'type' => 'textarea']],
    ],
    'list-picker' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'listPicker',
        'slugs' => ['pt' => 'sorteador-de-item-de-lista', 'en' => 'list-picker', 'es' => 'sorteador-de-lista'],
        'fields' => [
            ['id' => 'listaPicker', 'type' => 'textarea'],
            ['id' => 'quantidadePicker', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '1'],
            ['id' => 'semRepeticaoPicker', 'type' => 'checkbox', 'checked' => true],
        ],
    ],
    'markdown-to-html-converter' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'markdownToHtmlConverter',
        'slugs' => ['pt' => 'conversor-de-markdown-para-html', 'en' => 'markdown-to-html-converter', 'es' => 'conversor-de-markdown-a-html'],
        'fields' => [['id' => 'markdownInput', 'type' => 'textarea']],
    ],
    'pomodoro-timer' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'pomodoroTimer',
        'slugs' => ['pt' => 'temporizador-pomodoro', 'en' => 'pomodoro-timer', 'es' => 'temporizador-pomodoro'],
        'fields' => [],
    ],
    'business-days-calculator' => [
        'category' => 'text-productivity', 'multilingual' => true, 'jsKey' => 'businessDaysCalculator',
        'slugs' => ['pt' => 'calculadora-de-dias-uteis', 'en' => 'business-days-calculator', 'es' => 'calculadora-de-dias-habiles'],
        'fields' => [
            ['id' => 'dataInicialBd', 'type' => 'date'],
            ['id' => 'dataFinalBd', 'type' => 'date'],
        ],
    ],


// ============================================================= DIFERENÇA ENTRE PALAVRAS (word-differences)
    'word-diff-mal-mau' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffMalMau',
        'special' => 'article',
        'slugs' => [
            'pt' => 'mal-vs-mau',
        ],
        'fields' => [
        ],
    ],
    'word-diff-mas-mais' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffMasMais',
        'special' => 'article',
        'slugs' => [
            'pt' => 'mas-vs-mais',
        ],
        'fields' => [
        ],
    ],
    'word-diff-concerto-conserto' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffConcertoConserto',
        'special' => 'article',
        'slugs' => [
            'pt' => 'concerto-vs-conserto',
        ],
        'fields' => [
        ],
    ],
    'word-diff-sessao-secao-cessao' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffSessaoSecaoCessao',
        'special' => 'article',
        'slugs' => [
            'pt' => 'sessao-secao-cessao',
        ],
        'fields' => [
        ],
    ],
    'word-diff-onde-aonde' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffOndeAonde',
        'special' => 'article',
        'slugs' => [
            'pt' => 'onde-vs-aonde',
        ],
        'fields' => [
        ],
    ],
    'word-diff-ha-a-tempo' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffHaATempo',
        'special' => 'article',
        'slugs' => [
            'pt' => 'ha-vs-a-tempo',
        ],
        'fields' => [
        ],
    ],
    'word-diff-meia-meio' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffMeiaMeio',
        'special' => 'article',
        'slugs' => [
            'pt' => 'meia-vs-meio',
        ],
        'fields' => [
        ],
    ],
    'word-diff-ascender-acender' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffAscenderAcender',
        'special' => 'article',
        'slugs' => [
            'pt' => 'ascender-vs-acender',
        ],
        'fields' => [
        ],
    ],
    'word-diff-cheque-xeque' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffChequeXeque',
        'special' => 'article',
        'slugs' => [
            'pt' => 'cheque-vs-xeque',
        ],
        'fields' => [
        ],
    ],
    'word-diff-trafego-trafico' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffTrafegoTrafico',
        'special' => 'article',
        'slugs' => [
            'pt' => 'trafego-vs-trafico',
        ],
        'fields' => [
        ],
    ],
    'word-diff-emigrar-imigrar' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffEmigrarImigrar',
        'special' => 'article',
        'slugs' => [
            'pt' => 'emigrar-vs-imigrar',
        ],
        'fields' => [
        ],
    ],
    'word-diff-ratificar-retificar' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffRatificarRetificar',
        'special' => 'article',
        'slugs' => [
            'pt' => 'ratificar-vs-retificar',
        ],
        'fields' => [
        ],
    ],
    'word-diff-comprimento-cumprimento' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffComprimentoCumprimento',
        'special' => 'article',
        'slugs' => [
            'pt' => 'comprimento-vs-cumprimento',
        ],
        'fields' => [
        ],
    ],
    'word-diff-descriminar-discriminar' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffDescriminarDiscriminar',
        'special' => 'article',
        'slugs' => [
            'pt' => 'descriminar-vs-discriminar',
        ],
        'fields' => [
        ],
    ],
    'word-diff-por-que-porque' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffPorQuePorque',
        'special' => 'article',
        'slugs' => [
            'pt' => 'por-que-porque-por-que-porque',
        ],
        'fields' => [
        ],
    ],
    'word-diff-mim-eu' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffMimEu',
        'special' => 'article',
        'slugs' => [
            'pt' => 'mim-vs-eu',
        ],
        'fields' => [
        ],
    ],
    'word-diff-affect-effect' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffAffectEffect',
        'special' => 'article',
        'slugs' => [
            'en' => 'affect-vs-effect',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-its-its' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffItsIts',
        'special' => 'article',
        'slugs' => [
            'en' => 'its-vs-its',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-then-than' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffThenThan',
        'special' => 'article',
        'slugs' => [
            'en' => 'then-vs-than',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-there-their-theyre' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffThereTheirTheyre',
        'special' => 'article',
        'slugs' => [
            'en' => 'there-vs-their-vs-theyre',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-who-whom' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffWhoWhom',
        'special' => 'article',
        'slugs' => [
            'en' => 'who-vs-whom',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-farther-further' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffFartherFurther',
        'special' => 'article',
        'slugs' => [
            'en' => 'farther-vs-further',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-complement-compliment' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffComplementCompliment',
        'special' => 'article',
        'slugs' => [
            'en' => 'complement-vs-compliment',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-principal-principle' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffPrincipalPrinciple',
        'special' => 'article',
        'slugs' => [
            'en' => 'principal-vs-principle',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-fewer-less' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffFewerLess',
        'special' => 'article',
        'slugs' => [
            'en' => 'fewer-vs-less',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-lay-lie' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffLayLie',
        'special' => 'article',
        'slugs' => [
            'en' => 'lay-vs-lie',
        ],
        'fields' => [
        ],
        'onlyLang' => 'en',
    ],
    'word-diff-haber-a-ver' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffHaberAVer',
        'special' => 'article',
        'slugs' => [
            'es' => 'haber-vs-a-ver',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],
    'word-diff-hay-ahi-ay' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffHayAhiAy',
        'special' => 'article',
        'slugs' => [
            'es' => 'hay-vs-ahi-vs-ay',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],
    'word-diff-porque-por-que-porque' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffPorquePorQuePorque',
        'special' => 'article',
        'slugs' => [
            'es' => 'porque-por-que-porque-por-que',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],
    'word-diff-sino-si-no' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffSinoSiNo',
        'special' => 'article',
        'slugs' => [
            'es' => 'sino-vs-si-no',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],
    'word-diff-hecho-echo' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffHechoEcho',
        'special' => 'article',
        'slugs' => [
            'es' => 'hecho-vs-echo',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],
    'word-diff-vaya-valla-baya' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffVayaVallaBaya',
        'special' => 'article',
        'slugs' => [
            'es' => 'vaya-vs-valla-vs-baya',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],
    'word-diff-tuvo-tubo' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffTuvoTubo',
        'special' => 'article',
        'slugs' => [
            'es' => 'tuvo-vs-tubo',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],
    'word-diff-halla-haya-aya' => [
        'category' => 'word-differences',
        'multilingual' => false,
        'jsKey' => 'wordDiffHallaHayaAya',
        'special' => 'article',
        'slugs' => [
            'es' => 'halla-vs-haya-vs-aya',
        ],
        'fields' => [
        ],
        'onlyLang' => 'es',
    ],


// ============================================================= EDUCAÇÃO E ESTUDOS + CONSTRUÇÃO E REFORMA
    'weighted-grade-calculator' => [
        'category' => 'education',
        'multilingual' => true,
        'jsKey' => 'weightedGradeCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-media-ponderada',
            'en' => 'weighted-grade-calculator',
            'es' => 'calculadora-de-media-ponderada',
        ],
        'fields' => [
            [
                'id' => 'notas',
                'type' => 'textarea',
            ],
            [
                'id' => 'modoReversa',
                'type' => 'select',
                'options' => [
                    'normal',
                    'reversa',
                ],
            ],
            [
                'id' => 'mediaAtual',
                'type' => 'number',
                'step' => '0.01',
            ],
            [
                'id' => 'pesoProva',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'max' => '100',
            ],
            [
                'id' => 'notaMinima',
                'type' => 'number',
                'step' => '0.01',
                'value' => '6',
            ],
        ],
    ],
    'grade-scale-converter' => [
        'category' => 'education',
        'multilingual' => true,
        'jsKey' => 'gradeScaleConverter',
        'slugs' => [
            'pt' => 'conversor-de-nota-para-conceito',
            'en' => 'grade-scale-converter',
            'es' => 'conversor-de-nota-a-concepto',
        ],
        'fields' => [
            [
                'id' => 'notaValor',
                'type' => 'number',
                'step' => '0.01',
                'min' => '0',
            ],
            [
                'id' => 'escala',
                'type' => 'select',
                'options' => [
                    '10',
                    '100',
                ],
            ],
        ],
    ],
    'gpa-converter' => [
        'category' => 'education',
        'multilingual' => true,
        'jsKey' => 'gpaConverter',
        'slugs' => [
            'pt' => 'conversor-de-nota-para-gpa',
            'en' => 'gpa-converter',
            'es' => 'conversor-de-nota-a-gpa',
        ],
        'fields' => [
            [
                'id' => 'notaBr',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0',
                'max' => '10',
            ],
        ],
    ],
    'attendance-calculator' => [
        'category' => 'education',
        'multilingual' => true,
        'jsKey' => 'attendanceCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-frequencia-minima',
            'en' => 'attendance-calculator',
            'es' => 'calculadora-de-asistencia-minima',
        ],
        'fields' => [
            [
                'id' => 'totalAulas',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
            ],
            [
                'id' => 'aulasFaltadas',
                'type' => 'number',
                'step' => '1',
                'min' => '0',
                'value' => '0',
            ],
            [
                'id' => 'frequenciaMinima',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'max' => '100',
                'value' => '75',
            ],
        ],
    ],
    'cr-ira-calculator' => [
        'category' => 'education',
        'multilingual' => true,
        'jsKey' => 'crIraCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-cr-ira',
            'en' => 'gpa-cr-calculator',
            'es' => 'calculadora-de-promedio-ponderado',
        ],
        'fields' => [
            [
                'id' => 'disciplinasCr',
                'type' => 'textarea',
            ],
        ],
    ],
    'spaced-repetition-planner' => [
        'category' => 'education',
        'multilingual' => true,
        'jsKey' => 'spacedRepetitionPlanner',
        'slugs' => [
            'pt' => 'planejador-de-revisao-espacada',
            'en' => 'spaced-repetition-planner',
            'es' => 'planificador-de-repaso-espaciado',
        ],
        'fields' => [
            [
                'id' => 'dataEstudo',
                'type' => 'date',
            ],
        ],
    ],
    'reading-plan-calculator' => [
        'category' => 'education',
        'multilingual' => true,
        'jsKey' => 'readingPlanCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-plano-de-leitura',
            'en' => 'reading-plan-calculator',
            'es' => 'calculadora-de-plan-de-lectura',
        ],
        'fields' => [
            [
                'id' => 'totalPaginas',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
            ],
            [
                'id' => 'modoLeitura',
                'type' => 'select',
                'options' => [
                    'prazo',
                    'ritmo',
                ],
            ],
            [
                'id' => 'diasPrazo',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
            ],
            [
                'id' => 'paginasPorDia',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
            ],
        ],
    ],
    'paint-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'paintCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-tinta',
            'en' => 'paint-calculator',
            'es' => 'calculadora-de-pintura',
        ],
        'fields' => [
            [
                'id' => 'areaPintar',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'demaos',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '2',
            ],
            [
                'id' => 'tipoTinta',
                'type' => 'select',
                'options' => [
                    'latex',
                    'acrilica',
                    'esmalte',
                ],
            ],
        ],
    ],
    'flooring-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'flooringCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-piso',
            'en' => 'flooring-calculator',
            'es' => 'calculadora-de-piso',
        ],
        'fields' => [
            [
                'id' => 'areaAmbiente',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'areaPorCaixa',
                'type' => 'number',
                'step' => '0.01',
                'min' => '0.01',
            ],
            [
                'id' => 'percPerdaPiso',
                'type' => 'number',
                'step' => '1',
                'min' => '0',
                'value' => '10',
            ],
        ],
    ],
    'mortar-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'mortarCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-argamassa',
            'en' => 'mortar-calculator',
            'es' => 'calculadora-de-mortero',
        ],
        'fields' => [
            [
                'id' => 'areaArgamassa',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'espessuraCm',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '2',
            ],
            [
                'id' => 'consumoKgM2Cm',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '17',
            ],
            [
                'id' => 'pesoSaco',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '20',
            ],
        ],
    ],
    'brick-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'brickCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-tijolos',
            'en' => 'brick-calculator',
            'es' => 'calculadora-de-ladrillos',
        ],
        'fields' => [
            [
                'id' => 'comprimentoTijolo',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '19',
            ],
            [
                'id' => 'alturaTijolo',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '9',
            ],
            [
                'id' => 'areaParedeTijolo',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'percPerdaTijolo',
                'type' => 'number',
                'step' => '1',
                'min' => '0',
                'value' => '10',
            ],
        ],
    ],
    'concrete-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'concreteCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-traco-de-concreto',
            'en' => 'concrete-mix-calculator',
            'es' => 'calculadora-de-mezcla-de-concreto',
        ],
        'fields' => [
            [
                'id' => 'volumeConcreto',
                'type' => 'number',
                'step' => '0.01',
                'min' => '0.01',
            ],
            [
                'id' => 'tracoCimento',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '1',
            ],
            [
                'id' => 'tracoAreia',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '2',
            ],
            [
                'id' => 'tracoBrita',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '3',
            ],
        ],
    ],
    'wallpaper-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'wallpaperCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-papel-de-parede',
            'en' => 'wallpaper-calculator',
            'es' => 'calculadora-de-papel-tapiz',
        ],
        'fields' => [
            [
                'id' => 'areaParedeWp',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'larguraRolo',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '53',
            ],
            [
                'id' => 'comprimentoRolo',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '10',
            ],
            [
                'id' => 'percPerdaWp',
                'type' => 'number',
                'step' => '1',
                'min' => '0',
                'value' => '15',
            ],
        ],
    ],
    'grass-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'grassCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-grama',
            'en' => 'grass-calculator',
            'es' => 'calculadora-de-cesped',
        ],
        'fields' => [
            [
                'id' => 'areaGramado',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'precoM2Grama',
                'type' => 'number',
                'step' => '0.01',
                'min' => '0',
            ],
        ],
    ],
    'grout-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'groutCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-rejunte',
            'en' => 'grout-calculator',
            'es' => 'calculadora-de-lechada',
        ],
        'fields' => [
            [
                'id' => 'areaRejunte',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'comprimentoPeca',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '60',
            ],
            [
                'id' => 'larguraPeca',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '60',
            ],
            [
                'id' => 'espessuraPeca',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '8',
            ],
            [
                'id' => 'larguraJunta',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
                'value' => '3',
            ],
        ],
    ],
    'stair-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'stairCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-escada',
            'en' => 'stair-calculator',
            'es' => 'calculadora-de-escalera',
        ],
        'fields' => [
            [
                'id' => 'alturaVencer',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
            ],
        ],
    ],
    'roof-tile-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'roofTileCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-telhas',
            'en' => 'roof-tile-calculator',
            'es' => 'calculadora-de-tejas',
        ],
        'fields' => [
            [
                'id' => 'areaCasaTelha',
                'type' => 'number',
                'step' => '0.1',
                'min' => '0.1',
            ],
            [
                'id' => 'fatorInclinacao',
                'type' => 'number',
                'step' => '0.01',
                'min' => '1',
                'value' => '1.15',
            ],
            [
                'id' => 'tipoTelha',
                'type' => 'select',
                'options' => [
                    'ceramica',
                    'concreto',
                ],
            ],
        ],
    ],
    'water-tank-calculator' => [
        'category' => 'construction',
        'multilingual' => true,
        'jsKey' => 'waterTankCalculator',
        'slugs' => [
            'pt' => 'calculadora-de-caixa-dagua',
            'en' => 'water-tank-calculator',
            'es' => 'calculadora-de-tanque-de-agua',
        ],
        'fields' => [
            [
                'id' => 'numMoradores',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
            ],
            [
                'id' => 'consumoPorPessoa',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '150',
            ],
            [
                'id' => 'diasReserva',
                'type' => 'number',
                'step' => '1',
                'min' => '1',
                'value' => '1',
            ],
        ],
    ],


    // ============================================================ SALÁRIO LÍQUIDO E CARREIRA (-> personal-finance)
    'net-salary-calculator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'netSalaryCalculator',
        'slugs' => ['pt' => 'calculadora-de-salario-liquido', 'en' => 'net-salary-calculator', 'es' => 'calculadora-de-salario-neto'],
        'fields' => [
            ['id' => 'grossSalary', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
        ],
    ],

    'salary-adjustment-simulator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'salaryAdjustmentSimulator',
        'slugs' => ['pt' => 'simulador-de-reajuste-salarial', 'en' => 'salary-adjustment-simulator', 'es' => 'simulador-de-aumento-salarial'],
        'fields' => [
            ['id' => 'currentSalary', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'adjustmentPercent', 'type' => 'number', 'step' => '0.01'],
            ['id' => 'newSalaryInput', 'type' => 'number', 'step' => '0.01'],
            ['id' => 'inflationIndex', 'type' => 'number', 'step' => '0.01'],
        ],
    ],

    'job-offer-comparator' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'jobOfferComparator',
        'slugs' => ['pt' => 'comparador-de-propostas-de-emprego', 'en' => 'job-offer-comparator', 'es' => 'comparador-de-ofertas-de-empleo'],
        'fields' => [
            ['id' => 'offerASalary', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'offerAVr', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'offerAHealth', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'offerBSalary', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'offerBVr', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'offerBHealth', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    'clt-hourly-rate' => [
        'category' => 'personal-finance', 'multilingual' => true, 'jsKey' => 'cltHourlyRateCalculator',
        'slugs' => ['pt' => 'calculadora-de-valor-da-hora-clt', 'en' => 'clt-hourly-rate-calculator', 'es' => 'calculadora-de-valor-de-la-hora-clt'],
        'fields' => [
            ['id' => 'monthlySalaryClt', 'type' => 'number', 'step' => '0.01', 'min' => '1'],
            ['id' => 'weeklyHoursClt', 'type' => 'number', 'step' => '0.5', 'min' => '1', 'max' => '44', 'value' => '44'],
        ],
    ],

    // ============================================================ PETS (nova categoria)
    'dog-age-calculator' => [
        'category' => 'pets', 'multilingual' => true, 'jsKey' => 'dogAgeCalculator',
        'slugs' => ['pt' => 'idade-do-cachorro-em-anos-humanos', 'en' => 'dog-age-calculator', 'es' => 'edad-del-perro-en-anos-humanos'],
        'fields' => [
            ['id' => 'dogAgeYears', 'type' => 'number', 'step' => '0.1', 'min' => '0.1'],
        ],
    ],

    'cat-age-calculator' => [
        'category' => 'pets', 'multilingual' => true, 'jsKey' => 'catAgeCalculator',
        'slugs' => ['pt' => 'idade-do-gato-em-anos-humanos', 'en' => 'cat-age-calculator', 'es' => 'edad-del-gato-en-anos-humanos'],
        'fields' => [
            ['id' => 'catAgeYears', 'type' => 'number', 'step' => '0.1', 'min' => '0.1'],
        ],
    ],

    'dog-ideal-weight' => [
        'category' => 'pets', 'multilingual' => true, 'jsKey' => 'dogIdealWeightCalculator',
        'slugs' => ['pt' => 'peso-ideal-do-cachorro', 'en' => 'dog-ideal-weight-calculator', 'es' => 'peso-ideal-del-perro'],
        'fields' => [
            ['id' => 'dogSize', 'type' => 'select', 'options' => ['small', 'medium', 'large', 'giant']],
            ['id' => 'currentDogWeight', 'type' => 'number', 'step' => '0.1', 'min' => '0.1'],
        ],
    ],

    'dog-food-calculator' => [
        'category' => 'pets', 'multilingual' => true, 'jsKey' => 'dogFoodCalculator',
        'slugs' => ['pt' => 'calculadora-de-racao-diaria', 'en' => 'dog-food-calculator', 'es' => 'calculadora-de-alimento-diario-para-perros'],
        'fields' => [
            ['id' => 'dogWeightFood', 'type' => 'number', 'step' => '0.1', 'min' => '0.5'],
            ['id' => 'dogActivity', 'type' => 'select', 'options' => ['low', 'moderate', 'high']],
        ],
    ],

    // ============================================================ ODDS E PROBABILIDADE (-> calculators)
    'odds-converter' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'oddsConverter',
        'slugs' => ['pt' => 'conversor-de-odds', 'en' => 'odds-converter', 'es' => 'conversor-de-cuotas'],
        'fields' => [
            ['id' => 'oddsInput', 'type' => 'text'],
            ['id' => 'oddsFormat', 'type' => 'select', 'options' => ['decimal', 'fractional', 'american']],
        ],
    ],

    'implied-probability' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'impliedProbabilityCalculator',
        'slugs' => ['pt' => 'probabilidade-implicita', 'en' => 'implied-probability-calculator', 'es' => 'probabilidad-implicita'],
        'fields' => [
            ['id' => 'decimalOddsProb', 'type' => 'number', 'step' => '0.01', 'min' => '1.01'],
            ['id' => 'probabilityPercent', 'type' => 'number', 'step' => '0.01', 'min' => '0.01', 'max' => '100'],
        ],
    ],

    'parlay-odds-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'parlayOddsCalculator',
        'special' => 'analyze',
        'slugs' => ['pt' => 'calculadora-de-aposta-combinada', 'en' => 'parlay-odds-calculator', 'es' => 'calculadora-de-apuesta-combinada'],
        'fields' => [],
    ],

    'bet-ev-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'betEvCalculator',
        'slugs' => ['pt' => 'calculadora-de-valor-esperado-ev', 'en' => 'bet-ev-calculator', 'es' => 'calculadora-de-valor-esperado-ev'],
        'fields' => [
            ['id' => 'decimalOddsEv', 'type' => 'number', 'step' => '0.01', 'min' => '1.01'],
            ['id' => 'estimatedProbability', 'type' => 'number', 'step' => '0.01', 'min' => '0.01', 'max' => '100'],
            ['id' => 'stakeAmount', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
        ],
    ],

    // ============================================================ MARKETING DIGITAL (-> calculators)
    'marketing-roi-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'marketingRoiCalculator',
        'slugs' => ['pt' => 'calculadora-de-roi-de-marketing', 'en' => 'marketing-roi-calculator', 'es' => 'calculadora-de-roi-de-marketing'],
        'fields' => [
            ['id' => 'mktInvestment', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'mktRevenue', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    'cac-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'cacCalculator',
        'slugs' => ['pt' => 'calculadora-de-cac', 'en' => 'cac-calculator', 'es' => 'calculadora-de-cac'],
        'fields' => [
            ['id' => 'cacSpend', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'cacCustomers', 'type' => 'number', 'step' => '1', 'min' => '1'],
        ],
    ],

    'ltv-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'ltvCalculator',
        'slugs' => ['pt' => 'calculadora-de-ltv', 'en' => 'ltv-calculator', 'es' => 'calculadora-de-ltv'],
        'fields' => [
            ['id' => 'ltvTicket', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'ltvFrequency', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'ltvRetention', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'ltvCacInput', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],

    'cpm-cpc-ctr-calculator' => [
        'category' => 'calculators', 'multilingual' => true, 'jsKey' => 'cpmCpcCtrCalculator',
        'slugs' => ['pt' => 'calculadora-de-cpm-cpc-e-ctr', 'en' => 'cpm-cpc-ctr-calculator', 'es' => 'calculadora-de-cpm-cpc-y-ctr'],
        'fields' => [
            ['id' => 'adSpendCpm', 'type' => 'number', 'step' => '0.01', 'min' => '0.01'],
            ['id' => 'adImpressions', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'adClicks', 'type' => 'number', 'step' => '1', 'min' => '0'],
        ],
    ],

    // ============================================================ SEGURANÇA (-> generators)
    'password-crack-time-estimator' => [
        'category' => 'generators', 'multilingual' => true, 'jsKey' => 'passwordCrackTimeEstimator',
        'slugs' => ['pt' => 'tempo-para-quebrar-senha', 'en' => 'password-crack-time-estimator', 'es' => 'tiempo-para-descifrar-contrasena'],
        'fields' => [
            ['id' => 'crackPwdLength', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '128', 'value' => '12'],
            ['id' => 'crackCharset', 'type' => 'select', 'options' => ['numeric', 'lower', 'loweUpper', 'alnum', 'alnumSymbols']],
            ['id' => 'crackAttemptsPerSec', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '1000000000'],
        ],
    ],

    'pin-generator' => [
        'category' => 'generators', 'multilingual' => true, 'jsKey' => 'pinGenerator',
        'special' => 'generator',
        'slugs' => ['pt' => 'gerador-de-pin', 'en' => 'pin-generator', 'es' => 'generador-de-pin'],
        'fields' => [
            ['id' => 'pinLength', 'type' => 'range', 'min' => '4', 'max' => '8', 'value' => '4'],
            ['id' => 'pinQuantity', 'type' => 'number', 'step' => '1', 'min' => '1', 'max' => '50', 'value' => '1'],
        ],
    ],

    'password-strength-checker' => [
        'category' => 'generators', 'multilingual' => true, 'jsKey' => 'passwordStrengthChecker',
        'slugs' => ['pt' => 'verificador-de-forca-de-senha', 'en' => 'password-strength-checker', 'es' => 'verificador-de-fortaleza-de-contrasena'],
        'fields' => [
            ['id' => 'pwdInput', 'type' => 'text'],
        ],
    ],

    // ============================================================ ASTRONOMIA E CURIOSIDADES (-> everyday)
    'age-on-other-planets' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'ageOnOtherPlanets',
        'slugs' => ['pt' => 'idade-em-outros-planetas', 'en' => 'age-on-other-planets', 'es' => 'edad-en-otros-planetas'],
        'fields' => [
            ['id' => 'planetBirthDate', 'type' => 'date'],
        ],
    ],

    'weight-on-other-planets' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'weightOnOtherPlanets',
        'slugs' => ['pt' => 'peso-em-outros-planetas', 'en' => 'weight-on-other-planets', 'es' => 'peso-en-otros-planetas'],
        'fields' => [
            ['id' => 'earthWeightPlanets', 'type' => 'number', 'step' => '0.1', 'min' => '0.1'],
        ],
    ],

    'moon-phase-calculator' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'moonPhaseCalculator',
        'slugs' => ['pt' => 'fase-da-lua', 'en' => 'moon-phase-calculator', 'es' => 'fase-de-la-luna'],
        'fields' => [
            ['id' => 'moonDate', 'type' => 'date'],
        ],
    ],

    // ============================================================ FERIADOS E CALENDÁRIO
    'feriados-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'holidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-2025'],
        'fields' => [],
    ],
    'feriados-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'holidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-2026'],
        'fields' => [],
    ],
    'feriados-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'holidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-2027'],
        'fields' => [],
    ],
    'feriados-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'holidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-2028'],
        'fields' => [],
    ],
    'feriados-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'holidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-2029'],
        'fields' => [],
    ],
    'feriados-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'holidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-2030'],
        'fields' => [],
    ],
    'holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'holidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-do-brasil', 'en' => 'brazil-holiday-calculator', 'es' => 'calculadora-de-feriados-de-brasil'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['feriados-2025', 'feriados-2026', 'feriados-2027', 'feriados-2028', 'feriados-2029', 'feriados-2030'],
    ],

    // ---- US / UK holidays (en) and Mexico / Spain holidays (es) ----
    'us-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'usHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'us-federal-holidays-2025'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'us-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'usHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'us-federal-holidays-2026'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'us-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'usHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'us-federal-holidays-2027'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'us-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'usHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'us-federal-holidays-2028'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'us-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'usHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'us-federal-holidays-2029'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'us-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'usHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'us-federal-holidays-2030'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'uk-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'ukHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'uk-bank-holidays-2025'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'uk-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'ukHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'uk-bank-holidays-2026'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'uk-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'ukHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'uk-bank-holidays-2027'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'uk-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'ukHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'uk-bank-holidays-2028'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'uk-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'ukHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'uk-bank-holidays-2029'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'uk-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'ukHolidayYearPage', 'special' => 'article',
        'slugs' => ['en' => 'uk-bank-holidays-2030'],
        'fields' => [],
        'onlyLang' => 'en',
    ],

    'mx-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mxHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-feriados-oficiales-mexico-2025'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'mx-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mxHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-feriados-oficiales-mexico-2026'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'mx-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mxHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-feriados-oficiales-mexico-2027'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'mx-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mxHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-feriados-oficiales-mexico-2028'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'mx-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mxHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-feriados-oficiales-mexico-2029'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'mx-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mxHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-feriados-oficiales-mexico-2030'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'es-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'esHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-festivos-nacionales-espana-2025'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'es-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'esHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-festivos-nacionales-espana-2026'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'es-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'esHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-festivos-nacionales-espana-2027'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'es-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'esHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-festivos-nacionales-espana-2028'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'es-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'esHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-festivos-nacionales-espana-2029'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'es-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'esHolidayYearPage', 'special' => 'article',
        'slugs' => ['es' => 'dias-festivos-nacionales-espana-2030'],
        'fields' => [],
        'onlyLang' => 'es',
    ],

    'us-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'usHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-dos-estados-unidos', 'en' => 'us-holiday-calculator', 'es' => 'calculadora-de-dias-feriados-de-estados-unidos'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['us-holidays-2025', 'us-holidays-2026', 'us-holidays-2027', 'us-holidays-2028', 'us-holidays-2029', 'us-holidays-2030'],
    ],
    'uk-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'ukHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-do-reino-unido', 'en' => 'uk-bank-holiday-calculator', 'es' => 'calculadora-de-dias-festivos-del-reino-unido'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['uk-holidays-2025', 'uk-holidays-2026', 'uk-holidays-2027', 'uk-holidays-2028', 'uk-holidays-2029', 'uk-holidays-2030'],
    ],
    'mexico-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'mexicoHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-do-mexico', 'en' => 'mexico-holiday-calculator', 'es' => 'calculadora-de-dias-feriados-de-mexico'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['mx-holidays-2025', 'mx-holidays-2026', 'mx-holidays-2027', 'mx-holidays-2028', 'mx-holidays-2029', 'mx-holidays-2030'],
    ],
    'spain-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'spainHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-da-espanha', 'en' => 'spain-holiday-calculator', 'es' => 'calculadora-de-dias-festivos-de-espana'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['es-holidays-2025', 'es-holidays-2026', 'es-holidays-2027', 'es-holidays-2028', 'es-holidays-2029', 'es-holidays-2030'],
    ],

    'ao-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'angolaHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-angola-2025'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'ao-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'angolaHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-angola-2026'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'ao-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'angolaHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-angola-2027'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'ao-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'angolaHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-angola-2028'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'ao-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'angolaHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-angola-2029'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'ao-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'angolaHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-angola-2030'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'mz-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mozambiqueHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-mocambique-2025'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'mz-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mozambiqueHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-mocambique-2026'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'mz-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mozambiqueHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-mocambique-2027'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'mz-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mozambiqueHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-mocambique-2028'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'mz-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mozambiqueHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-mocambique-2029'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'mz-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'mozambiqueHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-mocambique-2030'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'cv-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'caboVerdeHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-cabo-verde-2025'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'cv-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'caboVerdeHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-cabo-verde-2026'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'cv-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'caboVerdeHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-cabo-verde-2027'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'cv-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'caboVerdeHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-cabo-verde-2028'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'cv-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'caboVerdeHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-cabo-verde-2029'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'cv-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'caboVerdeHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-cabo-verde-2030'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'tl-holidays-2025' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'timorLesteHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-timor-leste-2025'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'tl-holidays-2026' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'timorLesteHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-timor-leste-2026'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'tl-holidays-2027' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'timorLesteHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-timor-leste-2027'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'tl-holidays-2028' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'timorLesteHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-timor-leste-2028'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'tl-holidays-2029' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'timorLesteHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-timor-leste-2029'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'tl-holidays-2030' => [
        'hideFromIndex' => true,
        'category' => 'holidays', 'multilingual' => false, 'jsKey' => 'timorLesteHolidayYearPage', 'special' => 'article',
        'slugs' => ['pt' => 'feriados-nacionais-de-timor-leste-2030'],
        'fields' => [],
        'onlyLang' => 'pt',
    ],
    'angola-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'angolaHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-de-angola', 'en' => 'angola-holiday-calculator', 'es' => 'calculadora-de-dias-feriados-de-angola'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['ao-holidays-2025', 'ao-holidays-2026', 'ao-holidays-2027', 'ao-holidays-2028', 'ao-holidays-2029', 'ao-holidays-2030'],
    ],
    'mozambique-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'mozambiqueHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-de-mocambique', 'en' => 'mozambique-holiday-calculator', 'es' => 'calculadora-de-dias-feriados-de-mozambique'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['mz-holidays-2025', 'mz-holidays-2026', 'mz-holidays-2027', 'mz-holidays-2028', 'mz-holidays-2029', 'mz-holidays-2030'],
    ],
    'cabo-verde-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'caboVerdeHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-de-cabo-verde', 'en' => 'cape-verde-holiday-calculator', 'es' => 'calculadora-de-dias-feriados-de-cabo-verde'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['cv-holidays-2025', 'cv-holidays-2026', 'cv-holidays-2027', 'cv-holidays-2028', 'cv-holidays-2029', 'cv-holidays-2030'],
    ],
    'timor-leste-holiday-checker' => [
        'category' => 'holidays', 'multilingual' => true, 'jsKey' => 'timorLesteHolidayChecker', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-feriados-de-timor-leste', 'en' => 'timor-leste-holiday-calculator', 'es' => 'calculadora-de-dias-feriados-de-timor-leste'],
        'fields' => [
            ['id' => 'holidayYear', 'type' => 'number', 'step' => '1', 'min' => '1900', 'max' => '2200', 'value' => '2026'],
        ],
        'yearPages' => ['tl-holidays-2025', 'tl-holidays-2026', 'tl-holidays-2027', 'tl-holidays-2028', 'tl-holidays-2029', 'tl-holidays-2030'],
    ],

    // ============================================================ AMIGO SECRETO (-> everyday)
    'secret-santa' => [
        'category' => 'everyday', 'multilingual' => true, 'jsKey' => 'secretSanta', 'special' => 'secretsanta',
        'slugs' => ['pt' => 'sorteio-de-amigo-secreto', 'en' => 'secret-santa-generator', 'es' => 'sorteo-de-amigo-invisible'],
        'fields' => [
            ['id' => 'secretSantaNames', 'type' => 'textarea'],
        ],
    ],

    // ============================================================ MODA E VESTUÁRIO
    'clothing-size-converter' => [
        'category' => 'fashion', 'multilingual' => true, 'jsKey' => 'clothingSizeConverter', 'special' => 'generator',
        'slugs' => ['pt' => 'conversor-de-tamanho-de-roupa', 'en' => 'clothing-size-converter', 'es' => 'conversor-de-talla-de-ropa'],
        'fields' => [
            ['id' => 'sizeGender', 'type' => 'select', 'options' => ['women', 'men']],
            ['id' => 'sizeBR', 'type' => 'number', 'step' => '2', 'min' => '34', 'max' => '52', 'value' => '40'],
        ],
    ],
    'shoe-size-converter' => [
        'category' => 'fashion', 'multilingual' => true, 'jsKey' => 'shoeSizeConverter', 'special' => 'generator',
        'slugs' => ['pt' => 'conversor-de-tamanho-de-calcado', 'en' => 'shoe-size-converter', 'es' => 'conversor-de-talla-de-calzado'],
        'fields' => [
            ['id' => 'shoeCategory', 'type' => 'select', 'options' => ['women', 'men', 'kids']],
            ['id' => 'shoeBR', 'type' => 'number', 'step' => '0.5', 'min' => '16', 'max' => '45', 'value' => '38'],
        ],
    ],
    'ring-size-calculator' => [
        'category' => 'fashion', 'multilingual' => true, 'jsKey' => 'ringSizeCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-tamanho-de-anel', 'en' => 'ring-size-calculator', 'es' => 'calculadora-de-talla-de-anillo'],
        'fields' => [
            ['id' => 'ringDiameter', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
            ['id' => 'ringCircumference', 'type' => 'number', 'step' => '0.1', 'min' => '1'],
        ],
    ],
    'bra-size-calculator' => [
        'category' => 'fashion', 'multilingual' => true, 'jsKey' => 'braSizeCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-tamanho-de-sutia', 'en' => 'bra-size-calculator', 'es' => 'calculadora-de-talla-de-sujetador'],
        'fields' => [
            ['id' => 'bustCm', 'type' => 'number', 'step' => '0.5', 'min' => '1'],
            ['id' => 'underbustCm', 'type' => 'number', 'step' => '0.5', 'min' => '1'],
        ],
    ],

    // ============================================================ VIAGEM
    'travel-budget-calculator' => [
        'category' => 'travel', 'multilingual' => true, 'jsKey' => 'travelBudgetCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-orcamento-de-viagem', 'en' => 'travel-budget-calculator', 'es' => 'calculadora-de-presupuesto-de-viaje'],
        'fields' => [
            ['id' => 'tripDays', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'dailyLodging', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'dailyFood', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'dailyLocalTransport', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'flightCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'extrasCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'numPeople', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '1'],
        ],
    ],
    'miles-value-calculator' => [
        'category' => 'travel', 'multilingual' => true, 'jsKey' => 'milesValueCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-valor-de-milhas', 'en' => 'miles-points-value-calculator', 'es' => 'calculadora-de-valor-de-millas'],
        'fields' => [
            ['id' => 'milesQty', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'amountPaid', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'flightMilesNeeded', 'type' => 'number', 'step' => '1', 'min' => '0'],
            ['id' => 'flightCashPrice', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'flightTaxes', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'trip-group-split' => [
        'category' => 'travel', 'multilingual' => true, 'jsKey' => 'tripGroupSplit', 'special' => 'generator',
        'slugs' => ['pt' => 'divisor-de-custo-de-viagem-em-grupo', 'en' => 'group-trip-cost-splitter', 'es' => 'divisor-de-costo-de-viaje-en-grupo'],
        'fields' => [
            ['id' => 'tripExpenses', 'type' => 'textarea'],
            ['id' => 'tripPeopleCount', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'tripPayments', 'type' => 'textarea'],
        ],
    ],

    // ============================================================ CASAMENTO E EVENTOS
    'wedding-budget-calculator' => [
        'category' => 'events', 'multilingual' => true, 'jsKey' => 'weddingBudgetCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-orcamento-de-casamento', 'en' => 'wedding-budget-calculator', 'es' => 'calculadora-de-presupuesto-de-boda'],
        'fields' => [
            ['id' => 'guestCount', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'perGuestCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'decorCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'photoCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'musicCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'attireCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'ceremonyCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'favorsCost', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
            ['id' => 'extrasCost2', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'event-food-drink-calculator' => [
        'category' => 'events', 'multilingual' => true, 'jsKey' => 'eventFoodDrinkCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-comida-e-bebida-para-evento', 'en' => 'event-food-and-drink-calculator', 'es' => 'calculadora-de-comida-y-bebida-para-eventos'],
        'fields' => [
            ['id' => 'eventGuests', 'type' => 'number', 'step' => '1', 'min' => '1'],
            ['id' => 'eventHours', 'type' => 'number', 'step' => '0.5', 'min' => '1'],
            ['id' => 'alcoholService', 'type' => 'checkbox'],
        ],
    ],
    'wedding-anniversary-calculator' => [
        'category' => 'events', 'multilingual' => false, 'jsKey' => 'weddingAnniversaryCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-bodas'],
        'fields' => [
            ['id' => 'weddingDate', 'type' => 'date'],
        ],
    ],

    // ============================================================ SALÁRIO MÍNIMO (Brasil, PT-only, por ano)
    'salario-minimo-2020' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'salario-minimo-2020'], 'fields' => [],
    ],
    'salario-minimo-2021' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'salario-minimo-2021'], 'fields' => [],
    ],
    'salario-minimo-2022' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'salario-minimo-2022'], 'fields' => [],
    ],
    'salario-minimo-2023' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'salario-minimo-2023'], 'fields' => [],
    ],
    'salario-minimo-2024' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'salario-minimo-2024'], 'fields' => [],
    ],
    'salario-minimo-2025' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'salario-minimo-2025'], 'fields' => [],
    ],
    'salario-minimo-2026' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'salario-minimo-2026'], 'fields' => [],
    ],
    'min-wage-multiple-calculator' => [
        'category' => 'minimum-wage', 'multilingual' => false, 'jsKey' => 'minWageMultipleCalculator', 'special' => 'generator',
        'slugs' => ['pt' => 'calculadora-de-salarios-minimos-em-reais'],
        'fields' => [
            ['id' => 'minWageMultiple', 'type' => 'number', 'step' => '0.01', 'min' => '0.01', 'value' => '1'],
            ['id' => 'minWageYear', 'type' => 'select', 'options' => ['2020', '2021', '2022', '2023', '2024', '2025', '2026'], 'value' => '2026'],
        ],
    ],

    // ---- Salário mínimo de outros países de língua portuguesa (PT/EN/ES) ----
    // Página única por país (NÃO por ano) — atualizada manualmente 1x/ano quando o valor oficial muda.
    // Ver README.md para a nota de manutenção de como atualizar o valor.
    'minimum-wage-angola' => [
        'category' => 'minimum-wage', 'multilingual' => true, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'angola', 'en' => 'angola', 'es' => 'angola'], 'fields' => [],
    ],
    'minimum-wage-mozambique' => [
        'category' => 'minimum-wage', 'multilingual' => true, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'mocambique', 'en' => 'mozambique', 'es' => 'mozambique'], 'fields' => [],
    ],
    'minimum-wage-cape-verde' => [
        'category' => 'minimum-wage', 'multilingual' => true, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'cabo-verde', 'en' => 'cape-verde', 'es' => 'cabo-verde'], 'fields' => [],
    ],
    'minimum-wage-timor-leste' => [
        'category' => 'minimum-wage', 'multilingual' => true, 'jsKey' => 'minWageArticle', 'special' => 'article',
        'slugs' => ['pt' => 'timor-leste', 'en' => 'timor-leste', 'es' => 'timor-oriental'], 'fields' => [],
    ],

    // ============================================================ LEGIBILIDADE E LINGUAGEM
    'readability-index' => [
        'category' => 'readability', 'multilingual' => true, 'jsKey' => 'readabilityIndex', 'special' => 'analyze',
        'slugs' => ['pt' => 'indice-de-legibilidade', 'en' => 'readability-index', 'es' => 'indice-de-legibilidad'],
        'fields' => [],
    ],
    'speaking-time-calculator' => [
        'category' => 'readability', 'multilingual' => true, 'jsKey' => 'speakingTimeCalculator',
        'slugs' => ['pt' => 'calculadora-de-tempo-de-fala', 'en' => 'speaking-time-calculator', 'es' => 'calculadora-de-tiempo-de-habla'],
        'fields' => [
            ['id' => 'speakingText', 'type' => 'textarea'],
            ['id' => 'speakingPace', 'type' => 'select', 'options' => ['slow', 'normal', 'fast'], 'value' => 'normal'],
        ],
    ],
    'typing-speed-test' => [
        'category' => 'readability', 'multilingual' => true, 'jsKey' => 'typingSpeedTest', 'special' => 'typingtest',
        'slugs' => ['pt' => 'teste-de-velocidade-de-digitacao', 'en' => 'typing-speed-test', 'es' => 'test-de-velocidad-de-mecanografia'],
        'fields' => [],
    ],
    'social-character-counter' => [
        'category' => 'readability', 'multilingual' => true, 'jsKey' => 'socialCharCounter', 'special' => 'analyze',
        'slugs' => ['pt' => 'contador-de-caracteres-para-redes-sociais', 'en' => 'social-media-character-counter', 'es' => 'contador-de-caracteres-para-redes-sociales'],
        'fields' => [],
    ],

    // ============================================================ FOTOGRAFIA
    'depth-of-field-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'depthOfFieldCalculator',
        'slugs' => ['pt' => 'calculadora-de-profundidade-de-campo', 'en' => 'depth-of-field-calculator', 'es' => 'calculadora-de-profundidad-de-campo'],
        'fields' => [
            ['id' => 'dofFocalLength', 'type' => 'number', 'step' => '0.1', 'min' => '1', 'value' => '50'],
            ['id' => 'dofAperture', 'type' => 'number', 'step' => '0.1', 'min' => '0.5', 'value' => '8'],
            ['id' => 'dofDistance', 'type' => 'number', 'step' => '0.01', 'min' => '0.01', 'value' => '5'],
            ['id' => 'dofSensor', 'type' => 'select', 'options' => ['fullFrame', 'apscCanon', 'apscNikonSony', 'mft', 'oneInch', 'smartphone'], 'value' => 'fullFrame'],
        ],
    ],
    'hyperfocal-distance-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'hyperfocalDistanceCalculator',
        'slugs' => ['pt' => 'calculadora-de-distancia-hiperfocal', 'en' => 'hyperfocal-distance-calculator', 'es' => 'calculadora-de-distancia-hiperfocal'],
        'fields' => [
            ['id' => 'hyperFocalLength', 'type' => 'number', 'step' => '0.1', 'min' => '1', 'value' => '50'],
            ['id' => 'hyperAperture', 'type' => 'number', 'step' => '0.1', 'min' => '0.5', 'value' => '8'],
            ['id' => 'hyperSensor', 'type' => 'select', 'options' => ['fullFrame', 'apscCanon', 'apscNikonSony', 'mft', 'oneInch', 'smartphone'], 'value' => 'fullFrame'],
        ],
    ],
    'field-of-view-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'fieldOfViewCalculator',
        'slugs' => ['pt' => 'calculadora-de-angulo-de-visao', 'en' => 'field-of-view-calculator', 'es' => 'calculadora-de-angulo-de-vision'],
        'fields' => [
            ['id' => 'fovFocalLength', 'type' => 'number', 'step' => '0.1', 'min' => '1', 'value' => '50'],
            ['id' => 'fovSensor', 'type' => 'select', 'options' => ['fullFrame', 'apscCanon', 'apscNikonSony', 'mft', 'oneInch', 'smartphone'], 'value' => 'fullFrame'],
            ['id' => 'fovDistance', 'type' => 'number', 'step' => '0.01', 'min' => '0'],
        ],
    ],
    'crop-factor-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'cropFactorCalculator',
        'slugs' => ['pt' => 'calculadora-de-fator-de-corte', 'en' => 'crop-factor-calculator', 'es' => 'calculadora-de-factor-de-recorte'],
        'fields' => [
            ['id' => 'cropSensor', 'type' => 'select', 'options' => ['fullFrame', 'apscCanon', 'apscNikonSony', 'mft', 'oneInch', 'smartphone'], 'value' => 'apscCanon'],
            ['id' => 'cropFocalLength', 'type' => 'number', 'step' => '0.1', 'min' => '1', 'value' => '50'],
            ['id' => 'cropAperture', 'type' => 'number', 'step' => '0.1', 'min' => '0'],
        ],
    ],
    'flash-guide-number-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'flashGuideNumberCalculator',
        'slugs' => ['pt' => 'calculadora-de-numero-guia-do-flash', 'en' => 'flash-guide-number-calculator', 'es' => 'calculadora-de-numero-guia-del-flash'],
        'fields' => [
            ['id' => 'flashMode', 'type' => 'select', 'options' => ['findAperture', 'findDistance', 'findGuideNumber'], 'value' => 'findAperture'],
            ['id' => 'flashGuideNumber', 'type' => 'number', 'step' => '0.1', 'min' => '0', 'value' => '30'],
            ['id' => 'flashDistance', 'type' => 'number', 'step' => '0.1', 'min' => '0', 'value' => '5'],
            ['id' => 'flashAperture', 'type' => 'number', 'step' => '0.1', 'min' => '0', 'value' => '8'],
            ['id' => 'flashIso', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '100'],
        ],
    ],
    'nd-filter-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'ndFilterCalculator',
        'slugs' => ['pt' => 'calculadora-de-filtro-nd', 'en' => 'nd-filter-calculator', 'es' => 'calculadora-de-filtro-nd'],
        'fields' => [
            ['id' => 'ndShutterSpeed', 'type' => 'number', 'step' => '0.001', 'min' => '0.0001', 'value' => '0.008'],
            ['id' => 'ndFilterFactor', 'type' => 'select', 'options' => ['nd2', 'nd4', 'nd8', 'nd16', 'nd32', 'nd64', 'nd100', 'nd400', 'nd1000', 'nd32000'], 'value' => 'nd8'],
        ],
    ],
    'equivalent-exposure-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'equivalentExposureCalculator',
        'slugs' => ['pt' => 'calculadora-de-exposicao-equivalente', 'en' => 'equivalent-exposure-calculator', 'es' => 'calculadora-de-exposicion-equivalente'],
        'fields' => [
            ['id' => 'eqOriginalIso', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '100'],
            ['id' => 'eqOriginalAperture', 'type' => 'number', 'step' => '0.1', 'min' => '0.5', 'value' => '8'],
            ['id' => 'eqOriginalShutter', 'type' => 'number', 'step' => '0.001', 'min' => '0.0001', 'value' => '0.01'],
            ['id' => 'eqChangedField', 'type' => 'select', 'options' => ['newIso', 'newAperture', 'newShutter'], 'value' => 'newAperture'],
            ['id' => 'eqNewValue', 'type' => 'number', 'step' => '0.001', 'min' => '0', 'value' => '4'],
            ['id' => 'eqSolveField', 'type' => 'select', 'options' => ['iso', 'aperture', 'shutter'], 'value' => 'shutter'],
        ],
    ],
    'print-size-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'printSizeCalculator',
        'slugs' => ['pt' => 'calculadora-de-tamanho-de-impressao', 'en' => 'print-size-calculator', 'es' => 'calculadora-de-tamano-de-impresion'],
        'fields' => [
            ['id' => 'printMode', 'type' => 'select', 'options' => ['fromImage', 'fromPrint'], 'value' => 'fromImage'],
            ['id' => 'printImageWidth', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '6000'],
            ['id' => 'printImageHeight', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '4000'],
            ['id' => 'printWidthCm', 'type' => 'number', 'step' => '0.1', 'min' => '0.1', 'value' => '30'],
            ['id' => 'printHeightCm', 'type' => 'number', 'step' => '0.1', 'min' => '0.1', 'value' => '20'],
            ['id' => 'printDpi', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '300'],
        ],
    ],
    'astrophotography-exposure-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'astroExposureCalculator',
        'slugs' => ['pt' => 'calculadora-de-exposicao-para-astrofotografia', 'en' => 'astrophotography-exposure-calculator', 'es' => 'calculadora-de-exposicion-para-astrofotografia'],
        'fields' => [
            ['id' => 'astroRule', 'type' => 'select', 'options' => ['rule500', 'rule300', 'ruleNpf'], 'value' => 'rule500'],
            ['id' => 'astroFocalLength', 'type' => 'number', 'step' => '0.1', 'min' => '1', 'value' => '24'],
            ['id' => 'astroCropFactor', 'type' => 'number', 'step' => '0.01', 'min' => '0.1', 'value' => '1'],
            ['id' => 'astroAperture', 'type' => 'number', 'step' => '0.1', 'min' => '0.5', 'value' => '2.8'],
            ['id' => 'astroPixelPitch', 'type' => 'number', 'step' => '0.01', 'min' => '0.1', 'value' => '5.9'],
        ],
    ],
    'timelapse-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'timelapseCalculator',
        'slugs' => ['pt' => 'calculadora-de-intervalo-de-timelapse', 'en' => 'timelapse-calculator', 'es' => 'calculadora-de-intervalo-de-timelapse'],
        'fields' => [
            ['id' => 'tlMode', 'type' => 'select', 'options' => ['fromDuration', 'fromInterval'], 'value' => 'fromDuration'],
            ['id' => 'tlEventDuration', 'type' => 'number', 'step' => '0.1', 'min' => '0.01', 'value' => '2'],
            ['id' => 'tlEventUnit', 'type' => 'select', 'options' => ['seconds', 'minutes', 'hours'], 'value' => 'hours'],
            ['id' => 'tlVideoDuration', 'type' => 'number', 'step' => '0.1', 'min' => '0.1', 'value' => '10'],
            ['id' => 'tlFrameRate', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '24'],
            ['id' => 'tlShotInterval', 'type' => 'number', 'step' => '0.1', 'min' => '0.01', 'value' => '5'],
        ],
    ],
    'handheld-shutter-speed-calculator' => [
        'category' => 'photography', 'multilingual' => true, 'jsKey' => 'handheldShutterSpeedCalculator',
        'slugs' => ['pt' => 'calculadora-de-velocidade-de-obturador-a-mao-livre', 'en' => 'handheld-shutter-speed-calculator', 'es' => 'calculadora-de-velocidad-de-obturador-a-pulso'],
        'fields' => [
            ['id' => 'hsFocalLength', 'type' => 'number', 'step' => '0.1', 'min' => '1', 'value' => '50'],
            ['id' => 'hsCropFactor', 'type' => 'number', 'step' => '0.01', 'min' => '0.1', 'value' => '1'],
            ['id' => 'hsStabilization', 'type' => 'select', 'options' => ['0', '2', '3', '4', '5', '6'], 'value' => '0'],
        ],
    ],

    // ============================================================ VIAGEM (fase 2026-09-30: fuso, voo, estrada, distância)
    'jet-lag-calculator' => [
        'category' => 'travel', 'multilingual' => true, 'jsKey' => 'jetLagCalculator',
        'slugs' => ['pt' => 'calculadora-de-jet-lag', 'en' => 'jet-lag-calculator', 'es' => 'calculadora-de-jet-lag'],
        'fields' => [
            ['id' => 'jlOrigin', 'type' => 'select', 'options' => ['saoPaulo', 'rioDeJaneiro', 'brasilia', 'manaus', 'lisboa', 'madrid', 'paris', 'london', 'rome', 'berlin', 'moscow', 'istanbul', 'cairo', 'johannesburg', 'luanda', 'maputo', 'lagos', 'nairobi', 'praia', 'dubai', 'delhi', 'kathmandu', 'bangkok', 'singapore', 'hongKong', 'shanghai', 'tokyo', 'seoul', 'sydney', 'auckland', 'honolulu', 'losAngeles', 'chicago', 'newYork', 'toronto', 'mexicoCity', 'bogota', 'lima', 'santiago', 'buenosAires'], 'value' => 'saoPaulo'],
            ['id' => 'jlDestination', 'type' => 'select', 'options' => ['saoPaulo', 'rioDeJaneiro', 'brasilia', 'manaus', 'lisboa', 'madrid', 'paris', 'london', 'rome', 'berlin', 'moscow', 'istanbul', 'cairo', 'johannesburg', 'luanda', 'maputo', 'lagos', 'nairobi', 'praia', 'dubai', 'delhi', 'kathmandu', 'bangkok', 'singapore', 'hongKong', 'shanghai', 'tokyo', 'seoul', 'sydney', 'auckland', 'honolulu', 'losAngeles', 'chicago', 'newYork', 'toronto', 'mexicoCity', 'bogota', 'lima', 'santiago', 'buenosAires'], 'value' => 'lisboa'],
            ['id' => 'jlDate', 'type' => 'date'],
        ],
    ],
    'flight-arrival-time-calculator' => [
        'category' => 'travel', 'multilingual' => true, 'jsKey' => 'flightArrivalCalculator',
        'slugs' => ['pt' => 'calculadora-de-horario-de-chegada-do-voo', 'en' => 'flight-arrival-time-calculator', 'es' => 'calculadora-de-hora-de-llegada-del-vuelo'],
        'fields' => [
            ['id' => 'faOrigin', 'type' => 'select', 'options' => ['saoPaulo', 'rioDeJaneiro', 'brasilia', 'manaus', 'lisboa', 'madrid', 'paris', 'london', 'rome', 'berlin', 'moscow', 'istanbul', 'cairo', 'johannesburg', 'luanda', 'maputo', 'lagos', 'nairobi', 'praia', 'dubai', 'delhi', 'kathmandu', 'bangkok', 'singapore', 'hongKong', 'shanghai', 'tokyo', 'seoul', 'sydney', 'auckland', 'honolulu', 'losAngeles', 'chicago', 'newYork', 'toronto', 'mexicoCity', 'bogota', 'lima', 'santiago', 'buenosAires'], 'value' => 'saoPaulo'],
            ['id' => 'faDestination', 'type' => 'select', 'options' => ['saoPaulo', 'rioDeJaneiro', 'brasilia', 'manaus', 'lisboa', 'madrid', 'paris', 'london', 'rome', 'berlin', 'moscow', 'istanbul', 'cairo', 'johannesburg', 'luanda', 'maputo', 'lagos', 'nairobi', 'praia', 'dubai', 'delhi', 'kathmandu', 'bangkok', 'singapore', 'hongKong', 'shanghai', 'tokyo', 'seoul', 'sydney', 'auckland', 'honolulu', 'losAngeles', 'chicago', 'newYork', 'toronto', 'mexicoCity', 'bogota', 'lima', 'santiago', 'buenosAires'], 'value' => 'lisboa'],
            ['id' => 'faDate', 'type' => 'date'],
            ['id' => 'faTime', 'type' => 'time', 'value' => '22:00'],
            ['id' => 'faHours', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '40', 'value' => '11'],
            ['id' => 'faMinutes', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '59', 'value' => '30'],
        ],
    ],
    'road-trip-calculator' => [
        'category' => 'travel', 'multilingual' => true, 'jsKey' => 'roadTripCalculator',
        'slugs' => ['pt' => 'calculadora-de-custo-de-viagem-de-carro', 'en' => 'road-trip-cost-calculator', 'es' => 'calculadora-de-costo-de-viaje-en-auto'],
        'fields' => [
            ['id' => 'rtDistance', 'type' => 'number', 'step' => 'any', 'min' => '0.1', 'value' => '500'],
            ['id' => 'rtDistanceUnit', 'type' => 'select', 'options' => ['km', 'mi'], 'value' => 'km'],
            ['id' => 'rtEfficiency', 'type' => 'number', 'step' => 'any', 'min' => '0.1', 'value' => '12'],
            ['id' => 'rtEfficiencyUnit', 'type' => 'select', 'options' => ['kmL', 'l100km', 'mpgUs', 'mpgUk'], 'value' => 'kmL'],
            ['id' => 'rtFuelPrice', 'type' => 'number', 'step' => 'any', 'min' => '0', 'value' => '6'],
            ['id' => 'rtPriceUnit', 'type' => 'select', 'options' => ['perLiter', 'perUsGal', 'perUkGal'], 'value' => 'perLiter'],
            ['id' => 'rtTolls', 'type' => 'number', 'step' => 'any', 'min' => '0', 'value' => '0'],
            ['id' => 'rtPeople', 'type' => 'number', 'step' => '1', 'min' => '1', 'value' => '1'],
            ['id' => 'rtSpeed', 'type' => 'number', 'step' => 'any', 'min' => '1', 'value' => '80'],
        ],
    ],
    'great-circle-distance-calculator' => [
        'category' => 'travel', 'multilingual' => true, 'jsKey' => 'greatCircleCalculator',
        'slugs' => ['pt' => 'calculadora-de-distancia-entre-cidades', 'en' => 'great-circle-distance-calculator', 'es' => 'calculadora-de-distancia-entre-ciudades'],
        'fields' => [
            ['id' => 'gcMode', 'type' => 'select', 'options' => ['cities', 'coords'], 'value' => 'cities'],
            ['id' => 'gcOrigin', 'type' => 'select', 'options' => ['saoPaulo', 'rioDeJaneiro', 'brasilia', 'manaus', 'lisboa', 'madrid', 'paris', 'london', 'rome', 'berlin', 'moscow', 'istanbul', 'cairo', 'johannesburg', 'luanda', 'maputo', 'lagos', 'nairobi', 'praia', 'dubai', 'delhi', 'kathmandu', 'bangkok', 'singapore', 'hongKong', 'shanghai', 'tokyo', 'seoul', 'sydney', 'auckland', 'honolulu', 'losAngeles', 'chicago', 'newYork', 'toronto', 'mexicoCity', 'bogota', 'lima', 'santiago', 'buenosAires'], 'value' => 'saoPaulo'],
            ['id' => 'gcDestination', 'type' => 'select', 'options' => ['saoPaulo', 'rioDeJaneiro', 'brasilia', 'manaus', 'lisboa', 'madrid', 'paris', 'london', 'rome', 'berlin', 'moscow', 'istanbul', 'cairo', 'johannesburg', 'luanda', 'maputo', 'lagos', 'nairobi', 'praia', 'dubai', 'delhi', 'kathmandu', 'bangkok', 'singapore', 'hongKong', 'shanghai', 'tokyo', 'seoul', 'sydney', 'auckland', 'honolulu', 'losAngeles', 'chicago', 'newYork', 'toronto', 'mexicoCity', 'bogota', 'lima', 'santiago', 'buenosAires'], 'value' => 'lisboa'],
            ['id' => 'gcLat1', 'type' => 'number', 'step' => 'any', 'min' => '-90', 'max' => '90'],
            ['id' => 'gcLon1', 'type' => 'number', 'step' => 'any', 'min' => '-180', 'max' => '180'],
            ['id' => 'gcLat2', 'type' => 'number', 'step' => 'any', 'min' => '-90', 'max' => '90'],
            ['id' => 'gcLon2', 'type' => 'number', 'step' => 'any', 'min' => '-180', 'max' => '180'],
            ['id' => 'gcSpeed', 'type' => 'number', 'step' => 'any', 'min' => '1', 'value' => '800'],
        ],
    ],

    // ============================================================ SONO (categoria health)
    'sleep-cycle-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'sleepCycleCalculator',
        'slugs' => ['pt' => 'calculadora-de-ciclos-do-sono', 'en' => 'sleep-cycle-calculator', 'es' => 'calculadora-de-ciclos-de-sueno'],
        'fields' => [
            ['id' => 'scMode', 'type' => 'select', 'options' => ['wakeAt', 'bedAt'], 'value' => 'wakeAt'],
            ['id' => 'scTime', 'type' => 'time', 'value' => '07:00'],
            ['id' => 'scFallAsleep', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '180', 'value' => '15'],
        ],
    ],
    'nap-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'napCalculator',
        'slugs' => ['pt' => 'calculadora-de-soneca', 'en' => 'nap-calculator', 'es' => 'calculadora-de-siesta'],
        'fields' => [
            ['id' => 'ncStart', 'type' => 'time', 'value' => '14:00'],
            ['id' => 'ncType', 'type' => 'select', 'options' => ['power20', 'nap30', 'nap60', 'cycle90'], 'value' => 'power20'],
            ['id' => 'ncFallAsleep', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '120', 'value' => '10'],
        ],
    ],
    'sleep-debt-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'sleepDebtCalculator',
        'slugs' => ['pt' => 'calculadora-de-divida-de-sono', 'en' => 'sleep-debt-calculator', 'es' => 'calculadora-de-deuda-de-sueno'],
        'fields' => [
            ['id' => 'sdNeeded', 'type' => 'number', 'step' => '0.25', 'min' => '1', 'max' => '24', 'value' => '8'],
            ['id' => 'sdDay1', 'type' => 'number', 'step' => '0.25', 'min' => '0', 'max' => '24'],
            ['id' => 'sdDay2', 'type' => 'number', 'step' => '0.25', 'min' => '0', 'max' => '24'],
            ['id' => 'sdDay3', 'type' => 'number', 'step' => '0.25', 'min' => '0', 'max' => '24'],
            ['id' => 'sdDay4', 'type' => 'number', 'step' => '0.25', 'min' => '0', 'max' => '24'],
            ['id' => 'sdDay5', 'type' => 'number', 'step' => '0.25', 'min' => '0', 'max' => '24'],
            ['id' => 'sdDay6', 'type' => 'number', 'step' => '0.25', 'min' => '0', 'max' => '24'],
            ['id' => 'sdDay7', 'type' => 'number', 'step' => '0.25', 'min' => '0', 'max' => '24'],
        ],
    ],
    'caffeine-cutoff-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'caffeineCutoffCalculator',
        'slugs' => ['pt' => 'calculadora-de-horario-limite-da-cafeina', 'en' => 'caffeine-cutoff-calculator', 'es' => 'calculadora-de-hora-limite-de-cafeina'],
        'fields' => [
            ['id' => 'cfDose', 'type' => 'number', 'step' => 'any', 'min' => '1', 'value' => '95'],
            ['id' => 'cfIntake', 'type' => 'time', 'value' => '15:00'],
            ['id' => 'cfBedtime', 'type' => 'time', 'value' => '23:00'],
            ['id' => 'cfHalfLife', 'type' => 'select', 'options' => ['3', '4', '5', '6', '7'], 'value' => '5'],
            ['id' => 'cfThreshold', 'type' => 'number', 'step' => 'any', 'min' => '0.1', 'value' => '25'],
        ],
    ],
    'recommended-sleep-calculator' => [
        'category' => 'health', 'multilingual' => true, 'jsKey' => 'recommendedSleepCalculator',
        'slugs' => ['pt' => 'calculadora-de-horas-de-sono-recomendadas', 'en' => 'recommended-sleep-calculator', 'es' => 'calculadora-de-horas-de-sueno-recomendadas'],
        'fields' => [
            ['id' => 'rsAge', 'type' => 'number', 'step' => '1', 'min' => '0', 'max' => '120'],
            ['id' => 'rsAgeUnit', 'type' => 'select', 'options' => ['years', 'months'], 'value' => 'years'],
        ],
    ],

];
