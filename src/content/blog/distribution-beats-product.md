---
title: "Great products die in the dark"
description: "You shipped it. The code is clean, the icon is lovely, the launch tweet is drafted. Here is the uncomfortable equation that decides what happens next."
pubDate: 2026-07-13
draft: false
---

You know the scene because you've lived it, or you're about to.

Launch day. You've been heads-down for three months. The app is genuinely good — you sweated the empty states, the onboarding, the icon. You post it. Product Hunt, a tweet, maybe a subreddit.

Forty-one visitors. Two sign-ups. One is your friend.

The instinct is to conclude the product wasn't good enough. So you go back to building: one more feature, one more polish pass, relaunch. Same result. Quieter, actually.

Here's the reframe that took me embarrassingly long to accept: **the product was never the problem. The product was never even seen.**

## The most expensive lie a maker believes

"Build it and they will come" survives because it flatters the skill we already have. Building is the part we love; selling feels like a tax. So we quietly hope excellence will do the marketing for us.

It won't. Peter Thiel put it bluntly in *Zero to One*: poor sales, not bad product, is the most common cause of failure. The market never rewards excellence it never encounters.

A product nobody hears about is functionally identical to a product that doesn't exist.

<figure class="pullquote-letter">
  <!-- TODO: replace with hand-lettered version of this line -->
  <blockquote>Great products die in the dark.</blockquote>
</figure>

## Every business is a multiplication

Not product *plus* distribution. Product **times** distribution. If either term is near zero, the result is near zero — no matter how big the other term gets.

That's abstract, so here it is as a map. Tap the quadrant where your current project honestly lives:

<div class="dq-wrap">
  <p class="folio">Interactive — tap a quadrant</p>
  <div class="dq-matrix">
    <span class="dq-axis dq-axis-y" aria-hidden="true">product →</span>
    <span class="dq-axis dq-axis-x" aria-hidden="true">distribution →</span>
    <div class="dq-grid" role="group" aria-label="Product versus distribution matrix. Four quadrants.">
      <button class="dq-cell dq-graveyard" data-verdict="The quietest death on the internet. A genuinely great product with no road to it. The maker concludes “the market didn't get it” — but the market never met it. This quadrant is where most skilled builders live, and it never trends, so nobody warns you about it.">
        <span class="dq-tag">strong product · weak distribution</span>
        <strong>The graveyard</strong>
        <em>dies quietly</em>
      </button>
      <button class="dq-cell" data-verdict="Product and channel, both working. Not luck — two disciplines, both practiced. A 20%-better product through a working channel beats a 200%-better product through no channel, every single time.">
        <span class="dq-tag">strong product · strong distribution</span>
        <strong>A business</strong>
        <em>compounds</em>
      </button>
      <button class="dq-cell" data-verdict="Nothing to mourn here. A weak product nobody hears about dies the death it deserves, cheaply. Honestly the second-best quadrant to be in — at least the lesson is fast.">
        <span class="dq-tag">weak product · weak distribution</span>
        <strong>Dead</strong>
        <em>correctly</em>
      </button>
      <button class="dq-cell" data-verdict="Reach without substance. Sign-ups pour in, churn pours out, refunds and angry threads follow. It dies loudly — which is at least diagnosable. Distribution can't save a product people don't want to keep.">
        <span class="dq-tag">weak product · strong distribution</span>
        <strong>The churn machine</strong>
        <em>dies loudly</em>
      </button>
    </div>
    <p class="dq-verdict" aria-live="polite">Three of these quadrants teach you something fast. One of them lies to you for years.</p>
  </div>
</div>

The dangerous quadrant isn't bottom-left. Bad products dying is the system working. The dangerous one is top-left — **the graveyard** — because it's where good builders go, and it gives no feedback. Loud failure teaches. Quiet failure just lets you keep believing the next feature will fix it.

## Nail one channel. One.

Thiel's other line matters just as much: if you can get even a *single* distribution channel to work, you have a great business. Try for several and nail none, and you're finished.

For a solo founder this is the whole strategy. You don't have the hours to run five half-channels. Dabbling across Product Hunt, a dormant X account, some half-hearted SEO, and an abandoned TikTok is the *precise* failure mode — it feels like marketing while adding up to nothing.

The channel that fits usually follows your price:

