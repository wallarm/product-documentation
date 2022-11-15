Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node token.<br><div class="admonition info"> <p class="admonition-title">Previous variables configuring access to the Wallarm Cloud</p> <p>Before the release of version 4.0, the variables prior to `WALLARM_API_TOKEN` were `DEPLOY_USERNAME` and `DEPLOY_PASSWORD`. Starting from the new release, it is recommended to use the new token-based approach to access the Wallarm Cloud. [More details on migrating to the new node version](/updating-migrating/docker-container/)</p></div> | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
