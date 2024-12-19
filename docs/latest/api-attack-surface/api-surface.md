# API Attack Surface Discovery <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

The **API Attack Surface Discovery** (**AASD**) component of the Wallarm's [API Attack Surface Management](overview.md) scans your selected domains to discover all their external hosts and their APIs, evaluate their protection against Web and API-based attacks, and identify missing WAF/WAAP solutions. It works simply by subscribing in Wallarm - you do not need to deploy anything. This article gives an overview of the component.

![API Attack Surface Discovery](../images/api-attack-surface/aasm-api-surface.png)

## Addressed issues

Knowing the full list of your organization's external APIs is the first step in mitigating potential security risks as unmonitored or undocumented APIs can become potential entry points for malicious attacks.

The **API Attack Surface Discovery** Wallarm component helps to solve these issues by providing the following:

* Automatic detection of external hosts for your [selected domains](setup.md).
* Automatic detection of found hosts' open ports.
* Automatic detection of found hosts' APIs.

    The following **API types** (protocols) can be detected: JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEB.

    HTML WEB — an HTML Web page designed for human access with browsers. It can be a static HTML Web page or a single HTML page of an application that, in turn, may access some API.

* Automatic [security posture](#security-posture) evaluation for found hosts.
* Overall WAAP score of the entire API surface.
* Asset summaries by security vendor, data center, and location.

    As one host may have more than one IP address, the assets statics by data centers and geo location is evaluated per IP address basis and not per-host basis. Due to the usage of CDNs the assets' location may be not representative.

* Automatic detection of security issues for found hosts.

You get all this simply by subscribing to the component in Wallarm - you do not need to deploy anything and get the analyzed data immediately.

## Data on found hosts

Once hosts are found for your domains, in Wallarm Console go to the **API Attack Surface** section. Click the host in the list to see: 

* Host's found open ports
* Host's found APIs
* Details on the host's [evaluated](#security-posture) WAAP score

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(60.65% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/dqmlj6dzflgq?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Security posture

Wallarm automatically assesses your external network perimeter’s security posture and reflects its state as **Total score** from 0 (worse) to 100 (best) protection.

![API surface - protection score](../images/api-attack-surface/aasm-api-surface-protection-score.png)

The total score is calculated using a complex proprietary formula that incorporates:

* **WAAP coverage score** reflects the coverage of external web and API services by WAF/WAAP solutions. The score is calculated as the share of HTTP/HTTPS ports protected with WAF/WAAP security.
* **Average WAAP score** represents the resistance of external hosts to web and API attacks. The score is calculated as an average score among all hosts where AASM identified active WAAP solutions in blocking mode and the WAAP score was evaluated without errors.

    WAAP score of specific endpoint is the result of its testing by Wallarm, it is calculated as:

    ```
    ((AppSec + FalsePositive) / 2 + APISec) / 2
    ```

    * `AppSec` - resistance to web attacks like SQL injection, XSS, and command injection.
    * `APISec` - resistance to API attacks, including those targeting GraphQL, SOAP, and gRPC protocols.
    * `FalsePositive` - the ability to accurately allow legitimate requests without mistakenly identifying them as threats.

    For each host, you can download a detailed WAAP score evaluation report in PDF format.

* **Additional metrics** such as TLS coverage, presence of security issues, and detected security issues.
