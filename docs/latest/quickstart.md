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
[img-test-attacks-in-ui]:           images/admin-guides/test-attacks-quickstart.png
[sqli-attack-desc]:                 attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  attacks-vulns-list.md#crosssite-scripting-xss
[enable-libdetection-docs]:         admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Quick start with Wallarm API Security

This guide provides you with the steps for a quick start with the Wallarm API Security platform. It will only take a few minutes to create a Wallarm account and run the first Wallarm filtering node with basic security settings. 

## Create Wallarm account and get Free tier

Create your Wallarm account in the [US](https://us1.my.wallarm.com/signup) or [EU](https://my.wallarm.com/signup) Wallarm Cloud.

[More details on Wallarm Clouds →](about-wallarm/overview.md#cloud)

![!UI to create account](images/create-wallarm-account.png)

Once an account is registered, it is automatically assigned with **Free tier** or **Free trial** depending on the Wallarm Cloud being used:

* In the US Cloud, Free tier lets you explore the power of Wallarm API Security for free on 500 thousand requests per month.
* In the EU Cloud, there is the free trial period allowing you to explore Wallarm API Security for 14 days.

As for the US cloud, there is the option to explore Wallarm even before deploying any components to your environment - [Playground](#learn-wallarm-in-playground).

## Learn Wallarm in Playground

Accounts in the US Wallarm Cloud are featured with **Playground** which enables the Wallarm platform exploration without having to deploy any platform components. In Playground, you can access the Wallarm Console view like it is filled with real data.

Wallarm Console is the major Wallarm platform component that displays data on processed traffic and allows the platform fine-tuning. So, with Playground you can learn and try out how the product works, and get some useful examples of its usage in the read-only mode.

![!UI to create account](images/playground.png)

To try the Wallarm API Security capabilities on your traffic, exit Playground and deploy the first Wallarm filtering node following the [instructions for the quickest start](#deploy-the-wallarm-docker-image).

## Deploy the Wallarm Docker image

As part of a quick start with the Wallarm platform, deploy the first Wallarm filtering node and run the first attack.

Before deployment, make sure you have:

* [Docker installed](https://docs.docker.com/engine/install/)
* The **Administrator** [role][user-roles-docs] in the Wallarm account

To deploy the Wallarm filtering node from the Docker image:

1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the container with the created node:

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.2.1-1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.2.1-1
    ```

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node token copied from the Wallarm Console UI. | Yes
`NGINX_BACKEND` | Domain or IP address of the resource to protect with Wallarm API Security. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`safe_blocking` to block only those malicious requests originating from [graylisted IP addresses][graylist-docs]</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`.<br>[Detailed description of filtration modes →][filtration-modes-docs] | No

To test the deployment, run the first attack with the [SQLi][sqli-attack-desc] and [XSS][xss-attack-desc] malicious payloads:

```
curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
```

If `NGINX_BACKEND` is `example.com`, additionally pass the `-H 'Host: example.com'` option in the curl command.

Test attacks will be displayed in Wallarm Console → **Events**. If the node is running in the blocking mode, the request will be blocked with the code `403`.

![!Attacks in the interface][img-test-attacks-in-ui]

## Next steps

Wallarm node quick deployment has been successfully completed!

To get more from the deployment stage:

* [Learn full guide on deploying NGINX-based Wallarm node with Docker](admin-en/installation-docker-en.md)
* [Learn all deployment options supported by Wallarm](admin-en/supported-platforms.md)

To further fine-tune the deployed node, learn the features:

--8<-- "../include/waf/installation/quick-start-configuration-options.md"
