# Wallarm Node — Version 2.2

## Changes Highlights

* Limits for resource consumption are introduced. If a query processing time exceeds a specified value, the query is considered an attack. Time limits for analysis and blocking are set with the `wallarm_process_time_limit_block` and `wallarm_process_time_limit directives`. A memory limit for NGINX operation is configured via the `wallarm_worker_rlimit_vmem` directive.

    Default values:
    
      * The time it takes to analyze a request is limited to 1 second (excluding the time it takes the backend to respond).
      * The NGINX worker memory is limited to 1 GB.

    See also [Wallarm configuration options](../admin-en/configure-parameters-en.md).

* Added the ability to control NGINX when filtration rules error out on download. You can now save backup copies of proton.db and [LOM](../glossary-en.md#lom). You can use the backup data when the filtration rules are missing or corrupted. When there is no option to use the backup data, the Wallarm module will be disabled, and NGINX will carry on. Before version 2.2. it was not possible to start NGINX without downloading the filtration rules.

    To manage the behavior on rules download error, use the `wallarm_fallback` and `wallarm_cache_path` directives in the configuration file.

    See also [Wallarm configuration options](../admin-en/configure-parameters-en.md).

* Improved the attack detection mechanisms.

* Optimized the NGINX server memory consumption.

* Added the ability to manage the blocking mode through filtration rules.
  
    You can manage the behavior with the  `wallarm_mode_allow_override` directive.

    See also [Wallarm configuration options](../admin-en/configure-parameters-en.md).

* The `/etc/wallarm/triggers.d/nginx` trigger is renamed to `/etc/wallarm/triggers.d/nginx-wallarm`. This trigger is used by NGINX-Wallarm.

## New Installation Features

* You can now install postanalytics on a separate pool of servers.

* The subsystem of traffic processing can be integrated with a running NGINX server. This integration scheme is restrictive for binary compatibility: the Wallarm module is compatible only with a particular NGINX version and can operate only with this version. Wallarm supports the latest stable version of NGINX. The list of recent NGINX versions is available at www.nginx.org.

!!! warning "NGINX package dependency"
    The Wallarm module packages does have the NGINX package dependency specified.
    
    Ensure you monitor the Wallarm module and NGINX compliance.
