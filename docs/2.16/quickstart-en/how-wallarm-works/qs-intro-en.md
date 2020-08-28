# Introduction

Wallarm is a DevOps-friendly Web Application Firewall (WAF) uniquely suited to protect your cloud applications and APIs.

Wallarm's hybrid architecture safeguards your resources by offering:

* Protection from hacker attacks.
* Automatic detection of [vulnerabilities](../../glossary-en.md#vulnerability).

Wallarm analyzes all incoming HTTP requests and instantly blocks the malicious ones.

Wallarm continuously collects metrics from the entire network traffic and processes the metrics by applying machine learning in the Wallarm cloud.

Based on the processed requests, Wallarm creates an individual profile of the protected resources and applies the finely tuned security rules.

The Wallarm scanner checks your company's network resources in several modes to detect vulnerabilities.

Wallarm consists of the following components:

* The Wallarm filter node
* The Wallarm cloud

## Filter Node

The network traffic check is done through the Wallarm filter node installed in the company's network infrastructure.

The Wallarm filter node does the following:

* Blocks malicious requests and filters the valid ones
* Analyzes the company's entire network traffic
* Collects the network traffic metrics and uploads the metrics to the Wallarm cloud
* Downloads fine-tuned resource-specific rules from the Wallarm cloud

## Cloud

The Wallarm cloud does the following:

* Processes the metrics that the filter node uploads
* Creates fine-tuned resource-specific rules
* Scans the company's protected resources to detect vulnerabilities

Wallarm manages [European](#eu-cloud) and [American](#us-cloud) cloud instances with each cloud being completely separate in terms of databases, API endpoints, client accounts, etc. A client registered in one Wallarm cloud cannot use other Wallarm cloud to manage or get access to their data stored in the first cloud.

At the same time you may use both Wallarm clouds. In this case you will need to use different accounts in the Wallarm system and API endpoints to access and manage your information in individual clouds.

Endpoints for the clouds are provided below.

### EU Cloud

Physically located in France.

* https://my.wallarm.com/ to create Wallarm account
* `https://api.wallarm.com/` to call API methods

### US Cloud

Physically located in the USA.

* https://us1.my.wallarm.com/ to create Wallarm account
* `https://us1.api.wallarm.com/` to call API methods

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/Qh-Wof1C3Ak" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>