[api-tokens-article]:      ../user-guides/settings/api-tokens.md
[api-overview]:            ../api/overview.md
[api-clouds]:              ../about-wallarm/api-security-overview.md#cloud
[link-exploring-attacks]:  exploring.md

# Attacks API <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" class="non-zoomable" style="border: none;"></a>

The **Attacks API** is the public interface behind the **Attacks** view in Wallarm Console. Instead of paging through thousands of individual hits, you run a single **aggregation query** that groups attack evidence by the dimensions you care about (attack type, source IP, host, endpoint, and more), then **drill into any group** to see the underlying attack vectors, build **dashboard widgets**, save reusable **views**, and mark analyst verdicts.

This article explains how to integrate with the Attacks API from your own client and how to migrate from the legacy `/v1/objects/attack` and `/v1/objects/hit` endpoints.

!!! info "API-first"
    Every endpoint below is described interactively in the **Wallarm API Console** ([US cloud](https://apiconsole.us1.wallarm.com/), [EU cloud](https://apiconsole.eu1.wallarm.com/)), where you can try it out with your account token. See the [Wallarm API overview][api-overview] for the general authentication model.

## Core concepts

The Attacks API is **aggregation-first**. A typical integration follows four steps:

1. **Discover the schema** — call `security-agg/query/schema` once to learn which fields, grouping presets, operators, and metrics are available for your account.
2. **Query grouped rows** — call `security-agg/query` with a grouping (a preset such as *by attack type* or an explicit set of dimensions), a filter, and the metrics to compute. Each row is one group (for example, one attack type) with its aggregated metrics.
3. **Drill down** — every row carries an opaque, self-describing `id`. Pass it to `attack-vectors/by-group` to list the raw attack vectors inside that group, or to `security-agg/stats` / `mark` to scope those operations to the same group.
4. **Act** — mark verdicts (`mark`), export results (`security-agg/export`), or persist the whole configuration as a saved **view** (`attack-views`).

!!! tip "Opaque identifiers"
    Row `id`, `group_id`, and pagination cursors are base64 strings that carry their own meaning. **Pass them back verbatim** — never parse, edit, or construct them by hand.

## Base URL and authentication

All requests go to the cloud-specific API host and are authenticated with an API token in the `X-WallarmAPI-Token` header:

* `https://us1.api.wallarm.com/` for the [US cloud][api-clouds]
* `https://api.wallarm.com/` for the [EU cloud][api-clouds]

To obtain a token, sign in to Wallarm Console → **Settings** → **API tokens** and [create a token][api-tokens-article] with the appropriate access. Every path is scoped to your numeric `client_id` (tenant), which appears in the URL.

The examples below use the US cloud and `client_id` `5` — substitute your own.

## Endpoints

| Method & path | Purpose |
|---|---|
| `GET  /v1/client/{client_id}/attack-vectors/security-agg/query/schema` | Discover queryable fields, operators, presets, and metrics |
| `POST /v1/client/{client_id}/attack-vectors/security-agg/query` | Run an aggregation query (grouped rows + metrics) |
| `POST /v1/client/{client_id}/attack-vectors/by-group` | Drill into one group and list its raw attack vectors |
| `POST /v1/client/{client_id}/attack-vectors/security-agg/stats` | Compute dashboard widgets (time series, top lists, pie charts, counters) |
| `POST /v1/client/{client_id}/attack-vectors/security-agg/export` | Export query results to a CSV download link (async, emailed) |
| `POST /v1/client/{client_id}/attack-vectors/mark` | Mark vectors as true positive / false positive |
| `GET  /v1/client/{client_id}/attack-views` | List saved views |
| `POST /v1/client/{client_id}/attack-views` | Create a saved view |
| `GET/PUT/DELETE /v1/client/{client_id}/attack-views/{id}` | Read / update / delete a saved view |
| `POST /v1/client/{client_id}/attack-views/{id}/duplicate` | Duplicate a saved view |
| `POST /v1/client/{client_id}/attack-views/{id}/set-default` | Mark a saved view as the default |

## 1. Discover the schema

Field names, grouping presets, allowed operators, and metrics are resolved per account — fetch them first and build queries from the returned names.

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

The response groups fields by where they can be used:

```json
{
  "select_fields":        [{"name": "requests_count", "label": "Total Requests", "type": "integer", "category": "aggregate", "sortable": true}],
  "group_by_fields":      [{"name": "attack_type", "label": "Attack Type", "type": "string", "operators": ["=", "!=", "in"]}],
  "stats_group_by_fields":[{"name": "status_code_group", "label": "Status Code Group", "type": "string", "options": [{"value": "2xx", "label": "2xx"}]}],
  "where_fields":         [{"name": "host", "label": "Host", "type": "string", "operators": ["=", "!=", "in"], "options": []}],
  "grouping_presets":     [{"value": "type", "label": "Type", "description": "Group attacks by attack type, payload location, and host"}]
}
```

* `select_fields` — metrics and columns you may request in `select`.
* `group_by_fields` — dimensions valid for the main query's `group_by`.
* `stats_group_by_fields` — dimensions valid as a widget `group_by` in `stats`.
* `where_fields` — fields you may filter on, each with its allowed operators and (where applicable) an enumerated list of `options`.
* `grouping_presets` — named groupings (see below).

See the [full field catalogue](#field-catalogue) at the end of this page for a reference copy.

## 2. Query aggregated attacks

`POST .../security-agg/query` returns one row per group. Request body:

| Field | Type | Required | Description |
|---|---|---|---|
| `select` | array of strings | **yes** | Metrics and columns to return, e.g. `["requests_count", "unique_ips"]`. If none is an aggregate, `requests_count` is added automatically. |
| `preset` | string | no | A named grouping (`type`, `source_ip`, `none`) or any single dimension name. Mutually exclusive with `group_by`. |
| `group_by` | array of strings | no | Explicit dimensions to group by (custom grouping), e.g. `["host", "attack_type"]`. |
| `where` | object or string | no | Filter tree (see [Filtering](#3-filtering)). |
| `order_by` | array | no | Sort clauses, e.g. `[{"field": "requests_count", "desc": true}]`. |
| `time_range` | string | no | Relative or absolute window, e.g. `-24h`. Defaults to the last 24 hours. See [Time ranges](#time-ranges). |
| `limit` | integer | no | Rows per page, max **100**. |
| `cursor` | string | no | Opaque pagination cursor from a previous response. |

A time bucket (`ts_day` by default) is always added as the first grouping dimension, so results are inherently time-series-friendly.

### Grouping presets

The fastest way to group is a **preset**. Presets resolve to a fixed set of dimensions:

| `preset` | Groups by | Use it to answer |
|---|---|---|
| `type` | attack type | "Which attack types am I seeing?" |
| `source_ip` | source IP | "Which IPs are attacking me?" |
| `none` | individual attack units | "Show me individual attacks, ungrouped" |
| *(any dimension name)* | that dimension | e.g. `preset: "host"` groups by host |

#### Example — group by attack type (last 24 hours, one host)

=== "US Cloud"
    ```bash
    curl -X POST "https://us1.api.wallarm.com/v1/client/5/attack-vectors/security-agg/query" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "preset": "type",
        "select": ["attack_types", "requests_count", "unique_ips", "status"],
        "where": {
          "kind": "group",
          "op": "and",
          "children": [
            {"kind": "condition", "field": "host", "op": "=", "values": ["api.example.com"]}
          ]
        },
        "order_by": [{"field": "requests_count", "desc": true}],
        "time_range": "-24h",
        "limit": 50
      }'
    ```
=== "EU Cloud"
    ```bash
    curl -X POST "https://api.wallarm.com/v1/client/5/attack-vectors/security-agg/query" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "preset": "type",
        "select": ["attack_types", "requests_count", "unique_ips", "status"],
        "where": {
          "kind": "group",
          "op": "and",
          "children": [
            {"kind": "condition", "field": "host", "op": "=", "values": ["api.example.com"]}
          ]
        },
        "order_by": [{"field": "requests_count", "desc": true}],
        "time_range": "-24h",
        "limit": 50
      }'
    ```

#### Example — group by source IP

```json
{
  "preset": "source_ip",
  "select": ["ips", "requests_count", "unique_paths", "status"],
  "order_by": [{"field": "requests_count", "desc": true}],
  "time_range": "-7d"
}
```

#### Example — custom multi-dimension grouping

Use `group_by` (instead of `preset`) to group by several attributes at once — for example, attacks per host **and** attack type:

```json
{
  "group_by": ["host", "attack_type"],
  "select": ["requests_count", "unique_ips", "blocked_count"],
  "order_by": [{"field": "requests_count", "desc": true}],
  "time_range": "-24h"
}
```

Dimensions allowed in the main query's `group_by`: `attack_type`, `host`, `normalized_path`, `point`, `ip`, `request_id`, `attack_subtype`, `mitigation_control_id`, and the time buckets `ts_day` / `ts_hour` / `ts_week` / `ts_month`.

#### Example — no grouping (individual attacks)

```json
{
  "preset": "none",
  "select": ["attack_name", "attack_types", "hosts", "paths", "min_request_time", "status"],
  "time_range": "-24h",
  "limit": 100
}
```

### Response format

```json
{
  "data": [
    {
      "id": "eyJmIjpbInRzX2RheSIsImF0dGFja190eXBlIl0sInYiOlsiMjAyNi0wNy0wOSIsInNxbGkiXX0=",
      "ts_day": "2026-07-09",
      "attack_type": "sqli",
      "attack_type_label": "SQL Injection",
      "attack_types": {"count": 1, "values": ["sqli"]},
      "requests_count": 1420,
      "unique_ips": 37,
      "status": "Partially Blocked"
    }
  ],
  "next_cursor": "eyJ2IjpbMTQyMF0sIm8iOlsicmVxdWVzdHNfY291bnQiXSwiZCI6Im5leHQifQ=="
}
```

Each row is a flat object: one key per grouping dimension (its value) plus one key per selected column. Note the shapes:

* **Scalar metrics** (`requests_count`, `unique_ips`, `blocked_count`, `status`, …) are plain values.
* **Display columns** (`attack_types`, `hosts`, `ips`/`ip_addresses`, `cve_ids`, `users`, `paths`, …) are objects of the form `{"count": N, "values": [...]}` — the number of distinct values in the group and a capped sample of them.
* **Dimension fields** may come with a human-readable companion, e.g. `attack_type` plus `attack_type_label`.

The `id` field is the opaque group identifier used for drill-down and marking. See [Pagination](#pagination) for `next_cursor` / `prev_cursor`.

## 3. Filtering

The `where` field is a **filter tree** built from two node types:

* **Condition** (a leaf):
  ```json
  {"kind": "condition", "field": "attack_type", "op": "in", "values": ["sqli", "xss"]}
  ```
* **Group** (combines children with `and` / `or`):
  ```json
  {"kind": "group", "op": "and", "children": [ ... ]}
  ```

A single condition may be passed directly as `where` without wrapping it in a group. Groups can nest (up to 10 levels, 100 nodes total).

### Operators

| Operator | Applies to | Meaning |
|---|---|---|
| `=`, `!=` | all fields | equals / not equals |
| `in` | strings, ids, integers | matches any value in the list |
| `>`, `<`, `>=`, `<=` | numbers, dates | comparison (e.g. `status_code`, `uri_length`, time fields) |

!!! note "There is no `like` operator"
    Partial matching is done with **glob wildcards** inside a value on `=`, `!=`, or `in`: `*` matches any sequence, `?` matches a single character. A plain term with no wildcards matches as a substring ("contains"). For example, `{"field": "host", "op": "=", "values": ["*.example.com"]}` matches any subdomain. Glob is supported on text dimensions such as `host`, `normalized_path`, `attack_type`, `ip` (which also accepts CIDR), `country`, `user`, and the classification fields; it does not apply to `method`, `protocol`, or integer fields.

### Filtering on metrics (HAVING)

Conditions on **aggregate** fields (for example `requests_count > 100`) are applied *after* aggregation automatically — you do not need a separate HAVING clause:

```json
{
  "preset": "source_ip",
  "select": ["ips", "requests_count"],
  "where": {
    "kind": "condition", "field": "requests_count", "op": ">", "values": ["100"]
  },
  "time_range": "-24h"
}
```

An `or` group cannot mix metric conditions with dimension conditions.

### Special filters

* **Empty / non-empty** — use the sentinel value `__none__` to match empty values (for example, requests with no `user`), and `__other__` to match the catch-all bucket on enumerated fields.
* **`context_param`** — filter by a session context parameter using a `key`:
  ```json
  {"kind": "condition", "field": "context_param", "key": "role", "op": "in", "values": ["admin", "editor"]}
  ```
* **Full-text search** — `payload_search` and `parameter_search` accept a single value of at least 3 characters (with optional `*` / `?` wildcards) and support only `=` / `!=`.

!!! tip "Raw SQL filter"
    Advanced clients may pass `where` as a raw SQL string instead of a tree, e.g. `"where": "attack_type IN ('sqli','xss') AND host = 'api.example.com'"`. The object form is recommended for most integrations.

## 4. Drill into a group

Pass a row `id` as `group_id` to list the raw attack vectors that make up that group. Results are cursor-paginated (up to 1000 per page).

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

Response:

```json
{
  "data": [
    {
      "vector_id": "…",
      "request_id": "…",
      "type": "sqli",
      "host": "api.example.com",
      "normalized_path": "/api/users/{parameter_1}",
      "method": "POST",
      "point": "…",
      "payloads": ["…"],
      "remote_addr4": "203.0.113.10",
      "country": "US",
      "response_status_code": 403,
      "block_status": "blocked",
      "request_time": "2026-07-09T10:12:03Z",
      "mark": ""
    }
  ],
  "cursor": "…",
  "has_more": true
}
```

Each vector includes the request/response metadata, payloads, classification (CWE/OWASP/CAPEC/CVE), block status, and the current `mark`. To fetch the next page, resend the request with `"cursor"` set to the returned `cursor`.

## 5. Mark a verdict

Set the analyst verdict on attack vectors. Provide **exactly one** of `group_id`, `vector_ids`, or `request_ids`, plus `mark`:

* `"mark": "tp"` — true positive
* `"mark": "fp"` — false positive (also generates session corrections)
* `"mark": ""` — clears an existing mark

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

Marking by `group_id` applies the verdict to every vector in the group. The response is `{"marked_count": <n>}`.

## 6. Dashboard statistics

`POST .../security-agg/stats` computes several widgets in one request. Each widget has a `type`, a metric `field` (a scalar aggregate such as `requests_count`), and — for grouped widgets — a `group_by` dimension.

| Widget `type` | Required | Returns |
|---|---|---|
| `single_value` | `field` | one total number |
| `timeseries` | `field`, `group_by` (a time field) | a value per time bucket |
| `top_list` | `field`, `group_by` | the top N groups (with `percentage`); `limit` defaults to 5 |
| `pie_chart` | `field`, `group_by` | share per group (with `percentage`); `limit` defaults to 5 |

```json
{
  "time_range": "-24h",
  "where": {"kind": "condition", "field": "host", "op": "=", "values": ["api.example.com"]},
  "widgets": [
    {"type": "single_value", "field": "requests_count", "title": "Total attacks"},
    {"type": "timeseries", "field": "requests_count", "group_by": "ts_day", "title": "Attacks over time"},
    {"type": "top_list", "field": "requests_count", "group_by": "ip", "limit": 5, "title": "Top source IPs"},
    {"type": "pie_chart", "field": "requests_count", "group_by": "status_code_group", "limit": 5, "title": "Status codes"}
  ]
}
```

Response:

```json
{
  "widgets": [
    {"type": "single_value", "title": "Total attacks", "data": [{"label": "Total", "key": "", "value": 1420}]},
    {"type": "top_list", "title": "Top source IPs", "data": [{"label": "203.0.113.10", "key": "203.0.113.10", "value": 512, "percentage": 36.1}]}
  ]
}
```

`label` is the display name, `key` is the raw value (usable for drill-down filters), and `value` is the metric.

## 7. Export

`POST .../security-agg/export` runs the same aggregation as `query` and delivers the result as a CSV file. It is **asynchronous**: supply an `email`, and the endpoint returns `202 Accepted` with `{"export_id": "…", "status": "accepted"}`. A background job writes the CSV to storage and emails the requester a download link valid for 7 days.

```json
{
  "preset": "type",
  "select": ["attack_types", "requests_count", "unique_ips", "status"],
  "time_range": "-7d",
  "email": "analyst@example.com"
}
```

## 8. Saved views

A **view** persists a whole Attacks configuration — grouping, filter, time range, and column layout — so it can be reopened or shared. The `config` payload is owned by the Console UI; when integrating programmatically, read an existing view's `config` and send it back modified rather than authoring it from scratch.

`AttackView` object:

| Field | Type | Description |
|---|---|---|
| `id` | integer | View identifier |
| `name` | string | Display name |
| `description` | string | Optional description |
| `config` | object | Dashboard configuration (grouping, filter, time range, columns) |
| `visibility` | string | `tenant` (private to the account) or `org` (shared across the organization) |
| `is_preset` | boolean | Built-in view — cannot be modified or deleted |
| `is_default` | boolean | Whether this is the account's default view |
| `created_at` / `updated_at` | timestamp | |

A `config` typically contains:

```json
{
  "where": {"kind": "group", "op": "and", "children": []},
  "groupBy": "type",
  "customGroupByAttributes": [],
  "timeRange": "-24h",
  "sorting": [{"id": "requests_count", "desc": true}],
  "columnVisibility": {},
  "columnSizing": {},
  "columnPinning": {}
}
```

### List views

```bash
curl -X GET "https://us1.api.wallarm.com/v1/client/5/attack-views" \
  -H "X-WallarmAPI-Token: YOUR_API_TOKEN"
```

### Create a view

`name` and `config` are required; `visibility` defaults to `tenant`.

```bash
curl -X POST "https://us1.api.wallarm.com/v1/client/5/attack-views" \
  -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SQLi on payments",
    "description": "SQL injection against the payments host",
    "visibility": "org",
    "config": {
      "groupBy": "type",
      "timeRange": "-7d",
      "where": {
        "kind": "group",
        "op": "and",
        "children": [
          {"kind": "condition", "field": "host", "op": "=", "values": ["payments.example.com"]},
          {"kind": "condition", "field": "attack_type", "op": "in", "values": ["sqli"]}
        ]
      },
      "sorting": [{"id": "requests_count", "desc": true}],
      "columnVisibility": {},
      "columnSizing": {},
      "columnPinning": {}
    }
  }'
```

### Update, duplicate, delete, set default

```bash
# Update (partial — send only the fields to change)
curl -X PUT ".../attack-views/42" -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
  -H "Content-Type: application/json" -d '{"name": "SQLi on payments (prod)"}'

# Duplicate an existing (or preset/shared) view under a new name to customize it
curl -X POST ".../attack-views/42/duplicate" -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
  -H "Content-Type: application/json" -d '{"name": "SQLi on payments — copy"}'

# Make it the default view (no body)
curl -X POST ".../attack-views/42/set-default" -H "X-WallarmAPI-Token: YOUR_API_TOKEN"

# Delete
curl -X DELETE ".../attack-views/42" -H "X-WallarmAPI-Token: YOUR_API_TOKEN"
```

Preset views (`is_preset: true`) are immutable — duplicate them to make an editable copy.

## Pagination

`query` and `by-group` responses are cursor-paginated:

* `query` returns `next_cursor` and `prev_cursor`. To move forward, resend the **same** request body with `"cursor"` set to `next_cursor`; to move back, use `prev_cursor`. A cursor that is `null` or absent means there are no more rows in that direction (when the whole result fits on one page, neither cursor is returned).
* `by-group` returns an opaque `cursor` and a `has_more` boolean.

Cursors are opaque and self-describing (they encode direction) — resend them unchanged and do not add a direction parameter. A cursor is only valid for the query that produced it; changing `select`, `group_by`, `order_by`, or the filter invalidates it.

## Time ranges

The `time_range` field accepts:

* **Relative** — `-Nh` (hours, 1–168), `-Nd` (days, 1–180), `-Nm` (months, 1–6). Examples: `-24h`, `-7d`, `-3m`. Whole-day multiples like `-24h`/`-48h` are treated as day ranges.
* **Absolute** — `FROM-TO`, two Unix-epoch-second timestamps, e.g. `1751932800-1752019200`, with `FROM < TO`.

The maximum window is **6 months**. Absolute ranges honor the `X-Time-Zone` request header for day boundaries. The time grain of results adapts to the range (hourly for 1–3 days, weekly for very long ranges, otherwise daily).

## Migrating from the legacy attacks API

The Attacks API replaces the classic `/v1/objects/attack` and `/v1/objects/hit` endpoints for the Attacks experience. The model is fundamentally different: the legacy API returned **flat lists** of attacks and hits, while the new API is **aggregation-first** — you query grouped rows and then drill down to the underlying vectors.

| Legacy endpoint | New equivalent | Notes |
|---|---|---|
| `POST /v1/objects/attack` | `POST .../security-agg/query` | Returns grouped rows, not flat attacks. Set `group_by` / `preset` to the dimension you were listing by. |
| `POST /v1/objects/attack/count` | `POST .../security-agg/query` | Read `requests_count` (and other counters) from each row's metrics. |
| `POST /v1/objects/attack/aggs_terms` | `POST .../security-agg/stats` | Term aggregations map to `top_list` / `pie_chart` / `single_value` widgets. |
| `POST /v1/objects/attack/vectors` | `POST .../attack-vectors/by-group` | Raw vectors are fetched per group via the row `id`. |
| `POST /v1/objects/hit`, `/hit/details`, `/hit/raw` | `POST .../attack-vectors/by-group` | Drill-down rows carry the per-hit detail. |
| `POST /v1/objects/hit/mark_false` | `POST .../attack-vectors/mark` | Use `"mark": "fp"` (or `""` to clear). |

Key differences to account for when migrating:

* **Aggregation-first.** Start from a grouped query, then drill down — instead of fetching a flat list and aggregating client-side.
* **Opaque identifiers.** Group `id`, `group_id`, and cursors are base64 and self-describing. Pass them back verbatim; never build them by hand.
* **Schema discovery.** Field, preset, operator, and metric names come from `security-agg/query/schema`. Read them at runtime instead of hard-coding.
* **Glob instead of `like`.** Partial matching uses `*` / `?` wildcards inside values on `=` / `!=` / `in`.
* **Relative time ranges.** Use the `time_range` field (max 6 months) instead of absolute hit timestamps where possible.

## Field catalogue

### Grouping dimensions (main query `group_by`)

| Field | Meaning |
|---|---|
| `attack_type` | Attack type (`sqli`, `xss`, …) |
| `attack_subtype` | Fine-grained subtype (e.g. `sqli_union_based`) |
| `host` | Target host |
| `normalized_path` (`path`) | Normalized request path, e.g. `/api/users/{parameter_1}` |
| `ip` | Source IP |
| `point` | Attack location within the request |
| `request_id` | Unique request id |
| `mitigation_control_id` | Mitigation control / rule id |
| `ts_day` / `ts_hour` / `ts_week` / `ts_month` | Time bucket |

### Additional filter & widget dimensions

`country`, `method`, `status_code`, `status_code_group`, `protocol`, `scheme`, `api_protocol`, `auth_protocol`, `application_id`, `location_type`, `user`, `user_role`, `orig_session_id`, `cve_id`, `cwe_id`, `owasp_category`, `capec_id`, `mark`, `security_issue_id`, `context_param`, `payload_search`, `parameter_search`, `uri_length`.

### Metrics (`select`)

| Field | Label | Meaning |
|---|---|---|
| `requests_count` | Total Requests | Number of malicious requests in the group |
| `attack_vectors_count` | Attack Vectors | Number of attack-vector rows |
| `blocked_count` | Blocked Requests | Requests that were blocked |
| `success_count` | Successful Requests | Requests that returned 2xx |
| `status` | Status | `Monitoring` / `Blocked` / `Partially Blocked` |
| `unique_ips` | Unique IPs | Distinct source IPs |
| `unique_paths` | Unique URI Paths | Distinct paths |
| `unique_users` | Unique Users | Distinct users |
| `unique_user_roles` | Unique User Roles | Distinct roles |
| `unique_endpoints` | Unique API Entries | Distinct endpoints |
| `unique_parameters` | Unique Attacked Parameters | Distinct attacked parameters |
| `unique_status_codes` | Unique Status Codes | Distinct status codes |
| `unique_orig_sessions` | Unique Sessions | Distinct sessions |
| `request_size_sum` / `response_size_sum` | Total Bytes | Request / response byte totals |
| `response_time_avg` / `response_time_max` | Response Time | Average / maximum, ms |
| `min_request_time` / `max_request_time` | Started / Last Seen | First / last request time |

Display columns (aggregated value lists, not sortable metrics): `attack_types`, `attack_subtypes`, `hosts`, `paths`, `ips`, `users`, `user_roles`, `countries`, `methods`, `status_codes`, `cve_ids`, `cwe_ids`, `owasp_categories`, `capec_ids`, `context_params`, plus the computed `attack_name` and `security_info`.

## Related

* [Exploring API Sessions][link-exploring-attacks] — the Console UI backed by this API.
* [Wallarm API overview][api-overview] — authentication, tokens, and the API Console.
