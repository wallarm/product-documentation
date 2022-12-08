# How the Wallarm platform works

The Wallarm platform is uniquely suited to protect all your APIs and web applications in multi‑cloud and cloud‑native environments. Its hybrid architecture safeguards your resources by offering:

* [Protection against hacker attacks](protecting-against-attacks.md) with ultra-low false positives
* [Protection against bots performing API abuse](api-abuse-prevention.md)
* [API Discovery](api-discovery.md)
* [Automatic detection of vulnerabilities](detecting-vulnerabilities.md)

Wallarm provides the user interface to easily manage most platform settings, e.g.:

* View attacks and vulnerabilities
* Block requests by sources (IPs, countries, data centers, etc.)
* Configure notifications about detected threats, etc

![!Wallarm Console UI](../images/admin-guides/test-attacks-quickstart.png)

## Use cases of the Wallarm platform

Wallarm is the only solution that combines the following capabilities:

* Cloud Native WAAP (Web Application & API Protection)
* Advanced API Security

When [subscribing](subscription-plans.md#subscription-plans) to Wallarm, you choose the capability that meets your business needs the most.

### Cloud Native WAAP

Wallarm Cloud Native WAAP is a Next-Gen WAF providing web applications and APIs with protection against common threats like:

* [OWASP Top 10](https://owasp.org/www-project-top-ten/)
* Input validation attacks (e.g. SQL injection, cross‑site scripting, remote code execution)
* Behavioral attacks

WAAP protects only resources designed on the basis of the classic technologies like REST and GraphQL.

It does not discover and check for vulnerabilities your resources before suspecting a [security incident](../glossary-en.md#security-incident). The main WAAP purpose is mitigation of common threats detected in incoming traffic.

### Advanced API Security

Wallarm Advanced API Security provides comprehensive API discovery and threat prevention across your entire portfolio, regardless of protocol.

It involves all the features of Wallarm WAAP and, in addition, the following:

* [Protection against bots performing API abuse](api-abuse-prevention.md) like credential stuffing, fake account creation, etc.
* [API Discovery](api-discovery.md) that allows you to observe your infrastructure, indicate Shadow and Zombie APIs, etc.
* [Automatic detection of vulnerabilities](detecting-vulnerabilities.md). Knowing security gaps, you can fix them in time and, as a result, prevent security incidents.

This is the recommended capability for systems that need to be observed and protected all around.

## Components of the Wallarm platform

Wallarm consists of the following core components:

* The Wallarm filtering node
* The Wallarm Cloud

### Filtering node

The Wallarm filtering node does the following:

* Analyzes the company's entire network traffic and mitigates malicious requests
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis

The Wallarm filtering node is installed in your network infrastructure by one of the [supported deployment options](../admin-en/supported-platforms.md). Regardless of the [Wallarm capability](#use-cases-of-the-wallarm-platform) you are using, any deployment option is available.

### Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads
* Compiles custom resource-specific security rules
* Scans the company's exposed assets to detect vulnerabilities
* Builds API structure based on the traffic metrics received from the filtering node

Wallarm manages [American](#us-cloud) and [European](#eu-cloud) cloud instances with each Cloud being completely separate in terms of databases, API endpoints, client accounts, etc. A client registered in one Wallarm Cloud cannot use other Wallarm Cloud to manage or get access to their data stored in the first Cloud.

At the same time, you may use both Wallarm Clouds. In this case you will need to use different accounts in Wallarm Console and API endpoints to access and manage your information in individual Clouds.

Endpoints for the Wallarm Clouds are provided below.

#### US Cloud

Physically located in the USA.

* https://us1.my.wallarm.com/ to create Wallarm account
* `https://us1.api.wallarm.com/` to call API methods

#### EU Cloud

Physically located in the Netherlands.

* https://my.wallarm.com/ to create Wallarm account
* `https://api.wallarm.com/` to call API methods
