(function () {
  'use strict';

  function showResult(card, html) {
    var box = card.querySelector('[data-role="result"]');
    box.innerHTML = html;
    box.classList.add('show');
  }
  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function showStatus(card, msg, kind) {
    var box = card.querySelector('[data-role="status"]');
    box.textContent = msg;
    box.className = 'status-box show ' + kind;
  }
  function on(card, action, fn) {
    var btn = card.querySelector('[data-action="' + action + '"]');
    if (btn) btn.addEventListener('click', fn);
  }
  function copyText(text, T, statusEl) {
    navigator.clipboard.writeText(text).then(function () {
      if (statusEl) statusEl.textContent = T.copied || 'Copied!';
    });
  }

  // ---------------------------------------------------------- BMI
  function initBmi(card, T) {
    on(card, 'calc', function () {
      var weight = parseFloat(document.getElementById('weight').value);
      var heightCm = parseFloat(document.getElementById('height').value);
      if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
        alert(T.error);
        return;
      }
      var heightM = heightCm / 100;
      var bmi = weight / (heightM * heightM);
      var classification;
      if (bmi < 18.5) classification = T.underweight;
      else if (bmi < 25) classification = T.normal;
      else if (bmi < 30) classification = T.overweight;
      else if (bmi < 35) classification = T.obese1;
      else if (bmi < 40) classification = T.obese2;
      else classification = T.obese3;
      var min = (18.5 * heightM * heightM).toFixed(1);
      var max = (24.9 * heightM * heightM).toFixed(1);
      var rangeText = T.rangeText.replace('{min}', min).replace('{max}', max);
      showResult(card,
        '<div class="result-value">' + T.resultPrefix + ': ' + bmi.toFixed(1) + '</div>' +
        '<div class="result-classification">' + classification + '</div>' +
        '<div class="result-extra">' + rangeText + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- PERCENTAGE
  function initPercentage(card, T) {
    on(card, 'calc', function () {
      var value = parseFloat(document.getElementById('value').value);
      var percent = parseFloat(document.getElementById('percent').value);
      if (isNaN(value) || isNaN(percent)) {
        alert(T.error);
        return;
      }
      var result = (value * percent) / 100;
      var text = T.resultTemplate
        .replace('{percent}', percent)
        .replace('{value}', value)
        .replace('{result}', result.toLocaleString(undefined, { maximumFractionDigits: 4 }));
      showResult(card, '<div class="result-value">' + text + '</div>');
    });
  }

  // ---------------------------------------------------------- TEMPERATURE
  function initTemperature(card, T) {
    on(card, 'calc', function () {
      var value = parseFloat(document.getElementById('tempValue').value);
      var unit = document.getElementById('tempUnit').value;
      if (isNaN(value)) {
        alert(T.error);
        return;
      }
      var celsius;
      if (unit === 'C') celsius = value;
      else if (unit === 'F') celsius = (value - 32) * 5 / 9;
      else celsius = value - 273.15;

      var fahrenheit = celsius * 9 / 5 + 32;
      var kelvin = celsius + 273.15;
      var units = T.units || { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' };

      showResult(card,
        '<div class="result-extra">' + units.C + ': <strong>' + celsius.toFixed(2) + '</strong></div>' +
        '<div class="result-extra">' + units.F + ': <strong>' + fahrenheit.toFixed(2) + '</strong></div>' +
        '<div class="result-extra">' + units.K + ': <strong>' + kelvin.toFixed(2) + '</strong></div>'
      );
    });
  }

  // ---------------------------------------------------------- PASSWORD
  function initPassword(card, T) {
    on(card, 'generate', function () {
      var length = parseInt(document.getElementById('length').value, 10);
      var useUpper = document.getElementById('upper').checked;
      var useLower = document.getElementById('lower').checked;
      var useNumbers = document.getElementById('numbers').checked;
      var useSymbols = document.getElementById('symbols').checked;

      var sets = [];
      if (useUpper) sets.push('ABCDEFGHJKLMNPQRSTUVWXYZ');
      if (useLower) sets.push('abcdefghijkmnpqrstuvwxyz');
      if (useNumbers) sets.push('23456789');
      if (useSymbols) sets.push('!@#$%&*-_=+?');

      if (sets.length === 0) {
        alert(T.error);
        return;
      }

      var all = sets.join('');
      var pwd = '';
      var arr = new Uint32Array(length);
      window.crypto.getRandomValues(arr);
      for (var i = 0; i < length; i++) {
        pwd += all[arr[i] % all.length];
      }

      showResult(card,
        '<span class="result-value">' + pwd + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(pwd, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- JSON FORMATTER
  function initJsonFormatter(card, T) {
    var input = card.querySelector('[data-role="input"]');

    on(card, 'format', function () {
      try {
        var obj = JSON.parse(input.value);
        input.value = JSON.stringify(obj, null, 2);
        showStatus(card, T.formattedMsg, 'ok');
      } catch (e) {
        showStatus(card, T.invalidPrefix + e.message, 'err');
      }
    });
    on(card, 'minify', function () {
      try {
        var obj = JSON.parse(input.value);
        input.value = JSON.stringify(obj);
        showStatus(card, T.minifiedMsg, 'ok');
      } catch (e) {
        showStatus(card, T.invalidPrefix + e.message, 'err');
      }
    });
    on(card, 'validate', function () {
      try {
        JSON.parse(input.value);
        showStatus(card, '✔ ' + T.validMsg, 'ok');
      } catch (e) {
        showStatus(card, '✘ ' + T.invalidPrefix + e.message, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(input.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- CPF
  function calcDigitoCPF(digits) {
    var peso = digits.length + 1;
    var soma = 0;
    for (var i = 0; i < digits.length; i++) { soma += digits[i] * peso; peso--; }
    var resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }
  function gerarCPF() {
    var n = [];
    for (var i = 0; i < 9; i++) n.push(Math.floor(Math.random() * 10));
    var d1 = calcDigitoCPF(n);
    var d2 = calcDigitoCPF(n.concat([d1]));
    return n.concat([d1, d2]).join('');
  }
  function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  function initCpf(card, T) {
    on(card, 'generate', function () {
      var cpf = gerarCPF();
      var formato = document.getElementById('formato').value;
      var texto = formato === 'mascara' ? formatarCPF(cpf) : cpf;
      showResult(card,
        '<span class="result-value">' + texto + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- CNPJ
  function calcDigitoCNPJ(digits) {
    var pesos = digits.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    var soma = 0;
    for (var i = 0; i < digits.length; i++) { soma += digits[i] * pesos[i]; }
    var resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }
  function gerarCNPJ() {
    var base = [];
    for (var i = 0; i < 8; i++) base.push(Math.floor(Math.random() * 10));
    var filial = [0, 0, 0, 1];
    var n = base.concat(filial);
    var d1 = calcDigitoCNPJ(n);
    var d2 = calcDigitoCNPJ(n.concat([d1]));
    return n.concat([d1, d2]).join('');
  }
  function formatarCNPJ(cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  function initCnpj(card, T) {
    on(card, 'generate', function () {
      var cnpj = gerarCNPJ();
      var formato = document.getElementById('formato').value;
      var texto = formato === 'mascara' ? formatarCNPJ(cnpj) : cnpj;
      showResult(card,
        '<span class="result-value">' + texto + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- CHAR CODE (ASCII/Unicode/UTF-8)
  function initCharCode(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'calc', function () {
      var text = input.value;
      if (!text) {
        showResult(card, '<div class="result-extra">' + T.error + '</div>');
        return;
      }
      var chars = Array.from(text);
      var rows = '';
      chars.forEach(function (ch) {
        var cp = ch.codePointAt(0);
        var ascii = cp < 128 ? cp : T.na;
        var unicode = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
        var bytes = Array.from(new TextEncoder().encode(ch))
          .map(function (b) { return b.toString(16).toUpperCase().padStart(2, '0'); })
          .join(' ');
        var display = ch === ' ' ? '(space)' : (ch === '\n' ? '\\n' : ch);
        rows += '<tr><td>' + display + '</td><td>' + ascii + '</td><td>' + unicode + '</td><td>' + bytes + '</td></tr>';
      });
      var html = '<table class="result-table"><thead><tr>' +
        '<th>' + T.charHeader + '</th><th>' + T.asciiHeader + '</th><th>' + T.unicodeHeader + '</th><th>' + T.utf8Header + '</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="result"]');
      box.innerHTML = '';
      box.classList.remove('show');
    });
  }

  // ---------------------------------------------------------- URL ENCODE/DECODE
  function initUrlEncode(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      output.value = encodeURIComponent(input.value);
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
    on(card, 'decode', function () {
      try {
        output.value = decodeURIComponent(input.value);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- HTML ENCODE/DECODE
  function htmlEscape(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function htmlUnescape(str) {
    var el = document.createElement('textarea');
    el.innerHTML = str;
    return el.value;
  }
  function initHtmlEncode(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      output.value = htmlEscape(input.value);
    });
    on(card, 'decode', function () {
      output.value = htmlUnescape(input.value);
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- BASE64
  function initBase64(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      try {
        var bytes = new TextEncoder().encode(input.value);
        var bin = '';
        bytes.forEach(function (b) { bin += String.fromCharCode(b); });
        output.value = btoa(bin);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'decode', function () {
      try {
        var bin = atob(input.value.trim());
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        output.value = new TextDecoder().decode(bytes);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- WORD COUNTER
  function initWordCounter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'calc', function () {
      var text = input.value;
      var words = text.trim() === '' ? [] : text.trim().split(/\s+/);
      var chars = text.length;
      var charsNoSpaces = text.replace(/\s/g, '').length;
      var sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0);
      var paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(function (p) { return p.trim() !== ''; }).length;
      var minutes = Math.ceil(words.length / 200);

      showResult(card,
        '<div class="result-extra">' + T.words + ': <strong>' + words.length + '</strong></div>' +
        '<div class="result-extra">' + T.chars + ': <strong>' + chars + '</strong></div>' +
        '<div class="result-extra">' + T.charsNoSpaces + ': <strong>' + charsNoSpaces + '</strong></div>' +
        '<div class="result-extra">' + T.sentences + ': <strong>' + sentences + '</strong></div>' +
        '<div class="result-extra">' + T.paragraphs + ': <strong>' + paragraphs + '</strong></div>' +
        '<div class="result-extra">' + T.readTime + ': <strong>' + (words.length ? minutes : 0) + ' min</strong></div>'
      );
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="result"]');
      box.innerHTML = '';
      box.classList.remove('show');
    });
  }

  // ---------------------------------------------------------- KEYWORD DENSITY
  function initKeywordDensity(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'calc', function () {
      var text = input.value.trim();
      if (!text) {
        showResult(card, '<div class="result-extra">' + T.error + '</div>');
        return;
      }
      var words = text.toLowerCase()
        .normalize('NFC')
        .match(/[\p{L}\p{N}]+/gu) || [];
      var total = words.length;
      var counts = {};
      words.forEach(function (w) { counts[w] = (counts[w] || 0) + 1; });
      var sorted = Object.keys(counts)
        .map(function (w) { return { word: w, count: counts[w] }; })
        .sort(function (a, b) { return b.count - a.count; })
        .slice(0, 20);

      var rows = sorted.map(function (row) {
        var density = ((row.count / total) * 100).toFixed(1) + '%';
        return '<tr><td>' + row.word + '</td><td>' + row.count + '</td><td>' + density + '</td></tr>';
      }).join('');

      var html = '<div class="result-extra">' + T.totalWords + ': <strong>' + total + '</strong></div>' +
        '<table class="result-table"><thead><tr>' +
        '<th>' + T.wordHeader + '</th><th>' + T.countHeader + '</th><th>' + T.densityHeader + '</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="result"]');
      box.innerHTML = '';
      box.classList.remove('show');
    });
  }

  // ---------------------------------------------------------- META TAG GENERATOR
  function escapeHtmlAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function initMetaTagGenerator(card, T) {
    on(card, 'generate', function () {
      var title = document.getElementById('metaTitle').value.trim();
      var description = document.getElementById('metaDescription').value.trim();
      var url = document.getElementById('metaUrl').value.trim();

      if (!title || !description) {
        alert(T.error);
        return;
      }

      var lines = [];
      lines.push('<title>' + escapeHtmlAttr(title) + '</title>');
      lines.push('<meta name="description" content="' + escapeHtmlAttr(description) + '">');
      if (url) lines.push('<link rel="canonical" href="' + escapeHtmlAttr(url) + '">');
      lines.push('<meta property="og:title" content="' + escapeHtmlAttr(title) + '">');
      lines.push('<meta property="og:description" content="' + escapeHtmlAttr(description) + '">');
      if (url) lines.push('<meta property="og:url" content="' + escapeHtmlAttr(url) + '">');
      lines.push('<meta property="og:type" content="website">');
      lines.push('<meta name="twitter:card" content="summary_large_image">');
      lines.push('<meta name="twitter:title" content="' + escapeHtmlAttr(title) + '">');
      lines.push('<meta name="twitter:description" content="' + escapeHtmlAttr(description) + '">');

      var code = lines.join('\n');
      showResult(card,
        '<pre class="code-output">' + htmlEscape(code) + '</pre>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(code, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- SERP SIMULATOR
  function initSerpSimulator(card, T) {
    on(card, 'generate', function () {
      var title = document.getElementById('serpTitle').value.trim();
      var url = document.getElementById('serpUrl').value.trim();
      var description = document.getElementById('serpDescription').value.trim();

      if (!title) {
        alert(T.error);
        return;
      }

      var warnings = '';
      if (title.length > 60) warnings += '<div class="result-warning">' + T.titleTooLong + '</div>';
      if (description.length > 160) warnings += '<div class="result-warning">' + T.descTooLong + '</div>';

      var displayUrl = url || 'https://www.example.com';

      showResult(card,
        '<div class="serp-preview">' +
        '<div class="serp-url">' + htmlEscape(displayUrl) + '</div>' +
        '<div class="serp-title">' + htmlEscape(title.slice(0, 70)) + '</div>' +
        '<div class="serp-desc">' + htmlEscape(description.slice(0, 180)) + '</div>' +
        '</div>' + warnings
      );
    });
  }

  // ---------------------------------------------------------- COLOR CONVERTER
  function clamp255(n) { return Math.max(0, Math.min(255, Math.round(n))); }
  function clampPct(n) { return Math.max(0, Math.min(100, Math.round(n))); }

  function hexToRgb(str) {
    var s = String(str || '').trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(s)) {
      s = s.split('').map(function (ch) { return ch + ch; }).join('');
    }
    if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
    return {
      r: parseInt(s.substr(0, 2), 16),
      g: parseInt(s.substr(2, 2), 16),
      b: parseInt(s.substr(4, 2), 16),
    };
  }
  function rgbToHex(rgb) {
    function h2(n) { return clamp255(n).toString(16).padStart(2, '0'); }
    return '#' + h2(rgb.r) + h2(rgb.g) + h2(rgb.b);
  }
  function rgbToHsl(rgb) {
    var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function hslToRgb(hsl) {
    var h = ((hsl.h % 360) + 360) % 360 / 360, s = hsl.s / 100, l = hsl.l / 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: clamp255(r * 255), g: clamp255(g * 255), b: clamp255(b * 255) };
  }
  function rgbToHsb(rgb) {
    var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var d = max - min, h;
    if (d === 0) h = 0;
    else if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
    var s = max === 0 ? 0 : d / max;
    return { h: Math.round(h), s: Math.round(s * 100), b: Math.round(max * 100) };
  }
  function hsbToRgb(hsb) {
    var h = ((hsb.h % 360) + 360) % 360, s = hsb.s / 100, v = hsb.b / 100;
    var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
    var r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return { r: clamp255((r + m) * 255), g: clamp255((g + m) * 255), b: clamp255((b + m) * 255) };
  }
  function rgbToCmyk(rgb) {
    var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    var k = 1 - Math.max(r, g, b);
    var c, m, y;
    if (k >= 1) { c = m = y = 0; }
    else {
      c = (1 - r - k) / (1 - k);
      m = (1 - g - k) / (1 - k);
      y = (1 - b - k) / (1 - k);
    }
    return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
  }
  function cmykToRgb(cmyk) {
    var c = cmyk.c / 100, m = cmyk.m / 100, y = cmyk.y / 100, k = cmyk.k / 100;
    return {
      r: clamp255(255 * (1 - c) * (1 - k)),
      g: clamp255(255 * (1 - m) * (1 - k)),
      b: clamp255(255 * (1 - y) * (1 - k)),
    };
  }
  function parseTriplet(str) {
    var m = String(str || '').match(/(-?\d+(\.\d+)?)\D+(-?\d+(\.\d+)?)\D+(-?\d+(\.\d+)?)/);
    if (!m) return null;
    return [parseFloat(m[1]), parseFloat(m[3]), parseFloat(m[5])];
  }
  function parseQuad(str) {
    var m = String(str || '').match(/(-?\d+(\.\d+)?)\D+(-?\d+(\.\d+)?)\D+(-?\d+(\.\d+)?)\D+(-?\d+(\.\d+)?)/);
    if (!m) return null;
    return [parseFloat(m[1]), parseFloat(m[3]), parseFloat(m[5]), parseFloat(m[7])];
  }
  function parseRgbString(str) {
    var t = parseTriplet(str);
    if (!t) return null;
    return { r: clamp255(t[0]), g: clamp255(t[1]), b: clamp255(t[2]) };
  }
  function parseHslString(str) {
    var t = parseTriplet(str);
    if (!t) return null;
    return hslToRgb({ h: t[0], s: clampPct(t[1]), l: clampPct(t[2]) });
  }
  function parseHsbString(str) {
    var t = parseTriplet(str);
    if (!t) return null;
    return hsbToRgb({ h: t[0], s: clampPct(t[1]), b: clampPct(t[2]) });
  }
  function parseCmykString(str) {
    var q = parseQuad(str);
    if (!q) return null;
    return cmykToRgb({ c: clampPct(q[0]), m: clampPct(q[1]), y: clampPct(q[2]), k: clampPct(q[3]) });
  }

  function initColorConverter(card, T) {
    var picker = document.getElementById('colorPicker');
    var swatch = card.querySelector('[data-role="swatch"]');
    var statusBox = card.querySelector('[data-role="status"]');
    var fields = {
      hex: document.getElementById('colorHex'),
      rgb: document.getElementById('colorRgb'),
      hsl: document.getElementById('colorHsl'),
      hsb: document.getElementById('colorHsb'),
      cmyk: document.getElementById('colorCmyk'),
    };

    function setAll(rgb, skip) {
      var hex = rgbToHex(rgb);
      var hsl = rgbToHsl(rgb);
      var hsb = rgbToHsb(rgb);
      var cmyk = rgbToCmyk(rgb);
      if (skip !== 'hex') fields.hex.value = hex;
      if (skip !== 'rgb') fields.rgb.value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      if (skip !== 'hsl') fields.hsl.value = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
      if (skip !== 'hsb') fields.hsb.value = 'hsb(' + hsb.h + ', ' + hsb.s + '%, ' + hsb.b + '%)';
      if (skip !== 'cmyk') fields.cmyk.value = 'cmyk(' + cmyk.c + '%, ' + cmyk.m + '%, ' + cmyk.y + '%, ' + cmyk.k + '%)';
      swatch.style.backgroundColor = hex;
      picker.value = hex;
      statusBox.className = 'status-box';
    }

    picker.addEventListener('input', function () {
      setAll(hexToRgb(picker.value), null);
    });

    var parsers = { hex: hexToRgb, rgb: parseRgbString, hsl: parseHslString, hsb: parseHsbString, cmyk: parseCmykString };
    Object.keys(parsers).forEach(function (key) {
      fields[key].addEventListener('input', function () {
        var rgb = parsers[key](fields[key].value);
        if (!rgb) {
          showStatus(card, T.invalid, 'err');
          return;
        }
        setAll(rgb, key);
      });
    });

    card.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var el = document.getElementById(btn.getAttribute('data-copy'));
        copyText(el.value, T, statusBox);
        showStatus(card, T.copied, 'ok');
      });
    });

    on(card, 'random', function () {
      setAll({
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
      }, null);
    });

    setAll(hexToRgb(picker.value) || { r: 47, g: 107, b: 255 }, null);
  }

  // ---------------------------------------------------------- IMAGE CONVERTER
  function fmtBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  }

  function initImageConverter(card, T) {
    var box = card.querySelector('.img-tool');
    var toMime = box.dataset.toMime;
    var toExt = box.dataset.toExt;
    var maxMb = parseFloat(box.dataset.maxMb) || 20;
    var maxBytes = maxMb * 1024 * 1024;

    var dropzone = box.querySelector('[data-role="dropzone"]');
    var fileInput = document.getElementById('imgFile');
    var statusBox = box.querySelector('[data-role="status"]');
    var previewGrid = box.querySelector('[data-role="previewGrid"]');
    var originalImg = box.querySelector('[data-role="originalImg"]');
    var originalMeta = box.querySelector('[data-role="originalMeta"]');
    var convertedImg = box.querySelector('[data-role="convertedImg"]');
    var convertedPlaceholder = box.querySelector('[data-role="convertedPlaceholder"]');
    var convertedMeta = box.querySelector('[data-role="convertedMeta"]');
    var qualityInput = document.getElementById('imgQuality');
    var qualityVal = box.querySelector('[data-role="qualityVal"]');
    var convertBtn = box.querySelector('[data-role="convertBtn"]');
    var downloadBtn = box.querySelector('[data-role="downloadBtn"]');

    var currentFile = null;
    var currentImgEl = null;
    var currentObjectUrl = null;
    var convertedObjectUrl = null;

    function setStatus(msg, kind) {
      if (!msg) { statusBox.className = 'status-box'; return; }
      statusBox.textContent = msg;
      statusBox.className = 'status-box show ' + kind;
    }

    function resetConverted() {
      convertedImg.style.display = 'none';
      convertedImg.removeAttribute('src');
      convertedPlaceholder.style.display = '';
      convertedMeta.textContent = '';
      downloadBtn.style.display = 'none';
      if (convertedObjectUrl) { URL.revokeObjectURL(convertedObjectUrl); convertedObjectUrl = null; }
    }

    function handleFile(file) {
      if (!file) return;
      if (file.size > maxBytes) {
        setStatus(T.errorTooLarge, 'err');
        return;
      }
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      resetConverted();
      currentFile = file;
      var url = URL.createObjectURL(file);
      currentObjectUrl = url;
      var img = new Image();
      img.onload = function () {
        currentImgEl = img;
        originalImg.src = url;
        originalMeta.textContent = img.naturalWidth + '×' + img.naturalHeight + ' · ' + fmtBytes(file.size);
        previewGrid.classList.add('show');
        convertBtn.disabled = false;
        setStatus(T.readyStatus, 'ok');
      };
      img.onerror = function () {
        setStatus(T.errorInvalid, 'err');
        currentImgEl = null;
        convertBtn.disabled = true;
      };
      img.src = url;
    }

    dropzone.addEventListener('click', function () { fileInput.click(); });
    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.remove('drag-over'); });
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });

    if (qualityInput) {
      qualityInput.addEventListener('input', function () {
        qualityVal.textContent = qualityInput.value;
      });
    }

    on(card, 'convert', function () {
      if (!currentImgEl) return;
      var canvas = document.createElement('canvas');
      canvas.width = currentImgEl.naturalWidth;
      canvas.height = currentImgEl.naturalHeight;
      var ctx = canvas.getContext('2d');
      if (toMime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(currentImgEl, 0, 0);

      var quality = qualityInput ? parseInt(qualityInput.value, 10) / 100 : undefined;

      canvas.toBlob(function (blob) {
        if (!blob) {
          setStatus(T.errorUnsupported, 'err');
          return;
        }
        if (convertedObjectUrl) URL.revokeObjectURL(convertedObjectUrl);
        convertedObjectUrl = URL.createObjectURL(blob);
        convertedImg.src = convertedObjectUrl;
        convertedImg.style.display = '';
        convertedPlaceholder.style.display = 'none';
        convertedMeta.textContent = canvas.width + '×' + canvas.height + ' · ' + fmtBytes(blob.size);
        downloadBtn.href = convertedObjectUrl;
        var baseName = (currentFile.name || 'image').replace(/\.[^.]+$/, '');
        downloadBtn.setAttribute('download', baseName + '.' + toExt);
        downloadBtn.style.display = '';
        setStatus(T.doneStatus, 'ok');
      }, toMime, quality);
    });

    on(card, 'reset', function () {
      currentFile = null;
      currentImgEl = null;
      if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
      resetConverted();
      originalImg.removeAttribute('src');
      originalMeta.textContent = '';
      previewGrid.classList.remove('show');
      convertBtn.disabled = true;
      fileInput.value = '';
      setStatus('', '');
    });
  }

  // ---------------------------------------------------------- CALCULADORAS TRABALHISTAS (CLT)
  function round2(n) {
    // Compensa erros de ponto flutuante (ex: 1621*0.075 = 121.57499999999998) antes de arredondar.
    var eps = n >= 0 ? 1e-6 : -1e-6;
    return Math.round(n * 100 + eps) / 100;
  }
  function fmtBRL(n) {
    return 'R$ ' + (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Tabela INSS 2026 (empregado CLT) — teto R$ 8.475,55, contribuição máxima R$ 988,09.
  var INSS_TABLE_2026 = [
    { limit: 1621.00, rate: 0.075, deduct: 0 },
    { limit: 2902.84, rate: 0.09, deduct: 24.32 },
    { limit: 4354.27, rate: 0.12, deduct: 111.40 },
    { limit: 8475.55, rate: 0.14, deduct: 198.49 },
  ];
  var INSS_TETO_2026 = 988.09;

  function calcINSS(base) {
    if (!base || base <= 0) return 0;
    if (base > 8475.55) return INSS_TETO_2026;
    for (var i = 0; i < INSS_TABLE_2026.length; i++) {
      var faixa = INSS_TABLE_2026[i];
      if (base <= faixa.limit) {
        return round2(Math.max(0, base * faixa.rate - faixa.deduct));
      }
    }
    return INSS_TETO_2026;
  }

  // Tabela IRRF mensal 2026 + redutor da Lei 15.270/2025 (faixa de isenção ampliada até R$ 5.000).
  var IRRF_TABLE_2026 = [
    { limit: 2428.80, rate: 0, deduct: 0 },
    { limit: 2826.65, rate: 0.075, deduct: 182.16 },
    { limit: 3751.05, rate: 0.15, deduct: 394.16 },
    { limit: 4664.68, rate: 0.225, deduct: 675.49 },
    { limit: Infinity, rate: 0.275, deduct: 908.73 },
  ];

  // baseTributavel = rendimento - INSS (usada na tabela progressiva).
  // rendimentoBruto = valor bruto antes do INSS (usado no redutor da Lei 15.270/2025,
  // que se aplica sobre o rendimento tributável sujeito à incidência mensal).
  function calcIRRF(baseTributavel, rendimentoBruto) {
    if (!baseTributavel || baseTributavel <= 0) return 0;
    if (rendimentoBruto === undefined) rendimentoBruto = baseTributavel;
    var faixa = IRRF_TABLE_2026[IRRF_TABLE_2026.length - 1];
    for (var i = 0; i < IRRF_TABLE_2026.length; i++) {
      if (baseTributavel <= IRRF_TABLE_2026[i].limit) { faixa = IRRF_TABLE_2026[i]; break; }
    }
    var imposto = Math.max(0, baseTributavel * faixa.rate - faixa.deduct);
    // Redutor da Lei 15.270/2025 (em vigor desde jan/2026)
    var redutor = 0;
    if (rendimentoBruto <= 5000) redutor = 312.89;
    else if (rendimentoBruto <= 7350) redutor = Math.max(0, 978.62 - 0.133145 * rendimentoBruto);
    return round2(Math.max(0, imposto - redutor));
  }

  function parseISODate(str) {
    var p = String(str || '').split('-');
    if (p.length !== 3) return null;
    var d = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    return isNaN(d.getTime()) ? null : d;
  }
  function diasEntreDatas(d1, d2) { return Math.round((d2 - d1) / 86400000); }
  function addDays(date, n) { var d = new Date(date.getTime()); d.setDate(d.getDate() + n); return d; }
  function fmtDateLocale(d, lang) { return d.toLocaleDateString(localeFor(lang)); }
  function anosCompletosEntre(d1, d2) {
    var anos = d2.getFullYear() - d1.getFullYear();
    var aniversario = new Date(d1.getFullYear() + anos, d1.getMonth(), d1.getDate());
    if (aniversario > d2) anos--;
    return Math.max(0, anos);
  }
  // Conta meses completos entre duas datas, com fração >= 15 dias contando como mês inteiro
  // (art. 146, parágrafo único, CLT / art. 1º, §1º, Lei 4.090/1962), limitado a 12 meses.
  function contarMesesComFracao(inicio, fim) {
    var meses = 0;
    var cursor = new Date(inicio);
    while (true) {
      var proximo = new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate());
      if (proximo <= fim) { meses++; cursor = proximo; }
      else break;
    }
    var diasRestantes = diasEntreDatas(cursor, fim);
    if (diasRestantes >= 15) meses++;
    return Math.min(12, meses);
  }
  var TEMPO_UNITS = {
    pt: { year: 'ano', years: 'anos', month: 'mês', months: 'meses', day: 'dia', days: 'dias' },
    en: { year: 'year', years: 'years', month: 'month', months: 'months', day: 'day', days: 'days' },
    es: { year: 'año', years: 'años', month: 'mes', months: 'meses', day: 'día', days: 'días' },
  };
  function formatTempoServico(admissao, desligamento, lang) {
    var u = TEMPO_UNITS[lang] || TEMPO_UNITS.pt;
    var anos = desligamento.getFullYear() - admissao.getFullYear();
    var meses = desligamento.getMonth() - admissao.getMonth();
    var dias = desligamento.getDate() - admissao.getDate();
    if (dias < 0) {
      meses--;
      dias += new Date(desligamento.getFullYear(), desligamento.getMonth(), 0).getDate();
    }
    if (meses < 0) { anos--; meses += 12; }
    var partes = [];
    if (anos > 0) partes.push(anos + ' ' + (anos === 1 ? u.year : u.years));
    if (meses > 0) partes.push(meses + ' ' + (meses === 1 ? u.month : u.months));
    partes.push(dias + ' ' + (dias === 1 ? u.day : u.days));
    return partes.join(', ');
  }

  // ---- Férias proporcionais + 1/3 ----
  function initFerias(card, T) {
    on(card, 'calc', function () {
      var salario = parseFloat(document.getElementById('salario').value);
      var meses = parseInt(document.getElementById('meses').value, 10);
      var diasAbono = Math.max(0, Math.min(10, parseInt(document.getElementById('diasAbono').value, 10) || 0));
      if (!salario || salario <= 0 || !meses || meses < 1 || meses > 12) { alert(T.error); return; }

      var proporcional = round2((salario / 12) * meses);
      var terco = round2(proporcional / 3);
      var diaValor = salario / 30;
      var abono = diasAbono > 0 ? round2(diaValor * diasAbono) : 0;
      var tercoAbono = diasAbono > 0 ? round2(abono / 3) : 0;
      var totalBruto = round2(proporcional + terco + abono + tercoAbono);

      var inss = calcINSS(proporcional);
      var irrf = calcIRRF(Math.max(0, proporcional - inss), proporcional);
      var totalLiquido = round2(totalBruto - inss - irrf);

      var html = '<div class="result-extra">' + T.proporcional + ': <strong>' + fmtBRL(proporcional) + '</strong></div>' +
        '<div class="result-extra">' + T.terco + ': <strong>' + fmtBRL(terco) + '</strong></div>';
      if (diasAbono > 0) {
        html += '<div class="result-extra">' + T.abono + ' (' + diasAbono + ' dias): <strong>' + fmtBRL(abono) + '</strong></div>' +
          '<div class="result-extra">' + T.tercoAbono + ': <strong>' + fmtBRL(tercoAbono) + '</strong></div>';
      }
      html += '<div class="result-extra">' + T.totalBruto + ': <strong>' + fmtBRL(totalBruto) + '</strong></div>' +
        '<div class="result-extra">' + T.inss + ': <strong>-' + fmtBRL(inss) + '</strong></div>' +
        '<div class="result-extra">' + T.irrf + ': <strong>-' + fmtBRL(irrf) + '</strong></div>' +
        '<div class="result-value">' + T.totalLiquido + ': ' + fmtBRL(totalLiquido) + '</div>' +
        '<div class="result-note">' + T.obs + '</div>';
      showResult(card, html);
    });
  }

  // ---- 13º salário ----
  function initDecimoTerceiro(card, T) {
    on(card, 'calc', function () {
      var salario = parseFloat(document.getElementById('salario').value);
      var meses = parseInt(document.getElementById('meses').value, 10);
      var adiantamento = document.getElementById('adiantamento').checked;
      if (!salario || salario <= 0 || !meses || meses < 1 || meses > 12) { alert(T.error); return; }

      var proporcional = round2((salario / 12) * meses);
      var primeira = round2(proporcional / 2);
      var segundaBruta = round2(proporcional - primeira);
      var inss = calcINSS(proporcional);
      var irrf = calcIRRF(Math.max(0, proporcional - inss), proporcional);
      var segundaLiquida = round2(segundaBruta - inss - irrf);
      var totalLiquido = round2(primeira + segundaLiquida);

      var html = '<div class="result-extra">' + T.proporcional + ': <strong>' + fmtBRL(proporcional) + '</strong></div>' +
        '<div class="result-extra">' + T.primeiraParcela + ': <strong>' + fmtBRL(primeira) + '</strong></div>' +
        '<div class="result-extra">' + T.segundaParcela + ': <strong>' + fmtBRL(segundaBruta) + '</strong></div>' +
        '<div class="result-extra">' + T.inss + ': <strong>-' + fmtBRL(inss) + '</strong></div>' +
        '<div class="result-extra">' + T.irrf + ': <strong>-' + fmtBRL(irrf) + '</strong></div>';
      if (adiantamento) {
        html += '<div class="result-value">' + T.aReceberAgora + ': ' + fmtBRL(segundaLiquida) + '</div>';
      } else {
        html += '<div class="result-value">' + T.totalLiquido + ': ' + fmtBRL(totalLiquido) + '</div>';
      }
      html += '<div class="result-note">' + T.obs + '</div>';
      showResult(card, html);
    });
  }

  // ---- Horas extras / banco de horas ----
  function initHorasExtras(card, T) {
    on(card, 'calc', function () {
      var salario = parseFloat(document.getElementById('salario').value);
      var carga = parseFloat(document.getElementById('cargaHoraria').value);
      var horas = parseFloat(document.getElementById('horasExtras').value) || 0;
      var adicional = parseFloat(document.getElementById('adicional').value);
      if (!salario || salario <= 0 || !carga || carga <= 0) { alert(T.error); return; }

      var valorHoraNormal = salario / carga;
      var valorHoraExtra = valorHoraNormal * (1 + adicional / 100);
      var total = round2(valorHoraExtra * horas);

      var html = '<div class="result-extra">' + T.valorHoraNormal + ': <strong>' + fmtBRL(round2(valorHoraNormal)) + '</strong></div>' +
        '<div class="result-extra">' + T.valorHoraExtra + ' (+' + adicional + '%): <strong>' + fmtBRL(round2(valorHoraExtra)) + '</strong></div>' +
        '<div class="result-value">' + T.totalReceber + ': ' + fmtBRL(total) + '</div>' +
        '<div class="result-note">' + T.obs + '</div>';
      showResult(card, html);
    });
  }

  // ---- FGTS: depósito mensal e multa rescisória ----
  function initFgts(card, T) {
    on(card, 'calc', function () {
      var salario = parseFloat(document.getElementById('salario').value);
      var meses = parseInt(document.getElementById('meses').value, 10);
      var tipo = document.getElementById('tipoRescisao').value;
      var saldoStr = document.getElementById('saldoInformado').value;
      if (!salario || salario <= 0 || !meses || meses < 1) { alert(T.error); return; }

      var deposito = round2(salario * 0.08);
      var saldoEstimado = saldoStr !== '' ? parseFloat(saldoStr) : round2(deposito * meses);
      var multaPct = { sem_justa_causa: 0.40, acordo: 0.20, pedido_demissao: 0, justa_causa: 0, nenhuma: 0 }[tipo] || 0;
      var multa = round2(saldoEstimado * multaPct);
      var total = round2(saldoEstimado + multa);

      var html = '<div class="result-extra">' + T.depositoMensal + ': <strong>' + fmtBRL(deposito) + '</strong></div>' +
        '<div class="result-extra">' + T.saldoEstimado + ': <strong>' + fmtBRL(saldoEstimado) + '</strong></div>';
      if (tipo !== 'nenhuma' && multaPct > 0) {
        html += '<div class="result-extra">' + T.multa + ' (' + Math.round(multaPct * 100) + '%): <strong>' + fmtBRL(multa) + '</strong></div>' +
          '<div class="result-value">' + T.totalReceber + ': ' + fmtBRL(total) + '</div>';
      } else if (tipo !== 'nenhuma') {
        html += '<div class="result-value">' + T.totalReceber + ': ' + fmtBRL(total) + '</div>';
      }
      html += '<div class="result-note">' + T.obs + '</div>';
      showResult(card, html);
    });
  }

  // ---- Rescisão trabalhista completa ----
  function initRescisao(card, T) {
    on(card, 'calc', function () {
      var salario = parseFloat(document.getElementById('salario').value);
      var admissao = parseISODate(document.getElementById('admissao').value);
      var desligamento = parseISODate(document.getElementById('desligamento').value);
      var tipo = document.getElementById('tipoRescisao').value;
      var avisoPrevioTipo = document.getElementById('avisoPrevio').value;
      var feriasVencidas = Math.max(0, parseInt(document.getElementById('feriasVencidas').value, 10) || 0);

      if (!salario || salario <= 0 || !admissao || !desligamento) { alert(T.error); return; }
      if (desligamento <= admissao) { alert(T.errorDatas); return; }

      var temAvisoIndenizado = (tipo === 'sem_justa_causa' || tipo === 'acordo') && avisoPrevioTipo === 'indenizado';
      var incluirProporcionais = tipo !== 'justa_causa';
      var incluirMultaFgts = tipo === 'sem_justa_causa' || tipo === 'acordo';

      var anos = anosCompletosEntre(admissao, desligamento);
      var diasAviso = (tipo === 'sem_justa_causa' || tipo === 'acordo') ? Math.min(90, 30 + 3 * anos) : 0;

      // Data-base projetada (soma o aviso indenizado ao tempo de contrato, art. 487 §1º CLT)
      var dataBase = new Date(desligamento.getTime());
      if (temAvisoIndenizado) dataBase.setDate(dataBase.getDate() + diasAviso);

      // Saldo de salário: dias corridos trabalhados no mês do desligamento
      var diasNoMes = desligamento.getDate();
      var saldoSalario = round2((salario / 30) * diasNoMes);

      // Aviso prévio indenizado
      var valorAviso = 0;
      if (temAvisoIndenizado) {
        valorAviso = round2((salario / 30) * diasAviso);
        if (tipo === 'acordo') valorAviso = round2(valorAviso / 2); // art. 484-A CLT: pago pela metade
      }

      // Férias proporcionais e 13º proporcional (não devidos na justa causa)
      var feriasProporcionais = 0, tercoProporcional = 0, decimoProporcional = 0;
      if (incluirProporcionais) {
        var anosParaFerias = anosCompletosEntre(admissao, dataBase);
        var inicioPeriodoFerias = new Date(admissao.getFullYear() + anosParaFerias, admissao.getMonth(), admissao.getDate());
        var mesesFerias = contarMesesComFracao(inicioPeriodoFerias, dataBase);
        feriasProporcionais = round2((salario / 12) * mesesFerias);
        tercoProporcional = round2(feriasProporcionais / 3);

        var inicioAno = new Date(dataBase.getFullYear(), 0, 1);
        var inicio13 = admissao > inicioAno ? admissao : inicioAno;
        var meses13 = contarMesesComFracao(inicio13, dataBase);
        decimoProporcional = round2((salario / 12) * meses13);
      }

      // Férias vencidas (períodos completos não gozados)
      var feriasVencidasValor = feriasVencidas > 0 ? round2(feriasVencidas * salario) : 0;
      var tercoVencidas = feriasVencidas > 0 ? round2(feriasVencidasValor / 3) : 0;

      // Multa do FGTS (estimada a partir do tempo de serviço, sem juros/correção)
      var multaFgts = 0;
      if (incluirMultaFgts) {
        var totalMeses = Math.max(1, Math.round(diasEntreDatas(admissao, dataBase) / 30));
        var saldoFgtsEstimado = round2(0.08 * salario * totalMeses);
        var multaPct = tipo === 'sem_justa_causa' ? 0.40 : 0.20;
        multaFgts = round2(saldoFgtsEstimado * multaPct);
      }

      // Descontos: incidem apenas sobre saldo de salário e 13º proporcional
      var inssSaldo = calcINSS(saldoSalario);
      var inss13 = incluirProporcionais ? calcINSS(decimoProporcional) : 0;
      var inssTotal = round2(inssSaldo + inss13);
      var irrfSaldo = calcIRRF(Math.max(0, saldoSalario - inssSaldo), saldoSalario);
      var irrf13 = incluirProporcionais ? calcIRRF(Math.max(0, decimoProporcional - inss13), decimoProporcional) : 0;
      var irrfTotal = round2(irrfSaldo + irrf13);

      var totalBruto = round2(saldoSalario + valorAviso + feriasVencidasValor + tercoVencidas + feriasProporcionais + tercoProporcional + decimoProporcional + multaFgts);
      var totalLiquido = round2(totalBruto - inssTotal - irrfTotal);

      var html = '<div class="result-extra">' + T.tempoServico + ': <strong>' + formatTempoServico(admissao, desligamento) + '</strong></div>';
      if (diasAviso > 0) html += '<div class="result-extra">' + T.diasAviso + ': <strong>' + diasAviso + '</strong></div>';
      html += '<div class="result-extra">' + T.saldoSalario + ': <strong>' + fmtBRL(saldoSalario) + '</strong></div>';
      if (valorAviso > 0) html += '<div class="result-extra">' + T.avisoPrevioLabel + ': <strong>' + fmtBRL(valorAviso) + '</strong></div>';
      if (feriasVencidas > 0) html += '<div class="result-extra">' + T.feriasVencidasLabel + ': <strong>' + fmtBRL(round2(feriasVencidasValor + tercoVencidas)) + '</strong></div>';
      if (incluirProporcionais) {
        html += '<div class="result-extra">' + T.feriasProporcionaisLabel + ': <strong>' + fmtBRL(round2(feriasProporcionais + tercoProporcional)) + '</strong></div>' +
          '<div class="result-extra">' + T.decimoProporcionalLabel + ': <strong>' + fmtBRL(decimoProporcional) + '</strong></div>';
      }
      if (multaFgts > 0) html += '<div class="result-extra">' + T.multaFgtsLabel + ': <strong>' + fmtBRL(multaFgts) + '</strong></div>';
      html += '<div class="result-extra">' + T.totalBruto + ': <strong>' + fmtBRL(totalBruto) + '</strong></div>' +
        '<div class="result-extra">' + T.inss + ': <strong>-' + fmtBRL(inssTotal) + '</strong></div>' +
        '<div class="result-extra">' + T.irrf + ': <strong>-' + fmtBRL(irrfTotal) + '</strong></div>' +
        '<div class="result-value">' + T.totalLiquido + ': ' + fmtBRL(totalLiquido) + '</div>' +
        '<div class="result-note">' + T.obsIsentos + '</div>';
      if (tipo === 'justa_causa') html += '<div class="result-note">' + T.obsJustaCausa + '</div>';
      if (tipo === 'pedido_demissao') html += '<div class="result-note">' + T.obsPedidoDemissao + '</div>';
      if (tipo === 'acordo') html += '<div class="result-note">' + T.obsAcordo + '</div>';

      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- helpers (financeiras / dia a dia)
  function localeFor(lang) {
    // es-AR em vez de es-ES: mesma convenção de agrupamento (ponto/vírgula),
    // mas com dados de localização mais completos nos motores JS mais comuns.
    return { pt: 'pt-BR', en: 'en-US', es: 'es-AR' }[lang] || 'en-US';
  }
  function fmtNum(n, lang, decimals) {
    decimals = decimals === undefined ? 2 : decimals;
    return (n || 0).toLocaleString(localeFor(lang), { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  // ---------------------------------------------------------- SIMPLE INTEREST
  function initSimpleInterest(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var capital = parseFloat(document.getElementById('capital').value);
      var taxa = parseFloat(document.getElementById('taxa').value);
      var periodo = parseFloat(document.getElementById('periodo').value);
      if (!capital || capital <= 0 || isNaN(taxa) || taxa < 0 || !periodo || periodo <= 0) { alert(T.error); return; }
      var juros = round2(capital * (taxa / 100) * periodo);
      var montante = round2(capital + juros);
      showResult(card,
        '<div class="result-extra">' + T.juros + ': <strong>' + fmtNum(juros, lang) + '</strong></div>' +
        '<div class="result-value">' + T.montante + ': ' + fmtNum(montante, lang) + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- COMPOUND INTEREST
  function initCompoundInterest(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var capital = parseFloat(document.getElementById('capital').value);
      var taxa = parseFloat(document.getElementById('taxa').value);
      var periodo = parseFloat(document.getElementById('periodo').value);
      var aporteStr = document.getElementById('aporte').value;
      var aporte = aporteStr !== '' ? parseFloat(aporteStr) : 0;
      if (isNaN(aporte) || aporte < 0) aporte = 0;
      if (!capital || capital <= 0 || isNaN(taxa) || taxa < 0 || !periodo || periodo <= 0) { alert(T.error); return; }
      var i = taxa / 100;
      var montante;
      if (i === 0) {
        montante = capital + aporte * periodo;
      } else {
        montante = capital * Math.pow(1 + i, periodo) + (aporte > 0 ? aporte * ((Math.pow(1 + i, periodo) - 1) / i) : 0);
      }
      montante = round2(montante);
      var totalInvestido = round2(capital + aporte * periodo);
      var jurosGanhos = round2(montante - totalInvestido);
      showResult(card,
        '<div class="result-extra">' + T.totalInvestido + ': <strong>' + fmtNum(totalInvestido, lang) + '</strong></div>' +
        '<div class="result-extra">' + T.jurosGanhos + ': <strong>' + fmtNum(jurosGanhos, lang) + '</strong></div>' +
        '<div class="result-value">' + T.montanteFinal + ': ' + fmtNum(montante, lang) + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- LOAN INSTALLMENTS (Tabela Price)
  function initLoanInstallments(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var valor = parseFloat(document.getElementById('valor').value);
      var taxa = parseFloat(document.getElementById('taxa').value);
      var parcelas = parseInt(document.getElementById('parcelas').value, 10);
      if (!valor || valor <= 0 || isNaN(taxa) || taxa < 0 || !parcelas || parcelas < 1) { alert(T.error); return; }
      var i = taxa / 100;
      var pmt = i === 0 ? (valor / parcelas) : (valor * i / (1 - Math.pow(1 + i, -parcelas)));
      pmt = round2(pmt);
      var totalPago = round2(pmt * parcelas);
      var totalJuros = round2(totalPago - valor);
      showResult(card,
        '<div class="result-value">' + T.valorParcela + ': ' + fmtNum(pmt, lang) + '</div>' +
        '<div class="result-extra">' + T.totalPago + ': <strong>' + fmtNum(totalPago, lang) + '</strong></div>' +
        '<div class="result-extra">' + T.totalJuros + ': <strong>' + fmtNum(totalJuros, lang) + '</strong></div>'
      );
    });
  }

  // ---------------------------------------------------------- RULE OF THREE
  function initRuleOfThree(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var a = parseFloat(document.getElementById('a').value);
      var b = parseFloat(document.getElementById('b').value);
      var c = parseFloat(document.getElementById('c').value);
      var tipo = document.getElementById('tipo').value;
      if (isNaN(a) || isNaN(b) || isNaN(c)) { alert(T.error); return; }
      var x;
      if (tipo === 'inversa') {
        if (c === 0) { alert(T.errorDivZero); return; }
        x = (a * b) / c;
      } else {
        if (a === 0) { alert(T.errorDivZero); return; }
        x = (b * c) / a;
      }
      var text = T.resultTemplate.replace('{result}', x.toLocaleString(localeFor(lang), { maximumFractionDigits: 4 }));
      showResult(card, '<div class="result-value">' + text + '</div>');
    });
  }

  // ---------------------------------------------------------- TIP CALCULATOR
  function initTipCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var valorConta = parseFloat(document.getElementById('valorConta').value);
      var percentual = parseFloat(document.getElementById('percentual').value) || 0;
      var pessoas = parseInt(document.getElementById('pessoas').value, 10) || 1;
      if (!valorConta || valorConta <= 0) { alert(T.error); return; }
      var gorjetaValor = round2(valorConta * (percentual / 100));
      var total = round2(valorConta + gorjetaValor);
      var porPessoa = round2(total / pessoas);
      showResult(card,
        '<div class="result-extra">' + T.valorGorjeta + ': <strong>' + fmtNum(gorjetaValor, lang) + '</strong></div>' +
        '<div class="result-extra">' + T.totalComGorjeta + ': <strong>' + fmtNum(total, lang) + '</strong></div>' +
        '<div class="result-value">' + T.porPessoa + ': ' + fmtNum(porPessoa, lang) + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- AGE CALCULATOR
  function initAgeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var nasc = parseISODate(document.getElementById('nascimento').value);
      var refStr = document.getElementById('referencia').value;
      var now = new Date();
      var ref = refStr ? parseISODate(refStr) : new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (!nasc || !ref) { alert(T.error); return; }
      if (nasc > ref) { alert(T.errorFutura); return; }
      var idadeText = formatTempoServico(nasc, ref, lang);
      var diasVividos = diasEntreDatas(nasc, ref);
      var semanasVividas = Math.floor(diasVividos / 7);
      var aniversario = new Date(ref.getFullYear(), nasc.getMonth(), nasc.getDate());
      if (aniversario < ref) aniversario = new Date(ref.getFullYear() + 1, nasc.getMonth(), nasc.getDate());
      var diasAteAniversario = diasEntreDatas(ref, aniversario);
      showResult(card,
        '<div class="result-value">' + T.idade + ': ' + idadeText + '</div>' +
        '<div class="result-extra">' + T.diasVividos + ': <strong>' + diasVividos.toLocaleString(localeFor(lang)) + '</strong></div>' +
        '<div class="result-extra">' + T.semanasVividas + ': <strong>' + semanasVividas.toLocaleString(localeFor(lang)) + '</strong></div>' +
        '<div class="result-extra">' + T.proximoAniversario + ': <strong>' + diasAteAniversario.toLocaleString(localeFor(lang)) + '</strong></div>'
      );
    });
  }

  // ---------------------------------------------------------- DATE DIFFERENCE
  function initDateDiff(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var d1 = parseISODate(document.getElementById('dataInicial').value);
      var d2 = parseISODate(document.getElementById('dataFinal').value);
      if (!d1 || !d2) { alert(T.error); return; }
      var early = d1 <= d2 ? d1 : d2;
      var late = d1 <= d2 ? d2 : d1;
      var diffText = formatTempoServico(early, late, lang);
      var totalDias = diasEntreDatas(early, late);
      var totalSemanas = Math.floor(totalDias / 7);
      showResult(card,
        '<div class="result-value">' + T.diferenca + ': ' + diffText + '</div>' +
        '<div class="result-extra">' + T.totalDias + ': <strong>' + totalDias.toLocaleString(localeFor(lang)) + '</strong></div>' +
        '<div class="result-extra">' + T.totalSemanas + ': <strong>' + totalSemanas.toLocaleString(localeFor(lang)) + '</strong></div>'
      );
    });
  }

  // ---------------------------------------------------------- BILL SPLIT
  function initBillSplit(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var valorTotal = parseFloat(document.getElementById('valorTotal').value);
      var pessoas = parseInt(document.getElementById('pessoas').value, 10);
      var gorjetaPct = parseFloat(document.getElementById('gorjeta').value) || 0;
      if (!valorTotal || valorTotal <= 0 || !pessoas || pessoas < 1) { alert(T.error); return; }
      var gorjetaValor = round2(valorTotal * (gorjetaPct / 100));
      var total = round2(valorTotal + gorjetaValor);
      var porPessoa = round2(total / pessoas);
      showResult(card,
        '<div class="result-extra">' + T.valorGorjeta + ': <strong>' + fmtNum(gorjetaValor, lang) + '</strong></div>' +
        '<div class="result-extra">' + T.totalComGorjeta + ': <strong>' + fmtNum(total, lang) + '</strong></div>' +
        '<div class="result-value">' + T.porPessoa + ': ' + fmtNum(porPessoa, lang) + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- FUEL EFFICIENCY
  function initFuelEfficiency(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var distancia = parseFloat(document.getElementById('distancia').value);
      var litros = parseFloat(document.getElementById('litros').value);
      var precoStr = document.getElementById('precoLitro').value;
      if (!distancia || distancia <= 0 || !litros || litros <= 0) { alert(T.error); return; }
      var kmPorLitro = distancia / litros;
      var litrosPor100km = (litros / distancia) * 100;
      var html = '<div class="result-value">' + T.kmPorLitro + ': ' + fmtNum(kmPorLitro, lang) + '</div>' +
        '<div class="result-extra">' + T.litrosPor100km + ': <strong>' + fmtNum(litrosPor100km, lang) + '</strong></div>';
      if (precoStr !== '') {
        var preco = parseFloat(precoStr);
        if (preco > 0) {
          var custoPorKm = round2((litros * preco) / distancia);
          var custoTotal = round2(litros * preco);
          html += '<div class="result-extra">' + T.custoPorKm + ': <strong>' + fmtNum(custoPorKm, lang, 3) + '</strong></div>' +
            '<div class="result-extra">' + T.custoTotal + ': <strong>' + fmtNum(custoTotal, lang) + '</strong></div>';
        }
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- ÁLCOOL X GASOLINA (só PT)
  function initAlcoolGasolina(card, T) {
    on(card, 'calc', function () {
      var precoGasolina = parseFloat(document.getElementById('precoGasolina').value);
      var precoAlcool = parseFloat(document.getElementById('precoAlcool').value);
      if (!precoGasolina || precoGasolina <= 0 || !precoAlcool || precoAlcool <= 0) { alert(T.error); return; }
      var razao = precoAlcool / precoGasolina;
      var razaoPct = (razao * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      var compensaAlcool = razao <= 0.70;
      var recomendacao = compensaAlcool ? T.recomendaAlcool : T.recomendaGasolina;
      var texto = (compensaAlcool ? T.textoAlcool : T.textoGasolina).replace('{razao}', razaoPct);
      showResult(card,
        '<div class="result-value">' + recomendacao + '</div>' +
        '<div class="result-extra">' + T.razao + ': <strong>' + razaoPct + '%</strong></div>' +
        '<div class="result-note">' + texto + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- UUID GENERATOR
  function uuidV4() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = [];
    for (var i = 0; i < 256; i++) hex.push((i < 16 ? '0' : '') + i.toString(16));
    var b = bytes;
    return hex[b[0]] + hex[b[1]] + hex[b[2]] + hex[b[3]] + '-' +
      hex[b[4]] + hex[b[5]] + '-' + hex[b[6]] + hex[b[7]] + '-' +
      hex[b[8]] + hex[b[9]] + '-' + hex[b[10]] + hex[b[11]] + hex[b[12]] + hex[b[13]] + hex[b[14]] + hex[b[15]];
  }
  function initUuidGenerator(card, T) {
    on(card, 'generate', function () {
      var quantidade = Math.min(50, Math.max(1, parseInt(document.getElementById('quantidade').value, 10) || 1));
      var formato = document.getElementById('formato').value;
      var lines = [];
      for (var i = 0; i < quantidade; i++) {
        var u = uuidV4();
        if (formato === 'sem-hifen') u = u.replace(/-/g, '');
        if (formato === 'maiusculo') u = u.toUpperCase();
        lines.push(u);
      }
      var texto = lines.join('\n');
      showResult(card,
        '<pre class="code-output">' + lines.map(function (l) { return escHtml(l); }).join('\n') + '</pre>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- QR CODE GENERATOR
  function initQrCodeGenerator(card, T) {
    on(card, 'generate', function () {
      var texto = document.getElementById('texto').value;
      if (!texto) { alert(T.error); return; }
      var tamanho = document.getElementById('tamanho').value;
      var nivel = document.getElementById('nivel').value || 'M';
      var cellSize = { pequeno: 4, medio: 6, grande: 8 }[tamanho] || 6;
      var qr;
      try {
        qr = qrcode(0, nivel);
        qr.addData(texto);
        qr.make();
      } catch (e) {
        alert(T.errorTooLong || T.error);
        return;
      }
      var moduleCount = qr.getModuleCount();
      var size = moduleCount * cellSize;
      showResult(card,
        '<canvas data-role="qr-canvas" width="' + size + '" height="' + size + '" style="max-width:100%;height:auto;"></canvas>' +
        '<button type="button" class="btn-secondary" data-download>' + (T.download || T.copy) + '</button>'
      );
      var canvas = card.querySelector('[data-role="qr-canvas"]');
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      qr.renderTo2dContext(ctx, cellSize);
      var downloadBtn = card.querySelector('[data-download]');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
          var a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'qrcode.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }
    });
  }

  // ---------------------------------------------------------- LOREM IPSUM GENERATOR
  var LOREM_WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore ' +
    'et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo ' +
    'consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint ' +
    'occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum').split(' ');
  function randomLoremWord() { return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]; }
  function randomLoremSentence() {
    var len = 6 + Math.floor(Math.random() * 9);
    var words = [];
    for (var i = 0; i < len; i++) words.push(randomLoremWord());
    var sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  }
  function randomLoremParagraph() {
    var numSentences = 4 + Math.floor(Math.random() * 4);
    var sentences = [];
    for (var i = 0; i < numSentences; i++) sentences.push(randomLoremSentence());
    return sentences.join(' ');
  }
  function initLoremIpsumGenerator(card, T) {
    on(card, 'generate', function () {
      var quantidade = Math.min(50, Math.max(1, parseInt(document.getElementById('quantidade').value, 10) || 1));
      var tipo = document.getElementById('tipo').value;
      var texto;
      if (tipo === 'palavras') {
        var words = [];
        for (var i = 0; i < quantidade; i++) words.push(randomLoremWord());
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        texto = words.join(' ') + '.';
      } else if (tipo === 'frases') {
        var sentences = [];
        for (var j = 0; j < quantidade; j++) sentences.push(randomLoremSentence());
        texto = sentences.join(' ');
      } else {
        var paragraphs = [];
        for (var k = 0; k < quantidade; k++) paragraphs.push(randomLoremParagraph());
        texto = paragraphs.join('\n\n');
      }
      showResult(card,
        '<pre class="code-output">' + escHtml(texto) + '</pre>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- HASH GENERATOR
  function bufferToHex(buffer) {
    var bytes = new Uint8Array(buffer);
    var hex = '';
    for (var i = 0; i < bytes.length; i++) hex += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return hex;
  }
  function initHashGenerator(card, T) {
    on(card, 'generate', async function () {
      var texto = document.getElementById('texto').value;
      var algoritmo = document.getElementById('algoritmo').value;
      if (texto === '') { alert(T.error); return; }
      var hash;
      try {
        if (algoritmo === 'MD5') {
          hash = window.md5(texto);
        } else {
          var algoMap = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-512': 'SHA-512' };
          var buffer = await window.crypto.subtle.digest(algoMap[algoritmo], new TextEncoder().encode(texto));
          hash = bufferToHex(buffer);
        }
      } catch (e) {
        alert(T.error);
        return;
      }
      showResult(card,
        '<pre class="code-output">' + escHtml(hash) + '</pre>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(hash, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- RANDOM NUMBER GENERATOR
  function initRandomNumberGenerator(card, T) {
    on(card, 'generate', function () {
      var min = parseFloat(document.getElementById('min').value);
      var max = parseFloat(document.getElementById('max').value);
      var quantidade = Math.min(50, Math.max(1, parseInt(document.getElementById('quantidade').value, 10) || 1));
      var decimais = document.getElementById('decimais').checked;
      var semRepetir = document.getElementById('semRepetir').checked;
      if (isNaN(min) || isNaN(max) || min >= max) { alert(T.error); return; }
      var results = [];
      if (decimais) {
        for (var i = 0; i < quantidade; i++) {
          results.push(round2(min + Math.random() * (max - min)));
        }
      } else {
        var lo = Math.ceil(min), hi = Math.floor(max);
        var rangeSize = hi - lo + 1;
        if (semRepetir) {
          if (rangeSize < quantidade) { alert(T.errorRange); return; }
          var pool = [];
          for (var n = lo; n <= hi; n++) pool.push(n);
          for (var s = pool.length - 1; s > 0; s--) {
            var j2 = Math.floor(Math.random() * (s + 1));
            var tmp = pool[s]; pool[s] = pool[j2]; pool[j2] = tmp;
          }
          results = pool.slice(0, quantidade);
        } else {
          for (var k = 0; k < quantidade; k++) {
            results.push(lo + Math.floor(Math.random() * rangeSize));
          }
        }
      }
      var texto = results.join(', ');
      showResult(card,
        '<div class="result-value">' + escHtml(texto) + '</div>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- RG GENERATOR (PT)
  function gerarRG() {
    var digits = [];
    for (var i = 0; i < 8; i++) digits.push(Math.floor(Math.random() * 10));
    var weights = [9, 8, 7, 6, 5, 4, 3, 2];
    var soma = 0;
    for (var j = 0; j < 8; j++) soma += digits[j] * weights[j];
    var resto = soma % 11;
    var dv = resto === 10 ? 'X' : String(resto);
    return { base: digits.join(''), dv: dv };
  }
  function initRgGenerator(card, T) {
    on(card, 'generate', function () {
      var rg = gerarRG();
      var formato = document.getElementById('formato').value;
      var texto;
      if (formato === 'mascara') {
        var b = rg.base;
        texto = b.substr(0, 2) + '.' + b.substr(2, 3) + '.' + b.substr(5, 3) + '-' + rg.dv;
      } else {
        texto = rg.base + rg.dv;
      }
      showResult(card,
        '<span class="result-value">' + texto + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- PLACA GENERATOR (PT)
  function randomLetter() { return String.fromCharCode(65 + Math.floor(Math.random() * 26)); }
  function randomDigit() { return String(Math.floor(Math.random() * 10)); }
  function gerarPlacaMercosul() {
    return randomLetter() + randomLetter() + randomLetter() + randomDigit() + randomLetter() + randomDigit() + randomDigit();
  }
  function gerarPlacaAntiga() {
    return randomLetter() + randomLetter() + randomLetter() + '-' + randomDigit() + randomDigit() + randomDigit() + randomDigit();
  }
  function initPlacaGenerator(card, T) {
    on(card, 'generate', function () {
      var tipo = document.getElementById('tipo').value;
      var texto = tipo === 'antiga' ? gerarPlacaAntiga() : gerarPlacaMercosul();
      showResult(card,
        '<span class="result-value">' + texto + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- PIS/PASEP GENERATOR (PT)
  function gerarPIS() {
    var digits = [];
    for (var i = 0; i < 10; i++) digits.push(Math.floor(Math.random() * 10));
    var weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    var soma = 0;
    for (var j = 0; j < 10; j++) soma += digits[j] * weights[j];
    var resto = soma % 11;
    var dv = 11 - resto;
    if (dv >= 10) dv = 0;
    return digits.join('') + dv;
  }
  function initPisPasepGenerator(card, T) {
    on(card, 'generate', function () {
      var pis = gerarPIS();
      var formato = document.getElementById('formato').value;
      var texto = formato === 'mascara'
        ? pis.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4')
        : pis;
      showResult(card,
        '<span class="result-value">' + texto + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- CARTÃO DE TESTE GENERATOR (PT)
  function luhnCheckDigit(digits) {
    var sum = 0, alt = true;
    for (var i = digits.length - 1; i >= 0; i--) {
      var d = digits[i];
      if (alt) { d = d * 2; if (d > 9) d -= 9; }
      sum += d;
      alt = !alt;
    }
    return (10 - (sum % 10)) % 10;
  }
  function gerarCartaoTeste(bandeira) {
    var prefix, length;
    if (bandeira === 'mastercard') {
      prefix = ['51', '52', '53', '54', '55'][Math.floor(Math.random() * 5)];
      length = 16;
    } else if (bandeira === 'amex') {
      prefix = Math.random() < 0.5 ? '34' : '37';
      length = 15;
    } else {
      prefix = '4';
      length = 16;
    }
    var digits = prefix.split('').map(Number);
    while (digits.length < length - 1) digits.push(Math.floor(Math.random() * 10));
    var dv = luhnCheckDigit(digits);
    digits.push(dv);
    return digits.join('');
  }
  function formatCartao(numero) {
    if (numero.length === 15) return numero.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    return numero.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }
  function initCartaoTesteGenerator(card, T) {
    on(card, 'generate', function () {
      var bandeira = document.getElementById('bandeira').value;
      var quantidade = Math.min(10, Math.max(1, parseInt(document.getElementById('quantidade').value, 10) || 1));
      var lines = [];
      for (var i = 0; i < quantidade; i++) lines.push(formatCartao(gerarCartaoTeste(bandeira)));
      var texto = lines.join('\n');
      showResult(card,
        '<pre class="code-output code-output-lg">' + lines.map(function (l) { return escHtml(l); }).join('\n') + '</pre>' +
        '<div class="result-note">' + T.notice + '</div>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- NUMBER BASE CONVERTER
  function initBaseConverter(card, T) {
    var validPattern = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9a-fA-F]+$/ };
    on(card, 'calc', function () {
      var raw = (document.getElementById('numero').value || '').trim();
      var base = parseInt(document.getElementById('baseOrigem').value, 10);
      var cleaned = base === 16 ? raw.replace(/^0x/i, '') : raw;
      if (!cleaned || !validPattern[base].test(cleaned)) { alert(T.error); return; }
      var n = parseInt(cleaned, base);
      if (isNaN(n) || n < 0) { alert(T.error); return; }
      var rows = [
        ['bin', n.toString(2)],
        ['oct', n.toString(8)],
        ['dec', n.toString(10)],
        ['hex', n.toString(16).toUpperCase()],
      ];
      var html = '<table class="result-table"><tbody>' +
        rows.map(function (r) { return '<tr><td>' + T.baseLabels[r[0]] + '</td><td class="result-value" style="font-size:1rem">' + r[1] + '</td></tr>'; }).join('') +
        '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- JWT DECODER
  function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    var bin = atob(str);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }
  function initJwtDecoder(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'decode', function () {
      var token = (input.value || '').trim();
      var parts = token.split('.');
      if (parts.length < 2) {
        showStatus(card, T.error, 'err');
        card.querySelector('[data-role="result"]').classList.remove('show');
        return;
      }
      try {
        var header = JSON.parse(base64UrlDecode(parts[0]));
        var payload = JSON.parse(base64UrlDecode(parts[1]));
        var extra = '';
        if (payload.exp) {
          var expDate = new Date(payload.exp * 1000);
          var expired = expDate.getTime() < Date.now();
          extra += '<div class="result-note">' + T.expLabel + ': ' + expDate.toLocaleString() + (expired ? ' — ' + T.expiredMsg : ' — ' + T.validMsg) + '</div>';
        }
        if (payload.iat) {
          extra += '<div class="result-note">' + T.iatLabel + ': ' + new Date(payload.iat * 1000).toLocaleString() + '</div>';
        }
        var html =
          '<div class="result-extra" style="width:100%"><strong>' + T.headerLabel + '</strong>' +
          '<pre class="code-output">' + escHtml(JSON.stringify(header, null, 2)) + '</pre></div>' +
          '<div class="result-extra" style="width:100%; margin-top:12px"><strong>' + T.payloadLabel + '</strong>' +
          '<pre class="code-output">' + escHtml(JSON.stringify(payload, null, 2)) + '</pre></div>' +
          extra;
        showResult(card, html);
        showStatus(card, T.decodedMsg, 'ok');
      } catch (e) {
        showStatus(card, T.error, 'err');
        card.querySelector('[data-role="result"]').classList.remove('show');
      }
    });
    on(card, 'clear', function () {
      input.value = '';
      card.querySelector('[data-role="result"]').classList.remove('show');
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- UNIX TIMESTAMP CONVERTER
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function toLocalInputValue(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + 'T' + pad2(date.getHours()) + ':' + pad2(date.getMinutes());
  }
  function initTimestampConverter(card, T) {
    var tsInput = document.getElementById('tsInput');
    var dtInput = document.getElementById('dtInput');
    on(card, 'now', function () {
      tsInput.value = Math.floor(Date.now() / 1000);
    });
    on(card, 'toDate', function () {
      var raw = (tsInput.value || '').trim();
      var n = parseInt(raw, 10);
      if (!raw || isNaN(n)) { alert(T.error); return; }
      var ms = raw.length > 11 ? n : n * 1000;
      var d = new Date(ms);
      if (isNaN(d.getTime())) { alert(T.error); return; }
      var box = card.querySelector('[data-role="resultDate"]');
      box.innerHTML =
        '<div class="result-extra" style="width:100%">' +
        '<div class="result-value" style="font-size:1.1rem">' + d.toLocaleString() + '</div>' +
        '<div class="result-note">UTC (ISO 8601): ' + d.toISOString() + '</div>' +
        '</div>';
      box.classList.add('show');
    });
    on(card, 'toTimestamp', function () {
      var val = dtInput.value;
      if (!val) { alert(T.error); return; }
      var d = new Date(val);
      if (isNaN(d.getTime())) { alert(T.error); return; }
      var ts = Math.floor(d.getTime() / 1000);
      var box = card.querySelector('[data-role="resultTimestamp"]');
      box.innerHTML =
        '<span class="result-value">' + ts + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>';
      box.classList.add('show');
      var copyBtn = box.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(String(ts), T, copyBtn); });
    });
    // pré-preenche com o horário atual como conveniência
    tsInput.value = Math.floor(Date.now() / 1000);
    dtInput.value = toLocalInputValue(new Date());
  }

  // ---------------------------------------------------------- CASE CONVERTER
  function splitWordsForCase(str) {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(function (w) { return w.toLowerCase(); });
  }
  function initCaseConverter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'calc', function () {
      var text = input.value;
      if (!text || !text.trim()) { showResult(card, '<div class="result-extra">' + T.error + '</div>'); return; }
      var words = splitWordsForCase(text);
      if (!words.length) { showResult(card, '<div class="result-extra">' + T.error + '</div>'); return; }
      var camel = words.map(function (w, i) { return i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1); }).join('');
      var pascal = words.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('');
      var snake = words.join('_');
      var kebab = words.join('-');
      var constant = words.join('_').toUpperCase();
      var title = words.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
      var sentence = words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1);
      var rows = [
        ['camelCase', camel], ['PascalCase', pascal], ['snake_case', snake],
        ['kebab-case', kebab], ['CONSTANT_CASE', constant], ['Title Case', title], ['Sentence case', sentence],
      ];
      var html = '<table class="result-table"><tbody>' +
        rows.map(function (r) {
          return '<tr><td style="white-space:nowrap">' + r[0] + '</td><td style="font-family:ui-monospace,monospace">' + escHtml(r[1]) + '</td>' +
            '<td><button type="button" class="copy-btn" data-copy-val="' + escHtml(r[1]) + '" style="padding:4px 10px;font-size:.78rem">' + T.copy + '</button></td></tr>';
        }).join('') + '</tbody></table>';
      showResult(card, html);
      card.querySelectorAll('[data-copy-val]').forEach(function (btn) {
        btn.addEventListener('click', function () { copyText(btn.getAttribute('data-copy-val'), T, btn); });
      });
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="result"]');
      box.innerHTML = '';
      box.classList.remove('show');
    });
  }

  // ---------------------------------------------------------- STRING ESCAPE / UNESCAPE
  function initStringEscape(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      output.value = JSON.stringify(input.value);
    });
    on(card, 'decode', function () {
      try {
        var raw = input.value.trim();
        var toParse = /^".*"$/s.test(raw) ? raw : '"' + raw + '"';
        output.value = JSON.parse(toParse);
      } catch (e) {
        showStatus(card, T.error, 'err');
        return;
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- SLUG GENERATOR
  function toSlug(text) {
    return text
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  function initSlugGenerator(card, T) {
    on(card, 'generate', function () {
      var texto = document.getElementById('texto').value || '';
      var slug = toSlug(texto);
      if (!slug) { alert(T.error); return; }
      showResult(card,
        '<span class="result-value">' + slug + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(slug, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- CSV <-> JSON
  function parseCSVLine(line) {
    var out = [], cur = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { cur += ch; }
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ',') { out.push(cur); cur = ''; }
        else cur += ch;
      }
    }
    out.push(cur);
    return out;
  }
  function csvToJson(text) {
    var lines = text.replace(/\r\n/g, '\n').split('\n').filter(function (l) { return l.length > 0; });
    if (!lines.length) return [];
    var headers = parseCSVLine(lines[0]);
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      var cells = parseCSVLine(lines[i]);
      var obj = {};
      headers.forEach(function (h, idx) { obj[h] = cells[idx] !== undefined ? cells[idx] : ''; });
      rows.push(obj);
    }
    return rows;
  }
  function csvCell(v) {
    var s = v === null || v === undefined ? '' : String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  function jsonToCsv(arr) {
    if (!Array.isArray(arr) || !arr.length) return '';
    var headers = [];
    arr.forEach(function (obj) {
      Object.keys(obj).forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k); });
    });
    var lines = [headers.map(csvCell).join(',')];
    arr.forEach(function (obj) {
      lines.push(headers.map(function (h) { return csvCell(obj[h]); }).join(','));
    });
    return lines.join('\n');
  }
  function initCsvJsonConverter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      try {
        var rows = csvToJson(input.value);
        output.value = JSON.stringify(rows, null, 2);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'decode', function () {
      try {
        var arr = JSON.parse(input.value);
        output.value = jsonToCsv(arr);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- REGEX TESTER
  function initRegexTester(card, T) {
    var patternEl = document.getElementById('regexPattern');
    var flagsEl = document.getElementById('regexFlags');
    var inputEl = document.getElementById('regexInput');
    function run() {
      var pattern = patternEl.value;
      var flags = flagsEl.value.replace(/[^gimsuy]/g, '');
      var text = inputEl.value;
      var resultBox = card.querySelector('[data-role="result"]');
      if (!pattern) {
        resultBox.classList.remove('show');
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
        return;
      }
      var re;
      try {
        re = new RegExp(pattern, flags.indexOf('g') === -1 ? flags + 'g' : flags);
      } catch (e) {
        showStatus(card, T.invalidRegex + e.message, 'err');
        resultBox.classList.remove('show');
        return;
      }
      var matches = [];
      var m;
      var guard = 0;
      re.lastIndex = 0;
      while ((m = re.exec(text)) !== null && guard < 5000) {
        matches.push(m);
        guard++;
        if (m[0] === '') re.lastIndex++;
      }
      var html = '';
      var last = 0;
      matches.forEach(function (mm) {
        html += escHtml(text.slice(last, mm.index));
        html += '<mark>' + escHtml(mm[0] === '' ? ' ' : mm[0]) + '</mark>';
        last = mm.index + mm[0].length;
      });
      html += escHtml(text.slice(last));
      var groupsHtml = '';
      if (matches.length) {
        var rows = matches.slice(0, 200).map(function (mm, idx) {
          var groups = mm.slice(1).map(function (g, gi) { return (gi + 1) + '=' + (g === undefined ? '—' : escHtml(g)); }).join(', ');
          return '<tr><td>' + (idx + 1) + '</td><td>' + escHtml(mm[0]) + '</td><td>' + (groups || '—') + '</td></tr>';
        }).join('');
        groupsHtml = '<table class="result-table"><thead><tr><th>#</th><th>' + T.matchHeader + '</th><th>' + T.groupsHeader + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      }
      showResult(card,
        '<div class="regex-highlight">' + (text ? html : '') + '</div>' +
        '<div class="result-extra">' + T.matchCountLabel + ': ' + matches.length + '</div>' +
        groupsHtml
      );
      var stBox = card.querySelector('[data-role="status"]');
      stBox.className = 'status-box';
    }
    patternEl.addEventListener('input', run);
    flagsEl.addEventListener('input', run);
    inputEl.addEventListener('input', run);
  }

  // ---------------------------------------------------------- DIFF CHECKER
  function computeLineDiff(a, b) {
    var n = a.length, m = b.length;
    var dp = [];
    for (var i = 0; i <= n; i++) dp.push(new Int32Array(m + 1));
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var ops = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { ops.push(['ctx', a[i]]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(['rem', a[i]]); i++; }
      else { ops.push(['add', b[j]]); j++; }
    }
    while (i < n) { ops.push(['rem', a[i]]); i++; }
    while (j < m) { ops.push(['add', b[j]]); j++; }
    return ops;
  }
  function initDiffChecker(card, T) {
    on(card, 'calc', function () {
      var a = document.getElementById('diffA').value.replace(/\r\n/g, '\n').split('\n');
      var b = document.getElementById('diffB').value.replace(/\r\n/g, '\n').split('\n');
      if (a.length * b.length > 4000000) {
        showStatus(card, T.tooLarge, 'err');
        return;
      }
      var ops = computeLineDiff(a, b);
      var added = 0, removed = 0;
      var html = ops.map(function (op) {
        if (op[0] === 'add') { added++; return '<div class="diff-line diff-add">+ ' + escHtml(op[1]) + '</div>'; }
        if (op[0] === 'rem') { removed++; return '<div class="diff-line diff-remove">− ' + escHtml(op[1]) + '</div>'; }
        return '<div class="diff-line diff-context">&nbsp; ' + escHtml(op[1]) + '</div>';
      }).join('');
      showResult(card,
        '<div class="diff-output">' + html + '</div>' +
        '<div class="result-extra">' + T.addedLabel + ': +' + added + ' · ' + T.removedLabel + ': −' + removed + '</div>'
      );
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
    on(card, 'clear', function () {
      document.getElementById('diffA').value = '';
      document.getElementById('diffB').value = '';
      var rbox = card.querySelector('[data-role="result"]');
      rbox.innerHTML = '';
      rbox.classList.remove('show');
    });
  }

  // ---------------------------------------------------------- CODE FORMATTER (JS/CSS/HTML)
  function initCodeFormatter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'format', function () {
      var lang = document.getElementById('linguagem').value;
      try {
        var opts = { indent_size: 2 };
        var out;
        if (lang === 'css') out = window.beautifier.css(input.value, opts);
        else if (lang === 'html') out = window.beautifier.html(input.value, opts);
        else out = window.beautifier.js(input.value, opts);
        input.value = out;
        showStatus(card, T.formattedMsg, 'ok');
      } catch (e) {
        showStatus(card, T.invalidPrefix + e.message, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(input.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- SQL FORMATTER
  function initSqlFormatter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'format', function () {
      try {
        input.value = window.sqlFormatter.format(input.value, { language: 'sql' });
        showStatus(card, T.formattedMsg, 'ok');
      } catch (e) {
        showStatus(card, T.invalidPrefix + e.message, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(input.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- YAML <-> JSON
  function initYamlJsonConverter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      try {
        var obj = window.jsyaml.load(input.value);
        output.value = JSON.stringify(obj, null, 2);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'decode', function () {
      try {
        var obj = JSON.parse(input.value);
        output.value = window.jsyaml.dump(obj);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- XML <-> JSON
  function xmlNodeToObj(node) {
    var obj = {};
    if (node.attributes) {
      for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        obj['@' + attr.name] = attr.value;
      }
    }
    var children = Array.prototype.filter.call(node.childNodes, function (n) { return n.nodeType === 1; });
    var textContent = Array.prototype.filter.call(node.childNodes, function (n) { return n.nodeType === 3; })
      .map(function (n) { return n.nodeValue; }).join('').trim();
    if (!children.length) {
      if (Object.keys(obj).length) {
        if (textContent) obj['#text'] = textContent;
        return obj;
      }
      return textContent;
    }
    children.forEach(function (child) {
      var val = xmlNodeToObj(child);
      if (obj[child.tagName] === undefined) obj[child.tagName] = val;
      else if (Array.isArray(obj[child.tagName])) obj[child.tagName].push(val);
      else obj[child.tagName] = [obj[child.tagName], val];
    });
    return obj;
  }
  function objToXmlInner(obj) {
    if (obj === null || obj === undefined) return '';
    if (typeof obj !== 'object') return escHtml(String(obj));
    var xml = '';
    Object.keys(obj).forEach(function (key) {
      if (key.charAt(0) === '@' || key === '#text') return;
      var val = obj[key];
      var values = Array.isArray(val) ? val : [val];
      values.forEach(function (v) {
        var attrs = '';
        if (v && typeof v === 'object') {
          Object.keys(v).forEach(function (k2) {
            if (k2.charAt(0) === '@') attrs += ' ' + k2.slice(1) + '="' + escHtml(String(v[k2])) + '"';
          });
        }
        var inner = (v && typeof v === 'object') ? ((v['#text'] !== undefined ? escHtml(String(v['#text'])) : '') + objToXmlInner(v)) : objToXmlInner(v);
        xml += '<' + key + attrs + '>' + inner + '</' + key + '>';
      });
    });
    return xml;
  }
  function initXmlJsonConverter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(input.value, 'application/xml');
        if (doc.querySelector('parsererror')) throw new Error('invalid XML');
        var root = doc.documentElement;
        var obj = {};
        obj[root.tagName] = xmlNodeToObj(root);
        output.value = JSON.stringify(obj, null, 2);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'decode', function () {
      try {
        var obj = JSON.parse(input.value);
        var keys = Object.keys(obj);
        if (keys.length !== 1) throw new Error('expected single root key');
        output.value = '<?xml version="1.0" encoding="UTF-8"?>\n' + objToXmlInner(obj);
        var box = card.querySelector('[data-role="status"]');
        box.className = 'status-box';
      } catch (e) {
        showStatus(card, T.error, 'err');
      }
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- CIDR / SUBNET CALCULATOR
  function ipToInt(ip) {
    var parts = ip.split('.');
    if (parts.length !== 4) return null;
    var n = 0;
    for (var i = 0; i < 4; i++) {
      var p = parseInt(parts[i], 10);
      if (isNaN(p) || p < 0 || p > 255 || String(p) !== parts[i].replace(/^0+(?=\d)/, '')) return null;
      n = n * 256 + p;
    }
    return n >>> 0;
  }
  function intToIp(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  }
  function initCidrCalculator(card, T) {
    on(card, 'calc', function () {
      var raw = (document.getElementById('cidr').value || '').trim();
      var parts = raw.split('/');
      if (parts.length !== 2) { alert(T.error); return; }
      var ip = ipToInt(parts[0]);
      var prefix = parseInt(parts[1], 10);
      if (ip === null || isNaN(prefix) || prefix < 0 || prefix > 32) { alert(T.error); return; }
      var maskInt = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
      var network = (ip & maskInt) >>> 0;
      var broadcast = (network | (~maskInt >>> 0)) >>> 0;
      var totalHosts = Math.pow(2, 32 - prefix);
      var usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
      var firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
      var lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
      var rows = [
        [T.rowNetwork, intToIp(network)],
        [T.rowBroadcast, intToIp(broadcast)],
        [T.rowNetmask, intToIp(maskInt)],
        [T.rowWildcard, intToIp((~maskInt) >>> 0)],
        [T.rowFirstHost, intToIp(firstHost)],
        [T.rowLastHost, intToIp(lastHost)],
        [T.rowTotalHosts, totalHosts.toLocaleString()],
        [T.rowUsableHosts, usableHosts.toLocaleString()],
      ];
      var html = '<table class="result-table"><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="result-value" style="font-size:1rem">' + r[1] + '</td></tr>'; }).join('') +
        '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- USER-AGENT PARSER
  function parseUserAgent(ua) {
    var os = 'Desconhecido';
    if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
    else if (/Windows NT/.test(ua)) os = 'Windows';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'Linux';

    var browser = 'Desconhecido', version = '';
    var m;
    if ((m = ua.match(/Edg\/([\d.]+)/))) { browser = 'Microsoft Edge'; version = m[1]; }
    else if ((m = ua.match(/OPR\/([\d.]+)/))) { browser = 'Opera'; version = m[1]; }
    else if ((m = ua.match(/Chrome\/([\d.]+)/)) && !/Chromium/.test(ua)) { browser = 'Chrome'; version = m[1]; }
    else if ((m = ua.match(/Firefox\/([\d.]+)/))) { browser = 'Firefox'; version = m[1]; }
    else if ((m = ua.match(/Version\/([\d.]+).*Safari/))) { browser = 'Safari'; version = m[1]; }
    else if ((m = ua.match(/MSIE ([\d.]+)/)) || (m = ua.match(/rv:([\d.]+)\) like Gecko/))) { browser = 'Internet Explorer'; version = m[1]; }

    var engine = 'Desconhecido';
    if (/AppleWebKit/.test(ua)) engine = /Gecko\)/.test(ua) === false && /Chrome|Safari/.test(ua) ? 'WebKit/Blink' : 'WebKit';
    if (/Gecko\//.test(ua)) engine = 'Gecko';
    if (/Trident/.test(ua)) engine = 'Trident';

    var device = /Mobi|Android.*Mobile|iPhone/.test(ua) ? 'Celular' : (/iPad|Tablet/.test(ua) ? 'Tablet' : 'Desktop');

    return { os: os, browser: browser, version: version || '—', engine: engine, device: device };
  }
  function initUserAgentParser(card, T) {
    var input = card.querySelector('[data-role="input"]');
    if (!input.value) input.value = navigator.userAgent;
    on(card, 'calc', function () {
      var ua = input.value.trim();
      if (!ua) { showResult(card, '<div class="result-extra">' + T.error + '</div>'); return; }
      var info = parseUserAgent(ua);
      var rows = [
        [T.rowBrowser, info.browser], [T.rowVersion, info.version], [T.rowEngine, info.engine],
        [T.rowOs, info.os], [T.rowDevice, info.device],
      ];
      var html = '<table class="result-table"><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + escHtml(r[1]) + '</td></tr>'; }).join('') +
        '</tbody></table>';
      showResult(card, html);
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="result"]');
      box.innerHTML = '';
      box.classList.remove('show');
    });
  }

  // ---------------------------------------------------------- CRON EXPLAINER
  function initCronExplainer(card, T) {
    on(card, 'calc', function () {
      var expr = (document.getElementById('expressao').value || '').trim();
      if (!expr) { alert(T.error); return; }
      var lang = card.dataset.lang;
      var locale = lang === 'pt' ? 'pt_BR' : (lang === 'es' ? 'es' : 'en');
      try {
        var desc = window.cronstrue.toString(expr, { locale: locale });
        showResult(card, '<div class="result-value" style="font-size:1.2rem">' + escHtml(desc) + '</div>');
      } catch (e) {
        alert(T.invalidCron);
      }
    });
  }

  // ---------------------------------------------------------- LINE SORTER / DEDUPE
  function initLineSorter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    function report(count) {
      showStatus(card, count, 'ok');
    }
    on(card, 'sortAsc', function () {
      var lines = input.value.split('\n');
      lines.sort(function (a, b) { return a.localeCompare(b); });
      input.value = lines.join('\n');
      report(T.linesLabel + ': ' + lines.length);
    });
    on(card, 'sortDesc', function () {
      var lines = input.value.split('\n');
      lines.sort(function (a, b) { return b.localeCompare(a); });
      input.value = lines.join('\n');
      report(T.linesLabel + ': ' + lines.length);
    });
    on(card, 'dedupe', function () {
      var lines = input.value.split('\n');
      var seen = {};
      var unique = [];
      lines.forEach(function (l) { if (!Object.prototype.hasOwnProperty.call(seen, l)) { seen[l] = true; unique.push(l); } });
      var removed = lines.length - unique.length;
      input.value = unique.join('\n');
      report(T.removedDuplicatesLabel + ': ' + removed);
    });
    on(card, 'removeEmpty', function () {
      var lines = input.value.split('\n');
      var filtered = lines.filter(function (l) { return l.trim() !== ''; });
      var removed = lines.length - filtered.length;
      input.value = filtered.join('\n');
      report(T.removedEmptyLabel + ': ' + removed);
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(input.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- ROMAN NUMERAL CONVERTER
  var ROMAN_MAP = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  function decimalToRoman(n) {
    var result = '';
    ROMAN_MAP.forEach(function (pair) {
      while (n >= pair[0]) { result += pair[1]; n -= pair[0]; }
    });
    return result;
  }
  function romanToDecimal(s) {
    var values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    if (!/^[IVXLCDM]+$/.test(s)) return null;
    var total = 0;
    for (var i = 0; i < s.length; i++) {
      var cur = values[s[i]];
      var next = values[s[i + 1]];
      if (next && cur < next) total -= cur; else total += cur;
    }
    if (decimalToRoman(total) !== s) return null;
    return total;
  }
  function initRomanNumeralConverter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var output = card.querySelector('[data-role="output"]');
    on(card, 'encode', function () {
      var n = parseInt(input.value, 10);
      if (isNaN(n) || n < 1 || n > 3999) { showStatus(card, T.error, 'err'); return; }
      output.value = decimalToRoman(n);
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
    on(card, 'decode', function () {
      var s = (input.value || '').trim().toUpperCase();
      var n = romanToDecimal(s);
      if (n === null) { showStatus(card, T.error, 'err'); return; }
      output.value = String(n);
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
    on(card, 'copy', function () {
      navigator.clipboard.writeText(output.value);
      showStatus(card, T.copiedMsg, 'ok');
    });
    on(card, 'clear', function () {
      input.value = '';
      output.value = '';
      var box = card.querySelector('[data-role="status"]');
      box.className = 'status-box';
    });
  }

  // ---------------------------------------------------------- WCAG CONTRAST CHECKER
  function relLuminance(hex) {
    var r = parseInt(hex.substr(1, 2), 16) / 255;
    var g = parseInt(hex.substr(3, 2), 16) / 255;
    var b = parseInt(hex.substr(5, 2), 16) / 255;
    function f(c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function contrastRatio(hex1, hex2) {
    var l1 = relLuminance(hex1), l2 = relLuminance(hex2);
    if (l1 < l2) { var t = l1; l1 = l2; l2 = t; }
    return (l1 + 0.05) / (l2 + 0.05);
  }
  function isValidHex(h) { return /^#[0-9a-fA-F]{6}$/.test(h); }
  function initContrastChecker(card, T) {
    var fgColor = document.getElementById('contrastFg');
    var fgHex = document.getElementById('contrastFgHex');
    var bgColor = document.getElementById('contrastBg');
    var bgHex = document.getElementById('contrastBgHex');
    function run() {
      var fg = fgHex.value, bg = bgHex.value;
      if (!isValidHex(fg) || !isValidHex(bg)) return;
      var ratio = contrastRatio(fg, bg);
      function badge(label, min) {
        var pass = ratio >= min;
        return '<span class="contrast-badge ' + (pass ? 'pass' : 'fail') + '">' + label + ' ' + (pass ? '✔' : '✘') + '</span>';
      }
      showResult(card,
        '<div class="contrast-preview" style="background:' + bg + ';color:' + fg + '">' + T.previewText + '</div>' +
        '<div class="contrast-ratio">' + ratio.toFixed(2) + ':1</div>' +
        '<div class="contrast-badges">' +
        badge('AA — ' + T.normalText, 4.5) + badge('AA — ' + T.largeText, 3) +
        badge('AAA — ' + T.normalText, 7) + badge('AAA — ' + T.largeText, 4.5) +
        '</div>'
      );
    }
    fgColor.addEventListener('input', function () { fgHex.value = fgColor.value; run(); });
    bgColor.addEventListener('input', function () { bgHex.value = bgColor.value; run(); });
    fgHex.addEventListener('input', function () { if (isValidHex(fgHex.value)) fgColor.value = fgHex.value; run(); });
    bgHex.addEventListener('input', function () { if (isValidHex(bgHex.value)) bgColor.value = bgHex.value; run(); });
    run();
  }


  // ---------------------------------------------------------- DOCUMENTOS E IMAGENS (PDF / OCR)
  function fmtPct(n) { return (n * 100).toFixed(0) + '%'; }

  function readFileAsArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function loadImageFromFile(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { resolve({ img: img, url: url }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('invalid image')); };
      img.src = url;
    });
  }

  // ---- Ferramentas multi-arquivo: Imagem -> PDF e Juntar PDF ----
  function initMultiFileTool(card, T, mode) {
    var box = card.querySelector('.multi-file-tool');
    var maxMb = parseFloat(box.dataset.maxMb) || 20;
    var maxBytes = maxMb * 1024 * 1024;
    var maxFiles = parseInt(box.dataset.maxFiles, 10) || 30;

    var dropzone = box.querySelector('[data-role="dropzone"]');
    var fileInput = document.getElementById('multiFile');
    var statusBox = box.querySelector('[data-role="status"]');
    var fileListEl = box.querySelector('[data-role="fileList"]');
    var fileListEmpty = box.querySelector('[data-role="fileListEmpty"]');
    var processBtn = box.querySelector('[data-role="processBtn"]');
    var downloadBtn = box.querySelector('[data-role="downloadBtn"]');

    var files = [];
    var resultObjectUrl = null;

    function setStatus(msg, kind) {
      if (!msg) { statusBox.className = 'status-box'; return; }
      statusBox.textContent = msg;
      statusBox.className = 'status-box show ' + kind;
    }

    function renderList() {
      fileListEl.innerHTML = '';
      fileListEmpty.style.display = files.length === 0 ? '' : 'none';
      files.forEach(function (f, idx) {
        var li = document.createElement('li');
        li.className = 'file-list-item';
        var nameSpan = document.createElement('span');
        nameSpan.className = 'file-name';
        nameSpan.textContent = (idx + 1) + '. ' + f.name;
        var sizeSpan = document.createElement('span');
        sizeSpan.className = 'file-size';
        sizeSpan.textContent = fmtBytes(f.size);
        var rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.className = 'file-remove';
        rmBtn.setAttribute('aria-label', 'x');
        rmBtn.textContent = '✕';
        rmBtn.addEventListener('click', function () {
          files.splice(idx, 1);
          renderList();
        });
        li.appendChild(nameSpan);
        li.appendChild(sizeSpan);
        li.appendChild(rmBtn);
        fileListEl.appendChild(li);
      });
      processBtn.disabled = files.length === 0;
      if (resultObjectUrl) { URL.revokeObjectURL(resultObjectUrl); resultObjectUrl = null; }
      downloadBtn.style.display = 'none';
      showResult(card, '');
      card.querySelector('[data-role="result"]').classList.remove('show');
    }

    function addFiles(fileArr) {
      for (var i = 0; i < fileArr.length; i++) {
        var f = fileArr[i];
        if (f.size > maxBytes) { setStatus(T.errorTooLarge, 'err'); continue; }
        if (files.length >= maxFiles) { setStatus(T.errorTooMany, 'err'); break; }
        files.push(f);
      }
      renderList();
      setStatus('', '');
    }

    dropzone.addEventListener('click', function () { fileInput.click(); });
    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files.length) addFiles(Array.prototype.slice.call(fileInput.files));
      fileInput.value = '';
    });
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.remove('drag-over'); });
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length) addFiles(Array.prototype.slice.call(dt.files));
    });

    on(card, 'reset', function () {
      files = [];
      renderList();
      setStatus('', '');
    });

    on(card, 'process', function () {
      processBtn.disabled = true;
      setStatus(T.processingStatus, 'ok');
      var run = mode === 'img2pdf' ? runImgToPdf() : runPdfMerge();
      run.then(function (blob) {
        if (resultObjectUrl) URL.revokeObjectURL(resultObjectUrl);
        resultObjectUrl = URL.createObjectURL(blob);
        downloadBtn.href = resultObjectUrl;
        downloadBtn.setAttribute('download', mode === 'img2pdf' ? 'imagens-convertidas.pdf' : 'pdf-unificado.pdf');
        downloadBtn.style.display = '';
        setStatus(T.doneStatus, 'ok');
        processBtn.disabled = false;
      }).catch(function (err) {
        setStatus(T.errorProcess + (err && err.message ? ' (' + err.message + ')' : ''), 'err');
        processBtn.disabled = false;
      });
    });

    async function runImgToPdf() {
      var pdfDoc = await PDFLib.PDFDocument.create();
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var bytes = await readFileAsArrayBuffer(file);
        var embedded;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          embedded = await pdfDoc.embedJpg(bytes);
        } else if (file.type === 'image/png') {
          embedded = await pdfDoc.embedPng(bytes);
        } else {
          // WEBP e outros: decodifica via canvas e reincorpora como PNG.
          var loaded = await loadImageFromFile(file);
          var canvas = document.createElement('canvas');
          canvas.width = loaded.img.naturalWidth;
          canvas.height = loaded.img.naturalHeight;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(loaded.img, 0, 0);
          URL.revokeObjectURL(loaded.url);
          var dataUrl = canvas.toDataURL('image/png');
          var pngBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), function (c) { return c.charCodeAt(0); });
          embedded = await pdfDoc.embedPng(pngBytes);
        }
        var page = pdfDoc.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
      }
      var outBytes = await pdfDoc.save();
      return new Blob([outBytes], { type: 'application/pdf' });
    }

    async function runPdfMerge() {
      var mergedDoc = await PDFLib.PDFDocument.create();
      for (var i = 0; i < files.length; i++) {
        var bytes = await readFileAsArrayBuffer(files[i]);
        var srcDoc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        var pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach(function (p) { mergedDoc.addPage(p); });
      }
      var outBytes = await mergedDoc.save();
      return new Blob([outBytes], { type: 'application/pdf' });
    }
  }
  function initImgToPdf(card, T) { initMultiFileTool(card, T, 'img2pdf'); }
  function initPdfMerge(card, T) { initMultiFileTool(card, T, 'pdfmerge'); }

  // ---- PDF -> Imagem / Dividir PDF / Comprimir PDF (ferramentas de arquivo único em PDF) ----
  function initPdfSingleTool(card, T, mode) {
    var box = card.querySelector('.pdf-tool');
    var maxMb = parseFloat(box.dataset.maxMb) || 30;
    var maxBytes = maxMb * 1024 * 1024;

    var dropzone = box.querySelector('[data-role="dropzone"]');
    var fileInput = document.getElementById('pdfFile');
    var statusBox = box.querySelector('[data-role="status"]');
    var processBtn = box.querySelector('[data-role="processBtn"]');
    var downloadBtn = box.querySelector('[data-role="downloadBtn"]');
    var progressTrack = box.querySelector('[data-role="progressTrack"]');
    var progressFill = box.querySelector('[data-role="progressFill"]');
    var progressLabel = box.querySelector('[data-role="progressLabel"]');

    var formatSelect = document.getElementById('pdfImgFormat');
    var qualityField = box.querySelector('[data-role="qualityField"]');
    var qualityInput = document.getElementById('pdfImgQuality');
    var qualityVal = box.querySelector('[data-role="qualityVal"]');
    var levelSelect = document.getElementById('pdfCompressLevel');

    var currentFile = null;
    var resultObjectUrl = null;

    function setStatus(msg, kind) {
      if (!msg) { statusBox.className = 'status-box'; return; }
      statusBox.textContent = msg;
      statusBox.className = 'status-box show ' + kind;
    }
    function setProgress(pct, label) {
      if (pct === null) { progressTrack.classList.remove('show'); progressLabel.classList.remove('show'); return; }
      progressTrack.classList.add('show');
      progressLabel.classList.add('show');
      progressFill.style.width = Math.round(pct * 100) + '%';
      progressLabel.textContent = label || '';
    }

    if (formatSelect) {
      formatSelect.addEventListener('change', function () {
        qualityField.style.display = formatSelect.value === 'jpg' ? '' : 'none';
      });
    }
    if (qualityInput) {
      qualityInput.addEventListener('input', function () { qualityVal.textContent = qualityInput.value; });
    }

    function handleFile(file) {
      if (!file) return;
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
        setStatus(T.errorInvalid, 'err');
        return;
      }
      if (file.size > maxBytes) { setStatus(T.errorTooLarge, 'err'); return; }
      currentFile = file;
      processBtn.disabled = false;
      if (resultObjectUrl) { URL.revokeObjectURL(resultObjectUrl); resultObjectUrl = null; }
      downloadBtn.style.display = 'none';
      showResult(card, '');
      card.querySelector('[data-role="result"]').classList.remove('show');
      setStatus(T.readyStatus, 'ok');
    }

    dropzone.addEventListener('click', function () { fileInput.click(); });
    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
    });
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.remove('drag-over'); });
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
    on(card, 'reset', function () {
      currentFile = null;
      processBtn.disabled = true;
      fileInput.value = '';
      if (resultObjectUrl) { URL.revokeObjectURL(resultObjectUrl); resultObjectUrl = null; }
      downloadBtn.style.display = 'none';
      showResult(card, '');
      card.querySelector('[data-role="result"]').classList.remove('show');
      setProgress(null);
      setStatus('', '');
    });

    on(card, 'process', function () {
      if (!currentFile) return;
      processBtn.disabled = true;
      setStatus(T.processingStatus, 'ok');
      var run;
      if (mode === 'pdf2img') run = runPdfToImg();
      else if (mode === 'pdfsplit') run = runPdfSplit();
      else run = runPdfCompress();
      run.then(function () {
        processBtn.disabled = false;
      }).catch(function (err) {
        setStatus(T.errorProcess + (err && err.message ? ' (' + err.message + ')' : ''), 'err');
        processBtn.disabled = false;
        setProgress(null);
      });
    });

    function ensurePdfjsWorker() {
      if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/js/vendor/pdfjs/pdf.worker.min.js';
      }
    }

    async function runPdfToImg() {
      ensurePdfjsWorker();
      var bytes = await readFileAsArrayBuffer(currentFile);
      var pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
      var numPages = pdf.numPages;
      var fmt = formatSelect.value === 'jpg' ? 'image/jpeg' : 'image/png';
      var ext = formatSelect.value === 'jpg' ? 'jpg' : 'png';
      var quality = formatSelect.value === 'jpg' ? parseInt(qualityInput.value, 10) / 100 : undefined;
      var baseName = (currentFile.name || 'documento').replace(/\.pdf$/i, '');

      var blobs = [];
      for (var i = 1; i <= numPages; i++) {
        setProgress(i / (numPages + 1), T.progressLabelTemplate.replace('{n}', i).replace('{total}', numPages));
        var page = await pdf.getPage(i);
        var viewport = page.getViewport({ scale: 2 });
        var canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        var ctx = canvas.getContext('2d');
        if (fmt === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        var blob = await new Promise(function (resolve) { canvas.toBlob(resolve, fmt, quality); });
        blobs.push(blob);
      }

      if (numPages === 1) {
        if (resultObjectUrl) URL.revokeObjectURL(resultObjectUrl);
        resultObjectUrl = URL.createObjectURL(blobs[0]);
        downloadBtn.href = resultObjectUrl;
        downloadBtn.setAttribute('download', baseName + '.' + ext);
        downloadBtn.style.display = '';
        showResult(card, '<img src="' + resultObjectUrl + '" style="max-width:100%;max-height:280px;border-radius:8px">');
      } else {
        setProgress(1, T.zippingStatus);
        var zip = new JSZip();
        blobs.forEach(function (b, idx) {
          zip.file(baseName + '-pagina-' + (idx + 1) + '.' + ext, b);
        });
        var zipBlob = await zip.generateAsync({ type: 'blob' });
        if (resultObjectUrl) URL.revokeObjectURL(resultObjectUrl);
        resultObjectUrl = URL.createObjectURL(zipBlob);
        downloadBtn.href = resultObjectUrl;
        downloadBtn.setAttribute('download', baseName + '-imagens.zip');
        downloadBtn.style.display = '';
        showResult(card, '<div class="result-extra">' + T.pagesConvertedTemplate.replace('{n}', numPages) + '</div>');
      }
      card.querySelector('[data-role="result"]').classList.add('show');
      setProgress(null);
      setStatus(T.doneStatus, 'ok');
    }

    async function runPdfSplit() {
      var bytes = await readFileAsArrayBuffer(currentFile);
      var srcDoc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
      var numPages = srcDoc.getPageCount();
      var baseName = (currentFile.name || 'documento').replace(/\.pdf$/i, '');
      var zip = new JSZip();
      for (var i = 0; i < numPages; i++) {
        setProgress((i + 1) / (numPages + 1), T.progressLabelTemplate.replace('{n}', i + 1).replace('{total}', numPages));
        var newDoc = await PDFLib.PDFDocument.create();
        var copied = await newDoc.copyPages(srcDoc, [i]);
        newDoc.addPage(copied[0]);
        var pageBytes = await newDoc.save();
        zip.file(baseName + '-pagina-' + (i + 1) + '.pdf', pageBytes);
      }
      setProgress(1, T.zippingStatus);
      var zipBlob = await zip.generateAsync({ type: 'blob' });
      if (resultObjectUrl) URL.revokeObjectURL(resultObjectUrl);
      resultObjectUrl = URL.createObjectURL(zipBlob);
      downloadBtn.href = resultObjectUrl;
      downloadBtn.setAttribute('download', baseName + '-paginas.zip');
      downloadBtn.style.display = '';
      showResult(card, '<div class="result-extra">' + T.pagesSplitTemplate.replace('{n}', numPages) + '</div>');
      card.querySelector('[data-role="result"]').classList.add('show');
      setProgress(null);
      setStatus(T.doneStatus, 'ok');
    }

    async function runPdfCompress() {
      ensurePdfjsWorker();
      var originalBytes = await readFileAsArrayBuffer(currentFile);
      var originalSize = currentFile.size;
      var level = levelSelect.value;
      var settings = {
        low: { scale: 1.0, quality: 0.35 },
        medium: { scale: 1.35, quality: 0.55 },
        high: { scale: 1.8, quality: 0.75 },
      }[level] || { scale: 1.35, quality: 0.55 };

      var pdf = await window.pdfjsLib.getDocument({ data: originalBytes.slice(0) }).promise;
      var numPages = pdf.numPages;
      var outDoc = await PDFLib.PDFDocument.create();

      for (var i = 1; i <= numPages; i++) {
        setProgress(i / (numPages + 1), T.progressLabelTemplate.replace('{n}', i).replace('{total}', numPages));
        var page = await pdf.getPage(i);
        var basePts = page.getViewport({ scale: 1 });
        var renderViewport = page.getViewport({ scale: settings.scale });
        var canvas = document.createElement('canvas');
        canvas.width = renderViewport.width;
        canvas.height = renderViewport.height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;
        var jpgDataUrl = canvas.toDataURL('image/jpeg', settings.quality);
        var jpgBytes = Uint8Array.from(atob(jpgDataUrl.split(',')[1]), function (c) { return c.charCodeAt(0); });
        var embedded = await outDoc.embedJpg(jpgBytes);
        var outPage = outDoc.addPage([basePts.width, basePts.height]);
        outPage.drawImage(embedded, { x: 0, y: 0, width: basePts.width, height: basePts.height });
      }

      setProgress(1, T.finalizingStatus);
      var compressedBytes = await outDoc.save();
      setProgress(null);

      var finalBytes, finalSize, usedOriginal;
      if (compressedBytes.length >= originalSize) {
        finalBytes = new Uint8Array(originalBytes);
        finalSize = originalSize;
        usedOriginal = true;
      } else {
        finalBytes = compressedBytes;
        finalSize = compressedBytes.length;
        usedOriginal = false;
      }

      var blob = new Blob([finalBytes], { type: 'application/pdf' });
      if (resultObjectUrl) URL.revokeObjectURL(resultObjectUrl);
      resultObjectUrl = URL.createObjectURL(blob);
      var baseName = (currentFile.name || 'documento').replace(/\.pdf$/i, '');
      downloadBtn.href = resultObjectUrl;
      downloadBtn.setAttribute('download', baseName + (usedOriginal ? '' : '-comprimido') + '.pdf');
      downloadBtn.style.display = '';

      var reduction = 1 - (finalSize / originalSize);
      var compareHtml = '<div class="size-compare">' +
        '<div class="size-box"><div class="size-label">' + T.originalLabel + '</div><div class="size-value">' + fmtBytes(originalSize) + '</div></div>' +
        '<div class="size-arrow">→</div>' +
        '<div class="size-box"><div class="size-label">' + T.resultLabel + '</div><div class="size-value">' + fmtBytes(finalSize) + '</div></div>' +
        '</div>' +
        (usedOriginal
          ? '<div class="result-note">' + T.noReductionNote + '</div>'
          : '<div class="size-reduction">-' + fmtPct(reduction) + '</div>');
      showResult(card, compareHtml);
      card.querySelector('[data-role="result"]').classList.add('show');
      setStatus(T.doneStatus, 'ok');
    }
  }
  function initPdfToImg(card, T) { initPdfSingleTool(card, T, 'pdf2img'); }
  function initPdfSplit(card, T) { initPdfSingleTool(card, T, 'pdfsplit'); }
  function initPdfCompress(card, T) { initPdfSingleTool(card, T, 'pdfcompress'); }

  // ---- Comprimir imagem / Redimensionar imagem ----
  function initImgTool2(card, T, mode) {
    var box = card.querySelector('.img-tool2');
    var maxMb = parseFloat(box.dataset.maxMb) || 20;
    var maxBytes = maxMb * 1024 * 1024;

    var dropzone = box.querySelector('[data-role="dropzone"]');
    var fileInput = document.getElementById('imgFile2');
    var statusBox = box.querySelector('[data-role="status"]');
    var previewGrid = box.querySelector('[data-role="previewGrid"]');
    var originalImg = box.querySelector('[data-role="originalImg"]');
    var originalMeta = box.querySelector('[data-role="originalMeta"]');
    var convertedImg = box.querySelector('[data-role="convertedImg"]');
    var convertedPlaceholder = box.querySelector('[data-role="convertedPlaceholder"]');
    var convertedMeta = box.querySelector('[data-role="convertedMeta"]');
    var processBtn = box.querySelector('[data-role="processBtn"]');
    var downloadBtn = box.querySelector('[data-role="downloadBtn"]');

    var formatSelect = document.getElementById('compressFormat');
    var qualityInput = document.getElementById('compressQuality');
    var qualityVal = box.querySelector('[data-role="qualityVal"]');
    var widthInput = document.getElementById('resizeWidth');
    var heightInput = document.getElementById('resizeHeight');
    var lockCheckbox = document.getElementById('resizeLock');

    var currentFile = null;
    var currentImgEl = null;
    var currentObjectUrl = null;
    var convertedObjectUrl = null;
    var aspectRatio = 1;
    var suppressSync = false;

    function setStatus(msg, kind) {
      if (!msg) { statusBox.className = 'status-box'; return; }
      statusBox.textContent = msg;
      statusBox.className = 'status-box show ' + kind;
    }
    function resetConverted() {
      convertedImg.style.display = 'none';
      convertedImg.removeAttribute('src');
      convertedPlaceholder.style.display = '';
      convertedMeta.textContent = '';
      downloadBtn.style.display = 'none';
      if (convertedObjectUrl) { URL.revokeObjectURL(convertedObjectUrl); convertedObjectUrl = null; }
    }

    function handleFile(file) {
      if (!file) return;
      if (file.size > maxBytes) { setStatus(T.errorTooLarge, 'err'); return; }
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      resetConverted();
      currentFile = file;
      var url = URL.createObjectURL(file);
      currentObjectUrl = url;
      var img = new Image();
      img.onload = function () {
        currentImgEl = img;
        aspectRatio = img.naturalWidth / img.naturalHeight;
        originalImg.src = url;
        originalMeta.textContent = img.naturalWidth + '×' + img.naturalHeight + ' · ' + fmtBytes(file.size);
        previewGrid.classList.add('show');
        processBtn.disabled = false;
        setStatus(T.readyStatus, 'ok');
        if (mode === 'imgresize' && widthInput && heightInput) {
          suppressSync = true;
          widthInput.value = img.naturalWidth;
          heightInput.value = img.naturalHeight;
          suppressSync = false;
        }
      };
      img.onerror = function () {
        setStatus(T.errorInvalid, 'err');
        currentImgEl = null;
        processBtn.disabled = true;
      };
      img.src = url;
    }

    dropzone.addEventListener('click', function () { fileInput.click(); });
    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
    });
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.remove('drag-over'); });
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });

    if (qualityInput) {
      qualityInput.addEventListener('input', function () { qualityVal.textContent = qualityInput.value; });
    }
    if (mode === 'imgresize' && widthInput && heightInput && lockCheckbox) {
      widthInput.addEventListener('input', function () {
        if (suppressSync || !lockCheckbox.checked) return;
        var w = parseInt(widthInput.value, 10);
        if (w > 0) { suppressSync = true; heightInput.value = Math.round(w / aspectRatio); suppressSync = false; }
      });
      heightInput.addEventListener('input', function () {
        if (suppressSync || !lockCheckbox.checked) return;
        var h = parseInt(heightInput.value, 10);
        if (h > 0) { suppressSync = true; widthInput.value = Math.round(h * aspectRatio); suppressSync = false; }
      });
    }

    on(card, 'process', function () {
      if (!currentImgEl) return;

      if (mode === 'imgcompress') {
        var canvas = document.createElement('canvas');
        canvas.width = currentImgEl.naturalWidth;
        canvas.height = currentImgEl.naturalHeight;
        var ctx = canvas.getContext('2d');
        var fmtChoice = formatSelect.value;
        var toMime = fmtChoice === 'jpg' ? 'image/jpeg' : fmtChoice === 'webp' ? 'image/webp' : (currentFile.type || 'image/png');
        if (toMime === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(currentImgEl, 0, 0);
        var quality = parseInt(qualityInput.value, 10) / 100;
        canvas.toBlob(function (blob) {
          if (!blob) { setStatus(T.errorUnsupported, 'err'); return; }
          finishImgTool(blob, canvas.width, canvas.height, toMime, true);
        }, toMime, quality);
      } else {
        var w = parseInt(widthInput.value, 10);
        var h = parseInt(heightInput.value, 10);
        if (!w || !h || w <= 0 || h <= 0) { setStatus(T.errorDimensions, 'err'); return; }
        var canvas2 = document.createElement('canvas');
        canvas2.width = w;
        canvas2.height = h;
        var ctx2 = canvas2.getContext('2d');
        var mime2 = currentFile.type === 'image/jpeg' ? 'image/jpeg' : (currentFile.type || 'image/png');
        if (mime2 === 'image/jpeg') { ctx2.fillStyle = '#ffffff'; ctx2.fillRect(0, 0, w, h); }
        ctx2.drawImage(currentImgEl, 0, 0, w, h);
        canvas2.toBlob(function (blob) {
          if (!blob) { setStatus(T.errorUnsupported, 'err'); return; }
          finishImgTool(blob, w, h, mime2, false);
        }, mime2, mime2 === 'image/jpeg' ? 0.92 : undefined);
      }
    });

    function finishImgTool(blob, w, h, mime, showReduction) {
      if (convertedObjectUrl) URL.revokeObjectURL(convertedObjectUrl);
      convertedObjectUrl = URL.createObjectURL(blob);
      convertedImg.src = convertedObjectUrl;
      convertedImg.style.display = '';
      convertedPlaceholder.style.display = 'none';
      var metaText = w + '×' + h + ' · ' + fmtBytes(blob.size);
      if (showReduction && currentFile) {
        var reduction = 1 - (blob.size / currentFile.size);
        metaText += reduction > 0 ? ' (−' + fmtPct(reduction) + ')' : ' (' + T.noReductionShort + ')';
      }
      convertedMeta.textContent = metaText;
      downloadBtn.href = convertedObjectUrl;
      var ext = mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : mime === 'image/png' ? 'png' : 'img';
      var baseName = (currentFile.name || 'imagem').replace(/\.[^.]+$/, '');
      downloadBtn.setAttribute('download', baseName + (mode === 'imgcompress' ? '-comprimida' : '-redimensionada') + '.' + ext);
      downloadBtn.style.display = '';
      setStatus(T.doneStatus, 'ok');
    }

    on(card, 'reset', function () {
      currentFile = null;
      currentImgEl = null;
      if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
      resetConverted();
      originalImg.removeAttribute('src');
      originalMeta.textContent = '';
      previewGrid.classList.remove('show');
      processBtn.disabled = true;
      fileInput.value = '';
      if (widthInput) widthInput.value = '';
      if (heightInput) heightInput.value = '';
      setStatus('', '');
    });
  }
  function initImgCompress(card, T) { initImgTool2(card, T, 'imgcompress'); }
  function initImgResize(card, T) { initImgTool2(card, T, 'imgresize'); }

  // ---- OCR: extrair texto de imagem ----
  function initOcr(card, T) {
    var box = card.querySelector('.ocr-tool');
    var maxMb = parseFloat(box.dataset.maxMb) || 20;
    var maxBytes = maxMb * 1024 * 1024;

    var dropzone = box.querySelector('[data-role="dropzone"]');
    var fileInput = document.getElementById('ocrFile');
    var statusBox = box.querySelector('[data-role="status"]');
    var previewGrid = box.querySelector('[data-role="previewGrid"]');
    var originalImg = box.querySelector('[data-role="originalImg"]');
    var originalMeta = box.querySelector('[data-role="originalMeta"]');
    var langSelect = document.getElementById('ocrLang');
    var processBtn = box.querySelector('[data-role="processBtn"]');
    var progressTrack = box.querySelector('[data-role="progressTrack"]');
    var progressFill = box.querySelector('[data-role="progressFill"]');
    var progressLabel = box.querySelector('[data-role="progressLabel"]');
    var outputField = box.querySelector('[data-role="outputField"]');
    var outputArea = box.querySelector('[data-role="output"]');

    var currentFile = null;
    var currentObjectUrl = null;

    function setStatus(msg, kind) {
      if (!msg) { statusBox.className = 'status-box'; return; }
      statusBox.textContent = msg;
      statusBox.className = 'status-box show ' + kind;
    }
    function setProgress(pct, label) {
      if (pct === null) { progressTrack.classList.remove('show'); progressLabel.classList.remove('show'); return; }
      progressTrack.classList.add('show');
      progressLabel.classList.add('show');
      progressFill.style.width = Math.round(pct * 100) + '%';
      progressLabel.textContent = label || '';
    }

    function handleFile(file) {
      if (!file) return;
      if (file.size > maxBytes) { setStatus(T.errorTooLarge, 'err'); return; }
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      currentFile = file;
      var url = URL.createObjectURL(file);
      currentObjectUrl = url;
      var img = new Image();
      img.onload = function () {
        originalImg.src = url;
        originalMeta.textContent = img.naturalWidth + '×' + img.naturalHeight + ' · ' + fmtBytes(file.size);
        previewGrid.classList.add('show');
        processBtn.disabled = false;
        outputField.style.display = 'none';
        setStatus(T.readyStatus, 'ok');
      };
      img.onerror = function () {
        setStatus(T.errorInvalid, 'err');
        processBtn.disabled = true;
      };
      img.src = url;
    }

    dropzone.addEventListener('click', function () { fileInput.click(); });
    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
    });
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.remove('drag-over'); });
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });

    on(card, 'process', function () {
      if (!currentFile) return;
      processBtn.disabled = true;
      outputField.style.display = 'none';
      setStatus(T.processingStatus, 'ok');
      setProgress(0, T.ocrLoadingStatus);
      var worker;
      Tesseract.createWorker(langSelect.value, 1, {
        workerPath: '/assets/js/vendor/tesseract/worker.min.js',
        corePath: '/assets/js/vendor/tesseract/tesseract-core-simd-lstm.wasm.js',
        langPath: '/assets/js/vendor/tessdata/',
        logger: function (msg) {
          if (msg.status === 'recognizing text') {
            setProgress(msg.progress, T.ocrRecognizingStatus);
          } else if (msg.status) {
            setProgress(0, msg.status);
          }
        },
      }).then(function (w) {
        worker = w;
        return worker.recognize(currentFile);
      }).then(function (result) {
        outputArea.value = (result.data.text || '').trim();
        outputField.style.display = '';
        setProgress(null);
        setStatus(T.doneStatus, 'ok');
        processBtn.disabled = false;
        if (worker) worker.terminate();
      }).catch(function (err) {
        setProgress(null);
        setStatus(T.errorProcess + (err && err.message ? ' (' + err.message + ')' : ''), 'err');
        processBtn.disabled = false;
        if (worker) worker.terminate();
      });
    });

    on(card, 'copy', function () {
      navigator.clipboard.writeText(outputArea.value);
      setStatus(T.copiedMsg || T.copied, 'ok');
    });

    on(card, 'reset', function () {
      currentFile = null;
      if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
      originalImg.removeAttribute('src');
      originalMeta.textContent = '';
      previewGrid.classList.remove('show');
      processBtn.disabled = true;
      fileInput.value = '';
      outputArea.value = '';
      outputField.style.display = 'none';
      setProgress(null);
      setStatus('', '');
    });
  }


  // ---------------------------------------------------------- MUITO BUSCADOS NO BRASIL
  // ---- Número por Extenso ----
  var EXT_UNIDADES = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  var EXT_DEZ_A_DEZENOVE = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  var EXT_DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  var EXT_CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  function extGrupoATexto(n) {
    if (n === 100) return 'cem';
    var c = Math.floor(n / 100), r = n % 100;
    var parts = [];
    if (c > 0) parts.push(EXT_CENTENAS[c]);
    if (r > 0) {
      if (r < 10) parts.push(EXT_UNIDADES[r]);
      else if (r < 20) parts.push(EXT_DEZ_A_DEZENOVE[r - 10]);
      else {
        var d = Math.floor(r / 10), u = r % 10;
        if (u === 0) parts.push(EXT_DEZENAS[d]);
        else parts.push(EXT_DEZENAS[d] + ' e ' + EXT_UNIDADES[u]);
      }
    }
    return parts.join(' e ');
  }
  function numeroPorExtenso(n) {
    n = Math.floor(n);
    if (n === 0) return 'zero';
    if (n < 0) return 'menos ' + numeroPorExtenso(-n);
    var groups = [];
    var temp = n;
    while (temp > 0) { groups.unshift(temp % 1000); temp = Math.floor(temp / 1000); }
    var nGroups = groups.length;
    var parts = [];
    for (var i = 0; i < nGroups; i++) {
      var val = groups[i];
      if (val === 0) continue;
      var posFromEnd = nGroups - 1 - i;
      var text = extGrupoATexto(val);
      if (posFromEnd === 1) {
        text = (val === 1 ? 'mil' : text + ' mil');
      } else if (posFromEnd === 2) {
        text += ' ' + (val === 1 ? 'milhão' : 'milhões');
      } else if (posFromEnd === 3) {
        text += ' ' + (val === 1 ? 'bilhão' : 'bilhões');
      }
      parts.push({ text: text, val: val, posFromEnd: posFromEnd });
    }
    var result = '';
    for (var i = 0; i < parts.length; i++) {
      if (i === 0) { result = parts[i].text; continue; }
      var isLast = i === parts.length - 1;
      var p = parts[i];
      var useE = false;
      if (isLast && (p.val < 100 || p.val % 100 === 0)) useE = true;
      result += (useE ? ' e ' : ' ') + p.text;
    }
    return result;
  }
  function parseValorBR(str) {
    str = (str || '').trim().replace(/[^\d.,-]/g, '');
    if (!str) return null;
    var neg = str.indexOf('-') === 0;
    str = str.replace(/-/g, '');
    var hasComma = str.indexOf(',') !== -1;
    var hasDot = str.indexOf('.') !== -1;
    if (hasComma && hasDot) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else if (hasComma && !hasDot) {
      str = str.replace(',', '.');
    }
    var num = parseFloat(str);
    if (isNaN(num)) return null;
    return neg ? -num : num;
  }
  function initNumeroPorExtenso(card, T) {
    var input = document.getElementById('valor');
    var moedaCheckbox = document.getElementById('moeda');
    on(card, 'calc', function () {
      var num = parseValorBR(input.value);
      if (num === null || num < 0 || num > 999999999999) {
        alert(T.error);
        return;
      }
      var texto;
      if (moedaCheckbox.checked) {
        var intPart = Math.floor(num);
        var centavos = Math.round((num - intPart) * 100);
        if (centavos === 100) { intPart += 1; centavos = 0; }
        if (intPart === 0 && centavos > 0) {
          texto = numeroPorExtenso(centavos) + ' ' + (centavos === 1 ? T.centavo : T.centavos);
        } else {
          texto = numeroPorExtenso(intPart) + ' ' + (intPart === 1 ? T.real : T.reais);
          if (centavos > 0) {
            texto += ' ' + T.e + ' ' + numeroPorExtenso(centavos) + ' ' + (centavos === 1 ? T.centavo : T.centavos);
          }
        }
      } else {
        texto = numeroPorExtenso(Math.round(num));
      }
      texto = texto.charAt(0).toUpperCase() + texto.slice(1);
      showResult(card,
        '<span class="result-value">' + escHtml(texto) + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---- Data por Extenso ----
  function initDataPorExtenso(card, T) {
    var input = document.getElementById('data');
    var diaSemanaCheckbox = document.getElementById('diaSemana');
    on(card, 'calc', function () {
      var val = input.value;
      if (!val) { alert(T.error); return; }
      var parts = val.split('-');
      var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10), d = parseInt(parts[2], 10);
      var dateObj = new Date(y, m - 1, d);
      if (isNaN(dateObj.getTime())) { alert(T.error); return; }
      var opts = diaSemanaCheckbox.checked
        ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
        : { day: 'numeric', month: 'long', year: 'numeric' };
      var texto = dateObj.toLocaleDateString('pt-BR', opts);
      texto = texto.charAt(0).toUpperCase() + texto.slice(1);
      showResult(card,
        '<span class="result-value">' + escHtml(texto) + '</span>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  // ---- Validador de CPF/CNPJ ----
  function todosDigitosIguais(digits) {
    return digits.every(function (d) { return d === digits[0]; });
  }
  function validarCPF(digitsStr) {
    var digits = digitsStr.split('').map(Number);
    if (digits.length !== 11 || todosDigitosIguais(digits)) return false;
    var d1 = calcDigitoCPF(digits.slice(0, 9));
    if (d1 !== digits[9]) return false;
    var d2 = calcDigitoCPF(digits.slice(0, 10));
    if (d2 !== digits[10]) return false;
    return true;
  }
  function validarCNPJ(digitsStr) {
    var digits = digitsStr.split('').map(Number);
    if (digits.length !== 14 || todosDigitosIguais(digits)) return false;
    var d1 = calcDigitoCNPJ(digits.slice(0, 12));
    if (d1 !== digits[12]) return false;
    var d2 = calcDigitoCNPJ(digits.slice(0, 13));
    if (d2 !== digits[13]) return false;
    return true;
  }
  function initValidadorCpfCnpj(card, T) {
    var input = document.getElementById('documento');
    on(card, 'calc', function () {
      var digits = (input.value || '').replace(/\D/g, '');
      if (digits.length !== 11 && digits.length !== 14) {
        alert(T.errorLength);
        card.querySelector('[data-role="result"]').classList.remove('show');
        return;
      }
      var isCPF = digits.length === 11;
      var valido = isCPF ? validarCPF(digits) : validarCNPJ(digits);
      var formatted = isCPF ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                             : digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      var tipo = isCPF ? 'CPF' : 'CNPJ';
      var html = '<span class="result-value">' + escHtml(formatted) + '</span>' +
        '<span class="result-classification ' + (valido ? 'status-box ok' : 'status-box err') + '" style="display:inline-block;margin-top:8px;padding:6px 14px;border-radius:20px">' +
        (valido ? T.valid.replace('{tipo}', tipo) : T.invalid.replace('{tipo}', tipo)) + '</span>';
      showResult(card, html);
    });
  }

  // ---- Gerador de Link WhatsApp ----
  function initWhatsappLink(card, T) {
    var phoneInput = document.getElementById('telefone');
    var msgInput = document.getElementById('mensagem');
    on(card, 'calc', function () {
      var digits = (phoneInput.value || '').replace(/\D/g, '');
      if (!digits) { alert(T.error); return; }
      var msg = msgInput.value || '';
      var url = 'https://wa.me/' + digits + (msg ? ('?text=' + encodeURIComponent(msg)) : '');
      showResult(card,
        '<span class="result-value" style="font-size:1rem;word-break:break-all">' + escHtml(url) + '</span>' +
        '<div class="actions" style="width:100%;margin-top:10px">' +
        '<button type="button" class="btn-secondary" data-copy>' + T.copy + '</button>' +
        '<a class="btn-primary" href="' + escHtml(url) + '" target="_blank" rel="noopener">' + T.openBtn + '</a>' +
        '</div>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(url, T, copyBtn); });
    });
  }

  // ---- Gerador de Números da Loteria ----
  function initLotteryGenerator(card, T) {
    on(card, 'generate', function () {
      var jogo = document.getElementById('jogo').value;
      var cfg = jogo === 'lotofacil' ? { count: 15, max: 25 } : { count: 6, max: 60 };

      var fixedRaw = (document.getElementById('numerosFixos').value || '').trim();
      var fixed = [];
      if (fixedRaw) {
        var parts = fixedRaw.split(/[\s,;]+/).filter(function (p) { return p !== ''; });
        parts.forEach(function (p) {
          var n = parseInt(p, 10);
          if (!isNaN(n) && fixed.indexOf(n) === -1) fixed.push(n);
        });
      }

      // Validate fixed numbers
      var invalidRange = fixed.some(function (n) { return n < 1 || n > cfg.max; });
      if (invalidRange) {
        showStatus(card, T.fixedRangeError.replace('{max}', cfg.max), 'error');
        return;
      }
      if (fixed.length > cfg.count) {
        showStatus(card, T.fixedTooManyError.replace('{count}', cfg.count), 'error');
        return;
      }
      var status = card.querySelector('[data-role="status"]');
      if (status) { status.textContent = ''; status.className = 'status-box'; }

      var pool = [];
      for (var i = 1; i <= cfg.max; i++) if (fixed.indexOf(i) === -1) pool.push(i);
      var chosen = fixed.slice();
      var remaining = cfg.count - chosen.length;
      for (var j = 0; j < remaining; j++) {
        var idx = Math.floor(Math.random() * pool.length);
        chosen.push(pool[idx]);
        pool.splice(idx, 1);
      }
      chosen.sort(function (a, b) { return a - b; });
      var numbersHtml = chosen.map(function (n) {
        var isFixed = fixed.indexOf(n) !== -1;
        return '<span class="contrast-badge pass" style="font-size:1rem;margin:3px' + (isFixed ? ';outline:2px solid var(--primary,#2c65f2)' : '') + '" title="' + (isFixed ? escHtml(T.fixedBadge || '') : '') + '">' + (n < 10 ? '0' + n : n) + '</span>';
      }).join('');
      showResult(card,
        '<div style="width:100%;display:flex;flex-wrap:wrap;gap:4px">' + numbersHtml + '</div>' +
        (fixed.length ? '<div class="result-note" style="width:100%">' + T.fixedNote + '</div>' : '') +
        '<div class="result-note" style="width:100%">' + T.disclaimer + '</div>'
      );
    });
  }

  // ---- Feriados e Calendário (Computus / Páscoa) ----
  function easterDate(year) {
    var a = year % 19, b = Math.floor(year / 100), c = year % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day));
  }
  function addDaysUTC(d, n) {
    var r = new Date(d.getTime());
    r.setUTCDate(r.getUTCDate() + n);
    return r;
  }
  function computeBrazilianHolidays(year, holidayNames) {
    var easter = easterDate(year);
    var carnavalTue = addDaysUTC(easter, -47);
    var carnavalMon = addDaysUTC(easter, -48);
    var goodFriday = addDaysUTC(easter, -2);
    var corpusChristi = addDaysUTC(easter, 60);
    var list = [
      { date: new Date(Date.UTC(year, 0, 1)), name: holidayNames.newYear },
      { date: carnavalMon, name: holidayNames.carnavalMon },
      { date: carnavalTue, name: holidayNames.carnavalTue },
      { date: goodFriday, name: holidayNames.goodFriday },
      { date: new Date(Date.UTC(year, 3, 21)), name: holidayNames.tiradentes },
      { date: new Date(Date.UTC(year, 4, 1)), name: holidayNames.laborDay },
      { date: corpusChristi, name: holidayNames.corpusChristi },
      { date: new Date(Date.UTC(year, 8, 7)), name: holidayNames.independence },
      { date: new Date(Date.UTC(year, 9, 12)), name: holidayNames.aparecida },
      { date: new Date(Date.UTC(year, 10, 2)), name: holidayNames.finados },
      { date: new Date(Date.UTC(year, 10, 15)), name: holidayNames.republic },
      { date: new Date(Date.UTC(year, 10, 20)), name: holidayNames.consciousness },
      { date: new Date(Date.UTC(year, 11, 25)), name: holidayNames.christmas },
    ];
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function initHolidayChecker(card, T) {
    var lang = card.dataset.lang || 'pt';
    var locale = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[lang] || 'pt-BR';
    on(card, 'generate', function () {
      var year = parseInt(document.getElementById('holidayYear').value, 10);
      if (!year || year < 1900 || year > 2200) {
        showStatus(card, T.errorYear, 'error');
        return;
      }
      var status = card.querySelector('[data-role="status"]');
      if (status) { status.textContent = ''; status.className = 'status-box'; }
      var list = computeBrazilianHolidays(year, T.holidayNames);
      var rows = list.map(function (h) {
        return '<tr><td>' + h.date.toLocaleDateString(locale, { timeZone: 'UTC' }) + '</td><td>' + T.weekdays[h.date.getUTCDay()] + '</td><td>' + escHtml(h.name) + '</td></tr>';
      }).join('');
      showResult(card,
        '<div class="result-note" style="width:100%">' + T.resultIntro.replace('{year}', year).replace('{count}', list.length) + '</div>' +
        '<table style="width:100%"><tr><th>' + T.colDate + '</th><th>' + T.colWeekday + '</th><th>' + T.colHoliday + '</th></tr>' + rows + '</table>'
      );
    });
  }

  // ---- Holiday helpers shared by US/UK/Mexico/Spain checkers ----
  function nthWeekdayUTC(year, month0, weekday, n) {
    var d = new Date(Date.UTC(year, month0, 1));
    var first = d.getUTCDay();
    var offset = (weekday - first + 7) % 7;
    var day = 1 + offset + (n - 1) * 7;
    return new Date(Date.UTC(year, month0, day));
  }
  function lastWeekdayUTC(year, month0, weekday) {
    var d = new Date(Date.UTC(year, month0 + 1, 0));
    var last = d.getUTCDay();
    var offset = (last - weekday + 7) % 7;
    return addDaysUTC(d, -offset);
  }
  function observedUSFixed(date) {
    var wd = date.getUTCDay();
    if (wd === 6) return addDaysUTC(date, -1);
    if (wd === 0) return addDaysUTC(date, 1);
    return date;
  }
  function computeUsHolidays(year, names) {
    var list = [
      { date: observedUSFixed(new Date(Date.UTC(year, 0, 1))), name: names.newYear },
      { date: nthWeekdayUTC(year, 0, 1, 3), name: names.mlk },
      { date: nthWeekdayUTC(year, 1, 1, 3), name: names.presidents },
      { date: lastWeekdayUTC(year, 4, 1), name: names.memorial },
      { date: observedUSFixed(new Date(Date.UTC(year, 5, 19))), name: names.juneteenth },
      { date: observedUSFixed(new Date(Date.UTC(year, 6, 4))), name: names.independence },
      { date: nthWeekdayUTC(year, 8, 1, 1), name: names.labor },
      { date: nthWeekdayUTC(year, 9, 1, 2), name: names.columbus },
      { date: observedUSFixed(new Date(Date.UTC(year, 10, 11))), name: names.veterans },
      { date: nthWeekdayUTC(year, 10, 4, 4), name: names.thanksgiving },
      { date: observedUSFixed(new Date(Date.UTC(year, 11, 25))), name: names.christmas },
    ];
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function ukNewYearDate(year) {
    var jan1 = new Date(Date.UTC(year, 0, 1));
    var wd = jan1.getUTCDay();
    if (wd === 6) return new Date(Date.UTC(year, 0, 3));
    if (wd === 0) return new Date(Date.UTC(year, 0, 2));
    return jan1;
  }
  function ukChristmasBoxingDates(year) {
    var dec25 = new Date(Date.UTC(year, 11, 25));
    var wd = dec25.getUTCDay();
    if (wd >= 1 && wd <= 4) return [dec25, addDaysUTC(dec25, 1)];
    if (wd === 5) return [dec25, new Date(Date.UTC(year, 11, 28))];
    if (wd === 6) return [new Date(Date.UTC(year, 11, 27)), new Date(Date.UTC(year, 11, 28))];
    return [new Date(Date.UTC(year, 11, 26)), new Date(Date.UTC(year, 11, 27))];
  }
  function computeUkHolidays(year, names) {
    var easter = easterDate(year);
    var xmas = ukChristmasBoxingDates(year);
    var list = [
      { date: ukNewYearDate(year), name: names.newYear },
      { date: addDaysUTC(easter, -2), name: names.goodFriday },
      { date: addDaysUTC(easter, 1), name: names.easterMonday },
      { date: nthWeekdayUTC(year, 4, 1, 1), name: names.earlyMay },
      { date: lastWeekdayUTC(year, 4, 1), name: names.springBank },
      { date: lastWeekdayUTC(year, 7, 1), name: names.summerBank },
      { date: xmas[0], name: names.christmas },
      { date: xmas[1], name: names.boxing },
    ];
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function computeMexicoHolidays(year, names) {
    var list = [
      { date: new Date(Date.UTC(year, 0, 1)), name: names.newYear },
      { date: nthWeekdayUTC(year, 1, 1, 1), name: names.constitution },
      { date: nthWeekdayUTC(year, 2, 1, 3), name: names.juarez },
      { date: new Date(Date.UTC(year, 4, 1)), name: names.labor },
      { date: new Date(Date.UTC(year, 8, 16)), name: names.independence },
      { date: nthWeekdayUTC(year, 10, 1, 3), name: names.revolution },
      { date: new Date(Date.UTC(year, 11, 25)), name: names.christmas },
    ];
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function computeSpainHolidays(year, names) {
    var easter = easterDate(year);
    var list = [
      { date: new Date(Date.UTC(year, 0, 1)), name: names.newYear },
      { date: new Date(Date.UTC(year, 0, 6)), name: names.epiphany },
      { date: addDaysUTC(easter, -2), name: names.goodFriday },
      { date: new Date(Date.UTC(year, 4, 1)), name: names.labor },
      { date: new Date(Date.UTC(year, 7, 15)), name: names.assumption },
      { date: new Date(Date.UTC(year, 9, 12)), name: names.nationalDay },
      { date: new Date(Date.UTC(year, 10, 1)), name: names.allSaints },
      { date: new Date(Date.UTC(year, 11, 6)), name: names.constitution },
      { date: new Date(Date.UTC(year, 11, 8)), name: names.immaculate },
      { date: new Date(Date.UTC(year, 11, 25)), name: names.christmas },
    ];
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function initGenericHolidayChecker(card, T, computeFn) {
    var lang = card.dataset.lang || 'en';
    var locale = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[lang] || 'en-US';
    on(card, 'generate', function () {
      var year = parseInt(document.getElementById('holidayYear').value, 10);
      if (!year || year < 1900 || year > 2200) {
        showStatus(card, T.errorYear, 'error');
        return;
      }
      var status = card.querySelector('[data-role="status"]');
      if (status) { status.textContent = ''; status.className = 'status-box'; }
      var list = computeFn(year, T.holidayNames);
      var rows = list.map(function (h) {
        return '<tr><td>' + h.date.toLocaleDateString(locale, { timeZone: 'UTC' }) + '</td><td>' + T.weekdays[h.date.getUTCDay()] + '</td><td>' + escHtml(h.name) + '</td></tr>';
      }).join('');
      showResult(card,
        '<div class="result-note" style="width:100%">' + T.resultIntro.replace('{year}', year).replace('{count}', list.length) + '</div>' +
        '<table style="width:100%"><tr><th>' + T.colDate + '</th><th>' + T.colWeekday + '</th><th>' + T.colHoliday + '</th></tr>' + rows + '</table>'
      );
    });
  }
  function initUsHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeUsHolidays); }
  function initUkHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeUkHolidays); }
  function initMexicoHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeMexicoHolidays); }
  function initSpainHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeSpainHolidays); }

  // ---- Holidays: Angola / Mozambique / Cabo Verde / Timor-Leste ----
  function computeAngolaHolidays(year, n) {
    var easter = easterDate(year);
    var list = [
      { date: new Date(Date.UTC(year, 0, 1)), name: n.newYear },
      { date: addDaysUTC(easter, -47), name: n.carnival },
      { date: addDaysUTC(easter, -2), name: n.goodFriday },
      { date: new Date(Date.UTC(year, 1, 4)), name: n.liberationStruggle },
      { date: new Date(Date.UTC(year, 2, 8)), name: n.womensDay },
      { date: new Date(Date.UTC(year, 2, 23)), name: n.southernAfricaLiberation },
      { date: new Date(Date.UTC(year, 3, 4)), name: n.peaceDay },
      { date: new Date(Date.UTC(year, 4, 1)), name: n.laborDay },
      { date: new Date(Date.UTC(year, 8, 17)), name: n.heroesDay },
      { date: new Date(Date.UTC(year, 10, 2)), name: n.allSouls },
      { date: new Date(Date.UTC(year, 10, 11)), name: n.independence },
      { date: new Date(Date.UTC(year, 11, 25)), name: n.christmas },
    ];
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function computeMozambiqueHolidays(year, n) {
    var base = [
      { date: new Date(Date.UTC(year, 0, 1)), name: n.newYear },
      { date: new Date(Date.UTC(year, 1, 3)), name: n.heroesDay },
      { date: new Date(Date.UTC(year, 3, 7)), name: n.womensDay },
      { date: new Date(Date.UTC(year, 4, 1)), name: n.laborDay },
      { date: new Date(Date.UTC(year, 5, 25)), name: n.independence },
      { date: new Date(Date.UTC(year, 8, 7)), name: n.victoryDay },
      { date: new Date(Date.UTC(year, 8, 25)), name: n.armedForcesDay },
      { date: new Date(Date.UTC(year, 9, 4)), name: n.peaceDay },
      { date: new Date(Date.UTC(year, 11, 25)), name: n.familyDay },
    ];
    var list = [];
    base.forEach(function (h) {
      list.push(h);
      if (h.date.getUTCDay() === 0) {
        list.push({ date: addDaysUTC(h.date, 1), name: n.dayOff + ' (' + h.name + ')' });
      }
    });
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function computeCaboVerdeHolidays(year, n) {
    var easter = easterDate(year);
    var list = [
      { date: new Date(Date.UTC(year, 0, 1)), name: n.newYear },
      { date: new Date(Date.UTC(year, 0, 13)), name: n.democracyDay },
      { date: new Date(Date.UTC(year, 0, 20)), name: n.nationalityDay },
      { date: addDaysUTC(easter, -46), name: n.ashWednesday },
      { date: addDaysUTC(easter, -2), name: n.goodFriday },
      { date: new Date(Date.UTC(year, 4, 1)), name: n.laborDay },
      { date: new Date(Date.UTC(year, 5, 1)), name: n.childrensDay },
      { date: new Date(Date.UTC(year, 6, 5)), name: n.independence },
      { date: new Date(Date.UTC(year, 7, 15)), name: n.assumption },
      { date: new Date(Date.UTC(year, 8, 12)), name: n.autonomyDay },
      { date: new Date(Date.UTC(year, 10, 1)), name: n.allSaints },
      { date: new Date(Date.UTC(year, 11, 25)), name: n.christmas },
    ];
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  // Approximate Islamic-calendar dates (subject to moon sighting, may shift by 1 day); shown only 2025-2030.
  var TL_EID_FITR = { 2025: [2, 31], 2026: [2, 20], 2027: [2, 9], 2028: [1, 26], 2029: [1, 14], 2030: [1, 4] };
  var TL_EID_ADHA = { 2025: [5, 7], 2026: [4, 27], 2027: [4, 16], 2028: [4, 5], 2029: [3, 24], 2030: [3, 13] };
  function computeTimorLesteHolidays(year, n) {
    var easter = easterDate(year);
    var list = [
      { date: new Date(Date.UTC(year, 0, 1)), name: n.newYear },
      { date: new Date(Date.UTC(year, 2, 3)), name: n.veteransDay },
      { date: addDaysUTC(easter, -2), name: n.goodFriday },
      { date: new Date(Date.UTC(year, 4, 1)), name: n.laborDay },
      { date: new Date(Date.UTC(year, 4, 20)), name: n.restorationDay },
      { date: addDaysUTC(easter, 60), name: n.corpusChristi },
      { date: new Date(Date.UTC(year, 7, 30)), name: n.popularConsultation },
      { date: new Date(Date.UTC(year, 10, 1)), name: n.allSaints },
      { date: new Date(Date.UTC(year, 10, 2)), name: n.allSouls },
      { date: new Date(Date.UTC(year, 10, 3)), name: n.womensDay },
      { date: new Date(Date.UTC(year, 10, 12)), name: n.youthDay },
      { date: new Date(Date.UTC(year, 10, 28)), name: n.proclamationDay },
      { date: new Date(Date.UTC(year, 11, 7)), name: n.memorialDay },
      { date: new Date(Date.UTC(year, 11, 8)), name: n.immaculateConception },
      { date: new Date(Date.UTC(year, 11, 25)), name: n.christmas },
      { date: new Date(Date.UTC(year, 11, 31)), name: n.heroesDay },
    ];
    if (TL_EID_FITR[year]) list.push({ date: new Date(Date.UTC(year, TL_EID_FITR[year][0], TL_EID_FITR[year][1])), name: n.eidFitr });
    if (TL_EID_ADHA[year]) list.push({ date: new Date(Date.UTC(year, TL_EID_ADHA[year][0], TL_EID_ADHA[year][1])), name: n.eidAdha });
    list.sort(function (a, b) { return a.date - b.date; });
    return list;
  }
  function initAngolaHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeAngolaHolidays); }
  function initMozambiqueHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeMozambiqueHolidays); }
  function initCaboVerdeHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeCaboVerdeHolidays); }
  function initTimorLesteHolidayChecker(card, T) { initGenericHolidayChecker(card, T, computeTimorLesteHolidays); }

  // ---- Sorteio de Amigo Secreto ----
  function derangement(n) {
    if (n < 2) return null;
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    for (var attempt = 0; attempt < 10000; attempt++) {
      for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      var ok = true;
      for (var i = 0; i < n; i++) if (arr[i] === i) { ok = false; break; }
      if (ok) return arr.slice();
    }
    return null;
  }
  function initSecretSanta(card, T) {
    var pairs = null;
    var revealBox = card.querySelector('[data-role="revealBox"]');
    var select = document.getElementById('secretSantaWho');

    on(card, 'draw', function () {
      var raw = document.getElementById('secretSantaNames').value || '';
      var names = raw.split('\n').map(function (s) { return s.trim(); }).filter(function (s) { return s !== ''; });
      if (names.length < 2) {
        showStatus(card, T.minParticipantsError, 'error');
        if (revealBox) revealBox.style.display = 'none';
        return;
      }
      var assignment = derangement(names.length);
      if (!assignment) {
        showStatus(card, T.error, 'error');
        return;
      }
      pairs = names.map(function (n, i) { return { giver: n, receiver: names[assignment[i]] }; });

      select.innerHTML = '';
      names.forEach(function (n, i) {
        var opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = n;
        select.appendChild(opt);
      });

      showStatus(card, T.drawSuccess.replace('{count}', names.length), 'success');
      if (revealBox) revealBox.style.display = '';
      var result = card.querySelector('[data-role="result"]');
      if (result) { result.innerHTML = ''; result.classList.remove('show'); }
    });

    on(card, 'reveal', function () {
      if (!pairs || !select.value) return;
      var idx = parseInt(select.value, 10);
      var pair = pairs[idx];
      showResult(card,
        '<div class="result-value">' + T.revealTemplate.replace('{giver}', escHtml(pair.giver)).replace('{receiver}', escHtml(pair.receiver)) + '</div>' +
        '<button type="button" class="btn-secondary" data-action="hideAgain">' + T.hideBtn + '</button>'
      );
      var hideBtn = card.querySelector('[data-action="hideAgain"]');
      if (hideBtn) {
        hideBtn.addEventListener('click', function () {
          var result = card.querySelector('[data-role="result"]');
          result.innerHTML = '';
          result.classList.remove('show');
        });
      }
    });
  }

  // ---- Conversor de Fuso Horário ----
  var TZ_FALLBACK_LIST = [
    'America/Sao_Paulo', 'America/Manaus', 'America/Fortaleza', 'America/Noronha', 'America/Rio_Branco',
    'America/Bogota', 'America/Argentina/Buenos_Aires', 'America/Santiago', 'America/Mexico_City',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto',
    'UTC', 'Europe/Lisbon', 'Europe/Madrid', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
    'Europe/Moscow', 'Africa/Cairo', 'Africa/Johannesburg', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai',
    'Asia/Tokyo', 'Asia/Seoul', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Bangkok',
    'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland',
  ];
  function getTimezoneList() {
    if (typeof Intl.supportedValuesOf === 'function') {
      try {
        var list = Intl.supportedValuesOf('timeZone');
        if (list && list.length) return list;
      } catch (e) { /* fall through */ }
    }
    return TZ_FALLBACK_LIST;
  }
  function tzZoneOffsetMinutes(date, timeZone) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    var parts = dtf.formatToParts(date);
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var asUTC = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
    return (asUTC - date.getTime()) / 60000;
  }
  function tzWallTimeToUTC(y, mo, d, h, mi, timeZone) {
    var guess = new Date(Date.UTC(y, mo, d, h, mi, 0));
    for (var i = 0; i < 3; i++) {
      var offset = tzZoneOffsetMinutes(guess, timeZone);
      var newGuess = new Date(Date.UTC(y, mo, d, h, mi, 0) - offset * 60000);
      if (newGuess.getTime() === guess.getTime()) break;
      guess = newGuess;
    }
    return guess;
  }
  function initTimezoneConverter(card, T) {
    var whenInput = document.getElementById('tzWhen');
    var fromSelect = document.getElementById('tzFrom');
    var toSelect = document.getElementById('tzTo');
    var lang = card.dataset.lang || 'pt';
    var locale = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[lang] || 'pt-BR';

    var zones = getTimezoneList();
    var localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    zones.forEach(function (z) {
      var opt1 = document.createElement('option');
      opt1.value = z; opt1.textContent = z.replace(/_/g, ' ');
      fromSelect.appendChild(opt1);
      var opt2 = document.createElement('option');
      opt2.value = z; opt2.textContent = z.replace(/_/g, ' ');
      toSelect.appendChild(opt2);
    });
    if (zones.indexOf(localZone) !== -1) fromSelect.value = localZone;
    toSelect.value = zones.indexOf('America/Sao_Paulo') !== -1 && localZone !== 'America/Sao_Paulo' ? 'America/Sao_Paulo' : (zones[0] || 'UTC');

    (function setDefaultWhen() {
      var now = new Date();
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      whenInput.value = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
    })();

    on(card, 'swap', function () {
      var tmp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = tmp;
    });

    on(card, 'calc', function () {
      var val = whenInput.value;
      if (!val) { showStatus(card, T.error, 'err'); return; }
      var m = val.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (!m) { showStatus(card, T.error, 'err'); return; }
      showStatus(card, '', '');
      var y = +m[1], mo = +m[2] - 1, d = +m[3], h = +m[4], mi = +m[5];
      var fromZone = fromSelect.value, toZone = toSelect.value;
      var utcInstant = tzWallTimeToUTC(y, mo, d, h, mi, fromZone);
      var fmtOpts = { dateStyle: 'full', timeStyle: 'short' };
      var fromText = new Intl.DateTimeFormat(locale, Object.assign({ timeZone: fromZone }, fmtOpts)).format(utcInstant);
      var toText = new Intl.DateTimeFormat(locale, Object.assign({ timeZone: toZone }, fmtOpts)).format(utcInstant);
      var offsetFrom = tzZoneOffsetMinutes(utcInstant, fromZone);
      var offsetTo = tzZoneOffsetMinutes(utcInstant, toZone);
      var diffH = (offsetTo - offsetFrom) / 60;
      var diffLabel = diffH === 0 ? T.sameOffset : (diffH > 0 ? '+' : '') + diffH + 'h';
      showResult(card,
        '<div class="result-extra" style="width:100%"><strong>' + escHtml(fromZone.replace(/_/g, ' ')) + ':</strong> ' + escHtml(fromText) + '</div>' +
        '<div class="result-value" style="font-size:1.3rem;margin-top:8px">' + escHtml(toText) + '</div>' +
        '<div class="result-extra" style="width:100%;margin-top:4px">' + escHtml(toZone.replace(/_/g, ' ')) + ' &middot; ' + T.diffLabel + ': ' + diffLabel + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- PACE / RITMO DE CORRIDA
  function initPaceCalculator(card, T) {
    function fmtTime(totalS) {
      totalS = Math.max(0, Math.round(totalS));
      var hh = Math.floor(totalS / 3600);
      var mm = Math.floor((totalS % 3600) / 60);
      var ss = totalS % 60;
      if (hh > 0) return hh + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
      return mm + ':' + String(ss).padStart(2, '0');
    }
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var distancia = parseFloat(document.getElementById('distancia').value);
      var h = parseInt(document.getElementById('horas').value, 10) || 0;
      var mi = parseInt(document.getElementById('minutos').value, 10) || 0;
      var s = parseInt(document.getElementById('segundos').value, 10) || 0;
      var totalSec = h * 3600 + mi * 60 + s;
      if (!distancia || distancia <= 0 || totalSec <= 0) { alert(T.error); return; }
      var paceSecPerKm = totalSec / distancia;
      var paceMin = Math.floor(paceSecPerKm / 60);
      var paceSec = Math.round(paceSecPerKm % 60);
      if (paceSec === 60) { paceSec = 0; paceMin++; }
      var speedKmh = distancia / (totalSec / 3600);
      var paceStr = paceMin + ':' + String(paceSec).padStart(2, '0') + ' ' + T.minKm;
      var distances = [[T.d5k, 5], [T.d10k, 10], [T.d21k, 21.0975], [T.d42k, 42.195]];
      var rows = distances.map(function (d) {
        return '<tr><td>' + d[0] + '</td><td class="result-value" style="font-size:1rem">' + fmtTime(paceSecPerKm * d[1]) + '</td></tr>';
      }).join('');
      var html = '<div class="result-extra">' + T.paceLabel + ': <strong>' + paceStr + '</strong></div>' +
        '<div class="result-value">' + T.speedLabel + ': ' + fmtNum(speedKmh, lang) + ' km/h</div>' +
        '<table class="result-table"><thead><tr><th>' + T.estimateHeader + '</th><th>' + T.timeHeader + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE TROCO (só PT)
  function initTrocoCalculator(card, T) {
    on(card, 'calc', function () {
      var valorCompra = parseFloat(document.getElementById('valorCompra').value);
      var valorPago = parseFloat(document.getElementById('valorPago').value);
      if (isNaN(valorCompra) || valorCompra < 0 || isNaN(valorPago) || valorPago < 0) { alert(T.error); return; }
      if (valorPago < valorCompra) { alert(T.errorInsuficiente); return; }
      var trocoCentavos = Math.round((valorPago - valorCompra) * 100);
      if (trocoCentavos === 0) { showResult(card, '<div class="result-value">' + T.semTroco + '</div>'); return; }
      var denominacoes = [
        [20000, T.n200], [10000, T.n100], [5000, T.n50], [2000, T.n20], [1000, T.n10], [500, T.n5], [200, T.n2],
        [100, T.m1], [50, T.m050], [25, T.m025], [10, T.m010], [5, T.m005],
      ];
      var restante = trocoCentavos;
      var rows = [];
      denominacoes.forEach(function (d) {
        var qtd = Math.floor(restante / d[0]);
        if (qtd > 0) {
          rows.push('<tr><td>' + d[1] + '</td><td class="result-value" style="font-size:1rem">' + qtd + '</td></tr>');
          restante -= qtd * d[0];
        }
      });
      var trocoTotal = (trocoCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      var html = '<div class="result-value">' + T.trocoTotal + ': ' + trocoTotal + '</div>' +
        '<table class="result-table"><thead><tr><th>' + T.denomHeader + '</th><th>' + T.qtdHeader + '</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR DE UNIDADES GERAL
  var UNIT_GROUPS = {
    comprimento: { km: 1000, m: 1, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    peso: { t: 1000, kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125 },
    volume: { m3: 1000, l: 1, ml: 0.001, gal: 3.785411784, cup: 0.2365882365 },
  };
  var UNIT_ORDER = {
    comprimento: ['km', 'm', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'],
    peso: ['t', 'kg', 'g', 'mg', 'lb', 'oz'],
    volume: ['m3', 'l', 'ml', 'gal', 'cup'],
  };
  function initUnitConverter(card, T) {
    var tipoSel = document.getElementById('tipoUnidade');
    var deSel = document.getElementById('unidadeDe');
    function populateDe() {
      var units = UNIT_ORDER[tipoSel.value];
      deSel.innerHTML = units.map(function (u) {
        return '<option value="' + u + '">' + escHtml((T.units && T.units[u]) || u) + '</option>';
      }).join('');
    }
    tipoSel.addEventListener('change', populateDe);
    populateDe();

    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var tipo = tipoSel.value;
      var valor = parseFloat(document.getElementById('valorUnidade').value);
      var de = deSel.value;
      if (isNaN(valor)) { alert(T.error); return; }
      var group = UNIT_GROUPS[tipo];
      var order = UNIT_ORDER[tipo];
      var base = valor * group[de];
      var rows = order.filter(function (u) { return u !== de; }).map(function (u) {
        var converted = base / group[u];
        return '<tr><td>' + escHtml((T.units && T.units[u]) || u) + '</td><td class="result-value" style="font-size:1rem">' + converted.toLocaleString(localeFor(lang), { maximumFractionDigits: 6 }) + '</td></tr>';
      }).join('');
      var html = '<table class="result-table"><thead><tr><th>' + T.unitHeader + '</th><th>' + T.valueHeader + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- ÁREA E PERÍMETRO DE FIGURAS GEOMÉTRICAS
  var GEOM_FIGURES = {
    quadrado: ['inA'],
    retangulo: ['inA', 'inB'],
    triangulo: ['inA', 'inB', 'inC'],
    circulo: ['inA'],
    trapezio: ['inA', 'inB', 'inC', 'inD'],
    paralelogramo: ['inA', 'inB', 'inC'],
    losango: ['inA', 'inB'],
  };
  function initGeometryCalculator(card, T) {
    var figSel = document.getElementById('figura');
    var fieldIds = ['inA', 'inB', 'inC', 'inD'];
    function updateFields() {
      var fig = figSel.value;
      var visible = GEOM_FIGURES[fig];
      var labels = T.figLabels[fig];
      fieldIds.forEach(function (id) {
        var input = document.getElementById(id);
        var fieldDiv = input.closest('.field');
        var idx = visible.indexOf(id);
        if (idx === -1) {
          fieldDiv.style.display = 'none';
        } else {
          fieldDiv.style.display = '';
          var label = fieldDiv.querySelector('label');
          if (label) label.textContent = labels[idx];
        }
      });
    }
    figSel.addEventListener('change', updateFields);
    updateFields();

    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var fig = figSel.value;
      var visible = GEOM_FIGURES[fig];
      var vals = visible.map(function (id) { return parseFloat(document.getElementById(id).value); });
      if (vals.some(function (v) { return isNaN(v) || v <= 0; })) { alert(T.error); return; }
      var area, perimetro;
      if (fig === 'quadrado') {
        var a = vals[0]; area = a * a; perimetro = 4 * a;
      } else if (fig === 'retangulo') {
        var b = vals[0], hh1 = vals[1]; area = b * hh1; perimetro = 2 * (b + hh1);
      } else if (fig === 'triangulo') {
        var a1 = vals[0], b1 = vals[1], c1 = vals[2];
        if (a1 + b1 <= c1 || a1 + c1 <= b1 || b1 + c1 <= a1) { alert(T.errorTriangulo); return; }
        var s = (a1 + b1 + c1) / 2;
        area = Math.sqrt(s * (s - a1) * (s - b1) * (s - c1));
        perimetro = a1 + b1 + c1;
      } else if (fig === 'circulo') {
        var r = vals[0]; area = Math.PI * r * r; perimetro = 2 * Math.PI * r;
      } else if (fig === 'trapezio') {
        var B = vals[0], bMenor = vals[1], hh2 = vals[2], ladoT = vals[3];
        area = (B + bMenor) / 2 * hh2; perimetro = B + bMenor + 2 * ladoT;
      } else if (fig === 'paralelogramo') {
        var base = vals[0], altura = vals[1], ladoP = vals[2];
        area = base * altura; perimetro = 2 * (base + ladoP);
      } else if (fig === 'losango') {
        var d1 = vals[0], d2 = vals[1];
        area = (d1 * d2) / 2;
        var ladoL = Math.sqrt(Math.pow(d1 / 2, 2) + Math.pow(d2 / 2, 2));
        perimetro = 4 * ladoL;
      }
      var html = '<div class="result-extra">' + T.areaLabel + ': <strong>' + fmtNum(area, lang, 2) + '</strong></div>' +
        '<div class="result-value">' + T.perimetroLabel + ': ' + fmtNum(perimetro, lang, 2) + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- GERADOR DE IMAGEM PLACEHOLDER
  function initPlaceholderGenerator(card, T) {
    var bgInput = document.getElementById('corFundo');
    var txtInput = document.getElementById('corTexto');
    if (!bgInput.value) bgInput.value = '#cccccc';
    if (!txtInput.value) txtInput.value = '#666666';
    function validHex(v) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v); }
    on(card, 'generate', function () {
      var w = parseInt(document.getElementById('largura').value, 10);
      var h = parseInt(document.getElementById('altura').value, 10);
      if (!w || !h || w < 1 || h < 1 || w > 5000 || h > 5000) { alert(T.error); return; }
      var bg = validHex(bgInput.value) ? bgInput.value : '#cccccc';
      var fg = validHex(txtInput.value) ? txtInput.value : '#666666';
      var texto = (document.getElementById('textoPersonalizado').value || '').trim() || (w + ' × ' + h);
      var formato = document.getElementById('formato').value;
      showResult(card,
        '<canvas data-role="ph-canvas" width="' + w + '" height="' + h + '" style="max-width:100%;height:auto;border:1px solid #ddd"></canvas>' +
        '<button type="button" class="btn-secondary" data-download>' + T.download + '</button>'
      );
      var canvas = card.querySelector('[data-role="ph-canvas"]');
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = fg;
      var fontSize = Math.max(10, Math.round(Math.min(w, h) / 8));
      ctx.font = 'bold ' + fontSize + 'px sans-serif';
      while (fontSize > 8 && ctx.measureText(texto).width > w * 0.9) {
        fontSize -= 2;
        ctx.font = 'bold ' + fontSize + 'px sans-serif';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(texto, w / 2, h / 2);
      var downloadBtn = card.querySelector('[data-download]');
      downloadBtn.addEventListener('click', function () {
        var mime = formato === 'jpg' ? 'image/jpeg' : 'image/png';
        var a = document.createElement('a');
        a.href = canvas.toDataURL(mime, 0.92);
        a.download = 'placeholder-' + w + 'x' + h + '.' + formato;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  }

  // ---------------------------------------------------------- GERADOR DE QR CODE VCARD
  function initVcardQrGenerator(card, T) {
    on(card, 'generate', function () {
      var nome = (document.getElementById('nome').value || '').trim();
      var sobrenome = (document.getElementById('sobrenome').value || '').trim();
      if (!nome) { alert(T.error); return; }
      var telefone = (document.getElementById('telefone').value || '').trim();
      var email = (document.getElementById('email').value || '').trim();
      var empresa = (document.getElementById('empresa').value || '').trim();
      var cargo = (document.getElementById('cargo').value || '').trim();
      var site = (document.getElementById('site').value || '').trim();
      var tamanho = document.getElementById('tamanho').value;
      var cellSize = { pequeno: 4, medio: 6, grande: 8 }[tamanho] || 6;
      var fullName = (nome + ' ' + sobrenome).trim();
      var lines = ['BEGIN:VCARD', 'VERSION:3.0', 'N:' + sobrenome + ';' + nome + ';;;', 'FN:' + fullName];
      if (empresa) lines.push('ORG:' + empresa);
      if (cargo) lines.push('TITLE:' + cargo);
      if (telefone) lines.push('TEL;TYPE=CELL:' + telefone);
      if (email) lines.push('EMAIL:' + email);
      if (site) lines.push('URL:' + site);
      lines.push('END:VCARD');
      var vcard = lines.join('\n');
      var qr;
      try {
        qr = qrcode(0, 'M');
        qr.addData(vcard);
        qr.make();
      } catch (e) {
        alert(T.errorTooLong || T.error);
        return;
      }
      var moduleCount = qr.getModuleCount();
      var size = moduleCount * cellSize;
      showResult(card,
        '<canvas data-role="vcard-canvas" width="' + size + '" height="' + size + '" style="max-width:100%;height:auto;"></canvas>' +
        '<button type="button" class="btn-secondary" data-download>' + T.download + '</button>'
      );
      var canvas = card.querySelector('[data-role="vcard-canvas"]');
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      qr.renderTo2dContext(ctx, cellSize);
      var downloadBtn = card.querySelector('[data-download]');
      downloadBtn.addEventListener('click', function () {
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'vcard-qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  }

  // ---------------------------------------------------------- GERADOR DE CÓDIGO DE BARRAS EAN-13
  var EAN_L = { 0: '0001101', 1: '0011001', 2: '0010011', 3: '0111101', 4: '0100011', 5: '0110001', 6: '0101111', 7: '0111011', 8: '0110111', 9: '0001011' };
  var EAN_G = { 0: '0100111', 1: '0110011', 2: '0011011', 3: '0100001', 4: '0011101', 5: '0111001', 6: '0000101', 7: '0010001', 8: '0001001', 9: '0010111' };
  var EAN_R = { 0: '1110010', 1: '1100110', 2: '1101100', 3: '1000010', 4: '1011100', 5: '1001110', 6: '1010000', 7: '1000100', 8: '1001000', 9: '1110100' };
  var EAN_PARITY = { 0: 'LLLLLL', 1: 'LLGLGG', 2: 'LLGGLG', 3: 'LLGGGL', 4: 'LGLLGG', 5: 'LGGLLG', 6: 'LGGGLL', 7: 'LGLGLG', 8: 'LGLGGL', 9: 'LGGLGL' };
  function ean13CheckDigit(digits12) {
    var sum = 0;
    for (var i = 0; i < 12; i++) sum += Number(digits12[i]) * (i % 2 === 0 ? 1 : 3);
    return String((10 - (sum % 10)) % 10);
  }
  function ean13Bars(digits13) {
    var first = digits13[0];
    var mid = digits13.slice(1, 7);
    var right = digits13.slice(7, 13);
    var pattern = EAN_PARITY[first];
    var bars = '101';
    var guardFlags = [true, true, true];
    var i, k;
    for (i = 0; i < 6; i++) {
      var table = pattern[i] === 'L' ? EAN_L : EAN_G;
      bars += table[mid[i]];
      for (k = 0; k < 7; k++) guardFlags.push(false);
    }
    bars += '01010';
    for (k = 0; k < 5; k++) guardFlags.push(true);
    for (i = 0; i < 6; i++) {
      bars += EAN_R[right[i]];
      for (k = 0; k < 7; k++) guardFlags.push(false);
    }
    bars += '101';
    guardFlags.push(true, true, true);
    return { bars: bars, guardFlags: guardFlags };
  }
  function initEan13Generator(card, T) {
    on(card, 'generate', function () {
      var raw = (document.getElementById('codigo').value || '').replace(/\D/g, '');
      if (!raw || raw.length > 12) { alert(T.error); return; }
      var digits12 = raw.padStart(12, '0');
      var check = ean13CheckDigit(digits12);
      var digits13 = digits12 + check;
      var tamanho = document.getElementById('tamanho').value;
      var mw = { pequeno: 1.5, medio: 2, grande: 3 }[tamanho] || 2;
      var encoded = ean13Bars(digits13);
      var bars = encoded.bars, guardFlags = encoded.guardFlags;
      var quietZone = 10 * mw;
      var barHeight = 70;
      var guardExtra = 12;
      var fontSize = 14;
      var canvasW = Math.ceil(quietZone * 2 + 95 * mw);
      var canvasH = barHeight + guardExtra + fontSize + 6;
      showResult(card,
        '<canvas data-role="ean-canvas" width="' + canvasW + '" height="' + canvasH + '" style="max-width:100%;height:auto;background:#fff"></canvas>' +
        '<div class="result-extra">' + T.codeLabel + ': <strong>' + digits13 + '</strong></div>' +
        '<button type="button" class="btn-secondary" data-download>' + T.download + '</button>'
      );
      var canvas = card.querySelector('[data-role="ean-canvas"]');
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.fillStyle = '#000000';
      var x = quietZone;
      for (var i = 0; i < bars.length; i++) {
        if (bars[i] === '1') {
          var hgt = guardFlags[i] ? barHeight + guardExtra : barHeight;
          ctx.fillRect(x, 0, mw, hgt);
        }
        x += mw;
      }
      var textY = barHeight + guardExtra + fontSize - 2;
      ctx.font = fontSize + 'px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(digits13[0], quietZone - 2, textY);
      ctx.textAlign = 'center';
      var leftCenter = quietZone + (3 + 21) * mw;
      ctx.fillText(digits13.slice(1, 7), leftCenter, textY);
      var rightCenter = quietZone + (50 + 21) * mw;
      ctx.fillText(digits13.slice(7, 13), rightCenter, textY);
      var downloadBtn = card.querySelector('[data-download]');
      downloadBtn.addEventListener('click', function () {
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'ean13-' + digits13 + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  }

  // ---------------------------------------------------------- REDES: helpers comuns
  function maskFromPrefix(prefix) {
    return prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  }
  function prefixFromMaskInt(maskInt) {
    for (var p = 0; p <= 32; p++) {
      if (maskFromPrefix(p) === maskInt) return p;
    }
    return null;
  }
  function ipBinaryStr(n) {
    var s = (n >>> 0).toString(2);
    while (s.length < 32) s = '0' + s;
    return s.replace(/(.{8})(?=.)/g, '$1.');
  }
  // aceita "/24", "24" ou "255.255.255.0" e retorna o prefixo (0-32), ou null se inválido
  function parsePrefixOrMask(raw) {
    raw = (raw || '').trim();
    if (!raw) return null;
    if (raw.indexOf('.') !== -1) {
      var mInt = ipToInt(raw);
      if (mInt === null) return null;
      return prefixFromMaskInt(mInt);
    }
    var clean = raw.replace(/^\//, '');
    if (!/^\d{1,2}$/.test(clean)) return null;
    var p = parseInt(clean, 10);
    return (p >= 0 && p <= 32) ? p : null;
  }

  // ---------------------------------------------------------- CONVERSOR DE MÁSCARA DE SUB-REDE
  function initSubnetMaskConverter(card, T) {
    on(card, 'calc', function () {
      var raw = document.getElementById('entrada').value;
      var prefix = parsePrefixOrMask(raw);
      if (prefix === null) { alert(T.error); return; }
      var maskInt = maskFromPrefix(prefix);
      var wildcardInt = (~maskInt) >>> 0;
      var totalAddr = Math.pow(2, 32 - prefix);
      var usable = prefix >= 31 ? totalAddr : Math.max(0, totalAddr - 2);
      var rows = [
        [T.rowCidr, '/' + prefix],
        [T.rowMask, intToIp(maskInt)],
        [T.rowMaskBin, ipBinaryStr(maskInt)],
        [T.rowWildcard, intToIp(wildcardInt)],
        [T.rowTotal, totalAddr.toLocaleString()],
        [T.rowUsable, usable.toLocaleString()],
      ];
      var html = '<table class="result-table"><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="result-value" style="font-size:1rem">' + r[1] + '</td></tr>'; }).join('') +
        '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA VLSM
  function initVlsmCalculator(card, T) {
    on(card, 'calc', function () {
      var enderecoBase = (document.getElementById('enderecoBase').value || '').trim();
      var prefixoBase = parseInt(document.getElementById('prefixoBase').value, 10);
      var baseInt = ipToInt(enderecoBase);
      if (baseInt === null || isNaN(prefixoBase) || prefixoBase < 0 || prefixoBase > 32) { alert(T.error); return; }
      var linhas = (document.getElementById('subredes').value || '').split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l !== ''; });
      if (linhas.length === 0) { alert(T.error); return; }
      var hosts = [];
      for (var i = 0; i < linhas.length; i++) {
        var n = parseInt(linhas[i], 10);
        if (isNaN(n) || n < 1) { alert(T.errorHosts); return; }
        hosts.push(n);
      }
      var indexed = hosts.map(function (h, i) { return { h: h, i: i }; });
      indexed.sort(function (a, b) { return b.h - a.h; });
      var networkInt = maskFromPrefix(prefixoBase) & baseInt;
      var totalSpace = Math.pow(2, 32 - prefixoBase);
      var cursor = 0;
      var results = [];
      var overflow = false;
      indexed.forEach(function (item) {
        var hostBits = Math.max(2, Math.ceil(Math.log2(item.h + 2)));
        var blockSize = Math.pow(2, hostBits);
        var prefix = 32 - hostBits;
        if (cursor + blockSize > totalSpace) overflow = true;
        var network = (networkInt + cursor) >>> 0;
        var broadcast = (network + blockSize - 1) >>> 0;
        results.push({
          orig: item.i, hosts: item.h, prefix: prefix,
          network: intToIp(network), broadcast: intToIp(broadcast),
          firstHost: intToIp((network + 1) >>> 0), lastHost: intToIp((broadcast - 1) >>> 0),
          maxHosts: blockSize - 2,
        });
        cursor += blockSize;
      });
      if (overflow) { alert(T.errorOverflow); return; }
      results.sort(function (a, b) { return a.orig - b.orig; });
      var rows = results.map(function (r, idx) {
        return '<tr><td>' + T.subredeLabel + ' ' + (idx + 1) + ' (' + r.hosts + ' ' + T.hostsLabel + ')</td>' +
          '<td>' + r.network + '/' + r.prefix + '</td>' +
          '<td>' + r.firstHost + ' – ' + r.lastHost + '</td>' +
          '<td>' + r.broadcast + '</td>' +
          '<td>' + r.maxHosts.toLocaleString() + '</td></tr>';
      }).join('');
      var html = '<div class="result-extra">' + T.usedLabel + ': <strong>' + cursor.toLocaleString() + ' / ' + totalSpace.toLocaleString() + '</strong> ' + T.addressesLabel + '</div>' +
        '<table class="result-table"><thead><tr><th>' + T.subredeLabel + '</th><th>' + T.rowNetwork + '</th><th>' + T.rowUsableRange + '</th><th>' + T.rowBroadcast + '</th><th>' + T.rowMaxHosts + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- VERIFICADOR DE IP EM SUB-REDE
  function initIpInSubnetChecker(card, T) {
    on(card, 'calc', function () {
      var ipRaw = (document.getElementById('ipVerificar').value || '').trim();
      var cidrRaw = (document.getElementById('cidrRede').value || '').trim();
      var parts = cidrRaw.split('/');
      if (parts.length !== 2) { alert(T.error); return; }
      var ip = ipToInt(ipRaw);
      var netIp = ipToInt(parts[0]);
      var prefix = parseInt(parts[1], 10);
      if (ip === null || netIp === null || isNaN(prefix) || prefix < 0 || prefix > 32) { alert(T.error); return; }
      var maskInt = maskFromPrefix(prefix);
      var network = (netIp & maskInt) >>> 0;
      var broadcast = (network | (~maskInt >>> 0)) >>> 0;
      var belongs = ((ip & maskInt) >>> 0) === network;
      var html = '<div class="status-box ' + (belongs ? 'ok' : 'err') + '" style="display:inline-block;padding:6px 14px;border-radius:20px;font-weight:700">' + (belongs ? T.pertence : T.naoPertence) + '</div>' +
        '<div class="result-extra">' + T.rowNetwork + ': <strong>' + intToIp(network) + '/' + prefix + '</strong></div>' +
        '<div class="result-extra">' + T.rowUsableRange + ': <strong>' + intToIp((network + 1) >>> 0) + ' – ' + intToIp((broadcast - 1) >>> 0) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- COMPARADOR DE DOIS CIDRS
  function initCidrOverlapChecker(card, T) {
    function parseCidr(raw) {
      var parts = (raw || '').trim().split('/');
      if (parts.length !== 2) return null;
      var ip = ipToInt(parts[0]);
      var prefix = parseInt(parts[1], 10);
      if (ip === null || isNaN(prefix) || prefix < 0 || prefix > 32) return null;
      var maskInt = maskFromPrefix(prefix);
      var network = (ip & maskInt) >>> 0;
      var broadcast = (network | (~maskInt >>> 0)) >>> 0;
      return { network: network, broadcast: broadcast, prefix: prefix };
    }
    on(card, 'calc', function () {
      var a = parseCidr(document.getElementById('cidrA').value);
      var b = parseCidr(document.getElementById('cidrB').value);
      if (!a || !b) { alert(T.error); return; }
      var overlap = a.network <= b.broadcast && b.network <= a.broadcast;
      var html = '<div class="status-box ' + (overlap ? 'err' : 'ok') + '" style="display:inline-block;padding:6px 14px;border-radius:20px;font-weight:700">' + (overlap ? T.sobrepoe : T.naoSobrepoe) + '</div>' +
        '<div class="result-extra">A: <strong>' + intToIp(a.network) + ' – ' + intToIp(a.broadcast) + '</strong> (/' + a.prefix + ')</div>' +
        '<div class="result-extra">B: <strong>' + intToIp(b.network) + ' – ' + intToIp(b.broadcast) + '</strong> (/' + b.prefix + ')</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR DE IP PARA BINÁRIO/HEXADECIMAL
  function initIpBinHexConverter(card, T) {
    on(card, 'calc', function () {
      var raw = (document.getElementById('ipConverter').value || '').trim();
      var ip = ipToInt(raw);
      if (ip === null) { alert(T.error); return; }
      var octets = raw.split('.').map(function (o) { return parseInt(o, 10); });
      var rows = octets.map(function (o, i) {
        return '<tr><td>' + T.octetoLabel + ' ' + (i + 1) + '</td><td>' + o + '</td><td>' + o.toString(2).padStart(8, '0') + '</td><td>' + o.toString(16).toUpperCase().padStart(2, '0') + '</td></tr>';
      }).join('');
      var html = '<table class="result-table"><thead><tr><th></th><th>' + T.decimalLabel + '</th><th>' + T.binarioLabel + '</th><th>' + T.hexLabel + '</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="result-extra">' + T.binario32 + ': <strong style="font-family:monospace">' + ipBinaryStr(ip) + '</strong></div>' +
        '<div class="result-value">' + T.hex32 + ': ' + '0x' + ip.toString(16).toUpperCase().padStart(8, '0') + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR DE UNIDADES DE DADOS
  var DATA_UNITS = {
    bit: 0.125, byte: 1,
    KB: 1000, MB: 1000 * 1000, GB: 1000 * 1000 * 1000, TB: 1000 * 1000 * 1000 * 1000,
    KiB: 1024, MiB: 1024 * 1024, GiB: 1024 * 1024 * 1024, TiB: 1024 * 1024 * 1024 * 1024,
  };
  var DATA_UNITS_ORDER = ['bit', 'byte', 'KB', 'MB', 'GB', 'TB', 'KiB', 'MiB', 'GiB', 'TiB'];
  function initDataUnitConverter(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var valor = parseFloat(document.getElementById('valorDados').value);
      var unidade = document.getElementById('unidadeDados').value;
      if (isNaN(valor) || valor < 0) { alert(T.error); return; }
      var bytes = valor * DATA_UNITS[unidade];
      var rows = DATA_UNITS_ORDER.filter(function (u) { return u !== unidade; }).map(function (u) {
        var converted = bytes / DATA_UNITS[u];
        return '<tr><td>' + (T.units && T.units[u] || u) + '</td><td class="result-value" style="font-size:1rem">' + converted.toLocaleString(localeFor(lang), { maximumFractionDigits: 6 }) + '</td></tr>';
      }).join('');
      var html = '<table class="result-table"><thead><tr><th>' + T.unitHeader + '</th><th>' + T.valueHeader + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- TABELA DE PORTAS COMUNS
  var COMMON_PORTS = [
    [20, 'FTP (dados)'], [21, 'FTP (controle)'], [22, 'SSH'], [23, 'Telnet'], [25, 'SMTP'],
    [53, 'DNS'], [67, 'DHCP (servidor)'], [68, 'DHCP (cliente)'], [69, 'TFTP'], [80, 'HTTP'],
    [110, 'POP3'], [119, 'NNTP'], [123, 'NTP'], [135, 'RPC (Windows)'], [137, 'NetBIOS (nome)'],
    [139, 'NetBIOS (sessão)'], [143, 'IMAP'], [161, 'SNMP'], [162, 'SNMP (trap)'], [179, 'BGP'],
    [194, 'IRC'], [389, 'LDAP'], [443, 'HTTPS'], [445, 'SMB (Windows)'], [465, 'SMTPS'],
    [514, 'Syslog'], [515, 'LPD (impressão)'], [587, 'SMTP (submissão)'], [636, 'LDAPS'],
    [873, 'rsync'], [993, 'IMAPS'], [995, 'POP3S'], [1080, 'SOCKS Proxy'], [1194, 'OpenVPN'],
    [1433, 'Microsoft SQL Server'], [1521, 'Oracle DB'], [1723, 'PPTP'], [1883, 'MQTT'],
    [2049, 'NFS'], [2082, 'cPanel'], [2083, 'cPanel (SSL)'], [2222, 'SSH (alternativa)'],
    [27017, 'MongoDB'], [3000, 'Dev server (Node/React comum)'], [3128, 'Squid Proxy'],
    [3306, 'MySQL / MariaDB'], [3389, 'RDP (Área de Trabalho Remota)'], [3690, 'SVN'],
    [5000, 'Dev server (Flask/UPnP comum)'], [5060, 'SIP (VoIP)'], [5222, 'XMPP'],
    [5432, 'PostgreSQL'], [5601, 'Kibana'], [5900, 'VNC'], [5984, 'CouchDB'],
    [6379, 'Redis'], [6660, 'IRC (alternativa)'], [8000, 'HTTP (alternativa)'],
    [8080, 'HTTP Proxy / Tomcat'], [8443, 'HTTPS (alternativa)'], [8888, 'HTTP (alternativa)'],
    [9000, 'PHP-FPM'], [9042, 'Cassandra'], [9092, 'Kafka'], [9200, 'Elasticsearch'],
    [11211, 'Memcached'], [27015, 'Steam / Source Engine'],
  ];
  function renderPortsTable(card, filtro) {
    var f = (filtro || '').trim().toLowerCase();
    var filtered = COMMON_PORTS.filter(function (p) {
      return !f || String(p[0]).indexOf(f) !== -1 || p[1].toLowerCase().indexOf(f) !== -1;
    });
    var rows = filtered.map(function (p) { return '<tr><td class="cell-strong">' + p[0] + '</td><td>' + p[1] + '</td></tr>'; }).join('');
    var html = '<table class="result-table"><thead><tr><th>' + card.dataset.portHeader + '</th><th>' + card.dataset.serviceHeader + '</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="2">' + card.dataset.noResults + '</td></tr>') + '</tbody></table>';
    showResult(card, html);
  }
  function initCommonPortsTable(card, T) {
    card.dataset.portHeader = T.portHeader;
    card.dataset.serviceHeader = T.serviceHeader;
    card.dataset.noResults = T.noResults;
    var input = document.getElementById('buscaPorta');
    renderPortsTable(card, '');
    input.addEventListener('input', function () { renderPortsTable(card, input.value); });
    on(card, 'calc', function () { renderPortsTable(card, input.value); });
  }

  // ---------------------------------------------------------- TABELA DE CÓDIGOS DE STATUS HTTP
  var HTTP_STATUS_CODES = [
    [200, 'OK'], [201, 'Created'], [202, 'Accepted'], [204, 'No Content'],
    [301, 'Moved Permanently'], [302, 'Found (Redirecionamento temporário)'], [304, 'Not Modified'], [307, 'Temporary Redirect'], [308, 'Permanent Redirect'],
    [400, 'Bad Request'], [401, 'Unauthorized'], [402, 'Payment Required'], [403, 'Forbidden'], [404, 'Not Found'],
    [405, 'Method Not Allowed'], [406, 'Not Acceptable'], [408, 'Request Timeout'], [409, 'Conflict'], [410, 'Gone'],
    [413, 'Payload Too Large'], [414, 'URI Too Long'], [415, 'Unsupported Media Type'], [418, "I'm a teapot"], [422, 'Unprocessable Entity'],
    [429, 'Too Many Requests'], [431, 'Request Header Fields Too Large'],
    [500, 'Internal Server Error'], [501, 'Not Implemented'], [502, 'Bad Gateway'], [503, 'Service Unavailable'], [504, 'Gateway Timeout'], [505, 'HTTP Version Not Supported'],
  ];
  var HTTP_STATUS_DESC = {
    pt: {
      200: 'A requisição foi bem-sucedida.', 201: 'O recurso foi criado com sucesso.', 202: 'A requisição foi aceita para processamento, mas ainda não concluída.', 204: 'Sucesso, mas sem conteúdo para retornar.',
      301: 'O recurso foi movido permanentemente para outra URL.', 302: 'O recurso está temporariamente em outra URL.', 304: 'O recurso não mudou desde a última vez (cache).', 307: 'Redirecionamento temporário, mantendo o método HTTP.', 308: 'Redirecionamento permanente, mantendo o método HTTP.',
      400: 'A requisição está malformada ou inválida.', 401: 'Autenticação necessária ou inválida.', 402: 'Reservado para uso futuro (pagamento).', 403: 'O servidor entendeu, mas recusa autorizar.', 404: 'O recurso não foi encontrado.',
      405: 'O método HTTP usado não é permitido para esse recurso.', 406: 'O servidor não pode gerar uma resposta aceitável pelo formato pedido.', 408: 'O servidor esperou a requisição por tempo demais.', 409: 'A requisição conflita com o estado atual do recurso.', 410: 'O recurso existiu, mas foi removido permanentemente.',
      413: 'O corpo da requisição é grande demais.', 414: 'A URL enviada é longa demais.', 415: 'O formato de mídia da requisição não é suportado.', 418: 'Easter egg do protocolo HTTP (RFC 2324) — não usado a sério.', 422: 'A requisição está bem formada, mas com erros semânticos.',
      429: 'O cliente enviou requisições demais em pouco tempo (rate limit).', 431: 'Os cabeçalhos da requisição são grandes demais.',
      500: 'Erro genérico e inesperado no servidor.', 501: 'O servidor não suporta a funcionalidade pedida.', 502: 'Um servidor atuando como gateway recebeu uma resposta inválida.', 503: 'O servidor está temporariamente indisponível (manutenção/sobrecarga).', 504: 'O gateway não recebeu resposta a tempo do servidor de origem.', 505: 'A versão do protocolo HTTP usada não é suportada.',
    },
    en: {
      200: 'The request succeeded.', 201: 'The resource was created successfully.', 202: 'The request was accepted for processing, but not yet completed.', 204: 'Success, but no content to return.',
      301: 'The resource was permanently moved to another URL.', 302: 'The resource is temporarily at another URL.', 304: 'The resource has not changed since last time (cache).', 307: 'Temporary redirect, keeping the HTTP method.', 308: 'Permanent redirect, keeping the HTTP method.',
      400: 'The request is malformed or invalid.', 401: 'Authentication is required or invalid.', 402: 'Reserved for future use (payment).', 403: 'The server understood but refuses to authorize it.', 404: 'The resource was not found.',
      405: 'The HTTP method used is not allowed for this resource.', 406: 'The server cannot produce a response acceptable per the requested format.', 408: 'The server waited too long for the request.', 409: 'The request conflicts with the resource\'s current state.', 410: 'The resource existed but was permanently removed.',
      413: 'The request body is too large.', 414: 'The URL sent is too long.', 415: 'The request\'s media format is not supported.', 418: 'HTTP protocol Easter egg (RFC 2324) — not used seriously.', 422: 'The request is well-formed but has semantic errors.',
      429: 'The client sent too many requests in too little time (rate limit).', 431: 'The request headers are too large.',
      500: 'Generic, unexpected server error.', 501: 'The server does not support the requested functionality.', 502: 'A server acting as a gateway received an invalid response.', 503: 'The server is temporarily unavailable (maintenance/overload).', 504: 'The gateway did not get a timely response from the upstream server.', 505: 'The HTTP protocol version used is not supported.',
    },
    es: {
      200: 'La solicitud fue exitosa.', 201: 'El recurso fue creado con éxito.', 202: 'La solicitud fue aceptada para procesamiento, pero aún no se completó.', 204: 'Éxito, pero sin contenido para devolver.',
      301: 'El recurso fue movido permanentemente a otra URL.', 302: 'El recurso está temporalmente en otra URL.', 304: 'El recurso no cambió desde la última vez (caché).', 307: 'Redirección temporal, manteniendo el método HTTP.', 308: 'Redirección permanente, manteniendo el método HTTP.',
      400: 'La solicitud está malformada o es inválida.', 401: 'Se requiere autenticación o es inválida.', 402: 'Reservado para uso futuro (pago).', 403: 'El servidor entendió, pero se niega a autorizar.', 404: 'El recurso no fue encontrado.',
      405: 'El método HTTP usado no está permitido para este recurso.', 406: 'El servidor no puede generar una respuesta aceptable según el formato pedido.', 408: 'El servidor esperó demasiado tiempo la solicitud.', 409: 'La solicitud entra en conflicto con el estado actual del recurso.', 410: 'El recurso existió, pero fue eliminado permanentemente.',
      413: 'El cuerpo de la solicitud es demasiado grande.', 414: 'La URL enviada es demasiado larga.', 415: 'El formato de medio de la solicitud no es compatible.', 418: 'Easter egg del protocolo HTTP (RFC 2324) — no se usa en serio.', 422: 'La solicitud está bien formada, pero tiene errores semánticos.',
      429: 'El cliente envió demasiadas solicitudes en poco tiempo (límite de tasa).', 431: 'Los encabezados de la solicitud son demasiado grandes.',
      500: 'Error genérico e inesperado del servidor.', 501: 'El servidor no admite la funcionalidad solicitada.', 502: 'Un servidor que actúa como gateway recibió una respuesta inválida.', 503: 'El servidor está temporalmente no disponible (mantenimiento/sobrecarga).', 504: 'El gateway no recibió respuesta a tiempo del servidor de origen.', 505: 'La versión del protocolo HTTP usada no es compatible.',
    },
  };
  function renderHttpStatusTable(card, T, filtro) {
    var lang = card.dataset.lang;
    var descs = HTTP_STATUS_DESC[lang] || HTTP_STATUS_DESC.pt;
    var f = (filtro || '').trim().toLowerCase();
    var filtered = HTTP_STATUS_CODES.filter(function (c) {
      return !f || String(c[0]).indexOf(f) !== -1 || c[1].toLowerCase().indexOf(f) !== -1;
    });
    var rows = filtered.map(function (c) {
      var color = c[0] < 300 ? 'var(--ok,#166534)' : (c[0] < 400 ? 'var(--primary,#2c65f2)' : 'var(--err,#b91c1c)');
      return '<tr><td class="cell-strong" style="color:' + color + '">' + c[0] + '</td><td><strong>' + c[1] + '</strong><br><span style="font-size:.85em;color:var(--muted,#666)">' + (descs[c[0]] || '') + '</span></td></tr>';
    }).join('');
    var html = '<table class="result-table"><thead><tr><th>' + T.codeHeader + '</th><th>' + T.meaningHeader + '</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="2">' + T.noResults + '</td></tr>') + '</tbody></table>';
    showResult(card, html);
  }
  function initHttpStatusTable(card, T) {
    var input = document.getElementById('buscaStatus');
    renderHttpStatusTable(card, T, '');
    input.addEventListener('input', function () { renderHttpStatusTable(card, T, input.value); });
    on(card, 'calc', function () { renderHttpStatusTable(card, T, input.value); });
  }

  // ---------------------------------------------------------- GERADOR/VALIDADOR DE ENDEREÇO MAC
  function initMacAddressTool(card, T) {
    on(card, 'generate', function () {
      var separador = document.getElementById('separadorMac').value;
      var sep = separador === 'hifen' ? '-' : ':';
      var entrada = (document.getElementById('enderecoMac').value || '').trim();
      if (entrada) {
        var clean = entrada.replace(/[:\-.\s]/g, '').toUpperCase();
        if (!/^[0-9A-F]{12}$/.test(clean)) {
          showResult(card, '<div class="status-box err" style="display:inline-block;padding:6px 14px;border-radius:20px;font-weight:700">' + T.macInvalido + '</div>');
          return;
        }
        var octets = clean.match(/.{2}/g);
        var formatted = octets.join(sep);
        var firstByte = parseInt(octets[0], 16);
        var isMulticast = (firstByte & 0x01) === 1;
        var isLocal = (firstByte & 0x02) === 2;
        var html = '<div class="status-box ok" style="display:inline-block;padding:6px 14px;border-radius:20px;font-weight:700">' + T.macValido + '</div>' +
          '<div class="result-extra">' + T.formattedLabel + ': <strong style="font-family:monospace">' + formatted + '</strong></div>' +
          '<div class="result-extra">' + T.tipoLabel + ': <strong>' + (isMulticast ? T.multicast : T.unicast) + '</strong></div>' +
          '<div class="result-extra">' + T.administracaoLabel + ': <strong>' + (isLocal ? T.localAdmin : T.globalAdmin) + '</strong></div>';
        showResult(card, html);
      } else {
        var bytes = [];
        for (var i = 0; i < 6; i++) bytes.push(Math.floor(Math.random() * 256));
        bytes[0] = (bytes[0] & 0xFC) | 0x02; // bit local + unicast, evita OUIs reais
        var hexOctets = bytes.map(function (b) { return b.toString(16).toUpperCase().padStart(2, '0'); });
        var mac = hexOctets.join(sep);
        showResult(card,
          '<div class="result-value" style="font-family:monospace">' + mac + '</div>' +
          '<div class="result-extra">' + T.geradoNote + '</div>'
        );
      }
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE TEMPO DE DOWNLOAD
  function initDownloadTimeCalculator(card, T) {
    function fmtTime(totalS) {
      totalS = Math.max(0, Math.round(totalS));
      var hh = Math.floor(totalS / 3600);
      var mm = Math.floor((totalS % 3600) / 60);
      var ss = totalS % 60;
      if (hh > 0) return hh + 'h ' + mm + 'min ' + ss + 's';
      if (mm > 0) return mm + 'min ' + ss + 's';
      return ss + 's';
    }
    on(card, 'calc', function () {
      var tamanho = parseFloat(document.getElementById('tamanhoArquivo').value);
      var unidadeArquivo = document.getElementById('unidadeArquivo').value;
      var velocidade = parseFloat(document.getElementById('velocidadeConexao').value);
      var unidadeVelocidade = document.getElementById('unidadeVelocidade').value;
      if (!tamanho || tamanho <= 0 || !velocidade || velocidade <= 0) { alert(T.error); return; }
      var fileBytesFactor = { KB: 1000, MB: 1000 * 1000, GB: 1000 * 1000 * 1000 }[unidadeArquivo];
      var fileBits = tamanho * fileBytesFactor * 8;
      var speedBitsFactor = { Kbps: 1000, Mbps: 1000 * 1000, MBps: 1000 * 1000 * 8 }[unidadeVelocidade];
      var speedBps = velocidade * speedBitsFactor;
      var seconds = fileBits / speedBps;
      var html = '<div class="result-value">' + T.tempoEstimado + ': ' + fmtTime(seconds) + '</div>' +
        '<div class="result-extra">' + T.velocidadeReal + ': <strong>' + (speedBps / 8 / 1000000).toLocaleString(card.dataset.lang === 'pt' ? 'pt-BR' : 'en-US', { maximumFractionDigits: 2 }) + ' MB/s</strong></div>';
      showResult(card, html);
    });
  }


  // ---------------------------------------------------------- CALCULADORA DE TMB E GASTO CALÓRICO DIÁRIO
  var ACTIVITY_FACTORS = { sedentario: 1.2, leve: 1.375, moderado: 1.55, ativo: 1.725, 'muito-ativo': 1.9 };
  function initBmrCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var sexo = document.getElementById('sexo').value;
      var idade = parseFloat(document.getElementById('idade').value);
      var peso = parseFloat(document.getElementById('peso').value);
      var altura = parseFloat(document.getElementById('altura').value);
      var atividade = document.getElementById('atividade').value;
      if (!idade || idade <= 0 || !peso || peso <= 0 || !altura || altura <= 0) { alert(T.error); return; }
      var bmr = sexo === 'feminino'
        ? (10 * peso + 6.25 * altura - 5 * idade - 161)
        : (10 * peso + 6.25 * altura - 5 * idade + 5);
      var fator = ACTIVITY_FACTORS[atividade] || 1.2;
      var tdee = bmr * fator;
      var html = '<div class="result-value">' + T.tmbLabel + ': ' + fmtNum(bmr, lang, 0) + ' kcal/' + T.diaAbrev + '</div>' +
        '<div class="result-extra">' + T.tdeeLabel + ': <strong>' + fmtNum(tdee, lang, 0) + ' kcal/' + T.diaAbrev + '</strong></div>' +
        '<table class="result-table"><thead><tr><th>' + T.objetivoHeader + '</th><th>' + T.caloriasHeader + '</th></tr></thead><tbody>' +
        '<tr><td>' + T.perderPeso + '</td><td class="result-value" style="font-size:1rem">' + fmtNum(tdee - 500, lang, 0) + ' kcal</td></tr>' +
        '<tr><td>' + T.manterPeso + '</td><td class="result-value" style="font-size:1rem">' + fmtNum(tdee, lang, 0) + ' kcal</td></tr>' +
        '<tr><td>' + T.ganharPeso + '</td><td class="result-value" style="font-size:1rem">' + fmtNum(tdee + 500, lang, 0) + ' kcal</td></tr>' +
        '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE PESO IDEAL
  function initIdealWeightCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var sexo = document.getElementById('sexo').value;
      var altura = parseFloat(document.getElementById('altura').value);
      if (!altura || altura <= 0) { alert(T.error); return; }
      var alturaIn = altura / 2.54;
      var over = Math.max(0, alturaIn - 60);
      var robinson, miller, devine, hamwi;
      if (sexo === 'feminino') {
        robinson = 49 + 1.7 * over;
        miller = 53.1 + 1.36 * over;
        devine = 45.5 + 2.3 * over;
        hamwi = 45.5 + 2.2 * over;
      } else {
        robinson = 52 + 1.9 * over;
        miller = 56.2 + 1.41 * over;
        devine = 50 + 2.3 * over;
        hamwi = 48 + 2.7 * over;
      }
      var media = (robinson + miller + devine + hamwi) / 4;
      var rows = [
        ['Robinson (1983)', robinson], ['Miller (1983)', miller], ['Devine (1974)', devine], ['Hamwi (1964)', hamwi],
      ];
      var html = '<table class="result-table"><thead><tr><th>' + T.formulaHeader + '</th><th>' + T.pesoHeader + '</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="result-value" style="font-size:1rem">' + fmtNum(r[1], lang, 1) + ' kg</td></tr>'; }).join('') +
        '</tbody></table>' +
        '<div class="result-value">' + T.mediaLabel + ': ' + fmtNum(media, lang, 1) + ' kg</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE PERCENTUAL DE GORDURA CORPORAL (MÉTODO DA MARINHA DOS EUA)
  function initBodyFatCalculator(card, T) {
    var sexoSel = document.getElementById('sexo');
    function updateFields() {
      var quadrilField = document.getElementById('quadril').closest('.field');
      quadrilField.style.display = sexoSel.value === 'feminino' ? '' : 'none';
    }
    sexoSel.addEventListener('change', updateFields);
    updateFields();
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var sexo = sexoSel.value;
      var altura = parseFloat(document.getElementById('altura').value);
      var pescoco = parseFloat(document.getElementById('pescoco').value);
      var cintura = parseFloat(document.getElementById('cintura').value);
      var quadril = parseFloat(document.getElementById('quadril').value);
      if (!altura || altura <= 0 || !pescoco || pescoco <= 0 || !cintura || cintura <= 0) { alert(T.error); return; }
      if (sexo === 'feminino' && (!quadril || quadril <= 0)) { alert(T.error); return; }
      var pctGordura;
      if (sexo === 'feminino') {
        pctGordura = 495 / (1.29579 - 0.35004 * Math.log10(cintura + quadril - pescoco) + 0.22100 * Math.log10(altura)) - 450;
      } else {
        pctGordura = 495 / (1.0324 - 0.19077 * Math.log10(cintura - pescoco) + 0.15456 * Math.log10(altura)) - 450;
      }
      if (!isFinite(pctGordura) || isNaN(pctGordura)) { alert(T.errorMedidas); return; }
      var categoria;
      if (sexo === 'feminino') {
        categoria = pctGordura < 21 ? T.catAtleta : pctGordura < 25 ? T.catFitness : pctGordura < 32 ? T.catAceitavel : T.catAlto;
      } else {
        categoria = pctGordura < 14 ? T.catAtleta : pctGordura < 18 ? T.catFitness : pctGordura < 25 ? T.catAceitavel : T.catAlto;
      }
      var html = '<div class="result-value">' + T.percentualLabel + ': ' + fmtNum(pctGordura, lang, 1) + '%</div>' +
        '<div class="result-extra">' + T.categoriaLabel + ': <strong>' + categoria + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE MACRONUTRIENTES
  var MACRO_SPLITS = {
    emagrecer: { protein: 0.40, carb: 0.35, fat: 0.25 },
    manter: { protein: 0.30, carb: 0.40, fat: 0.30 },
    'ganhar-massa': { protein: 0.30, carb: 0.45, fat: 0.25 },
  };
  function initMacroCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var calorias = parseFloat(document.getElementById('calorias').value);
      var objetivo = document.getElementById('objetivo').value;
      if (!calorias || calorias <= 0) { alert(T.error); return; }
      var split = MACRO_SPLITS[objetivo] || MACRO_SPLITS.manter;
      var proteinaG = (calorias * split.protein) / 4;
      var carboG = (calorias * split.carb) / 4;
      var gorduraG = (calorias * split.fat) / 9;
      var html = '<table class="result-table"><thead><tr><th>' + T.macroHeader + '</th><th>' + T.percentualHeader2 + '</th><th>' + T.gramasHeader + '</th></tr></thead><tbody>' +
        '<tr><td>' + T.proteinaLabel + '</td><td>' + Math.round(split.protein * 100) + '%</td><td class="result-value" style="font-size:1rem">' + fmtNum(proteinaG, lang, 0) + ' g</td></tr>' +
        '<tr><td>' + T.carboidratoLabel + '</td><td>' + Math.round(split.carb * 100) + '%</td><td class="result-value" style="font-size:1rem">' + fmtNum(carboG, lang, 0) + ' g</td></tr>' +
        '<tr><td>' + T.gorduraLabel + '</td><td>' + Math.round(split.fat * 100) + '%</td><td class="result-value" style="font-size:1rem">' + fmtNum(gorduraG, lang, 0) + ' g</td></tr>' +
        '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE FREQUÊNCIA CARDÍACA ALVO (FÓRMULA DE KARVONEN)
  function initHeartRateZoneCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var idade = parseFloat(document.getElementById('idade').value);
      var fcRepouso = parseFloat(document.getElementById('fcRepouso').value);
      if (!idade || idade <= 0 || !fcRepouso || fcRepouso <= 0) { alert(T.error); return; }
      var fcMax = 220 - idade;
      var reserva = fcMax - fcRepouso;
      var zonas = [
        [T.zonaAquecimento, 0.50, 0.60],
        [T.zonaQueimaGordura, 0.60, 0.70],
        [T.zonaAerobica, 0.70, 0.80],
        [T.zonaAnaerobica, 0.80, 0.90],
        [T.zonaMaxima, 0.90, 1.00],
      ];
      var rows = zonas.map(function (z) {
        var lo = Math.round(reserva * z[1] + fcRepouso);
        var hi = Math.round(reserva * z[2] + fcRepouso);
        return '<tr><td>' + z[0] + ' (' + Math.round(z[1] * 100) + '–' + Math.round(z[2] * 100) + '%)</td><td class="result-value" style="font-size:1rem">' + lo + ' – ' + hi + ' bpm</td></tr>';
      }).join('');
      var html = '<div class="result-value">' + T.fcMaxLabel + ': ' + Math.round(fcMax) + ' bpm</div>' +
        '<table class="result-table"><thead><tr><th>' + T.zonaHeader + '</th><th>' + T.faixaHeader + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE CONSUMO DE ÁGUA DIÁRIO
  var WATER_ACTIVITY_ADD = { sedentario: 0, moderado: 350, intenso: 700 };
  function initWaterIntakeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var peso = parseFloat(document.getElementById('peso').value);
      var nivelAtividade = document.getElementById('nivelAtividade').value;
      var clima = document.getElementById('clima').value;
      if (!peso || peso <= 0) { alert(T.error); return; }
      var baseMl = peso * 35;
      var comAtividade = baseMl + (WATER_ACTIVITY_ADD[nivelAtividade] || 0);
      var total = clima === 'quente' ? comAtividade * 1.15 : comAtividade;
      var litros = total / 1000;
      var copos = Math.round(total / 250);
      var html = '<div class="result-value">' + T.consumoLabel + ': ' + fmtNum(litros, lang, 1) + ' L/' + T.diaAbrev + '</div>' +
        '<div class="result-extra">' + T.coposLabel + ': <strong>' + copos + ' (' + T.coposNota + ')</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE 1RM (UMA REPETIÇÃO MÁXIMA)
  function initOneRepMaxCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var peso = parseFloat(document.getElementById('pesoLevantado').value);
      var reps = parseFloat(document.getElementById('repeticoes').value);
      if (!peso || peso <= 0 || !reps || reps < 1 || reps > 15) { alert(T.error); return; }
      var epley = peso * (1 + reps / 30);
      var brzycki = reps < 37 ? peso * 36 / (37 - reps) : NaN;
      var media = isNaN(brzycki) ? epley : (epley + brzycki) / 2;
      var percentuais = [100, 95, 90, 85, 80, 75, 70, 65, 60, 50];
      var rows = percentuais.map(function (p) {
        return '<tr><td>' + p + '%</td><td class="result-value" style="font-size:1rem">' + fmtNum(media * p / 100, lang, 1) + ' kg</td></tr>';
      }).join('');
      var html = '<div class="result-value">' + T.rmEstimadoLabel + ': ' + fmtNum(media, lang, 1) + ' kg</div>' +
        '<div class="result-extra">Epley: <strong>' + fmtNum(epley, lang, 1) + ' kg</strong> · Brzycki: <strong>' + (isNaN(brzycki) ? '–' : fmtNum(brzycki, lang, 1) + ' kg') + '</strong></div>' +
        '<table class="result-table"><thead><tr><th>' + T.percentualHeader2 + '</th><th>' + T.cargaHeader + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE SEMANAS DE GESTAÇÃO E DPP
  function initPregnancyCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var dum = parseISODate(document.getElementById('dataUltimaMenstruacao').value);
      var hoje = new Date();
      hoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      if (!dum) { alert(T.error); return; }
      if (dum > hoje) { alert(T.errorFutura); return; }
      var dpp = new Date(dum);
      dpp.setDate(dpp.getDate() + 280);
      var diasGestacao = diasEntreDatas(dum, hoje);
      if (diasGestacao > 315) { alert(T.errorMuitoAntiga); return; }
      var semanas = Math.floor(diasGestacao / 7);
      var dias = diasGestacao % 7;
      var trimestre = semanas < 13 ? 1 : (semanas < 27 ? 2 : 3);
      var diasAteParto = Math.max(0, diasEntreDatas(hoje, dpp));
      var dppFmt = dpp.toLocaleDateString(localeFor(lang), { day: '2-digit', month: 'long', year: 'numeric' });
      var html = '<div class="result-value">' + T.idadeGestacionalLabel + ': ' + semanas + T.semanasAbrev + ' ' + dias + T.diasAbrev + '</div>' +
        '<div class="result-extra">' + T.trimestreLabel + ': <strong>' + trimestre + 'º</strong></div>' +
        '<div class="result-extra">' + T.dppLabel + ': <strong>' + dppFmt + '</strong></div>' +
        '<div class="result-extra">' + T.diasRestantesLabel + ': <strong>' + diasAteParto + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR DE MEDIDAS CULINÁRIAS
  // Densidade em g/ml de cada ingrediente (aproximada, baseada em xícara padrão de 240ml)
  var COOKING_DENSITY = {
    agua: 1.00, leite: 1.03, 'farinha-trigo': 0.50, acucar: 0.83,
    manteiga: 0.946, oleo: 0.92, 'arroz-cru': 0.75, mel: 1.42,
  };
  var COOKING_VOLUME_ML = { xicara: 240, 'colher-sopa': 15, 'colher-cha': 5, ml: 1, litro: 1000 };
  function initCookingMeasureConverter(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var quantidade = parseFloat(document.getElementById('quantidade').value);
      var unidadeOrigem = document.getElementById('unidadeOrigem').value;
      var ingrediente = document.getElementById('ingrediente').value;
      if (!quantidade || quantidade <= 0) { alert(T.error); return; }
      var densidade = COOKING_DENSITY[ingrediente];
      var gramas;
      if (unidadeOrigem === 'g') {
        gramas = quantidade;
      } else if (unidadeOrigem === 'kg') {
        gramas = quantidade * 1000;
      } else {
        var ml = quantidade * COOKING_VOLUME_ML[unidadeOrigem];
        gramas = ml * densidade;
      }
      var mlTotal = gramas / densidade;
      var rows = [
        [T.units.xicara, mlTotal / 240],
        [T.units['colher-sopa'], mlTotal / 15],
        [T.units['colher-cha'], mlTotal / 5],
        [T.units.ml, mlTotal],
        [T.units.g, gramas],
      ];
      var html = '<table class="result-table"><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="result-value" style="font-size:1rem">' + fmtNum(r[1], lang, r[0] === T.units.g || r[0] === T.units.ml ? 0 : 2) + '</td></tr>'; }).join('') +
        '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE ESCALA DE RECEITA
  function parseFracaoQuantidade(str) {
    str = str.trim();
    var m = str.match(/^(\d+)\s+(\d+)\/(\d+)$/); // "1 1/2"
    if (m) return parseInt(m[1], 10) + parseInt(m[2], 10) / parseInt(m[3], 10);
    m = str.match(/^(\d+)\/(\d+)$/); // "1/2"
    if (m) return parseInt(m[1], 10) / parseInt(m[2], 10);
    m = str.match(/^(\d+(?:[.,]\d+)?)$/); // "1.5" ou "1,5"
    if (m) return parseFloat(m[1].replace(',', '.'));
    return null;
  }
  function initRecipeScalerCalculator(card, T) {
    on(card, 'calc', function () {
      var porcoesOriginais = parseFloat(document.getElementById('porcoesOriginais').value);
      var porcoesDesejadas = parseFloat(document.getElementById('porcoesDesejadas').value);
      var linhas = (document.getElementById('ingredientesReceita').value || '').split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l !== ''; });
      if (!porcoesOriginais || porcoesOriginais <= 0 || !porcoesDesejadas || porcoesDesejadas <= 0 || linhas.length === 0) { alert(T.error); return; }
      var fator = porcoesDesejadas / porcoesOriginais;
      var resultLines = linhas.map(function (linha) {
        var m = linha.match(/^(\d+(?:\s+\d+\/\d+|\/\d+|[.,]\d+)?)\s*(.*)$/);
        if (!m) return escHtml(linha);
        var qtd = parseFracaoQuantidade(m[1]);
        if (qtd === null) return escHtml(linha);
        var novaQtd = qtd * fator;
        var novaQtdStr = novaQtd % 1 === 0 ? String(novaQtd) : novaQtd.toFixed(2).replace(/\.?0+$/, '');
        return '<strong>' + novaQtdStr + '</strong> ' + escHtml(m[2]);
      });
      var html = '<div class="result-extra">' + T.fatorLabel + ': <strong>' + fator.toFixed(2) + 'x</strong></div>' +
        '<div class="result-value" style="text-align:left;font-size:1rem;line-height:1.9">' + resultLines.join('<br>') + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR DE TEMPERATURA DE FORNO
  var OVEN_GAS_MARKS = [
    { c: 110, f: 225, mark: '1/4' }, { c: 120, f: 250, mark: '1/2' }, { c: 140, f: 275, mark: '1' },
    { c: 150, f: 300, mark: '2' }, { c: 160, f: 325, mark: '3' }, { c: 180, f: 350, mark: '4' },
    { c: 190, f: 375, mark: '5' }, { c: 200, f: 400, mark: '6' }, { c: 220, f: 425, mark: '7' },
    { c: 230, f: 450, mark: '8' }, { c: 240, f: 475, mark: '9' },
  ];
  function initOvenTempConverter(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var valor = parseFloat(document.getElementById('valorForno').value);
      var unidade = document.getElementById('unidadeForno').value;
      if (isNaN(valor)) { alert(T.error); return; }
      var celsius = unidade === 'fahrenheit' ? (valor - 32) * 5 / 9 : valor;
      var fahrenheit = unidade === 'celsius' ? valor * 9 / 5 + 32 : valor;
      var closest = OVEN_GAS_MARKS.reduce(function (a, b) {
        return Math.abs(b.c - celsius) < Math.abs(a.c - celsius) ? b : a;
      });
      var descricao = celsius < 150 ? T.descBaixo : celsius < 180 ? T.descModeradoBaixo : celsius < 200 ? T.descModerado : celsius < 220 ? T.descModeradoAlto : celsius < 240 ? T.descAlto : T.descMuitoAlto;
      var html = '<table class="result-table"><tbody>' +
        '<tr><td>Celsius</td><td class="result-value" style="font-size:1rem">' + fmtNum(celsius, lang, 0) + ' °C</td></tr>' +
        '<tr><td>Fahrenheit</td><td class="result-value" style="font-size:1rem">' + fmtNum(fahrenheit, lang, 0) + ' °F</td></tr>' +
        '<tr><td>Gas Mark</td><td class="result-value" style="font-size:1rem">' + closest.mark + '</td></tr>' +
        '</tbody></table>' +
        '<div class="result-extra">' + T.descricaoLabel + ': <strong>' + descricao + '</strong></div>';
      showResult(card, html);
    });
  }


  // ---------------------------------------------------------- CALCULADORA DE MDC E MMC
  function gcd2(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm2(a, b) { return Math.abs(a * b) / gcd2(a, b); }
  function initGcdLcmCalculator(card, T) {
    on(card, 'calc', function () {
      var raw = (document.getElementById('numeros').value || '').split(/[,\s]+/).map(function (s) { return s.trim(); }).filter(function (s) { return s !== ''; });
      var nums = raw.map(function (s) { return parseInt(s, 10); });
      if (nums.length < 2 || nums.some(function (n) { return isNaN(n) || n <= 0; })) { alert(T.error); return; }
      var gcdResult = nums.reduce(function (a, b) { return gcd2(a, b); });
      var lcmResult = nums.reduce(function (a, b) { return lcm2(a, b); });
      var html = '<div class="result-value">' + T.mdcLabel + ': ' + gcdResult.toLocaleString() + '</div>' +
        '<div class="result-extra">' + T.mmcLabel + ': <strong>' + lcmResult.toLocaleString() + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE EQUAÇÃO DE 2º GRAU (BHASKARA)
  function initQuadraticEquationCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var a = parseFloat(document.getElementById('coefA').value);
      var b = parseFloat(document.getElementById('coefB').value);
      var c = parseFloat(document.getElementById('coefC').value);
      if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) { alert(T.error); return; }
      var delta = b * b - 4 * a * c;
      var html;
      if (delta > 0) {
        var x1 = (-b + Math.sqrt(delta)) / (2 * a);
        var x2 = (-b - Math.sqrt(delta)) / (2 * a);
        html = '<div class="result-extra">Δ = ' + fmtNum(delta, lang, 2) + '</div>' +
          '<div class="result-value">x₁ = ' + fmtNum(x1, lang, 4) + '</div>' +
          '<div class="result-value">x₂ = ' + fmtNum(x2, lang, 4) + '</div>';
      } else if (delta === 0) {
        var x = -b / (2 * a);
        html = '<div class="result-extra">Δ = 0</div>' +
          '<div class="result-value">x = ' + fmtNum(x, lang, 4) + ' (' + T.raizUnica + ')</div>';
      } else {
        var re = (-b / (2 * a));
        var im = Math.sqrt(-delta) / (2 * a);
        html = '<div class="result-extra">Δ = ' + fmtNum(delta, lang, 2) + ' (' + T.deltaNegativo + ')</div>' +
          '<div class="result-value">x₁ = ' + fmtNum(re, lang, 4) + ' + ' + fmtNum(im, lang, 4) + 'i</div>' +
          '<div class="result-value">x₂ = ' + fmtNum(re, lang, 4) + ' − ' + fmtNum(im, lang, 4) + 'i</div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE FATORIAL, COMBINAÇÃO E PERMUTAÇÃO
  function factorialOf(n) {
    var r = 1;
    for (var i = 2; i <= n; i++) r *= i;
    return r;
  }
  function initFactorialCombinatoricsCalculator(card, T) {
    var modoSel = document.getElementById('modo');
    function updateFields() {
      var rField = document.getElementById('r').closest('.field');
      rField.style.display = modoSel.value === 'fatorial' ? 'none' : '';
    }
    modoSel.addEventListener('change', updateFields);
    updateFields();
    on(card, 'calc', function () {
      var modo = modoSel.value;
      var n = parseInt(document.getElementById('n').value, 10);
      var r = parseInt(document.getElementById('r').value, 10);
      if (isNaN(n) || n < 0 || n > 170) { alert(T.error); return; }
      if (modo !== 'fatorial' && (isNaN(r) || r < 0 || r > n)) { alert(T.errorR); return; }
      var html;
      if (modo === 'fatorial') {
        html = '<div class="result-value">' + n + '! = ' + factorialOf(n).toLocaleString() + '</div>';
      } else if (modo === 'combinacao') {
        var comb = factorialOf(n) / (factorialOf(r) * factorialOf(n - r));
        html = '<div class="result-value">C(' + n + ',' + r + ') = ' + comb.toLocaleString() + '</div>' +
          '<div class="result-extra">' + T.combinacaoNota + '</div>';
      } else {
        var perm = factorialOf(n) / factorialOf(n - r);
        html = '<div class="result-value">P(' + n + ',' + r + ') = ' + perm.toLocaleString() + '</div>' +
          '<div class="result-extra">' + T.permutacaoNota + '</div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- VERIFICADOR DE NÚMERO PRIMO
  function initPrimeNumberChecker(card, T) {
    on(card, 'calc', function () {
      var n = parseInt(document.getElementById('numeroPrimo').value, 10);
      if (isNaN(n) || n < 1) { alert(T.error); return; }
      var isPrime = n > 1;
      var factors = [];
      var m = n;
      for (var i = 2; i * i <= m; i++) {
        while (m % i === 0) { factors.push(i); m = m / i; isPrime = false; }
      }
      if (m > 1) factors.push(m);
      if (n <= 1) isPrime = false;
      var html = '<div class="status-box ' + (isPrime ? 'ok' : 'err') + '" style="display:inline-block;padding:6px 14px;border-radius:20px;font-weight:700">' +
        (isPrime ? T.ehPrimo : T.naoEhPrimo) + '</div>';
      if (!isPrime && n > 1 && factors.length > 1) {
        html += '<div class="result-extra">' + T.fatoracaoLabel + ': <strong>' + factors.join(' × ') + '</strong></div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE MÉDIA (ARITMÉTICA, PONDERADA, GEOMÉTRICA, HARMÔNICA)
  function initAverageCalculator(card, T) {
    var modoSel = document.getElementById('modoMedia');
    function updateFields() {
      var hint = card.querySelector('[data-role="mediaHint"]');
      if (hint) hint.textContent = modoSel.value === 'ponderada' ? T.hintPonderada : T.hintSimples;
    }
    modoSel.addEventListener('change', updateFields);
    updateFields();
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var modo = modoSel.value;
      var raw = (document.getElementById('valoresMedia').value || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s !== ''; });
      if (raw.length === 0) { alert(T.error); return; }
      var media;
      if (modo === 'ponderada') {
        var pares = raw.map(function (s) {
          var parts = s.split(':');
          return { v: parseFloat(parts[0]), p: parseFloat(parts[1]) };
        });
        if (pares.some(function (x) { return isNaN(x.v) || isNaN(x.p) || x.p < 0; })) { alert(T.errorPonderada); return; }
        var somaPesos = pares.reduce(function (s, x) { return s + x.p; }, 0);
        if (somaPesos === 0) { alert(T.errorPonderada); return; }
        media = pares.reduce(function (s, x) { return s + x.v * x.p; }, 0) / somaPesos;
      } else {
        var nums = raw.map(function (s) { return parseFloat(s); });
        if (nums.some(function (n) { return isNaN(n); })) { alert(T.error); return; }
        if (modo === 'aritmetica') {
          media = nums.reduce(function (s, n) { return s + n; }, 0) / nums.length;
        } else if (modo === 'geometrica') {
          if (nums.some(function (n) { return n <= 0; })) { alert(T.errorPositivos); return; }
          var produto = nums.reduce(function (p, n) { return p * n; }, 1);
          media = Math.pow(produto, 1 / nums.length);
        } else if (modo === 'harmonica') {
          if (nums.some(function (n) { return n <= 0; })) { alert(T.errorPositivos); return; }
          var somaInversos = nums.reduce(function (s, n) { return s + 1 / n; }, 0);
          media = nums.length / somaInversos;
        }
      }
      var html = '<div class="result-value">' + T.mediaResultLabel + ': ' + fmtNum(media, lang, 4) + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE VARIAÇÃO PERCENTUAL
  function initPercentageChangeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var inicial = parseFloat(document.getElementById('valorInicial').value);
      var final = parseFloat(document.getElementById('valorFinal').value);
      if (isNaN(inicial) || inicial === 0 || isNaN(final)) { alert(T.error); return; }
      var variacao = (final - inicial) / Math.abs(inicial) * 100;
      var subiu = variacao >= 0;
      var html = '<div class="status-box ' + (subiu ? 'ok' : 'err') + '" style="display:inline-block;padding:6px 14px;border-radius:20px;font-weight:700">' +
        (subiu ? '+' : '') + fmtNum(variacao, lang, 2) + '%</div>' +
        '<div class="result-extra">' + (subiu ? T.aumentoLabel : T.reducaoLabel) + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- GERADOR DE PALETA DE CORES
  function hexToHslArr(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(hex.substr(0, 2), 16) / 255;
    var g = parseInt(hex.substr(2, 2), 16) / 255;
    var b = parseInt(hex.substr(4, 2), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s * 100, l * 100];
  }
  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r, g, b;
    if (h < 60) { r = c; g = x; b = 0; } else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; } else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
    var toHex = function (v) { return Math.round((v + m) * 255).toString(16).padStart(2, '0').toUpperCase(); };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }
  function isValidHex(hex) { return /^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(hex); }
  function initColorPaletteGenerator(card, T) {
    on(card, 'calc', function () {
      var corBase = (document.getElementById('corBase').value || '').trim();
      var esquema = document.getElementById('esquema').value;
      if (!isValidHex(corBase)) { alert(T.error); return; }
      var hsl = hexToHslArr(corBase);
      var h = hsl[0], s = hsl[1], l = hsl[2];
      var cores = [];
      if (esquema === 'complementar') {
        cores = [h, h + 180];
      } else if (esquema === 'analoga') {
        cores = [h - 30, h, h + 30];
      } else if (esquema === 'triade') {
        cores = [h, h + 120, h + 240];
      } else if (esquema === 'tetradica') {
        cores = [h, h + 90, h + 180, h + 270];
      } else if (esquema === 'monocromatica') {
        var swatches = [20, 35, 50, 65, 80].map(function (lVal) { return hslToHex(h, s, lVal); });
        var html2 = '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
          swatches.map(function (hex) { return '<div style="text-align:center"><div style="width:64px;height:64px;border-radius:8px;background:' + hex + ';border:1px solid rgba(0,0,0,.1)"></div><code style="font-size:.8em">' + hex + '</code></div>'; }).join('') +
          '</div>';
        showResult(card, html2);
        return;
      }
      var swatchesHex = cores.map(function (hue) { return hslToHex(hue, s, l); });
      var html = '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
        swatchesHex.map(function (hex) { return '<div style="text-align:center"><div style="width:64px;height:64px;border-radius:8px;background:' + hex + ';border:1px solid rgba(0,0,0,.1)"></div><code style="font-size:.8em">' + hex + '</code></div>'; }).join('') +
        '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- GERADOR DE GRADIENTE CSS
  function initCssGradientGenerator(card, T) {
    on(card, 'calc', function () {
      var cor1 = document.getElementById('corGrad1').value || '#2c65f2';
      var cor2 = document.getElementById('corGrad2').value || '#ff7a3d';
      var tipo = document.getElementById('tipoGradiente').value;
      var angulo = parseFloat(document.getElementById('anguloGradiente').value) || 0;
      var css = tipo === 'radial'
        ? 'radial-gradient(circle, ' + cor1 + ', ' + cor2 + ')'
        : 'linear-gradient(' + angulo + 'deg, ' + cor1 + ', ' + cor2 + ')';
      var html = '<div style="width:100%;height:120px;border-radius:8px;background:' + css + ';border:1px solid rgba(0,0,0,.1)"></div>' +
        '<div class="result-value" style="text-align:left;margin-top:10px;font-size:.95rem;word-break:break-all">background: ' + css + ';</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- GERADOR DE BOX SHADOW CSS
  function initBoxShadowGenerator(card, T) {
    on(card, 'calc', function () {
      var offsetX = document.getElementById('boxShadowX').value || '0';
      var offsetY = document.getElementById('boxShadowY').value || '4';
      var blur = document.getElementById('boxShadowBlur').value || '12';
      var spread = document.getElementById('boxShadowSpread').value || '0';
      var cor = document.getElementById('boxShadowCor').value || 'rgba(0,0,0,0.25)';
      var inset = document.getElementById('boxShadowInset').checked;
      var css = (inset ? 'inset ' : '') + offsetX + 'px ' + offsetY + 'px ' + blur + 'px ' + spread + 'px ' + cor;
      var html = '<div style="width:100%;padding:30px;display:flex;justify-content:center;background:var(--bg,#f6f7f9);border-radius:8px">' +
        '<div style="width:100px;height:100px;background:#fff;border-radius:8px;box-shadow:' + css + '"></div></div>' +
        '<div class="result-value" style="text-align:left;margin-top:10px;font-size:.95rem;word-break:break-all">box-shadow: ' + css + ';</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- GERADOR DE BORDER RADIUS CSS
  function initBorderRadiusGenerator(card, T) {
    on(card, 'calc', function () {
      var tl = document.getElementById('radiusTL').value || '0';
      var tr = document.getElementById('radiusTR').value || '0';
      var br = document.getElementById('radiusBR').value || '0';
      var bl = document.getElementById('radiusBL').value || '0';
      var css = tl + 'px ' + tr + 'px ' + br + 'px ' + bl + 'px';
      var html = '<div style="width:100%;padding:30px;display:flex;justify-content:center;background:var(--bg,#f6f7f9);border-radius:8px">' +
        '<div style="width:120px;height:120px;background:var(--primary,#2c65f2);border-radius:' + css + '"></div></div>' +
        '<div class="result-value" style="text-align:left;margin-top:10px;font-size:.95rem;word-break:break-all">border-radius: ' + css + ';</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- GERADOR DE CORES ALEATÓRIAS
  function initRandomColorGenerator(card, T) {
    on(card, 'generate', function () {
      var qtd = parseInt(document.getElementById('quantidadeCores').value, 10) || 1;
      qtd = Math.max(1, Math.min(10, qtd));
      var formato = document.getElementById('formatoCor').value;
      var swatches = [];
      for (var i = 0; i < qtd; i++) {
        var r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * 256), b = Math.floor(Math.random() * 256);
        var hex = '#' + [r, g, b].map(function (v) { return v.toString(16).padStart(2, '0').toUpperCase(); }).join('');
        var label;
        if (formato === 'rgb') label = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        else if (formato === 'hsl') {
          var hsl = hexToHslArr(hex);
          label = 'hsl(' + Math.round(hsl[0]) + ', ' + Math.round(hsl[1]) + '%, ' + Math.round(hsl[2]) + '%)';
        } else label = hex;
        swatches.push('<div style="text-align:center"><div style="width:64px;height:64px;border-radius:8px;background:' + hex + ';border:1px solid rgba(0,0,0,.1)"></div><code style="font-size:.75em">' + label + '</code></div>');
      }
      showResult(card, '<div style="display:flex;flex-wrap:wrap;gap:8px">' + swatches.join('') + '</div>');
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE DIA DA SEMANA
  var WEEKDAY_NAMES = {
    pt: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  };
  function initDayOfWeekCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var data = parseISODate(document.getElementById('dataConsulta').value);
      if (!data) { alert(T.error); return; }
      var dow = data.getDay();
      var nomes = WEEKDAY_NAMES[lang] || WEEKDAY_NAMES.pt;
      var dataFmt = data.toLocaleDateString(localeFor(lang), { day: '2-digit', month: 'long', year: 'numeric' });
      var html = '<div class="result-value">' + nomes[dow] + '</div>' +
        '<div class="result-extra">' + dataFmt + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONTADOR REGRESSIVO PARA DATA
  function initCountdownCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var alvo = parseISODate(document.getElementById('dataAlvo').value);
      if (!alvo) { alert(T.error); return; }
      var hoje = new Date();
      hoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      var dias = diasEntreDatas(hoje, alvo);
      var passou = dias < 0;
      var diasAbs = Math.abs(dias);
      var semanas = Math.floor(diasAbs / 7);
      var html = '<div class="result-value">' + (passou ? T.jaPassou : T.faltam) + ' ' + diasAbs.toLocaleString(localeFor(lang)) + ' ' + T.diasLabel + '</div>' +
        '<div class="result-extra">' + T.equivaleLabel + ': <strong>' + semanas.toLocaleString(localeFor(lang)) + ' ' + T.semanasLabel + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE DIA DO ANO E SEMANA DO ANO (ISO)
  function isoWeekNumber(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }
  function initDayOfYearWeekCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var data = parseISODate(document.getElementById('dataConsultaAno').value);
      if (!data) { alert(T.error); return; }
      var inicioAno = new Date(data.getFullYear(), 0, 1);
      var diaDoAno = diasEntreDatas(inicioAno, data) + 1;
      var isBissexto = (data.getFullYear() % 4 === 0 && data.getFullYear() % 100 !== 0) || data.getFullYear() % 400 === 0;
      var totalDiasAno = isBissexto ? 366 : 365;
      var semanaISO = isoWeekNumber(data);
      var diasRestantes = totalDiasAno - diaDoAno;
      var html = '<div class="result-value">' + T.diaDoAnoLabel + ': ' + diaDoAno + ' / ' + totalDiasAno + '</div>' +
        '<div class="result-extra">' + T.semanaIsoLabel + ': <strong>' + semanaISO + '</strong></div>' +
        '<div class="result-extra">' + T.diasRestantesAnoLabel + ': <strong>' + diasRestantes.toLocaleString(localeFor(lang)) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE SIGNO DO ZODÍACO
  var ZODIAC_SIGNS = [
    { signo: 'capricornio', ini: [12, 22], fim: [1, 19] },
    { signo: 'aquario', ini: [1, 20], fim: [2, 18] },
    { signo: 'peixes', ini: [2, 19], fim: [3, 20] },
    { signo: 'aries', ini: [3, 21], fim: [4, 19] },
    { signo: 'touro', ini: [4, 20], fim: [5, 20] },
    { signo: 'gemeos', ini: [5, 21], fim: [6, 20] },
    { signo: 'cancer', ini: [6, 21], fim: [7, 22] },
    { signo: 'leao', ini: [7, 23], fim: [8, 22] },
    { signo: 'virgem', ini: [8, 23], fim: [9, 22] },
    { signo: 'libra', ini: [9, 23], fim: [10, 22] },
    { signo: 'escorpiao', ini: [10, 23], fim: [11, 21] },
    { signo: 'sagitario', ini: [11, 22], fim: [12, 21] },
  ];
  function initZodiacSignCalculator(card, T) {
    on(card, 'calc', function () {
      var data = parseISODate(document.getElementById('dataNascimentoZodiaco').value);
      if (!data) { alert(T.error); return; }
      var mes = data.getMonth() + 1, dia = data.getDate();
      var encontrado = ZODIAC_SIGNS.find(function (z) {
        if (z.ini[0] <= z.fim[0]) {
          return (mes === z.ini[0] && dia >= z.ini[1]) || (mes === z.fim[0] && dia <= z.fim[1]) || (mes > z.ini[0] && mes < z.fim[0]);
        } else {
          return (mes === z.ini[0] && dia >= z.ini[1]) || (mes === z.fim[0] && dia <= z.fim[1]);
        }
      });
      if (!encontrado) { alert(T.error); return; }
      var nome = T.signos[encontrado.signo];
      var elemento = T.elementos[encontrado.signo];
      var html = '<div class="result-value">' + nome + '</div>' +
        '<div class="result-extra">' + T.elementoLabel + ': <strong>' + elemento + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR DE DATA PARA ALGARISMOS ROMANOS
  function toRoman(num) {
    if (num <= 0) return '';
    var vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    var syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    var r = '';
    for (var i = 0; i < vals.length; i++) {
      while (num >= vals[i]) { r += syms[i]; num -= vals[i]; }
    }
    return r;
  }
  function initDateToRomanConverter(card, T) {
    on(card, 'calc', function () {
      var data = parseISODate(document.getElementById('dataRomanos').value);
      if (!data) { alert(T.error); return; }
      var dia = data.getDate(), mes = data.getMonth() + 1, ano = data.getFullYear();
      var romano = toRoman(dia) + '.' + toRoman(mes) + '.' + toRoman(ano);
      var html = '<div class="result-value" style="font-size:1.6rem;letter-spacing:1px">' + romano + '</div>' +
        '<div class="result-extra">' + dia + '/' + mes + '/' + ano + '</div>';
      showResult(card, html);
    });
  }


  // ============================================================
  // FINANÇAS PESSOAIS
  // ============================================================

  // ---------------------------------------------------------- BUDGET 50/30/20
  function initBudget503020Calculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var renda = parseFloat(document.getElementById('rendaMensal').value);
      if (!renda || renda <= 0) { alert(T.error); return; }
      var necessidades = round2(renda * 0.5);
      var desejos = round2(renda * 0.3);
      var poupanca = round2(renda * 0.2);
      var html = '<table class="result-table"><tbody>' +
        '<tr><td>' + T.needsLabel + ' (50%)</td><td>' + fmtNum(necessidades, lang) + '</td></tr>' +
        '<tr><td>' + T.wantsLabel + ' (30%)</td><td>' + fmtNum(desejos, lang) + '</td></tr>' +
        '<tr><td>' + T.savingsLabel + ' (20%)</td><td>' + fmtNum(poupanca, lang) + '</td></tr>' +
        '</tbody></table>' +
        '<div class="result-value">' + T.totalLabel + ': ' + fmtNum(renda, lang) + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- EMERGENCY FUND
  function initEmergencyFundCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var despesas = parseFloat(document.getElementById('despesasMensais').value);
      var meses = parseFloat(document.getElementById('mesesCobertura').value);
      var atual = parseFloat(document.getElementById('poupancaAtual').value);
      var aporte = parseFloat(document.getElementById('aporteMensal').value);
      if (isNaN(atual)) atual = 0;
      if (isNaN(aporte)) aporte = 0;
      if (!despesas || despesas <= 0 || !meses || meses <= 0) { alert(T.error); return; }
      var meta = round2(despesas * meses);
      var faltante = round2(meta - atual);
      var html = '<div class="result-value">' + T.targetLabel + ': ' + fmtNum(meta, lang) + '</div>';
      if (faltante <= 0) {
        html += '<div class="result-extra">' + T.reachedLabel + '</div>';
      } else {
        html += '<div class="result-extra">' + T.remainingLabel + ': <strong>' + fmtNum(faltante, lang) + '</strong></div>';
        if (aporte > 0) {
          var mesesParaAtingir = Math.ceil(faltante / aporte);
          html += '<div class="result-extra">' + T.monthsLabel + ': <strong>' + mesesParaAtingir + '</strong></div>';
        }
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- FINANCIAL INDEPENDENCE
  function initFinancialIndependenceCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var atual = parseFloat(document.getElementById('poupancaAtualFi').value);
      var aporte = parseFloat(document.getElementById('aporteMensalFi').value);
      var taxaAnual = parseFloat(document.getElementById('taxaAnualFi').value);
      var anos = parseFloat(document.getElementById('anosFi').value);
      var metaStr = document.getElementById('metaValorFi').value;
      var meta = metaStr !== '' ? parseFloat(metaStr) : NaN;
      if (isNaN(atual)) atual = 0;
      if (isNaN(aporte)) aporte = 0;
      if (isNaN(taxaAnual) || taxaAnual < 0 || !anos || anos <= 0) { alert(T.error); return; }
      var i = taxaAnual / 100 / 12;
      var n = anos * 12;
      var fatorCrescimento = Math.pow(1 + i, n);
      var vf;
      if (i === 0) {
        vf = atual + aporte * n;
      } else {
        vf = atual * fatorCrescimento + aporte * ((fatorCrescimento - 1) / i);
      }
      vf = round2(vf);
      var html = '<div class="result-value">' + T.futureValueLabel + ': ' + fmtNum(vf, lang) + '</div>' +
        '<div class="result-extra">' + T.totalContributedLabel + ': <strong>' + fmtNum(round2(atual + aporte * n), lang) + '</strong></div>';
      if (!isNaN(meta) && meta > 0) {
        var vfSemAporte = atual * fatorCrescimento;
        if (vfSemAporte >= meta) {
          html += '<div class="result-extra">' + T.goalAlreadyMetLabel + '</div>';
        } else {
          var restante = meta - vfSemAporte;
          var aporteNecessario = i === 0 ? restante / n : (restante * i) / (fatorCrescimento - 1);
          html += '<div class="result-extra">' + T.requiredContributionLabel + ': <strong>' + fmtNum(round2(aporteNecessario), lang) + '</strong></div>';
        }
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- SAVINGS GOAL
  function initSavingsGoalCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var meta = parseFloat(document.getElementById('valorMetaSg').value);
      var dataMeta = parseISODate(document.getElementById('dataMetaSg').value);
      var atual = parseFloat(document.getElementById('poupancaAtualSg').value);
      var taxaAnual = parseFloat(document.getElementById('taxaAnualSg').value);
      if (isNaN(atual)) atual = 0;
      if (isNaN(taxaAnual) || taxaAnual < 0) taxaAnual = 0;
      if (!meta || meta <= 0 || !dataMeta) { alert(T.error); return; }
      var hoje = new Date();
      hoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      var diffDias = diasEntreDatas(hoje, dataMeta);
      var n = Math.round(diffDias / 30.4375);
      if (n <= 0) { alert(T.dateError); return; }
      var i = taxaAnual / 100 / 12;
      var fatorCrescimento = Math.pow(1 + i, n);
      var vfAtual = atual * fatorCrescimento;
      if (vfAtual >= meta) {
        showResult(card, '<div class="result-extra">' + T.goalAlreadyMetLabel + '</div>');
        return;
      }
      var restante = meta - vfAtual;
      var depositoNecessario = i === 0 ? restante / n : (restante * i) / (fatorCrescimento - 1);
      depositoNecessario = round2(depositoNecessario);
      var html = '<div class="result-value">' + T.requiredDepositLabel + ': ' + fmtNum(depositoNecessario, lang) + '</div>' +
        '<div class="result-extra">' + T.monthsToGoalLabel + ': <strong>' + n + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- DEBT PAYOFF (snowball vs avalanche)
  function parseDebtLines(text) {
    var lines = String(text || '').split('\n');
    var debts = [];
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i].trim();
      if (!l) continue;
      var parts = l.split(':');
      if (parts.length < 4) continue;
      var balance = parseFloat(parts[1]);
      var rate = parseFloat(parts[2]);
      var minPayment = parseFloat(parts[3]);
      if (isNaN(balance) || isNaN(rate) || isNaN(minPayment) || balance <= 0) continue;
      debts.push({ name: parts[0].trim() || ('#' + (i + 1)), balance: balance, rate: rate, minPayment: minPayment });
    }
    return debts;
  }
  function simulateDebtPayoff(debts, extraMonthly, order) {
    var d = debts.map(function (x) { return { name: x.name, balance: x.balance, rate: x.rate, minPayment: x.minPayment }; });
    d.sort(function (a, b) {
      if (order === 'snowball') return a.balance - b.balance;
      return b.rate - a.rate;
    });
    var totalInterest = 0;
    var months = 0;
    var maxMonths = 1200;
    while (d.some(function (x) { return x.balance > 0.005; }) && months < maxMonths) {
      months++;
      var freedUp = 0;
      // charge interest and take minimum payments
      for (var i = 0; i < d.length; i++) {
        if (d[i].balance <= 0.005) { continue; }
        var interest = d[i].balance * (d[i].rate / 100 / 12);
        totalInterest += interest;
        d[i].balance += interest;
        var pay = Math.min(d[i].minPayment, d[i].balance);
        d[i].balance -= pay;
      }
      // find first still-unpaid debt in priority order and dump extra + freed-up minimums
      var extraPool = extraMonthly;
      for (var j = 0; j < d.length; j++) {
        if (d[j].balance <= 0.005) { freedUp += 0; continue; }
      }
      for (var k = 0; k < d.length; k++) {
        if (d[k].balance > 0.005) {
          var pay2 = Math.min(extraPool, d[k].balance);
          d[k].balance -= pay2;
          extraPool -= pay2;
          if (extraPool <= 0) break;
        }
      }
    }
    return { months: months, totalInterest: round2(totalInterest), reached: months < maxMonths };
  }
  function initDebtPayoffCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var debts = parseDebtLines(document.getElementById('dividasLista').value);
      var extra = parseFloat(document.getElementById('extraMensalDivida').value);
      if (isNaN(extra) || extra < 0) extra = 0;
      if (debts.length === 0) { alert(T.error); return; }
      var snowball = simulateDebtPayoff(debts, extra, 'snowball');
      var avalanche = simulateDebtPayoff(debts, extra, 'avalanche');
      var html = '<table class="result-table"><thead><tr><th></th><th>' + T.monthsLabel + '</th><th>' + T.totalInterestLabel + '</th></tr></thead><tbody>' +
        '<tr><td>' + T.snowballLabel + '</td><td>' + snowball.months + '</td><td>' + fmtNum(snowball.totalInterest, lang) + '</td></tr>' +
        '<tr><td>' + T.avalancheLabel + '</td><td>' + avalanche.months + '</td><td>' + fmtNum(avalanche.totalInterest, lang) + '</td></tr>' +
        '</tbody></table>';
      var cheaper = avalanche.totalInterest <= snowball.totalInterest ? T.avalancheLabel : T.snowballLabel;
      html += '<div class="result-extra">' + T.cheaperLabel + ': <strong>' + cheaper + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- MARKUP vs MARGIN
  function initMarkupMarginCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var custo = parseFloat(document.getElementById('custoMm').value);
      var modo = document.getElementById('modoMm').value;
      var percentual = parseFloat(document.getElementById('percentualMm').value);
      if (!custo || custo <= 0 || isNaN(percentual)) { alert(T.error); return; }
      var preco, lucro, markup, margem;
      if (modo === 'markup') {
        preco = custo * (1 + percentual / 100);
        lucro = preco - custo;
        markup = percentual;
        margem = (lucro / preco) * 100;
      } else {
        if (percentual >= 100) { alert(T.marginError); return; }
        preco = custo / (1 - percentual / 100);
        lucro = preco - custo;
        margem = percentual;
        markup = (lucro / custo) * 100;
      }
      preco = round2(preco); lucro = round2(lucro);
      var html = '<div class="result-value">' + T.salePriceLabel + ': ' + fmtNum(preco, lang) + '</div>' +
        '<div class="result-extra">' + T.profitLabel + ': <strong>' + fmtNum(lucro, lang) + '</strong></div>' +
        '<div class="result-extra">' + T.markupLabel + ': <strong>' + markup.toFixed(2) + '%</strong></div>' +
        '<div class="result-extra">' + T.marginLabel + ': <strong>' + margem.toFixed(2) + '%</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- FREELANCER RATE
  function initFreelancerRateCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var rendaDesejada = parseFloat(document.getElementById('rendaDesejadaFr').value);
      var custos = parseFloat(document.getElementById('custosMensaisFr').value);
      var horas = parseFloat(document.getElementById('horasSemanaisFr').value);
      var semanasFerias = parseFloat(document.getElementById('semanasFeriasFr').value);
      if (isNaN(custos)) custos = 0;
      if (isNaN(semanasFerias)) semanasFerias = 0;
      if (!rendaDesejada || rendaDesejada <= 0 || !horas || horas <= 0 || semanasFerias < 0 || semanasFerias >= 52) { alert(T.error); return; }
      var semanasTrabalhadas = 52 - semanasFerias;
      var necessidadeAnual = (rendaDesejada + custos) * 12;
      var horasFaturaveisAno = horas * semanasTrabalhadas;
      var valorHora = necessidadeAnual / horasFaturaveisAno;
      valorHora = round2(valorHora);
      var html = '<div class="result-value">' + T.hourlyRateLabel + ': ' + fmtNum(valorHora, lang) + '</div>' +
        '<div class="result-extra">' + T.annualNeedLabel + ': <strong>' + fmtNum(round2(necessidadeAnual), lang) + '</strong></div>' +
        '<div class="result-extra">' + T.billableHoursLabel + ': <strong>' + Math.round(horasFaturaveisAno) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- BREAK-EVEN
  function initBreakevenCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var fixos = parseFloat(document.getElementById('custosFixosBe').value);
      var varUnit = parseFloat(document.getElementById('custoVariavelBe').value);
      var preco = parseFloat(document.getElementById('precoVendaBe').value);
      if (!fixos || fixos <= 0 || isNaN(varUnit) || varUnit < 0 || !preco || preco <= 0) { alert(T.error); return; }
      var margemContribuicao = preco - varUnit;
      if (margemContribuicao <= 0) { alert(T.priceError); return; }
      var qty = fixos / margemContribuicao;
      var receita = qty * preco;
      var html = '<div class="result-value">' + T.breakevenQtyLabel + ': ' + Math.ceil(qty).toLocaleString(localeFor(lang)) + '</div>' +
        '<div class="result-extra">' + T.breakevenRevenueLabel + ': <strong>' + fmtNum(round2(receita), lang) + '</strong></div>' +
        '<div class="result-extra">' + T.contributionMarginLabel + ': <strong>' + fmtNum(round2(margemContribuicao), lang) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ============================================================
  // TEXTO E PRODUTIVIDADE
  // ============================================================

  // ---------------------------------------------------------- TEXT CASE CONVERTER
  function toTitleCase(s) {
    return s.replace(/\w\S*/g, function (w) { return w.charAt(0).toUpperCase() + w.substr(1).toLowerCase(); });
  }
  function toSentenceCase(s) {
    var lower = s.toLowerCase();
    return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, function (c) { return c.toUpperCase(); });
  }
  function toToggleCase(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      out += ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase();
    }
    return out;
  }
  function initTextCaseConverter(card, T) {
    on(card, 'calc', function () {
      var texto = document.getElementById('textoCase').value;
      var modo = document.getElementById('modoCase').value;
      if (!texto) { alert(T.error); return; }
      var resultado;
      switch (modo) {
        case 'upper': resultado = texto.toUpperCase(); break;
        case 'lower': resultado = texto.toLowerCase(); break;
        case 'title': resultado = toTitleCase(texto); break;
        case 'sentence': resultado = toSentenceCase(texto); break;
        case 'toggle': resultado = toToggleCase(texto); break;
        default: resultado = texto;
      }
      var html = '<textarea class="result-textarea" readonly>' + escHtml(resultado) + '</textarea>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>';
      showResult(card, html);
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(resultado, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- ACCENT REMOVER
  function removeAccents(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function initAccentRemover(card, T) {
    on(card, 'calc', function () {
      var texto = document.getElementById('textoAccent').value;
      if (!texto) { alert(T.error); return; }
      var resultado = removeAccents(texto);
      var html = '<textarea class="result-textarea" readonly>' + escHtml(resultado) + '</textarea>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>';
      showResult(card, html);
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(resultado, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- READING TIME
  function initReadingTimeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var texto = document.getElementById('textoReading').value;
      var wpmStr = document.getElementById('palavrasPorMinuto').value;
      var wpm = wpmStr !== '' ? parseFloat(wpmStr) : 200;
      if (!wpm || wpm <= 0) wpm = 200;
      var trimmed = texto.trim();
      var words = trimmed ? trimmed.split(/\s+/).length : 0;
      if (words === 0) { alert(T.error); return; }
      var minutos = words / wpm;
      var minutosArred = Math.max(1, Math.ceil(minutos));
      var html = '<div class="result-value">' + T.readingTimeLabel + ': ' + minutosArred + ' ' + T.minutesLabel + '</div>' +
        '<div class="result-extra">' + T.wordCountLabel + ': <strong>' + words.toLocaleString(localeFor(lang)) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- TEXT CLEANER
  function initTextCleaner(card, T) {
    on(card, 'calc', function () {
      var texto = document.getElementById('textoCleaner').value;
      var trim = document.getElementById('trimLinhas').checked;
      var colapsarVazias = document.getElementById('colapsarLinhasVazias').checked;
      var colapsarEspacos = document.getElementById('colapsarEspacos').checked;
      if (!texto) { alert(T.error); return; }
      var linhas = texto.split('\n');
      if (trim) linhas = linhas.map(function (l) { return l.trim(); });
      if (colapsarEspacos) linhas = linhas.map(function (l) { return l.replace(/[ \t]+/g, ' '); });
      var resultado = linhas.join('\n');
      if (colapsarVazias) resultado = resultado.replace(/\n{3,}/g, '\n\n');
      var html = '<textarea class="result-textarea" readonly>' + escHtml(resultado) + '</textarea>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>';
      showResult(card, html);
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(resultado, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- EMAIL/URL EXTRACTOR
  function initEmailUrlExtractor(card, T) {
    on(card, 'calc', function () {
      var texto = document.getElementById('textoExtract').value;
      if (!texto) { alert(T.error); return; }
      var emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      var urlRe = /\bhttps?:\/\/[^\s<>"')\]]+/g;
      var emails = texto.match(emailRe) || [];
      var urls = texto.match(urlRe) || [];
      function dedupe(arr) {
        var seen = {}; var out = [];
        for (var i = 0; i < arr.length; i++) {
          if (!seen[arr[i]]) { seen[arr[i]] = true; out.push(arr[i]); }
        }
        return out;
      }
      emails = dedupe(emails);
      urls = dedupe(urls);
      var emailsText = emails.join('\n');
      var urlsText = urls.join('\n');
      var html = '<div class="result-extra">' + T.emailsFoundLabel + ' (' + emails.length + ')</div>' +
        '<textarea class="result-textarea" readonly>' + escHtml(emailsText) + '</textarea>' +
        '<button type="button" class="copy-btn" data-copy="emails">' + T.copy + '</button>' +
        '<div class="result-extra">' + T.urlsFoundLabel + ' (' + urls.length + ')</div>' +
        '<textarea class="result-textarea" readonly>' + escHtml(urlsText) + '</textarea>' +
        '<button type="button" class="copy-btn" data-copy="urls">' + T.copy + '</button>';
      showResult(card, html);
      var copyEmails = card.querySelector('[data-copy="emails"]');
      var copyUrls = card.querySelector('[data-copy="urls"]');
      if (copyEmails) copyEmails.addEventListener('click', function () { copyText(emailsText, T, copyEmails); });
      if (copyUrls) copyUrls.addEventListener('click', function () { copyText(urlsText, T, copyUrls); });
    });
  }

  // ---------------------------------------------------------- LIST PICKER
  function initListPicker(card, T) {
    on(card, 'calc', function () {
      var lista = document.getElementById('listaPicker').value;
      var quantidade = parseInt(document.getElementById('quantidadePicker').value, 10);
      var semRepeticao = document.getElementById('semRepeticaoPicker').checked;
      var itens = lista.split('\n').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
      if (itens.length === 0 || !quantidade || quantidade <= 0) { alert(T.error); return; }
      if (semRepeticao && quantidade > itens.length) { alert(T.tooManyError); return; }
      var escolhidos = [];
      if (semRepeticao) {
        var pool = itens.slice();
        for (var i = 0; i < quantidade; i++) {
          var idx = Math.floor(Math.random() * pool.length);
          escolhidos.push(pool.splice(idx, 1)[0]);
        }
      } else {
        for (var j = 0; j < quantidade; j++) {
          escolhidos.push(itens[Math.floor(Math.random() * itens.length)]);
        }
      }
      var html = '<ol class="result-list">' + escolhidos.map(function (x) { return '<li>' + escHtml(x) + '</li>'; }).join('') + '</ol>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- MARKDOWN TO HTML
  function simpleMarkdownToHtml(md) {
    var lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
    var html = '';
    var inList = null; // 'ul' or 'ol'
    var inCode = false;
    var paragraph = [];
    function inlineFormat(s) {
      s = escHtml(s);
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
      s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      s = s.replace(/_([^_]+)_/g, '<em>$1</em>');
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      return s;
    }
    function flushParagraph() {
      if (paragraph.length) {
        html += '<p>' + inlineFormat(paragraph.join(' ')) + '</p>\n';
        paragraph = [];
      }
    }
    function closeList() {
      if (inList) { html += '</' + inList + '>\n'; inList = null; }
    }
    for (var i = 0; i < lines.length; i++) {
      var raw = lines[i];
      var line = raw;
      if (/^```/.test(line)) {
        flushParagraph(); closeList();
        if (!inCode) { html += '<pre><code>'; inCode = true; }
        else { html += '</code></pre>\n'; inCode = false; }
        continue;
      }
      if (inCode) { html += escHtml(raw) + '\n'; continue; }
      if (/^\s*$/.test(line)) { flushParagraph(); closeList(); continue; }
      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        flushParagraph(); closeList();
        var level = h[1].length;
        html += '<h' + level + '>' + inlineFormat(h[2]) + '</h' + level + '>\n';
        continue;
      }
      var bq = line.match(/^>\s?(.*)$/);
      if (bq) {
        flushParagraph(); closeList();
        html += '<blockquote>' + inlineFormat(bq[1]) + '</blockquote>\n';
        continue;
      }
      var ol = line.match(/^\s*\d+\.\s+(.*)$/);
      var ul = line.match(/^\s*[-*+]\s+(.*)$/);
      if (ol) {
        flushParagraph();
        if (inList !== 'ol') { closeList(); html += '<ol>\n'; inList = 'ol'; }
        html += '<li>' + inlineFormat(ol[1]) + '</li>\n';
        continue;
      }
      if (ul) {
        flushParagraph();
        if (inList !== 'ul') { closeList(); html += '<ul>\n'; inList = 'ul'; }
        html += '<li>' + inlineFormat(ul[1]) + '</li>\n';
        continue;
      }
      closeList();
      paragraph.push(line.trim());
    }
    flushParagraph();
    closeList();
    if (inCode) html += '</code></pre>\n';
    return html.trim();
  }
  function initMarkdownToHtmlConverter(card, T) {
    on(card, 'calc', function () {
      var md = document.getElementById('markdownInput').value;
      if (!md) { alert(T.error); return; }
      var htmlOut = simpleMarkdownToHtml(md);
      var box = '<div class="result-extra">' + T.htmlOutputLabel + '</div>' +
        '<textarea class="result-textarea" readonly>' + escHtml(htmlOut) + '</textarea>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>' +
        '<div class="result-extra">' + T.previewLabel + '</div>' +
        '<div class="markdown-preview">' + htmlOut + '</div>';
      showResult(card, box);
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(htmlOut, T, copyBtn); });
    });
  }

  // ---------------------------------------------------------- POMODORO TIMER
  function initPomodoroTimer(card, T) {
    var calcBtn = card.querySelector('[data-action="calc"]');
    if (calcBtn) calcBtn.style.display = 'none';

    var FOCUS = 25 * 60, SHORT_BREAK = 5 * 60, LONG_BREAK = 20 * 60, CYCLES_BEFORE_LONG = 4;
    var state = { mode: 'focus', cycle: 1, remaining: FOCUS, running: false, timerId: null };

    var wrap = document.createElement('div');
    wrap.className = 'pomodoro-widget';
    wrap.innerHTML =
      '<div class="pomodoro-mode" data-role="mode">' + T.focusLabel + '</div>' +
      '<div class="pomodoro-clock" data-role="clock">25:00</div>' +
      '<div class="pomodoro-cycle" data-role="cycle"></div>' +
      '<div class="actions">' +
      '<button type="button" class="btn-primary" data-role="start">' + T.startLabel + '</button>' +
      '<button type="button" class="btn-secondary" data-role="pause">' + T.pauseLabel + '</button>' +
      '<button type="button" class="btn-secondary" data-role="reset">' + T.resetLabel + '</button>' +
      '</div>';
    card.insertBefore(wrap, card.querySelector('[data-role="result"]'));

    var clockEl = wrap.querySelector('[data-role="clock"]');
    var modeEl = wrap.querySelector('[data-role="mode"]');
    var cycleEl = wrap.querySelector('[data-role="cycle"]');
    var startBtn = wrap.querySelector('[data-role="start"]');
    var pauseBtn = wrap.querySelector('[data-role="pause"]');
    var resetBtn = wrap.querySelector('[data-role="reset"]');

    function fmt(sec) {
      var m = Math.floor(sec / 60), s = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    function modeLabel(mode) {
      if (mode === 'focus') return T.focusLabel;
      if (mode === 'shortBreak') return T.shortBreakLabel;
      return T.longBreakLabel;
    }
    function render() {
      clockEl.textContent = fmt(state.remaining);
      modeEl.textContent = modeLabel(state.mode);
      wrap.className = 'pomodoro-widget mode-' + state.mode;
      cycleEl.textContent = T.cycleLabel + ' ' + state.cycle + '/' + CYCLES_BEFORE_LONG;
    }
    function notify() {
      wrap.classList.add('pomodoro-alert');
      setTimeout(function () { wrap.classList.remove('pomodoro-alert'); }, 1500);
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        osc.frequency.value = 880;
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(function () { osc.stop(); ctx.close(); }, 300);
      } catch (e) { /* audio not available */ }
    }
    function nextMode() {
      if (state.mode === 'focus') {
        if (state.cycle >= CYCLES_BEFORE_LONG) {
          state.mode = 'longBreak';
          state.remaining = LONG_BREAK;
        } else {
          state.mode = 'shortBreak';
          state.remaining = SHORT_BREAK;
        }
      } else {
        if (state.mode === 'longBreak') { state.cycle = 1; } else { state.cycle++; }
        state.mode = 'focus';
        state.remaining = FOCUS;
      }
    }
    function tick() {
      state.remaining--;
      if (state.remaining <= 0) {
        notify();
        nextMode();
      }
      render();
    }
    function start() {
      if (state.running) return;
      state.running = true;
      state.timerId = setInterval(tick, 1000);
    }
    function pause() {
      state.running = false;
      if (state.timerId) clearInterval(state.timerId);
    }
    function reset() {
      pause();
      state.mode = 'focus'; state.cycle = 1; state.remaining = FOCUS;
      render();
    }
    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', pause);
    resetBtn.addEventListener('click', reset);
    render();
  }

  // ---------------------------------------------------------- BUSINESS DAYS
  function countBusinessDays(d1, d2) {
    var start = d1 < d2 ? d1 : d2;
    var end = d1 < d2 ? d2 : d1;
    var count = 0;
    var cursor = new Date(start.getTime());
    while (cursor <= end) {
      var dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  }
  function initBusinessDaysCalculator(card, T) {
    on(card, 'calc', function () {
      var d1 = parseISODate(document.getElementById('dataInicialBd').value);
      var d2 = parseISODate(document.getElementById('dataFinalBd').value);
      if (!d1 || !d2) { alert(T.error); return; }
      var uteis = countBusinessDays(d1, d2);
      var totalDias = Math.abs(diasEntreDatas(d1, d2)) + 1;
      var html = '<div class="result-value">' + T.businessDaysLabel + ': ' + uteis + '</div>' +
        '<div class="result-extra">' + T.totalDaysLabel + ': <strong>' + totalDias + '</strong></div>' +
        '<div class="result-note">' + T.noHolidaysNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE MÉDIA PONDERADA (educação)
  function initWeightedGradeCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var modo = document.getElementById('modoReversa').value;
      if (modo === 'reversa') {
        var mediaAtual = parseFloat(document.getElementById('mediaAtual').value);
        var pesoProva = parseFloat(document.getElementById('pesoProva').value);
        var notaMinima = parseFloat(document.getElementById('notaMinima').value);
        if (isNaN(mediaAtual) || isNaN(pesoProva) || pesoProva <= 0 || pesoProva > 100 || isNaN(notaMinima)) { alert(T.error); return; }
        var p = pesoProva / 100;
        var necessaria = (notaMinima - mediaAtual * (1 - p)) / p;
        var html;
        if (necessaria <= 0) {
          html = '<div class="result-value">' + T.jaAprovado + '</div>';
        } else if (necessaria > 10) {
          html = '<div class="result-value">' + fmtNum(necessaria, lang) + '</div><div class="result-note">' + T.impossivel + '</div>';
        } else {
          html = '<div class="result-value">' + fmtNum(necessaria, lang) + '</div><div class="result-extra">' + T.notaNecessariaNote + '</div>';
        }
        showResult(card, html);
        return;
      }
      var raw = (document.getElementById('notas').value || '').trim();
      if (!raw) { alert(T.error); return; }
      var linhas = raw.split('\n');
      var somaNP = 0, somaP = 0, valid = 0;
      linhas.forEach(function (linha) {
        var parts = linha.split(':');
        if (parts.length !== 2) return;
        var nota = parseFloat(parts[0].replace(',', '.'));
        var peso = parseFloat(parts[1].replace(',', '.'));
        if (isNaN(nota) || isNaN(peso) || peso <= 0) return;
        somaNP += nota * peso;
        somaP += peso;
        valid++;
      });
      if (!valid || somaP <= 0) { alert(T.error); return; }
      var media = somaNP / somaP;
      var html = '<div class="result-value">' + fmtNum(media, lang) + '</div>' +
        '<div class="result-extra">' + T.disciplinasContadas + ': <strong>' + valid + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR DE NOTA PARA CONCEITO
  function initGradeScaleConverter(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var nota = parseFloat(document.getElementById('notaValor').value);
      var escala = document.getElementById('escala').value;
      if (isNaN(nota)) { alert(T.error); return; }
      var max = escala === '100' ? 100 : 10;
      if (nota < 0 || nota > max) { alert(T.error); return; }
      var pct = nota / max; // 0..1
      var letra, conceito;
      if (pct >= 0.9) { letra = 'A'; conceito = T.otimo; }
      else if (pct >= 0.7) { letra = 'B'; conceito = T.bom; }
      else if (pct >= 0.5) { letra = 'C'; conceito = T.regular; }
      else if (pct >= 0.3) { letra = 'D'; conceito = T.insuficiente; }
      else { letra = 'F'; conceito = T.insuficiente; }
      var html = '<div class="result-value">' + letra + '</div>' +
        '<div class="result-extra">' + T.conceitoLabel + ': <strong>' + conceito + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CONVERSOR NOTA BR <-> GPA
  function initGpaConverter(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var nota = parseFloat(document.getElementById('notaBr').value);
      if (isNaN(nota) || nota < 0 || nota > 10) { alert(T.error); return; }
      var gpa, letra;
      if (nota >= 9.0) { gpa = 4.0; letra = 'A'; }
      else if (nota >= 8.0) { gpa = 3.5; letra = 'B+'; }
      else if (nota >= 7.0) { gpa = 3.0; letra = 'B'; }
      else if (nota >= 6.0) { gpa = 2.5; letra = 'C+'; }
      else if (nota >= 5.0) { gpa = 2.0; letra = 'C'; }
      else if (nota >= 4.0) { gpa = 1.0; letra = 'D'; }
      else { gpa = 0.0; letra = 'F'; }
      var html = '<div class="result-value">GPA ' + fmtNum(gpa, lang, 1) + '</div>' +
        '<div class="result-extra">' + T.letraLabel + ': <strong>' + letra + '</strong></div>' +
        '<div class="result-note">' + T.tabelaVariaNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE FREQUÊNCIA MÍNIMA
  function initAttendanceCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var total = parseFloat(document.getElementById('totalAulas').value);
      var faltas = parseFloat(document.getElementById('aulasFaltadas').value);
      var minima = parseFloat(document.getElementById('frequenciaMinima').value);
      if (!total || total <= 0 || isNaN(faltas) || faltas < 0 || faltas > total || !minima || minima <= 0 || minima > 100) { alert(T.error); return; }
      var freqAtual = ((total - faltas) / total) * 100;
      var maxFaltasPermitidas = Math.floor(total * (1 - minima / 100));
      var faltasRestantes = Math.max(0, maxFaltasPermitidas - faltas);
      var apto = freqAtual >= minima;
      var html = '<div class="result-value" style="color:' + (apto ? 'var(--ok,#166534)' : 'var(--err,#b91c1c)') + '">' + fmtNum(freqAtual, lang, 1) + '%</div>' +
        '<div class="result-classification">' + (apto ? T.aptoLabel : T.reprovadoLabel) + '</div>' +
        '<div class="result-extra">' + T.faltasMaxLabel + ': <strong>' + maxFaltasPermitidas + '</strong></div>' +
        '<div class="result-extra">' + T.faltasRestantesLabel + ': <strong>' + faltasRestantes + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE CR/IRA
  function initCrIraCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var raw = (document.getElementById('disciplinasCr').value || '').trim();
      if (!raw) { alert(T.error); return; }
      var linhas = raw.split('\n');
      var somaNC = 0, somaC = 0, valid = 0;
      linhas.forEach(function (linha) {
        var parts = linha.split(':');
        if (parts.length !== 3) return;
        var nota = parseFloat(parts[1].replace(',', '.'));
        var creditos = parseFloat(parts[2].replace(',', '.'));
        if (isNaN(nota) || isNaN(creditos) || creditos <= 0) return;
        somaNC += nota * creditos;
        somaC += creditos;
        valid++;
      });
      if (!valid || somaC <= 0) { alert(T.error); return; }
      var cr = somaNC / somaC;
      var html = '<div class="result-value">' + fmtNum(cr, lang) + '</div>' +
        '<div class="result-extra">' + T.disciplinasContadasCr + ': <strong>' + valid + '</strong></div>' +
        '<div class="result-extra">' + T.creditosTotaisLabel + ': <strong>' + fmtNum(somaC, lang, 0) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- PLANEJADOR DE REVISÃO ESPAÇADA
  function initSpacedRepetitionPlanner(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var d = parseISODate(document.getElementById('dataEstudo').value);
      if (!d) { alert(T.error); return; }
      var intervalos = [1, 3, 7, 15, 30];
      var rows = intervalos.map(function (n) {
        var data = addDays(d, n);
        return '<tr><td class="cell-strong">+' + n + ' ' + T.diasSufixo + '</td><td>' + fmtDateLocale(data, lang) + '</td></tr>';
      }).join('');
      var html = '<table class="result-table"><thead><tr><th>' + T.intervaloHeader + '</th><th>' + T.dataRevisaoHeader + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE PLANO DE LEITURA
  function initReadingPlanCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var totalPaginas = parseFloat(document.getElementById('totalPaginas').value);
      var modo = document.getElementById('modoLeitura').value;
      if (!totalPaginas || totalPaginas <= 0) { alert(T.error); return; }
      var html;
      if (modo === 'prazo') {
        var dias = parseFloat(document.getElementById('diasPrazo').value);
        if (!dias || dias <= 0) { alert(T.error); return; }
        var porDia = Math.ceil(totalPaginas / dias);
        html = '<div class="result-value">' + porDia + ' ' + T.paginasPorDiaSufixo + '</div>' +
          '<div class="result-extra">' + T.prazoDiasLabel + ': <strong>' + dias + '</strong></div>';
      } else {
        var paginasPorDia = parseFloat(document.getElementById('paginasPorDia').value);
        if (!paginasPorDia || paginasPorDia <= 0) { alert(T.error); return; }
        var diasNecessarios = Math.ceil(totalPaginas / paginasPorDia);
        var dataConclusao = addDays(new Date(), diasNecessarios);
        html = '<div class="result-value">' + diasNecessarios + ' ' + T.diasSufixo + '</div>' +
          '<div class="result-extra">' + T.dataConclusaoLabel + ': <strong>' + fmtDateLocale(dataConclusao, lang) + '</strong></div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE TINTA
  function initPaintCalculator(card, T) {
    var lang = card.dataset.lang;
    var RENDIMENTO = { latex: 6, acrilica: 5, esmalte: 8 };
    on(card, 'calc', function () {
      var area = parseFloat(document.getElementById('areaPintar').value);
      var demaos = parseFloat(document.getElementById('demaos').value);
      var tipo = document.getElementById('tipoTinta').value;
      if (!area || area <= 0 || !demaos || demaos <= 0) { alert(T.error); return; }
      var rendimento = RENDIMENTO[tipo] || RENDIMENTO.latex;
      var litros = (area * demaos / rendimento) * 1.1;
      var html = '<div class="result-value">' + fmtNum(litros, lang, 1) + ' L</div>' +
        '<div class="result-extra">' + T.rendimentoUsadoLabel + ': <strong>' + rendimento + ' m²/L</strong></div>' +
        '<div class="result-note">' + T.margemPerdaNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE PISO/REVESTIMENTO
  function initFlooringCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var area = parseFloat(document.getElementById('areaAmbiente').value);
      var areaCaixa = parseFloat(document.getElementById('areaPorCaixa').value);
      var perda = parseFloat(document.getElementById('percPerdaPiso').value);
      if (!area || area <= 0 || !areaCaixa || areaCaixa <= 0 || isNaN(perda) || perda < 0) { alert(T.error); return; }
      var areaTotal = area * (1 + perda / 100);
      var caixas = Math.ceil(areaTotal / areaCaixa);
      var html = '<div class="result-value">' + caixas + ' ' + T.caixasSufixo + '</div>' +
        '<div class="result-extra">' + T.areaComPerdaLabel + ': <strong>' + fmtNum(areaTotal, lang) + ' m²</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE ARGAMASSA/REBOCO
  function initMortarCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var area = parseFloat(document.getElementById('areaArgamassa').value);
      var espessura = parseFloat(document.getElementById('espessuraCm').value);
      var consumo = parseFloat(document.getElementById('consumoKgM2Cm').value);
      var pesoSaco = parseFloat(document.getElementById('pesoSaco').value);
      if (!area || area <= 0 || !espessura || espessura <= 0 || !consumo || consumo <= 0 || !pesoSaco || pesoSaco <= 0) { alert(T.error); return; }
      var kgTotal = area * espessura * consumo;
      var sacos = Math.ceil(kgTotal / pesoSaco);
      var html = '<div class="result-value">' + sacos + ' ' + T.sacosSufixo + '</div>' +
        '<div class="result-extra">' + T.kgTotalLabel + ': <strong>' + fmtNum(kgTotal, lang, 0) + ' kg</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE TIJOLOS/BLOCOS
  function initBrickCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var comp = parseFloat(document.getElementById('comprimentoTijolo').value);
      var alt = parseFloat(document.getElementById('alturaTijolo').value);
      var area = parseFloat(document.getElementById('areaParedeTijolo').value);
      var perda = parseFloat(document.getElementById('percPerdaTijolo').value);
      if (!comp || comp <= 0 || !alt || alt <= 0 || !area || area <= 0 || isNaN(perda) || perda < 0) { alert(T.error); return; }
      var areaTijolo = (comp / 100) * (alt / 100);
      var qtdPorM2 = 1 / areaTijolo;
      var qtdTotal = Math.ceil(area * qtdPorM2 * (1 + perda / 100));
      var html = '<div class="result-value">' + qtdTotal + ' ' + T.unidadesSufixo + '</div>' +
        '<div class="result-extra">' + T.porM2Label + ': <strong>' + fmtNum(qtdPorM2, lang, 1) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE TRAÇO DE CONCRETO
  function initConcreteCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var volume = parseFloat(document.getElementById('volumeConcreto').value);
      var tCimento = parseFloat(document.getElementById('tracoCimento').value);
      var tAreia = parseFloat(document.getElementById('tracoAreia').value);
      var tBrita = parseFloat(document.getElementById('tracoBrita').value);
      if (!volume || volume <= 0 || !tCimento || !tAreia || !tBrita) { alert(T.error); return; }
      var totalPartes = tCimento + tAreia + tBrita;
      var volCimento = volume * (tCimento / totalPartes);
      var volAreia = volume * (tAreia / totalPartes);
      var volBrita = volume * (tBrita / totalPartes);
      var sacosCimento = Math.ceil(volCimento / 0.0333);
      var aguaLitros = sacosCimento * 50 * 0.55;
      var html = '<div class="result-value">' + sacosCimento + ' ' + T.sacosCimentoSufixo + '</div>' +
        '<div class="result-extra">' + T.areiaLabel + ': <strong>' + fmtNum(volAreia, lang) + ' m³</strong></div>' +
        '<div class="result-extra">' + T.britaLabel + ': <strong>' + fmtNum(volBrita, lang) + ' m³</strong></div>' +
        '<div class="result-extra">' + T.aguaEstimadaLabel + ': <strong>' + fmtNum(aguaLitros, lang, 0) + ' L</strong></div>' +
        '<div class="result-note">' + T.estimativaNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE PAPEL DE PAREDE
  function initWallpaperCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var area = parseFloat(document.getElementById('areaParedeWp').value);
      var largura = parseFloat(document.getElementById('larguraRolo').value);
      var comprimento = parseFloat(document.getElementById('comprimentoRolo').value);
      var perda = parseFloat(document.getElementById('percPerdaWp').value);
      if (!area || area <= 0 || !largura || largura <= 0 || !comprimento || comprimento <= 0 || isNaN(perda) || perda < 0) { alert(T.error); return; }
      var areaRolo = (largura / 100) * comprimento;
      var rolos = Math.ceil((area * (1 + perda / 100)) / areaRolo);
      var html = '<div class="result-value">' + rolos + ' ' + T.rolosSufixo + '</div>' +
        '<div class="result-extra">' + T.areaPorRoloLabel + ': <strong>' + fmtNum(areaRolo, lang) + ' m²</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE GRAMA
  function initGrassCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var area = parseFloat(document.getElementById('areaGramado').value);
      var preco = parseFloat(document.getElementById('precoM2Grama').value);
      if (!area || area <= 0) { alert(T.error); return; }
      var html = '<div class="result-value">' + fmtNum(area, lang) + ' m²</div>';
      if (!isNaN(preco) && preco > 0) {
        var custo = area * preco;
        html += '<div class="result-extra">' + T.custoEstimadoLabel + ': <strong>' + fmtNum(custo, lang) + '</strong></div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE REJUNTE
  function initGroutCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var area = parseFloat(document.getElementById('areaRejunte').value);
      var comp = parseFloat(document.getElementById('comprimentoPeca').value);
      var larg = parseFloat(document.getElementById('larguraPeca').value);
      var espessura = parseFloat(document.getElementById('espessuraPeca').value);
      var junta = parseFloat(document.getElementById('larguraJunta').value);
      if (!area || area <= 0 || !comp || comp <= 0 || !larg || larg <= 0 || !espessura || espessura <= 0 || !junta || junta <= 0) { alert(T.error); return; }
      var compM = comp / 100, largM = larg / 100;
      var consumoM2 = ((compM + largM) / (compM * largM)) * junta * espessura * 1.6 / 1000;
      var kgTotal = consumoM2 * area;
      var html = '<div class="result-value">' + fmtNum(kgTotal, lang, 1) + ' kg</div>' +
        '<div class="result-extra">' + T.consumoM2Label + ': <strong>' + fmtNum(consumoM2, lang, 3) + ' kg/m²</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE ESCADA (BLONDEL)
  function initStairCalculator(card, T) {
    var lang = card.dataset.lang;
    on(card, 'calc', function () {
      var altura = parseFloat(document.getElementById('alturaVencer').value);
      if (!altura || altura <= 0) { alert(T.error); return; }
      var numDegraus = Math.round(altura / 17);
      if (numDegraus < 1) numDegraus = 1;
      var espelho = altura / numDegraus;
      var piso = 63.5 - 2 * espelho;
      var confortavel = espelho >= 16 && espelho <= 18.5 && piso >= 25 && piso <= 32;
      var html = '<div class="result-value">' + numDegraus + ' ' + T.degrausSufixo + '</div>' +
        '<div class="result-extra">' + T.espelhoLabel + ': <strong>' + fmtNum(espelho, lang, 1) + ' cm</strong></div>' +
        '<div class="result-extra">' + T.pisoLabel + ': <strong>' + fmtNum(piso, lang, 1) + ' cm</strong></div>' +
        '<div class="result-classification" style="color:' + (confortavel ? 'var(--ok,#166534)' : 'var(--warn,#92400e)') + '">' + (confortavel ? T.confortavel : T.foraDaFaixa) + '</div>' +
        '<div class="result-note">' + T.blondelNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE TELHAS
  function initRoofTileCalculator(card, T) {
    var lang = card.dataset.lang;
    var TELHAS_M2 = { ceramica: 16, concreto: 10.5 };
    on(card, 'calc', function () {
      var areaCasa = parseFloat(document.getElementById('areaCasaTelha').value);
      var fator = parseFloat(document.getElementById('fatorInclinacao').value);
      var tipo = document.getElementById('tipoTelha').value;
      if (!areaCasa || areaCasa <= 0 || !fator || fator <= 0) { alert(T.error); return; }
      var areaTelhado = areaCasa * fator;
      var telhasPorM2 = TELHAS_M2[tipo] || TELHAS_M2.ceramica;
      var qtd = Math.ceil(areaTelhado * telhasPorM2 * 1.05);
      var html = '<div class="result-value">' + qtd + ' ' + T.telhasSufixo + '</div>' +
        '<div class="result-extra">' + T.areaTelhadoLabel + ': <strong>' + fmtNum(areaTelhado, lang) + ' m²</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CALCULADORA DE CAIXA D'ÁGUA
  function initWaterTankCalculator(card, T) {
    var lang = card.dataset.lang;
    var TAMANHOS = [310, 500, 1000, 1500, 2000, 3000, 5000, 10000];
    on(card, 'calc', function () {
      var moradores = parseFloat(document.getElementById('numMoradores').value);
      var consumo = parseFloat(document.getElementById('consumoPorPessoa').value);
      var dias = parseFloat(document.getElementById('diasReserva').value);
      if (!moradores || moradores <= 0 || !consumo || consumo <= 0 || !dias || dias <= 0) { alert(T.error); return; }
      var capacidadeMin = moradores * consumo * dias;
      var sugerido = TAMANHOS.find(function (t) { return t >= capacidadeMin; }) || TAMANHOS[TAMANHOS.length - 1];
      var html = '<div class="result-value">' + fmtNum(capacidadeMin, lang, 0) + ' L</div>' +
        '<div class="result-extra">' + T.tamanhoSugeridoLabel + ': <strong>' + sugerido + ' L</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- bootstrap

  // ============================================================ SALÁRIO LÍQUIDO E CARREIRA (personal-finance)

  function initNetSalaryCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var bruto = parseFloat(document.getElementById('grossSalary').value);
      if (!bruto || bruto <= 0) { alert(T.error); return; }
      var inss = calcINSS(bruto);
      var baseIrrf = Math.max(0, bruto - inss);
      var irrf = calcIRRF(baseIrrf, bruto);
      var liquido = round2(bruto - inss - irrf);
      var html = '<div class="result-value">' + T.netLabel + ': ' + fmtBRL(liquido) + '</div>' +
        '<div class="result-extra">' + T.inssLabel + ': <strong>-' + fmtBRL(inss) + '</strong></div>' +
        '<div class="result-extra">' + T.irrfLabel + ': <strong>-' + fmtBRL(irrf) + '</strong></div>' +
        '<div class="result-extra">' + T.totalDiscountLabel + ': <strong>-' + fmtBRL(round2(inss + irrf)) + '</strong></div>';
      showResult(card, html);
    });
  }

  function initSalaryAdjustmentSimulator(card, T) {
    on(card, 'calc', function () {
      var atual = parseFloat(document.getElementById('currentSalary').value);
      var percentInput = document.getElementById('adjustmentPercent').value;
      var novoInput = document.getElementById('newSalaryInput').value;
      var inflacao = parseFloat(document.getElementById('inflationIndex').value);
      if (!atual || atual <= 0) { alert(T.error); return; }
      var novo;
      if (novoInput !== '' && !isNaN(parseFloat(novoInput))) {
        novo = parseFloat(novoInput);
      } else if (percentInput !== '' && !isNaN(parseFloat(percentInput))) {
        novo = atual * (1 + parseFloat(percentInput) / 100);
      } else {
        alert(T.error); return;
      }
      var diffNominal = round2(novo - atual);
      var percentNominal = round2(((novo / atual) - 1) * 100);
      var html = '<div class="result-value">' + T.newSalaryLabel + ': ' + fmtBRL(round2(novo)) + '</div>' +
        '<div class="result-extra">' + T.nominalDiffLabel + ': <strong>' + fmtBRL(diffNominal) + ' (' + percentNominal + '%)</strong></div>';
      if (!isNaN(inflacao)) {
        var percentReal = round2((((1 + percentNominal / 100) / (1 + inflacao / 100)) - 1) * 100);
        html += '<div class="result-extra">' + T.realDiffLabel + ': <strong>' + percentReal + '%</strong></div>';
      }
      showResult(card, html);
    });
  }

  function initJobOfferComparator(card, T) {
    on(card, 'calc', function () {
      var aSal = parseFloat(document.getElementById('offerASalary').value) || 0;
      var aVr = parseFloat(document.getElementById('offerAVr').value) || 0;
      var aHealth = parseFloat(document.getElementById('offerAHealth').value) || 0;
      var bSal = parseFloat(document.getElementById('offerBSalary').value) || 0;
      var bVr = parseFloat(document.getElementById('offerBVr').value) || 0;
      var bHealth = parseFloat(document.getElementById('offerBHealth').value) || 0;
      if (aSal <= 0 || bSal <= 0) { alert(T.error); return; }
      var totalA = round2(aSal + aVr + aHealth);
      var totalB = round2(bSal + bVr + bHealth);
      var winner = totalA === totalB ? T.tieLabel : (totalA > totalB ? T.offerALabel : T.offerBLabel);
      var html = '<div class="result-extra">' + T.offerALabel + ' — ' + T.totalPackageLabel + ': <strong>' + fmtBRL(totalA) + '</strong></div>' +
        '<div class="result-extra">' + T.offerBLabel + ' — ' + T.totalPackageLabel + ': <strong>' + fmtBRL(totalB) + '</strong></div>' +
        '<div class="result-value">' + T.betterOfferLabel + ': ' + winner + '</div>';
      showResult(card, html);
    });
  }

  function initCltHourlyRateCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var salario = parseFloat(document.getElementById('monthlySalaryClt').value);
      var horasSemana = parseFloat(document.getElementById('weeklyHoursClt').value);
      if (!salario || salario <= 0 || !horasSemana || horasSemana <= 0 || horasSemana > 44) { alert(T.error); return; }
      var horasMes = round2((horasSemana / 6) * 30);
      var valorHora = round2(salario / horasMes);
      var html = '<div class="result-value">' + T.hourlyRateLabel + ': ' + fmtNum(valorHora, lang) + '</div>' +
        '<div class="result-extra">' + T.monthlyHoursLabel + ': <strong>' + fmtNum(horasMes, lang, 1) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ============================================================ PETS (pets)

  function humanAgeDog(ageYears) {
    if (ageYears < 1) return 31 * ageYears;
    return 16 * Math.log(ageYears) + 31;
  }
  function initDogAgeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var idade = parseFloat(document.getElementById('dogAgeYears').value);
      if (isNaN(idade) || idade <= 0) { alert(T.error); return; }
      var humana = round2(humanAgeDog(idade));
      var html = '<div class="result-value">' + T.humanAgeLabel + ': ' + fmtNum(humana, lang, 1) + '</div>';
      showResult(card, html);
    });
  }

  function humanAgeCat(ageYears) {
    if (ageYears <= 1) return 15 * ageYears;
    if (ageYears <= 2) return 15 + 9 * (ageYears - 1);
    return 24 + 4 * (ageYears - 2);
  }
  function initCatAgeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var idade = parseFloat(document.getElementById('catAgeYears').value);
      if (isNaN(idade) || idade <= 0) { alert(T.error); return; }
      var humana = round2(humanAgeCat(idade));
      var html = '<div class="result-value">' + T.humanAgeLabel + ': ' + fmtNum(humana, lang, 1) + '</div>';
      showResult(card, html);
    });
  }

  var DOG_WEIGHT_RANGES = {
    small: [1, 10], medium: [10, 25], large: [25, 45], giant: [45, 90]
  };
  function initDogIdealWeightCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var porte = document.getElementById('dogSize').value;
      var atual = parseFloat(document.getElementById('currentDogWeight').value);
      var range = DOG_WEIGHT_RANGES[porte];
      var html = '<div class="result-value">' + T.rangeLabel + ': ' + fmtNum(range[0], lang, 1) + ' – ' + fmtNum(range[1], lang, 1) + ' kg</div>';
      if (!isNaN(atual) && atual > 0) {
        var status = (atual < range[0]) ? T.belowRange : (atual > range[1] ? T.aboveRange : T.withinRange);
        html += '<div class="result-extra">' + status + '</div>';
      }
      showResult(card, html);
    });
  }

  var DOG_ACTIVITY_FACTOR = { low: 1.2, moderate: 1.6, high: 2.0 };
  function initDogFoodCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var peso = parseFloat(document.getElementById('dogWeightFood').value);
      var atividade = document.getElementById('dogActivity').value;
      if (!peso || peso <= 0) { alert(T.error); return; }
      var rer = 70 * Math.pow(peso, 0.75);
      var kcalDia = rer * (DOG_ACTIVITY_FACTOR[atividade] || 1.6);
      var gramasDia = round2(kcalDia / 3.5); // aprox. 3.5 kcal/g em ração seca padrão
      var html = '<div class="result-value">' + T.gramsPerDayLabel + ': ' + fmtNum(gramasDia, lang, 0) + ' g</div>' +
        '<div class="result-extra">' + T.kcalPerDayLabel + ': <strong>' + fmtNum(round2(kcalDia), lang, 0) + ' kcal</strong></div>';
      showResult(card, html);
    });
  }

  // ============================================================ ODDS E PROBABILIDADE (calculators)

  function parseFraction(str) {
    var m = String(str).trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
    if (!m) return null;
    return parseFloat(m[1]) / parseFloat(m[2]);
  }
  function gcdInt(a, b) { return b === 0 ? a : gcdInt(b, a % b); }
  function decimalToFraction(dec, maxDenom) {
    maxDenom = maxDenom || 1000;
    var value = dec;
    var bestNum = 1, bestDen = 1, bestErr = Infinity;
    for (var den = 1; den <= maxDenom; den++) {
      var num = Math.round(value * den);
      var err = Math.abs(value - num / den);
      if (err < bestErr) { bestErr = err; bestNum = num; bestDen = den; }
      if (err < 1e-9) break;
    }
    var g = gcdInt(bestNum, bestDen) || 1;
    return (bestNum / g) + '/' + (bestDen / g);
  }
  function decimalToAmerican(dec) {
    if (dec >= 2) return '+' + Math.round((dec - 1) * 100);
    return Math.round(-100 / (dec - 1)).toString();
  }
  function americanToDecimal(am) {
    var n = parseFloat(am);
    if (isNaN(n)) return null;
    return n > 0 ? 1 + n / 100 : 1 + 100 / Math.abs(n);
  }
  function initOddsConverter(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var raw = document.getElementById('oddsInput').value.trim();
      var format = document.getElementById('oddsFormat').value;
      var decimal = null;
      if (format === 'decimal') decimal = parseFloat(raw);
      else if (format === 'fractional') decimal = parseFraction(raw) !== null ? parseFraction(raw) + 1 : null;
      else if (format === 'american') decimal = americanToDecimal(raw);
      if (!decimal || isNaN(decimal) || decimal <= 1) { alert(T.error); return; }
      var html = '<div class="result-extra">Decimal: <strong>' + round2(decimal) + '</strong></div>' +
        '<div class="result-extra">' + T.fractionalLabel + ': <strong>' + decimalToFraction(decimal - 1) + '</strong></div>' +
        '<div class="result-extra">' + T.americanLabel + ': <strong>' + decimalToAmerican(decimal) + '</strong></div>' +
        '<div class="result-value">' + T.impliedProbLabel + ': ' + round2(100 / decimal) + '%</div>';
      showResult(card, html);
    });
  }

  function initImpliedProbabilityCalculator(card, T) {
    on(card, 'calc', function () {
      var oddsRaw = document.getElementById('decimalOddsProb').value;
      var probRaw = document.getElementById('probabilityPercent').value;
      var html;
      if (probRaw !== '' && !isNaN(parseFloat(probRaw))) {
        var prob = parseFloat(probRaw);
        if (prob <= 0 || prob > 100) { alert(T.error); return; }
        var odds = round2(100 / prob);
        html = '<div class="result-value">' + T.oddsResultLabel + ': ' + odds + '</div>';
      } else if (oddsRaw !== '' && !isNaN(parseFloat(oddsRaw))) {
        var o = parseFloat(oddsRaw);
        if (o <= 1) { alert(T.error); return; }
        html = '<div class="result-value">' + T.probResultLabel + ': ' + round2(100 / o) + '%</div>';
      } else { alert(T.error); return; }
      showResult(card, html);
    });
  }

  function initParlayOddsCalculator(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'calc', function () {
      var lines = input.value.split(/[\n,]+/).map(function (s) { return parseFloat(s.trim()); }).filter(function (n) { return !isNaN(n) && n > 1; });
      if (lines.length < 2) { alert(T.error); return; }
      var combined = lines.reduce(function (acc, n) { return acc * n; }, 1);
      var prob = 100 / combined;
      var html = '<div class="result-value">' + T.combinedOddsLabel + ': ' + round2(combined) + '</div>' +
        '<div class="result-extra">' + T.combinedProbLabel + ': <strong>' + round2(prob) + '%</strong></div>' +
        '<div class="result-extra">' + T.legsCountLabel + ': <strong>' + lines.length + '</strong></div>';
      showResult(card, html);
    });
  }

  function initBetEvCalculator(card, T) {
    on(card, 'calc', function () {
      var odds = parseFloat(document.getElementById('decimalOddsEv').value);
      var prob = parseFloat(document.getElementById('estimatedProbability').value);
      var stake = parseFloat(document.getElementById('stakeAmount').value);
      if (!odds || odds <= 1 || isNaN(prob) || prob <= 0 || prob > 100 || !stake || stake <= 0) { alert(T.error); return; }
      var ev = round2(stake * ((prob / 100) * odds - 1));
      var html = '<div class="result-value">EV: ' + fmtBRL(ev) + '</div>' +
        '<div class="result-extra">' + (ev >= 0 ? T.positiveEvMsg : T.negativeEvMsg) + '</div>';
      showResult(card, html);
    });
  }

  // ============================================================ MARKETING DIGITAL (calculators)

  function initMarketingRoiCalculator(card, T) {
    on(card, 'calc', function () {
      var invest = parseFloat(document.getElementById('mktInvestment').value);
      var receita = parseFloat(document.getElementById('mktRevenue').value);
      if (!invest || invest <= 0 || isNaN(receita) || receita < 0) { alert(T.error); return; }
      var lucro = round2(receita - invest);
      var roi = round2((lucro / invest) * 100);
      var html = '<div class="result-value">ROI: ' + roi + '%</div>' +
        '<div class="result-extra">' + T.netProfitLabel + ': <strong>' + fmtBRL(lucro) + '</strong></div>';
      showResult(card, html);
    });
  }

  function initCacCalculator(card, T) {
    on(card, 'calc', function () {
      var gasto = parseFloat(document.getElementById('cacSpend').value);
      var clientes = parseFloat(document.getElementById('cacCustomers').value);
      if (!gasto || gasto <= 0 || !clientes || clientes <= 0) { alert(T.error); return; }
      var cac = round2(gasto / clientes);
      showResult(card, '<div class="result-value">CAC: ' + fmtBRL(cac) + '</div>');
    });
  }

  function initLtvCalculator(card, T) {
    on(card, 'calc', function () {
      var ticket = parseFloat(document.getElementById('ltvTicket').value);
      var freq = parseFloat(document.getElementById('ltvFrequency').value);
      var retencao = parseFloat(document.getElementById('ltvRetention').value);
      var cac = parseFloat(document.getElementById('ltvCacInput').value);
      if (!ticket || ticket <= 0 || !freq || freq <= 0 || !retencao || retencao <= 0) { alert(T.error); return; }
      var ltv = round2(ticket * freq * retencao);
      var html = '<div class="result-value">LTV: ' + fmtBRL(ltv) + '</div>';
      if (!isNaN(cac) && cac > 0) {
        var ratio = round2(ltv / cac);
        html += '<div class="result-extra">LTV/CAC: <strong>' + ratio + '</strong> — ' + (ratio > 3 ? T.healthyRatioMsg : T.unhealthyRatioMsg) + '</div>';
      }
      showResult(card, html);
    });
  }

  function initCpmCpcCtrCalculator(card, T) {
    on(card, 'calc', function () {
      var gasto = parseFloat(document.getElementById('adSpendCpm').value);
      var impressoes = parseFloat(document.getElementById('adImpressions').value);
      var clicks = parseFloat(document.getElementById('adClicks').value);
      if (!gasto || gasto <= 0 || !impressoes || impressoes <= 0 || !clicks || clicks < 0) { alert(T.error); return; }
      var cpm = round2((gasto / impressoes) * 1000);
      var cpc = clicks > 0 ? round2(gasto / clicks) : 0;
      var ctr = round2((clicks / impressoes) * 100);
      var html = '<div class="result-extra">CPM: <strong>' + fmtBRL(cpm) + '</strong></div>' +
        '<div class="result-extra">CPC: <strong>' + fmtBRL(cpc) + '</strong></div>' +
        '<div class="result-value">CTR: ' + ctr + '%</div>';
      showResult(card, html);
    });
  }

  // ============================================================ SEGURANÇA (generators)

  var CRACK_CHARSET_SIZES = { numeric: 10, lower: 26, loweUpper: 52, alnum: 62, alnumSymbols: 95 };
  function formatBigDuration(seconds, T) {
    if (seconds < 1) return T.instantLabel;
    var units = [
      [31557600 * 1e9, T.unitBillionYears], [31557600 * 1e6, T.unitMillionYears],
      [31557600 * 1e3, T.unitThousandYears], [31557600, T.unitYears],
      [86400, T.unitDays], [3600, T.unitHours], [60, T.unitMinutes], [1, T.unitSeconds]
    ];
    for (var i = 0; i < units.length; i++) {
      if (seconds >= units[i][0]) {
        var val = seconds / units[i][0];
        var str = val >= 1000 ? val.toExponential(2) : round2(val).toString();
        return str + ' ' + units[i][1];
      }
    }
    return round2(seconds) + ' ' + T.unitSeconds;
  }
  function initPasswordCrackTimeEstimator(card, T) {
    on(card, 'calc', function () {
      var length = parseInt(document.getElementById('crackPwdLength').value, 10);
      var charsetKey = document.getElementById('crackCharset').value;
      var attemptsPerSec = parseFloat(document.getElementById('crackAttemptsPerSec').value) || 1e9;
      if (!length || length < 1 || length > 128) { alert(T.error); return; }
      var charsetSize = CRACK_CHARSET_SIZES[charsetKey] || 62;
      // log-space para evitar overflow com senhas longas
      var log10Combos = length * Math.log10(charsetSize);
      var log10Seconds = log10Combos - Math.log10(2) - Math.log10(attemptsPerSec);
      var seconds = Math.pow(10, log10Seconds);
      var html = '<div class="result-value">' + T.estimatedTimeLabel + ': ' + formatBigDuration(seconds, T) + '</div>' +
        '<div class="result-extra">' + T.combinationsLabel + ': <strong>10^' + round2(log10Combos) + '</strong></div>';
      showResult(card, html);
    });
  }

  function initPinGenerator(card, T) {
    on(card, 'generate', function () {
      var length = parseInt(document.getElementById('pinLength').value, 10) || 4;
      var quantity = Math.min(50, Math.max(1, parseInt(document.getElementById('pinQuantity').value, 10) || 1));
      var lines = [];
      for (var q = 0; q < quantity; q++) {
        var digits = '';
        for (var i = 0; i < length; i++) {
          var byte;
          do {
            byte = new Uint8Array(1);
            window.crypto.getRandomValues(byte);
            byte = byte[0];
          } while (byte >= 250); // evita viés de módulo
          digits += (byte % 10).toString();
        }
        lines.push(digits);
      }
      var texto = lines.join('\n');
      showResult(card,
        '<pre class="code-output code-output-lg">' + lines.map(function (l) { return escHtml(l); }).join('\n') + '</pre>' +
        '<button type="button" class="copy-btn" data-copy>' + T.copy + '</button>'
      );
      var copyBtn = card.querySelector('[data-copy]');
      if (copyBtn) copyBtn.addEventListener('click', function () { copyText(texto, T, copyBtn); });
    });
  }

  var COMMON_WEAK_PASSWORDS = ['123456', '12345678', 'password', 'senha', 'senha123', 'qwerty', '111111', '123456789', 'abc123', 'iloveyou', '123123', 'admin', 'letmein'];
  function initPasswordStrengthChecker(card, T) {
    on(card, 'calc', function () {
      var pwd = document.getElementById('pwdInput').value || '';
      if (!pwd) { alert(T.error); return; }
      var score = 0;
      var tips = [];
      if (pwd.length >= 8) score += 20; else tips.push(T.tipLength);
      if (pwd.length >= 12) score += 15;
      if (/[a-z]/.test(pwd)) score += 10; else tips.push(T.tipLower);
      if (/[A-Z]/.test(pwd)) score += 15; else tips.push(T.tipUpper);
      if (/[0-9]/.test(pwd)) score += 15; else tips.push(T.tipDigit);
      if (/[^a-zA-Z0-9]/.test(pwd)) score += 15; else tips.push(T.tipSymbol);
      var lower = pwd.toLowerCase();
      var isCommon = COMMON_WEAK_PASSWORDS.indexOf(lower) !== -1;
      var isSequential = /012|123|234|345|456|567|678|789|abcd|qwer/.test(lower);
      var isRepeated = /(.)\1{2,}/.test(pwd);
      if (isCommon) { score = Math.min(score, 10); tips.push(T.tipCommon); }
      if (isSequential) { score -= 10; tips.push(T.tipSequential); }
      if (isRepeated) { score -= 10; tips.push(T.tipRepeated); }
      score = Math.max(0, Math.min(100, score));
      var label = score < 30 ? T.strengthWeak : (score < 60 ? T.strengthMedium : (score < 85 ? T.strengthStrong : T.strengthVeryStrong));
      var html = '<div class="result-value">' + T.scoreLabel + ': ' + score + '/100 — ' + label + '</div>';
      if (tips.length) {
        html += '<ul class="result-extra">' + tips.map(function (t) { return '<li>' + escHtml(t) + '</li>'; }).join('') + '</ul>';
      }
      html += '<div class="notice">' + T.noNetworkNotice + '</div>';
      showResult(card, html);
    });
  }

  // ============================================================ ASTRONOMIA E CURIOSIDADES (everyday)

  var PLANET_ORBITAL_PERIODS = {
    mercury: 0.2408467, venus: 0.61519726, earth: 1, mars: 1.8808158,
    jupiter: 11.862615, saturn: 29.447498, uranus: 84.016846, neptune: 164.79132
  };
  var PLANET_LABELS_ORDER = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  function initAgeOnOtherPlanets(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var birth = parseISODate(document.getElementById('planetBirthDate').value);
      if (!birth) { alert(T.error); return; }
      var now = new Date();
      var earthAgeDays = diasEntreDatas(birth, now);
      var earthAgeYears = earthAgeDays / 365.25;
      if (earthAgeYears <= 0) { alert(T.error); return; }
      var html = '';
      PLANET_LABELS_ORDER.forEach(function (p) {
        var age = earthAgeYears / PLANET_ORBITAL_PERIODS[p];
        html += '<div class="result-extra">' + T.planets[p] + ': <strong>' + fmtNum(age, lang, 1) + '</strong></div>';
      });
      showResult(card, html);
    });
  }

  var PLANET_GRAVITY = {
    mercury: 0.378, venus: 0.907, earth: 1, moon: 0.166, mars: 0.377,
    jupiter: 2.36, saturn: 0.916, uranus: 0.889, neptune: 1.12
  };
  var PLANET_GRAVITY_ORDER = ['mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  function initWeightOnOtherPlanets(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var pesoTerra = parseFloat(document.getElementById('earthWeightPlanets').value);
      if (!pesoTerra || pesoTerra <= 0) { alert(T.error); return; }
      var html = '';
      PLANET_GRAVITY_ORDER.forEach(function (p) {
        var w = round2(pesoTerra * PLANET_GRAVITY[p]);
        html += '<div class="result-extra">' + T.planets[p] + ': <strong>' + fmtNum(w, lang, 1) + '</strong></div>';
      });
      showResult(card, html);
    });
  }

  var MOON_SYNODIC = 29.530588853;
  var MOON_REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0); // lua nova de referência validada
  function moonPhaseFraction(dateMs) {
    var days = dateMs / 86400000;
    var refDays = MOON_REF_NEW_MOON_MS / 86400000;
    var phase = ((days - refDays) % MOON_SYNODIC) / MOON_SYNODIC;
    if (phase < 0) phase += 1;
    return phase;
  }
  function moonPhaseNameKey(p) {
    // Faixas alargadas (~±0.03) para acomodar o desvio real de até ~14h entre o
    // instante exato de lua nova/cheia e a previsão do mês sinódico médio,
    // causado pela excentricidade da órbita lunar (validado contra datas reais).
    if (p < 0.03 || p > 0.97) return 'phaseNew';
    if (p < 0.22) return 'phaseWaxingCrescent';
    if (p < 0.28) return 'phaseFirstQuarter';
    if (p < 0.47) return 'phaseWaxingGibbous';
    if (p < 0.53) return 'phaseFull';
    if (p < 0.72) return 'phaseWaningGibbous';
    if (p < 0.78) return 'phaseLastQuarter';
    return 'phaseWaningCrescent';
  }
  function initMoonPhaseCalculator(card, T) {
    on(card, 'calc', function () {
      var dateStr = document.getElementById('moonDate').value;
      var d = parseISODate(dateStr);
      if (!d) { alert(T.error); return; }
      // meio-dia UTC do dia escolhido, para evitar deslocamento de fuso
      var ms = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
      var phase = moonPhaseFraction(ms);
      var illumination = round2((1 - Math.cos(2 * Math.PI * phase)) / 2 * 100);
      var nameKey = moonPhaseNameKey(phase);
      var html = '<div class="result-value">' + T[nameKey] + '</div>' +
        '<div class="result-extra">' + T.illuminationLabel + ': <strong>' + illumination + '%</strong></div>';
      showResult(card, html);
    });
  }

  // ============================================================ MODA E VESTUÁRIO

  var CLOTHING_WOMEN = [
    { br: 34, letter: 'PP', us: 2, eu: 34, uk: 6 },
    { br: 36, letter: 'P', us: 4, eu: 36, uk: 8 },
    { br: 38, letter: 'M', us: 6, eu: 38, uk: 10 },
    { br: 40, letter: 'M/G', us: 8, eu: 40, uk: 12 },
    { br: 42, letter: 'G', us: 10, eu: 42, uk: 14 },
    { br: 44, letter: 'GG', us: 12, eu: 44, uk: 16 },
    { br: 46, letter: 'GG1', us: 14, eu: 46, uk: 18 },
    { br: 48, letter: 'GG2', us: 16, eu: 48, uk: 20 },
    { br: 50, letter: 'GG3', us: 18, eu: 50, uk: 22 },
    { br: 52, letter: 'GG4', us: 20, eu: 52, uk: 24 },
  ];
  var CLOTHING_MEN = [
    { br: 36, letter: 'PP/XS', us: 'XS', eu: 44, uk: 34 },
    { br: 38, letter: 'P/S', us: 'S', eu: 46, uk: 36 },
    { br: 40, letter: 'M', us: 'M', eu: 48, uk: 38 },
    { br: 42, letter: 'M/G', us: 'M/L', eu: 50, uk: 40 },
    { br: 44, letter: 'G', us: 'L', eu: 52, uk: 42 },
    { br: 46, letter: 'GG', us: 'XL', eu: 54, uk: 44 },
    { br: 48, letter: 'GG1', us: 'XXL', eu: 56, uk: 46 },
    { br: 50, letter: 'GG2', us: 'XXL', eu: 58, uk: 48 },
    { br: 52, letter: 'GG3', us: 'XXXL', eu: 60, uk: 50 },
  ];
  function nearestByField(table, field, value) {
    var best = table[0];
    var bestDiff = Math.abs(table[0][field] - value);
    for (var i = 1; i < table.length; i++) {
      var diff = Math.abs(table[i][field] - value);
      if (diff < bestDiff) { bestDiff = diff; best = table[i]; }
    }
    return best;
  }
  // Código padrão chinês (GB/T 1335: altura/busto + tipo de corpo A) por tamanho EU.
  // Fontes: tabelas de tamanho chinês (S=155/80A ... XXL=175/96A feminino; S=165/84A ... 3XL=190/104A masculino).
  // Faixas EU de cada código (ex.: feminino M = EU 36–38): quando o tamanho cai em duas faixas, usa-se o menor. Acima do último código verificado não há código.
  var CN_CODE_WOMEN = { 34: ['S', '155/80A'], 36: ['M', '160/84A'], 38: ['M', '160/84A'], 40: ['L', '165/88A'], 42: ['XL', '170/92A'], 44: ['XXL', '175/96A'] };
  var CN_CODE_MEN = { 44: ['S', '165/84A'], 46: ['S', '165/84A'], 48: ['M', '170/88A'], 50: ['L', '175/92A'], 52: ['XL', '180/96A'], 54: ['XXL', '185/100A'], 56: ['3XL', '190/104A'] };
  var ASIAN_LETTERS = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
  function initClothingSizeConverter(card, T) {
    on(card, 'generate', function () {
      var gender = document.getElementById('sizeGender').value;
      var br = parseFloat(document.getElementById('sizeBR').value);
      if (!br || br <= 0) { showStatus(card, T.error, 'error'); return; }
      var table = gender === 'men' ? CLOTHING_MEN : CLOTHING_WOMEN;
      var m = nearestByField(table, 'br', br);
      var approx = m.br !== br ? ' <em>(' + T.approxNote.replace('{br}', m.br) + ')</em>' : '';
      var cn = (gender === 'men' ? CN_CODE_MEN : CN_CODE_WOMEN)[m.eu];
      var cnHtml;
      if (cn) {
        var idx = ASIAN_LETTERS.indexOf(cn[0]);
        var lo = ASIAN_LETTERS[Math.min(idx + 1, ASIAN_LETTERS.length - 1)];
        var hi = ASIAN_LETTERS[Math.min(idx + 2, ASIAN_LETTERS.length - 1)];
        var range = lo === hi ? lo : lo + '–' + hi;
        cnHtml = '<div class="result-extra">' + T.cnLabel + ': <strong>' + cn[1] + ' (' + cn[0] + ')</strong></div>' +
          '<div class="result-extra">' + T.marketLabel + ': <strong>' + range + '</strong></div>' +
          '<div class="result-note">' + T.cnNote + '</div>';
      } else {
        cnHtml = '<div class="result-note">' + T.cnNoData + '</div>';
      }
      showResult(card,
        '<div class="result-value">BR ' + m.br + ' / ' + m.letter + approx + '</div>' +
        '<div class="result-extra">US: <strong>' + m.us + '</strong></div>' +
        '<div class="result-extra">EU: <strong>' + m.eu + '</strong></div>' +
        '<div class="result-extra">UK: <strong>' + m.uk + '</strong></div>' +
        cnHtml +
        '<div class="result-note">' + T.note + '</div>'
      );
    });
  }

  var SHOE_WOMEN = [
    { br: 33, us: 4, eu: 34, uk: 2 }, { br: 34, us: 5, eu: 35, uk: 3 },
    { br: 35, us: 6, eu: 36, uk: 4 }, { br: 36, us: 6.5, eu: 37, uk: 4.5 },
    { br: 37, us: 7, eu: 38, uk: 5 }, { br: 38, us: 8, eu: 39, uk: 6 },
    { br: 39, us: 8.5, eu: 40, uk: 6.5 }, { br: 40, us: 9, eu: 41, uk: 7 },
    { br: 41, us: 10, eu: 42, uk: 8 },
  ];
  var SHOE_MEN = [
    { br: 38, us: 6, eu: 39, uk: 5.5 }, { br: 39, us: 7, eu: 40, uk: 6.5 },
    { br: 40, us: 7.5, eu: 41, uk: 7 }, { br: 41, us: 8.5, eu: 42, uk: 8 },
    { br: 42, us: 9, eu: 43, uk: 8.5 }, { br: 43, us: 10, eu: 44, uk: 9.5 },
    { br: 44, us: 11, eu: 45, uk: 10.5 }, { br: 45, us: 12, eu: 46, uk: 11 },
  ];
  var SHOE_KIDS = [
    { br: 16, us: 1, eu: 17 }, { br: 17, us: 2, eu: 18 }, { br: 18, us: 3, eu: 19 },
    { br: 19, us: 4, eu: 20 }, { br: 20, us: 4.5, eu: 21 }, { br: 21, us: 5.5, eu: 22 },
    { br: 22, us: 6.5, eu: 23 }, { br: 23, us: 7.5, eu: 24 }, { br: 24, us: 8.5, eu: 25 },
    { br: 25, us: 9, eu: 26 }, { br: 26, us: 10, eu: 27 }, { br: 27, us: 11, eu: 28 },
    { br: 28, us: 11.5, eu: 29 }, { br: 29, us: 12, eu: 30 }, { br: 30, us: 13, eu: 31 },
    { br: 31, us: 13.5, eu: 32 }, { br: 32, us: 1, eu: 33 }, { br: 33, us: 2, eu: 34 },
    { br: 34, us: 3, eu: 35 },
  ];
  function initShoeSizeConverter(card, T) {
    on(card, 'generate', function () {
      var cat = document.getElementById('shoeCategory').value;
      var br = parseFloat(document.getElementById('shoeBR').value);
      if (!br || br <= 0) { showStatus(card, T.error, 'error'); return; }
      var table = cat === 'men' ? SHOE_MEN : (cat === 'kids' ? SHOE_KIDS : SHOE_WOMEN);
      var m = nearestByField(table, 'br', br);
      var approx = m.br !== br ? ' <em>(' + T.approxNote.replace('{br}', m.br) + ')</em>' : '';
      var ukLine = m.uk !== undefined ? '<div class="result-extra">UK: <strong>' + m.uk + '</strong></div>' : '';
      // China: o número chinês de adulto segue a numeração EU; comprimento do pé (cm) = (CN + 10) / 2.
      var cnLine;
      if (cat === 'kids') {
        cnLine = '<div class="result-note">' + T.cnKidsNote + '</div>';
      } else {
        var foot = (m.eu + 10) / 2;
        var footTxt = (Math.round(foot * 10) / 10).toFixed(1);
        if (document.documentElement.lang.slice(0, 2) !== 'en') footTxt = footTxt.replace('.', ',');
        cnLine = '<div class="result-extra">' + T.cnLabel + ': <strong>' + m.eu + '</strong> · ' + T.footLabel + ': <strong>' + footTxt + ' cm (' + Math.round(foot * 10) + ' mm)</strong></div>' +
          '<div class="result-note">' + T.cnNote + '</div>';
      }
      showResult(card,
        '<div class="result-value">BR ' + m.br + approx + '</div>' +
        '<div class="result-extra">US: <strong>' + m.us + '</strong></div>' +
        '<div class="result-extra">EU: <strong>' + m.eu + '</strong></div>' +
        ukLine +
        cnLine +
        '<div class="result-note">' + T.note + '</div>'
      );
    });
  }

  var RING_TABLE = [
    { c: 44.3, br: 8, us: 3.5 }, { c: 45.5, br: 9, us: 4 }, { c: 46.8, br: 10, us: 4.5 },
    { c: 48.0, br: 11, us: 5 }, { c: 49.3, br: 12, us: 5.5 }, { c: 50.6, br: 13, us: 6 },
    { c: 51.9, br: 14, us: 6.5 }, { c: 53.1, br: 15, us: 7 }, { c: 54.4, br: 16, us: 7.5 },
    { c: 55.7, br: 17, us: 8 }, { c: 56.9, br: 18, us: 8.5 }, { c: 58.2, br: 19, us: 9 },
    { c: 59.5, br: 20, us: 9.5 }, { c: 60.7, br: 21, us: 10 }, { c: 62.0, br: 22, us: 10.5 },
    { c: 63.5, br: 23, us: 11 }, { c: 64.7, br: 24, us: 11.5 }, { c: 66.0, br: 25, us: 12 },
    { c: 67.2, br: 26, us: 12.5 }, { c: 68.5, br: 27, us: 13 },
  ];
  function initRingSizeCalculator(card, T) {
    on(card, 'generate', function () {
      var d = parseFloat(document.getElementById('ringDiameter').value);
      var c = parseFloat(document.getElementById('ringCircumference').value);
      if ((!d || d <= 0) && (!c || c <= 0)) { showStatus(card, T.error, 'error'); return; }
      if (!c || c <= 0) c = d * Math.PI;
      if (!d || d <= 0) d = c / Math.PI;
      var m = nearestByField(RING_TABLE, 'c', c);
      showResult(card,
        '<div class="result-extra">' + T.diameterLabel + ': <strong>' + fmtNum(d, card.dataset.lang, 1) + ' mm</strong></div>' +
        '<div class="result-extra">' + T.circumferenceLabel + ': <strong>' + fmtNum(c, card.dataset.lang, 1) + ' mm</strong></div>' +
        '<div class="result-value">BR: ' + m.br + '</div>' +
        '<div class="result-extra">US: <strong>' + m.us + '</strong></div>' +
        '<div class="result-extra">EU: <strong>' + Math.round(c) + '</strong></div>' +
        '<div class="result-note">' + T.note + '</div>'
      );
    });
  }

  function initBraSizeCalculator(card, T) {
    on(card, 'generate', function () {
      var bust = parseFloat(document.getElementById('bustCm').value);
      var underbust = parseFloat(document.getElementById('underbustCm').value);
      if (!bust || !underbust || bust <= underbust || underbust <= 0) { showStatus(card, T.error, 'error'); return; }
      var bandEU = Math.round(underbust / 5) * 5;
      var underbustIn = Math.round(underbust / 2.54);
      var bandUS = underbustIn % 2 === 0 ? underbustIn + 4 : underbustIn + 5;
      var diff = bust - underbust;
      var cupTable = [
        [0, 11, 'AA'], [11, 13, 'A'], [13, 15, 'B'], [15, 17, 'C'], [17, 19, 'D'],
        [19, 21, 'DD/E'], [21, 23, 'F'], [23, 25, 'G'], [25, 27, 'H'], [27, 29, 'I'], [29, 200, 'J+'],
      ];
      var cup = 'AA';
      for (var i = 0; i < cupTable.length; i++) {
        if (diff >= cupTable[i][0] && diff < cupTable[i][1]) { cup = cupTable[i][2]; break; }
      }
      showResult(card,
        '<div class="result-value">' + T.resultBR + ': ' + bandEU + cup + '</div>' +
        '<div class="result-extra">' + T.resultUS + ': <strong>' + bandUS + cup + '</strong></div>' +
        '<div class="result-note">' + T.note + '</div>'
      );
    });
  }

  // ============================================================ VIAGEM

  function initTravelBudgetCalculator(card, T) {
    on(card, 'generate', function () {
      var lang = card.dataset.lang;
      var days = parseFloat(document.getElementById('tripDays').value);
      var lodging = parseFloat(document.getElementById('dailyLodging').value) || 0;
      var food = parseFloat(document.getElementById('dailyFood').value) || 0;
      var transport = parseFloat(document.getElementById('dailyLocalTransport').value) || 0;
      var flight = parseFloat(document.getElementById('flightCost').value) || 0;
      var extras = parseFloat(document.getElementById('extrasCost').value) || 0;
      var people = parseInt(document.getElementById('numPeople').value, 10) || 1;
      if (!days || days <= 0 || people < 1) { showStatus(card, T.error, 'error'); return; }
      var dailyTotal = lodging + food + transport;
      var perPerson = round2(dailyTotal * days + flight + extras);
      var group = round2(perPerson * people);
      showResult(card,
        '<div class="result-extra">' + T.dailyTotalLabel + ': <strong>' + fmtNum(dailyTotal, lang) + '</strong></div>' +
        '<div class="result-extra">' + T.perPersonTotalLabel + ': <strong>' + fmtNum(perPerson, lang) + '</strong></div>' +
        '<div class="result-value">' + T.groupTotalLabel + ': ' + fmtNum(group, lang) + '</div>'
      );
    });
  }

  function initMilesValueCalculator(card, T) {
    on(card, 'generate', function () {
      var lang = card.dataset.lang;
      var miles = parseFloat(document.getElementById('milesQty').value);
      var paid = parseFloat(document.getElementById('amountPaid').value) || 0;
      var flightMiles = parseFloat(document.getElementById('flightMilesNeeded').value) || 0;
      var flightCash = parseFloat(document.getElementById('flightCashPrice').value) || 0;
      var flightTaxes = parseFloat(document.getElementById('flightTaxes').value) || 0;
      if (!miles || miles <= 0) { showStatus(card, T.error, 'error'); return; }
      var html = '';
      var cpmPaid = null;
      if (paid > 0) {
        cpmPaid = round2((paid / miles) * 1000);
        html += '<div class="result-extra">' + T.cpmPaidLabel + ': <strong>' + fmtNum(cpmPaid, lang) + '</strong></div>';
      }
      if (flightMiles > 0 && flightCash > 0) {
        var savings = flightCash - flightTaxes;
        var cpmRedemption = round2((savings / flightMiles) * 1000);
        html += '<div class="result-value">' + T.cpmRedemptionLabel + ': ' + fmtNum(cpmRedemption, lang) + '</div>';
        var reference = cpmPaid !== null ? cpmPaid : 25;
        if (cpmRedemption > reference) html += '<div class="result-extra">' + T.verdictGood + '</div>';
        else html += '<div class="result-extra">' + T.verdictBad + '</div>';
      }
      if (html === '') { showStatus(card, T.error, 'error'); return; }
      html += '<div class="result-note">' + T.referenceNote + '</div>';
      showResult(card, html);
    });
  }

  function initTripGroupSplit(card, T) {
    on(card, 'generate', function () {
      var lang = card.dataset.lang;
      var expensesRaw = document.getElementById('tripExpenses').value.split('\n');
      var people = parseInt(document.getElementById('tripPeopleCount').value, 10);
      var paymentsRaw = document.getElementById('tripPayments').value.split('\n');
      if (!people || people < 1) { showStatus(card, T.error, 'error'); return; }
      var total = 0;
      expensesRaw.forEach(function (line) {
        var parts = line.split(';');
        var v = parseFloat((parts[parts.length - 1] || '').replace(',', '.'));
        if (!isNaN(v)) total += v;
      });
      if (total <= 0) { showStatus(card, T.noExpenses, 'error'); return; }
      var share = round2(total / people);
      var html = '<div class="result-extra">' + T.totalLabel + ': <strong>' + fmtNum(total, lang) + '</strong></div>' +
        '<div class="result-value">' + T.shareLabel + ': ' + fmtNum(share, lang) + '</div>';
      var payments = [];
      paymentsRaw.forEach(function (line) {
        var parts = line.split(';');
        if (parts.length < 2) return;
        var name = parts[0].trim();
        var v = parseFloat(parts[1].replace(',', '.'));
        if (name && !isNaN(v)) payments.push({ name: name, paid: v });
      });
      if (payments.length > 0) {
        html += '<div class="result-extra"><strong>' + T.perPersonHeader + '</strong></div>';
        payments.forEach(function (p) {
          var balance = round2(p.paid - share);
          var label = balance > 0.005 ? T.balanceOwed : (balance < -0.005 ? T.balanceOwes : T.balanceEven);
          html += '<div class="result-extra">' + escHtml(p.name) + ': ' + fmtNum(Math.abs(balance), lang) + ' (' + label + ')</div>';
        });
      }
      showResult(card, html);
    });
  }

  // ============================================================ CASAMENTO E EVENTOS

  function initWeddingBudgetCalculator(card, T) {
    on(card, 'generate', function () {
      var lang = card.dataset.lang;
      var guests = parseFloat(document.getElementById('guestCount').value);
      var perGuest = parseFloat(document.getElementById('perGuestCost').value);
      var decor = parseFloat(document.getElementById('decorCost').value) || 0;
      var photo = parseFloat(document.getElementById('photoCost').value) || 0;
      var music = parseFloat(document.getElementById('musicCost').value) || 0;
      var attire = parseFloat(document.getElementById('attireCost').value) || 0;
      var ceremony = parseFloat(document.getElementById('ceremonyCost').value) || 0;
      var favors = parseFloat(document.getElementById('favorsCost').value) || 0;
      var extras = parseFloat(document.getElementById('extrasCost2').value) || 0;
      if (!guests || guests <= 0 || !perGuest || perGuest <= 0) { showStatus(card, T.error, 'error'); return; }
      var buffet = round2(guests * perGuest);
      var others = decor + photo + music + attire + ceremony + favors + extras;
      var total = round2(buffet + others);
      var html = '<div class="result-extra">' + T.buffetLabel + ': <strong>' + fmtNum(buffet, lang) + '</strong></div>' +
        '<div class="result-value">' + T.totalLabel + ': ' + fmtNum(total, lang) + '</div>' +
        '<div class="result-extra"><strong>' + T.breakdownTitle + '</strong></div>' +
        '<div class="result-extra">' + T.refBuffet + ': ' + fmtNum(round2(total * 0.40), lang) + '</div>' +
        '<div class="result-extra">' + T.refDecor + ': ' + fmtNum(round2(total * 0.15), lang) + '</div>' +
        '<div class="result-extra">' + T.refPhoto + ': ' + fmtNum(round2(total * 0.10), lang) + '</div>' +
        '<div class="result-extra">' + T.refMusic + ': ' + fmtNum(round2(total * 0.10), lang) + '</div>' +
        '<div class="result-extra">' + T.refAttire + ': ' + fmtNum(round2(total * 0.10), lang) + '</div>' +
        '<div class="result-extra">' + T.refOther + ': ' + fmtNum(round2(total * 0.15), lang) + '</div>' +
        '<div class="result-note">' + T.refNote + '</div>';
      showResult(card, html);
    });
  }

  function initEventFoodDrinkCalculator(card, T) {
    on(card, 'generate', function () {
      var lang = card.dataset.lang;
      var guests = parseFloat(document.getElementById('eventGuests').value);
      var hours = parseFloat(document.getElementById('eventHours').value);
      var alcohol = document.getElementById('alcoholService').checked;
      if (!guests || guests <= 0 || !hours || hours <= 0) { showStatus(card, T.error, 'error'); return; }
      var nonAlc = round2(guests * hours * 0.25);
      var alc = alcohol ? round2(guests * hours * 0.3) : 0;
      var food = round2(guests * (0.35 + Math.max(0, hours - 4) * 0.05));
      var html = '<div class="result-extra">' + T.nonAlcLabel + ': <strong>' + fmtNum(nonAlc, lang) + ' L</strong></div>';
      if (alcohol) html += '<div class="result-extra">' + T.alcLabel + ': <strong>' + fmtNum(alc, lang) + ' L</strong></div>';
      html += '<div class="result-value">' + T.foodLabel + ': ' + fmtNum(food, lang) + ' kg</div>' +
        '<div class="result-note">' + T.note + '</div>';
      showResult(card, html);
    });
  }

  var ANNIV_TABLE = {
    1: 'Papel', 2: 'Algodão', 3: 'Trigo / Couro', 4: 'Flores / Frutas', 5: 'Madeira',
    6: 'Açúcar / Perfume', 7: 'Lã / Latão', 8: 'Barro / Papoula', 9: 'Cerâmica / Vime', 10: 'Estanho / Zinco',
    11: 'Aço', 12: 'Seda / Ligas', 13: 'Linho / Renda', 14: 'Marfim (Ágata)', 15: 'Cristal',
    16: 'Safira Amarela', 17: 'Rosa', 18: 'Turquesa', 19: 'Cretone / Água-marinha', 20: 'Porcelana',
    21: 'Opala', 22: 'Bronze', 23: 'Crisópio / Veludo', 24: 'Oportunidade / Acetinado', 25: 'Prata',
    26: 'Alexandrita', 27: 'Acaju', 28: 'Nickel', 29: 'Veludo', 30: 'Pérola / Novos Votos',
    31: 'Basílio', 32: 'Pinho', 33: 'Ametista / Ilusão', 34: 'Âmbar', 35: 'Coral',
    36: 'Cádmio', 37: 'Aventurina', 38: 'Carvalho', 39: 'Crepe', 40: 'Esmeralda / Rubi',
    41: 'Terracota', 42: 'Prata Negra', 43: 'Zafira', 44: 'Titânio', 45: 'Rubi',
    46: 'Alabastro', 47: 'Cachemira', 48: 'Berilo', 49: 'Zafira Azul', 50: 'Ouro',
    55: 'Esmeralda', 60: 'Diamante', 65: 'Ouro Azul', 70: 'Platina', 75: 'Brilhante / Coroa',
  };
  function initWeddingAnniversaryCalculator(card, T) {
    on(card, 'generate', function () {
      var lang = card.dataset.lang;
      var d = parseISODate(document.getElementById('weddingDate').value);
      if (!d) { showStatus(card, T.error, 'error'); return; }
      var years = anosCompletosEntre(d, new Date());
      if (years < 1) { showResult(card, '<div class="result-value">' + T.notYetMarried + '</div>'); return; }
      var html = '<div class="result-value">' + T.resultYears.replace('{years}', years) + '</div>';
      if (ANNIV_TABLE[years]) {
        html += '<div class="result-extra">' + T.resultName + ': <strong>' + T.annivPrefix + ' ' + ANNIV_TABLE[years] + '</strong></div>';
      } else {
        var milestones = Object.keys(ANNIV_TABLE).map(Number).sort(function (a, b) { return a - b; });
        var lower = milestones.filter(function (m) { return m <= years; }).pop();
        if (lower) {
          html += '<div class="result-note">' + T.fallbackNote.replace('{lower}', lower).replace('{name}', ANNIV_TABLE[lower]) + '</div>';
        } else {
          html += '<div class="result-note">' + T.beyondNote + '</div>';
        }
      }
      showResult(card, html);
    });
  }

  // ============================================================ SALÁRIO MÍNIMO
  var MIN_WAGE_TABLE = {
    2020: 1045.00, 2021: 1100.00, 2022: 1212.00, 2023: 1320.00,
    2024: 1412.00, 2025: 1518.00, 2026: 1621.00,
  };
  function initMinWageMultipleCalculator(card, T) {
    on(card, 'generate', function () {
      var multiple = parseFloat(document.getElementById('minWageMultiple').value);
      var year = parseInt(document.getElementById('minWageYear').value, 10);
      if (!multiple || multiple <= 0 || !MIN_WAGE_TABLE[year]) { showStatus(card, T.error, 'error'); return; }
      var value = round2(multiple * MIN_WAGE_TABLE[year]);
      showResult(card,
        '<div class="result-value">' + T.resultLabel + ': ' + fmtBRL(value) + '</div>' +
        '<div class="result-note">' + T.note + '</div>'
      );
    });
  }

  // ---------------------------------------------------------- READABILITY INDEX
  // Heuristic vowel-group syllable counters per language (approximation, not
  // phonetically exact — see the tool's own FAQ for the honesty disclaimer).
  function ridCountWords(text) {
    var t = text.trim();
    return t ? t.split(/\s+/).length : 0;
  }
  function ridCountSentences(text) {
    var parts = text.split(/[.!?]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    return Math.max(1, parts.length);
  }
  function ridSyllablesEN(word) {
    var w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return 0;
    var vowels = 'aeiouy';
    var count = 0, prevIsVowel = false;
    for (var i = 0; i < w.length; i++) {
      var isVowel = vowels.indexOf(w[i]) !== -1;
      if (isVowel && !prevIsVowel) count++;
      prevIsVowel = isVowel;
    }
    if (w.length > 2 && w.slice(-1) === 'e' && w.slice(-2) !== 'le' && vowels.indexOf(w[w.length - 2]) === -1) count--;
    return count > 0 ? count : 1;
  }
  function ridCountVowelGroups(chars, isVowel, isDiphthong) {
    var count = 0, i = 0, n = chars.length;
    while (i < n) {
      if (!isVowel(chars[i])) { i++; continue; }
      count++;
      var last = chars[i], merged = 1, j = i + 1;
      while (j < n && isVowel(chars[j]) && merged < 2 && isDiphthong(last, chars[j])) {
        last = chars[j]; merged++; j++;
      }
      i = j;
    }
    return count > 0 ? count : 1;
  }
  function ridSyllablesPT(word) {
    var w = word.toLowerCase().normalize('NFC').replace(/[^a-zàáâãéêíóôõúü]/g, '');
    if (!w) return 0;
    var strong = 'aeoàáâãéêóôõ', weak = 'iu', accentedWeak = 'íú';
    var vowels = strong + weak + accentedWeak + 'ü';
    var isVowel = function (c) { return vowels.indexOf(c) !== -1; };
    var isDiphthong = function (a, b) {
      var pair = a + b;
      if (['ão', 'ãe', 'õe', 'ai', 'au'].indexOf(pair) !== -1) return true;
      if (accentedWeak.indexOf(a) !== -1 || accentedWeak.indexOf(b) !== -1) return false;
      if (strong.indexOf(a) !== -1 && strong.indexOf(b) !== -1) return false;
      return true;
    };
    return ridCountVowelGroups(w.split(''), isVowel, isDiphthong);
  }
  function ridSyllablesES(word) {
    var w = word.toLowerCase().normalize('NFC').replace(/[^a-záéíóúü]/g, '');
    if (!w) return 0;
    var strong = 'aeoáéó', weak = 'iuü', accentedWeak = 'íú';
    var vowels = strong + weak + accentedWeak;
    var isVowel = function (c) { return vowels.indexOf(c) !== -1; };
    var isDiphthong = function (a, b) {
      if (accentedWeak.indexOf(a) !== -1 || accentedWeak.indexOf(b) !== -1) return false;
      if (strong.indexOf(a) !== -1 && strong.indexOf(b) !== -1) return false;
      return true;
    };
    return ridCountVowelGroups(w.split(''), isVowel, isDiphthong);
  }
  function initReadabilityIndex(card, T) {
    var input = card.querySelector('[data-role="input"]');
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var texto = input.value;
      if (!texto || !texto.trim()) { alert(T.error); return; }
      var words = ridCountWords(texto);
      var sentences = ridCountSentences(texto);
      var wordList = texto.trim().split(/\s+/);
      var syllableFn = lang === 'pt' ? ridSyllablesPT : (lang === 'es' ? ridSyllablesES : ridSyllablesEN);
      var syllables = 0;
      wordList.forEach(function (w) {
        var clean = w.replace(/[^\p{L}]/gu, '');
        if (clean) syllables += syllableFn(clean);
      });
      if (!words || !syllables) { alert(T.error); return; }
      var wps = words / sentences;
      var spw = syllables / words;
      var score, gradeHtml = '';
      if (lang === 'en') {
        score = 206.835 - 1.015 * wps - 84.6 * spw;
        var grade = 0.39 * wps + 11.8 * spw - 15.59;
        gradeHtml = '<div class="result-extra">' + T.gradeLabel + ': <strong>' + grade.toFixed(1) + '</strong></div>';
      } else if (lang === 'pt') {
        score = 226.614882 - 1.036134 * wps - 72.451284 * spw;
      } else {
        var P = 100 * syllables / words;
        var F = 100 * sentences / words;
        score = 206.84 - 0.60 * P - 1.02 * F;
      }
      var bandIdx;
      if (score >= 90) bandIdx = 0;
      else if (score >= 80) bandIdx = 1;
      else if (score >= 70) bandIdx = 2;
      else if (score >= 60) bandIdx = 3;
      else if (score >= 50) bandIdx = 4;
      else if (score >= 30) bandIdx = 5;
      else bandIdx = 6;
      var bandLabel = (T.bands && T.bands[bandIdx]) || '';
      var html = '<div class="result-value">' + T.scoreLabel + ': ' + score.toFixed(1) + '</div>' +
        '<div class="result-extra readability-band">' + escHtml(bandLabel) + '</div>' +
        gradeHtml +
        '<div class="result-extra">' + T.wordsLabel + ': <strong>' + words.toLocaleString(localeFor(lang)) + '</strong></div>' +
        '<div class="result-extra">' + T.sentencesLabel + ': <strong>' + sentences.toLocaleString(localeFor(lang)) + '</strong></div>' +
        '<div class="result-extra">' + T.syllablesLabel + ': <strong>' + syllables.toLocaleString(localeFor(lang)) + '</strong></div>' +
        '<div class="result-note">' + T.heuristicNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- SPEAKING TIME CALCULATOR
  function initSpeakingTimeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var texto = document.getElementById('speakingText').value;
      var pace = document.getElementById('speakingPace').value;
      if (!texto || !texto.trim()) { alert(T.error); return; }
      var words = texto.trim().split(/\s+/).length;
      var rates = { slow: 110, normal: 140, fast: 170 };
      var wpm = rates[pace] || rates.normal;
      var seconds = Math.round((words / wpm) * 60);
      var mm = Math.floor(seconds / 60);
      var ss = seconds % 60;
      var timeStr = mm + ':' + (ss < 10 ? '0' : '') + ss;
      var html = '<div class="result-value">' + T.speakingTimeLabel + ': ' + timeStr + '</div>' +
        '<div class="result-extra">' + T.wordCountLabel + ': <strong>' + words.toLocaleString(localeFor(lang)) + '</strong></div>' +
        '<div class="result-extra">' + T.paceRateLabel + ': <strong>' + wpm + ' ' + T.wpmUnit + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- TYPING SPEED TEST
  function initTypingSpeedTest(card, T) {
    var sampleEl = card.querySelector('[data-role="sample"]');
    var input = card.querySelector('[data-role="typingInput"]');
    var timeEl = card.querySelector('[data-role="typingTime"]');
    var wpmEl = card.querySelector('[data-role="typingWpm"]');
    var accEl = card.querySelector('[data-role="typingAccuracy"]');
    var sample = T.sampleText || '';
    var startTime = null;
    var timerInterval = null;
    var finished = false;

    function formatTime(secs) {
      var s = Math.floor(secs);
      var m = Math.floor(s / 60);
      var r = s % 60;
      return m + ':' + (r < 10 ? '0' : '') + r;
    }
    function renderSample(typed) {
      var html = '';
      for (var i = 0; i < sample.length; i++) {
        var ch = escHtml(sample[i]);
        if (i < typed.length) {
          html += '<span class="' + (typed[i] === sample[i] ? 'ty-ok' : 'ty-err') + '">' + ch + '</span>';
        } else if (i === typed.length) {
          html += '<span class="ty-cursor">' + ch + '</span>';
        } else {
          html += '<span>' + ch + '</span>';
        }
      }
      sampleEl.innerHTML = html;
    }
    function elapsedSeconds() {
      return startTime ? (Date.now() - startTime) / 1000 : 0;
    }
    function updateLiveStats() {
      var typed = input.value;
      var secs = elapsedSeconds();
      timeEl.textContent = formatTime(secs);
      var words = typed.length / 5; // typing-test convention: 1 word = 5 characters
      var minutes = secs / 60;
      var wpm = minutes > 0 ? Math.round(words / minutes) : 0;
      wpmEl.textContent = String(wpm);
      var correct = 0;
      var n = Math.min(typed.length, sample.length);
      for (var i = 0; i < n; i++) if (typed[i] === sample[i]) correct++;
      var acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
      accEl.textContent = acc + '%';
      return { wpm: wpm, acc: acc, secs: secs };
    }
    function finish() {
      finished = true;
      input.disabled = true;
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      var stats = updateLiveStats();
      var html = '<div class="result-value">' + T.wpmLabel + ': ' + stats.wpm + '</div>' +
        '<div class="result-extra">' + T.accuracyLabel + ': <strong>' + stats.acc + '%</strong></div>' +
        '<div class="result-extra">' + T.timeLabel + ': <strong>' + formatTime(stats.secs) + '</strong></div>';
      showResult(card, html);
    }
    function reset() {
      finished = false;
      startTime = null;
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      input.disabled = false;
      input.value = '';
      timeEl.textContent = '0:00';
      wpmEl.textContent = '0';
      accEl.textContent = '100%';
      renderSample('');
      var resBox = card.querySelector('[data-role="result"]');
      if (resBox) resBox.classList.remove('show');
      input.focus();
    }
    input.addEventListener('input', function () {
      if (finished) return;
      if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateLiveStats, 500);
      }
      var typed = input.value;
      renderSample(typed);
      updateLiveStats();
      if (typed.length >= sample.length) finish();
    });
    on(card, 'restart', reset);
    renderSample('');
  }

  // ---------------------------------------------------------- SOCIAL MEDIA CHARACTER COUNTER
  function initSocialCharCounter(card, T) {
    var input = card.querySelector('[data-role="input"]');
    var platforms = [
      { key: 'x', limit: 280 },
      { key: 'instagramCaption', limit: 2200 },
      { key: 'instagramBio', limit: 150 },
      { key: 'facebook', limit: 63206 },
      { key: 'linkedin', limit: 3000 },
      { key: 'youtubeTitle', limit: 100 },
      { key: 'tiktok', limit: 2200 },
      { key: 'metaDescription', limit: 160 }
    ];
    function render() {
      var lang = card.dataset.lang;
      var len = input.value.length;
      var html = '<div class="result-value">' + T.charCountLabel + ': ' + len.toLocaleString(localeFor(lang)) + '</div>';
      html += '<div class="platform-counter-list">';
      platforms.forEach(function (p) {
        var pct = Math.max(0, Math.min(100, Math.round((len / p.limit) * 100)));
        var over = len > p.limit;
        var label = (T.platforms && T.platforms[p.key]) || p.key;
        html += '<div class="platform-counter-row">' +
          '<div class="platform-counter-label"><span>' + escHtml(label) + '</span>' +
          '<span class="' + (over ? 'ty-err-text' : '') + '">' + len.toLocaleString(localeFor(lang)) + ' / ' + p.limit.toLocaleString(localeFor(lang)) + '</span></div>' +
          '<div class="progress-bar-track show"><div class="progress-bar-fill" style="width:' + pct + '%;' + (over ? 'background:var(--err)' : '') + '"></div></div>' +
          (over ? '<div class="platform-over-note">' + T.overLimitNote + '</div>' : '') +
          '</div>';
      });
      html += '</div>';
      if (T.metaDescriptionNote) html += '<div class="result-note">' + T.metaDescriptionNote + '</div>';
      showResult(card, html);
    }
    on(card, 'calc', render);
    input.addEventListener('input', render);
    render();
  }

  // ---------------------------------------------------------- FOTOGRAFIA: helpers
  var SENSOR_COC = { fullFrame: 0.030, apscCanon: 0.019, apscNikonSony: 0.020, mft: 0.015, oneInch: 0.011, smartphone: 0.005 };
  var SENSOR_DIMS = {
    fullFrame: [36, 24], apscCanon: [22.3, 14.9], apscNikonSony: [23.5, 15.6],
    mft: [17.3, 13], oneInch: [13.2, 8.8], smartphone: [6.17, 4.55]
  };
  function sensorDiagonal(sensor) {
    var d = SENSOR_DIMS[sensor] || SENSOR_DIMS.fullFrame;
    return Math.sqrt(d[0] * d[0] + d[1] * d[1]);
  }
  function formatMetersFeet(m, lang) {
    var ft = m * 3.28084;
    return fmtNum(m, lang, 2) + ' m (' + fmtNum(ft, lang, 2) + ' ft)';
  }
  // Formats a duration in seconds as a readable exposure: "1/125s" style when < 1s,
  // "Xs" for a few seconds, "Xm Ys" when over a minute.
  function formatExposureTime(sec) {
    if (!isFinite(sec) || sec <= 0) return '-';
    if (sec < 1) {
      var denom = Math.round(1 / sec);
      return '1/' + denom + 's';
    }
    if (sec < 60) {
      return (Math.round(sec * 10) / 10) + 's';
    }
    var totalSec = Math.round(sec);
    var mm = Math.floor(totalSec / 60);
    var ss = totalSec % 60;
    return mm + 'm ' + ss + 's';
  }
  function formatShutterFraction(sec) {
    if (!isFinite(sec) || sec <= 0) return '-';
    if (sec >= 1) return (Math.round(sec * 10) / 10) + 's';
    var denom = Math.round(1 / sec);
    return '1/' + denom + 's';
  }

  // ---------------------------------------------------------- DEPTH OF FIELD CALCULATOR
  function initDepthOfFieldCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var f = parseFloat(document.getElementById('dofFocalLength').value);
      var n = parseFloat(document.getElementById('dofAperture').value);
      var sM = parseFloat(document.getElementById('dofDistance').value);
      var sensor = document.getElementById('dofSensor').value;
      if (!f || f <= 0 || !n || n <= 0 || !sM || sM <= 0) { alert(T.error); return; }
      var c = SENSOR_COC[sensor] || SENSOR_COC.fullFrame;
      var sMm = sM * 1000;
      var hMm = (f * f) / (n * c) + f;
      var dnMm = (hMm * sMm) / (hMm + (sMm - f));
      var dfMm, dfInfinite = false;
      if (sMm < hMm) {
        dfMm = (hMm * sMm) / (hMm - (sMm - f));
      } else {
        dfInfinite = true;
      }
      var nearM = dnMm / 1000;
      var farM = dfInfinite ? Infinity : dfMm / 1000;
      var totalM = dfInfinite ? Infinity : (dfMm - dnMm) / 1000;
      var hyperM = hMm / 1000;
      var farText = dfInfinite ? T.infinitySymbol : fmtNum(farM, lang, 2) + ' m';
      var totalText = dfInfinite ? T.infinitySymbol : fmtNum(totalM, lang, 2) + ' m';
      var html =
        '<div class="result-value">' + T.hyperfocalLabel + ': ' + fmtNum(hyperM, lang, 2) + ' m</div>' +
        '<div class="result-extra">' + T.nearLimitLabel + ': <strong>' + fmtNum(nearM, lang, 2) + ' m</strong></div>' +
        '<div class="result-extra">' + T.farLimitLabel + ': <strong>' + farText + '</strong></div>' +
        '<div class="result-extra">' + T.totalDofLabel + ': <strong>' + totalText + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- HYPERFOCAL DISTANCE CALCULATOR
  function initHyperfocalDistanceCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var f = parseFloat(document.getElementById('hyperFocalLength').value);
      var n = parseFloat(document.getElementById('hyperAperture').value);
      var sensor = document.getElementById('hyperSensor').value;
      if (!f || f <= 0 || !n || n <= 0) { alert(T.error); return; }
      var c = SENSOR_COC[sensor] || SENSOR_COC.fullFrame;
      var hMm = (f * f) / (n * c) + f;
      var hM = hMm / 1000;
      var halfM = hM / 2;
      var html =
        '<div class="result-value">' + T.hyperfocalLabel + ': ' + formatMetersFeet(hM, lang) + '</div>' +
        '<div class="result-extra">' + T.sharpFromLabel + ': <strong>' + fmtNum(halfM, lang, 2) + ' m &rarr; &infin;</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- FIELD OF VIEW CALCULATOR
  function initFieldOfViewCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var f = parseFloat(document.getElementById('fovFocalLength').value);
      var sensor = document.getElementById('fovSensor').value;
      var distance = parseFloat(document.getElementById('fovDistance').value);
      if (!f || f <= 0) { alert(T.error); return; }
      var d = SENSOR_DIMS[sensor] || SENSOR_DIMS.fullFrame;
      var w = d[0], h = d[1];
      var diag = Math.sqrt(w * w + h * h);
      var hAngleRad = 2 * Math.atan(w / (2 * f));
      var vAngleRad = 2 * Math.atan(h / (2 * f));
      var dAngleRad = 2 * Math.atan(diag / (2 * f));
      var hAngle = hAngleRad * 180 / Math.PI;
      var vAngle = vAngleRad * 180 / Math.PI;
      var dAngle = dAngleRad * 180 / Math.PI;
      var html =
        '<div class="result-value">' + T.horizontalAngleLabel + ': ' + fmtNum(hAngle, lang, 1) + '&deg;</div>' +
        '<div class="result-extra">' + T.verticalAngleLabel + ': <strong>' + fmtNum(vAngle, lang, 1) + '&deg;</strong></div>' +
        '<div class="result-extra">' + T.diagonalAngleLabel + ': <strong>' + fmtNum(dAngle, lang, 1) + '&deg;</strong></div>';
      if (distance && distance > 0) {
        var frameW = 2 * distance * Math.tan(hAngleRad / 2);
        var frameH = 2 * distance * Math.tan(vAngleRad / 2);
        html += '<div class="result-extra">' + T.frameSizeLabel + ': <strong>' + fmtNum(frameW, lang, 2) + ' x ' + fmtNum(frameH, lang, 2) + ' m</strong></div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CROP FACTOR CALCULATOR
  function initCropFactorCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var sensor = document.getElementById('cropSensor').value;
      var f = parseFloat(document.getElementById('cropFocalLength').value);
      var aperture = parseFloat(document.getElementById('cropAperture').value);
      if (!f || f <= 0) { alert(T.error); return; }
      var diag = sensorDiagonal(sensor);
      var cropFactor = 43.27 / diag;
      var equivFocal = f * cropFactor;
      var html =
        '<div class="result-value">' + T.cropFactorLabel + ': ' + fmtNum(cropFactor, lang, 2) + 'x</div>' +
        '<div class="result-extra">' + T.equivFocalLabel + ': <strong>' + fmtNum(equivFocal, lang, 0) + ' mm</strong></div>';
      if (aperture && aperture > 0) {
        var equivAperture = aperture * cropFactor;
        html += '<div class="result-extra">' + T.equivApertureLabel + ': <strong>f/' + fmtNum(equivAperture, lang, 1) + '</strong></div>' +
          '<div class="result-note">' + T.equivApertureNote + '</div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- FLASH GUIDE NUMBER CALCULATOR
  function initFlashGuideNumberCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var mode = document.getElementById('flashMode').value;
      var gn100 = parseFloat(document.getElementById('flashGuideNumber').value);
      var distance = parseFloat(document.getElementById('flashDistance').value);
      var aperture = parseFloat(document.getElementById('flashAperture').value);
      var iso = parseFloat(document.getElementById('flashIso').value) || 100;
      if (!gn100 || gn100 <= 0 || iso <= 0) { alert(T.error); return; }
      var effectiveGn = gn100 * Math.sqrt(iso / 100);
      var html = '';
      if (mode === 'findAperture') {
        if (!distance || distance <= 0) { alert(T.error); return; }
        var apertureResult = effectiveGn / distance;
        html = '<div class="result-value">' + T.apertureResultLabel + ': f/' + fmtNum(apertureResult, lang, 1) + '</div>';
      } else if (mode === 'findDistance') {
        if (!aperture || aperture <= 0) { alert(T.error); return; }
        var distanceResult = effectiveGn / aperture;
        html = '<div class="result-value">' + T.distanceResultLabel + ': ' + fmtNum(distanceResult, lang, 2) + ' m</div>';
      } else {
        if (!aperture || aperture <= 0 || !distance || distance <= 0) { alert(T.error); return; }
        var gnAtIso = aperture * distance;
        var gnAt100 = gnAtIso / Math.sqrt(iso / 100);
        html = '<div class="result-value">' + T.guideNumberResultLabel + ': ' + fmtNum(gnAt100, lang, 1) + ' (ISO 100)</div>';
      }
      html += '<div class="result-extra">' + T.effectiveGnLabel + ': <strong>' + fmtNum(effectiveGn, lang, 1) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- ND FILTER CALCULATOR
  var ND_FACTORS = { nd2: 2, nd4: 4, nd8: 8, nd16: 16, nd32: 32, nd64: 64, nd100: 100, nd400: 400, nd1000: 1000, nd32000: 32000 };
  function initNdFilterCalculator(card, T) {
    on(card, 'calc', function () {
      var original = parseFloat(document.getElementById('ndShutterSpeed').value);
      var ndKey = document.getElementById('ndFilterFactor').value;
      if (!original || original <= 0) { alert(T.error); return; }
      var factor = ND_FACTORS[ndKey] || 8;
      var stops = Math.log2(factor);
      var newShutter = original * Math.pow(2, stops);
      var html =
        '<div class="result-value">' + T.newShutterLabel + ': ' + formatExposureTime(newShutter) + '</div>' +
        '<div class="result-extra">' + T.stopsLabel + ': <strong>' + fmtNum(stops, card.dataset.lang, stops % 1 === 0 ? 0 : 2) + '</strong></div>' +
        '<div class="result-extra">' + T.exactSecondsLabel + ': <strong>' + fmtNum(newShutter, card.dataset.lang, 2) + ' s</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- EQUIVALENT EXPOSURE CALCULATOR
  function initEquivalentExposureCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var origIso = parseFloat(document.getElementById('eqOriginalIso').value);
      var origAperture = parseFloat(document.getElementById('eqOriginalAperture').value);
      var origShutter = parseFloat(document.getElementById('eqOriginalShutter').value);
      var changedField = document.getElementById('eqChangedField').value;
      var newValue = parseFloat(document.getElementById('eqNewValue').value);
      var solveField = document.getElementById('eqSolveField').value;
      if (!origIso || origIso <= 0 || !origAperture || origAperture <= 0 || !origShutter || origShutter <= 0 || !newValue || newValue <= 0) {
        alert(T.error); return;
      }
      var changedMap = { newIso: 'iso', newAperture: 'aperture', newShutter: 'shutter' };
      var changedTarget = changedMap[changedField];
      if (changedTarget === solveField) { alert(T.sameFieldError); return; }

      var stopsChanged;
      if (changedField === 'newIso') stopsChanged = Math.log2(newValue / origIso);
      else if (changedField === 'newAperture') stopsChanged = 2 * Math.log2(newValue / origAperture);
      else stopsChanged = Math.log2(newValue / origShutter);

      var solvedValue, solvedLabel, solvedUnit;
      if (solveField === 'iso') {
        solvedValue = origIso * Math.pow(2, -stopsChanged);
        solvedLabel = T.solvedIsoLabel; solvedUnit = 'ISO ' + fmtNum(solvedValue, lang, 0);
      } else if (solveField === 'aperture') {
        solvedValue = origAperture * Math.pow(2, -stopsChanged / 2);
        solvedLabel = T.solvedApertureLabel; solvedUnit = 'f/' + fmtNum(solvedValue, lang, 1);
      } else {
        solvedValue = origShutter * Math.pow(2, -stopsChanged);
        solvedLabel = T.solvedShutterLabel; solvedUnit = formatExposureTime(solvedValue);
      }
      var html =
        '<div class="result-value">' + solvedLabel + ': ' + solvedUnit + '</div>' +
        '<div class="result-extra">' + T.evShiftLabel + ': <strong>' + fmtNum(stopsChanged, lang, 2) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- PRINT SIZE CALCULATOR
  function initPrintSizeCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var mode = document.getElementById('printMode').value;
      var dpi = parseFloat(document.getElementById('printDpi').value) || 300;
      if (dpi <= 0) { alert(T.error); return; }
      var html = '';
      if (mode === 'fromImage') {
        var wPx = parseFloat(document.getElementById('printImageWidth').value);
        var hPx = parseFloat(document.getElementById('printImageHeight').value);
        if (!wPx || wPx <= 0 || !hPx || hPx <= 0) { alert(T.error); return; }
        var wIn = wPx / dpi, hIn = hPx / dpi;
        var wCm = wIn * 2.54, hCm = hIn * 2.54;
        html =
          '<div class="result-value">' + T.maxPrintSizeLabel + ': ' + fmtNum(wCm, lang, 1) + ' x ' + fmtNum(hCm, lang, 1) + ' cm</div>' +
          '<div class="result-extra">' + fmtNum(wIn, lang, 1) + ' x ' + fmtNum(hIn, lang, 1) + ' in</div>';
      } else {
        var wCmIn = parseFloat(document.getElementById('printWidthCm').value);
        var hCmIn = parseFloat(document.getElementById('printHeightCm').value);
        if (!wCmIn || wCmIn <= 0 || !hCmIn || hCmIn <= 0) { alert(T.error); return; }
        var reqWPx = (wCmIn / 2.54) * dpi;
        var reqHPx = (hCmIn / 2.54) * dpi;
        var reqMp = (reqWPx * reqHPx) / 1000000;
        html =
          '<div class="result-value">' + T.requiredMpLabel + ': ' + fmtNum(reqMp, lang, 1) + ' MP</div>' +
          '<div class="result-extra">' + T.requiredPxLabel + ': <strong>' + Math.round(reqWPx).toLocaleString(localeFor(lang)) + ' x ' + Math.round(reqHPx).toLocaleString(localeFor(lang)) + ' px</strong></div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- ASTROPHOTOGRAPHY EXPOSURE CALCULATOR
  function initAstroExposureCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var rule = document.getElementById('astroRule').value;
      var f = parseFloat(document.getElementById('astroFocalLength').value);
      var crop = parseFloat(document.getElementById('astroCropFactor').value) || 1;
      var aperture = parseFloat(document.getElementById('astroAperture').value);
      var pixelPitch = parseFloat(document.getElementById('astroPixelPitch').value);
      if (!f || f <= 0 || crop <= 0) { alert(T.error); return; }
      var maxExposure;
      if (rule === 'rule500') {
        maxExposure = 500 / (f * crop);
      } else if (rule === 'rule300') {
        maxExposure = 300 / (f * crop);
      } else {
        if (!aperture || aperture <= 0 || !pixelPitch || pixelPitch <= 0) { alert(T.error); return; }
        maxExposure = (35 * aperture + 30 * pixelPitch) / (f * crop);
      }
      var decimals = maxExposure < 10 ? 1 : 0;
      var html =
        '<div class="result-value">' + T.maxExposureLabel + ': ' + fmtNum(maxExposure, lang, decimals) + ' s</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- TIMELAPSE CALCULATOR
  var TL_UNIT_SECONDS = { seconds: 1, minutes: 60, hours: 3600 };
  function initTimelapseCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var mode = document.getElementById('tlMode').value;
      var eventDuration = parseFloat(document.getElementById('tlEventDuration').value);
      var eventUnit = document.getElementById('tlEventUnit').value;
      var fps = parseFloat(document.getElementById('tlFrameRate').value);
      if (!eventDuration || eventDuration <= 0 || !fps || fps <= 0) { alert(T.error); return; }
      var eventSec = eventDuration * (TL_UNIT_SECONDS[eventUnit] || 1);
      var html = '';
      if (mode === 'fromDuration') {
        var videoDuration = parseFloat(document.getElementById('tlVideoDuration').value);
        if (!videoDuration || videoDuration <= 0) { alert(T.error); return; }
        var totalShots = Math.ceil(videoDuration * fps);
        var interval = eventSec / totalShots;
        html =
          '<div class="result-value">' + T.intervalLabel + ': ' + fmtNum(interval, lang, 2) + ' s</div>' +
          '<div class="result-extra">' + T.totalShotsLabel + ': <strong>' + totalShots.toLocaleString(localeFor(lang)) + '</strong></div>' +
          '<div class="result-extra">' + T.videoDurationLabel + ': <strong>' + fmtNum(videoDuration, lang, 1) + ' s</strong></div>';
      } else {
        var shotInterval = parseFloat(document.getElementById('tlShotInterval').value);
        if (!shotInterval || shotInterval <= 0) { alert(T.error); return; }
        var totalShots2 = Math.floor(eventSec / shotInterval);
        var resultingVideo = totalShots2 / fps;
        html =
          '<div class="result-value">' + T.totalShotsLabel + ': ' + totalShots2.toLocaleString(localeFor(lang)) + '</div>' +
          '<div class="result-extra">' + T.videoDurationLabel + ': <strong>' + fmtNum(resultingVideo, lang, 1) + ' s</strong></div>';
      }
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- HANDHELD SHUTTER SPEED CALCULATOR
  function initHandheldShutterSpeedCalculator(card, T) {
    on(card, 'calc', function () {
      var f = parseFloat(document.getElementById('hsFocalLength').value);
      var crop = parseFloat(document.getElementById('hsCropFactor').value) || 1;
      var stops = parseFloat(document.getElementById('hsStabilization').value) || 0;
      if (!f || f <= 0 || crop <= 0) { alert(T.error); return; }
      var effectiveFocal = f * crop;
      var baseSafe = 1 / effectiveFocal;
      var withStab = baseSafe / Math.pow(2, stops);
      var html =
        '<div class="result-value">' + T.baseSafeLabel + ': ' + formatShutterFraction(baseSafe) + '</div>' +
        '<div class="result-extra">' + T.withStabLabel + ': <strong>' + formatShutterFraction(withStab) + '</strong></div>' +
        '<div class="result-note">' + T.ruleOfThumbNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- WORLD CITIES (shared by travel tools)
  // [id, IANA zone, latitude, longitude] - coordinates rounded to ~0.01 deg
  var WORLD_CITIES = {
    saoPaulo: ['America/Sao_Paulo', -23.55, -46.63],
    rioDeJaneiro: ['America/Sao_Paulo', -22.91, -43.17],
    brasilia: ['America/Sao_Paulo', -15.79, -47.88],
    manaus: ['America/Manaus', -3.12, -60.02],
    lisboa: ['Europe/Lisbon', 38.72, -9.14],
    madrid: ['Europe/Madrid', 40.42, -3.70],
    paris: ['Europe/Paris', 48.86, 2.35],
    london: ['Europe/London', 51.51, -0.13],
    rome: ['Europe/Rome', 41.90, 12.50],
    berlin: ['Europe/Berlin', 52.52, 13.40],
    moscow: ['Europe/Moscow', 55.76, 37.62],
    istanbul: ['Europe/Istanbul', 41.01, 28.98],
    cairo: ['Africa/Cairo', 30.04, 31.24],
    johannesburg: ['Africa/Johannesburg', -26.20, 28.05],
    luanda: ['Africa/Luanda', -8.84, 13.23],
    maputo: ['Africa/Maputo', -25.97, 32.57],
    lagos: ['Africa/Lagos', 6.52, 3.38],
    nairobi: ['Africa/Nairobi', -1.29, 36.82],
    praia: ['Atlantic/Cape_Verde', 14.93, -23.51],
    dubai: ['Asia/Dubai', 25.20, 55.27],
    delhi: ['Asia/Kolkata', 28.61, 77.21],
    kathmandu: ['Asia/Kathmandu', 27.72, 85.32],
    bangkok: ['Asia/Bangkok', 13.76, 100.50],
    singapore: ['Asia/Singapore', 1.35, 103.82],
    hongKong: ['Asia/Hong_Kong', 22.32, 114.17],
    shanghai: ['Asia/Shanghai', 31.23, 121.47],
    tokyo: ['Asia/Tokyo', 35.68, 139.69],
    seoul: ['Asia/Seoul', 37.57, 126.98],
    sydney: ['Australia/Sydney', -33.87, 151.21],
    auckland: ['Pacific/Auckland', -36.85, 174.76],
    honolulu: ['Pacific/Honolulu', 21.31, -157.86],
    losAngeles: ['America/Los_Angeles', 34.05, -118.24],
    chicago: ['America/Chicago', 41.88, -87.63],
    newYork: ['America/New_York', 40.71, -74.01],
    toronto: ['America/Toronto', 43.65, -79.38],
    mexicoCity: ['America/Mexico_City', 19.43, -99.13],
    bogota: ['America/Bogota', 4.71, -74.07],
    lima: ['America/Lima', -12.05, -77.04],
    santiago: ['America/Santiago', -33.45, -70.67],
    buenosAires: ['America/Argentina/Buenos_Aires', -34.60, -58.38]
  };

  // Offset (in minutes) of an IANA zone from UTC at a given UTC instant (ms).
  function tzOffsetMin(tz, utcMs) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    });
    var p = {};
    dtf.formatToParts(new Date(utcMs)).forEach(function (x) { if (x.type !== 'literal') p[x.type] = parseInt(x.value, 10); });
    var asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
    return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
  }
  // Local wall-clock time in a zone -> UTC ms (iterates once to settle DST edges).
  function localToUtcMs(y, mo, d, h, mi, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi, 0);
    var off1 = tzOffsetMin(tz, guess);
    var utc = guess - off1 * 60000;
    var off2 = tzOffsetMin(tz, utc);
    if (off2 !== off1) utc = guess - off2 * 60000;
    return utc;
  }
  // UTC ms -> local wall-clock parts in a zone.
  function utcToLocalParts(utcMs, tz) {
    var off = tzOffsetMin(tz, utcMs);
    var d = new Date(utcMs + off * 60000);
    return { y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), offMin: off };
  }
  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371.0088, rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  }
  // minutes-of-day helpers (wrap around midnight)
  function wrapDay(min) { return ((min % 1440) + 1440) % 1440; }
  function fmtClock(min) { var m = wrapDay(Math.round(min)); return pad2(Math.floor(m / 60)) + ':' + pad2(m % 60); }
  function parseClock(str) {
    var m = /^(\d{1,2}):(\d{2})/.exec(String(str || ''));
    if (!m) return null;
    var h = parseInt(m[1], 10), mi = parseInt(m[2], 10);
    if (h > 23 || mi > 59) return null;
    return h * 60 + mi;
  }
  // road trip conversions
  var KM_PER_MI = 1.609344, L_PER_US_GAL = 3.785411784, L_PER_UK_GAL = 4.54609;
  function efficiencyToKmPerL(v, unit) {
    if (unit === 'l100km') return 100 / v;
    if (unit === 'mpgUs') return v * (KM_PER_MI / L_PER_US_GAL);
    if (unit === 'mpgUk') return v * (KM_PER_MI / L_PER_UK_GAL);
    return v;
  }
  function pricePerLiter(v, unit) {
    if (unit === 'perUsGal') return v / L_PER_US_GAL;
    if (unit === 'perUkGal') return v / L_PER_UK_GAL;
    return v;
  }
  function caffeineRemaining(dose, halfLife, hours) { return dose * Math.pow(0.5, hours / halfLife); }
  function caffeineHoursToThreshold(dose, halfLife, thr) { return dose <= thr ? 0 : halfLife * Math.log2(dose / thr); }

  // ---------------------------------------------------------- TRAVEL + SLEEP TOOLS (phase 2026-09-30)
  function elVal(id) { var e = document.getElementById(id); return e ? e.value : ''; }
  function selText(id) {
    var e = document.getElementById(id);
    return e && e.selectedIndex >= 0 ? e.options[e.selectedIndex].text : '';
  }
  function todayISO() {
    var n = new Date();
    return n.getFullYear() + '-' + pad2(n.getMonth() + 1) + '-' + pad2(n.getDate());
  }
  function parseYMD(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str || ''));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var chk = new Date(Date.UTC(y, mo - 1, d));
    if (chk.getUTCFullYear() !== y || chk.getUTCMonth() !== mo - 1 || chk.getUTCDate() !== d) return null;
    return { y: y, mo: mo, d: d };
  }
  function fmtHM(totalMin) {
    var t = Math.round(Math.abs(totalMin));
    var h = Math.floor(t / 60), m = t % 60;
    return h + ' h ' + (m < 10 ? '0' : '') + m + ' min';
  }
  function fmtSignedOffset(min) {
    var sign = min > 0 ? '+' : (min < 0 ? '\u2212' : '');
    var a = Math.abs(min), h = Math.floor(a / 60), m = a % 60;
    return sign + h + ' h' + (m ? ' ' + m + ' min' : '');
  }
  function fmtUtcOffset(min) {
    var a = Math.abs(min);
    return 'UTC' + (min < 0 ? '\u2212' : '+') + pad2(Math.floor(a / 60)) + ':' + pad2(a % 60);
  }
  function fmtDayDiff(n) { return n === 0 ? '0' : (n > 0 ? '+' + n : '\u2212' + Math.abs(n)); }
  function fmtLocalStamp(p, lang) {
    var ds = new Date(Date.UTC(p.y, p.mo - 1, p.d)).toLocaleDateString(localeFor(lang), {
      timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
    return ds + ', ' + pad2(p.h) + ':' + pad2(p.mi);
  }
  function fmtUtcStamp(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) + ' ' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ' UTC';
  }

  // ---------------------------------------------------------- JET LAG CALCULATOR
  function initJetLagCalculator(card, T) {
    var dateEl = document.getElementById('jlDate');
    if (dateEl && !dateEl.value) dateEl.value = todayISO();
    on(card, 'calc', function () {
      var o = WORLD_CITIES[elVal('jlOrigin')], d = WORLD_CITIES[elVal('jlDestination')];
      var ymd = parseYMD(elVal('jlDate'));
      if (!o || !d || !ymd) { alert(T.error); return; }
      var offO = tzOffsetMin(o[0], localToUtcMs(ymd.y, ymd.mo, ymd.d, 12, 0, o[0]));
      var offD = tzOffsetMin(d[0], localToUtcMs(ymd.y, ymd.mo, ymd.d, 12, 0, d[0]));
      var diff = offD - offO;
      var eff = diff;
      if (eff > 720) eff -= 1440;
      if (eff < -720) eff += 1440;
      var html = '<div class="result-value">' + T.timeDiffLabel + ': ' + (diff === 0 ? '0 h' : fmtSignedOffset(diff)) + '</div>';
      if (eff === 0) {
        html += '<div class="result-extra">' + T.noDifference + '</div>';
      } else {
        var days = Math.ceil(Math.abs(eff) / 60);
        var east = eff > 0;
        html += '<div class="result-extra">' + T.directionLabel + ': <strong>' + (east ? T.dirEast : T.dirWest) + '</strong></div>';
        if (eff !== diff) {
          html += '<div class="result-extra">' + T.shortestShiftLabel + ': <strong>' + fmtSignedOffset(eff) + '</strong> (' + T.shortestShiftNote + ')</div>';
        }
        html += '<div class="result-extra">' + T.recoveryLabel + ': <strong>~' + days + ' ' + (days === 1 ? T.dayWord : T.daysWord) + '</strong>' + (east ? ' (' + T.eastNote + ')' : '') + '</div>';
        html += '<div class="result-extra">' + T.preTripLabel + ': ' + (east ? T.preTripEast : T.preTripWest).replace('{n}', days) + '</div>';
      }
      html += '<div class="result-note">' + T.disclaimer + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- FLIGHT ARRIVAL TIME CALCULATOR
  function initFlightArrivalCalculator(card, T) {
    var dateEl = document.getElementById('faDate');
    if (dateEl && !dateEl.value) dateEl.value = todayISO();
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var o = WORLD_CITIES[elVal('faOrigin')], d = WORLD_CITIES[elVal('faDestination')];
      var ymd = parseYMD(elVal('faDate'));
      var clock = parseClock(elVal('faTime'));
      var hh = parseFloat(elVal('faHours')), mm = parseFloat(elVal('faMinutes'));
      if (isNaN(hh)) hh = 0;
      if (isNaN(mm)) mm = 0;
      if (!o || !d || !ymd || clock === null || hh < 0 || mm < 0 || mm >= 60 || (hh * 60 + mm) <= 0) { alert(T.error); return; }
      var depUtc = localToUtcMs(ymd.y, ymd.mo, ymd.d, Math.floor(clock / 60), clock % 60, o[0]);
      var arrUtc = depUtc + Math.round(hh * 60 + mm) * 60000;
      var depLocal = utcToLocalParts(depUtc, o[0]);
      var arrLocal = utcToLocalParts(arrUtc, d[0]);
      var dayDiff = Math.round((Date.UTC(arrLocal.y, arrLocal.mo - 1, arrLocal.d) - Date.UTC(depLocal.y, depLocal.mo - 1, depLocal.d)) / 86400000);
      var html =
        '<div class="result-value">' + T.arrivalLabel + ': ' + fmtLocalStamp(arrLocal, lang) + '</div>' +
        '<div class="result-extra">' + T.dayDiffLabel + ': <strong>' + fmtDayDiff(dayDiff) + '</strong></div>' +
        '<div class="result-extra">' + T.departureLabel + ': <strong>' + fmtLocalStamp(depLocal, lang) + '</strong> (' + escHtml(selText('faOrigin')) + ', ' + fmtUtcOffset(depLocal.offMin) + ')</div>' +
        '<div class="result-extra">' + T.arrivalZoneLabel + ': <strong>' + escHtml(selText('faDestination')) + ', ' + fmtUtcOffset(arrLocal.offMin) + '</strong></div>' +
        '<div class="result-extra">' + T.utcDepartureLabel + ': <strong>' + fmtUtcStamp(depUtc) + '</strong></div>' +
        '<div class="result-extra">' + T.utcArrivalLabel + ': <strong>' + fmtUtcStamp(arrUtc) + '</strong></div>' +
        '<div class="result-extra">' + T.flightDurationLabel + ': <strong>' + fmtHM(hh * 60 + mm) + '</strong></div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- ROAD TRIP CALCULATOR
  function initRoadTripCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var dist = parseFloat(elVal('rtDistance'));
      var distUnit = elVal('rtDistanceUnit');
      var eff = parseFloat(elVal('rtEfficiency'));
      var effUnit = elVal('rtEfficiencyUnit');
      var price = parseFloat(elVal('rtFuelPrice'));
      var priceUnit = elVal('rtPriceUnit');
      var tolls = parseFloat(elVal('rtTolls'));
      var people = parseFloat(elVal('rtPeople'));
      var speed = parseFloat(elVal('rtSpeed'));
      if (isNaN(tolls)) tolls = 0;
      if (isNaN(people)) people = 1;
      if (!dist || dist <= 0 || !eff || eff <= 0 || isNaN(price) || price < 0 || tolls < 0 || people < 1 || !speed || speed <= 0) { alert(T.error); return; }
      people = Math.floor(people);
      var km = distUnit === 'mi' ? dist * KM_PER_MI : dist;
      var kmPerL = efficiencyToKmPerL(eff, effUnit);
      var liters = km / kmPerL;
      var fuelCost = liters * pricePerLiter(price, priceUnit);
      var total = fuelCost + tolls;
      var minutes = Math.round((dist / speed) * 60);
      var html =
        '<div class="result-value">' + T.totalCostLabel + ': ' + fmtNum(total, lang, 2) + '</div>' +
        '<div class="result-extra">' + T.fuelNeededLabel + ': <strong>' + fmtNum(liters, lang, 1) + ' L</strong></div>' +
        '<div class="result-extra">' + T.fuelCostLabel + ': <strong>' + fmtNum(fuelCost, lang, 2) + '</strong></div>' +
        '<div class="result-extra">' + T.tollsLabel + ': <strong>' + fmtNum(tolls, lang, 2) + '</strong></div>' +
        '<div class="result-extra">' + T.perPersonLabel + ' (' + people + '): <strong>' + fmtNum(total / people, lang, 2) + '</strong></div>' +
        '<div class="result-extra">' + T.travelTimeLabel + ': <strong>' + Math.floor(minutes / 60) + ':' + pad2(minutes % 60) + ' h</strong></div>' +
        '<div class="result-note">' + T.roadNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- GREAT-CIRCLE DISTANCE CALCULATOR
  function initGreatCircleCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var speed = parseFloat(elVal('gcSpeed'));
      if (!speed || speed <= 0) { alert(T.error); return; }
      var a, b;
      if (elVal('gcMode') === 'coords') {
        var la1 = parseFloat(elVal('gcLat1')), lo1 = parseFloat(elVal('gcLon1'));
        var la2 = parseFloat(elVal('gcLat2')), lo2 = parseFloat(elVal('gcLon2'));
        if ([la1, lo1, la2, lo2].some(isNaN) || Math.abs(la1) > 90 || Math.abs(la2) > 90 || Math.abs(lo1) > 180 || Math.abs(lo2) > 180) { alert(T.errorCoords); return; }
        a = [null, la1, lo1]; b = [null, la2, lo2];
      } else {
        a = WORLD_CITIES[elVal('gcOrigin')]; b = WORLD_CITIES[elVal('gcDestination')];
        if (!a || !b) { alert(T.error); return; }
      }
      var km = haversineKm(a[1], a[2], b[1], b[2]);
      var mi = km / KM_PER_MI, nm = km / 1.852;
      var flightMin = Math.round((km / speed) * 60) + 30;
      var html =
        '<div class="result-value">' + T.kmLabel + ': ' + fmtNum(km, lang, 0) + ' km</div>' +
        '<div class="result-extra">' + T.miLabel + ': <strong>' + fmtNum(mi, lang, 0) + ' mi</strong></div>' +
        '<div class="result-extra">' + T.nmLabel + ': <strong>' + fmtNum(nm, lang, 0) + ' NM</strong></div>' +
        '<div class="result-extra">' + T.flightTimeLabel + ': <strong>~' + fmtHM(flightMin) + '</strong></div>' +
        '<div class="result-note">' + T.flightTimeNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- SLEEP CYCLE CALCULATOR
  function initSleepCycleCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var t = parseClock(elVal('scTime'));
      var fall = parseFloat(elVal('scFallAsleep'));
      if (isNaN(fall)) fall = 15;
      if (t === null || fall < 0 || fall > 180) { alert(T.error); return; }
      var wakeMode = elVal('scMode') === 'wakeAt';
      var order = wakeMode ? [6, 5, 4, 3] : [3, 4, 5, 6];
      var rows = order.map(function (c) {
        var clock = wakeMode ? t - c * 90 - fall : t + fall + c * 90;
        var tag = c >= 5 ? T.tagRecommended : (c === 3 ? T.tagShort : '');
        return '<tr><td><strong>' + fmtClock(clock) + '</strong></td><td>' + c + '</td><td>' + fmtNum(c * 1.5, lang, 1) + ' h</td><td>' + tag + '</td></tr>';
      }).join('');
      var html =
        '<div class="result-value">' + (wakeMode ? T.bedtimesLabel : T.wakeTimesLabel) + '</div>' +
        '<table class="result-table"><thead><tr><th>' + (wakeMode ? T.colBedtime : T.colWake) + '</th><th>' + T.colCycles + '</th><th>' + T.colSleep + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="result-note">' + T.cycleNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- NAP CALCULATOR
  function initNapCalculator(card, T) {
    on(card, 'calc', function () {
      var start = parseClock(elVal('ncStart'));
      var fall = parseFloat(elVal('ncFallAsleep'));
      if (isNaN(fall)) fall = 10;
      var durations = { power20: 20, nap30: 30, nap60: 60, cycle90: 90 };
      var notes = { power20: T.notePower20, nap30: T.noteNap30, nap60: T.noteNap60, cycle90: T.noteCycle90 };
      var type = elVal('ncType');
      if (start === null || fall < 0 || fall > 120 || !durations[type]) { alert(T.error); return; }
      var dur = durations[type];
      var html =
        '<div class="result-value">' + T.wakeUpLabel + ': ' + fmtClock(start + fall + dur) + '</div>' +
        '<div class="result-extra">' + T.totalTimeLabel + ': <strong>' + fmtHM(fall + dur) + '</strong></div>' +
        '<div class="result-extra">' + notes[type] + '</div>' +
        '<div class="result-note">' + T.napNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- SLEEP DEBT CALCULATOR
  function initSleepDebtCalculator(card, T) {
    on(card, 'calc', function () {
      var need = parseFloat(elVal('sdNeeded'));
      if (!need || need <= 0 || need > 24) { alert(T.error); return; }
      var slept = [];
      for (var i = 1; i <= 7; i++) {
        var v = parseFloat(elVal('sdDay' + i));
        if (isNaN(v) || v < 0 || v > 24) { alert(T.error); return; }
        slept.push(v);
      }
      var total = slept.reduce(function (a, b) { return a + b; }, 0);
      var net = need * 7 - total;
      var netMin = Math.round(net * 60);
      var headline = netMin > 0 ? T.debtLabel + ': ' + fmtHM(netMin)
        : (netMin < 0 ? T.surplusLabel + ': ' + fmtHM(netMin) : T.noDebtLabel);
      var html =
        '<div class="result-value">' + headline + '</div>' +
        '<div class="result-extra">' + T.totalSleptLabel + ': <strong>' + fmtHM(total * 60) + '</strong></div>' +
        '<div class="result-extra">' + T.totalNeededLabel + ': <strong>' + fmtHM(need * 7 * 60) + '</strong></div>' +
        '<div class="result-extra">' + T.avgLabel + ': <strong>' + fmtHM(total / 7 * 60) + '</strong></div>' +
        '<div class="result-note">' + T.debtNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- CAFFEINE CUTOFF CALCULATOR
  function initCaffeineCutoffCalculator(card, T) {
    on(card, 'calc', function () {
      var lang = card.dataset.lang;
      var dose = parseFloat(elVal('cfDose'));
      var hl = parseFloat(elVal('cfHalfLife'));
      var thr = parseFloat(elVal('cfThreshold'));
      var intake = parseClock(elVal('cfIntake'));
      var bed = parseClock(elVal('cfBedtime'));
      if (!dose || dose <= 0 || !hl || hl <= 0 || !thr || thr <= 0 || intake === null || bed === null) { alert(T.error); return; }
      var hours = wrapDay(bed - intake) / 60;
      var left = caffeineRemaining(dose, hl, hours);
      var tClear = caffeineHoursToThreshold(dose, hl, thr);
      var clearMin = intake + Math.round(tClear * 60);
      var dayN = Math.floor(clearMin / 1440);
      var dayTag = dayN === 0 ? '' : (dayN === 1 ? ' (' + T.nextDay + ')' : ' (' + T.laterDay.replace('{n}', dayN) + ')');
      var okAtBed = left <= thr;
      var html =
        '<div class="result-value">' + T.remainingLabel + ': ' + fmtNum(left, lang, 1) + ' mg (' + fmtNum(left / dose * 100, lang, 0) + '%)</div>' +
        '<div class="result-extra">' + T.hoursToBedLabel + ': <strong>' + fmtNum(hours, lang, 1) + ' h</strong></div>' +
        '<div class="result-extra">' + T.belowThresholdLabel + ' (' + fmtNum(thr, lang, 0) + ' mg): <strong>' + (tClear === 0 ? T.alreadyBelow : fmtNum(tClear, lang, 1) + ' h &rarr; ' + fmtClock(clearMin) + dayTag) + '</strong></div>' +
        '<div class="result-extra">' + (okAtBed ? T.verdictOk : T.verdictHigh) + '</div>' +
        '<div class="result-note">' + T.caffeineNote + '</div>';
      showResult(card, html);
    });
  }

  // ---------------------------------------------------------- RECOMMENDED SLEEP CALCULATOR (NSF 2015)
  // [upper bound in months (exclusive), string key, min h, max h]
  var NSF_GROUPS = [
    [4, 'groupNewborn', 14, 17],
    [12, 'groupInfant', 12, 15],
    [36, 'groupToddler', 11, 14],
    [72, 'groupPreschool', 10, 13],
    [168, 'groupSchoolAge', 9, 11],
    [216, 'groupTeen', 8, 10],
    [312, 'groupYoungAdult', 7, 9],
    [780, 'groupAdult', 7, 9],
    [Infinity, 'groupOlderAdult', 7, 8]
  ];
  function nsfGroupFor(ageMonths) {
    for (var i = 0; i < NSF_GROUPS.length; i++) if (ageMonths < NSF_GROUPS[i][0]) return NSF_GROUPS[i];
    return NSF_GROUPS[NSF_GROUPS.length - 1];
  }
  function initRecommendedSleepCalculator(card, T) {
    on(card, 'calc', function () {
      var age = parseFloat(elVal('rsAge'));
      var unit = elVal('rsAgeUnit');
      if (isNaN(age) || age < 0 || age > (unit === 'months' ? 1440 : 120)) { alert(T.error); return; }
      var g = nsfGroupFor(unit === 'months' ? age : age * 12);
      var html =
        '<div class="result-value">' + T.rangeLabel + ': ' + g[2] + '–' + g[3] + ' h</div>' +
        '<div class="result-extra">' + T.groupLabel + ': <strong>' + T[g[1]] + '</strong></div>' +
        '<div class="result-note">' + T.guidanceNote + '</div>';
      showResult(card, html);
    });
  }

  var handlers = {
    bmi: initBmi,
    percentage: initPercentage,
    temperature: initTemperature,
    password: initPassword,
    jsonFormatter: initJsonFormatter,
    cpf: initCpf,
    cnpj: initCnpj,
    charCode: initCharCode,
    urlEncode: initUrlEncode,
    htmlEncode: initHtmlEncode,
    base64: initBase64,
    wordCounter: initWordCounter,
    keywordDensity: initKeywordDensity,
    metaTagGenerator: initMetaTagGenerator,
    serpSimulator: initSerpSimulator,
    colorConverter: initColorConverter,
    imageConverter: initImageConverter,
    ferias: initFerias,
    decimoTerceiro: initDecimoTerceiro,
    horasExtras: initHorasExtras,
    fgts: initFgts,
    rescisao: initRescisao,
    simpleInterest: initSimpleInterest,
    compoundInterest: initCompoundInterest,
    loanInstallments: initLoanInstallments,
    ruleOfThree: initRuleOfThree,
    tipCalculator: initTipCalculator,
    ageCalculator: initAgeCalculator,
    dateDiff: initDateDiff,
    billSplit: initBillSplit,
    fuelEfficiency: initFuelEfficiency,
    alcoolGasolina: initAlcoolGasolina,
    uuidGenerator: initUuidGenerator,
    qrCodeGenerator: initQrCodeGenerator,
    loremIpsumGenerator: initLoremIpsumGenerator,
    hashGenerator: initHashGenerator,
    randomNumberGenerator: initRandomNumberGenerator,
    rgGenerator: initRgGenerator,
    placaGenerator: initPlacaGenerator,
    pisPasepGenerator: initPisPasepGenerator,
    cartaoTesteGenerator: initCartaoTesteGenerator,
    baseConverter: initBaseConverter,
    jwtDecoder: initJwtDecoder,
    timestampConverter: initTimestampConverter,
    caseConverter: initCaseConverter,
    stringEscape: initStringEscape,
    slugGenerator: initSlugGenerator,
    csvJsonConverter: initCsvJsonConverter,
    regexTester: initRegexTester,
    diffChecker: initDiffChecker,
    codeFormatter: initCodeFormatter,
    sqlFormatter: initSqlFormatter,
    yamlJsonConverter: initYamlJsonConverter,
    xmlJsonConverter: initXmlJsonConverter,
    cidrCalculator: initCidrCalculator,
    userAgentParser: initUserAgentParser,
    cronExplainer: initCronExplainer,
    lineSorter: initLineSorter,
    romanNumeralConverter: initRomanNumeralConverter,
    contrastChecker: initContrastChecker,
    imgToPdf: initImgToPdf,
    pdfMerge: initPdfMerge,
    pdfToImg: initPdfToImg,
    pdfSplit: initPdfSplit,
    pdfCompress: initPdfCompress,
    imgCompress: initImgCompress,
    imgResize: initImgResize,
    imgOcr: initOcr,
    numeroPorExtenso: initNumeroPorExtenso,
    dataPorExtenso: initDataPorExtenso,
    validadorCpfCnpj: initValidadorCpfCnpj,
    whatsappLink: initWhatsappLink,
    lotteryGenerator: initLotteryGenerator,
    timezoneConverter: initTimezoneConverter,
    paceCalculator: initPaceCalculator,
    trocoCalculator: initTrocoCalculator,
    unitConverter: initUnitConverter,
    geometryCalculator: initGeometryCalculator,
    placeholderGenerator: initPlaceholderGenerator,
    vcardQrGenerator: initVcardQrGenerator,
    ean13Generator: initEan13Generator,
    subnetMaskConverter: initSubnetMaskConverter,
    vlsmCalculator: initVlsmCalculator,
    ipInSubnetChecker: initIpInSubnetChecker,
    cidrOverlapChecker: initCidrOverlapChecker,
    ipBinHexConverter: initIpBinHexConverter,
    dataUnitConverter: initDataUnitConverter,
    commonPortsTable: initCommonPortsTable,
    httpStatusTable: initHttpStatusTable,
    macAddressTool: initMacAddressTool,
    downloadTimeCalculator: initDownloadTimeCalculator,
    bmrCalculator: initBmrCalculator,
    idealWeightCalculator: initIdealWeightCalculator,
    bodyFatCalculator: initBodyFatCalculator,
    macroCalculator: initMacroCalculator,
    heartRateZoneCalculator: initHeartRateZoneCalculator,
    waterIntakeCalculator: initWaterIntakeCalculator,
    oneRepMaxCalculator: initOneRepMaxCalculator,
    pregnancyCalculator: initPregnancyCalculator,
    cookingMeasureConverter: initCookingMeasureConverter,
    recipeScalerCalculator: initRecipeScalerCalculator,
    ovenTempConverter: initOvenTempConverter,
    gcdLcmCalculator: initGcdLcmCalculator,
    quadraticEquationCalculator: initQuadraticEquationCalculator,
    factorialCombinatoricsCalculator: initFactorialCombinatoricsCalculator,
    primeNumberChecker: initPrimeNumberChecker,
    averageCalculator: initAverageCalculator,
    percentageChangeCalculator: initPercentageChangeCalculator,
    colorPaletteGenerator: initColorPaletteGenerator,
    cssGradientGenerator: initCssGradientGenerator,
    boxShadowGenerator: initBoxShadowGenerator,
    borderRadiusGenerator: initBorderRadiusGenerator,
    randomColorGenerator: initRandomColorGenerator,
    dayOfWeekCalculator: initDayOfWeekCalculator,
    countdownCalculator: initCountdownCalculator,
    dayOfYearWeekCalculator: initDayOfYearWeekCalculator,
    zodiacSignCalculator: initZodiacSignCalculator,
    dateToRomanConverter: initDateToRomanConverter,
    budget503020Calculator: initBudget503020Calculator,
    emergencyFundCalculator: initEmergencyFundCalculator,
    financialIndependenceCalculator: initFinancialIndependenceCalculator,
    savingsGoalCalculator: initSavingsGoalCalculator,
    debtPayoffCalculator: initDebtPayoffCalculator,
    markupMarginCalculator: initMarkupMarginCalculator,
    freelancerRateCalculator: initFreelancerRateCalculator,
    breakevenCalculator: initBreakevenCalculator,
    textCaseConverter: initTextCaseConverter,
    accentRemover: initAccentRemover,
    readingTimeCalculator: initReadingTimeCalculator,
    textCleaner: initTextCleaner,
    emailUrlExtractor: initEmailUrlExtractor,
    listPicker: initListPicker,
    markdownToHtmlConverter: initMarkdownToHtmlConverter,
    pomodoroTimer: initPomodoroTimer,
    businessDaysCalculator: initBusinessDaysCalculator,
    weightedGradeCalculator: initWeightedGradeCalculator,
    gradeScaleConverter: initGradeScaleConverter,
    gpaConverter: initGpaConverter,
    attendanceCalculator: initAttendanceCalculator,
    crIraCalculator: initCrIraCalculator,
    spacedRepetitionPlanner: initSpacedRepetitionPlanner,
    readingPlanCalculator: initReadingPlanCalculator,
    paintCalculator: initPaintCalculator,
    flooringCalculator: initFlooringCalculator,
    mortarCalculator: initMortarCalculator,
    brickCalculator: initBrickCalculator,
    concreteCalculator: initConcreteCalculator,
    wallpaperCalculator: initWallpaperCalculator,
    grassCalculator: initGrassCalculator,
    groutCalculator: initGroutCalculator,
    stairCalculator: initStairCalculator,
    roofTileCalculator: initRoofTileCalculator,
    waterTankCalculator: initWaterTankCalculator,
    netSalaryCalculator: initNetSalaryCalculator,
    salaryAdjustmentSimulator: initSalaryAdjustmentSimulator,
    jobOfferComparator: initJobOfferComparator,
    cltHourlyRateCalculator: initCltHourlyRateCalculator,
    dogAgeCalculator: initDogAgeCalculator,
    catAgeCalculator: initCatAgeCalculator,
    dogIdealWeightCalculator: initDogIdealWeightCalculator,
    dogFoodCalculator: initDogFoodCalculator,
    oddsConverter: initOddsConverter,
    impliedProbabilityCalculator: initImpliedProbabilityCalculator,
    parlayOddsCalculator: initParlayOddsCalculator,
    betEvCalculator: initBetEvCalculator,
    marketingRoiCalculator: initMarketingRoiCalculator,
    cacCalculator: initCacCalculator,
    ltvCalculator: initLtvCalculator,
    cpmCpcCtrCalculator: initCpmCpcCtrCalculator,
    passwordCrackTimeEstimator: initPasswordCrackTimeEstimator,
    pinGenerator: initPinGenerator,
    passwordStrengthChecker: initPasswordStrengthChecker,
    ageOnOtherPlanets: initAgeOnOtherPlanets,
    weightOnOtherPlanets: initWeightOnOtherPlanets,
    moonPhaseCalculator: initMoonPhaseCalculator,
    holidayChecker: initHolidayChecker,
    usHolidayChecker: initUsHolidayChecker,
    ukHolidayChecker: initUkHolidayChecker,
    mexicoHolidayChecker: initMexicoHolidayChecker,
    spainHolidayChecker: initSpainHolidayChecker,
    angolaHolidayChecker: initAngolaHolidayChecker,
    mozambiqueHolidayChecker: initMozambiqueHolidayChecker,
    caboVerdeHolidayChecker: initCaboVerdeHolidayChecker,
    timorLesteHolidayChecker: initTimorLesteHolidayChecker,
    secretSanta: initSecretSanta,
    clothingSizeConverter: initClothingSizeConverter,
    shoeSizeConverter: initShoeSizeConverter,
    ringSizeCalculator: initRingSizeCalculator,
    braSizeCalculator: initBraSizeCalculator,
    travelBudgetCalculator: initTravelBudgetCalculator,
    milesValueCalculator: initMilesValueCalculator,
    tripGroupSplit: initTripGroupSplit,
    weddingBudgetCalculator: initWeddingBudgetCalculator,
    eventFoodDrinkCalculator: initEventFoodDrinkCalculator,
    weddingAnniversaryCalculator: initWeddingAnniversaryCalculator,
    minWageMultipleCalculator: initMinWageMultipleCalculator,
    readabilityIndex: initReadabilityIndex,
    speakingTimeCalculator: initSpeakingTimeCalculator,
    typingSpeedTest: initTypingSpeedTest,
    socialCharCounter: initSocialCharCounter,
    depthOfFieldCalculator: initDepthOfFieldCalculator,
    hyperfocalDistanceCalculator: initHyperfocalDistanceCalculator,
    fieldOfViewCalculator: initFieldOfViewCalculator,
    cropFactorCalculator: initCropFactorCalculator,
    flashGuideNumberCalculator: initFlashGuideNumberCalculator,
    ndFilterCalculator: initNdFilterCalculator,
    equivalentExposureCalculator: initEquivalentExposureCalculator,
    printSizeCalculator: initPrintSizeCalculator,
    astroExposureCalculator: initAstroExposureCalculator,
    timelapseCalculator: initTimelapseCalculator,
    handheldShutterSpeedCalculator: initHandheldShutterSpeedCalculator,
    jetLagCalculator: initJetLagCalculator,
    flightArrivalCalculator: initFlightArrivalCalculator,
    roadTripCalculator: initRoadTripCalculator,
    greatCircleCalculator: initGreatCircleCalculator,
    sleepCycleCalculator: initSleepCycleCalculator,
    napCalculator: initNapCalculator,
    sleepDebtCalculator: initSleepDebtCalculator,
    caffeineCutoffCalculator: initCaffeineCutoffCalculator,
    recommendedSleepCalculator: initRecommendedSleepCalculator,
  };

  document.addEventListener('DOMContentLoaded', function () {
    var card = document.querySelector('.card[data-tool]');
    if (!card) return;
    var toolKey = card.dataset.tool;
    var stringsEl = document.getElementById('tool-strings');
    var T = stringsEl ? JSON.parse(stringsEl.textContent) : {};
    if (handlers[toolKey]) handlers[toolKey](card, T);
  });
})();
