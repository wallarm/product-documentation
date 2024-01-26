[acl-access-phase]:     ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 

# Filtration Mode

Filtration mode defines the filtering node behavior when processing incoming requests. These instructions describe available filtration modes and their configuration methods.

## Available filtration modes

The Wallarm filtering node can process incoming requests in the following modes (from the mildest to the strictest):

* **Disabled** (`off`)
* **Monitoring** (`monitoring`)
* **Safe blocking** (`safe_blocking`)
* **Blocking** (`block`)

--8<-- "../include/wallarm-modes-description-latest.md"

## Methods of the filtration mode configuration

The filtration mode can be configured in the following ways:

* Assign a value to the `wallarm_mode` directive in the filtering node configuration file

    !!! warning "Support of the `wallarm_mode` directive on the CDN node"
        Please note that the `wallarm_mode` directive cannot be configured on the [Wallarm CDN nodes](../installation/cdn-node.md). To configure the filtration mode of the CDN nodes, please use other available methods.
* Define the general filtration rule in Wallarm Console
* Create a filtration mode rule in the **Rules** section of Wallarm Console

Priorities of the filtration mode configuration methods are determined in the [`wallarm_mode_allow_override` directive](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override). By default, the settings specified in Wallarm Console have a higher priority than the `wallarm_mode` directive regardless of its value severity.

### Specifying the filtration mode in the `wallarm_mode` directive

!!! warning "Support of the `wallarm_mode` directive on the CDN node"
    Please note that the `wallarm_mode` directive cannot be configured on the [Wallarm CDN nodes](../installation/cdn-node.md). To configure the filtration mode of the CDN nodes, please use other available methods.

Using the `wallarm_mode` directive in the filtering node configuration file, you can define filtration modes for different contexts. These contexts are ordered from the most global to the most local in the following list:

* `http`: the directives inside the `http` block are applied to the requests sent to the HTTP server.
* `server`: the directives inside the `server` block are applied to the requests sent to the virtual server.
* `location`: the directives inside the `location` block are only applied to the requests containing that particular path.

If different `wallarm_mode` directive values are defined for the `http`, `server`, and `location` blocks, the most local configuration has the highest priority.

