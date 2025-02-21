# Wallarm platform overview

Wallarm delivers real-time protection for APIs and AI agents, stopping automated threats and abuse while also providing full security visibility with complete API inventory and risk detection.

Wallarm consists of the following core components:

* The Wallarm filtering node
* The Wallarm Cloud

## Filtering node

The Wallarm filtering node does the following:

* Analyzes the company's entire network traffic and mitigates malicious requests
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis

You deploy the Wallarm filtering node to a network infrastructure by one of the [supported deployment options](../installation/supported-deployment-options.md).

## Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads
* Compiles custom resource-specific security rules
* Scans the company's exposed assets to detect vulnerabilities
* Builds API structure based on the traffic metrics received from the filtering node

Wallarm manages [American](#us-cloud) and [European](#eu-cloud) cloud instances with each Cloud being completely separate in terms of databases, API endpoints, client accounts, etc. A client registered in one Wallarm Cloud cannot use other Wallarm Cloud to manage or get access to their data stored in the first Cloud.

At the same time, you may use both Wallarm Clouds. In this case you will need to use different accounts in Wallarm Console and API endpoints to access and manage your information in individual Clouds.

Endpoints for the Wallarm Clouds are provided below.

### US Cloud

Physically located in the USA.

* https://us1.my.wallarm.com/ to create Wallarm account
* `https://us1.api.wallarm.com/` to call API methods

### EU Cloud

Physically located in the Netherlands.

* https://my.wallarm.com/ to create Wallarm account
* `https://api.wallarm.com/` to call API methods
