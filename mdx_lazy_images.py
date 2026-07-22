"""Python-Markdown extension: lazy-load content images.

Restores the lazy-loading that the `mkdocs-glightbox` plugin added before the
migration to `zensical.extensions.glightbox`. The zensical extension wraps each
content image in a lightbox anchor but sets no `loading` attribute, so every
image on a page (including ones far below the fold that the reader never scrolls
to) was fetched eagerly on page load — a per-page-view image-bandwidth
regression. `loading="lazy"` defers off-screen images until the reader scrolls
near them; `decoding="async"` keeps decode off the main thread. Neither changes
how a visible image looks, and browsers start the fetch ahead of the viewport,
so at normal reading speed the load is not perceptible.

Registered in markdown_extensions as `mdx_lazy_images`. zensical imports it by
module path, so the repo root must be importable — the build and serve.sh set
PYTHONPATH accordingly.
"""

from markdown import Extension
from markdown.treeprocessors import Treeprocessor


class LazyImagesTreeprocessor(Treeprocessor):
    def run(self, root):
        for img in root.iter("img"):
            # Respect an explicit loading set upstream (e.g. attr_list); only
            # fill in the default.
            if "loading" not in img.attrib:
                img.set("loading", "lazy")
            if "decoding" not in img.attrib:
                img.set("decoding", "async")
        return None


class LazyImagesExtension(Extension):
    def extendMarkdown(self, md):
        # Priority 5 < glightbox's 7, so this runs after glightbox has wrapped
        # the image in its anchor. That ordering is not required (glightbox
        # leaves the <img> element in the tree and never touches `loading`), but
        # it keeps the intent clear.
        md.treeprocessors.register(LazyImagesTreeprocessor(md), "lazy_images", 5)


def makeExtension(**kwargs):
    return LazyImagesExtension(**kwargs)
