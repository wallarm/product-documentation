# DDoS protection

A DDoS (Distributed Denial of Service) attack is a type of cyber attack in which an attacker seeks to make a website or online service unavailable by overwhelming it with traffic from multiple sources. This document described recommendations for DDoS protection and methods to protect your resources with Wallarm.

DDoS attacks are often launched from a network of compromised computer systems, often referred to as a botnet. Attackers use these systems to send a large volume of traffic to the target, overloading the server and preventing it from being able to respond to legitimate requests. DDoS attacks can be targeted at any type of online service, including websites, online games, and even social media platforms.

There are many techniques that attackers can use to launch a DDoS attack, and the methods and tools they use can significantly vary. Some attacks are relatively simple and use low-level techniques such as sending large numbers of connection requests to a server, while others are more sophisticated and use complex tactics such as spoofing IP addresses or exploiting vulnerabilities in network infrastructure.

## DDoS attack taxonomy

There are several types of DDoS attacks that attackers can use to disrupt the availability of a website or online service. Here are the common types of DDoS attacks:

| OSI layer / Attack Type | [Volumetric and amplification attacks](#volum-amplif-attacks) | [Protocol exploits and Logic bombs](#proto-attacks-logicbombs) |
| ---- | ----------- | -------- |
| L3/L4 | <ul><li>UDP flood: These attacks send large numbers of UDP packets to a target in an attempt to consume available bandwidth and disrupt service.</li><li>ICMP flood (Smurf attacks): These attacks use ICMP to send large numbers of echo request packets (commonly known as "ping" requests) to a target in an attempt to consume bandwidth and disrupt service.</li></ul> | <ul><li>SYN flood: These attacks exploit the way that TCP connections are established. The attacker sends a large number of SYN packets to a target, but never completes the three-way handshake process that is used to establish a connection. This can tie up the resources of the target server, as it waits for the completion of the handshake process.</li><li>Ping of Death: These attacks send oversized packets to a target in an attempt to crash it. The packets are larger than the maximum size that the target can process, and the attempt to handle them can cause the target to crash or become unavailable.</li></ul> |
| L7 | <ul><li>HTTP flood: These attacks use a large number of seemingly legitimate GET or POST requests to a server or web application to overwhelm a target. This type of attack is often carried out using botnets, which are networks of compromised computers infected with malware and controlled by the attacker.</li><li>Amplification attacks: These attacks leverage the use of amplification techniques to amplify the volume of traffic sent to a target. For example, an attacker might send a small request to a server that responds with a much larger response, effectively amplifying the volume of traffic that is sent to the target. There are several different techniques that attackers can use to launch an amplification attack, including: NTP amplification, DNS amplification, etc.</li></ul> | <ul><li>Slowloris: Slowloris attacks are unique in that they require minimal bandwidth and can be carried out using just one computer. The attack works by initiating multiple concurrent connections to a web server and maintaining them for an extended period of time. The attacker sends partial requests and occasionally complements them with HTTP headers to prevent them from reaching a completion stage.</li></ul>
| API/App specific (L7+) | <ul><li>Heavy Request: These attacks use specially crafted requests that lead the server to send a large amount of data in response. This type of attack is commonly used in targeted attacks because it requires a preliminary study of your application and API and is based on exploiting its vulnerabilities.</li></ul> | <ul><li>Logic Bomb: These attacks use specially crafted requests that contain a large amount of data and are designed to exploit vulnerabilities during the request processing that lead to large resource consumption on the target systems. There are different types of logic bombs: XML Bomb, JSON Bomb, etc.</li></ul> |

<a name="volum-amplif-attacks"></a>**Volumetric and amplification attacks** seek to overwhelm a target with a large volume of traffic. The goal is to saturate the bandwidth or computing resources of the targeted server or network, making it unable to respond to legitimate requests.

<a name="proto-attacks-logicbombs"></a>**Protocol exploits and Logic bombs** are DDoS attacks aimed to exploit vulnerabilities in the way that a service or network communicates. These attacks can disrupt the normal flow of traffic by exploiting certain protocols or by sending malformed packets that are difficult for the target to process.

## Mitigation of DDoS attacks

Since DDoS attacks can take many different forms and target different OSI layers, single measures are not effective, it is important to use a combination of measures to provide comprehensive protection against DDoS attacks.

* Internet Service Providers and Cloud Service Providers usually provide the first line of L3-L4 DDoS attack defense. As for high-severity L3-L4 DDoS attacks, additional mitigation tools are required, e.g.:

    The DDoS attack that generates traffic at a rate of 1 Gbps or more may require specialized DDoS protection services for traffic scrubbing. Traffic scrubbing is a technique for routing traffic through a third-party service that filters out all malicious traffic and transfers to your service only legitimate requests. As an additional protection measure against L3-L4 DDoS attacks you can also use the solutions like NGFW.
* L7 DDoS attacks, also known as "application layer" attacks, are more targeted and sophisticated than L3-L4 attacks. Typically, L7 DDoS attacks are aimed at peculiarities of attacked applications and they can be difficult to distinguish from legitimate traffic. For protection against L7 DDoS attacks, use WAAP or specialized Anti-DDoS solutions that analyze traffic on application layer. It is also recommended to configure the API Gateway or WEB server to be able to handle peak loads.

When choosing protection measures, carefully evaluate the needs and resources of an organization based on the following factors:

* Type of attacks
* Volume of attacks
* Complexity of a web application or API, and costs

It is also necessary to prepare a response plan in order to identify the DDoS attack as soon as possible and take timely countermeasures to mitigate them.

## L7 DDoS protection with Wallarm

Wallarm provides a wide range of protection measures across L7 DDoS threats:

* [API Abuse Prevention](../../api-abuse-prevention/overview.md). Enable the API Abuse Prevention functionality to identify and stop various types of malicious bots.
* [Brute force trigger](protecting-against-bruteforce.md) to prevent massive number of requests brute-forcing some parameter values, e.g. passwords.
* [Forced browsing trigger](protecting-against-bruteforce.md) to prevent malicious attempts to detect a web application's hidden resources, namely directories and files.
* Geolocation filtering using [denylists and graylists](../../user-guides/ip-lists/overview.md). Prevent access to applications and APIs for certain regions distributing attacks.
* Block untrusted origins using [denylists and graylists](../../user-guides/ip-lists/overview.md). To protect from targeted attacks, it may be helpful to block any untrustworthy origins (Tor, Proxy, VPN) which allow an attacker to hide location and bypass geofilters.
* [Logic (Data) bomb](#proto-attacks-logicbombs) detection. Wallarm automatically detects and blocks malicious requests containing Zip or XML bomb.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) configuration. Specify the maximum number of connections that can be made to a particular API scope. If a request exceeds the defined limit, Wallarm rejects it.

If you are using NGINX-based Wallarm node, it is recommended to configure NGINX to enhance your security across L7 DDoS as follows:

* Caching. Configure cache responses to common requests to absorb some of the traffic generated under DDoS attacks and prevent it from reaching your web application or API.
* Rate limiting. Create rate limiting rules for incoming requests to restrict the volume of traffic that can be sent to a target web application or API.
* Limiting the number of connections. You can prevent resource overuse by setting a limit on the number of connections that can be opened by a single client IP address to a value appropriate for real users.
* Closing slow connections. If a connection does not write data frequently enough, it can be closed to prevent it from remaining open for an extended period of time and potentially hindering the server's ability to accept new connections.

[See examples of NGINX configuration and other recommendations](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/)

If you are using [Kong-based Ingress controller with Wallarm services](../../installation/kubernetes/kong-ingress-controller/deployment.md), it is recommended to follow the [best practices to secure API Gateway](https://konghq.com/learning-center/api-gateway/secure-api-gateway).
