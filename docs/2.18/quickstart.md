# Quick start with Wallarm API Security

These instructions describe how to quickly deploy the first Wallarm NGINX‑based filtering node and learn its basic features. This approach is recommended to be used only to try the product. To deploy the Wallarm node in the production environment, please refer to [separate guides for supported platforms](admin-en/supported-platforms.md).

Wallarm API Security quick start is performed using the provided Shell script to be run on a server with a supported Linux‑based operating system (OS).

<div class="video-wrapper">
<iframe width="1280" height="720" src="https://www.youtube.com/embed/QUaFqbdku5Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## How the quick start script works

The Shell script [**getwallarm.sh**](https://github.com/wallarm/quick-start/blob/stable/2.18/getwallarm.sh) used for Wallarm API Security quick start performs the following steps:

1. Disable the [SELinux](https://www.redhat.com/en/topics/linux/what-is-selinux) mechanism if it is installed on the OS. Wallarm quick deployment is not compatible with active SELinux.
2. Install the latest stable version of NGINX from the NGINX official repository.
3. Install the Wallarm packages for both the Wallarm NGINX and postanalytics modules.
4. Register the new Wallarm node in the Wallarm Cloud.
5. Configure the local NGINX instance to act as a [reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) for the specified domain with Wallarm node filtering requests in the blocking [mode](admin-en/configure-wallarm-mode.md).
6. Configure NGINX IP blocking functionality following the [instructions](admin-en/configure-ip-blocking-nginx-en.md).
7. Configure the whitelist with the Wallarm Scanner IPs following the [instructions](admin-en/scanner-ips-whitelisting.md).
8. Send the following test requests:

    * GET request to `http://127.0.0.8/wallarm-status` to check the accessibility of the [Wallarm statistics service](admin-en/configure-statistics-service.md).
    * GET request to the NGINX instance address (port 80/TCP) to check the accessibility of the domain protected by Wallarm.
    * GET request containing signs of the [SQLi](attacks-vulns-list.md#sql-injection) and [XSS](attacks-vulns-list.md#crosssite-scripting-xss) attacks to the NGINX instance address:

        ```bash
        curl -H "Host: $DOMAIN_NAME" http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
        ```

        The request should be blocked by the Wallarm node (the HTTP response code should be 403).

    If the actual response is different from the expected one, the script returns the corresponding message.

## Quickstart procedure

1. Create an account in Wallarm Console using the link for the [EU](https://my.wallarm.com/signup) or [US](https://us1.my.wallarm.com/signup) Wallarm Cloud.

    [More details on Wallarm Clouds →](about-wallarm-waf/overview.md#cloud)
2. Install one of the supported OS listed below on your server. For the Wallarm node deployment to be completed successfully, please install the OS from the image/distributive with the basic package set and do not apply any additional configurations to the installed OS. The quick start script may not be able to handle the OS customizations (e.g. security hardening or additional configurations fitting your internal server management standards).

    * Debian 10.x (buster)
    * Ubuntu 16.04 LTS (xenial)
    * Ubuntu 18.04 LTS (bionic)
    * Ubuntu 20.04 LTS (focal)
    * CentOS 7.x
    * CentOS 8.x
3. Connect to the server and become root user (e.g. by using command `sudo -i`).
4. Download the script **getwallarm.sh** by using one of the following commands:

    === "If the curl command is available"
        ```bash
        curl -o getwallarm.sh https://raw.githubusercontent.com/wallarm/quick-start/stable/2.18/getwallarm.sh
        ```
    === "If the wget command is available"
        ```bash
        wget -O getwallarm.sh https://raw.githubusercontent.com/wallarm/quick-start/stable/2.18/getwallarm.sh
        ```
5. Run the script passing the proper parameters:

    ```bash
    sh getwallarm.sh -u <YOUR_WALLARM_USERNAME> -p <YOUR_WALLARM_PASSWORD> -S <WALLARM_CLOUD> -n <WALLARM_NODE_NAME> -d <DOMAIN_NAME> -o <ORIGIN_SERVER>
    ```

    | Parameter | Description | Required? |
    | --------- | ----------- | --------- |
    | `<YOUR_WALLARM_USERNAME>` | Email to the **Deploy** or **Administrator** [user](user-guides/settings/users.md) account in Wallarm Console. | Yes	
    | `<YOUR_WALLARM_PASSWORD>` | Password to the **Deploy** or **Administrator** [user](user-guides/settings/users.md) account in Wallarm Console. | Yes
    | `<WALLARM_CLOUD>` | Wallarm Cloud name being used. Possible values are `eu` (by default) and `us1`. | No
    | `<WALLARM_NODE_NAME>` | Wallarm node name. By default, the script assigns the host name to the node.<br><br>The specified name can be changed in Wallarm Console → **Nodes** later. | No
    | `<DOMAIN_NAME>` | The Wallarm filtering node will be configured to handle traffic for this domain. The value can be your company website or public API endpoint. If not sure about which domain name to use, you can always experiment with any public site (e.g. `example.com`).<br><br>Default value is `localhost`. | No
    | `<ORIGIN_SERVER>` | The Wallarm filtering node will be configured to send upstream requests to the specified IP address or domain name. If this parameter is not specified explicitly, the script uses the value of `<DOMAIN_NAME>`. | No
6. Ensure the script returned the message `We've completed the Wallarm node deployment process`.

    If any errors occurred during the script execution, the script would return appropriate error messages.
7. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure the SQLi and XSS attacks are displayed in the list.
    
    ![!Attacks in the interface](images/admin-guides/test-attacks-quickstart.png)

## Next steps

Wallarm node quick deployment is successfully completed!

To continue the product exploring, we recommend learning more about the following Wallarm API Security features:

* [Configuration of traffic filtration mode](admin-en/configure-wallarm-mode.md)
* [Blocking page and error code configuration](admin-en/configuration-guides/configure-block-page-and-code.md)
* [Customizing the traffic filtration rules](user-guides/rules/intro.md)
* [IP address blacklisting](user-guides/blacklist.md)
* System event notifications configured via [native integrations with DevOps tools](user-guides/settings/integrations/integrations-intro.md) and [triggers](user-guides/triggers/triggers.md)

## Wallarm node production deployment

When the Wallarm quick start is completed and basic API Security features are explored, you are recommended to proceed to the production deployment.

[Wallarm production deployment options →](admin-en/supported-platforms.md)
