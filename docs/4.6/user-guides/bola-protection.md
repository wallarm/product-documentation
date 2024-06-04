[variability-in-endpoints-docs]:       ../api-discovery/exploring.md#variability-in-endpoints
[changes-in-api-docs]:       ../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../api-discovery/bola-protection.md

# BOLA protection <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **BOLA protection** section of the Wallarm Console UI enables you to configure mitigation of [BOLA (IDOR) attacks](../attacks-vulns-list.md#broken-object-level-authorization-bola) targeted at the API endpoints explored by the **API Discovery** module.

This section is available under the following conditions:

* The [API Discovery](../api-discovery/overview.md) module is enabled
* The user [role](settings/users.md#user-roles) is either **Administrator** or **Global Administrator**

    The section is also availabe in read-only mode for **Analysts** and **Global Analysts**.

!!! info "Variations of BOLA mitigation"

    BOLA mitigation is available in the following variations:

    * Automated mitigation for the endpoints explored by the **API Discovery** module (the UI for configuration is covered in this article)
    * Mitigation for any endpoints protected by the Wallarm nodes - this option is configured manually via the corresponding trigger

    Find more details in the [general instructions on BOLA (IDOR) protection](../admin-en/configuration-guides/protecting-against-bola.md).

## Configuring automated BOLA protection

For Wallarm to analyze endpoints explored by the API Discovery module for BOLA vulnerabilities and protect those that are at risk, **turn the switch to the enabled state**.

![BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

Then you can fine-tune the default Wallarm behavior by editing the BOLA autodetection template as follows:

* Change the threshold for requests from the same IP to be marked as the BOLA attacks.
* Change the reaction when exceeding threshold:

    * **Denylist IP** - Wallarm will [denylist](ip-lists/denylist.md) the IPs of the BOLA attack source and thus block all traffic these IPs produce.
    * **Graylist IP** - Wallarm will [graylist](ip-lists/graylist.md) the IPs of the BOLA attack source and thus block only malicious requests from these IPs and only if the filtering node is in the safe blocking [mode](../admin-en/configure-wallarm-mode.md).

![BOLA trigger](../images/user-guides/bola-protection/trigger-template.png)

## Automated BOLA protection logic

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## Disabling automated BOLA protection

To disable automated BOLA protection, turn the switch to the disabled state in the **BOLA protection** section.

Once your API Discovery subscription is expired, automated BOLA protection is disabled automatically.
