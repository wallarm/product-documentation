# Setting rate limit

Lack of rate limiting is included in the [OWASP API Top 10 2019](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md) list of most serious API security risks. Without proper rate limiting measures, APIs are vulnerable to attacks such as denial-of-service (DoS), brute force and API overuse. This article explains how to safeguard your API and users with the Wallarm's rate limit regulation rule.

Wallarm provides the **Set rate limit** rule to help prevent excessive traffic to your API. This rule enables you to specify the maximum number of connections that can be made to a particular scope, while also ensuring that incoming requests are evenly distributed. If a request exceeds the defined limit, Wallarm rejects it and returns the code you selected in the rule.

## Creating and applying the rule

To set and apply rate limit:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](add-rule.md#branch-description) the scope to apply the rule to.
1. In **Then**, choose **Set rate limit** and set a desired limit for connections to your scope:

    * Maximum number for the requests per second or minute.
    * **Burst** - maximum number of excessive requests to be buffered once the specified RPS/RPM is exceeded and to be processed once the rate is back to normal. `0` by default.

        If the value is different from `0`, you can control whether to keep the defined RPS/RPM between buffered excessive requests execution. **No delay** points to simultaneous processing of all buffered excessive requests, without the rate limit delay. **Delay** implies simultaneous processing of the specified number of excessive requests, others are processed with delay set in RPS/RPM.
    
    * **Response code** - code to return in response to rejected requests. `503` by default.
1. In **In this part of request**, specify request points (aka keys) that you want to measure limits for.

    --8<-- "../include/waf/features/rules/request-part-reference.md"
1. Wait for the [rule compilation to complete](compiling.md).

## Rule examples

### Limiting IP connections to prevent DoS attacks on API endpoint

Suppose you have a section in the UI that returns a list of users, with a limit of 200 users per page. To fetch the page, the UI sends a request to the server using the following URL: `https://example-domain.com/api/users?page=1&size=200`.

However, an attacker could exploit this by changing the `size` parameter to an excessively large number (e.g. 200,000), which could overload the database and cause performance issues. This is known as a DoS (Denial of Service) attack, where the API becomes unresponsive and unable to handle further requests from any clients.

Limiting connections to the endpoint helps to prevent such attacks. You can limit the number of connections to the endpoint to 1000 per minute. This assumes that, on average, 200 users are requested 5 times per minute. The rule specifies that this limit applies to each IP trying to access the endpoint within minute. The `remote_address` [point](request-processing.md) is used to identify the IP address of the requester.

![!Example](../../images/user-guides/rules/rate-limit-for-200-users.png)

### Limiting connections by sessions to prevent brute force attacks on auth parameters

By applying rate limiting to user sessions, you can restrict brute force attempts to find real JWTs or other authentication parameters in order to gain unauthorized access to protected resources. For example, if rate limit is set to allow only 10 requests per minute under a session, an attacker attempting to discover a valid JWT by making multiple requests with different token values will quickly hit the rate limit, and their requests will be rejected until the rate limit period expires.

Suppose your application assigns each user session with a unique ID and reflects it in the `X-SESSION-ID` header. The API endpoint at the URL `https://example.com/api/login` accepts POST requests that include a Bearer JWT in the `Authorization` header. For this scenario, the rule limiting connections by sessions will appear as follows:

![!Example](../../images/user-guides/rules/rate-limit-for-jwt.png)

The [regexp](add-rule.md#condition-type-regex) used for the `Authorization` value is ``^Bearer\s+([a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+)$`.

If your authentication mechanism mandates users to pass the token in a different header, you can modify the rule as needed.

### User-Agent-based rate limiting to prevent attacks on API endpoints

Let's say you have an old version of your application has some known security vulnerabilities allowing letting attackers brute force API using the vulnerable application version. Usually, the `User-Agent` header is used to pass browser/application versions. To prevent the brute force attack via the old application version, you can implement `User-Agent`-based rate limiting.

For example, you can set a limit of 10 requests per minute for each `User-Agent`. If a specific `User-Agent` is making more than 10 requests evenly distributed per minute, further requests from that `User-Agent` are rejected till a new period start.

The following rate limiting rule limits requests to any path of the `https://example-domain.com` host (e.g. `/users`, `/items/books`, `/payments/{payment_id}/users`):

![!Example](../../images/user-guides/rules/rate-limit-by-user-agent.png)

### Endpoint-based rate limiting to prevent DoS attacks

Rate limiting can also involve setting a threshold for the number of requests that can be made to a particular endpoint within a specified time frame, such as 60 requests per minute. If a client exceeds this limit, further requests are rejected.

It helps to prevent DoS attacks and ensure that the application remains available to legitimate users. It can also help to reduce the load on the server, improve overall application performance, and prevent other forms of abuse or misuse of the application.

In this specific case, the rate limiting rule is applied to connections by URI, meaning that Wallarm automatically identifies repeated requests targeting a single endpoint. Here's an example of how this rule would work for all endpoints of the `https://example.com` host:

* Limit: 60 requests per minute (1 request per second)
* Burst: allow up to 20 requests per minute (which could be useful if there is a sudden spike in traffic)
* No delay: process 20 excessive requests simultaneously, without the rate limit delay between requests
* Response code: reject requests exceeding the limit and the burst with the 503 code
* Wallarm identifies repeated requests targeted at a single endpoint by the `uri` [point](request-processing.md)

![!Example](../../images/user-guides/rules/rate-limit-by-uri.png)

## Limitations and pecularities

The rate limit functionality has the following limitations and pecularities:

* Rate limiting rule is supported by all [Wallarm deployment forms](../../admin-en/supported-platforms.md) except for the Envoy-based Docker image.
* If your web server is configured to limit connections (e.g. by using the [`ngx_http_limit_req_module`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) NGINX module) and you also apply the Wallarm rule, the web server rejects requests by the configured rules but Wallarm does not.
* Wallarm does not save requests exceeding the rate limit, it only rejects them by returning the code chosen in the rule. The exception are requests with [attack signs](../../about-wallarm/protecting-against-attacks.md) - they are recorded by Wallarm even if they are rejected by the rate limiting rule.
