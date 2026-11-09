# Sid's Reading

My reading log. Built with Eleventy, hosted on Netlify.

## Add a book or review

1. Open the `books` folder on GitHub and click **Add file → Create new file**.
2. Name it after the book, lowercase with dashes: `the-housemaid.md`
3. Paste the contents of `TEMPLATE.md`, fill in the top section, write the review underneath.
4. Click **Commit changes**. The site updates in about a minute.

To review a book that's already listed, open its file in `books`, click the pencil icon, and write below the second `---` line.

Books with a written review get a link on the list. Books with only a rating show without a link.

## Change the look

Everything visual is in `style.css`. The colors and font are at the top.

## Use your own cover image

1. Save the image as a .jpg, .png or .webp, about 600px wide.
2. Name it exactly like the book's file in `books`: `the-maids-diary.jpg` for `the-maids-diary.md`.
3. On GitHub, open the `covers` folder → **Add file → Upload files** → drag it in → **Commit changes**.

Your image replaces the Open Library cover automatically.

## Optional lines for a book

Add any of these to the top section of a book's file:

- `precision: month` shows "February 2026" instead of a full date. `precision: year` shows just the year.
- `dnf: true` marks a book you didn't finish. It gets a DNF label and a dimmed cover.
- `reread: true` marks a reread. For a reread, make a second file for the book, such as `iq-reread.md`.
