// berekeningen: kleur, zetadvies en of een mix goed is

function key(a, b) { return a < b ? a + '|' + b : b + '|' + a; }
var GOOD = {}, CLASH = {};
Object.keys(PAST).forEach(function (a) { PAST[a].forEach(function (b) { GOOD[key(a, b)] = true; }); });
BOTST.forEach(function (t) { CLASH[key(t[0], t[1])] = t[2]; });

function hexToRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
// kleur van de thee berekenen
function mixColor(pairs) {
  if (!pairs.length) return '#dfe9e6';
  var r = 0, g = 0, b = 0, w = 0;
  pairs.forEach(function (p) {
    var i = BY[p[0]], c = hexToRgb(i.inf), k = i.kk * p[1];
    r += c[0] * k; g += c[1] * k; b += c[2] * k; w += k;
  });
  function h(v) { var s = Math.round(v / w).toString(16); return s.length < 2 ? '0' + s : s; }
  return '#' + h(r) + h(g) + h(b);
}
function partsFor(ids) { return ids.map(function (id) { return [id, BY[id].deel]; }); }
function delenText(d) { return d === 0.5 ? 'snufje' : d === 1 ? '1 deel' : d + ' delen'; }
function listNames(ids) {
  var n = ids.map(function (id, k) { var s = BY[id].n; return k ? s.charAt(0).toLowerCase() + s.slice(1) : s; });
  if (n.length < 2) return n.join('');
  return n.slice(0, -1).join(', ') + ' en ' + n[n.length - 1];
}

// temperatuur en trektijd
function zet(ids) {
  var has = function (id) { return ids.indexOf(id) > -1; };
  var caf = ids.some(function (id) { return BY[id].caf; });
  if (has('groene-thee') || has('witte-thee')) {
    return { temp: 80, tijd: has('groene-thee') ? [2, 3] : [3, 4], caf: caf,
      note: 'Laat gekookt water een minuut of vijf afkoelen tot ongeveer 80 °C. Heter water of langer trekken maakt de thee bitter.' };
  }
  if (has('zwarte-thee')) {
    return { temp: 95, tijd: [3, 4], caf: caf,
      note: 'Langer trekken maakt zwarte thee wrang. De bloemen en kruiden geven in die tijd genoeg smaak af.' };
  }
  var lo = 0, hi = 0;
  ids.forEach(function (id) { lo = Math.max(lo, BY[id].tijd[0]); hi = Math.max(hi, BY[id].tijd[1]); });
  if (has('salie')) { lo = 3; hi = 5; }
  return { temp: has('rooibos') ? 100 : 95, tijd: [lo, hi], caf: caf,
    note: has('salie') ? 'Salie wordt snel bitter: haal de kruiden er na vijf minuten uit.'
                       : 'Dek je kop of pot af tijdens het trekken, dan blijven de geuren erin.' };
}
function tijdText(t) { return t[0] === t[1] ? t[0] + ' min' : t[0] + '–' + t[1] + ' min'; }

// kijken of de mix goed is
function judge(ids) {
  var good = [], unknown = [], clash = [], warn = [];
  for (var a = 0; a < ids.length; a++) for (var b = a + 1; b < ids.length; b++) {
    var k = key(ids[a], ids[b]);
    if (CLASH[k]) clash.push([ids[a], ids[b], CLASH[k]]);
    else if (GOOD[k]) good.push([ids[a], ids[b]]);
    else unknown.push([ids[a], ids[b]]);
  }
  var bases = ids.filter(function (id) { return BY[id].c === 'basis'; });
  var strong = ids.filter(function (id) { return BY[id].kracht === 3; });
  if (bases.length > 1) warn.push('Je hebt ' + bases.length + ' soorten thee als basis. Met één basis blijft de smaak helderder.');
  if (strong.length > 1) warn.push(listNames(strong) + ' overheersen snel. Neem van elk maar een snufje.');
  var total = good.length + unknown.length + clash.length;
  var level, label;
  if (!ids.length) { level = 'plain'; label = 'Nog leeg'; }
  else if (ids.length === 1) { level = 'plain'; label = 'Kies er iets bij'; }
  else if (clash.length) { level = 'bad'; label = 'Dit botst'; }
  else if (good.length / total >= 0.6) { level = warn.length ? 'warn' : 'good'; label = warn.length ? 'Lekker, maar doseer voorzichtig' : 'Mooie melange'; }
  else if (good.length / total >= 0.3) { level = 'warn'; label = 'Kan werken, proef eerst een klein kopje'; }
  else { level = 'warn'; label = 'Onbekend terrein'; }
  return { level: level, label: label, good: good, unknown: unknown, clash: clash, warn: warn };
}
// past dit ingredient bij de rest?
function fit(id, sel) {
  if (!sel.length || sel.indexOf(id) > -1) return '';
  var g = 0, c = 0;
  sel.forEach(function (s) { var k = key(id, s); if (CLASH[k]) c++; else if (GOOD[k]) g++; });
  if (c) return 'botst';
  if (BY[id].c === 'basis' && sel.some(function (s) { return BY[s].c === 'basis'; })) return '';
  return g >= Math.ceil(sel.length / 2) ? 'past' : '';
}
