# API Discovery

This section describes how to use the API structure built by the [API Discovery](../about-wallarm-waf/api-discovery.md) module.

The built API structure is presented in the **API Discovery** section. The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** or **Analyst** for the regular accounts.
* **Global Administrator** or **Global Analyst** for the accounts with the multitenancy feature.

To provide users with familiar format of API representation, Wallarm visualizes the discovered API structure in a **Swagger-like manner**.

The API structure includes the following elements:

* Customer applications with discovered domains.
* Discovered endpoints grouped by domains. For each endpoint, the HTTP method is displayed.

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## Filtering endpoints

You can filter the discovered API structure:

* For the endpoint search, in the search string, type what your endpoint path may contain. Regular expressions are not allowed.
* Use **Application**, **Domain** and **Method** filters.
* Use the **PII** filter to filter endpoints by the sensitive data types being passed in the parameters. 
* In the **Domains** panel, click application or domain.

## Viewing endpoint parameters

<a name="params"></a>By clicking the endpoint, you can also find the set of required and optional parameters with the relevant data types:

![!Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

To sort, click the name of the column. To change the sorting order, click again.

Each parameter information includes:

* Parameter name and the part of request this parameter belongs to
* Presence and type of sensitive data (PII) transmitted by this parameter, including:

    * Technical data like IP and MAC addresses
    * Login credentials like secret keys and passwords
    * Financial data like bank card numbers
    * Personally identifiable information (PII) like full name, passport number or SSN

* Date and time when parameter information was last updated
* Type of data sent in this parameter

## Tracking changes in API structure

The company may have many small teams, disparate programming languages, and variety of language frameworks. Because of this, the specification is always out of date, which means security officers do not know all their security landscape. This causes some risks, for example:

* The development team can start using a third-party library that has its own endpoints and the team doesn’t know about them. This way the company gets endpoints that are not monitored and not checked for vulnerabilities. They can be potential attack vectors.
* The PII data begin to be transferred to the endpoint. An unplanned transfer of PII can lead to a violation of compliance with the requirements of regulators, as well as lead to reputational risks.
* Other parameters that should not be transferred, for example `is_admin` (someone accesses the endpoint and tries to do it with administrator rights) begin to be transferred to the endpoint.
* Important endpoint is no longer called.

With the **API Discovery** module of Wallarm you can:

* Track changes and check that they do not disrupt current business processes
* Make sure that no unknown endpoints have appeared in the infrastructure that could be a potential threat vectors

You can check what changes occurred in API structure within the specified period of time. To do that, from the **Changes since** filter, select the appropriate period or date. The following markers will be displayed in the endpoint list:

* **New** for the endpoints added to the list within the period.
* **Changed** for the endpoints that have new or removed parameters. In the details of the endpoint such parameters will have a corresponding mark.
* **Removed** for the endpoints that did not receive any traffic within the period. For each endpoint this period will be different - calculated based on the statistics of accessing each of the endpoint. If later the "removed" endpoint is discovered as having some traffic again it will be marked as "new".

Using the **Changes since** filter only highlights the changed endpoints among the others. If you want to see only changes, additionally use the **Changes in API structure** filter where you can select one or several types of changes:

* New endpoints
* Changed endpoints
* Removed endpoints

Selecting values from this filter will show only the endpoints correspondingly changed within the specified period.

## API structure and related events

To see attacks and incidents for the last 7 days related to some endpoint, in the endpoint menu select **Search for attacks on the endpoint**:

![!API endpoint - open events](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

The **Events** section will be displayed with the [filter applied](../user-guides/search-and-filters/use-search.md):

```
attacks incidents last 7 days d:<YOUR_DOMAIN> u:<YOUR_ENDPOINT>
```

You can also copy some endpoint URL to the clipboard and use it to search for the events. To do this, in this endpoint menu select **Copy URL**.

## API structure and rules

You can quickly create a new [custom rule](../user-guides/rules/intro.md) from any endpoint of API structure: 

1. In this endpoint menu select **Create rule**. The create rule window is displayed. The endpoint address is parsed into the window automatically.
1. In the create rule window, specify rule information and then click **Create**.

![!Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Download OpenAPI specification (OAS) for your API structure

Click **Download OAS** to get a `swagger.json` file with the description of the API structure discovered by Wallarm. The description will be in the [OpenAPI v3 format](https://spec.openapis.org/oas/v3.0.0).

!!! warning "Filtered download"
    When downloading the description of the API structure, applied filters are taken into account. Only filtered data is downloaded.
    
!!! info "Domain information in downloaded Swagger file"
    If a discovered API structure contains several domains, endpoints from all domains will be included in the downloaded Swagger file. Currently, the domain information is not included in the file.

Using the downloaded data, you can discover:

* The list of endpoints discovered by Wallarm, but absent in your specification (missing endpoints, also known as "Shadow API").
* The list of endpoints presented in your specification but not discovered by Wallarm (endpoints that are not in use, also known as "Zombie API").
