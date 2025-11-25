# Telemetry Portal for Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

The telemetry portal for [Security Edge Inline](overview.md) provides Grafana dashboards with real-time insights into metrics on traffic processed by Wallarm.

![!](../../../images/waf-installation/security-edge/inline/telemetry/telemetry-portal.png)

## Available dashboards

The telemetry portal includes two dashboards:

* [Portal Inline NGINX Logs](../../security-edge/inline/telemetry-portal-logs-dashboard.md) 

    You can use this dashboard to inspect recent NGINX error and access logs, which helps with troubleshooting server issues and monitoring incoming requests.

* [Portal Inline Overview with Logs](../../security-edge/inline/telemetry-portal-main-dashboard.md)

    You can use this dashboard to view key metrics such as total processed requests, requests per second (RPS), detected and blocked attacks, number of deployed Edge Nodes, resource consumption, number of 5xx responses, etc.

The dashboards use standard Grafana features like [sharing](https://grafana.com/docs/grafana/latest/visualizations/dashboards/share-dashboards-panels/), [filtering](https://grafana.com/docs/grafana/latest/visualizations/dashboards/search-dashboards/), [exporting](https://grafana.com/docs/grafana/latest/visualizations/dashboards/share-dashboards-panels/#export-a-dashboard-as-json), and [alert rules](https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rules/).

!!! info "View-only permissions"
    These dashboards are presented in view-only mode. In this mode, you cannot rearrange panels or edit the layout. 

## Running telemetry portal

**Run telemetry portal** once the Node reaches the [**Active** status](upgrade-and-management.md#statuses). It becomes accessible via a direct link from the Security Edge section about 5 minutes after starting.

![!](../../../images/waf-installation/security-edge/inline/telemetry/run-telemetry-portal.png)

From the Grafana home page, to reach the dashboard, navigate to **Dashboards** → **Wallarm**.

![!](../../../images/waf-installation/security-edge/inline/telemetry/telemetry-portal-dashboards.png)