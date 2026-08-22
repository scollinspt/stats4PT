#!/usr/bin/env python3
"""Import the Stats4PT Substack series as local static lesson pages."""

from __future__ import annotations

import argparse
import json
import re
from html import escape, unescape
from pathlib import Path
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen


PUBLICATION = "https://peripateticpt.substack.com"
LESSONS = [
    (1, "introduction-to-statistical-inference"),
    (2, "understanding-causality-in-clinical"),
    (3, "bayesian-reasoning-for-clinical-decision"),
    (4, "bayesian-applications-in-research"),
    (5, "bayes-theorem-in-clinical-decision"),
    (6, "beyond-data-mechanisms-and-structures"),
    (7, "practical-applications-building-a"),
    (8, "statistical-fallacies-and-biases"),
]
LOCAL_PATHS = {
    slug: f"lesson-{number}-{slug}.html" for number, slug in LESSONS
}


def fetch_post(slug: str) -> dict[str, object]:
    request = Request(
        f"{PUBLICATION}/api/v1/posts/{slug}",
        headers={"User-Agent": "stats4PT content importer"},
    )
    with urlopen(request) as response:
        return json.load(response)


def download_images(body_html: str, lesson_number: int, asset_dir: Path) -> str:
  image_pattern = re.compile(
    r"https://(?:substackcdn\.com|substack-post-media\.s3\.amazonaws\.com)/[^\"'&\s<>]+"
  )
  urls = list(dict.fromkeys(image_pattern.findall(body_html)))
  asset_dir.mkdir(parents=True, exist_ok=True)
  downloaded: dict[str, str] = {}

  for encoded_url in urls:
    url = unescape(encoded_url)
    source_url = unquote(url.rsplit("/", 1)[-1]) if "substackcdn.com" in url else url
    if source_url in downloaded:
      body_html = body_html.replace(encoded_url, f"../img/lessons/{downloaded[source_url]}")
      continue

    request = Request(
      source_url,
      headers={
        "Referer": f"{PUBLICATION}/",
        "User-Agent": (
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
          "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36"
        ),
      },
    )
    with urlopen(request) as response:
      content_type = response.headers.get_content_type()
      suffix = {
        "image/gif": ".gif",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
      }.get(content_type, Path(urlparse(source_url).path).suffix or ".img")
      filename = f"lesson-{lesson_number}-image-{len(downloaded) + 1:02d}{suffix}"
      (asset_dir / filename).write_bytes(response.read())
    downloaded[source_url] = filename
    body_html = body_html.replace(encoded_url, f"../img/lessons/{filename}")

  return body_html


def localize_links(body_html: str) -> str:
    for slug, filename in LOCAL_PATHS.items():
        body_html = re.sub(
            rf'https://peripateticpt\.substack\.com/p/{re.escape(slug)}(?:\?[^"#]*)?(?=["#])',
            filename,
            body_html,
        )
    body_html = body_html.replace('href="true"', 'href="https://unsplash.com/@kmuza"')
    body_html = re.sub(
        r"&quot;internalRedirect&quot;:&quot;.*?&quot;",
        "&quot;internalRedirect&quot;:null",
        body_html,
    )
    body_html = re.sub(
        r'<div class="subscription-widget-wrap-editor[^>]*>.*?</div>\s*</div>',
        "",
        body_html,
        flags=re.DOTALL,
    )
    return body_html


def render_lesson(number: int, post: dict[str, object], asset_dir: Path) -> str:
    title = str(post["title"])
    subtitle = str(post.get("subtitle") or "")
    body_html = localize_links(str(post["body_html"]))
    body_html = download_images(body_html, number, asset_dir)
    description = subtitle or f"Lesson {number} in the stats4PT learning series."
    previous_link = "../index.html" if number == 1 else LOCAL_PATHS[LESSONS[number - 2][1]]
    previous_label = "All lessons" if number == 1 else "Previous lesson"
    next_link = "../index.html" if number == len(LESSONS) else LOCAL_PATHS[LESSONS[number][1]]
    next_label = "All lessons" if number == len(LESSONS) else "Next lesson"

    return f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{escape(title)} | stats4PT</title>
    <meta name="description" content="{escape(description, quote=True)}" />
    <link rel="stylesheet" href="../assets/styles.css" />
  </head>
  <body>
    <header class="container lesson-header">
      <a class="back-link" href="../index.html">&larr; All lessons</a>
      <p class="eyebrow">Lesson {number} of {len(LESSONS)}</p>
      <h1>{escape(title)}</h1>
      {f'<p class="lead">{escape(subtitle)}</p>' if subtitle else ''}
    </header>
    <main class="container lesson-layout">
      <article class="lesson-content">
        {body_html}
      </article>
      <nav class="lesson-nav" aria-label="Lesson navigation">
        <a href="{previous_link}">&larr; {previous_label}</a>
        <a href="{next_link}">{next_label} &rarr;</a>
      </nav>
    </main>
  </body>
</html>
'''


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", choices=LOCAL_PATHS)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    selected = [(number, slug) for number, slug in LESSONS if not args.slug or slug == args.slug]
    output_dir = args.output or Path(__file__).resolve().parents[1] / "lessons"
    asset_dir = output_dir.parent / "img" / "lessons"
    output_dir.mkdir(parents=True, exist_ok=True)

    for number, slug in selected:
        post = fetch_post(slug)
        destination = output_dir / LOCAL_PATHS[slug]
        destination.write_text(render_lesson(number, post, asset_dir), encoding="utf-8")
        print(f"Imported lesson {number}: {destination.name}")


if __name__ == "__main__":
    main()