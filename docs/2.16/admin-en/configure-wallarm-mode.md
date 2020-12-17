[anchor0]:      #available-filtering-modes
[anchor1]:      #the-wallarm_mode-directive
[anchor2]:      #the-wallarm_mode_allow_override-directive
[anchor3]:      #the-general-filtration-rule-on-the-wallarm-cloud
[anchor4]:      #the-filtering-mode-rules-in-the-rules-tab

[link-rules]:               ../user-guides/rules/intro.md
[link-mode-rules]:          ../user-guides/rules/wallarm-mode-rule.md

[img-general-settings]:     ../images/configuration-guides/configure-wallarm-mode/en/general-settings-page.png

#   Filtering Mode Configuration

You can configure the filtering mode for the Wallarm filter nodes to define their behavior when processing incoming requests.

The filtering mode can be configured in the following ways:
*   [Assign a value to the `wallarm_mode` directive in the filter node configuration file][anchor1].
*   [Assign a value to the `wallarm_mode_allow_override` directive in the filter node configuration file][anchor2].
*   [Define the general filtration rule on the Wallarm cloud][anchor3].
*   [Create a filtration mode rule in the *Rules* tab of the Wallarm cloud][anchor4].

### Available Filtering Modes

The available filtering modes are listed in order from the mildest to the strictest in the following list:
*   **off**: request filtering is not performed
*   **monitoring**: requests are processed but none are blocked, even if malicious requests are detected
*   **block**: requests are processed and all detected malicious requests are blocked.

##  The `wallarm_mode` Directive

Using the `wallarm_mode` directive in the filter node configuration file, you can define filtering modes for different contexts. These contexts are ordered from the most global to the most local in the following list:
*   **http**: the directives inside the `http` block are applied to the requests sent to the HTTP server
*   **server**: the directives inside the `server` block are applied to the requests sent to the virtual server
*   **location**: the directives inside the `location` block are only applied to the requests containing that particular path

If different `wallarm_mode` directive values are defined for the `http`, `server`, and `location` blocks, the most local configuration has the highest priority.

The available filtering modes are listed [above][anchor0].

####    The `wallarm_mode` Directive Usage Example

```
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
    }
}
```

In this example, the filtering modes are defined for the resources as follows:
1.  The `monitoring` mode is applied to the requests sent to the HTTP server.
    1.  The `monitoring` mode is applied to the requests sent to the virtual server `SERVER_A`.
    2.  The `off` mode is applied to the requests sent to the virtual server `SERVER_B`.
    3.  The `off` mode is applied to the requests sent to the virtual server `SERVER_C`, except for the requests that contain the `/main/content` or the `/main/login` path.
        1.  The `monitoring` mode is applied to the requests sent to the virtual server `SERVER_C` that contain the `/main/content` path.
        2.  The `block` mode is applied to the requests sent to the virtual server `SERVER_C` that contain the `/main/login` path.

##  The `wallarm_mode_allow_override` Directive

The `wallarm_mode_allow_override` directive manages the ability to apply rules that are defined on the Wallarm cloud instead of using the `wallarm_mode` directive values from the filter node configuration file.

The following values are valid for the `wallarm_mode_allow_override` directive:
*   **off**: rules specified on the cloud are ignored. Rules specified by the `wallarm_mode` directive in the configuration file are applied.
*   **strict**: only the rules specified on the cloud that define stricter filtering modes than those defined by the `wallarm_mode` directive in the configuration file are applied.

    The available filtering modes ordered from the mildest to the strictest are listed [above][anchor0].

*   **on**: rules specified on the cloud are applied. Rules specified by the `wallarm_mode` directive in the configuration file are ignored.

The contexts in which the `wallarm_mode_allow_override` directive value can be defined, in order from the most global to the most local, are presented in the following list:
*   **http**: the directives inside the `http` block are applied to the requests sent to the HTTP server
*   **server**: the directives inside the `server` block are applied to the requests sent to the virtual server
*   **location**: the directives inside the `location` block are only applied to the requests containing that particular path

If different `wallarm_mode_allow_override` directive values are defined in the `http`, `server`, and `location` blocks, the most local configuration has the highest priority.

####    The `wallarm_mode_allow_override` Directive Usage Example