- **Free or cheap app** → virality, SEO, App Store search, content
- **Mid-priced product** → content marketing, marketplaces, build-in-public
- **Expensive / B2B** → direct outreach, partnerships, your actual network

Pick the one that matches your product *and* your temperament — a channel you hate is a channel you'll quit. Then go deep enough that it reliably produces strangers-who-become-users before you touch a second one.

## Owned beats rented

One more distinction that changes decisions: some channels you rent, some you own.

The App Store algorithm, the X feed, a subreddit's mods — rented land. The rules can change overnight, and you're not in the meeting where they change. An email list, an audience that follows *you* — owned. Nobody can de-rank it.

Rented channels are fine for reach. But route some of that reach into something you own, from week one. The builders who survive algorithm changes are the ones who treated every rented channel as a pipe into an owned one.

Dropbox is the textbook case of a third option: building the channel *into* the product. Paid ads cost them ~$233 to acquire a $99 customer — a dead channel. The referral program (free storage for invites) turned every user into distribution. Sign-ups went from 100k to 4 million in about fifteen months. The product didn't get better. The road got built in.

## The rule I hold myself to now

For every hour spent making the thing, budget a real hour building the road to a stranger.

Not launch week. Not "after v1.0." Concurrently, from the start — because the road takes as long to build as the product, and the worst time to start is the day you need it.

Your product deserves to be judged. It can't be judged in the dark.

---

*I'm building this in public too — a designer learning distribution the slow way. If you're in the same quadrant, [say hello](/contact).*

<style>
  .dq-wrap { margin: 3rem 0; }
  .dq-matrix { position: relative; padding-left: 1.6rem; }
  .dq-axis {
    font-family: var(--font-utility, monospace);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-muted, #56564e);
  }
  .dq-axis-y {
    position: absolute; left: 0; top: 40%;
    transform: rotate(-90deg) translateX(50%);
    transform-origin: left center;
    white-space: nowrap;
  }
  .dq-axis-x { display: block; text-align: center; margin-top: 0.6rem; }
  .dq-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .dq-cell {
    appearance: none;
    font: inherit;
    text-align: left;
    cursor: pointer;
    background: var(--paper, #fbfbf8);
    border: 1px solid var(--hairline, #e4e3da);
    padding: 1.1rem 1rem 1rem;
    min-height: 7.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }
  .dq-cell:hover { transform: translateY(-2px); border-color: var(--cloth, #2c3e66); box-shadow: 0 6px 18px rgba(27,27,24,0.07); }
  .dq-cell.dq-active { border-color: var(--cloth, #2c3e66); box-shadow: inset 0 0 0 1px var(--cloth, #2c3e66); }
  .dq-cell strong { font-family: var(--font-display, Georgia, serif); font-size: 1.25rem; line-height: 1.15; font-weight: 600; }
  .dq-cell em { color: var(--ink-muted, #56564e); font-size: 0.9rem; }
  .dq-tag {
    font-family: var(--font-utility, monospace);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-muted, #56564e);
  }
  .dq-graveyard { border-style: dashed; border-color: var(--foil, #b0713f); }
  .dq-verdict {
    margin-top: 1rem;
    min-height: 4.2em;
    max-width: var(--measure, 66ch);
    padding-left: 1.25rem;
    border-left: 2px solid var(--foil, #b0713f);
    font-style: italic;
    color: var(--ink-muted, #56564e);
  }
  .pullquote-letter blockquote {
    font-family: var(--font-display, Georgia, serif);
    font-size: var(--step-2, 1.8rem);
    line-height: 1.2;
    margin: 2.5rem 0;
    padding: 0;
    border: 0;
    font-style: normal;
    color: var(--ink, #1b1b18);
    text-align: center;
  }
  @media (max-width: 480px) {
    .dq-grid { grid-template-columns: 1fr; }
    .dq-axis-y, .dq-axis-x { display: none; }
  }
</style>

<script>
  (function () {
    var cells = document.querySelectorAll('.dq-cell');
    var verdict = document.querySelector('.dq-verdict');
    if (!verdict) return;
    cells.forEach(function (cell) {
      cell.addEventListener('click', function () {
        cells.forEach(function (c) { c.classList.remove('dq-active'); });
        cell.classList.add('dq-active');
        verdict.textContent = cell.getAttribute('data-verdict');
      });
    });
  })();
</script>
