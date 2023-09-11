# API Discovery <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Discovery** section of Wallarm Console enables you to manage your [API inventory](../about-wallarm/api-discovery.md), as well as to fine-tune its discovery. This guide instructs you on using this section.

The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** and **Analyst** can view and manage the data discovered by the API Discovery module, and access the API Discovery configuration part.

    **Global Administrator** and **Global Analyst** in the accounts with the multitenancy feature have the same rights.
* **API Developer** can view and download the data discovered by the API Discovery module. This role allows distinguishing users whose tasks only require using Wallarm to get actual data on company APIs. These users do not have access to any Wallarm Console sections except for **API Discovery** and **Settings → Profile**.

![Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

!!! info "Default view: time period, sorting and grouping"

    **Time period**

    Each time you open the **API Discovery** section:
    
    * You see actual inventory of your APIs (all discovered endpoints)
    * The **Changes since** filter goes to the `Lask week` state, which means:

        * From the presented endpoints, the `New` and `Changed` within this period will obtain corresponding [marks](#tracking-changes-in-api)
        * Additionally, endpoints `Deleted` within this period will be displayed

    See [this example](#example) to understand what API Discovery displays by default.

    You can manually select other time periods to be covered.

    **Sorting and grouping**

    By default, endpoints are sorted by host/endpoint names (and grouped by hosts). If you sort by **Hits** or **Risk**, grouping goes away - to get back to the default, click hosts/endpoint column again.

## Filtering endpoints

Among a wide range of API endpoint filters, you can choose the ones corresponding to your analysis purpose, e.g.:

* Only attacked endpoints that you can sort by the number of hits.
* Find the endpoints that have been changed or newly discovered in the last week and that process PII data. This kind of request can help you to stay up to date with critical changes in your APIs.
* Find the endpoints being used to upload data to your server by the PUT or POST calls. Since such endpoints are a frequent attack target, they should be well secured. Using this kind of request you can check that endpoints are known to the team and are well secured from attacks.
* Find the endpoints processing customers' bank card data. With this request, you can check that sensitive data is processed only by secured endpoints.
* Find the endpoints of a deprecated API version (e.g. by searching `/v1`) and make sure that they are not used by clients.
* Find the most vulnerable endpoints characterized by processing sensitive data and active vulnerabilities of the high risk level. Exploiting vulnerabilities of a high risk level allows attackers to perform many malicious actions with the system including stealing sensitive data that the endpoint processes/stores.

All filtered data can be exported in the OpenAPI v3 for additional analysis.

## Viewing endpoint parameters

<a name="params"></a>By clicking the endpoint, you can also find the endpoint details, including request statistics, required and optional parameters with the relevant data types:

![Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

Each parameter information includes:

* Parameter name and the part of request this parameter belongs to
* Information about parameter changes (new, unused)
* Presence and type of sensitive data (PII) transmitted by this parameter, including:

    * Technical data like IP and MAC addresses
    * Login credentials like secret keys and passwords
    * Financial data like bank card numbers
    * Medical data like medical license number
    * Personally identifiable information (PII) like full name, passport number or SSN

* [Type/format](../about-wallarm/api-discovery.md#parameter-types-and-formats) of data sent in this parameter
* Date and time when parameter information was last updated

## Tracking changes in API

You can check what [changes occurred](../about-wallarm/api-discovery.md#tracking-changes-in-api) in the API within the specified period of time. To do that, from the **Changes since** filter, select the appropriate period or date. The following marks will be displayed in the endpoint list:

* **New** for the endpoints added to the list within the period.
* **Changed** for the endpoints that have newly discovered parameters or parameters that obtained the `Unused` status within the period. In the details of the endpoint such parameters will have a corresponding mark.

    * A parameter gets the `New` status if is is discovered within the period.
    * A parameter gets the `Unused` status if it does not pass any data for 7 days. 
    * If later the parameter in the `Unused` status passes data again it will lose the `Unused` status.

* **Unused** for the endpoints that obtained the `Unused` status within the period.

    * An endpoint gets the `Unused` status if it is not requested (with the code 200 in response) for 7 days.
    * If later the endpoint in the `Unused` status is requested (with the code 200 in response) again it will lose the `Unused` status.

Note that whatever period is selected, if nothing is highlighted with the **New**, **Changed** or **Unused** mark, this means there are no changes in API for that period.

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

!!! info "Default period"
    Each time you open the **API Discovery** section, the **Changes since** filter goes to the `Last week` state, which means only the changes occurred within the last week are highlighted.

Using the **Changes since** filter only highlights the endpoints changed within the selected period, but does not filter out endpoints without changes.

The **Changes in API** filter works differently and shows **only** endpoints changed within the selected period and filters out all the rest.

<a name="example"></a>Let us consider the example: say your API today has 10 endpoints (there were 12, but 3 of them were marked unused 10 days ago). 1 of this 10 was added yesterday, 2 have changes in their parameters occurred 5 days ago for one and 10 days ago for another:

* Each time you open the **API Discovery** section today, the **Changes since** filter will go to the `Last week` state; page will display 10 endpoints, in the **Changes** column 1 of them will have the **New** mark, and 1 - the **Changed** mark.
* Switch **Changes since** to `Last 2 weeks` - 13 endpoints will be displayed, in the **Changes** column 1 of them will have the **New** mark, 2 - the **Changed** mark, and 3 - the **Unused** mark.
* Set **Changes in API** to `Unused endpoints` - 3 endpoints will be displayed, all with the **Unused** mark.
* Change **Changes in API** to `New endpoints + Unused endpoints` - 4 endpoints will be displayed, 3 with the **Unused** mark, and 1 with the **New** mark.
* Switch **Changes since** back to `Last week` - 1 endpoint will be displayed, it will have the **New** mark.

## Working with risk score

The [risk score](../about-wallarm/api-discovery.md#endpoint-risk-score) allows you to understand which endpoints are most likely to be an attack target and therefore should be the focus of your security efforts.

Risk score may be from `1` (lowest) to `10` (highest):

| Value | Risk level | Color |
| --------- | ----------- | --------- |
| 1 to 3 | Low | Gray |
| 4 to 7 | Medium | Orange |
| 8 to 10 | High | Red |

* `1` means no risk factors for this endpoint.
* Risk score is not displayed (`N/A`) for the unused endpoints.
* Sort by risk score in the **Risk** column.
* Filter out `High`, `Medium` or `Low` using the **Risk score** filter.

!!! info "Configuring risk score calculation"
    By default, the API Discovery module automatically calculates a risk score for each endpoint based on the well-proven risk factor weights. To adapt risk score estimation under your understanding of importance of factors, you can [configure](#customizing-risk-score-calculation) the weight of each factor and a risk score calculation method.

To understand what caused the risk score for the endpoint and how to reduce the risk, go to the endpoint details:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

## Monitoring attacks on API endpoints

Number of attacks on API endpoints for the last 7 days are displayed in the **Hits** column.

You can:

* Request displaying only attacked endpoints by selecting in filters: **Others** → **Attacked endpoints**.
* Sort by the **Hits** column.

To see attacks to some endpoint, click number in the **Hits** column:

![API endpoint - open events](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

The **Events** section will be displayed with the [filter applied](../user-guides/search-and-filters/use-search.md):

```
attacks last 7 days endpoint_id:<YOUR_ENDPOINT_ID>
```

You can also copy some endpoint URL to the clipboard and use it to search for the events. To do this, in this endpoint menu select **Copy URL**.

## API inventory and rules

You can quickly create a new [custom rule](../user-guides/rules/intro.md) from any endpoint of API inventory: 

1. In this endpoint menu select **Create rule**. The create rule window is displayed. The endpoint address is parsed into the window automatically.
1. In the create rule window, specify rule information and then click **Create**.

![Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Displaying shadow and orphan API

The **API Discovery** module automatically uncovers shadow and orphan APIs by comparing the actual registered traffic with the [customers' provided specifications](../user-guides/api-specifications.md). To display [shadow and orphan APIs](../about-wallarm/api-discovery.md#shadow-and-orphan-apis) among endpoints discovered by Wallarm:

* Use the **Compare to...** filter to select specification comparisons - only for them the shadow and orphan APIs will be highlighted by the special marks in the **Issues** column.

    ![API Discovery - highlighting and filtering shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-shadow-orphan.png)

* Use the **Other** → **Shadow API** and **Orphan API** filters to see only shadow and orphan APIs related to the selected comparisons and filter out the remaining endpoints.

The endpoint is defined as shadow or orphan API as the result of the comparison of the actual traffic with some specifications (there may be several). They will be listed in the endpoint details, in the **Specification conflicts** section.

Shadow APIs are also displayed among the riskiest endpoints at the [API Discovery Dashboard](../user-guides/dashboards/api-discovery.md).

## Download OpenAPI specification (OAS) of your API inventory

The API Discovery UI provides you with an option to download the [OpenAPI v3](https://spec.openapis.org/oas/v3.0.0) specification of either an individual API endpoint or an entire API discovered by Wallarm.

* The **Download OAS** button on the API inventory page returns `swagger.json` for the entire inventory or only the filtered data if any filters were applied before downloading.

    With the downloaded data, you can identify missing endpoints (Shadow API) and unused endpoints (Zombie API) in your specification compared to Wallarm's discoveries.

    !!! warning "API host information in downloaded Swagger file"
        If a discovered API inventory contains several API hosts, endpoints from all API hosts will be included in the downloaded Swagger file. Currently, the API host information is not included in the file.

* The **Download OAS** button in an individual endpoint menu returns `swagger.json` for the selected endpoint.

    By utilizing the downloaded specification with other applications like Postman, you can conduct endpoint vulnerability and other tests. In addition, it allows for a closer examination of the endpoint's capabilities to uncover the processing of sensitive data and the presence of undocumented parameters.

## Automatic BOLA protection

Wallarm can [automatically discover and protect endpoints that are vulnerable to the BOLA attacks](../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) among the ones explored by the **API Discovery** module. If the option is enabled, protected endpoints are highlighted with the corresponding icon in the API inventory, e.g.:

![BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

You can filter API endpoints by the BOLA auto protection state. The corresponding parameter is available under the **Others** filter.

## Configuring API Discovery

By clicking the **Configure API Discovery** button in the **API Discovery** section, you proceed to the API discovery fine-tuning options, such as choosing applications for API discovery and customizing the risk score calculation.

### Choosing applications for API Discovery

If the [API Discovery](../about-wallarm/api-discovery.md) subscription is purchased for your company account, you can enable/disable traffic analysis with API Discovery in Wallarm Console → **API Discovery** → **Configure API Discovery**.

You may enable/disable API Discovery for all applications or only the selected ones.

![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

When you add a new application in **Settings** → **[Applications](settings/applications.md)**, it is automatically added to the list of applications for API discovery in the **disabled** state.

### Customizing risk score calculation

You can configure the weight of each factor in [risk score](../about-wallarm/api-discovery.md#endpoint-risk-score) calculation and calculation method.

Defaults: 

* Calculation method: `Use the highest weight from all criteria as endpoint risk score`.
* Default factor weights:

    | Factor | Weight |
    | --- | --- |
    | Active vulnerabilities | 9 |
    | Potentially vulnerable to BOLA | 6 |
    | Parameters with sensitive data | 8 |
    | Number of query and body parameters | 6 |
    | Accepts XML / JSON objects | 6 |
    | Allows uploading files to the server | 6 |

To change how risk score is calculated: 

1. Click the **Configure API Discovery** button in the **API Discovery** section.
1. Select calculation method: highest or average weight.
1. If necessary, disable factors you do not want to affect a risk score.
1. Set weight for the remaining.

    ![API Discovery - Risk score setup](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)
1. Save changes. Wallarm will re-calculate the risk score for your endpoints in accordance with the new settings in several minutes.
