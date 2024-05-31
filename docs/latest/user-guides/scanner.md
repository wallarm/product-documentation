# Exposed Assets <a href="../../about-wallarm/subscription-plans/#waap-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **Scanner** section of Wallarm Console allows you to see all of your public assets, such as domains, IP addresses, and ports, that have been automatically discovered by Wallarm Scanner.

As the project grows, resources increase and control decreases. Resources may be located outside of the company's data centers, which can compromise security. Wallarm helps assess security using methods similar to ethical hackers, giving visibility over the results.

![Scanner section](../images/user-guides/scanner/check-scope.png)

## Adding assets

To trigger Wallarm to discover your company's exposed assets, add the first public asset manually. Click **Add domain or IP** and enter one of your domains or IPs:

![Scanner section](../images/user-guides/scanner/add-asset-manually.png)

After the new domain or IP address is added, the Wallarm Scanner launches the scanning procedure to search for assets connected with the resource and adds them to the list. Wallarm first scans ports and then detects the network resources on these ports.

Various methods are used in the continuous process of collecting and updating exposed assets:

* Automatic modes
    * DNS zone transfer ([AXFR](https://tools.ietf.org/html/rfc5936))
    * NS and MX records receiving
    * SPF records data receiving
    * Subdomain dictionary search
    * SSL certificate parsing
* Manual data entry via the Wallarm Console UI or [Wallarm API](../api/overview.md).

You can [control asset discovery methods](#fine-tuning-asset-scanning) in the **Configure** section.

## Reserving a domain

You can request Wallarm to reserve domains which can only be added to the list of your company's exposed assets. To prevent other accounts from adding these domains, send a reservation request to [support@wallarm.com](mailto:support@wallarm.com).

## Managing assets

Wallarm categorizes exposed assets into domains, IPs, and services groups. If an IP address belongs to a specific data center, the corresponding tag, such as AWS for Amazon or GCP for Google, is displayed next to the asset.

Newly discovered assets that have not been viewed by any user are displayed on the **New** tab, while the **Disabled** tab shows assets for which vulnerability scanning is [disabled](#disabling-vulnerability-scanning-for-certain-assets).

The resource's domain, IP address, and port are interdependent. By selecting an asset, you can view its associations, such as a domain associated with a selected IP address:

![Scope element with its associations](../images/user-guides/scanner/asset-with-associations.png)

### Controlling assets' connections

By default, higher priority assets remain active when lower priority ones are disabled. [Disabling](#disabling-vulnerability-scanning-for-certain-assets) a domain disables the associated IP addresses and ports. [Deleting](#deleting-assets) an IP address deletes associated ports, but keeps the domain active. By deleting assets' connections, you can disable or delete each of them individually.

To manage each asset's scanning settings independently:

1. Select one asset from the asset pair you need to disconnect from each other.
1. Click the switch next to the asset paired with the current one.

    The name of the current resource is shown in bold. The UI also displays its discovery date.

![Disable the resource connection](../images/user-guides/scanner/disable-association.png)

To enable assets' interconnection, follow the same steps as when you were disabling the interconnection.

### Deleting assets

By **deleting** assets, you can report assets accidentally added by Wallarm to the list. The deleted assets will not be discovered during future scannings.

To recover assets deleted by mistake, contact the [Wallarm support team](mailto:support@wallarm.com).

### Notifications about changes in the exposed asset list

Wallarm can send you notifications about changes in the exposed asset list: newly discovered exposed assets, disabled and deleted ones.

To get the notifications, configure appropriate [native integrations](settings/integrations/integrations-intro.md) with the messengers or SOAR systems (e.g. PagerDuty, Opsgenie, Slack, Telegram).

Example of the Slack message:

```
[Test message] [Test partner] Network perimeter has changed

Notification type: new_scope_object_ips

New IP addresses were discovered in the network perimeter:
8.8.8.8

Client: TestCompany
Cloud: EU
```

## Fine-tuning asset scanning

To fine-tune asset scanning in Wallarm, click the **Configure** button. From there, you can control which methods the Wallarm Scanner uses to find your company's exposed assets. By default, all available methods are used.

![Scanner config](../images/user-guides/vulnerabilities/scanner-configuration-options.png)

There is also the global switcher for the Wallarm Scanner called **Basic Scanner functionality**. This switcher enables or disables the Scanner for your entire company account, controlling both the asset scanning and vulnerability discovery processes. You can also find the same toggle switch in the **Vulnerabilities** section. Changing the switch in one section will automatically update the setting in the other section as well.

## Scanning exposed assets for vulnerabilities

Wallarm uses multiple methods to discover security issues in your infrastructure, including scanning your exposed assets for typical vulnerabilities. The Scanner automatically checks all IP addresses and domains for vulnerabilities after collecting the exposed assets.

The [**Vulnerabilities** section](vulnerabilities.md) of Wallarm Console displays discovered vulnerabilities and allows to control which vulnerabilities should be discovered.

### Disabling vulnerability scanning for certain assets

In the **Scanner** section, every asset has a switch that allows you to turn vulnerability scanning on or off for that particular asset. The switch is located to the left of the asset that is currently selected and is displayed in bold text. You don't need to hover over the element to locate the switch.

### Limiting vulnerability scanning

Wallarm Scanner uses test malicious requests to detect vulnerabilities in discovered resources based on the resource response. To avoid overwhelming your resources, you can manage the Requests Per Second (RPS) and Requests Per Minute (RPM) of Wallarm Scanner requests. The Active Threat Verification module also limits requests based on user-defined values when they are directed at resources from exposed assets.

To set the same limits for all domains and IP addresses, click **Configure** and set values in the corresponding section.

To override limits for specific IP addresses or domains:

1. Open an asset of the **Domain** or **IP** type.
1. Click the **Set RPS limits** button and specify the limit.

    If setting RPS for a domain, you can set it for each of the domain's dependent IP addresses by entering the desired value in the **RPS per IP** field.
1. Click **Save**.

To return to the default settings, use an empty value or enter `0`.

![Setting domain RPS](../images/user-guides/scanner/set-rps-for-domain.png)

If multiple domains are associated with the same IP address, the speed of requests to this IP address will not exceed the limits for the IP address. If multiple IP addresses are associated with one domain, then the total speed of requests to these IP addresses within this domain will not exceed the limits for the domain.

## Preventing Scanner from being blocked

If besides Wallarm, you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you configure an allowlist with the [IP addresses](../admin-en/scanner-addresses.md) for the Wallarm Scanner.

This will allow Wallarm components to seamlessly scan your resources for vulnerabilities.

## Contacting Wallarm support to stop the resource scanner

If the Wallarm scanner scans your company's resources that you never set for discovery, [contact Wallarm Support](mailto:support@wallarm.com) to exclude the resource from scanning.
