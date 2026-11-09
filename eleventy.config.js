import fs from "node:fs";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("covers");

  // Your own cover image in the covers folder, named like the book's file.
  // Matching is forgiving: "The Devotion of Suspect X.JPG" works for
  // the-devotion-of-suspect-x.md, and a reread uses the original book's image.
  const simplify = (name) =>
    name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  eleventyConfig.addFilter("localCover", (slug) => {
    if (!fs.existsSync("covers")) return "";
    const images = {};
    for (const file of fs.readdirSync("covers")) {
      const m = file.match(/^(.*)\.(jpe?g|png|webp|gif|avif)$/i);
      if (m) images[simplify(m[1])] = file;
    }
    const file = images[simplify(slug)] || images[simplify(slug.replace(/-reread.*$/, ""))];
    return file ? "/covers/" + encodeURIComponent(file) : "";
  });
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("TEMPLATE.md");

  // All books, newest first
  eleventyConfig.addCollection("books", (api) =>
    api.getFilteredByGlob("books/*.md").sort((a, b) => b.date - a.date)
  );

  // Group books into [{ year, books }], newest year first
  eleventyConfig.addFilter("byYear", (books) => {
    const groups = [];
    for (const b of books) {
      const y = new Date(b.date).getUTCFullYear();
      if (!groups.length || groups.at(-1).year !== y) groups.push({ year: y, books: [] });
      groups.at(-1).books.push(b);
    }
    return groups;
  });

  // Group books by star rating: [{ stars, books }], 5 down to 1.
  // No rating (DNF / unrated) goes with 1 star; 3.5 goes with 3.
  // A reread book appears once (its most recent read).
  eleventyConfig.addFilter("byRating", (books) => {
    const seen = new Set();
    const groups = {};
    for (const b of books) {
      const key = (b.data.title + "|" + b.data.author).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const stars = Math.max(1, Math.floor(Number(b.data.rating) || 0));
      (groups[stars] ||= []).push(b);
    }
    return [5, 4, 3, 2, 1].filter((n) => groups[n]).map((n) => ({ stars: n, books: groups[n] }));
  });
  eleventyConfig.addFilter("year", (d) => new Date(d).getUTCFullYear());

  // 2026-03-11
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  // March 11, 2026
  eleventyConfig.addFilter("longDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
  // Read date, as precise as you know it: full date, month ("month") or year ("year")
  eleventyConfig.addFilter("readDate", (d, precision) => {
    const opts = { timeZone: "UTC", year: "numeric" };
    if (precision !== "year") opts.month = "long";
    if (!precision) opts.day = "numeric";
    return new Date(d).toLocaleDateString("en-US", opts);
  });
  // 3.5 -> three and a half stars
  eleventyConfig.addFilter("stars", (r) => {
    r = Number(r) || 0;
    if (!r) return "";
    const full = Math.floor(r), half = r % 1 >= 0.5 ? 1 : 0;
    return "★".repeat(full) + (half ? '<span class="half">★</span>' : "") + '<span class="dim">' + "★".repeat(5 - full - half) + "</span>";
  });
  // Does this book have a written review yet?
  eleventyConfig.addFilter("hasReview", (item) => !!(item.rawInput && item.rawInput.trim()));

  return { dir: { input: ".", includes: "_includes", output: "_site" } };
}