**The `wallarm_mode` directive usage example:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode off;
    }
    
    server {
        server_name SERVER_C;
        wallarm_mode off;
        
        location /main/content {
            wallarm_mode monitoring;
        }
        
        location /main/login {
            wallarm_mode block;
        }

        location /main/reset-password {
            wallarm_mode safe_blocking;
        }
    }
}
```

In this example, the filtration modes are defined for the resources as follows:

1. The `monitoring` mode is applied to the requests sent to the HTTP server.
2. The `monitoring` mode is applied to the requests sent to the virtual server `SERVER_A`.
3. The `off` mode is applied to the requests sent to the virtual server `SERVER_B`.
4. The `off` mode is applied to the requests sent to the virtual server `SERVER_C`, except for the requests that contain the `/main/content`, `/main/login`, or the `/main/reset-password` path.
      1. The `monitoring` mode is applied to the requests sent to the virtual server `SERVER_C` that contain the `/main/content` path.
      2. The `block` mode is applied to the requests sent to the virtual server `SERVER_C` that contain the `/main/login` path.
      3. The `safe_blocking` mode is applied to the requests sent to the virtual server `SERVER_C` that contain the `/main/reset-password` path.

### Setting up the general filtration rule in Wallarm Console

The radio buttons on the **General** tab of Wallarm Console settings in the [US Wallarm Cloud](https://us1.my.wallarm.com/settings/general) or [EU Wallarm Cloud](https://my.wallarm.com/settings/general) define the general filtration mode for all incoming requests. The `wallarm_mode` directive value defined in the `http` block in the configuration file has the same action scope as these buttons.

The local filtration mode settings on the **Rules** tab of Wallarm Console have higher priority than the global settings on the **Global** tab.

On the **General** tab, you can specify one of the following filtration modes:

* **Local settings (default)**: filtration mode defined using the [`wallarm_mode` directive](#specifying-the-filtering-mode-in-the-wallarm_mode-directive) is applied
* [**Monitoring**](#available-filtration-modes)
* [**Safe blocking**](#available-filtration-modes)
* [**Blocking**](#available-filtration-modes)
    
![The general settings tab](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

!!! info "The Wallarm Cloud and filtering node synchronization"
    The rules defined in Wallarm Console are applied during the Wallarm Cloud and filtering node synchronization process, which is conducted once every 2‑4 minutes.

    [More details on the filtering node and Wallarm Cloud synchronization configuration →](configure-cloud-node-synchronization-en.md)

### Setting up the filtration rules on the "Rules" tab

You can fine-tune the filtration mode for processing requests that meet your custom conditions on the **Rules** tab of Wallarm Console. These rules have higher priority than the [general filtration rule set in Wallarm Console](#setting-up-the-general-filtration-rule-in-wallarm-console).

To set a filtration mode, create a **Set filtration mode** rule and select the appropriate mode. To implement this rule, the NGINX configuration files must permit [centralized management of the operation mode][link-wallarm-mode-override].

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**Default instance of rule**

Wallarm automatically creates the instance of the `Set filtration mode` rule on the [default](../../user-guides/rules/view.md#default-rules) level. The system sets its value on the basis of [general filtration mode](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) setting.

This instance of the rule cannot be deleted. To change its value, modify [general filtration mode](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) setting of the system.

As all the other default rules, the `Set filtration mode` default rule is [inherited](../../user-guides/rules/view.md) by all branches.

**Example: Disabling Request Blocking During User Registration**

**If** the following conditions take place:

* new user registration is available at *example.com/signup*
* it is better to overlook an attack than to lose a customer

**Then**, to create a rule disabling blocking during user registration

1. Go to the *Rules* tab
1. Find the branch for `example.com/signup`, and click *Add rule*
1. Choose *Set filtration mode*
1. Choose operation mode *monitoring*
1. Click *Create*

![Setting traffic filtration mode][img-mode-rule]

**API calls to create the rule**

To create the filtration mode rule, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

The following request will create the rule setting the node to filter traffic going to the [application](../settings/applications.md) with ID `3` in the monitoring mode.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

!!! info "The Wallarm Cloud and filtering node synchronization"
    The rules defined in Wallarm Console are applied during the Wallarm Cloud and filtering node synchronization process, which is conducted once every 2‑4 minutes.

    [More details on the filtering node and Wallarm Cloud synchronization configuration →](configure-cloud-node-synchronization-en.md)

### Setting up priorities of the filtration mode configuration methods using `wallarm_mode_allow_override`

!!! warning "Support of the `wallarm_mode_allow_override` directive on the CDN node"
    Please note that the `wallarm_mode_allow_override` directive cannot be configured on the [Wallarm CDN nodes](../installation/cdn-node.md).

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

**The `wallarm_mode_allow_override` directive usage example:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
        wallarm_mode_allow_override off;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode_allow_override on;
        
        location /main/login {
            wallarm_mode_allow_override strict;
        }
    }
}
```

This configuration example results in the following applications of the filtration mode rules from Wallarm Console:

1. The filtration mode rules defined in Wallarm Console are ignored for requests sent to the virtual server `SERVER_A`. There is no `wallarm_mode` directive specified in the `server` block that corresponds to the `SERVER_A` server, which is why the `monitoring` filtration mode specified in the `http` block is applied for such requests.
2. The filtration mode rules defined in Wallarm Console are applied to the requests sent to the virtual server `SERVER_B` except for the requests that contain the `/main/login` path.
3. For those requests that are sent to the virtual server `SERVER_B` and contain the `/main/login` path, the filtration mode rules defined in Wallarm Console are only applied if they define a filtration mode that is stricter than the `monitoring` mode.

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
* [Filtration rules](#setting-up-the-filtration-rules-on-the-rules-tab):
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

## Best practices on gradual filtration mode application

For a successful onboarding of a new Wallarm node, follow these step-by-step recommendations to switch filtration modes:

1. Deploy Wallarm filtering nodes in your non-production environments with the operation mode set to `monitoring`.
1. Deploy Wallarm filtering nodes in your production environment with the operation mode set to `monitoring`.
1. Keep the traffic flowing via the filtering nodes in all your environments (including testing and production) for 7‑14 days to give the Wallarm cloud-based backend some time to learn about your application.
1. Enable Wallarm `block` mode in all your non-production environments and use automated or manual tests to confirm that the protected application is working as expected.
1. Enable Wallarm `block` mode in the production environment and use available methods to confirm that the application is working as expected.
