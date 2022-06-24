# Using built API structure

This section describes how to use the API structure built by the [API Discovery](../about-wallarm-waf/api-discovery.md) module.

The built API structure is presented in the **API Discovery** section. The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** or **Analyst** for the regular accounts.
* **Global Administrator** or **Global Analyst** for the accounts with the multitenancy feature.

To provide users with familiar format of API representation, Wallarm visualizes the discovered API structure in a **Swagger-like manner**.

The API structure includes the following elements (grouped by application and domain):

* The set of API endpoints discovered by API Discovery
* Methods of requests processed at API endpoints

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## Filtering endpoints

You can filter the discovered API structure:

* Type in the search string for endpoint search.
* Use **Application**, **Domain** and **Method** filters.
* Use the **PII** filter to filter endpoints by the sensitive data types being passed in the parameters.
* In the **Domains** panel, click application or domain.

## Viewing endpoint parameters

<a name="params"></a>By clicking the endpoint, you can also find the set of required and optional parameters with the relevant data types:

![!Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

Click the name of the column to sort. Click again to change the sorting order.

## API structure and related events

To see attacks and incidents for the last 7 days related to some endpoint, click the icon:

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
