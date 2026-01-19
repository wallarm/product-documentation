# Wallarm On-Premises Solution Maintenance

This document provides guidance on maintaining the Wallarm Cloud component in on-premises deployments. It covers regular maintenance activities, versioning approach, monitoring setup, etc.

## Summary of ongoing maintenance activities

The Wallarm Cloud on-premise component requires the following regular maintenance activities:

1. Prompt software upgrades to the latest available Wallarm Cloud patch version.
1. Planned software upgrades to newly available major/minor releases.
1. Review of reported API attacks for any false positives and introduction of necessary configuration corrections.
1. Timely review of Wallarm Cloud automated notification (dispatched via email, Slack, SIEM, or any other configured integrations).

## Monitoring

The Wallarm Cloud is shipped with a built-in monitoring system based on Victoria Metrics, Alertmanager, and Grafana open-source components, already preconfigured with:

* Data/metrics exporters  
* Metrics collector  
* A set of monitoring alerts for all critical Wallarm Cloud workflows  
* A set of Grafana dashboards that cover all major system and application metrics

By default, the monitoring alerts are dispatched to the administrator email address.

We recommend using your existing enterprise monitoring system to monitor the following parameters of the deployed Wallarm solution:

1. The Wallarm Cloud API endpoint is accessible via HTTPS protocol and replies with a non-error HTTP code.
1. All deployed Wallarm Cloud nodes are ICMP-reachable.
1. The load balancer IP address (VIP in case of the built-in software load balancer) is ICMP-reachable.
1. Wallarm Filtering Nodes are timely uploading all required data to the Wallarm Cloud instance ([this page](../../admin-en/configure-statistics-service.md) provides information about available Filtering Node metrics).
1. Wallarm Filtering Nodes are not reporting any errors communicating with the Wallarm Cloud instance.

## Software releases

The version of Wallarm Cloud is defined by the version of the used **wctl** tool.

Similar to the [versioning policy of the Wallarm Filtering Node](../../updating-migrating/versioning-policy.md), the Wallarm Cloud component uses `MAJOR.MINOR.PATCH-BUILD` software versioning convention:

* Wallarm releases a major version of the Wallarm Cloud software every 6 months or as needed for major changes.
* Minor versions (enhancements and new capabilities within existing functionality, without introducing major new use cases) can be released monthly.
* Patch versions (patches for minor bug fixes or specific enhancements) are released as needed.

Similar to the Filtering Node, some Wallarm Cloud releases are marked as LTS (Long Term Support) versions, which are supported with critical bug and security vulnerability fixes for 14 months.

It is recommended that all new Wallarm on-premises customers initially deploy the latest version of Wallarm Cloud software (not the LTS version) and build necessary policies and processes to update as quickly as possible to new Wallarm Cloud releases.

Note that there is a dependency between versions of the supported Wallarm Filtering Node and Wallarm Cloud:

* Every Wallarm Cloud software release documents what Wallarm Filtering Node versions are supported by the release.
* Typically, the most recent version of Wallarm Filtering Node is supported only by the latest Wallarm Cloud software version (not the LTS version).

## High-level software update process overview

The following is a high-level overview of the Wallarm Cloud component software update process:

1. Review the Wallarm Cloud release notes and identify any risks or new factors for your specific environment (new product features, changes in existing features, bug fixes, updated Wallarm configuration data, security updates, etc).
1. Following your organization’s [change management process](https://www.atlassian.com/itsm/change-management), formulate and review a written plan for performing the software upgrade procedure. If necessary, ask the Wallarm team for assistance.
1. Upgrade your staging environment and verify the system's functionality using the predefined testing checklist. Watch for [false positives](../../user-guides/events/check-attack.md#false-positives) of detected API attacks.
1. Plan a maintenance window for your production environment.
1. Temporarily switch your production environment to the `monitoring` mode (disable the `block` [mode](../../admin-en/configure-wallarm-mode.md) for handling API attacks).
1. Upgrade your production environment and verify the system's functionality using the predefined testing checklist (primarily check the attack detection and false positives).
1. Switch your production environment back to the `block` mode.
1. Plan and upgrade your Wallarm Cloud DR instance.
1. Document the newly updated environments.
