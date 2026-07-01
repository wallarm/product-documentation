Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node or API token. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_LABELS` | <p>Available starting from node 4.6. Works only if `WALLARM_API_TOKEN` is set to [API token][api-token] with the `Deploy` role. Sets the `group` label for node instance grouping, for example:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...will place node instance into the `<GROUP>` instance group (existing, or, if does not exist, it will be created).</p> | Yes (for API tokens)