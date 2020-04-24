# Wallarm Node — Version 2.10

## Changes Highlights

* The loading mechanism for filtration rules was reworked.
  * **Important:** changes in the file permissions
* The filtration rules format was enchanced.
  * Selectors by the absence of value.
  * Selectors by the HTTP request method.
  * Resolved a conflict between disabling attack types and vpatch implementation.
* The support for the Prometheus monitoring system was added.
* Metadata on whether the request was blocked is now saved.
* Added an option to set up tags in the NGINX configuration file.
* The directive wallarm_worker_rlimit_vmem was flagged as legacy.
* The support for Debian GNU/Linux 7.x (wheezy) was discontinued.

## New Method of Loading Filtration Rules

Previously, the LOM file was loaded into memory during the processing of the config file. To update the filtration rules, the NGINX reload was required.

Now the filtering rules are updated in the background mode, within a separate "cache manager" process, and there is no need to restart the NGINX workers.

Moreover, we changed the method for storing data in the memory. The results of the loading are cached into a file. Thanks to this, there is no need to reload the filtration rules each time the config file is updated.

!!! warning "File permissions"
    The user starting the NGINX worker processes must have read access to license.key, proton.db and LOM files.

When standard settings are in place, no additional configuring is necessary. However, if you use a custom NGINX package or run this service under a non-standard user, you will need to make the following changes:

* When installing a new filter node, run `addnode --nginx-group ...` to register it in Wallarm cloud
* As for the existing installations, add to `/etc/wallarm/node.yaml` the following:
  ```
  syncnode:
    group: ...
  ```

## Changes in the Filtration Rules Format

We've added the ability to add rules based on whether a specified parameter is absent in the request. Positive rules are also supported.

It is now also possible to process the request depending on the request method (GET/POST/etc.).

The earlier conflict between the rules for disabling the attack type and the virtual patch applied to one and the same parameter was resolved.

## Prometheus Monitoring Support

The directive [wallarm_status](../admin-en/configure-parameters-en.md#wallarm_status) now allows setting up metrics export in the Prometheus-compatible format.

## More...

The filtering node now saves data on whether request was blocked. This data is now available in attack view in Wallarm console.

In the NGINX configuration, you can now add additional information to each request in the key-value format using the directive [wallarm_set_tag](../admin-en/configure-parameters-en.md#wallarm_set_tag). This data is available for use in the postanalytics subsystem.

The directive [wallarm_worker_rlimit_vmem](../admin-en/configure-parameters-en.md#wallarm_worker_rlimit_vmem) is now rendered obsolete; its behavior is equivalent to [wallarm_ts_request_memory_limit](../admin-en/configure-parameters-en.md#wallarm_ts_request_memory_limit).

The support for Debian GNU/Linux 7.x (wheezy) was discontinued.
