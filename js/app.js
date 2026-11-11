// de app zelf: schermen, navigatie en opslag

(function () {
  var KEY = 'teabuilder-v1', MAX = 6;
  var VIEWS = ['start', 'mixen', 'melanges', 'kast', 'mijn-thee'];
  var S, app = document.getElementById('app'), current = '', wstep = 1;
  var sheet = document.getElementById('sheet'), sheetBody = document.getElementById('sheet-body'), sheetState = null, opener = null;
  var installEvt = null, toastTimer = 0;
  var topLevel = (function () { try { return window.self === window.top; } catch (e) { return false; } })();
  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var CHEV = '<svg class="i chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';

  function defaults() {
    return {
      sel: ['groene-thee', 'jasmijn', 'roos'],
      pantry: ['groene-thee', 'jasmijn', 'roos', 'kamille'],
      favs: [],
      own: [{ id: 'vb', n: 'Roos en kamille', ing: ['kamille', 'roos', 'lindebloesem'], vb: true }],
      mood: 'alles', kan: false, cat: 'alles', intro: false, noInstall: false
    };
  }
  function known(a) { return (Array.isArray(a) ? a : []).filter(function (id) { return !!BY[id]; }); }
  function normalize(d) {
    var x = defaults();
    if (!d || typeof d !== 'object' || !Array.isArray(d.sel)) return x;
    x.sel = known(d.sel).slice(0, MAX);
    x.pantry = known(d.pantry);
    x.favs = (Array.isArray(d.favs) ? d.favs : []).filter(function (id) { return REC.some(function (r) { return r.id === id; }); });
    x.own = (Array.isArray(d.own) ? d.own : []).map(function (o) {
      return { id: String(o.id), n: String(o.n || 'Mijn melange').slice(0, 60), ing: known(o.ing), vb: !!o.vb };
    }).filter(function (o) { return o.ing.length; });
    if (typeof d.mood === 'string') x.mood = d.mood;
    if (typeof d.cat === 'string') x.cat = d.cat;
    x.kan = !!d.kan; x.intro = !!d.intro; x.noInstall = !!d.noInstall;
    return x;
  }
  function load() { try { var r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(level) { return level === 'good' ? '✓' : level === 'bad' ? '✕' : level === 'warn' ? '!' : '·'; }
  function pill(level, label) { return '<span class="pill ' + level + '"><span aria-hidden="true">' + icon(level) + '</span>' + esc(label) + '</span>'; }
  function moodLabel(m) { return MOODS.filter(function (x) { return x[0] === m; })[0][1]; }
  function catLabel(c) { return CATS.filter(function (x) { return x[0] === c; })[0][1]; }
  function recById(id) { return REC.filter(function (r) { return r.id === id; })[0]; }
  function recIds(r) { return r.ing.map(function (p) { return p[0]; }); }
  function missing(ids) { return ids.filter(function (id) { return S.pantry.indexOf(id) < 0; }); }
  function canMake() { return REC.filter(function (r) { return !missing(recIds(r)).length; }); }
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }

  // kopje tekenen
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = Math.imul(h, 31) + s.charCodeAt(i) | 0; return h; }
  function petals(ids, added) {
    var out = '';
    ids.forEach(function (id) {
      var r = rng(hash(id)), i = BY[id];
      if (id === added) out += '<g class="drop">';
      for (var k = 0; k < 3; k++) {
        var ang = r() * Math.PI * 2, rad = 8 + r() * 40;
        var x = (100 + Math.cos(ang) * rad).toFixed(1), y = (100 + Math.sin(ang) * rad).toFixed(1);
        out += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (5 + r() * 3).toFixed(1) + '" ry="' + (2.4 + r() * 1.6).toFixed(1) +
          '" transform="rotate(' + Math.round(r() * 180) + ' ' + x + ' ' + y + ')" fill="' + i.blad + '" stroke="rgba(0,0,0,.18)" stroke-width=".8"/>';
      }
      if (id === added) out += '</g>';
    });
    return out;
  }
  function cupSVG(color, ids, o) {
    o = o || {};
    return '<svg class="cup ' + (o.cls || '') + '" viewBox="0 0 220 200" ' + (o.label ? 'role="img" aria-label="' + o.label + '"' : 'aria-hidden="true"') + '>' +
      '<circle class="saucer" cx="100" cy="100" r="97"/><circle class="ring" cx="100" cy="100" r="87"/>' +
      '<rect class="handle" x="158" y="87" width="56" height="26" rx="13"/><circle class="rim" cx="100" cy="100" r="73"/>' +
      '<circle class="liquid"' + (o.live ? ' id="liquid"' : '') + ' cx="100" cy="100" r="63" fill="' + color + '"/>' +
      '<g class="' + (o.spin ? 'spin' : '') + '"' + (o.live ? ' id="petals"' : '') + '>' + petals(ids) + '</g>' + (o.live ? '<circle class="ripple" id="ripple" cx="100" cy="100" r="20"/>' : '') +
      '<ellipse cx="78" cy="74" rx="27" ry="11" transform="rotate(-36 78 74)" fill="#fff" opacity=".24"/></svg>';
  }

  // welkom scherm
  function ingredientChips(act, isOn, withFit) {
    var h = '';
    CATS.forEach(function (c) {
      h += '<div class="group"><h3>' + c[1] + '</h3><div class="chips">';
      ING.filter(function (i) { return i.c === c[0]; }).forEach(function (i) {
        h += '<button class="chip" data-act="' + act + '" data-id="' + i.id + '" aria-pressed="' + (isOn(i.id) ? 'true' : 'false') + '">' +
          '<span class="dot" style="background:' + i.blad + '"></span><span>' + i.n + '</span>' + (withFit ? '<span class="mark" aria-hidden="true"></span>' : '') + '</button>';
      });
      h += '</div></div>';
    });
    return h;
  }
  function fallHTML() {
    var cols = ['#c8587a', '#f3ebd2', '#e9c23c', '#8d74c2', '#c8587a', '#f3ebd2', '#ee9a1e', '#c8587a', '#f3ebd2'], h = '<div class="fall" aria-hidden="true">';
    cols.forEach(function (c, n) {
      h += '<span style="left:' + (4 + n * 11) + '%;background:' + c + ';animation-duration:' + (9 + (n * 5) % 7) + 's;animation-delay:-' + (n * 2.3).toFixed(1) + 's"></span>';
    });
    return h + '</div>';
  }
  function renderWelcome() {
    var ids = ['groene-thee', 'jasmijn', 'roos'], h;
    document.body.classList.add('intro');
    document.body.classList.toggle('splash', wstep === 1);
    if (wstep === 1) {
      h = fallHTML() + '<section class="view welcome"><p class="wordmark">TeaBuilder</p>' +
        '<div class="cupwrap">' + cupSVG(mixColor(partsFor(ids)), ids, { cls: 'onhero', spin: true, label: 'Kop groene thee met jasmijn en roos' }) + '</div>' +
        '<h1>Je eigen thee, bloem voor bloem.</h1>' +
        '<p class="sub">Mix gedroogde bloemen, kruiden en thee. Je ziet meteen wat samen past, in welke verhouding en hoe lang het moet trekken.</p>' +
        '<ul class="points"><li><span class="n">' + ING.length + '</span><span>bloemen, kruiden en thees</span></li>' +
        '<li><span class="n">' + REC.length + '</span><span>melanges om te proberen</span></li>' +
        '<li><span class="n">∞</span><span>eigen recepten om te bewaren</span></li></ul>' +
        '<button class="btn primary big" data-act="w-next">Beginnen</button><p class="ded">for Tuana, from Serkan</p></section>';
    } else {
      h = '<section class="view pick"><p class="step">Stap 2 van 2</p><h1 class="title">Wat staat er in je kast?</h1>' +
        '<p class="lead">Tik aan wat je in huis hebt. Dan zie je straks welke melanges je meteen kunt zetten. Je past dit later aan bij Kast.</p>' +
        ingredientChips('w-pantry', function (id) { return S.pantry.indexOf(id) > -1; }) +
        '<div class="donebar"><button class="btn primary big" data-act="w-done" style="flex:1">Klaar</button>' +
        '<button class="linkbtn" data-act="w-done">Overslaan</button></div></section>';
    }
    app.innerHTML = h;
    app.querySelector('.view').classList.add('enter');
    window.scrollTo(0, 0);
  }

  // startpagina
  function greet() { var h = new Date().getHours(); return h >= 5 && h < 12 ? 'Goedemorgen' : h >= 12 && h < 18 ? 'Goedemiddag' : 'Goedenavond'; }
  function moment() {
    var d = new Date(), h = d.getHours();
    var pool = REC.filter(function (r) { var caf = zet(recIds(r)).caf; return (h >= 17 || h < 5) ? !caf : h < 12 ? caf : true; });
    var can = pool.filter(function (r) { return !missing(recIds(r)).length; });
    var list = can.length ? can : pool;
    var day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    return list[day % list.length];
  }
  function installCard() {
    if (standalone || !topLevel || S.noInstall || (!installEvt && !isIOS)) return '';
    return '<section class="install"><h2>Zet TeaBuilder op je startscherm</h2>' +
      (installEvt ? '<p class="note">Dan opent hij zoals een gewone app, ook zonder internet.</p>'
                  : '<p class="note">Tik in Safari op de deelknop en kies ‘Zet op beginscherm’. Dan opent hij zoals een gewone app, ook zonder internet.</p>') +
      '<div class="actions">' + (installEvt ? '<button class="btn primary small" data-act="install">Installeren</button>' : '') +
      '<button class="linkbtn" data-act="noinstall">Niet nu</button></div></section>';
  }
  var choiceN = 0;
  function choice(href, ic, title, text) {
    return '<a class="choice" style="--i:' + (choiceN++) + '" href="' + href + '"><span class="ic">' + ic + '</span><span class="tx"><b>' + title + '</b><small>' + text + '</small></span>' + CHEV + '</a>';
  }
  function navIcon(tab) { return document.querySelector('.nav a[data-tab="' + tab + '"] svg').outerHTML; }
  function renderStart() {
    var m = moment(), can = canMake().length, own = S.own.length, favs = S.favs.length;
    choiceN = 0;
    var h = '<section class="hero"><span class="glow" style="--glow:' + mixColor(m.ing) + '"></span>' +
      '<div class="hero-top"><div><p class="wordmark">TeaBuilder</p><p class="greet">' + greet() + '</p></div>' +
      '<div class="cupwrap">' + cupSVG(mixColor(m.ing), recIds(m), { cls: 'onhero', spin: true }) + '</div></div>' +
      '<h1>Wat zit er vandaag in je kop?</h1>' +
      '<p class="sub">Mix gedroogde bloemen, kruiden en thee, en zie meteen wat samen past.</p>' +
      '<button class="moment" data-act="rec" data-id="' + m.id + '"><span><span class="k">Thee voor dit moment</span><span class="nm">' + m.n + '</span></span>' +
      '<span class="go">Bekijk recept' + CHEV + '</span></button></section>';
    h += '<section class="group"><h2>Waar wil je beginnen?</h2><div class="choices">' +
      choice('#mixen', navIcon('mixen'), 'Zelf mixen', 'Kies wat er in je kop gaat en zie wat past of botst.') +
      choice('#melanges', navIcon('melanges'), 'Melanges ontdekken', REC.length + ' recepten, van Jasmijnparel tot Rozenchai.') +
      choice('#kast', navIcon('kast'), 'Mijn kruidenkast', S.pantry.length + ' van ' + ING.length + ' in huis. ' + (can ? 'Daarmee zet je nu ' + can + (can === 1 ? ' melange.' : ' melanges.') : 'Vink aan wat je hebt.')) +
      choice('#mijn-thee', navIcon('mijn-thee'), 'Mijn thee', own + (own === 1 ? ' eigen melange' : ' eigen melanges') + ' en ' + favs + (favs === 1 ? ' favoriet.' : ' favorieten.')) +
      '</div></section>';
    h += '<section class="group"><h2>Of kies op gevoel</h2><div class="chips">' +
      MOODS.concat([['cafvrij', 'Zonder cafeïne']]).map(function (f) {
        return '<button class="chip filter" data-act="gomood" data-id="' + f[0] + '">' + f[1] + '</button>';
      }).join('') + '</div></section>';
    h += installCard();
    h += '<p class="ded">for Tuana, from Serkan</p>';
    h += '<p class="smallprint">Dit is smaakadvies, geen medisch advies. Ben je zwanger, geef je borstvoeding of neem je medicatie? Vraag het dan eerst na bij je arts of apotheker. Gebruik alleen gedroogde bloemen die bedoeld zijn om te eten of te drinken: bloemen van de bloemist zijn vaak bespoten.</p>';
    app.innerHTML = '<div class="view">' + h + '</div>';
  }

  // mixen
  function renderMixen() {
    var h = '<div class="cupbar"><div class="cupwrap">' + cupSVG('#dfe9e6', [], { live: true, label: 'Kop met de kleur van je melange' }) + '</div>' +
      '<div class="what"><h1 class="mixname" id="mixname"></h1><span id="verdict"></span></div>' +
      '<button class="linkbtn" data-act="clear">Leegmaken</button></div>' +
      '<div class="group"><h2>Wat gaat er in je kop?</h2>' +
      '<p class="legend"><span><b class="g">✓</b> past bij wat je al koos</span><span><b class="b">✕</b> botst ermee</span></p>' +
      '<p class="hint" id="hint" role="status"></p></div>' +
      ingredientChips('toggle', function () { return false; }, true) +
      '<div id="result" class="group" style="gap:20px"></div>';
    app.innerHTML = '<div class="view">' + h + '</div>';
    updateMix();
  }
  function updateMix(hint, added) {
    var ids = S.sel, j = judge(ids);
    document.getElementById('liquid').setAttribute('fill', mixColor(partsFor(ids)));
    document.getElementById('petals').innerHTML = petals(ids, added);
    if (added) { var rp = document.getElementById('ripple'); rp.classList.remove('go'); rp.getBoundingClientRect(); rp.classList.add('go'); }
    document.getElementById('mixname').textContent = ids.length ? listNames(ids) : 'Een lege kop';
    document.getElementById('verdict').innerHTML = pill(j.level, j.label);
    document.getElementById('hint').textContent = hint || '';
    app.querySelectorAll('.chip[data-act="toggle"]').forEach(function (b) {
      var id = b.getAttribute('data-id'), on = ids.indexOf(id) > -1, f = fit(id, ids);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('data-fit', f);
      b.querySelector('.mark').textContent = f === 'past' ? '✓' : f === 'botst' ? '✕' : '';
      b.setAttribute('aria-label', BY[id].n + (f === 'past' ? ', past erbij' : f === 'botst' ? ', botst' : ''));
    });
    document.getElementById('result').innerHTML = resultHTML(ids, j);
  }
  function pairText(p) { return listNames([p[0], p[1]]); }
  function factsHTML(temp, tijd, caf) {
    return '<div class="facts"><div class="fact"><div class="v">' + temp + ' °C</div><div class="k">water</div></div>' +
      '<div class="fact"><div class="v">' + tijdText(tijd) + '</div><div class="k">trekken</div></div>' +
      '<div class="fact"><div class="v">' + (caf ? 'Ja' : 'Nee') + '</div><div class="k">cafeïne</div></div></div>';
  }
  function adviesHTML(pairs, z) {
    var h = factsHTML(z.temp, z.tijd, z.caf) + '<ul class="parts">';
    pairs.forEach(function (p) { h += '<li><span class="amt">' + delenText(p[1]) + '</span><span>' + BY[p[0]].n + '</span></li>'; });
    return h + '</ul>';
  }
  function cautions(ids) {
    return ids.filter(function (id) { return BY[id].letop && BY[id].letop !== 'Bevat cafeïne.'; })
      .map(function (id) { return '<p class="caution"><b>' + BY[id].n + ':</b> ' + BY[id].letop + '</p>'; }).join('');
  }
  function resultHTML(ids, j) {
    if (!ids.length) return '<p class="empty">Tik hierboven een bloem, kruid of thee aan om te beginnen.</p>';
    var z = zet(ids), h = '';
    h += '<section class="panel"><h2>Zo zet je deze thee</h2>' + adviesHTML(partsFor(ids), z) +
      '<p class="note">' + z.note + '</p>' +
      '<p class="note">Een deel is ongeveer een theelepel. Reken op één volle theelepel melange per kop van 250 ml. Bij luchtige bloemen mag dat een eetlepel zijn.</p>' +
      cautions(ids) + '</section>';
    if (ids.length > 1) {
      h += '<section class="panel"><h2>Hoe past dit samen?</h2><div class="lines">';
      j.clash.forEach(function (c) { h += '<p class="line bad"><span class="ic" aria-hidden="true">✕</span><span><b>' + pairText(c) + '.</b> ' + c[2] + '</span></p>'; });
      j.warn.forEach(function (w) { h += '<p class="line warn"><span class="ic" aria-hidden="true">!</span><span>' + w + '</span></p>'; });
      if (j.good.length) h += '<p class="line good"><span class="ic" aria-hidden="true">✓</span><span><b>Beproefd:</b> ' + j.good.map(pairText).join(' · ') + '</span></p>';
      if (j.unknown.length) h += '<p class="line plain"><span class="ic" aria-hidden="true">·</span><span><b>Zelf uitproberen:</b> ' + j.unknown.map(pairText).join(' · ') + '</span></p>';
      h += '</div></section>';
    }
    h += '<section class="panel"><h2>Bewaar deze melange</h2><form class="saverow" data-form="save">' +
      '<input id="mix-naam" name="naam" type="text" maxlength="60" autocomplete="off" aria-label="Naam van je melange" placeholder="Geef ze een naam">' +
      '<button class="btn primary" type="submit">Bewaar in Mijn thee</button></form></section>';
    return h;
  }

  // melanges
  function mini(r, n) {
    var ids = recIds(r), z = zet(ids), miss = missing(ids), fav = S.favs.indexOf(r.id) > -1;
    return '<button class="mcard" style="--i:' + Math.min(n || 0, 10) + '" data-act="rec" data-id="' + r.id + '">' + cupSVG(mixColor(r.ing), ids) +
      '<span class="nm">' + r.n + '</span><span class="meta">' + moodLabel(r.mood[0]) + ' · ' + (z.caf ? 'met cafeïne' : 'zonder cafeïne') + '</span>' +
      '<span class="status' + (miss.length ? '' : ' ok') + '">' + (miss.length ? 'Nog ' + miss.length + ' nodig' : '<span aria-hidden="true">✓</span> Alles in huis') + '</span>' +
      (fav ? '<span class="favmark" role="img" aria-label="Favoriet">♥</span>' : '') + '</button>';
  }
  function renderMelanges() {
    var filters = [['alles', 'Alles']].concat(MOODS, [['cafvrij', 'Zonder cafeïne']]);
    var list = REC.filter(function (r) {
      var ids = recIds(r);
      if (S.kan && missing(ids).length) return false;
      if (S.mood === 'alles') return true;
      if (S.mood === 'cafvrij') return !zet(ids).caf;
      return r.mood.indexOf(S.mood) > -1;
    });
    app.innerHTML = '<div class="view"><h1 class="title">Melanges</h1>' +
      '<div class="chips">' + filters.map(function (f) {
        return '<button class="chip filter" data-act="mood" data-id="' + f[0] + '" aria-pressed="' + (S.mood === f[0]) + '">' + f[1] + '</button>';
      }).join('') + '</div>' +
      '<label class="setrow" for="kan"><span>Alleen wat ik nu in huis heb</span><span class="switch"><input type="checkbox" id="kan" data-change="kan"' + (S.kan ? ' checked' : '') + '><span></span></span></label>' +
      (list.length ? '<div class="grid">' + list.map(mini).join('') + '</div>' :
        '<p class="empty">Geen melange gevonden. Vink bij <a href="#kast">Kast</a> aan wat je in huis hebt, of kies een andere filter.</p>') + '</div>';
  }
  function recSheet(r) {
    var ids = recIds(r), z = zet(ids), miss = missing(ids), fav = S.favs.indexOf(r.id) > -1;
    var tags = r.mood.map(moodLabel); tags.push(z.caf ? 'Met cafeïne' : 'Zonder cafeïne');
    return '<div class="sheethead">' + cupSVG(mixColor(r.ing), ids) + '<div><h2 class="title" id="sheet-title">' + r.n + '</h2>' +
      '<p class="tags">' + tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</p></div></div>' +
      '<p>' + r.tekst + '</p><div class="panel">' + adviesHTML(r.ing, z) + '<p class="note">' + z.note + '</p>' + cautions(ids) + '</div>' +
      '<p>' + (miss.length ? '<span class="note">Nog nodig: ' + listNames(miss).toLowerCase() + '.</span>' : pill('good', 'Alles in huis')) + '</p>' +
      '<div class="actions"><button class="btn primary" data-act="open" data-ids="' + ids.join(',') + '">Open in mixer</button>' +
      '<button class="btn" data-act="fav" data-id="' + r.id + '" aria-pressed="' + fav + '">' + (fav ? '♥ Favoriet' : '♡ Favoriet') + '</button>' +
      '<button class="btn" data-act="copy" data-rec="' + r.id + '">Kopieer recept</button></div>';
  }

  // kast
  function partners(id) { return ING.filter(function (o) { return o.id !== id && GOOD[key(id, o.id)]; }); }
  function renderKast() {
    var can = canMake().length;
    var h = '<h1 class="title">Mijn kruidenkast</h1>' +
      '<p class="lead" id="kast-count">' + kastCount(can) + '</p>' +
      '<div class="chips">' + [['alles', 'Alles']].concat(CATS).map(function (c) {
        return '<button class="chip filter" data-act="cat" data-id="' + c[0] + '" aria-pressed="' + (S.cat === c[0]) + '">' + c[1] + '</button>';
      }).join('') + '</div><div class="rows">';
    ING.filter(function (i) { return S.cat === 'alles' || i.c === S.cat; }).forEach(function (i) {
      h += '<div class="row"><button class="rowmain" data-act="herb" data-id="' + i.id + '"><span class="dot" style="background:' + i.blad + '"></span>' +
        '<span><b>' + i.n + '</b><small>' + i.smaak + '</small></span></button>' +
        '<label class="switch"><input type="checkbox" id="huis-' + i.id + '" data-change="pantry" data-id="' + i.id + '" aria-label="' + i.n + ' in huis"' +
        (S.pantry.indexOf(i.id) > -1 ? ' checked' : '') + '><span></span></label></div>';
    });
    app.innerHTML = '<div class="view">' + h + '</div></div>';
  }
  function kastCount(can) {
    return S.pantry.length + ' van ' + ING.length + ' in huis. ' + (can ? 'Daarmee zet je nu ' + can + (can === 1 ? ' melange.' : ' melanges.') : 'Zet aan wat je hebt en zie bij Melanges wat je kunt zetten.');
  }
  function herbSheet(i) {
    var p = partners(i.id), has = S.pantry.indexOf(i.id) > -1;
    return '<div class="sheethead"><span class="bigdot" style="background:' + i.blad + '"></span><div><h2 class="title" id="sheet-title">' + i.n + '</h2>' +
      '<p class="tags"><span>' + catLabel(i.c) + '</span><span>' + (has ? 'In huis' : 'Niet in huis') + '</span></p></div></div>' +
      '<p>' + i.smaak + '</p><div class="panel">' + factsHTML(i.temp, i.tijd, i.caf) + '<p class="note">' + i.tip + '</p>' +
      (i.letop && i.letop !== 'Bevat cafeïne.' ? '<p class="caution">' + i.letop + '</p>' : '') + '</div>' +
      '<div class="group"><h3>Past bij</h3><div class="chips">' + p.map(function (o) {
        return '<span class="tag"><span class="dot" style="background:' + o.blad + '"></span>' + o.n + '</span>';
      }).join('') + '</div></div>' +
      '<div class="actions"><button class="btn primary" data-act="open" data-ids="' + i.id + '">Begin een mix met ' + i.n.toLowerCase() + '</button>' +
      '<button class="btn" data-act="pantry-toggle" data-id="' + i.id + '">' + (has ? 'Haal uit mijn kast' : 'Zet in mijn kast') + '</button></div>';
  }

  // mijn thee
  function ownCard(o) {
    var z = zet(o.ing), j = judge(o.ing);
    return '<article class="card"><div class="top">' + cupSVG(mixColor(partsFor(o.ing)), o.ing) +
      '<div><h2 class="nm">' + esc(o.n) + '</h2><p class="tags">' + (o.vb ? '<span>Voorbeeld</span>' : '') + '<span>' + (z.caf ? 'Met cafeïne' : 'Zonder cafeïne') + '</span></p></div></div>' +
      adviesHTML(partsFor(o.ing), z) + '<p>' + pill(j.level, j.label) + '</p>' +
      '<div class="actions"><button class="btn small" data-act="open" data-ids="' + o.ing.join(',') + '">Open in mixer</button>' +
      '<button class="btn small" data-act="copy" data-own="' + esc(o.id) + '">Kopieer recept</button>' +
      '<button class="btn small" data-act="del" data-id="' + esc(o.id) + '">Verwijder</button></div></article>';
  }
  function renderMijn() {
    var favs = REC.filter(function (r) { return S.favs.indexOf(r.id) > -1; });
    app.innerHTML = '<div class="view"><h1 class="title">Mijn thee</h1>' +
      '<p class="lead">Je melanges staan op dit toestel bewaard. Wil je er een doorsturen of elders bijhouden? Gebruik dan Kopieer recept.</p>' +
      '<div class="group"><h3>Eigen melanges</h3>' + (S.own.length ? '<div class="cards">' + S.own.map(ownCard).join('') + '</div>' :
        '<p class="empty">Nog niets bewaard. Stel bij <a href="#mixen">Mixen</a> een kop samen en bewaar ze onderaan.</p>') + '</div>' +
      '<div class="group"><h3>Favorieten</h3>' + (favs.length ? '<div class="grid">' + favs.map(mini).join('') + '</div>' :
        '<p class="empty">Open een <a href="#melanges">melange</a> en tik op Favoriet om ze hier te zetten.</p>') + '</div></div>';
  }

  // popup onderaan
  function openSheet(kind, id, from) {
    if (from) opener = from;
    sheetState = { kind: kind, id: id };
    sheetBody.innerHTML = kind === 'rec' ? recSheet(recById(id)) : herbSheet(BY[id]);
    if (sheet.hidden) {
      sheet.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      var box = document.getElementById('sheetbox'); box.scrollTop = 0; box.focus();
    }
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true; sheetState = null;
    document.documentElement.style.overflow = '';
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  }

  // navigatie + clicks
  function render() {
    ({ 'start': renderStart, 'mixen': renderMixen, 'melanges': renderMelanges, 'kast': renderKast, 'mijn-thee': renderMijn })[current]();
  }
  function route() {
    if (!S.intro) { renderWelcome(); return; }
    document.body.classList.remove('intro', 'splash');
    var h = location.hash.replace('#', '');
    if (h === 'kruiden') h = 'kast';
    var next = VIEWS.indexOf(h) > -1 ? h : 'start', changed = next !== current;
    current = next;
    closeSheet();
    document.querySelectorAll('.nav a').forEach(function (a) {
      if (a.getAttribute('data-tab') === current) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    render();
    if (changed) { app.querySelector('.view').classList.add('enter'); window.scrollTo(0, 0); }
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function recipeText(name, pairs) {
    var z = zet(pairs.map(function (p) { return p[0]; }));
    return name + '\n' + pairs.map(function (p) { return delenText(p[1]) + ' ' + BY[p[0]].n.toLowerCase(); }).join('\n') +
      '\n' + z.temp + ' °C, ' + tijdText(z.tijd) + ' laten trekken';
  }
  function togglePantry(id, on) {
    var k = S.pantry.indexOf(id);
    if (on && k < 0) S.pantry.push(id); else if (!on && k > -1) S.pantry.splice(k, 1);
    save();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id'), k;
    if (act === 'toggle') {
      var hint = ''; k = S.sel.indexOf(id);
      if (k > -1) S.sel.splice(k, 1);
      else if (S.sel.length >= MAX) hint = 'Meer dan ' + MAX + ' ingrediënten in één kop wordt troebel van smaak. Haal er eerst eentje uit.';
      else { S.sel.push(id); k = -2; }
      save(); updateMix(hint, k === -2 ? id : null);
    } else if (act === 'clear') { S.sel = []; save(); updateMix(); }
    else if (act === 'mood') { S.mood = id; save(); renderMelanges(); }
    else if (act === 'gomood') { S.mood = id; S.kan = false; save(); go('#melanges'); }
    else if (act === 'cat') { S.cat = id; save(); renderKast(); }
    else if (act === 'rec' || act === 'herb') { openSheet(act, id, b); }
    else if (act === 'close') { closeSheet(); }
    else if (act === 'msg-close') { hideMsg(); }
    else if (act === 'fav') {
      k = S.favs.indexOf(id); if (k > -1) S.favs.splice(k, 1); else S.favs.push(id);
      save(); render(); if (sheetState) openSheet(sheetState.kind, sheetState.id);
      toast(k > -1 ? 'Uit je favorieten gehaald' : 'Bij je favorieten gezet');
    } else if (act === 'pantry-toggle') {
      togglePantry(id, S.pantry.indexOf(id) < 0); render(); if (sheetState) openSheet(sheetState.kind, sheetState.id);
    } else if (act === 'open') {
      S.sel = b.getAttribute('data-ids').split(',').slice(0, MAX); save();
      closeSheet(); go('#mixen'); window.scrollTo(0, 0);
    } else if (act === 'del') {
      S.own = S.own.filter(function (o) { return o.id !== id; }); save(); renderMijn(); toast('Melange verwijderd');
    } else if (act === 'copy') {
      var text, rid = b.getAttribute('data-rec'), oid = b.getAttribute('data-own');
      if (rid) { var r = recById(rid); text = recipeText(r.n, r.ing); }
      else { var o = S.own.filter(function (x) { return x.id === oid; })[0]; text = recipeText(o.n, partsFor(o.ing)); }
      try { navigator.clipboard.writeText(text).then(function () { toast('Recept gekopieerd'); }, function () { toast('Kopiëren lukte niet'); }); }
      catch (err) { toast('Kopiëren lukte niet'); }
    } else if (act === 'w-next') { wstep = 2; renderWelcome(); }
    else if (act === 'w-pantry') {
      var on = S.pantry.indexOf(id) < 0; togglePantry(id, on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    } else if (act === 'w-done') { S.intro = true; save(); current = ''; go('#start'); }
    else if (act === 'install') {
      if (installEvt) { try { installEvt.prompt(); } catch (err) { } installEvt = null; renderStart(); }
    } else if (act === 'noinstall') { S.noInstall = true; save(); renderStart(); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target, kind = t.getAttribute && t.getAttribute('data-change'); if (!kind) return;
    if (kind === 'kan') { S.kan = t.checked; save(); renderMelanges(); var k = document.getElementById('kan'); if (k) k.focus(); }
    else if (kind === 'pantry') {
      togglePantry(t.getAttribute('data-id'), t.checked);
      var c = document.getElementById('kast-count'); if (c) c.textContent = kastCount(canMake().length);
    }
  });
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.getAttribute('data-form') !== 'save' || !S.sel.length) return;
    var input = document.getElementById('mix-naam');
    var name = input.value.trim() || listNames(S.sel);
    S.own.unshift({ id: 'm' + Date.now().toString(36), n: name.slice(0, 60), ing: S.sel.slice(), vb: false });
    save(); input.value = ''; toast('Bewaard in Mijn thee');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  window.addEventListener('hashchange', route);
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; if (S && S.intro && current === 'start') renderStart(); });

  // service worker voor de pwa
  if (topLevel && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); });
  }

  // berichtjes van Serkan: de eerste na 1 minuut, daarna om de 5 minuten, in willekeurige volgorde
  var msgEl = document.getElementById('msg'), msgTimer = 0, msgBag = [], lastMsg = '';
  function hideMsg() {
    clearTimeout(msgTimer);
    if (msgEl.hidden) return;
    msgEl.classList.add('out');
    setTimeout(function () { msgEl.hidden = true; msgEl.classList.remove('out'); }, 300);
  }
  function showMsg() {
    if (!S.intro || document.hidden) return;
    if (!msgBag.length) {
      // alle berichten door elkaar schudden, pas herhalen als ze allemaal geweest zijn
      msgBag = BERICHTEN.slice();
      for (var i = msgBag.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = msgBag[i]; msgBag[i] = msgBag[j]; msgBag[j] = t; }
      if (msgBag.length > 1 && msgBag[msgBag.length - 1] === lastMsg) msgBag.unshift(msgBag.pop());
    }
    lastMsg = msgBag.pop();
    document.getElementById('msg-text').textContent = lastMsg;
    msgEl.classList.remove('out'); msgEl.hidden = false;
    clearTimeout(msgTimer); msgTimer = setTimeout(hideMsg, 7000);
  }
  setTimeout(function () { showMsg(); setInterval(showMsg, 5 * 60 * 1000); }, 60 * 1000);

  S = normalize(load());
  route();
})();
