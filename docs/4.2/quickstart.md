[operation-mode-rule-docs]:         user-guides/rules/wallarm-mode-rule.md
[filtration-modes-docs]:            admin-en/configure-wallarm-mode.md
[graylist-docs]:                    user-guides/ip-lists/graylist.md
[wallarm-cloud-docs]:               about-wallarm/overview.md#cloud
[user-roles-docs]:                  user-guides/settings/users.md
[update-origin-ip-docs]:            user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       user-guides/rules/intro.md
[ip-lists-docs]:                    user-guides/ip-lists/overview.md
[integration-docs]:                 user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     user-guides/triggers/triggers.md
[application-docs]:                 user-guides/settings/applications.md
[nodes-ui-docs]:                    user-guides/nodes/cdn-node.md
[events-docs]:                      user-guides/events/check-attack.md
[sqli-attack-desc]:                 attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  attacks-vulns-list.md#crosssite-scripting-xss
[enable-libdetection-docs]:         admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Quick start with Wallarm platform

The Wallarm platform protects web applications, APIs, and microservices from OWASP and OWASP Top 10 attacks, bots, and application abuse with ultra‑low false positives. You can start using the platform in full for free with a limitation of 500K API monthly requests by following this guide.

Under a quick start, you will register your Wallarm account and run the first Wallarm filtering node in a few minutes. Having a free quota you will be able to try on the product power on real traffic.

## Create Wallarm account and get Free tier

To create a Wallarm account:

1. Follow the registration link either in the [US](https://us1.my.wallarm.com/signup) or [EU](https://my.wallarm.com/signup) Wallarm Cloud and input your personal data.

    [More details on Wallarm Clouds →](about-wallarm/overview.md#cloud)
1. Confirm your account by following the link from the confirmation message sent to your email.

Once an account is registered and confirmed, it is automatically assigned with **Free tier** or **Free trial** depending on the Wallarm Cloud being used:

* In the US Cloud, Free tier lets you explore the power of Wallarm solution for free on 500 thousand monthly requests.
* In the EU Cloud, there is a trial period allowing you to explore Wallarm solution for free for 14 days.

As for the US cloud, there is the option to explore Wallarm even before deploying any components to your environment - [Playground](#deploy-the-wallarm-filtering-node).

## Learn Wallarm in Playground

Accounts in the US Wallarm Cloud are featured with **Playground** which enables the Wallarm platform exploration without having to deploy any platform components. In Playground, you can access the Wallarm Console view like it is filled with real data.

Wallarm Console is the major Wallarm platform component that displays data on processed traffic and allows the platform fine-tuning. So, with Playground you can learn and try out how the product works, and get some useful examples of its usage in the read-only mode.

![!UI to create account](images/playground.png)

To try the Wallarm solution capabilities on your traffic, exit Playground and deploy the first Wallarm filtering node following the [instructions for the quickest start](#deploy-the-wallarm-filtering-node).

## Deploy the Wallarm filtering node

Wallarm supports [many options for the filtering node deployment](admin-en/supported-platforms.md). You can either learn them and choose the most appropriate one or follow the quickest way to start with Wallarm as described below.

=== "In-house deployment with Docker"
    To quickly deploy the node as a component of your infrastructure, first make sure you have:

    * [Docker installed](https://docs.docker.com/engine/install/)
    * The **Administrator** [role][user-roles-docs] in the Wallarm account

    Deploy the Wallarm filtering node from the Docker image:

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

        ![!Wallarm node creation](images/create-wallarm-node-empty-list.png)

        As for the **Multi-tenant node** checkbox, leave it unticked. This checkbox is related to the corresponding feature setup that is not a part of a quick start.
    1. Copy the generated token.
    1. Run the container with the created node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.2.2-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.2.2-1
        ```

    Environment variable | Description| Required
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarm node token copied from the Wallarm Console UI. | Yes
    `NGINX_BACKEND` | Domain or IP address of the resource to protect with Wallarm solution. | Yes
    `WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
    `WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`safe_blocking` to block only those malicious requests originating from [graylisted IP addresses][graylist-docs]</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`.<br>[Detailed description of filtration modes →][filtration-modes-docs] | No

    To test the deployment, run the first attack with the [Path Traversal](attacks-vulns-list.md#path-traversal) malicious payload:

    ```
    curl http://localhost/etc/passwd
    ```

    If `NGINX_BACKEND` is `example.com`, additionally pass the `-H 'Host: example.com'` option in the curl command.

    Since the node operates in the **monitoring** [filtration mode](admin-en/configure-wallarm-mode.md#available-filtration-modes) by default, the Wallarm node will not block the attack but will register it. To check that the attack has been registered, proceed to Wallarm Console → **Events**:

    ![!Attacks in the interface](images/admin-guides/test-attacks-quickstart.png)
=== "Serverless deployment of the CDN node type"
    The Wallarm filtering node of the CDN type mitigates malicious traffic without placing any third‑party components in the application's infrastructure as it is hosted by the third-party cloud provider. All that is required to deploy the CDN node is to **specify the domain to be protected** and **add the Wallarm CNAME record** to the domain's DNS records.

    To quickly deploy the CDN node, first make sure you have:

    --8<-- "../include/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

    Deploy the CDN node:

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **CDN node** type.
    1. Input the domain address to be protected, e.g. `example.com`.

        The specified address must not contain the scheme and slashes.
    1. Make sure Wallarm correctly identifies the origin address associated with the specified domain. Otherwise, please change the automatically discovered origin address.

        ![!CDN node creation modal](images/create-cdn-node-empty-list.png)
    1. Wait for the CDN node registration to finish.

        Once the CDN node registration is finished, the CDN node status will be changed to **Requires CNAME**.
    1. Add the CNAME record generated by Wallarm to the DNS records of the protected domain.

        If the CNAME record is already configured for the domain, please replace its value with the one generated by Wallarm.

        ![!CDN node creation modal](images/cdn-node-cname-required-modal.png)

        Depending on your DNS provider, changes to DNS records can take up to 24 hours to propagate and take effect on the Internet. Once the new CNAME record is propagated, the Wallarm CDN node will proxy all incoming requests to the protected resource and block malicious ones.
    
    Once DNS record changes are propagated, send test attacks to the protected domain:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl http://<PROTECTED_DOMAIN>/etc/passwd
    ```

    Since the node operates in the **safe blocking** [filtration mode](admin-en/configure-wallarm-mode.md#available-filtration-modes) by default, the Wallarm node will not block the attacks above but will register them and [graylist their source](user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers).
    
    Registered attacks will be displayed in Wallarm Console → **Events**:

    ![!Attacks in the interface](images/current-attacks-in-ui-cdn-node.png)

    Graylisted IP will be displayed in Wallarm Console → **IP lists** → **Graylist**.

    All further attacks originating from the graylisted IP address will be blocked with the code `403`.

## Next steps

Wallarm node quick deployment has been successfully completed!

To get more from the deployment stage:

* [Learn full guide on deploying NGINX-based Wallarm node with Docker](admin-en/installation-docker-en.md)
* [Learn full guide on deploying CDN Wallarm node](installation/cdn-node.md)
* [Learn all deployment options supported by Wallarm](admin-en/supported-platforms.md)

To further fine-tune the deployed node, learn the features:

--8<-- "../include/waf/installation/quick-start-configuration-options.md"
