---
search:
  exclude: true
---

# Wallarm Documentation: Comprehensive Technical Guide

> Wallarm Documentation provides complete technical documentation for deploying, configuring, and managing the Wallarm API Security Platform. Documentation is available in 5 languages to support global enterprise deployments.

## Available Languages

- **English**: [https://docs.wallarm.com](https://docs.wallarm.com) (Primary language)
- **日本語 (Japanese)**: Available via language selector
- **Türkçe (Turkish)**: Available via language selector
- **Português (Portuguese/BR)**: Available via language selector
- **العربية (Arabic)**: Available via language selector

## Documentation Structure

### Quick Start & Getting Started
- [Getting Started with Wallarm Platform](https://docs.wallarm.com/quickstart/getting-started/): Evaluation options, signup process, and initial setup
- [Security Edge Free Tier](https://docs.wallarm.com/quickstart/security-edge-free-tier/): 500K free requests per month with most Advanced API Security capabilities
- [Wallarm Overview](https://docs.wallarm.com/about-wallarm/overview/): Platform architecture, components, and how Wallarm works
- [Subscription Plans](https://docs.wallarm.com/about-wallarm/subscription-plans/): Pricing tiers and feature availability
- [Best Practices](https://docs.wallarm.com/quickstart/best-practices/): Recommended configurations and deployment patterns
- [Video Guides](https://docs.wallarm.com/demo-videos/overview/): Visual tutorials for platform features

### Platform Architecture & Core Concepts

#### How Wallarm Works
- [Filtering Node](https://docs.wallarm.com/about-wallarm/overview/#filtering-node): In-line or out-of-band traffic analysis and attack mitigation
- [Wallarm Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud): Cloud-based analytics, API structure analysis, and management console
- [Deployment Forms](https://docs.wallarm.com/about-wallarm/overview/#where-wallarm-works): Security Edge, Hybrid, and On-Premises options

#### Core Modules
- [Cloud-Native WAAP](https://docs.wallarm.com/about-wallarm/waap-overview/): Web Application & API Protection with OWASP Top-10 coverage
- [API Protection](https://docs.wallarm.com/about-wallarm/api-protection-overview/): Advanced API security capabilities for modern threats
- [Glossary](https://docs.wallarm.com/glossary-en/): Core Wallarm entities and terminology

### Installation & Deployment

#### Deployment Options
- **Inline Deployment**: Real-time traffic inspection with blocking capabilities
- **Out-of-Band (OOB) Deployment**: [Mirror traffic analysis](https://docs.wallarm.com/installation/oob/overview/) without affecting primary data path
- **On-Premises Solution**: [Complete self-hosted deployment](https://docs.wallarm.com/installation/on-premise/overview/) for maximum control

#### Platform Integration
- NGINX / NGINX Plus
- Kubernetes Ingress Controller
- Kong API Gateway
- Envoy Proxy
- AWS, GCP, Azure cloud environments
- eBPF / Cloud Native deployments

### Threat Management

#### Attacks & Incidents
- [Attack Analysis](https://docs.wallarm.com/user-guides/attacks/): Understanding and investigating API attacks
- [Incident Analysis](https://docs.wallarm.com/user-guides/incidents/): Managing confirmed security incidents
- [Search and Filters](https://docs.wallarm.com/user-guides/search-and-filters/): Advanced filtering and search capabilities
- [Attack / Vulnerability Types](https://docs.wallarm.com/attacks-vulns-list/): Complete list of detectable threats including OWASP Top 10 and API Top 10

#### Security Issues
- [Detecting Issues](https://docs.wallarm.com/user-guides/security-issues/detecting/): Passive detection, TRT, SBT, and AASM methods
- [Managing Issues](https://docs.wallarm.com/user-guides/security-issues/managing/): Triage, prioritization, and remediation workflows

### API Discovery & Inventory
- [API Discovery Overview](https://docs.wallarm.com/api-discovery/overview/): Automatic endpoint detection and continuous monitoring
- [Setup & Configuration](https://docs.wallarm.com/api-discovery/setup/): Enable and configure API Discovery module
- [Shadow and Orphan APIs](https://docs.wallarm.com/api-discovery/rogue-api/): Identify undocumented and deprecated endpoints
- [OWASP API 2023 Coverage](https://docs.wallarm.com/api-discovery/owasp-api-2023/): Mapping to OWASP API Security Top 10

### API Protection Capabilities

#### Specification Enforcement
- [Overview](https://docs.wallarm.com/api-specification-enforcement/overview/): Validate requests against OpenAPI specifications
- [Setup & Configuration](https://docs.wallarm.com/api-specification-enforcement/setup/): Enable specification-based protection

#### API Abuse Prevention
- [Overview](https://docs.wallarm.com/api-abuse-prevention/overview/): AI/ML-based bot and abuse detection
- [Setup & Configuration](https://docs.wallarm.com/api-abuse-prevention/setup/): Configure abuse detection policies
- [Exploring Bot Activity](https://docs.wallarm.com/api-abuse-prevention/exploring/): Analyze malicious bot behavior
- [Exceptions Management](https://docs.wallarm.com/api-abuse-prevention/exceptions/): Configure allowlists and exceptions

#### Specialized Protection
- [Automatic BOLA Protection](https://docs.wallarm.com/api-abuse-prevention/bola-protection/): Broken Object Level Authorization detection
- [Credential Stuffing Detection](https://docs.wallarm.com/api-abuse-prevention/credential-stuffing/): Account takeover prevention
- [GraphQL API Protection](https://docs.wallarm.com/api-abuse-prevention/graphql-protection/): GraphQL-specific security
- [DoS Protection](https://docs.wallarm.com/api-abuse-prevention/dos-protection/): Layer 7 DDoS mitigation
- [Rate Limiting](https://docs.wallarm.com/user-guides/rate-limiting/): Advanced rate limiting rules

### API Attack Surface Management (AASM)
- [Setup & Configuration](https://docs.wallarm.com/api-attack-surface/setup/): Enable AASM for external asset discovery
- Domain and subdomain enumeration
- API discovery and risk assessment
- Security misconfiguration identification
- API leak detection in public repositories
- Vulnerability scanning without agents

### API Sessions Analysis
- [Overview](https://docs.wallarm.com/api-sessions/overview/): Session-based API attack detection
- [Setup](https://docs.wallarm.com/api-sessions/setup/): Configure session analysis
- [Exploring Sessions](https://docs.wallarm.com/api-sessions/exploring/): Investigate suspicious session behavior
- [Blocking](https://docs.wallarm.com/api-sessions/blocking/): Block malicious sessions

### Rules & Mitigation Controls

#### Request Processing
- [Parsing Requests](https://docs.wallarm.com/user-guides/rules/request-processing/): Multi-stage parsing and attack detection logic
- [Rules Management](https://docs.wallarm.com/user-guides/rules/rules/): Create and manage custom security rules
- [Masking Sensitive Data](https://docs.wallarm.com/user-guides/rules/sensitive-data-rule/): Prevent sensitive data exposure

#### Rule Lifecycle
- Custom ruleset building and deployment
- Filtering node synchronization (every 2-4 minutes)
- Rule inheritance and branching
- Default rules and endpoint-specific rules

### Security Testing

#### Testing Methods
- **Passive Detection**: Built-in traffic analysis without sending test requests
- **Threat Replay Testing (TRT)**: Transform real attacks into security tests
- **Schema-Based Testing (SBT)**: DAST solution using OpenAPI specifications
- **API Attack Surface Management (AASM)**: Agentless external vulnerability scanning

#### CI/CD Integration
- Jenkins, GitLab, CircleCI integration
- Automated security testing in development pipelines
- Vulnerability detection before production

### Integrations & Ecosystem
- [Integrations Overview](https://docs.wallarm.com/user-guides/integrations/): Connect with security and DevOps tools
- **Incident Response**: PagerDuty, OpsGenie
- **Security**: Splunk, Sumo Logic, Microsoft Sentinel
- **Code Repositories**: GitHub, GitLab
- **Communication**: Slack, Microsoft Teams
- **Observability**: Prometheus, Datadog
- **Universal**: Webhooks and Wallarm APIs

### API Reference
- [Wallarm API Overview](https://docs.wallarm.com/api/overview/): Programmatic access to Wallarm platform
- API endpoints for managing vulnerabilities, attacks, incidents, users, clients, and filtering nodes
- Authentication methods and security
- US Cloud API: `https://us1.api.wallarm.com/`
- EU Cloud API: `https://api.wallarm.com/`

### Dashboards & Reporting
- **Threat Prevention Dashboard**: Real-time attack monitoring
- **API Discovery Dashboard**: API inventory and risk overview
- **OWASP API 2023 Dashboard**: Coverage mapping
- **Reports**: Custom reporting and compliance documentation

### User Guides & Administration
- User management and access control
- Application configuration
- Traffic filtration modes (monitoring, safe blocking, blocking)
- Activity logs and audit trails
- Subscription plan management

### Release Notes & Updates
- [Changelog & News](https://docs.wallarm.com/news/): Latest features, improvements, and security updates
- Version-specific documentation (6.x, 5.x, 4.10)
- Backward compatibility information

## Documentation Versions

### Current Versions
- **Version 6.x and 0.14.x+**: Latest stable release with full feature set
- **Versions 5.x and 0.13.x-**: Previous stable release
- **Version 4.10**: Legacy version (⚠ Warning: outdated)

## Key Technical Concepts

### Attack Detection Methods
- **Input Validation Attacks**: SQLi, XSS, RCE, Path Traversal (detected via syntax analysis)
- **Behavioral Attacks**: Brute force, BOLA, API abuse, credential stuffing (detected via correlation analysis)
- Multi-protocol support: REST, SOAP, GraphQL, gRPC, WebSocket, JSON

### Traffic Analysis
- Deep packet inspection with multi-stage parsing
- Context-aware request analysis
- Session reconstruction and behavior profiling
- Sensitive data detection (PII, credentials, financial data)

### Deployment Flexibility
- In-line: Real-time blocking with near-zero latency
- Out-of-band: Mirror traffic analysis without affecting production
- Hybrid: Mix deployment options across environments
- eBPF support for kernel-level traffic inspection

## Support Resources

### Cloud Platforms
- **US Cloud**: https://us1.my.wallarm.com/
- **EU Cloud**: https://my.wallarm.com/

### Getting Help
- **Support Portal**: [support.wallarm.com](https://support.wallarm.com)
- **General Contact**: request@wallarm.com
- **Phone**: +1 (415) 940-7077
- **Headquarters**: 188 King St, Unit 508, San Francisco, CA 94107, USA
- Documentation search functionality
- Video tutorials and demos
- Technical support channels
- Community resources

### Best Practices Documentation
- Security configuration recommendations
- Performance optimization guides
- Scalability patterns
- Compliance and regulatory guidance

## Advanced Features

### AI/ML Capabilities
- Behavioral analysis and anomaly detection
- Business logic abuse detection
- Automated threat intelligence
- Self-learning attack patterns

### Enterprise Features
- Multi-tenancy support
- Role-based access control (RBAC)
- Compliance reporting (GDPR, PCI DSS, SOC 2)
- API for automation and integration

### Security Operations
- 24/7 SOC-as-a-Service option
- Real-time alerting and notifications
- Automated incident response workflows
- Threat verification and validation

## Wallarm Ecosystem

### Related Sites
- **Main Site**: [www.wallarm.com](https://www.wallarm.com) - Product, solutions, company info
- **Research Lab**: [lab.wallarm.com](https://lab.wallarm.com) - Security research and threat intelligence (8 languages)
- **Support Portal**: [support.wallarm.com](https://support.wallarm.com) - Help and troubleshooting
- **Status Page**: [status.wallarm.com](https://status.wallarm.com) - Service monitoring
- **Product Playground**: [tour.playground.wallarm.com](https://tour.playground.wallarm.com/) - Interactive demos

### Cloud Consoles
- **US Cloud**: https://us1.my.wallarm.com/
- **EU Cloud**: https://my.wallarm.com/

## Documentation Maintenance

Wallarm follows an API-first approach where new functionality is released in the public API and then documented. The documentation is continuously updated with:
- New feature releases
- Security updates and patches
- Best practices and use cases
- Integration guides
- Troubleshooting resources

> llms.md created for Wallarm Technical Documentation