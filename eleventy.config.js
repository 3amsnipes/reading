export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("TEMPLATE.md");

  // All books, newest first
  eleventyConfig.addCollection("books", (api) =>
    api.getFilteredByGlob("books/*.md").sort((a, b) => b.date - a.date)
  );

  // 2026-03-11
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  // March 11, 2026
  eleventyConfig.addFilter("longDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
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
