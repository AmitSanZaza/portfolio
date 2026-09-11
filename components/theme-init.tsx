import { STORAGE_KEYS } from "@/lib/theme/options";

// Runs before first paint so a stored theme never flashes the default.
// Also marks the document as JS-enabled, which gates the scroll reveals.
const script = `
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  try {
    var t = localStorage.getItem(${JSON.stringify(STORAGE_KEYS.theme)});
    var p = localStorage.getItem(${JSON.stringify(STORAGE_KEYS.paper)});
    var a = localStorage.getItem(${JSON.stringify(STORAGE_KEYS.accent)});
    if (t === "light" || t === "dark") d.setAttribute("data-theme", t);
    if (p === "stone" || p === "sand") d.setAttribute("data-paper", p);
    if (a === "clay" || a === "forest" || a === "plum" || a === "ink") d.setAttribute("data-accent", a);
  } catch (e) {}
})();
`;

export function ThemeInit() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
