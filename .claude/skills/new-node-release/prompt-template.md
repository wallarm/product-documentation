# Prompt template — `new-node-release` skill

Copy the block below, fill in the fields, paste into chat.

---

I need to document a new Wallarm Node release using the new-node-release skill. Here are the details:

* Artifact type: [NGINX Node / Native Node / both]
* New version: [e.g., 6.12.0]
* Release date: [YYYY-MM-DD or "today"]
* Source of release contents:
    
    * Jira release link: [paste link or fixVersion ID]
    * Explicit list of items: [paste Jira keys or curated bullets]
* (Optional) Additional context: [anything to highlight, exclude, or flag — e.g., "this includes a base bump to NGINX Node X.Y.Z", "replaces wstore with postanalytics", "first 7.x release", etc.]
* (Optional) Version applicability: [which version directories should receive this change — e.g., "7.x only", "6.x and 7.x", "all active versions"]

Please run the full workflow end-to-end. Show me draft previews and verification reports at each checkpoint before committing changes to files. When in doubt about classification, version applicability, or component-replacement specifics — ask me rather than guess.
