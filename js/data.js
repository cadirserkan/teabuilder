// alle data: ingredienten, combinaties en melanges
var CATS = [
  ['basis', 'Thee als basis'],
  ['bloem', 'Bloemen'],
  ['kruid', 'Kruiden'],
  ['fruit', 'Fruit en specerijen']
];

// deel = hoeveel delen in een mix (0.5 is een snufje), kracht 3 = sterke smaak, kk = hoe hard het kleurt
var ING = [
  { id:'groene-thee', n:'Groene thee', c:'basis', deel:3, kracht:2, kk:2, inf:'#cbd46e', blad:'#6f8f4a', temp:80, tijd:[2,3], caf:true,
    smaak:'Fris en grassig, met een licht bittertje.', tip:'Giet er nooit kokend water op. Laat het eerst vijf minuten afkoelen.', letop:'Bevat cafeïne.' },
  { id:'witte-thee', n:'Witte thee', c:'basis', deel:3, kracht:1, kk:1, inf:'#ebdda6', blad:'#b9c2a0', temp:80, tijd:[3,4], caf:true,
    smaak:'Zacht en zoetig, een beetje als hooi en honing.', tip:'De fijnste basis voor bloemen: ze overstemt niets.', letop:'Bevat cafeïne.' },
  { id:'zwarte-thee', n:'Zwarte thee', c:'basis', deel:3, kracht:2, kk:4, inf:'#9c4a1f', blad:'#4a2e22', temp:95, tijd:[3,4], caf:true,
    smaak:'Vol en moutig.', tip:'Kan tegen stevige smaken zoals kaneel en kardemom.', letop:'Bevat cafeïne.' },
  { id:'rooibos', n:'Rooibos', c:'basis', deel:3, kracht:1, kk:4, inf:'#b4521f', blad:'#a8482a', temp:100, tijd:[5,7], caf:false,
    smaak:'Zoet, rond en nootachtig, zonder bitterheid.', tip:'Wordt nooit bitter, ook niet na tien minuten trekken.' },

  { id:'jasmijn', n:'Jasmijn', c:'bloem', deel:1, kracht:2, kk:1, inf:'#eedf9c', blad:'#f3ebd2', temp:80, tijd:[2,3], caf:false,
    smaak:'Zoet en bedwelmend bloemig.', tip:'Een beetje volstaat: te veel jasmijn smaakt naar parfum.' },
  { id:'roos', n:'Roos', c:'bloem', deel:2, kracht:1, kk:1, inf:'#edb9b2', blad:'#c8587a', temp:90, tijd:[4,5], caf:false,
    smaak:'Zacht bloemig en licht zoet.', tip:'Knopjes geven meer smaak af als je ze even openknijpt.' },
  { id:'kamille', n:'Kamille', c:'bloem', deel:2, kracht:1, kk:2, inf:'#ebc94b', blad:'#e9c23c', temp:95, tijd:[5,7], caf:false,
    smaak:'Rond en honingzoet, met iets van appel.', tip:'Dek je kop af tijdens het trekken, dan blijft de geur erin.',
    letop:'Kan een reactie geven als je allergisch bent voor composieten zoals bijvoet of ambrosia.' },
  { id:'lavendel', n:'Lavendel', c:'bloem', deel:0.5, kracht:3, kk:1, inf:'#d6c7dc', blad:'#8d74c2', temp:90, tijd:[3,4], caf:false,
    smaak:'Krachtig bloemig en kruidig.', tip:'Echt maar een snufje: te veel smaakt naar zeep.' },
  { id:'hibiscus', n:'Hibiscus', c:'bloem', deel:1, kracht:3, kk:8, inf:'#b01238', blad:'#9c1740', temp:95, tijd:[5,7], caf:false,
    smaak:'Fris zuur en fruitig, zoals veenbes.', tip:'Kleurt alles dieprood. Ook lekker koud met wat honing.',
    letop:'Vraag het eerst na bij zwangerschap of als je bloeddrukmedicatie neemt.' },
  { id:'lindebloesem', n:'Lindebloesem', c:'bloem', deel:2, kracht:1, kk:1, inf:'#e8d47c', blad:'#c9c36a', temp:95, tijd:[5,8], caf:false,
    smaak:'Zacht en honingzoet.', tip:'Mag lang trekken zonder bitter te worden.' },
  { id:'oranjebloesem', n:'Oranjebloesem', c:'bloem', deel:1, kracht:2, kk:1, inf:'#f1e0a2', blad:'#f2e3c0', temp:90, tijd:[4,5], caf:false,
    smaak:'Zoet bloemig met een vleugje citrus.', tip:'Geeft een melange meteen iets feestelijks.' },
  { id:'vlierbloesem', n:'Vlierbloesem', c:'bloem', deel:2, kracht:1, kk:1, inf:'#ecdc8e', blad:'#efe6b8', temp:95, tijd:[5,7], caf:false,
    smaak:'Lichtzoet, met een muskaatachtige geur.', tip:'Past bij alles wat fris is.' },
  { id:'goudsbloem', n:'Goudsbloem', c:'bloem', deel:1, kracht:1, kk:2, inf:'#f0bb3c', blad:'#ee9a1e', temp:95, tijd:[5,7], caf:false,
    smaak:'Mild en licht peperig.', tip:'Geeft vooral een warme gouden kleur aan je mix.' },
  { id:'korenbloem', n:'Korenbloem', c:'bloem', deel:0.5, kracht:1, kk:0.5, inf:'#e4dfc0', blad:'#4467c8', temp:95, tijd:[5,5], caf:false,
    smaak:'Heeft bijna geen smaak.', tip:'Zit erin voor het oog: de blauwe blaadjes maken elke melange mooi.' },
  { id:'vlinderbloem', n:'Vlinderbloem', c:'bloem', deel:1, kracht:1, kk:12, inf:'#2f4eb8', blad:'#3540a8', temp:95, tijd:[4,6], caf:false,
    smaak:'Mild en licht aards.', tip:'Kleurt je thee felblauw. Een scheutje citroensap maakt hem paars.' },
  { id:'chrysant', n:'Chrysant', c:'bloem', deel:1, kracht:1, kk:1, inf:'#edd968', blad:'#f0d24e', temp:95, tijd:[3,5], caf:false,
    smaak:'Zacht, honingachtig en licht kruidig.', tip:'Een klassieker bij groene thee. De bloemen gaan mooi open in een glas.' },

  { id:'munt', n:'Munt', c:'kruid', deel:1, kracht:2, kk:1, inf:'#c7d17c', blad:'#4e8f5e', temp:95, tijd:[4,6], caf:false,
    smaak:'Fris en verkoelend.', tip:'Nanamunt is zachter en zoeter dan pepermunt.' },
  { id:'citroenmelisse', n:'Citroenmelisse', c:'kruid', deel:2, kracht:1, kk:1, inf:'#dad78c', blad:'#8fb05a', temp:95, tijd:[5,7], caf:false,
    smaak:'Zacht citroenachtig en lichtzoet.', tip:'Verliest snel haar geur: bewaar ze goed afgesloten.' },
  { id:'citroenverbena', n:'Citroenverbena', c:'kruid', deel:1, kracht:2, kk:1, inf:'#d6da7a', blad:'#a5bf4e', temp:95, tijd:[5,7], caf:false,
    smaak:'Helder citroen, zoeter dan citroenmelisse.', tip:'Een paar blaadjes per kop is genoeg.' },
  { id:'salie', n:'Salie', c:'kruid', deel:0.5, kracht:3, kk:1, inf:'#cbc58c', blad:'#9aa88e', temp:95, tijd:[3,5], caf:false,
    smaak:'Warm, kruidig en licht bitter.', tip:'Kort laten trekken, anders wordt het bitter.',
    letop:'Niet elke dag in grote hoeveelheden. Af te raden bij zwangerschap en borstvoeding.' },
  { id:'citroengras', n:'Citroengras', c:'kruid', deel:1, kracht:2, kk:1, inf:'#e1dd8c', blad:'#c9cf7a', temp:95, tijd:[5,7], caf:false,
    smaak:'Fris citroen met iets van gember.', tip:'Lekker als ijsthee.' },

  { id:'rozenbottel', n:'Rozenbottel', c:'fruit', deel:2, kracht:2, kk:3, inf:'#d6623c', blad:'#c8432a', temp:95, tijd:[7,10], caf:false,
    smaak:'Zuur-fruitig en vol.', tip:'Heeft tijd nodig: laat minstens zeven minuten trekken.' },
  { id:'gember', n:'Gember', c:'fruit', deel:0.5, kracht:3, kk:1, inf:'#e8c96c', blad:'#d9b26a', temp:95, tijd:[5,8], caf:false,
    smaak:'Pittig en verwarmend.', tip:'Gedroogde gember is scherper dan verse: begin met weinig.' },
  { id:'kaneel', n:'Kaneel', c:'fruit', deel:0.5, kracht:3, kk:3, inf:'#ba723c', blad:'#9a5a2e', temp:95, tijd:[5,8], caf:false,
    smaak:'Zoet, warm en houtig.', tip:'Breek het stokje in stukjes voor meer smaak.',
    letop:'Cassiakaneel liever niet dagelijks in grote hoeveelheden.' },
  { id:'sinaasappelschil', n:'Sinaasappelschil', c:'fruit', deel:1, kracht:2, kk:1, inf:'#eeba5c', blad:'#ee8e2e', temp:95, tijd:[5,7], caf:false,
    smaak:'Zoete citrus met een licht bittertje.', tip:'Neem schil van onbespoten sinaasappels.' },
  { id:'citroenschil', n:'Citroenschil', c:'fruit', deel:1, kracht:2, kk:1, inf:'#efdf7c', blad:'#f0d84a', temp:95, tijd:[5,7], caf:false,
    smaak:'Fris en scherp citrus.', tip:'Neem schil van onbespoten citroenen.' },
  { id:'appel', n:'Appel', c:'fruit', deel:2, kracht:1, kk:1, inf:'#e4c27a', blad:'#e5c79a', temp:95, tijd:[7,10], caf:false,
    smaak:'Zacht zoet en fruitig.', tip:'Gedroogde stukjes maken een zure melange ronder.' },
  { id:'kardemom', n:'Kardemom', c:'fruit', deel:0.5, kracht:3, kk:1, inf:'#dbc88c', blad:'#a9b77a', temp:95, tijd:[5,8], caf:false,
    smaak:'Warm, bloemig en licht citrusachtig.', tip:'Kneus de peulen even voor je ze erbij doet.' }
];
var BY = {}; ING.forEach(function (i) { BY[i.id] = i; });

