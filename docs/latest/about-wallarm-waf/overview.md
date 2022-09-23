# How Wallarm API Security works

Wallarm API Security is uniquely suited to protect your cloud applications and APIs. Its hybrid architecture safeguards your resources by offering:

* Protection from hacker attacks.
* Automatic detection of [vulnerabilities](../glossary-en.md#vulnerability).

Wallarm analyzes all incoming HTTP requests and instantly blocks the malicious ones.

Wallarm continuously collects metrics from the entire network traffic and processes the metrics by applying machine learning in the Wallarm Cloud.

The Wallarm Scanner checks your company's exposed assets in several modes to detect vulnerabilities.

Wallarm consists of the following components:

* The Wallarm filtering node
* The Wallarm Cloud

## Filtering node

The network traffic check is done through the Wallarm filtering node installed in the company's network infrastructure.

The Wallarm filtering node does the following:

* Blocks malicious requests and filters the valid ones
* Analyzes the company's entire network traffic
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud
* Downloads custom resource-specific rules from the Wallarm Cloud

## Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads
* Compiles custom resource-specific rules
* Scans the company's exposed assets to detect vulnerabilities

Wallarm manages [European](#eu-cloud) and [American](#us-cloud) cloud instances with each Cloud being completely separate in terms of databases, API endpoints, client accounts, etc. A client registered in one Wallarm Cloud cannot use other Wallarm Cloud to manage or get access to their data stored in the first Cloud.

At the same time you may use both Wallarm Clouds. In this case you will need to use different accounts in Wallarm Console and API endpoints to access and manage your information in individual Clouds.

Endpoints for the Wallarm Clouds are provided below.

### EU Cloud

Physically located in the Netherlands.

* https://my.wallarm.com/ to create Wallarm account
* `https://api.wallarm.com/` to call API methods

### US Cloud

Physically located in the USA.

* https://us1.my.wallarm.com/ to create Wallarm account
* `https://us1.api.wallarm.com/` to call API methods
