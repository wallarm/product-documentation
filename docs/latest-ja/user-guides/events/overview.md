# Threat Management Overview

Wallarm's **Threat Management** provides full, real-time picture of your security posture and allows controlling used protection tools. This article gives an overview of Threat Management components, their purpose and main possibilities.

## Overview

Threat Management provides full picture of what is happening: 

* Do you want visualized interactive summary for attacks, endpoints, protection tools in action? Use [dashboards](#dashboards).
* Do you want to see occurring attacks, taken measures, and tools that provided these measures? Work with [attacks](#attacks), easily [adjust](check-attack.md#responding-to-attacks) the tools.
* Work in the same way with [incidents](#incidents).
* Do you want informative documents on attacks, incidents or vulnerabilities? Generate PDF or CSV [reports](#reports) with the filtered data of you choice.

![Threat Management](../../images/user-guides/events/tm-diagram-no-sessions.png)

All Threat Management components include advanced search and filtering capabilities. You can also make PDF and CSV reports for attacks and incidents with the filtered content of you choice. Wallarm uses the sophisticated grouping mechanisms to logically combine requests into attacks and sessions and provides you with the ability to modify how Sessions are detected to make a full match to your application logic.

## Dashboards

Threat Management's dashboards provide visualized summaries for your security perimeter and posture. All being interactive, they provide you with quick access to details and data in different parts of the system and configuration tools.

![Threat Management - dashboards](../../images/user-guides/events/tm-overview-dashboards.png)

* Get clear vision of the malicious traffic volume and its distribution by attack types, sources, protocols, authentication methods, etc. with the [**Threat Prevention**](../../user-guides/dashboards/threat-prevention.md) dashboard.
* Review data about your API collected by the Wallarm's API Discovery with the [**API Discovery**](../../user-guides/dashboards/api-discovery.md) dashboard.
* Check covering the OWASP API Security Top 10 2023 and proactively implement security controls on the [**OWASP API Security Top 10 - 2023**](../../user-guides/dashboards/owasp-api-top-ten.md) dashboard.

## Attacks

Wallarm continuously analyzes application traffic, detects and mitigates attacks in real-time. The [**Attacks**](check-attack.md) section of the Wallarm Console is the central hub for analyzing current attempts of penetrating your security perimeter and its staying protected from them as well as the tool for configuring additional security measures.

![Threat Management - Attacks](../../images/user-guides/events/filter-for-falsepositive.png)

With **Attacks** section you can:

* See current attacks and Wallarm's taken measures and limit what you see to:

    * Attacks of specific types
    * From specific IPs or geographical locations
    * Occurred in specific time
    * To specific applications or domains
    * Etc.

* See the same info for different periods - up to last 3 months
* Create or modify [rules](../../user-guides/rules/rules.md#what-you-can-do-with-rules) for treating similar attacks in future
* Correct Wallarm decision making by highlighting [false positives](check-attack.md#false-positives)

## Incidents

The incidents are the attacks targeted at a confirmed vulnerability. The [**Incidents**](check-incident.md) section connects all common attack data with the vulnerability it tries to exploit and thus you can:

* Have all info and tools available in **Attacks**
* Get related vulnerability data and full info of its 

![Threat Management - Incidents](../../images/user-guides/events/incident-vuln.png)

## Reports

For attacks, incidents or vulnerabilities, generate PDF or CSV [reports](../../user-guides/search-and-filters/custom-report.md). Do you want selected data? Apply filters and only filtered data will become the part of report.

![Attacks - creating report](../../images/user-guides/search-and-filters/custom-report.png)