// wat goed samen gaat (elk paar moet maar 1 keer staan)
var PAST = {
  'groene-thee': ['jasmijn','roos','munt','chrysant','citroengras','citroenverbena','gember','oranjebloesem','citroenschil','vlierbloesem','korenbloem','goudsbloem','citroenmelisse'],
  'witte-thee': ['roos','jasmijn','oranjebloesem','vlierbloesem','lavendel','chrysant','korenbloem','appel','sinaasappelschil','citroenverbena'],
  'zwarte-thee': ['roos','kardemom','kaneel','gember','sinaasappelschil','lavendel','munt','citroenschil','korenbloem','appel'],
  'rooibos': ['kaneel','sinaasappelschil','gember','kardemom','roos','appel','kamille','lavendel','hibiscus','rozenbottel','citroengras','goudsbloem'],
  'jasmijn': ['roos','oranjebloesem','chrysant','citroenverbena','munt','lindebloesem'],
  'roos': ['kamille','lavendel','hibiscus','rozenbottel','kardemom','munt','lindebloesem','oranjebloesem','citroenmelisse','goudsbloem','korenbloem','kaneel','vlinderbloem'],
  'kamille': ['lindebloesem','citroenmelisse','lavendel','munt','goudsbloem','oranjebloesem','appel','citroenverbena','kaneel','vlierbloesem','korenbloem','gember'],
  'lavendel': ['citroenmelisse','munt','lindebloesem','citroenverbena','citroenschil','vlinderbloem'],
  'hibiscus': ['rozenbottel','appel','sinaasappelschil','kaneel','gember','munt','citroengras'],
  'lindebloesem': ['citroenmelisse','munt','vlierbloesem','salie','citroenschil','oranjebloesem','gember'],
  'oranjebloesem': ['sinaasappelschil','citroenmelisse','citroenverbena'],
  'vlierbloesem': ['munt','citroenschil','citroenmelisse','appel','rozenbottel'],
  'goudsbloem': ['korenbloem','sinaasappelschil','citroenmelisse'],
  'korenbloem': ['citroenschil','sinaasappelschil'],
  'vlinderbloem': ['citroengras','citroenschil','munt','gember','citroenverbena'],
  'munt': ['citroenmelisse','citroenverbena','citroengras','gember','citroenschil','salie','rozenbottel'],
  'citroenmelisse': ['citroenverbena','citroengras','gember','appel'],
  'citroenverbena': ['citroengras','gember'],
  'salie': ['citroenschil','gember','citroenmelisse'],
  'citroengras': ['gember','sinaasappelschil'],
  'rozenbottel': ['appel','sinaasappelschil','kaneel','gember'],
  'gember': ['citroenschil','kaneel','kardemom','sinaasappelschil','appel'],
  'kaneel': ['appel','sinaasappelschil','kardemom'],
  'sinaasappelschil': ['kardemom','appel']
};
// wat niet samen gaat + waarom
var BOTST = [
  ['lavendel','hibiscus','Het zuur van hibiscus en het parfum van lavendel botsen.'],
  ['lavendel','salie','Twee erg kruidige smaken: samen wordt het bitter en zeepachtig.'],
  ['lavendel','jasmijn','Twee sterke parfums die om aandacht vechten.'],
  ['hibiscus','kamille','Het zuur van hibiscus duwt de zachte kamille weg.'],
  ['hibiscus','jasmijn','Jasmijn verdwijnt helemaal achter het zuur van hibiscus.'],
  ['hibiscus','witte-thee','Witte thee is te fijn om tegen hibiscus op te kunnen.'],
  ['salie','jasmijn','Salie overstemt de fijne jasmijn.'],
  ['salie','roos','Salie overstemt de zachte roos.'],
  ['salie','oranjebloesem','Salie overstemt de fijne oranjebloesem.'],
  ['kaneel','jasmijn','Kaneel overstemt de fijne jasmijn.'],
  ['gember','jasmijn','Gember is te scherp voor jasmijn.'],
  ['zwarte-thee','kamille','Zwarte thee overstemt de kamille.']
];

