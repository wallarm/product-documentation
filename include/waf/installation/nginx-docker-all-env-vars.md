Environment variable | Description| Required
--- | ---- | ----
`DEPLOY_USER` | Email to the **Deploy** or **Administrator** user account in the Wallarm Console.| Yes
`DEPLOY_PASSWORD` | Password to the **Deploy** or **Administrator** user account in the Wallarm Console. | Yes
`NGINX_BACKEND` | Domain or IP address of the resource to protect with WAF. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | WAF node mode:<ul><li>`block` to block malicious requests</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`. | No
`TARANTOOL_MEMORY_GB` | [Amount of memory][allocating-memory-guide] allocated to Tarantool. The value can be an integer or a float (a dot <code>.</code> is a decimal separator). By default: 0.2 gygabytes. | No
`DEPLOY_FORCE` | Replaces an existing WAF node with a new one if an existing WAF node name matches the identifier of the container you are running. The following values can be assigned to a variable:<ul><li>`true` to replace the WAF node</li><li>`false` to disable the replacement of the WAF node</li></ul>Default value (if the variable is not passed to the container) is `false`.<br>The WAF node name always matches the identifier of the container you are running. WAF node replacement is helpful if the Docker container identifiers in your environment are static and you are trying to run another Docker container with the WAF node (for example, a container with a new version of the image). If in this case the variable value is `false`, the WAF node creation process will fail. | No
