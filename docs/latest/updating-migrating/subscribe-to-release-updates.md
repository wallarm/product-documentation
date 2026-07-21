# Subscribe to Wallarm Release Updates

Wallarm publishes a release changelog for each Node artifact and connector code bundle, and each changelog is available as a feed you can subscribe to — so you are notified automatically when a new version ships.

Depending on how you run Wallarm, subscribe to the feed that matches your deployment:

* [**NGINX Node**](../installation/nginx-native-node-internals.md) (also used behind Security Edge Inline)
* [**Native Node**](../installation/nginx-native-node-internals.md) (also used behind Security Edge Connectors)
* [**Connector code bundle**](../installation/connectors/overview.md) — the code bundle attached to your API gateway or CDN when you deploy the Native Node as a connector

Each feed carries the full release history of **one** artifact. These artifacts are versioned **independently** of each other, so every entry is tagged with its own version line and links to the matching changelog entry in the documentation.

## Available feeds

### NGINX Node

* Atom (RSS): [`https://docs.wallarm.com/feeds/changelog-nginx-node.xml`](https://docs.wallarm.com/feeds/changelog-nginx-node.xml)
* JSON: [`https://docs.wallarm.com/feeds/changelog-nginx-node.json`](https://docs.wallarm.com/feeds/changelog-nginx-node.json)

Covers every NGINX Node release across all supported lines (5.x, 6.x, 7.x). There is one entry per release; the entry body has a section for each form factor (all-in-one installer, Helm chart, Docker image, and so on). Each entry is tagged with its NGINX Node line.

### Native Node

* Atom (RSS): [`https://docs.wallarm.com/feeds/changelog-native-node.xml`](https://docs.wallarm.com/feeds/changelog-native-node.xml)
* JSON: [`https://docs.wallarm.com/feeds/changelog-native-node.json`](https://docs.wallarm.com/feeds/changelog-native-node.json)

Covers every Native Node release. There is one entry per release, with a section for each form factor in the entry body. The Native Node is versioned independently of the NGINX Node and is currently on the `0.x` series.

### Connector code bundle

* Atom (RSS): [`https://docs.wallarm.com/feeds/changelog-connectors-bundle.xml`](https://docs.wallarm.com/feeds/changelog-connectors-bundle.xml)
* JSON: [`https://docs.wallarm.com/feeds/changelog-connectors-bundle.json`](https://docs.wallarm.com/feeds/changelog-connectors-bundle.json)

Covers every connector code bundle release. Each connector (MuleSoft, Cloudflare, Apigee, and others) has its own version series, so each entry is tagged with the connector it belongs to.

## Subscribe with an RSS reader

Paste the Atom URL of the feed you want into any RSS reader (for example, Feedly or NetNewsWire). The reader polls the feed and shows each new release as it is published.

## Subscribe in Slack

Slack can post new releases into a channel through the built-in RSS app.

1. Install the RSS app once per workspace from the [Slack RSS app page](https://slack.com/marketplace/A0F81R7U7-rss) (**Add to Slack**).
2. In the channel where you want updates, run the command for the feed you want:

    ```
    /feed subscribe https://docs.wallarm.com/feeds/changelog-nginx-node.xml
    /feed subscribe https://docs.wallarm.com/feeds/changelog-native-node.xml
    /feed subscribe https://docs.wallarm.com/feeds/changelog-connectors-bundle.xml
    ```

    Updates post to the channel where the command is run.

Manage subscriptions with:

* `/feed list` — list the feeds in the current channel with their ID numbers
* `/feed remove <ID>` — remove a feed by its ID number
* `/feed help` — show the command reference

## Get updates by email

Wallarm does not send release updates by email directly. To receive them in your inbox, use any RSS-to-email service (for example, Follow.it or Blogtrottr) with the Atom URL of the feed.

<!-- TODO: a HubSpot RSS-to-email subscription form may replace this section once the marketing pipeline is in place. -->

## Automate with the JSON feed

For scripts, CI pipelines, and agents, use the JSON feed instead of Atom. It contains the full release history as an array, ordered newest first. Each entry has these fields:

| Field | Description |
|-------|-------------|
| `product` | Artifact identifier: `nginx-node`, `native-node`, or `connectors` |
| `version` | Version string as written in the changelog (for example, `6.12.7` or `0.25.3`) |
| `line` | The artifact's own version line — NGINX Node: `5.x` / `6.x` / `7.x`; Native Node: `0.x`; connector code bundle: the connector name |
| `date` | Release date, `YYYY-MM-DD` |
| `url` | Link to the changelog entry in the matching docs version |
| `summary` | Short plain-text summary of the entry |
| `body_markdown` | Full entry body, in Markdown |

The JSON feed keeps the full history, while the Atom feed is capped at the 30 most recent entries.

For example, to get the latest NGINX Node version on the 6.x line:

```bash
curl -s https://docs.wallarm.com/feeds/changelog-nginx-node.json \
  | jq -r '[.[] | select(.line=="6.x") | .version] | max_by(split(".") | map(tonumber))'
```

Releases are infrequent — minor versions ship roughly monthly and major versions about every six months (see the [Versioning Policy](versioning-policy.md)) — so there is no need to poll more than about once a week. The feeds are served with `ETag` and `Last-Modified` headers, so send `If-None-Match` or `If-Modified-Since` to get a `304 Not Modified` response when nothing has changed:

```bash
curl -s -H 'If-None-Match: "<etag-from-previous-response>"' \
  https://docs.wallarm.com/feeds/changelog-nginx-node.json
```

## Feed structure reference

For machine consumers of the Atom feed:

* Each entry `<id>` is a stable canonical URL that never changes, so it is safe to use for deduplication.
* Each entry carries a `<category term="…">` with its version line.
* Each entry `<content type="html">` holds the full rendered release notes, with links rewritten to absolute `docs.wallarm.com` URLs.
