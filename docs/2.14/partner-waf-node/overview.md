# Partner scheme overview

## Definition of a partner and partner WAF node

**Partner** is an organization that installs a WAF node within its system infrastructure and distributes the system with a WAF node to its own clients.

**Partner WAF node** is a WAF node installed by the partner.

## Scheme of traffic processsing by a partner WAF node

If one partner WAF node is installed within the partner infrastructure, client traffic is processed as follows:

![!Traffic flow for a partner scheme](../images/partner-waf-node/partner-traffic-processing.png)

* One WAF node processes traffic of several clients (Client 1, Client 2).
* The WAF node identifies the client that receives the traffic by the partner-client link ID (`wallarm_instance`).
* For the domains `https://client1.com` and `https://client2.com`, the DNS A records with the partner IP address `225.130.128.241` are configured. This setting is shown as an example, a different setting can be used on the partner and client side.
* On the partner's side, proxying of legitimate requests to the addresses of clients Client 1 (`http://upstream1:8080`) and Client 2 (`http://upstream2:8080`) is configured. This setting is shown as an example, a different setting can be used on the partner and client side.

If several partner WAF nodes are installed within the partner infrastructure, client traffic is processed similarly but on several partner servers.

## Partner account

### Partner account features

Wallarm supports particular partner accounts to work with partners. A partner account allows the partner to:

* Install one or several partner WAF nodes within its system infrastructure and define settings for client traffic processing
* Create separate accounts for clients in the Wallarm Console and provide clients with access to these accounts
* Brand the Wallarm Console and select the language of the Wallarm Console interface (English or Russian)
* Host the Wallarm Console on its own domain
* Brand client emails and reports
* Set the email address of own technical support to recieve messages from clients

Depending on the Wallarm WAF subscription plan, some features may not be available.

### Partner account components

**Partner account** includes several components:

* **Technical client account** for access of partner users to the Wallarm Console, for adding [global partner users](../user-guides/settings/users.md#user-roles).
* **Partner client accounts** for access of [global partner users](../user-guides/settings/users.md#user-roles) and client users to the Wallarm Console, for setting ID for the partner-client link.

![!Acconts on the partner scheme](../images/partner-waf-node/accounts-scheme.png)

All partner account components are visually presented in the Wallarm Console for the [global partner users](../user-guides/settings/users.md#user-roles). For example:

![!Selector of clients in the Wallarm Console](../images/partner-waf-node/clients-selector-in-console.png)

* `Demo partner` is a partner account
* `Technical client` is a technical client account
* `Client 1` and `Client 2` are partner client accounts

## Partner WAF node characteristics

Partner WAF node has the following characteristics:

* Can be installed on the same platforms and according to the same instructions as a regular WAF node:

    --8<-- "../include/waf/installation/supported-platforms-214.md"
* Can be installed on the **technical client** or **partner client** level. If you want to provide a client with access to the Wallarm Console, the WAF node must be installed at the corresponding partner client level.
* Can be configured according to the same instructions as a regular WAF node, except for:
    * The directive [`wallarm_instance`](../admin-en/configure-parameters-en.md#wallarm_instance) is used to split settings by clients. Splitting by applications does not work.
    * To enable blocking of requests by IP addresses, please send a request to [Wallarm technical support](mailto:support@wallarm.com). After blocking is enabled, to block IP addresses, you need to add them to the blacklist at the technical client account level.

## How to become a partner and install a partner WAF node

To become a partner and install a partner WAF node within your infrastructure:

1. [Create](creating-partner-account.md) a partner account in the Wallarm system.
2. [Create and link](connecting-clients.md) clients.
3. [Install and configure](installing-partner-waf-node.md) a partner WAF node.