```
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

This configuration example results in the following applications of the filtering mode rules from the Wallarm cloud:
1.  The filtering mode rules defined on the Wallarm cloud are ignored for requests sent to the virtual server `SERVER_A`. There is no `wallarm_mode` directive specified in the `server` block that corresponds to the `SERVER_A` server, which is why the `monitoring` filtering mode specified in the `http` block is applied for such requests.
2.  The filtering mode rules defined on the Wallarm cloud are applied to the requests sent to the virtual server `SERVER_B` except for the requests that contain the `/main/login` path.
3.  For those requests that are sent to the virtual server `SERVER_B` and contain the `/main/login` path, the filtering mode rules defined on the Wallarm cloud are only applied if they define a filter mode that is stricter than the `monitoring` mode.

##  The General Filtration Rule on the Wallarm Cloud

The radio buttons in the *General* tab in the *Settings* section of the Wallarm web interface define the general filtration mode for all incoming requests. The `wallarm_mode` directive value defined in the `http` block in the configuration file has the same action scope as these buttons.

The local filter mode settings in the [*Rules* tab][anchor4] of the Wallarm cloud have higher priority than the global settings in the *Global* tab.

!!! info "The Effect of the Filtering Mode Rules"
    The filtering mode rules defined on the Wallarm cloud are only applied if the [`wallarm_mode_allow_override` directive configuration][anchor2] allows redefining the filtering mode with the rules specified on the Wallarm cloud.

Perform the following actions to define the general filtration mode rule on the Wallarm cloud:
1.  Sign in to the Wallarm cloud by proceeding to the correct link depending on the cloud version you are using:
    *   If you are using the European version of the Wallarm cloud, sign in on this page <https://my.wallarm.com/login>.
    *   If you are using the US version of the Wallarm cloud, sign in on this page <https://us1.my.wallarm.com/login>.

2.  Proceed to the *General* tab in the *Settings* section. The link to this page depends on the cloud version you are using:
    *   If you are using the European version of the Wallarm cloud, proceed to this page <https://my.wallarm.com/settings/general>.
    *   If you are using the US version of the Wallarm cloud, proceed to this page <https://us1.my.wallarm.com/settings/general>.
    
In the *General* tab, you can specify one of the following filtering modes:
*   **Local settings (default)**: the `wallarm_mode_allow_override` directive value is ignored and the filtering mode defined using the [`wallarm_mode` directive value][anchor1] is applied.
*   **Monitoring**: requests are processed but none are blocked, even if malicious requests are detected.
*   **Blocking**: requests are processed and all the detected malicious requests are blocked.
    
![!The general settings tab][img-general-settings]

!!! info "The Wallarm Cloud and WAF node synchronization"
    The rules defined on the Wallarm Cloud are applied during the Wallarm Cloud and WAF node synchronization process, which is conducted once every 2 minutes.

    [More details on the WAF node and Wallarm Cloud synchronization configuration →](configure-cloud-node-synchronization-en.md)

## The Filtering Mode Rules in the *Rules* Tab

You can fine-tune the filtering mode for processing requests that meet your custom conditions in the *Rules* tab of the Wallarm interface. These rules have higher priority than the [general filtering rule set on the Wallarm cloud][anchor3].

!!! info "The Effect of the Filtering Mode Rules"
    The filtering mode rules defined on the Wallarm cloud are only applied if the [`wallarm_mode_allow_override` directive configuration][anchor2] allows redefining the filtering mode with the rules specified on the Wallarm cloud.

For more detailed information about working with rules in the *Rules* tab, proceed to this [link][link-rules].

To see the step-by-step guide for creating a rule that manages the filtration mode, proceed to this [link][link-mode-rules].

!!! info "The Wallarm Cloud and WAF node synchronization"
    The rules defined on the Wallarm Cloud are applied during the Wallarm Cloud and WAF node synchronization process, which is conducted once every 2 minutes.

    [More details on the WAF node and Wallarm Cloud synchronization configuration →](configure-cloud-node-synchronization-en.md)

## The Filtration Mode Configuration Example

Let us consider the example of a filter mode configuration that uses all of the methods mentioned above.

### Setting up Filtering Mode in the Filter Node Configuration File

```
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

### Setting up Filtering Mode in the Wallarm Cloud
*   General filtering rule: *Monitoring*.
*   Filtering rules
    *   If the request meets the following conditions:
        *   Method: `POST`
        *   First part of the path: `main`
        *   Second part of the path: `apply`,
        
        then apply the “Default” filtering mode.
        
    *   If the request meets the following condition:
        *   First part of the path: `main`,
        
        then apply the “Blocking” filtering mode.
        
    *   If the request meets the following conditions:
        *   First part of the path: `main`
        *   Second part of the path: `login`,
        
        then apply the “Monitoring” filtering mode.

### Examples of Requests Sent to the Server `SERVER_A`

Examples of the requests sent to the configured server `SERVER_A` and the actions that the Wallarm filter node applies to them are the following:
*   The malicious request with the `/news` path is processed but not blocked due to the `wallarm_mode monitoring;` setting for the server `SERVER_A`.

*   The malicious request with the `/main` path is processed but not blocked due to the `wallarm_mode monitoring;` setting for the server `SERVER_A`.

    The “Blocking” rule defined in the cloud is not applied to it due to the `wallarm_mode_allow_override off;` setting for the server `SERVER_A`.

*   The malicious request with the `/main/login` path is blocked due to the `wallarm_mode block;` setting for the requests with the `/main/login` path.

    The “Monitoring” rule defined in the cloud is not applied to it due to the `wallarm_mode_allow_override strict;` setting in the filter node configuration file.

*   The malicious request with the `/main/signup` path is blocked due to the `wallarm_mode_allow_override strict;` setting for the requests with the `/main/signup` path and the “Blocking” rule defined on the Wallarm cloud for the requests with the `/main` path.

*   The malicious request with the `/main/apply` path and the `GET` method is blocked due to the `wallarm_mode_allow_override on;` setting for the requests with the `/main/apply` path and the “Blocking” rule defined on the Wallarm cloud for the requests with the `/main` path.

*   The malicious request with the `/main/apply` path and the `POST` method is blocked due to the `wallarm_mode_allow_override on;` setting for those requests with the `/main/apply` path, the “Default” rule defined on the Wallarm cloud, and the `wallarm_mode block;` setting for the requests with the `/main/apply` path in the filter node configuration file.