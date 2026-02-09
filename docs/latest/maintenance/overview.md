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
        * [Overview](../admin-en/nginx-node-metrics.md) - Monitor NGINX-based node performance
        * [Postanalytics Metrics](../admin-en/wstore-metrics.md) - Track postanalytics module metrics
        * [wcli Controller Metrics](../admin-en/wcli-metrics.md) - Monitor wcli controller performance
        * [API Firewall Metrics](../admin-en/apifw-metrics.md) - Track API Firewall statistics
    * **Native Node Metrics**
        * [Overview](../admin-en/native-node-metrics.md) - Monitor Native node performance
        * [Postanalytics Metrics](../admin-en/native-node-metrics-wstore.md) - Track postanalytics module metrics
        * [Runtime Metrics](../admin-en/native-node-metrics-gonode.md) - Monitor runtime performance
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
        * [All-in-One Installer](../updating-migrating/all-in-one.md)
        * [Docker Image](../updating-migrating/docker-container.md)
        * [Ingress Controller](../updating-migrating/ingress-controller.md)
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
