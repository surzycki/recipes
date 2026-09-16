/* Index-page search. Filters the recipe cards build.ts already rendered —
   there is no generated search index; the titles and cuisine tags in the DOM
   are the index. Inlined into index.html by renderIndexPage. */
(function () {
  "use strict";

  // "apero" should match the Apéro cuisine tag as an exact prefix, not fall
  // through to the fuzzy tier and match by luck.
  function fold(str) {
    return str.normalize
      ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      : str;
  }

  var wrap = document.getElementById("search-wrap");
  var input = document.getElementById("search-input");
  var clearBtn = document.getElementById("search-clear");
  var countEl = document.getElementById("search-count");
  var noResults = document.getElementById("no-results");
  if (!wrap || !input) return;

  // ── Read the index off the page ────────────────────────────────────────
  var cards = Array.prototype.map.call(
    document.querySelectorAll(".recipe-card"),
    function (el) {
      var titleEl = el.querySelector("h3");
      var cuisineEl = el.querySelector(".card-cuisine");
      var title = fold((titleEl ? titleEl.textContent : "").trim().toLowerCase());
      var cuisine = fold((cuisineEl ? cuisineEl.textContent : "").trim().toLowerCase());
      return {
        el: el,
        title: title,
        words: title.split(/\s+/).filter(Boolean),
        cuisineWords: cuisine.split(/\s+/).filter(Boolean),
        rank: 0
      };
    }
  );

  // Alphabetical position, used as the tie-break within each match tier.
  cards
    .slice()
    .sort(function (a, b) { return a.title.localeCompare(b.title); })
    .forEach(function (c, i) { c.rank = i; });

  var sections = Array.prototype.slice.call(
    document.querySelectorAll(".cuisine-section")
  );
  var total = cards.length;

  // ── Matching ───────────────────────────────────────────────────────────

  // Is the Damerau edit distance between a and b at most 1? Bounded check:
  // walk in from both ends, then look at what is left. O(n), no DP matrix —
  // we only ever ask "within one edit", never the actual distance.
  function withinOneEdit(a, b) {
    var la = a.length;
    var lb = b.length;
    if (Math.abs(la - lb) > 1) return false;

    var i = 0;
    while (i < la && i < lb && a.charCodeAt(i) === b.charCodeAt(i)) i++;
    if (i === la && i === lb) return true;

    var j = la - 1;
    var k = lb - 1;
    while (j >= i && k >= i && a.charCodeAt(j) === b.charCodeAt(k)) { j--; k--; }

    var ra = j - i + 1; // unmatched middle of a
    var rb = k - i + 1; // unmatched middle of b
    if (ra <= 0 && rb <= 1) return true;   // insertion
    if (rb <= 0 && ra <= 1) return true;   // deletion
    if (ra === 1 && rb === 1) return true; // substitution
    if (ra === 2 && rb === 2 && a[i] === b[i + 1] && a[i + 1] === b[i]) {
      return true;                         // transposition
    }
    return false;
  }

  // 0 = no match, else the tier this token matched at (lower is better).
  function tokenTier(tok, c, fuzzy) {
    var i;
    for (i = 0; i < c.words.length; i++) {
      if (c.words[i].indexOf(tok) === 0) return 1;
    }
    for (i = 0; i < c.cuisineWords.length; i++) {
      if (c.cuisineWords[i].indexOf(tok) === 0) return 2;
    }
    if (fuzzy && tok.length >= 4) {
      for (i = 0; i < c.words.length; i++) {
        if (withinOneEdit(tok, c.words[i])) return 3;
      }
      for (i = 0; i < c.cuisineWords.length; i++) {
        if (withinOneEdit(tok, c.cuisineWords[i])) return 3;
      }
    }
    return 0;
  }

  // -1 = card does not match. Every token must match something.
  function scoreCard(c, q, tokens, fuzzy) {
    var tier = 1;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokenTier(tokens[i], c, fuzzy);
      if (!t) return -1;
      if (t > tier) tier = t; // the weakest token sets the tier
    }
    if (c.title.indexOf(q) === 0) tier = 0; // whole-title prefix beats all
    return tier;
  }

  // ── Apply ──────────────────────────────────────────────────────────────

  function apply(raw) {
    var q = fold(raw.trim().toLowerCase()).replace(/\s+/g, " ");
    var tokens = q ? q.split(" ") : [];

    if (!tokens.length) {
      document.body.classList.remove("searching");
      cards.forEach(function (c) {
        c.el.hidden = false;
        c.el.style.order = "";
      });
      sections.forEach(function (s) { s.hidden = false; });
      countEl.textContent = "";
      noResults.hidden = true;
      clearBtn.hidden = true;
      return;
    }

    var tiers = cards.map(function (c) { return scoreCard(c, q, tokens, false); });
    var anyExact = tiers.some(function (t) { return t >= 0; });
    if (!anyExact) {
      // Nothing matched exactly — retry allowing one edit per token. Only
      // pays the fuzzy cost on queries that were about to show nothing.
      tiers = cards.map(function (c) { return scoreCard(c, q, tokens, true); });
    }

    var shown = 0;
    cards.forEach(function (c, i) {
      var t = tiers[i];
      if (t < 0) {
        c.el.hidden = true;
        return;
      }
      c.el.hidden = false;
      c.el.style.order = String(t * 1000 + c.rank);
      shown++;
    });

    document.body.classList.add("searching");
    sections.forEach(function (s) {
      s.hidden = !s.querySelector(".recipe-card:not([hidden])");
    });
    countEl.textContent = shown + " of " + total + " recipes";
    noResults.hidden = shown > 0;
    clearBtn.hidden = false;
  }

  function syncUrl(q) {
    if (!window.history || !history.replaceState) return;
    var url =
      location.pathname +
      (q ? "?q=" + encodeURIComponent(q) : "") +
      location.hash;
    history.replaceState(null, "", url);
  }

  function run() {
    apply(input.value);
    syncUrl(input.value.trim());
  }

  function reset() {
    input.value = "";
    apply("");
    syncUrl("");
  }

  // ── Wire up ────────────────────────────────────────────────────────────
  input.addEventListener("input", run);

  clearBtn.addEventListener("click", function () {
    reset();
    input.focus();
  });

  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement ? document.activeElement.tagName : "";
    var typing = tag === "INPUT" || tag === "TEXTAREA";

    if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault(); // Firefox would open quick-find instead
      input.focus();
      input.select();
    } else if (e.key === "Escape" && document.activeElement === input) {
      reset();
      input.blur();
    }
  });

  // Revealed only once the script runs, so a no-JS visitor gets the plain
  // grouped index rather than a search box that does nothing.
  wrap.hidden = false;

  var initial = "";
  try {
    initial = new URLSearchParams(location.search).get("q") || "";
  } catch (err) {
    initial = "";
  }
  input.value = initial;
  apply(initial);
})();