var MOODS = [['bloemig','Bloemig'],['fris','Fris'],['avond','Voor de avond'],['warm','Warm en kruidig'],['fruitig','Fruitig']];
var REC = [
  { id:'jasmijnparel', n:'Jasmijnparel', mood:['bloemig'], ing:[['groene-thee',3],['jasmijn',1]],
    tekst:'De klassieker. Zoete jasmijn op een frisse groene thee.' },
  { id:'rozentuin', n:'Rozentuin', mood:['bloemig'], ing:[['groene-thee',3],['roos',2],['jasmijn',1]],
    tekst:'Roos maakt de jasmijnthee zachter en ronder.' },
  { id:'witte-roos', n:'Witte roos', mood:['bloemig'], ing:[['witte-thee',3],['roos',1]],
    tekst:'Heel licht en fijn. Hier proef je de roos het best.' },
  { id:'gouden-chrysant', n:'Gouden chrysant', mood:['bloemig'], ing:[['groene-thee',2],['chrysant',1],['jasmijn',1]],
    tekst:'Honingzacht. Mooi in een glazen pot, waar de bloemen opengaan.' },
  { id:'oranjebloesem', n:'Oranjerie', mood:['bloemig','fruitig'], ing:[['witte-thee',3],['oranjebloesem',1],['sinaasappelschil',1]],
    tekst:'Bloesem en schil van dezelfde boom, op een zachte witte thee.' },
  { id:'bloemenweide', n:'Bloemenweide', mood:['bloemig','avond'], ing:[['kamille',3],['roos',2],['goudsbloem',1],['oranjebloesem',1],['korenbloem',1]],
    tekst:'Vijf bloemen, geen thee. Ziet er in de pot net zo mooi uit als in de kop.' },
  { id:'marokkaanse-munt', n:'Marokkaanse munt', mood:['fris'], ing:[['groene-thee',2],['munt',2]],
    tekst:'Stevig en fris. Traditioneel met flink wat suiker, maar honing kan ook.' },
  { id:'frisse-jasmijn', n:'Frisse jasmijn', mood:['fris','bloemig'], ing:[['groene-thee',3],['jasmijn',1],['munt',1]],
    tekst:'Jasmijnthee met een koel randje. Ook lekker als ijsthee.' },
  { id:'citroentuin', n:'Citroentuin', mood:['fris'], ing:[['citroenverbena',2],['citroenmelisse',2],['citroengras',1],['munt',1]],
    tekst:'Drie soorten citroen zonder één citroen. Helder en opgewekt.' },
  { id:'vlier-en-munt', n:'Vlierbloesem en munt', mood:['fris'], ing:[['vlierbloesem',2],['munt',1],['citroenschil',1]],
    tekst:'Licht, zoetig en zomers.' },
  { id:'blauwe-kop', n:'Blauwe kop', mood:['fris'], ing:[['citroengras',2],['vlinderbloem',1],['munt',1]],
    tekst:'Felblauw in de kop. Doe er na het zetten wat citroensap bij en hij wordt paars.' },
  { id:'zachte-avond', n:'Zachte avond', mood:['avond'], ing:[['kamille',2],['lindebloesem',1],['citroenmelisse',1]],
    tekst:'Rond en honingzoet, zonder cafeïne.' },
  { id:'lavendelnacht', n:'Lavendelnacht', mood:['avond','bloemig'], ing:[['kamille',6],['citroenmelisse',4],['lavendel',1]],
    tekst:'Kamille met een heel klein beetje lavendel. Meer lavendel maakt het zeepachtig.' },
  { id:'rooibos-roos', n:'Rooibos met roos', mood:['avond','bloemig'], ing:[['rooibos',4],['roos',2],['kardemom',1]],
    tekst:'Zoet en warm, met roos erbovenop. Lekker met een scheutje melk.' },
  { id:'roze-hibiscus', n:'Roze hibiscus', mood:['fruitig'], ing:[['rozenbottel',2],['hibiscus',1],['roos',1],['appel',1]],
    tekst:'Dieprood en friszuur. Op zijn best als ijsthee met honing.' },
  { id:'rozenchai', n:'Rozenchai', mood:['warm','bloemig'], ing:[['zwarte-thee',3],['roos',1],['kardemom',1],['kaneel',1]],
    tekst:'Stevige zwarte thee met specerijen en roos. Kan goed tegen melk.' },
  { id:'winterkruiden', n:'Winterkruiden', mood:['warm'], ing:[['rooibos',3],['sinaasappelschil',1],['kaneel',1],['gember',1]],
    tekst:'Sinaasappel, kaneel en gember op zoete rooibos.' },
  { id:'herfstkruiden', n:'Linde en salie', mood:['warm'], ing:[['lindebloesem',2],['citroenschil',1],['salie',1],['gember',1]],
    tekst:'Kruidig en verwarmend. Lekker met een lepel honing.' }
];

