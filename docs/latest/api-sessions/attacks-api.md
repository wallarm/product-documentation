[api-tokens-article]:      ../user-guides/settings/api-tokens.md
[api-overview]:            ../api/overview.md
[api-clouds]:              ../about-wallarm/api-security-overview.md#cloud
[link-exploring-attacks]:  exploring.md

# Attacks API <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" class="non-zoomable" style="border: none;"></a>

The **Attacks API** is the public interface behind the **Attacks** view in Wallarm Console. It provides an aggregation-first way to explore malicious traffic: instead of paging through individual hits, you run a single query that groups attack evidence by the dimensions you care about (attack type, source IP, host, endpoint, and more), drill into any group to see the raw attack vectors, and mark verdicts.

This article explains how to integrate with the Attacks API from your own client and how to migrate from the legacy `/v1/objects/attack` and `/v1/objects/hit` endpoints.

!!! info "API-first"
    All endpoints below are described interactively in the **Wallarm API Console** ([US cloud](https://apiconsole.us1.wallarm.com/), [EU cloud](https://apiconsole.eu1.wallarm.com/)), where you can try them out with your account token. See the [Wallarm API overview][api-overview] for the general authentication model.

## Base URL and authentication

All requests go to the cloud-specific API host and are authenticated with an API token passed in the `X-WallarmAPI-Token` header:

* `https://us1.api.wallarm.com/` for the [US cloud][api-clouds]
* `https://api.wallarm.com/` for the [EU cloud][api-clouds]

To obtain a token, sign in to Wallarm Console → **Settings** → **API tokens** and [create a token][api-tokens-article]. Every path is scoped to your numeric `client_id` (tenant); it appears both in the URL and in the request body.

## Endpoints

| Method & path | Purpose |
|---|---|
| `GET  /v1/client/{client_id}/attack-vectors/security-agg/query/schema` | Discover queryable fields, operators, presets, and aggregates |
| `POST /v1/client/{client_id}/attack-vectors/security-agg/query` | Run an aggregation query (grouped rows + metrics) |
| `POST /v1/client/{client_id}/attack-vectors/by-group` | Drill into one group and list its raw attack vectors |
| `POST /v1/client/{client_id}/attack-vectors/security-agg/stats` | Compute dashboard widgets (top lists, counters, time series) |
| `POST /v1/client/{client_id}/attack-vectors/security-agg/export` | Export query results to a downloadable file |
| `POST /v1/client/{client_id}/attack-vectors/mark` | Mark vectors as true positive / false positive |
| `GET/POST /v1/client/{client_id}/attack-views` | List / create saved views |
| `GET/PUT/DELETE /v1/client/{client_id}/attack-views/{id}` | Read / update / delete a saved view |
| `POST /v1/client/{client_id}/attack-views/{id}/duplicate` | Duplicate a saved view |
| `POST /v1/client/{client_id}/attack-views/{id}/set-default` | Mark a saved view as the default |

## Quick start

### 1. Discover the schema

Field names, allowed operators, grouping presets, and aggregate metrics are not hard-coded — fetch them for your account first. Use the returned field and metric names when building queries.

=== "US Cloud"
    ```bash
    curl -X GET "https://us1.api.wallarm.com/v1/client/5/attack-vectors/security-agg/query/schema" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN"
    ```
=== "EU Cloud"
    ```bash
    curl -X GET "https://api.wallarm.com/v1/client/5/attack-vectors/security-agg/query/schema" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN"
    ```

### 2. Query aggregated attacks

Group attack evidence by one or more dimensions and select the metrics to return. The example below returns the number of requests and unique source IPs per attack type over the last 24 hours, for one host, sorted by request count.

=== "US Cloud"
    ```bash
    curl -X POST "https://us1.api.wallarm.com/v1/client/5/attack-vectors/security-agg/query" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "client_id": 5,
        "preset": "type",
        "group_by": ["attack_type"],
        "select": ["requests_count", "unique_ips"],
        "where": {
          "kind": "group",
          "op": "and",
          "children": [
            {"kind": "condition", "field": "host", "op": "=", "values": ["api.example.com"]}
          ]
        },
        "order_by": [{"field": "requests_count", "desc": true}],
        "time_range": "24h",
        "limit": 100
      }'
    ```
=== "EU Cloud"
    ```bash
    curl -X POST "https://api.wallarm.com/v1/client/5/attack-vectors/security-agg/query" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "client_id": 5,
        "preset": "type",
        "group_by": ["attack_type"],
        "select": ["requests_count", "unique_ips"],
        "where": {
          "kind": "group",
          "op": "and",
          "children": [
            {"kind": "condition", "field": "host", "op": "=", "values": ["api.example.com"]}
          ]
        },
        "order_by": [{"field": "requests_count", "desc": true}],
        "time_range": "24h",
        "limit": 100
      }'
    ```

Each row in the response carries an opaque, self-describing `id` (base64). Use it to drill into that exact group — you do not need to reconstruct the filters yourself.

#### Filter syntax

The `where` field is a filter tree:

* **Condition** — a leaf: `{"kind": "condition", "field": "<field>", "op": "<op>", "values": ["..."]}`. Supported operators are `=`, `!=`, and `in`.
* **Group** — combines child conditions: `{"kind": "group", "op": "and" | "or", "children": [ ... ]}`.

A single condition may be passed directly as `where` without wrapping it in a group.

### 3. Drill into a group

Pass the `id` (here called `group_id`) from a query row to list the raw attack vectors it aggregates. Results are cursor-paginated.

=== "US Cloud"
    ```bash
    curl -X POST "https://us1.api.wallarm.com/v1/client/5/attack-vectors/by-group" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"group_id": "PASTE_ROW_ID_HERE", "limit": 100}'
    ```
=== "EU Cloud"
    ```bash
    curl -X POST "https://api.wallarm.com/v1/client/5/attack-vectors/by-group" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"group_id": "PASTE_ROW_ID_HERE", "limit": 100}'
    ```

### 4. Mark a verdict

Set the analyst verdict on one or more vectors. Use `"tp"` for true positive and `"fp"` for false positive.

=== "US Cloud"
    ```bash
    curl -X POST "https://us1.api.wallarm.com/v1/client/5/attack-vectors/mark" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"group_id": "PASTE_ROW_ID_HERE", "mark": "fp"}'
    ```
=== "EU Cloud"
    ```bash
    curl -X POST "https://api.wallarm.com/v1/client/5/attack-vectors/mark" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"group_id": "PASTE_ROW_ID_HERE", "mark": "fp"}'
    ```

## Pagination

Query and drill-down responses return `next_cursor` and `prev_cursor`. To fetch the next page, resend the same request body with `"cursor"` set to the `next_cursor` value from the previous response. A `null` cursor means there are no more pages in that direction. Cursors are opaque — do not parse or construct them.

## Dashboard widgets

The `security-agg/stats` endpoint computes several widgets in one request — for example a top-list of attack types by request count:

```json
{
  "client_id": 5,
  "preset": "type",
  "time_range": "24h",
  "widgets": [
    {"type": "top_list", "field": "requests_count", "group_by": "attack_type", "title": "By type"}
  ]
}
```

## Migrating from the legacy attacks API

The Attacks API replaces the classic `/v1/objects/attack` and `/v1/objects/hit` endpoints for the Attacks experience. The model is different: the legacy API returned flat lists of attacks and hits, while the new API is aggregation-first — you query grouped rows and then drill down to the underlying vectors.

| Legacy endpoint | New equivalent | Notes |
|---|---|---|
| `POST /v1/objects/attack` | `POST .../attack-vectors/security-agg/query` | Returns grouped rows, not flat attacks. Set `group_by` to the dimension you were listing by. |
| `POST /v1/objects/attack/count` | `POST .../attack-vectors/security-agg/query` | Read `requests_count` (and other counts) from the metrics in each row. |
| `POST /v1/objects/attack/aggs_terms` | `POST .../attack-vectors/security-agg/stats` | Term aggregations map to `top_list` / counter widgets. |
| `POST /v1/objects/attack/vectors` | `POST .../attack-vectors/by-group` | Raw vectors are fetched per group via the row `id`. |
| `POST /v1/objects/hit`, `/hit/details`, `/hit/raw` | `POST .../attack-vectors/by-group` | Drill-down rows carry the per-hit detail. |
| `POST /v1/objects/hit/mark_false` | `POST .../attack-vectors/mark` | Use `"mark": "fp"` (or `"tp"` to clear). |

Key differences to account for when migrating:

* **Aggregation-first.** Start from a grouped query, then drill down — rather than fetching a flat list and aggregating client-side.
* **Opaque identifiers.** Group `id`, `group_id`, and pagination cursors are base64 and self-describing. Pass them back verbatim; never build them by hand.
* **Schema discovery.** Field, preset, operator, and metric names come from the `.../query/schema` endpoint. Read them at runtime instead of hard-coding.
* **Time range.** Use the relative `time_range` field (maximum range is 6 months) instead of absolute hit timestamps.

## Related

* [Exploring API Sessions][link-exploring-attacks] — the Console UI backed by this API.
* [Wallarm API overview][api-overview] — authentication, tokens, and the API Console.
