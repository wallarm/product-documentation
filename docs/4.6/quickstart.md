[operation-mode-rule-docs]:         user-guides/rules/wallarm-mode-rule.md
[filtration-modes-docs]:            admin-en/configure-wallarm-mode.md
[graylist-docs]:                    user-guides/ip-lists/graylist.md
[wallarm-cloud-docs]:               about-wallarm/overview.md#cloud
[user-roles-docs]:                  user-guides/settings/users.md
[rules-docs]:                       user-guides/rules/intro.md
[ip-lists-docs]:                    user-guides/ip-lists/overview.md
[integration-docs]:                 user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     user-guides/triggers/triggers.md
[application-docs]:                 user-guides/settings/applications.md
[events-docs]:                      user-guides/events/check-attack.md
[sqli-attack-desc]:                 attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  attacks-vulns-list.md#crosssite-scripting-xss

# Quick start with Wallarm platform

The Wallarm platform protects web applications, APIs, and microservices from OWASP and OWASP Top 10 attacks, bots, and application abuse with ultra‑low false positives. You can start using the platform in full for free with a limitation of 500K API monthly requests by following this guide.

Under a quick start, you will register your Wallarm account and run the first Wallarm filtering node in a few minutes. Having a free quota, you will be able to try on the product power on real traffic.



## Deploy the Wallarm filtering node

Wallarm supports [many options for the filtering node deployment](installation/supported-deployment-options.md). You can either learn them and choose the most appropriate one or follow the quickest way to start with Wallarm as described below.

To quickly deploy the node as a component of your infrastructure, first make sure you have:

* [Docker installed](https://docs.docker.com/engine/install/)
* The **Administrator** [role][user-roles-docs] in the Wallarm account

Deploy the Wallarm filtering node from the Docker image:

1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![Wallarm node creation](images/create-wallarm-node-empty-list.png)

    As for the **Multi-tenant node** checkbox, leave it unticked. This checkbox is related to the corresponding feature setup that is not a part of a quick start.
1. Copy the generated token.
1. Run the container with the node:

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.6.2-1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.6.2-1
    ```

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node token copied from the Wallarm Console UI. | Yes
`NGINX_BACKEND` | Domain or IP address of the resource to protect with the Wallarm solution. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`safe_blocking` to block only those malicious requests originating from [graylisted IP addresses][graylist-docs]</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`.<br>[Detailed description of filtration modes →][filtration-modes-docs] | No

To test the deployment, run the first attack with the [Path Traversal](attacks-vulns-list.md#path-traversal) malicious payload:

```
curl http://localhost/etc/passwd
```

If `NGINX_BACKEND` is `example.com`, additionally pass the `-H 'Host: example.com'` option in the curl command.

Since the node operates in the **monitoring** [filtration mode](admin-en/configure-wallarm-mode.md#available-filtration-modes) by default, the Wallarm node will not block the attack but will register it. To check that the attack has been registered, proceed to Wallarm Console → **Events**:

![Attacks in the interface](images/admin-guides/test-attacks-quickstart.png)

## Next steps

Wallarm node quick deployment has been successfully completed!

To get more from the deployment stage:

* [Learn full guide on deploying NGINX-based Wallarm node with Docker](admin-en/installation-docker-en.md)
* [Learn all deployment options supported by Wallarm](installation/supported-deployment-options.md)

To further fine-tune the deployed node, learn the features:

--8<-- "../include/waf/installation/quick-start-configuration-options-4.4.md"
