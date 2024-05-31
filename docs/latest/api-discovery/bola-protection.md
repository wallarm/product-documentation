# Automatic Protection Against BOLA Attacks <a href="../../about-wallarm/subscription-plans/#waap-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Behavioral attacks such as [Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) exploit the vulnerability of the same name. This vulnerability allows an attacker to access an object by its identifier via an API request and either read or modify its data bypassing an authorization mechanism.

Potential targets of the BOLA attacks are endpoints with variability. Wallarm can automatically discover and protect such endpoints among the ones explored by the [API Discovery](overview.md) module.

To enable automatic BOLA protection, proceed to Wallarm Console → [**BOLA protection**](../admin-en/configuration-guides/protecting-against-bola.md) and turn the switch to the enabled state:

![BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

Each protected API endpoint will be highlighted with the corresponding icon in the API inventory, e.g.:

![BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

You can filter API endpoints by the BOLA auto protection state. The corresponding parameter is available under the **Others** filter.
