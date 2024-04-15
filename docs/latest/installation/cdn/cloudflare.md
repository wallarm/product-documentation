[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Cloudflare

[Cloudflare](https://www.cloudflare.com/) is a security and performance service which offers features designed to enhance the security, speed, and reliability of websites and internet applications, including CDN, WAF, DNS services and SSL/TLS encryption. This article provides instructions on configuring Wallarm and Cloudflare to route your entire domain or selected application's Cloudflare traffic to the Wallarm node for analysis and filtering.

The solution involves deploying and configuring the Wallarm node externally and injecting custom code into Cloudflare's worker object. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. In the scenario, the Cloudflare itself serves as connector between your applications and Wallarm providing secure traffic analysis, risk mitigation, and overall security.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is recommended in case when you provide access to your applications via Cloudflare.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) method does not function properly. The solution determines if an API is vulnerable or not based on server responses to malicious requests that are typical for the vulnerabilities it tests.
* The [Wallarm API Discovery](../../api-discovery/overview.md) cannot explore API inventory based on your traffic, as the solution relies on response analysis.
* The [protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response code analysis.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Cloudflare technologies.
* APIs or traffic running through Cloudflare.

## Deployment

To secure with Wallarm applications on AWS that use Node.js lambdas, follow these steps:

1. Deploy a Wallarm node on the AWS instance.
1. Obtain the Wallarm Node.js script for AWS Lambda and run it.

### 1. Request Wallarm support to activate Cloudflare integration

Contact [support@wallarm.com](mailto:support@wallarm.com) to request the activation of Cloudflare integration and obtain the `<CONNECTOR_ID>`.

Consider that when integrating Wallarm with Cloudflare, the traffic flow can operate both [in-line](../inline/overview.md) and [out-of-band (OOB)](../oob/overview.md). Therefore, discuss with the support which option is most suitable in your case.

### 2. Set Cloudflare worker and routes

In Cloudflare, do the following:

1. Select domain to be routed to Wallarm.
1. For this domain, create worker with the following code:

    ```
    // Configuration
    const wallarm_node = "https://<CONNECTOR_ID>.connect.aws.wallarm-cloud.com"; // Replace with your Wallarm node URL
    const wallarm_mode = "async"; //"async" or "inline" - choose based on your needs

    addEventListener("fetch", event => {
    event.passThroughOnException();
    event.respondWith(handleRequest(event));
    });

    async function handleRequest(event) {

    if (event.request._handled) return;
    event.request._handled = true;
    
    let request = event.request;
    request._handled = true;

    // Clone the request to be able to read its body
    let requestBody = await request.clone().text();

    const url = new URL(request.url);

    // Check if the request URL ends with a static extension
    if (isStatic(url)) {
        // If it is a static request, proceed with the original request without sending it to the backend
        return await fetch(request);
    }

    if (wallarm_mode === "async") {
        // In async mode, send the request to the backend asynchronously and proceed with the original request
        sendToBackend(request, requestBody, true);
    } else if (wallarm_mode === "inline") {
        // In inline mode, wait for the backend response to decide on blocking the request
        let node_response = await sendToBackend(request, requestBody, false);
    
        // If the backend server responds with 403, block the request
        if(node_response.status === 403) {
        return new Response("Request blocked.", { status: 403 });
        }
    }
    // Proceed with the original request if not blocked
    return await fetch(request);
    
    }

    async function sendToBackend(request, body, sendasync) {

    const url = new URL(request.url);

    let headers = {}
    request.headers.forEach((value, key) => {
        headers[key] = value
    })

    headers["X-FORWARDED-HOST"] = url.host;

    // Create the options object for the fetch call, excluding the body initially
    const fetchOptions = {
        method: request.method,
        headers: headers
    };
    
    // Only add the body to the fetch options for methods other than GET and HEAD
    if (request.method !== "GET" && request.method !== "HEAD") {
        fetchOptions.body = body;
    }

    if(sendasync){
        // Perform the fetch without waiting for the response
        fetch(wallarm_node + url.pathname + url.search, fetchOptions).then(response => {
        // Optionally handle the async response
        console.log("Async request sent to backend");
        }).catch(error => {
        console.error("Error sending async request to backend:", error);
        });
    }else{
        return await fetch(wallarm_node + url.pathname + url.search, fetchOptions);
    }
    }

    const staticExtensions = [".css", ".js",
    ".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico",
    ".woff", ".woff2", ".eot", ".ttf", ".otf", ".webp", ".avif", ".mp4", ".webm"];
    function isStatic(url) {
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
    }
    ```

1. To set paths of your domain that you want to route to Wallarm, create the route object and link it to your worker. Within the route object, list one or several paths, for example, add `*.example.com/*` to route all domain's paths.

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request will also be blocked.

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm in conjunction with AWS Lambda, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
