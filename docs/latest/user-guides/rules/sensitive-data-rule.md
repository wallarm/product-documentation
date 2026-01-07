[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Masking Sensitive Data

Wallarm provides the **Mask sensitive data** [rules](../rules/rules.md) to configure data masking for sensitive data not to leak outside the trusted environment. These rules cut the original value of the specified request point before sending the request to the postanalytics module and Wallarm Cloud. This article describes how to use these rules.

## Overview

In the [hybrid](../../about-wallarm/shared-responsibility.md#overview) Wallarm installations, when you manage the Wallarm filtering nodes in your infrastructure, and Wallarm manages the Wallarm Cloud component, it is crucial that sensitive data in your requests remains secure within your infrastructure and is not transmitted to any third-party service including [Wallarm Cloud](../../about-wallarm/overview.md#how-wallarm-works). This goal is achieved using the [shared responsibility model](../../about-wallarm/shared-responsibility.md): from its side, Wallarm never transmits data excessing the protection goal and stores all the obtained data [securely](../../about-wallarm/shared-responsibility.md#client-data-storage-in-wallarm-cloud) - to your side, Wallarm transfers a full visibility of what data is sent from node to Cloud and a [set of tools](../../admin-en/export-to-cloud.md) to shape this transfer under your needs - masking of sensitive data is one of these tools.

!!! info "Other deployment forms"
    While in **on-premise** [installations](../../about-wallarm/shared-responsibility.md#overview) data never leaves your security perimeter, and in **security edge** all data is outside this security perimeter, you can still use masking rules to restrict access to the sensitive data by the users of Wallarm Console.

## Side effects

Consider that using **Mask sensitive data** rules can affect:

* The display of [attacks](../../user-guides/events/check-attack.md) 
* The [enumeration attack protection](../../api-protection/enumeration-attack-protection.md)
* The API Sessions [grouping](../../api-sessions/setup.md#session-grouping) and [display of context parameters](../../api-sessions/setup.md#extra-parameters)

## Creating and applying rule

To set and apply data mask:

--8<-- "../include/rule-creation-initial-step.md"
1. Choose **Change requests/responses** → **Mask sensitive data**.
1. In **If request is**, [describe](rules.md#configuring) the scope to apply the rule to.
1. In **In this part of request**, specify [request points](request-processing.md) for which its original value should be cut.
1. Wait for the [rule compilation and uploading to the filtering node to complete](rules.md#ruleset-lifecycle).

## Example: masking of a cookie value

Let us say your application accessible at the `example.com` domain uses the `PHPSESSID` cookie for user authentication and you want to deny access to this information for employees using Wallarm.

To do so, set the **Mask sensitive data** rule as displayed on the screenshot.

--8<-- "../include/waf/features/rules/request-part-reference.md"

![Marking sensitive data][img-masking]
