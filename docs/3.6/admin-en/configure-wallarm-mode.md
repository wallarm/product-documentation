[acl-access-phase]:     ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 

# Configuration of filtration mode

Filtration mode defines the filtering node behavior when processing incoming requests. These instructions describe available filtration modes and their configuration methods.

## Available filtration modes

The Wallarm filtering node can process incoming requests in the following modes (from the mildest to the strictest):

* **Disabled** (`off`)
* **Monitoring** (`monitoring`)
* **Safe blocking** (`safe_blocking`)
* **Blocking** (`block`)

--8<-- "../include/wallarm-modes-description-3.6.md"

## Methods of the filtration mode configuration

The filtration mode can be configured in the following ways:

* Set the mode locally via the corresponding NGINX directive, Docker environment variable, Ingress or pod annotation, etc., depending on the [node deployment method](supported-platforms.md)
* Define the general filtration rule in Wallarm Console
* Define the filtration mode on a per-application basis via Wallarm Console
* Create a filtration mode rule in the **Rules** section of Wallarm Console

Priorities of the filtration mode configuration methods are determined in the [`wallarm_mode_allow_override` directive](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override). By default, the settings specified in Wallarm Console have a higher priority than the local settings regardless of their value severity.

### Setting up the filtration mode locally

!!! warning "Unsupported by Wallarm CDN nodes"
    [Wallarm CDN nodes](../installation/cdn-node.md) allow filtration mode setup only via the Wallarm Console UI. Local settings are unsupported.

You can set the traffic filtration mode in the local configuration files of the Wallarm node as the selected [deployment option](supported-platforms.md) allows:

