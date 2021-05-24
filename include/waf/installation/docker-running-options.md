The WAF node configuration parameters should be passed to the deployed Docker container in one of the following ways:

* **In the environment variables**. This option allows for the configuration of only basic WAF node parameters. Most [directives][nginx-waf-directives] cannot be configured through environment variables.
* **In the mounted configuration file**. This option allows full WAF node configuration via any [directives][nginx-waf-directives]. With this configuration method, environment variables with the WAF node and Wallarm Cloud connection settings are also passed to the container.