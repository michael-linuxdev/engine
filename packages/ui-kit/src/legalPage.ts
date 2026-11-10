/**
 * Static privacy page (both languages on one page) for the store listing URL.
 * Generated from the same texts the in-game legal sheet shows, so both stay
 * in sync (the game's test compares the file with this output).
 */
import type { EngineStrings } from './i18n/de'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type Legal = EngineStrings['legal']

function section(lang: string, title: string, l: Legal, imprint: string | undefined): string {
  return [
    `<section lang="${lang}">`,
    `<h1>${esc(title)} – ${esc(l.privacyTitle)}</h1>`,
    `<p>${esc(l.privacy)}</p>`,
    '<ul>',
    ...l.privacyItems.map((x) => `<li>${esc(x)}</li>`),
    '</ul>',
    `<h2>${esc(l.imprintTitle)}</h2>`,
    `<p>${esc(imprint ?? l.imprintMissing).replace(/\n/g, '<br>')}</p>`,
    '</section>',
  ].join('\n')
}

export function privacyHtml(o: { title: { de: string; en: string }; de: Legal; en: Legal; imprint?: { de: string; en: string } | null }): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title.de)} – ${esc(o.de.privacyTitle)} / ${esc(o.en.privacyTitle)}</title>
<style>
:root { color-scheme: light dark; }
body { font: 16px/1.55 system-ui, sans-serif; max-width: 40rem; margin: 0 auto; padding: 1.5rem 1rem 3rem; background: #efe6d6; color: #2b211c; }
@media (prefers-color-scheme: dark) { body { background: #1b1f2e; color: #efe6d6; } }
h1 { font-size: 1.4rem; } h2 { font-size: 1.1rem; margin-top: 1.5rem; }
section + section { border-top: 1px solid currentColor; margin-top: 2rem; padding-top: 1rem; }
li + li { margin-top: 0.4rem; }
</style>
</head>
<body>
${section('de', o.title.de, o.de, o.imprint?.de)}
${section('en', o.title.en, o.en, o.imprint?.en)}
</body>
</html>
`
}