* For the node installed from [DEB/RPM packages](supported-platforms.md#deb-and-rpm-packages) or the cloud images ([AWS](installation-ami-en.md)/[GCP](installation-gcp-en.md)) - use the `wallarm_mode` NGINX directive. Using this directive, you can define filtration modes for different contexts:

    * `http`: the directives inside the `http` block are applied to the requests sent to the HTTP server.
    * `server`: the directives inside the `server` block are applied to the requests sent to the virtual server.
    * `location`: the directives inside the `location` block are only applied to the requests containing that particular path.

    If different `wallarm_mode` directive values are defined for the `http`, `server`, and `location` blocks, the most local configuration has the highest priority.
* For the node deployed from the Docker [NGINX](installation-docker-en.md)/[Envoy-based](installation-guides/envoy/envoy-docker.md) image - use the `WALLARM_MODE` environment variable.
* For the node deployed as the NGINX Ingress controller - use the `nginx.ingress.kubernetes.io/wallarm-mode` [per-Ingress annotation](configure-kubernetes-en.md#ingress-annotations).
* For the node [deployed to AWS using the Terraform module](../installation/cloud-platforms/aws/terraform-module/overview.md) - use the `mode` variable.

The possible values of the listed directives/parameters:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

### Setting up the general filtration rule in Wallarm Console

The radio buttons on the **General** tab of Wallarm Console settings in the [US Wallarm Cloud](https://us1.my.wallarm.com/settings/general) or [EU Wallarm Cloud](https://my.wallarm.com/settings/general) define the general filtration mode for all incoming requests:
    
![!The general settings tab](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

This setting will result in the [default **Set filtration mode** rule](../user-guides/rules/wallarm-mode-rule.md#default-instance-of-rule). This rule will have the following priority among other filtration mode setup options:

* A higher priority than the mode set in the local configuration files unless the [`wallarm_mode_allow_override` directive sets another behavior](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override).
* A lower priority than the [custom rules configured for specific domains, paths or applications](#setting-up-the-filtration-rules-in-the-rules-section).

--8<-- "../include/waf/features/filtration-mode/info-about-node-clod-sync.md"

### Setting up the filtration mode on a per-application basis in Wallarm Console

In [Wallarm Console → **Settings** → **Applications**](../user-guides/settings/applications.md), you can set filtration mode for certain applications:

![!UI to set up mode for apps](../images/user-guides/settings/configure-app.png)

This setting will result in the [**Set filtration mode** rule](../user-guides/rules/wallarm-mode-rule.md) generated for a certain application. This rule will have the following priority among other filtration mode setup options:

* A higher priority than the mode set in the local configuration files unless the [`wallarm_mode_allow_override` directive sets another behavior](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override).
* A higher priority than the [general filtration rule set in Wallarm Console](#setting-up-the-general-filtration-rule-in-wallarm-console).
* A lower priority than the custom rules configured for specific paths of the selected application (if any).

--8<-- "../include/waf/features/filtration-mode/info-about-node-clod-sync.md"

### Setting up the filtration rules in the "Rules" section

You can manually fine-tune the filtration mode for processing requests that meet your custom conditions in the **Rules** section of Wallarm Console. These rules have the following priority among other filtration mode setup options:

* A higher priority than the mode set in the local configuration files unless the [`wallarm_mode_allow_override` directive sets another behavior](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override).
* A higher priority than the [general filtration rule set in Wallarm Console](#setting-up-the-general-filtration-rule-in-wallarm-console).

[Step-by-step guide for creating a rule that manages the filtration mode →](../user-guides/rules/wallarm-mode-rule.md)

--8<-- "../include/waf/features/filtration-mode/info-about-node-clod-sync.md"

### Setting up priorities of the filtration mode configuration methods using `wallarm_mode_allow_override`

!!! warning "Unsupported by Wallarm CDN nodes"
    The `wallarm_mode_allow_override` directive cannot be configured on [Wallarm CDN nodes](../installation/cdn-node.md).

The `wallarm_mode_allow_override` directive manages the ability to apply rules that are defined on Wallarm Console instead of using the `wallarm_mode` directive values from the filtering node configuration file.

The following values are valid for the `wallarm_mode_allow_override` directive:

* `off`: rules specified in Wallarm Console are ignored. Rules specified by the `wallarm_mode` directive in the configuration file are applied.
* `strict`: only the rules specified in the Wallarm Cloud that define stricter filtration modes than those defined by the `wallarm_mode` directive in the configuration file are applied.

    The available filtration modes ordered from the mildest to the strictest are listed [above](#available-filtration-modes).

* `on` (by default): rules specified in Wallarm Console are applied. Rules specified by the `wallarm_mode` directive in the configuration file are ignored.

The contexts in which the `wallarm_mode_allow_override` directive value can be defined, in order from the most global to the most local, are presented in the following list:

* `http`: the directives inside the `http` block are applied to the requests sent to the HTTP server.
* `server`: the directives inside the `server` block are applied to the requests sent to the virtual server.
* `location`: the directives inside the `location` block are only applied to the requests containing that particular path.

If different `wallarm_mode_allow_override` directive values are defined in the `http`, `server`, and `location` blocks, then the most local configuration has the highest priority.

## Configuration of filtration mode example

Let us consider the example of a filtration mode configuration that uses all of the methods mentioned above.

### Setting up filtration mode in the filtering node configuration file

```bash
http {
    
    wallarm_mode block;
        
    server { 
        server_name SERVER_A;
        wallarm_mode monitoring;
        wallarm_mode_allow_override off;
        
        location /main/login {
            wallarm_mode block;
            wallarm_mode_allow_override strict;
        }
        
        location /main/signup {
            wallarm_mode_allow_override strict;
        }
        
        location /main/apply {
            wallarm_mode block;
            wallarm_mode_allow_override on;
        }
    }
}
```

### Setting up the filtration mode in Wallarm Console

* [General filtration rule](#setting-up-the-general-filtration-rule-in-wallarm-console): **Monitoring**.
* [Filtration rules](#setting-up-the-filtration-rules-in-the-rules-section):
    * If the request meets the following conditions:
        * Method: `POST`
        * First part of the path: `main`
        * Second part of the path: `apply`,
        
        then apply the **Default** filtration mode.
        
    * If the request meets the following condition:
        * First part of the path: `main`,
        
        then apply the **Blocking** filtration mode.
        
    * If the request meets the following conditions:
        * First part of the path: `main`
        * Second part of the path: `login`,
        
        then apply the **Monitoring** filtration mode.

### Examples of requests sent to the server `SERVER_A`

Examples of the requests sent to the configured server `SERVER_A` and the actions that the Wallarm filtering node applies to them are the following:

* The malicious request with the `/news` path is processed but not blocked due to the `wallarm_mode monitoring;` setting for the server `SERVER_A`.

* The malicious request with the `/main` path is processed but not blocked due to the `wallarm_mode monitoring;` setting for the server `SERVER_A`.

    The **Blocking** rule defined in Wallarm Console is not applied to it due to the `wallarm_mode_allow_override off;` setting for the server `SERVER_A`.

* The malicious request with the `/main/login` path is blocked due to the `wallarm_mode block;` setting for the requests with the `/main/login` path.

    The **Monitoring** rule defined in Wallarm Console is not applied to it due to the `wallarm_mode_allow_override strict;` setting in the filtering node configuration file.

* The malicious request with the `/main/signup` path is blocked due to the `wallarm_mode_allow_override strict;` setting for the requests with the `/main/signup` path and the **Blocking** rule defined in Wallarm Console for the requests with the `/main` path.
* The malicious request with the `/main/apply` path and the `GET` method is blocked due to the `wallarm_mode_allow_override on;` setting for the requests with the `/main/apply` path and the **Blocking** rule defined in Wallarm Console for the requests with the `/main` path.
* The malicious request with the `/main/apply` path and the `POST` method is blocked due to the `wallarm_mode_allow_override on;` setting for those requests with the `/main/apply` path, the **Default** rule defined in Wallarm Console, and the `wallarm_mode block;` setting for the requests with the `/main/apply` path in the filtering node configuration file.

## Checking the final filtration mode

The **Events** section of Wallarm Console displays the final filtration mode the node processed a hit. Check the `final_wallarm_mode` tag of a hit, e.g.:

![!Raw format of the request](../images/user-guides/events/analyze-attack-raw.png)
