from pathlib import Path
from jinja2 import Template

def define_env(env):
    """Define custom macros and variables."""

    @env.macro
    def include_markdown(path):
        """
        Include another Markdown file and render its Jinja placeholders.
        """
        docs_dir = Path(env.conf['docs_dir'])
        full_path = docs_dir / path

        if not full_path.exists():
            return f"**File not found:** {full_path}**"

        text = full_path.read_text(encoding="utf-8")

        # Render the included markdown content as a Jinja template
        template = Template(text)
        return template.render(**env.variables)
