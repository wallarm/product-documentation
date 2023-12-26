# Building and unloading of a custom ruleset

A custom ruleset defines specifics of processing particular client traffic (for example, allows setting up custom attack detection rules or masking sensitive data). The Wallarm node relies on the custom ruleset during incoming requests analysis.

Changes of custom rules do NOT take effect instantly. Changes are applied to the request analysis process only after the custom ruleset **building** and **unloading to the filtering node** are finished.

## Custom ruleset building

Adding a new rule, deleting or changing existing rules in the Wallarm Console → **Rules** launch a custom ruleset build. During the building process, rules are optimized and compiled into a format adopted for the filtering node. The process of building a custom ruleset typically takes from a few seconds for a small number of rules to up to an hour for complex rule trees.

Custom ruleset build status and expected completion time are displayed in Wallarm Console. If there is no build in progress, the interface displays the date of the last completed build.

![Build status](../../images/user-guides/rules/build-rules-status.png)

## Unloading a custom ruleset to the filtering node

Custom ruleset build is unloaded to the filtering node during the filtering node and Wallarm Cloud synchronization. By default, synchronization of the filtering node and Wallarm Cloud is launched every 2‑4 minutes. [More details on the filtering node and Wallarm Cloud synchronization configuration →](../../admin-en/configure-cloud-node-synchronization-en.md)

The status of unloading a custom ruleset to the filtering node is logged to the file `/var/log/wallarm/syncnode.log` (`/opt/wallarm/var/log/wallarm/syncnode.log` for all-in-one installer).

All Wallarm nodes connected to the same Wallarm account receive the same set of default and custom rules for traffic filtering. You still can apply different rules for different applications by using proper application IDs or unique HTTP request parameters like headers, query string parameters, etc.