// smaaktype per ingredient, zo kan een eigen kruid vergeleken worden met de rest
var TYPES = [['bloemig', 'Bloemig'], ['zacht', 'Zacht en zoet'], ['citrus', 'Citrus'], ['fris', 'Fris zoals munt'],
  ['kruidig', 'Kruidig'], ['warm', 'Warm en pittig'], ['fruitig', 'Fruitig en zuur']];
var TYPE = {
  'groene-thee': 'thee', 'witte-thee': 'thee', 'zwarte-thee': 'thee', 'rooibos': 'zacht',
  'jasmijn': 'bloemig', 'roos': 'bloemig', 'kamille': 'zacht', 'lavendel': 'bloemig', 'hibiscus': 'fruitig',
  'lindebloesem': 'zacht', 'oranjebloesem': 'bloemig', 'vlierbloesem': 'zacht', 'goudsbloem': 'zacht',
  'korenbloem': 'zacht', 'vlinderbloem': 'zacht', 'chrysant': 'zacht',
  'munt': 'fris', 'citroenmelisse': 'citrus', 'citroenverbena': 'citrus', 'salie': 'kruidig', 'citroengras': 'citrus',
  'rozenbottel': 'fruitig', 'gember': 'warm', 'kaneel': 'warm', 'sinaasappelschil': 'citrus', 'citroenschil': 'citrus',
  'appel': 'fruitig', 'kardemom': 'warm'
};
// welke smaaktypes goed samen gaan
var TYPE_GOED = [
  ['thee', 'bloemig'], ['thee', 'citrus'], ['thee', 'fris'],
  ['bloemig', 'bloemig'], ['bloemig', 'zacht'], ['bloemig', 'citrus'],
  ['zacht', 'zacht'], ['zacht', 'citrus'], ['zacht', 'fris'], ['zacht', 'fruitig'], ['zacht', 'warm'],
  ['citrus', 'citrus'], ['citrus', 'fris'], ['citrus', 'warm'], ['citrus', 'kruidig'],
  ['fris', 'fris'], ['fris', 'fruitig'], ['fris', 'kruidig'],
  ['kruidig', 'warm'], ['warm', 'warm'], ['warm', 'fruitig'], ['fruitig', 'fruitig']
];
var TYPE_BOTST = [
  ['kruidig', 'bloemig', 'Kruidige smaken overstemmen fijne bloemen.']
];
// kleuren om uit te kiezen als je geen foto hebt
var KLEUREN = ['#c8587a', '#8d74c2', '#4467c8', '#4e8f5e', '#a5bf4e', '#e9c23c', '#ee8e2e', '#9a5a2e'];

// berichtjes van Serkan, komen af en toe als melding in de app
var BERICHTEN = [
  'Afiyet bal şeker olsun',
  'Smakelijkkk',
  'Bol şanslar çayla',
  'Ellerine sağlık',
  'Kolay gelsin',
  'Geniet van je thee',
  'Niet te heet drinken he',
  'Die wordt vast superlekker',
  'Maak er ook eentje voor mij',
  'Çayın tadı senin gibi güzel olsun'
];
