# Docs MCP Server

The Wallarm documentation is available as a read-only [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server. Connect a supported AI client to it and the client can search and read the documentation directly, returning grounded, cited answers based on current Wallarm content.

The server is available over the streamable HTTP transport at:

```
https://mcp-docs.wallarm.com/mcp
```

You can copy this URL at any time from the **Copy page** menu in the top-right corner of any documentation page, under **Add Docs MCP**.

## Supported clients

The server works with any client that supports remote MCP servers over the streamable HTTP transport, such as Claude (Claude Code and Claude Desktop), Cursor, and Codex.

Older clients that only support the deprecated HTTP+SSE transport are not supported.

## Add the server

For clients that use a JSON configuration file, add the server to your MCP configuration:

```json
{
  "mcpServers": {
    "wallarm-docs": {
      "type": "http",
      "url": "https://mcp-docs.wallarm.com/mcp"
    }
  }
}
```

For clients with a command-line interface, add the server with a single command, for example:

```bash
claude mcp add --transport http --scope user wallarm-docs https://mcp-docs.wallarm.com/mcp
```

You can copy either the JSON configuration or the server URL at any time from the **Add Docs MCP** section of the **Copy page** menu on any documentation page.

## Available tools

Once connected, the server exposes the following tools to your AI client:

| Tool | Description |
|------|-------------|
| `search_pages` | Searches the documentation for pages relevant to a query. |
| `get_page` | Returns the full Markdown of a documentation page. |
| `list_pages` | Lists the available documentation pages with their titles and paths. |
| `list_versions` | Lists the available documentation versions and the Wallarm node versions they correspond to. |

The client decides which tools to call to answer your question and cites the exact pages it used.

A documentation version corresponds to the version of the Wallarm node required for API Security. Each version covers both Wallarm node families — NGINX Node and Native Node:

| Documentation version | NGINX Node | Native Node |
|------------------------|------------|-------------|
| 6.x (current) | 6.x | 0.14.x – 0.25.x |
| 7.x (preview) | 7.x | 0.26.x and above |
| 5.x | 5.x | 0.13.x and below |

## Limitations

* The server is public and unauthenticated — it serves only published documentation.
* It is read-only: the tools retrieve and search content but cannot modify it.
* Content is available in English only.
* The streamable HTTP transport is required; the deprecated HTTP+SSE transport is not supported.
