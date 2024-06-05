[variability-in-endpoints-docs]:       ../../api-discovery/exploring.md#variability
[changes-in-api-docs]:       ../../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../../api-discovery/bola-protection.md

# Automatic BOLA Protection for Endpoints Found by API Discovery <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

This article describes automatic BOLA protection for endpoints discovered by [API Discovery](../../api-discovery/overview.md) (APID).

!!! info "Other BOLA protection measures"
    Alternatively or additionally, you can configure [BOLA protection with triggers](protecting-against-bola-trigger.md).

--8<-- "../include/bola-intro.md"

## Protection logic

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## Configuring

!!! info "API Discovery required"
    Automatic BOLA protection is available if you use the **[API Discovery](../../api-discovery/overview.md)** module.

To enable auto protection, proceed to Wallarm Console → **BOLA protection** and turn the switch to the enabled state:

![BOLA trigger](../../images/user-guides/bola-protection/trigger-enabled-state.png)

Then you can fine-tune the default Wallarm behavior by editing the BOLA autodetection template as follows:

* Change the threshold for requests from the same IP to be marked as the BOLA attacks.
* Change the reaction when exceeding threshold:

    * **Denylist IP** - Wallarm will [denylist](../../user-guides/ip-lists/overview.md) the IPs of the BOLA attack source and thus block all traffic these IPs produce.
    * **Graylist IP** - Wallarm will [graylist](../../user-guides/ip-lists/overview.md) the IPs of the BOLA attack source and thus block only malicious requests from these IPs and only if the filtering node is in the safe blocking [mode](../../admin-en/configure-wallarm-mode.md).

![BOLA trigger](../../images/user-guides/bola-protection/trigger-template.png)

## Disabling

To disable automated BOLA protection, turn the switch to the disabled state in the **BOLA protection** section.

Once your API Discovery subscription is expired, automated BOLA protection is disabled automatically.
