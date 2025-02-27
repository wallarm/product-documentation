[ptrav-attack-docs]:             ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../images/admin-guides/test-attacks-quickstart.png

# Wallarm Health Check

This document provides you with a checklist to ensure your Wallarm operates correctly.

| Operation                                                                                                                                                        | Expected behavior                   | Check  |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|--------|
| [You can log into Wallarm Console](#you-can-log-into-wallarm-console)                                                 | You can log in                      |        |
| [You have filtering node](#you-have-filtering-node)                                       | You see full user sessions          |        |
| [Wallarm registers and displays all traffic](#wallarm-registers-and-displays-all-traffic)                                       | You see full user sessions          |        |
| [Wallarm detects attacks](#wallarm-detects-attacks)                                                                     | Attacks are detected                |        |
| [Wallarm detects vulnerabilities](#wallarm-detects-vulnerabilities) | Vulnerabilities are created      |        |
| [Wallarm detects security incidents](#wallarm-detects-security-incidents) | Security incidents are created      |        |
| [IP lists work](#ip-lists-work)                                                                                         | IP addresses are blocked            |        |
| [Rules are sent to filtering node and work](#rules-are-sent-to-filtering-node-and-work)                                                                                         | Ruleset arrives to filtering node and works            |        |
| [Users can be configured and have proper access rights](#users-can-be-configured-and-have-proper-access-rights)                   | Users can be created and updated    |        |
| [User activity log has records](#user-activity-log-has-records)                                                                   | The log has records                 |        |
| [Reporting works](#reporting-works)                                                                                               | You receive reports                 |        | |

## You can log into Wallarm Console

Wallarm consists of [two parts](../about-wallarm/overview.md#how-wallarm-works): Wallarm Cloud and filtering node(s). While the filtering node protects, the Cloud stores your settings and protection results. Wallarm Console is a Web-based UI of the Cloud.

To check:

1.  Proceed to the link that corresponds to the Cloud you are using: 
    *   If you are using the US Cloud, proceed to the <https://us1.my.wallarm.com> link.
    *   If you are using the EU Cloud, proceed to the <https://my.wallarm.com> link.
2.  See if you can log in successfully.

      On successful login, you will found yourself at the [Threat Prevention](../user-guides/dashboards/threat-prevention.md) dashboard.

## You have filtering node

Filtering node is one of two [major parts](../about-wallarm/overview.md#how-wallarm-works) of Wallarm (another one - Cloud - was referred at the previous step). The node performs malicious requests detection and blocking. You can have several nodes but need at least one for the most of Wallarm protection functions to work.

To check:

1. Open Wallarm Console → **Configuration** → **Nodes**.
1. Apply filter to see only active nodes.
1. Check that you can send test requests to resources protected by one of your nodes.
1. If you cannot or there are no nodes, deploy the node for testing purposes.

!!! warning "Filtering node required"
    Most checks below require filtering node.

## Wallarm registers and displays all traffic

To provide a full visibility of your traffic, Wallarm's [API Sessions](../api-sessions/overview.md) display all requests - malicious and legitimate - in the form of step-by-step user sessions.

This check requires the [filtering node](#you-have-filtering-node).

To check:

1. Send a request to your resource:

      ```
      curl http://<resource_URL>
      ```

      Or send several requests with a bash script:

      ```
      for (( i=0 ; $i<10 ; i++ )) ;
      do 
         curl http://<resource_URL> ;
      done
      ```

      This example is for 10 requests.

1. Open Wallarm Console → **Dashboards** → [**Threat Prevention**](../user-guides/dashboards/threat-prevention.md) and check if the `requests / s` counter displays the corresponding value.
1. Open **Events** → **API Sessions**.
1. Find session with your requests.

## Wallarm detects attacks

This check requires the [filtering node](#you-have-filtering-node).

To check:

1. Open Wallarm Console → **Configuration** → **Nodes** to check whether you have deployed node(s). Consider [node deployment](../installation/supported-deployment-options.md) if there are no nodes.

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

See also [Checking the filter node operation](installation-check-operation-en.md)

## Wallarm detects vulnerabilities

Wallarm detects [vulnerabilities](../glossary-en.md#vulnerability) in your application APIs.

This check requires the [filtering node](#you-have-filtering-node).

To check:

1. Send a request to your resource:

      ```
      curl <RECOURSE_URL> -H 'jwt: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJjbGllbmRfaWQiOiIxIn0.' -H 'HOST: <TEST_HOST_NAME>'
      ```

      Note that if you already have a [weak JWT](../attacks-vulns-list.md#weak-jwt) vulnerability detected for the host (in any status, even closed), you need to specify a different `TEST_HOST_NAME` to see the new vulnerability registered.

1. Open Wallarm Console → **Events** → **Vulnerabilities** to check whether a weak JWT vulnerability was listed.

## Wallarm detects security incidents

In Wallarm, [incident](../glossary-en.md#security-incident) is an attack targeted at a confirmed [vulnerability](../glossary-en.md#vulnerability). For the weak JWT vulnerabilities from previous step, incidents are not created, so that to test [incidents](../user-guides/events/check-incident.md), use any other detected vulnerability.

This check requires the [filtering node](#you-have-filtering-node) and open vulnerability on your resource. If there are no vulnerabilities at the moment, skip this check for now.

To check:

1. Ensure you have an open vulnerability on your resource.
1. Send a malicious request to exploit the vulnerability.
1. Open Wallarm Console → **Events** → **Incidents** to check whether the incidents appeared. 

## IP lists work

In Wallarm, you can control access to your application APIs by allowlisting, denylisting, and graylisting of IP addresses the requests come from. Learn core logic of IP lists [here](../user-guides/ip-lists/overview.md).

This check requires the [filtering node](#you-have-filtering-node).

To check:

1. Open Wallarm Console → **Events** → **Attacks** and locate attack created by you during the [Filtering node detects attacks](#filtering-node-detects-attacks) check.
1. Copy attack source IP.
1. Go to Security Controls → **IP Lists** → **Allowlist**, and add copied source IP to this list.
1. Wait (about 2 minutes) until new IP list state is uploaded to the filtering node.
1. Send the same attack from this IP again. In **Attacks**, nothing should appear.
1. Remove the IP from the **Allowlist**.
1. Add the IP to the **Denylist**
1. Send legitimate requests as the ones in the [Wallarm monitors all requests](#wallarm-monitors-all-requests) step. The requests (even though the legitimate ones) should appear in **Attacks** as blocked.

## Rules are sent to filtering node and work

In Wallarm, you can use [rules](../user-guides/rules/rules.md) to change how the system detects malicious requests and acts when such malicious requests are detected. You create rules in Cloud via Wallarm Console, they form your custom ruleset, then Cloud sends it to the filtering node where they start to work.

This check requires the [filtering node](#you-have-filtering-node).

To check:

1. Open Wallarm Console → **Configuration** → **Nodes**.
1. Find your node and check the **Synced** column to make sure the node communicates with the Cloud. Normal interval should be no more than 2-4 minutes by default.
1. Click you node to see details, then check `custom_ruleset` version and time of installation.
1. Go to **Security Controls** → **Rules**.
1. Use **Add rule** → **Fine-tuning attack detection** → **Ignore certain attacks**, select to ignore **Path traversal** in `uri` part of request, then create the rule.
1. Wait for sync with the node with **.../... nodes synced** counter.
1. Click the counter to switch to the **Nodes** section.
1. Find your node and check its **Synced** time and `custom_ruleset` version. These things must update comparing to the previous state.
1. Repeat attack from the [Wallarm detects attacks](#wallarm-detects-attacks) check. Now this attack should be ignored.
1. Delete the rule.

## Users can be configured and have proper access rights

You can invite your team members to your Wallarm account and assign each one a specific role to safeguard sensitive information and limit account actions.

To check:

1. Ensure you have the **Administrator** role in Wallarm.
2. Create, change role, disable, and delete a user as described in [Configuring users](../user-guides/settings/users.md).

## User activity log has records

In Wallarm, you can check the history of user actions in [Activity Log](../user-guides/settings/audit-log.md).

To check:

1. Open Wallarm Console → **Configuration** → **Settings** → **Activity Log**.
1. Check that **Activity Log** has records.

## Reporting works

In Wallarm, you can filter detected events (attacks and incidents) and vulnerabilities and then export the results into a [PDF or CSV report](../user-guides/search-and-filters/custom-report.md).

To check:

1. Open Wallarm Console → **Events** → **Attacks**.
1. Apply some filters.
1. Click **Report** on the top right.
1. Select report type.
1. Make sure your email is put in and click **Export**.
1. Check if you receive the report and if it is available for download in the **Report** dialog.
