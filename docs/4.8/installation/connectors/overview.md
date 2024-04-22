# Deploying Wallarm with Connectors

API deployment can be done in various ways, including utilizing external tools such as Azion Edge, Akamai Edge, Mulesoft, Apigee, and AWS Lambda. If you are looking for a way to secure these APIs with Wallarm, we offer a solution in the form of "connectors" specifically designed for such cases.

## How it works

The solution involves deploying the Wallarm node externally and injecting custom code or policies into the specific platform. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. Referred to as Wallarm's connectors, they serve as the essential link between platforms and the external Wallarm node.

The following scheme demonstrates high-level traffic flow in the Wallarm blocking [mode](../../admin-en/configure-wallarm-mode.md):

![image](../../images/waf-installation/general-traffic-flow-for-connectors.png)

Traffic is analyzed in-line, the injected Wallarm script captures requests and forwards them to the node for analysis. Depending on the response from the node, malicious activities are blocked, and only legitimate requests are allowed to access the APIs.

Alternatively, the monitoring mode allows users to gain knowledge about potential threats web applications and APIs may encounter. In this mode, the logic of traffic flow remains the same, but the node does not block attacks, it only registers and records them in the Wallarm Cloud, accessible through the Wallarm Console.

## Use cases

* Securing all APIs deployed with Azion Edge, Akamai Edge, Mulesoft, Apigee, AWS Lambda or similar tool by creating only one component in the current infrastrucure - the component like the Wallarm code/policy/proxy depending on the solution being used.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) method does not function properly. The solution determines if an API is vulnerable or not based on server responses to malicious requests that are typical for the vulnerabilities it tests.
* The [Wallarm API Discovery](../../api-discovery/overview.md) cannot explore API inventory based on your traffic, as the solution relies on response analysis.
* The [protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response code analysis.

## Supported deployment options

Currently, Wallarm offers connectors for the following platforms:

* [Mulesoft](mulesoft.md)
* [Apigee](apigee.md)
* [Akamai EdgeWorkers](akamai-edgeworkers.md)
* [Azion Edge](azion-edge.md)
* [AWS Lamdba](aws-lambda.md)
* [Cloudflare](cloudflare.md)

If you couldn't find the connector you are looking for, please feel free to contact our [Sales team](mailto:sales@wallarm.com) to discuss your requirements and explore potential solutions.
