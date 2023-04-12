Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node token.<br><div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You can use one token in several installations regardless of the selected platform. It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</p></div> | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
