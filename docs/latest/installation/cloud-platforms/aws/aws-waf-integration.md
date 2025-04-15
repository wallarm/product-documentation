# Integrating AWS WAF and Wallarm in AWS Environments

In modern cloud architectures, a **layered security approach** is essential to protect both the perimeter and the application core. In AWS environments, AWS WAF defends entry points such as load balancers and API gateways, while Wallarm protects APIs and microservices deeper in the stack.

Combined in a **defense‑in‑depth strategy**, they provide comprehensive protection for web applications and APIs - from the edge to the application layer.

## AWS WAF: perimeter protection for AWS infrastructure

[AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) serves as the **first line of defense at the network edge**, filtering HTTP(S) traffic before it reaches applications in real time. It blocks common threats like SQL injection and XSS using Web ACLs and can inspect various parts of a request - headers, URI, body, and more.

As a fully managed service, AWS WAF scales automatically and integrates with AWS Shield for DDoS protection and Firewall Manager for centralized rule enforcement across accounts. 

AWS WAF establishes a perimeter defense that blocks known threats and malicious patterns at scale, shielding the overall cloud infrastructure. However, identifying more complex, application‑layer or API‑specific attacks often requires deeper inspection - something Wallarm is designed to handle.

## Wallarm: API‑centric application security for microservices

Wallarm is an **Advanced API Security** platform designed to secure modern applications, especially APIs and microservice‑based architectures. Whereas AWS WAF focuses on the perimeter, **Wallarm operates closer to the application**, analyzing traffic with context about your APIs, microservices, and application logic.

Wallarm uses **deep request inspection, adaptive filtering, and AI‑driven threat detection** to catch complex attacks that traditional pattern‑based WAFs might miss. 

Wallarm excels at detecting **API‑specific threats** (for instance, abuse of a logical flaw or a parameter tampering attack in a JSON API request) and **anomaly detection** (catching unusual usage patterns that deviate from normal API behavior).

## Deployment topology

### Deployment in a cloud‑native stack

Wallarm is designed for seamless deployment in cloud and containerized environments. It can run as a containerized service, an inline proxy, or as a module integrated with proxies like NGINX or Kong.

In AWS, Wallarm supports deployment on EKS, ECS (including Fargate), or EC2 via AMI, offering flexibility for various architectures. It supports modern API protocols - REST, GraphQL, gRPC, WebSocket - and protects traffic across these layers.

Wallarm nodes scale automatically using AWS Auto Scaling or Kubernetes auto-scalers, ensuring that as your services grow, the security layer scales with them.

[All Wallarm deployment options for AWS](../../../installation/supported-deployment-options.md#public-clouds)

### API and microservice protection capabilities

Wallarm stands out for its deep understanding of API traffic. It can parse complex JSON/XML payloads, handle nested parameters, and enforce API schemas to prevent misuse. Unlike traditional WAFs, which often miss logic-based API attacks (e.g., BOLA, mass assignment), Wallarm detects business logic abuse, poisoned queries, and multi-step attack chains.

It also supports threat replay testing - safely testing potential vulnerabilities to reduce false positives.

With detailed insights into API usage, attack patterns, and shadow APIs, Wallarm adds visibility and protection at the application layer, complementing AWS WAF's edge-level filtering. Together, they form a layered defense that blocks both known and emerging threats.

[More about Wallarm capabilities](../../../about-wallarm/overview.md)

### Complementary layered security approach

Combining AWS WAF and Wallarm enables a true defense‑in‑depth model, where each layer targets different threats:

* AWS WAF filters broad, perimeter-level attacks - like known injection patterns, bots, and scanners, reducing noise and traffic load before it reaches the application.
* Wallarm then inspects the remaining traffic with API awareness and adaptive detection, catching more subtle threats like business logic abuse or zero‑day API attacks that perimeter filters might miss.

This layered setup allows each tool to do what it does best: AWS WAF enforces general security rules (IP blocks, geo restrictions, rate limits), while Wallarm protects application internals with deep traffic analysis and behavioral context. The result is improved detection, fewer false positives, and less manual rule tuning.

By letting AWS WAF handle basic filtering and Wallarm focus on complex, application‑specific threats, teams benefit from a more scalable, accurate, and resilient security architecture. This approach aligns with cloud‑native best practices and helps safeguard both the entry points and the inner workings of modern applications.

### High‑level integration architecture

The combined AWS WAF + Wallarm architecture can be visualized as the following layered architecture:

1. Perimeter Layer - AWS WAF at AWS Entry Points

    Internet traffic first reaches services like CloudFront, API Gateway, or ALB, where AWS WAF applies Web ACL rules to block known threats—such as SQLi, XSS, and bots - before requests reach the application. It may also enforce IP, geo, or rate-based policies to further reduce noise.
1. Application Layer - Wallarm Filtering Nodes

    Clean traffic then flows to Wallarm nodes running in ECS, EKS, or EC2. Acting as a smart proxy or ingress controller, Wallarm performs deep API inspection, detecting logic flaws, multi-step attacks, and anomalous patterns. Only validated traffic is forwarded to application services.
1. Internal Layer - Microservices and Data Stores

    Vetted requests reach the core components - APIs, microservices, databases - already filtered by both layers. Wallarm can also inspect outbound responses, e.g., to prevent data leakage. Additional service-to-service protections like mTLS or IAM can further harden this layer. 

A common model is ALB + AWS WAF → Wallarm → Application. Wallarm supports flexible deployments - inline behind ALB, as an ingress in EKS, or behind API Gateway or CloudFront origins - without requiring major changes to infrastructure. Its compatibility with standard AWS networking lets it protect both public and internal traffic paths.
