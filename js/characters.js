/* Hand-drawn (well, hand-coded) cartoon busts for Maya & Leo.
   Returned as inline SVG markup so they can be dropped into any
   container and scale cleanly from a 40px avatar to a big card. */
(function () {
  const MAYA = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maya">
  <circle cx="60" cy="60" r="58" fill="#f5f0ff"/>
  <path d="M26 118 Q26 78 60 78 Q94 78 94 118 Z" fill="#a855f7"/>
  <path d="M26 118 Q26 94 60 92 Q94 94 94 118" fill="none" stroke="#7e22ce" stroke-width="2" opacity=".4"/>
  <rect x="50" y="66" width="20" height="20" rx="6" fill="#f3c9a3"/>
  <ellipse cx="26" cy="66" rx="13" ry="15" fill="#3b2415"/>
  <ellipse cx="94" cy="66" rx="13" ry="15" fill="#3b2415"/>
  <path d="M20 60 Q16 76 24 84" fill="none" stroke="#3b2415" stroke-width="6" stroke-linecap="round"/>
  <path d="M100 60 Q104 76 96 84" fill="none" stroke="#3b2415" stroke-width="6" stroke-linecap="round"/>
  <circle cx="18" cy="82" r="6" fill="#ec4899"/>
  <circle cx="102" cy="82" r="6" fill="#ec4899"/>
  <circle cx="60" cy="56" r="34" fill="#f3c9a3"/>
  <path d="M26 52 Q24 20 60 16 Q96 20 94 52 Q92 30 60 27 Q28 30 26 52 Z" fill="#3b2415"/>
  <path d="M40 24 Q60 14 80 24" fill="none" stroke="#3b2415" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="47" cy="58" rx="4.2" ry="5.4" fill="#2b1b12"/>
  <ellipse cx="73" cy="58" rx="4.2" ry="5.4" fill="#2b1b12"/>
  <circle cx="48.6" cy="55.6" r="1.3" fill="#fff"/>
  <circle cx="74.6" cy="55.6" r="1.3" fill="#fff"/>
  <circle cx="38" cy="68" r="6" fill="#f9a8c9" opacity=".7"/>
  <circle cx="82" cy="68" r="6" fill="#f9a8c9" opacity=".7"/>
  <path d="M49 70 Q60 79 71 70" fill="none" stroke="#7c3a1d" stroke-width="3.2" stroke-linecap="round"/>
</svg>`.trim();

  const LEO = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Leo">
  <circle cx="60" cy="60" r="58" fill="#effcfa"/>
  <path d="M26 118 Q26 78 60 78 Q94 78 94 118 Z" fill="#0d9488"/>
  <path d="M26 118 Q26 94 60 92 Q94 94 94 118" fill="none" stroke="#0f766e" stroke-width="2" opacity=".4"/>
  <rect x="50" y="66" width="20" height="20" rx="6" fill="#eab48a"/>
  <path d="M22 60 Q18 70 22 78" fill="none" stroke="#eab48a" stroke-width="8" stroke-linecap="round"/>
  <path d="M98 60 Q102 70 98 78" fill="none" stroke="#eab48a" stroke-width="8" stroke-linecap="round"/>
  <circle cx="60" cy="56" r="34" fill="#eab48a"/>
  <path d="M25 50 Q24 18 60 15 Q96 18 95 50 Q93 28 60 26 Q27 28 25 50 Z" fill="#241608"/>
  <path d="M50 18 L54 8 L60 17 L66 7 L70 18" fill="#241608"/>
  <ellipse cx="47" cy="58" rx="4.2" ry="5.4" fill="#241608"/>
  <ellipse cx="73" cy="58" rx="4.2" ry="5.4" fill="#241608"/>
  <circle cx="48.6" cy="55.6" r="1.3" fill="#fff"/>
  <circle cx="74.6" cy="55.6" r="1.3" fill="#fff"/>
  <path d="M40 48 Q47 44 54 48" fill="none" stroke="#241608" stroke-width="3" stroke-linecap="round"/>
  <path d="M66 48 Q73 44 80 48" fill="none" stroke="#241608" stroke-width="3" stroke-linecap="round"/>
  <circle cx="38" cy="68" r="5.5" fill="#f7a583" opacity=".6"/>
  <circle cx="82" cy="68" r="5.5" fill="#f7a583" opacity=".6"/>
  <path d="M47 70 Q60 81 73 70" fill="none" stroke="#7c3a1d" stroke-width="3.2" stroke-linecap="round"/>
</svg>`.trim();

  window.CHAR_SVG = { maya: MAYA, leo: LEO };
})();
