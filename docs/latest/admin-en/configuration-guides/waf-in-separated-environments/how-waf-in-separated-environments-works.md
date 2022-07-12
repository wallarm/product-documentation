# How Filtering Node Works in Separated Environments

The application may be deployed to a few different environments: production, staging, testing, development, etc. These instructions provide information about suggested ways to manage a filter node for different environments.

## What is an Environment
The definition of an environment may differ from company to company, and for the purpose of this instruction, the definition below is used.

An **environment** is an isolated set or subset of computing resources serving different purposes (like production, staging, testing, development, etc) and managed using the same or different set of policies (in terms of network/software configurations, software versions, monitoring, change management, etc) by the same or different teams (SRE, QA, Development, etc) of a company.

From the best practices perspective, it is recommended to keep the Wallarm nodes configuration synchronized across all environments used in a single product vertical (development, testing, staging and production stages).

## Relevant Wallarm Features

There are three main features that allow you to manage different filter node configurations for different environments and perform a gradual rollout of filter node changes:

* [Resource identification](#resource-identification)
* [Separate Wallarm accounts and sub-accounts](#separate-wallarm-accounts-and-sub-accounts)
* [Filter node operation mode](../../configure-wallarm-mode.md)

### Resource Identification

There are two ways to configure the filter node for a particular environment using identification:

* Wallarm unique IDs for each environment,
* different URL domain names of environments (if it's already configured in your architecture).

#### Environment Identification by ID

The Applications concept allows you to assign different IDs to different protected environments, and manage filter node rules separately for each environment.

When configuring a filter node you can add Wallarm IDs for your environments using the Applications concept. To set up IDs:

1. Add environment names and its IDs in your Wallarm account → **Settings** → **Applications** section.

    ![!Added environments](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/added-applications.png)
2. Specify ID configuration in a filter node:

    * using the [`wallarm_application`](../../configure-parameters-en.md#wallarm_application) directive for Linux‑based, Kubernetes sidecar and Docker‑based deployments;
    * using the [`nginx.ingress.kubernetes.io/wallarm-application`](../../configure-kubernetes-en.md#ingress-annotations) annotation for Kubernetes NGINX Ingress controller deployments. Now, when creating a new filter node rule it is possible to specify that the rule will be assigned to a set of specific application IDs. Without the attribute, a new rule will be automatically applied to all protected resources in a Wallarm account.

![!Creating rule for ID](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-id.png)

#### Environment Identification by Domain

If every environment is using different URL domain names passed in the `HOST` HTTP request header then it is possible to use the domain names as unique identifiers of each environment.

To use the feature, please add proper `HOST` header pointer for each configured filter node rule. In the following example the rule will be triggered only for requests with the `HOST` header equal to `dev.domain.com`:

![!Creating rule for HOST](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-host.png)

### Separate Wallarm Accounts and Sub-accounts

One easy option to isolate the filter node configuration of different environments is to use separate Wallarm accounts for each environment or group of environments. This best practice is recommended by many cloud service vendors, including Amazon AWS.

To simplify the management of several Wallarm accounts, it is possible to create a logical `master` Wallarm account and assign other used Wallarm accounts as sub-accounts to the `master` account. This way a single set of console UI and API credentials can be used to manage all Wallarm accounts belonging to your organization.

To activate a `master` account and sub-accounts, please contact [Wallarm's Technical Support](mailto:support@wallarm.com) team. The feature requires a separate Wallarm enterprise license.

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/Ol4CqJX2QSQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

!!! warning "Known limitations"
    * All filtering nodes connected to the same Wallarm account will receive the same set of traffic filtration rules. You still can apply different rules for different applications by using proper [application IDs or unique HTTP request headers](#resource-identification).
    * If the filtering node decides to automatically block an IP address (for example, because of three or more detected attack vectors from the IP address) the system will block the IP for all applications in a Wallarm account.