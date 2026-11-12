# TeaBuilder

App om bloemen, kruiden en thee te mixen. Je kiest wat je in huis hebt en ziet wat goed samen gaat.

Gewoon HTML, CSS en JavaScript, geen build nodig. Werkt ook als PWA.

## Structuur

```
teabuilder/
├── index.html
├── manifest.webmanifest
├── sw.js
├── css/
│   └── style.css
├── js/
│   ├── data.js      ingredienten, combinaties en melanges
│   ├── logic.js     kleur, zetadvies, check of een mix goed is
│   └── app.js       schermen, navigatie, opslag
└── assets/
    └── icons/
```

## Eigen kruiden

In de kast kan je zelf een kruid toevoegen met een foto of kleur. De app schat op basis van het smaaktype (`TYPE`, `TYPE_GOED` en `TYPE_BOTST` in `js/data.js`) met welke andere kruiden het past. Foto's worden verkleind en samen met de rest in localStorage bewaard.

## Online zetten

Repo importeren in Vercel (alles op standaard laten), of in deze map:

```
npx vercel --prod
```

## Updaten

Na een aanpassing `VERSION` in `sw.js` verhogen, anders blijft de oude versie in de cache zitten.

## Data aanpassen

Alles staat in `js/data.js`: `ING` (ingredienten), `PAST` (wat samen gaat), `BOTST` (wat niet samen gaat) en `REC` (melanges).
