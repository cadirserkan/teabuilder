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
  var teer = ids.filter(function (id) { return BY[id].eigen && BY[id].temp < 90; })[0];
  if (teer) {
    return { temp: BY[teer].temp, tijd: BY[teer].tijd, caf: caf,
      note: BY[teer].n + ' kan niet tegen kokend water. Laat het water eerst even afkoelen.' };
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

// ---- eigen kruiden ----
var TG = {}, TB = {};
TYPE_GOED.forEach(function (t) { TG[key(t[0], t[1])] = true; });
TYPE_BOTST.forEach(function (t) { TB[key(t[0], t[1])] = t[2]; });
function typeVan(i) { return i.p || TYPE[i.id] || 'zacht'; }

// theekleur afleiden van de kleur van het kruid
function tint(hex) {
  var a = hexToRgb(hex), b = hexToRgb('#e9d992');
  function h(k) { var s = Math.round(a[k] * 0.35 + b[k] * 0.65).toString(16); return s.length < 2 ? '0' + s : s; }
  return '#' + h(0) + h(1) + h(2);
}
// van wat de gebruiker invult een volledig ingredient maken
function maakEigen(o) {
  var basis = o.c === 'basis';
  var label = TYPES.filter(function (t) { return t[0] === o.p; })[0];
  return {
    id: o.id, n: o.n, c: o.c, p: basis ? 'thee' : o.p, eigen: true, foto: o.foto || '',
    deel: basis ? 3 : o.sterkte === 1 ? 2 : o.sterkte === 2 ? 1 : 0.5, kracht: o.sterkte, kk: 1,
    inf: tint(o.blad), blad: o.blad, temp: o.temp, tijd: o.tijd, caf: !!o.caf,
    smaak: basis ? 'Eigen thee.' : (label ? label[1] : 'Eigen kruid') + '.', tip: ''
  };
}
// checken met welke andere ingredienten het past of botst
function koppel(nieuw) {
  ING.forEach(function (o) {
    if (o.id === nieuw.id) return;
    var t = key(typeVan(nieuw), typeVan(o)), k = key(nieuw.id, o.id);
    if (TB[t]) CLASH[k] = TB[t]; else if (TG[t]) GOOD[k] = true;
  });
}
function voegToe(o) { var i = maakEigen(o); ING.push(i); BY[i.id] = i; koppel(i); return i; }
function haalWeg(id) {
  ING = ING.filter(function (i) { return i.id !== id; });
  delete BY[id];
  Object.keys(GOOD).concat(Object.keys(CLASH)).forEach(function (k) {
    if (k.split('|').indexOf(id) > -1) { delete GOOD[k]; delete CLASH[k]; }
  });
}
