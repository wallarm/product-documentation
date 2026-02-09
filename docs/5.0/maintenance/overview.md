# Maintenance

This section provides comprehensive guidance on maintaining, monitoring, and upgrading your Wallarm deployment to ensure optimal performance and security.

## What's Included

* **Nodes & Infrastructure**
    * [Node Overview](../user-guides/nodes/nodes.md) - Manage and monitor your Wallarm nodes
    * [Resource Allocation](../admin-en/configuration-guides/allocate-resources-for-node.md) - Configure CPU and memory resources
    * [Cloud Synchronization](../admin-en/configure-cloud-node-synchronization-en.md) - Configure node synchronization with Wallarm Cloud
    * [Proxy Configuration](../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md) - Set up proxy for Wallarm API access
    * [Block Page Configuration](../admin-en/configuration-guides/configure-block-page-and-code.md) - Customize block pages and response codes
    * [Handling Invalid Headers](../admin-en/configuration-guides/handling-invalid-headers.md) - Configure behavior for invalid HTTP headers
    * [JA3 Fingerprinting](../admin-en/enabling-ja3.md) - Enable TLS fingerprinting for enhanced security
    * [Terraform Provider](../admin-en/managing/terraform-provider.md) - Manage Wallarm infrastructure as code

* **Monitoring & Metrics**
    * **NGINX Node Metrics**
        * [Overview](../admin-en/monitoring/intro.md) - Introduction to metrics collection system
        * [How to Fetch Metrics](../admin-en/monitoring/fetching-metrics.md) - Methods for retrieving node metrics
        * [Available Metrics](../admin-en/monitoring/available-metrics.md) - Complete list of available metrics
        * **Exporting Metrics to External Systems**
            * **Grafana**
                * [Export to InfluxDB via collectd](../admin-en/monitoring/network-plugin-influxdb.md) - Using collectd network plugin
                * [Export to Graphite via collectd](../admin-en/monitoring/write-plugin-graphite.md) - Using collectd write plugin
                * [Working with Metrics in Grafana](../admin-en/monitoring/working-with-grafana.md) - Visualize node metrics
            * **Nagios**
                * [Export via collectd-nagios](../admin-en/monitoring/collectd-nagios.md) - Using collectd-nagios utility
                * [Working with Metrics in Nagios](../admin-en/monitoring/working-with-nagios.md) - Monitor node metrics
            * **Zabbix**
                * [Export via collectd-nagios](../admin-en/monitoring/collectd-zabbix.md) - Using collectd-nagios utility
                * [Working with Metrics in Zabbix](../admin-en/monitoring/working-with-zabbix.md) - Monitor node metrics
    * [Statistics Service](../admin-en/configure-statistics-service.md) - Configure statistics collection
    * [Node Logging](../admin-en/configure-logging.md) - Configure log levels and output
    * [Failover Configuration](../admin-en/configure-backup-en.md) - Set up failover mechanisms
    * [Health Check](../admin-en/uat-checklist-en.md) - Verify node health and functionality

* **Upgrades & Migration**
    * [Versioning Policy](../updating-migrating/versioning-policy.md) - Understand Wallarm versioning and support lifecycle
    * [General Recommendations](../updating-migrating/general-recommendations.md) - Best practices for upgrades
    * [What's New](../updating-migrating/what-is-new.md) - Major changes and migration guide for new versions
    * **Changelogs**
        * [NGINX Node Changelog](../updating-migrating/node-artifact-versions.md) - Release notes for NGINX-based nodes
        * [Native Node Changelog](../updating-migrating/native-node/node-artifact-versions.md) - Release notes for Native nodes
        * [Connector Code Bundle](../installation/connectors/code-bundle-inventory.md) - Connector release notes
    * **NGINX Node Upgrades**
        * [DEB/RPM Packages](../updating-migrating/nginx-modules.md)
        * [Postanalytics Module](../updating-migrating/separate-postanalytics.md)
        * [All-in-One Installer](../updating-migrating/all-in-one.md)
        * [Docker Image](../updating-migrating/docker-container.md)
        * [Ingress Controller](../updating-migrating/ingress-controller.md)
        * [Ingress Controller Retirement](../updating-migrating/nginx-ingress-retirement.md)
        * [Sidecar Proxy](../updating-migrating/sidecar-proxy.md)
        * [Cloud Image](../updating-migrating/cloud-image.md)
        * [Multi-Tenant Node](../updating-migrating/multi-tenant.md)
    * **Native Node Upgrades**
        * [All-in-One Installer](../updating-migrating/native-node/all-in-one.md)
        * [Helm Chart](../updating-migrating/native-node/helm-chart.md)
        * [Docker Image](../updating-migrating/native-node/docker-image.md)

* **Operations**
    * [Learning Request Volume](../admin-en/operation/learn-incoming-request-number.md) - Determine API request volume for billing and capacity planning
    * [Scanner IP Addresses](../admin-en/scanner-addresses.md) - Wallarm scanner IP addresses for allowlisting

* **Troubleshooting**
    * [Overview](../troubleshooting/overview.md) - General troubleshooting guidance
    * [Detection and Blocking](../troubleshooting/detection-and-blocking.md) - Troubleshoot attack detection issues
    * [Detection Tools](../troubleshooting/detection-tools-tuning.md) - Fine-tune detection mechanisms
    * [Performance](../troubleshooting/performance.md) - Address performance issues
    * [Real Client IP](../admin-en/using-proxy-or-balancer-en.md) - Configure correct client IP detection
    * [End User Problems](../faq/common-errors-after-installation.md) - Common post-installation errors
    * [Wallarm Ingress Controller](../faq/ingress-installation.md) - Ingress-specific issues
    * [Wallarm Cloud is Down](../faq/wallarm-cloud-down.md) - Handle cloud unavailability
    * [OWASP Dashboard Alerts](../faq/node-issues-on-owasp-dashboards.md) - Resolve dashboard alerts
    * [NGINX Error Log](../troubleshooting/wallarm-issues-in-nginx-error-log.md) - Interpret NGINX error messages
    * [Dynamic DNS in NGINX](../admin-en/configure-dynamic-dns-resolution-nginx.md) - Configure dynamic DNS resolution
