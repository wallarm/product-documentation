# Wallarm Documentation Structure Proposal

## Overview

This document outlines the proposed restructuring of Wallarm documentation into 7 main sections designed for improved navigation and user experience.

---

## Section 1: Introduction

Entry point for new users with platform overview, quick start guides, and essential resources.

### Structure

```
Introduction/
├── Platform Overview
├── Quick Start Guide
│
├── Getting Started/
│   ├── How Wallarm Works
│   ├── Deployment Best Practices
│   └── Shared Responsibility Model
│
├── Plans & Pricing/
│   ├── Subscription Plans
│   ├── WAAP Overview
│   └── API Protection Overview
│
├── Resources/
│   ├── What's New / Changelog
│   ├── Glossary
│   ├── Data Retention Policy
│   └── SLA
│
└── Video Guides/
```

### Source Files

| Article | Source Path |
|---------|-------------|
| Platform Overview | `about-wallarm/overview.md` |
| Quick Start Guide | `quickstart/` |
| How Wallarm Works | `about-wallarm/protecting-against-attacks.md` |
| Deployment Best Practices | `about-wallarm/deployment-best-practices.md` |
| Shared Responsibility | `about-wallarm/shared-responsibility.md` |
| Subscription Plans | `about-wallarm/subscription-plans.md` |
| WAAP Overview | `about-wallarm/waap-overview.md` |
| API Protection Overview | `about-wallarm/api-protection-overview.md` |
| What's New | `news.md` |
| Glossary | `glossary-en.md` |
| Data Retention Policy | `about-wallarm/data-retention-policy.md` |
| SLA | `sla.md` |
| Video Guides | `demo-videos/` |

---

## Section 2: API Discovery

Comprehensive documentation for API inventory discovery, risk analysis, and data protection features.

### Structure

```
API Discovery/
├── Overview
├── Setup & Configuration
│
├── Exploring Your APIs/
│   ├── API Inventory
│   ├── Dashboard
│   └── Track API Changes
│
├── Risk Analysis/
│   ├── Risk Score
│   ├── Rogue APIs (Shadow/Orphan/Zombie)
│   └── Sensitive Business Flows
│
├── Data Protection/
│   ├── Sensitive Data Detection
│   └── BOLA Auto-Protection
│
└── Agentic AI Discovery/
    ├── AI Discovery Overview
    └── Demo
```

### Source Files

| Article | Source Path |
|---------|-------------|
| Overview | `api-discovery/overview.md` |
| Setup & Configuration | `api-discovery/setup.md` |
| API Inventory | `api-discovery/exploring.md` |
| Dashboard | `api-discovery/dashboard.md` |
| Track API Changes | `api-discovery/track-changes.md` |
| Risk Score | `api-discovery/risk-score.md` |
| Rogue APIs | `api-discovery/rogue-api.md` |
| Sensitive Business Flows | `api-discovery/sbf.md` |
| Sensitive Data Detection | `api-discovery/sensitive-data.md` |
| BOLA Auto-Protection | `api-discovery/bola-protection.md` |
| AI Discovery Overview | `agentic-ai/agentic-ai-discovery.md` |
| Demo | `agentic-ai/demo.md` |

---

## Section 3: API Protection

All threat protection, bot management, rules, and security policy documentation.

### Structure

```
API Protection/
├── Protection Overview
├── Attack & Vulnerability Types
│
├── Threat Protection (WAAP)/
│   ├── DDoS Protection
│   ├── Brute Force Protection
│   ├── Forced Browsing Protection
│   ├── Multi-Attack Thresholds
│   └── DoS Protection
│
├── API-Specific Protection/
│   ├── BOLA Protection (Manual)
│   ├── BOLA Protection (Auto)
│   ├── Enumeration Attack Protection
│   ├── GraphQL Protection
│   └── File Upload Restriction
│
├── Bot Protection/
│   ├── API Abuse Prevention Overview
│   ├── Setup
│   ├── Exploring Detected Bots
│   └── Exceptions
│
├── Specification Enforcement/
│   ├── Overview
│   ├── Setup
│   └── Viewing Events
│
├── Session Security/
│   ├── API Sessions Overview
│   ├── Setup
│   ├── Exploring Sessions
│   └── Session Blocking
│
├── Credential Protection/
│   ├── Credential Stuffing Detection
│   └── Mitigation Controls Overview
│
├── Rules & Policies/
│   ├── Rules Overview
│   ├── Rate Limiting
│   ├── Virtual Patching
│   ├── Custom Regex Rules
│   ├── Sensitive Data Masking
│   ├── Request Processing
│   ├── Response Headers
│   └── Overlimit Detection
│
└── Agentic AI Protection/
    └── AI Protection Overview
```

### Source Files

| Article | Source Path |
|---------|-------------|
| Protection Overview | `about-wallarm/protecting-against-attacks.md` |
| Attack & Vulnerability Types | `attacks-vulns-list.md` |
| DDoS Protection | `admin-en/configuration-guides/protecting-against-ddos.md` |
| Brute Force Protection | `admin-en/configuration-guides/protecting-against-bruteforce.md` |
| Forced Browsing Protection | `admin-en/configuration-guides/protecting-against-forcedbrowsing.md` |
| Multi-Attack Thresholds | `admin-en/configuration-guides/protecting-with-thresholds.md` |
| DoS Protection | `api-protection/dos-protection.md` |
| BOLA Protection (Manual) | `admin-en/configuration-guides/protecting-against-bola-trigger.md` |
| BOLA Protection (Auto) | `admin-en/configuration-guides/protecting-against-bola.md` |
| Enumeration Attack Protection | `api-protection/enumeration-attack-protection.md` |
| GraphQL Protection | `api-protection/graphql-rule.md` |
| File Upload Restriction | `api-protection/file-upload-restriction.md` |
| API Abuse Prevention Overview | `api-abuse-prevention/overview.md` |
| Bot Setup | `api-abuse-prevention/setup.md` |
| Exploring Detected Bots | `api-abuse-prevention/exploring-bots.md` |
| Bot Exceptions | `api-abuse-prevention/exceptions.md` |
| Spec Enforcement Overview | `api-specification-enforcement/overview.md` |
| Spec Enforcement Setup | `api-specification-enforcement/setup.md` |
| Spec Enforcement Events | `api-specification-enforcement/viewing-events.md` |
| API Sessions Overview | `api-sessions/overview.md` |
| Sessions Setup | `api-sessions/setup.md` |
| Exploring Sessions | `api-sessions/exploring.md` |
| Session Blocking | `api-sessions/blocking.md` |
| Credential Stuffing | `about-wallarm/credential-stuffing.md` |
| Mitigation Controls | `about-wallarm/mitigation-controls-overview.md` |
| Rules Overview | `user-guides/rules/rules.md` |
| Rate Limiting | `user-guides/rules/rate-limiting.md` |
| Virtual Patching | `user-guides/rules/vpatch-rule.md` |
| Custom Regex Rules | `user-guides/rules/regex-rule.md` |
| Sensitive Data Masking | `user-guides/rules/sensitive-data-rule.md` |
| Request Processing | `user-guides/rules/request-processing.md` |
| Response Headers | `user-guides/rules/add-replace-response-header.md` |
| Overlimit Detection | `user-guides/rules/configure-overlimit-res-detection.md` |
| AI Protection Overview | `agentic-ai/agentic-ai-protection.md` |

---

## Section 4: Testing

Security testing capabilities including vulnerability detection and API attack surface management.

### Structure

```
Testing/
├── Security Testing Overview
├── Detecting Vulnerabilities
│
├── Threat Replay Testing/
│   ├── Overview
│   ├── Setup
│   └── Exploring Results
│
├── Schema-Based Testing/
│   ├── Overview
│   ├── Setup
│   └── Exploring Results
│
├── API Attack Surface (AASM)/
│   ├── Overview
│   ├── Setup
│   ├── API Surface Discovery
│   └── Security Issues
│
└── FAST Platform (Advanced)/
    ├── Quick Start Guide
    ├── OpenAPI Security Testing
    ├── DSL Reference
    └── Troubleshooting
```

### Source Files

| Article | Source Path |
|---------|-------------|
| Security Testing Overview | `vulnerability-detection/security-testing-overview.md` |
| Detecting Vulnerabilities | `about-wallarm/detecting-vulnerabilities.md` |
| TRT Overview | `vulnerability-detection/threat-replay-testing/overview.md` |
| TRT Setup | `vulnerability-detection/threat-replay-testing/setup.md` |
| TRT Results | `vulnerability-detection/threat-replay-testing/exploring.md` |
| SBT Overview | `vulnerability-detection/schema-based-testing/overview.md` |
| SBT Setup | `vulnerability-detection/schema-based-testing/setup.md` |
| SBT Results | `vulnerability-detection/schema-based-testing/explore.md` |
| AASM Overview | `api-attack-surface/overview.md` |
| AASM Setup | `api-attack-surface/setup.md` |
| API Surface Discovery | `api-attack-surface/api-surface.md` |
| Security Issues | `api-attack-surface/security-issues.md` |
| FAST QSG | `fast/qsg/` |
| OpenAPI Testing | `fast/openapi-security-testing.md` |
| FAST DSL | `fast/dsl/` |
| FAST Troubleshooting | `fast/tshoot.md` |

---

## Section 5: Deployment

All deployment options from managed Security Edge to self-hosted installations.

### Structure

```
Deployment/
├── Deployment Overview
│
├── Security Edge (Managed)/
│   ├── Overview
│   ├── Free Tier
│   ├── Inline Deployment/
│   │   ├── Overview
│   │   ├── Deployment Guide
│   │   ├── Access Control Lists
│   │   ├── Cache Rules
│   │   ├── Custom Block Page
│   │   ├── Host Redirection
│   │   ├── mTLS Configuration
│   │   ├── Multi-Region
│   │   ├── NGINX Overrides
│   │   └── Upgrade & Management
│   ├── Telemetry Portal/
│   │   ├── Overview
│   │   ├── Main Dashboard
│   │   └── Logs Dashboard
│   └── Security Edge Connector
│
├── Kubernetes/
│   ├── NGINX Ingress Controller
│   ├── Sidecar Proxy/
│   │   ├── Deployment
│   │   ├── Helm Chart
│   │   ├── Customization
│   │   ├── Pod Annotations
│   │   └── Scaling
│   ├── eBPF (Out-of-Band)/
│   │   ├── Deployment
│   │   ├── Helm Chart
│   │   └── Selecting Packets
│   └── Ingress Best Practices/
│       ├── High Availability
│       ├── Monitoring
│       └── Real Client IP
│
├── Cloud Platforms/
│   ├── AWS/
│   │   ├── AMI
│   │   ├── Docker on ECS
│   │   ├── Terraform Module
│   │   ├── Autoscaling
│   │   └── Load Balancing
│   ├── GCP/
│   │   ├── Machine Image
│   │   ├── Docker on GCE
│   │   └── Autoscaling
│   ├── Azure/
│   │   └── Container Instances
│   └── Alibaba Cloud/
│       └── Docker on ECS
│
├── Connectors/
│   ├── Overview
│   ├── Akamai EdgeWorkers
│   ├── Apigee
│   ├── AWS API Gateway
│   ├── AWS Lambda
│   ├── Azure API Management
│   ├── Azion Edge
│   ├── Cloudflare
│   ├── Fastly
│   ├── IBM API Connect
│   ├── Istio
│   ├── Kong Ingress Controller
│   ├── Kong API Gateway
│   ├── Layer7 API Gateway
│   ├── MuleSoft
│   └── MuleSoft Flex
│
├── Self-Hosted Node/
│   ├── Native Node (All-in-One)
│   ├── Docker Image
│   ├── Helm Chart
│   └── AWS AMI
│
├── Out-of-Band (Traffic Mirror)/
│   ├── Overview
│   └── TCP Mirror/
│       ├── Deployment
│       └── Configuration
│
├── On-Premise/
│   ├── Overview
│   ├── Deployment
│   └── Maintenance
│
├── Multi-Tenant/
│   ├── Overview
│   ├── Configure Accounts
│   └── Deploy Multi-Tenant Node
│
└── Upgrades & Migration/
    ├── Versioning Policy
    ├── What's New
    └── Migration Guides
```

---

## Section 6: Integrations

Third-party integrations for alerting, SIEM, incident management, and DevSecOps.

### Structure

```
Integrations/
├── Integrations Overview
│
├── Messaging & Alerts/
│   ├── Email
│   ├── Slack
│   ├── Microsoft Teams
│   └── Telegram
│
├── Incident Management/
│   ├── PagerDuty
│   ├── Opsgenie
│   ├── Jira
│   ├── ServiceNow
│   └── InsightConnect
│
├── SIEM & Analytics/
│   ├── Splunk
│   ├── Sumo Logic
│   ├── Microsoft Sentinel
│   └── Datadog
│
├── Log Collectors/
│   ├── Fluentd
│   └── Logstash
│
├── Cloud Storage/
│   ├── Amazon S3
│   └── MinIO
│
├── Webhooks/
│   └── Webhook Configuration
│
└── DevSecOps/
    ├── Docker Image Verification
    └── SBOM Generation
```

### Source Files

| Article | Source Path |
|---------|-------------|
| Integrations Overview | `user-guides/settings/integrations/integrations-intro.md` |
| Email | `user-guides/settings/integrations/email.md` |
| Slack | `user-guides/settings/integrations/slack.md` |
| Microsoft Teams | `user-guides/settings/integrations/microsoft-teams.md` |
| Telegram | `user-guides/settings/integrations/telegram.md` |
| PagerDuty | `user-guides/settings/integrations/pagerduty.md` |
| Opsgenie | `user-guides/settings/integrations/opsgenie.md` |
| Jira | `user-guides/settings/integrations/jira.md` |
| ServiceNow | `user-guides/settings/integrations/servicenow.md` |
| InsightConnect | `user-guides/settings/integrations/insightconnect.md` |
| Splunk | `user-guides/settings/integrations/splunk.md` |
| Sumo Logic | `user-guides/settings/integrations/sumologic.md` |
| Microsoft Sentinel | `user-guides/settings/integrations/azure-sentinel.md` |
| Datadog | `user-guides/settings/integrations/datadog.md` |
| Fluentd | `user-guides/settings/integrations/fluentd.md` |
| Logstash | `user-guides/settings/integrations/logstash.md` |
| Amazon S3 | `user-guides/settings/integrations/amazon-s3.md` |
| MinIO | `user-guides/settings/integrations/minio.md` |
| Webhook | `user-guides/settings/integrations/webhook.md` |
| Docker Verification | `integrations-devsecops/` |
| SBOM | `integrations-devsecops/` |

---

## Section 7: Platform Management

Console administration, user management, monitoring, and troubleshooting.

### Structure

```
Platform Management/
├── Console Overview
│
├── Users & Access/
│   ├── User Management
│   ├── API Tokens
│   ├── SSO Configuration/
│   │   ├── SSO Overview
│   │   ├── SSO Setup
│   │   ├── Google Workspace
│   │   ├── Okta
│   │   └── Troubleshooting
│   └── LDAP Integration
│
├── Nodes & Infrastructure/
│   ├── Nodes Overview
│   ├── Resource Allocation
│   ├── Cloud Synchronization
│   ├── Proxy Configuration
│   └── Block Page Configuration
│
├── Monitoring & Events/
│   ├── Events Overview
│   ├── Analyzing Attacks
│   ├── Analyzing Incidents
│   ├── Grouping & Sampling
│   └── Vulnerabilities
│
├── Dashboards/
│   ├── Threat Prevention Dashboard
│   ├── API Discovery Dashboard
│   └── OWASP API Top 10 Dashboard
│
├── Triggers & Alerts/
│   └── Trigger Configuration
│
├── Search & Reports/
│   └── Search & Custom Reports
│
├── Account Settings/
│   ├── Account
│   ├── General Settings
│   ├── Applications
│   ├── Subscriptions
│   └── Audit Log
│
├── Troubleshooting/
│   └── Common Issues & Solutions
│
└── FAQ/
```

### Source Files

| Article | Source Path |
|---------|-------------|
| Console Overview | `user-guides/user-intro.md` |
| User Management | `user-guides/settings/users.md` |
| API Tokens | `user-guides/settings/api-tokens.md` |
| SSO Overview | `admin-en/configuration-guides/sso/intro.md` |
| SSO Setup | `admin-en/configuration-guides/sso/setup.md` |
| Google Workspace | `admin-en/configuration-guides/sso/sso-gsuite.md` |
| Okta | `admin-en/configuration-guides/sso/sso-okta.md` |
| SSO Troubleshooting | `admin-en/configuration-guides/sso/troubleshooting.md` |
| LDAP | `admin-en/configuration-guides/ldap/ldap.md` |
| Nodes Overview | `user-guides/nodes/` |
| Resource Allocation | `admin-en/configuration-guides/allocate-resources-for-node.md` |
| Cloud Sync | `admin-en/configure-cloud-node-synchronization-en.md` |
| Proxy Config | `admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md` |
| Block Page | `admin-en/configuration-guides/configure-block-page-and-code.md` |
| Events Overview | `user-guides/events/overview.md` |
| Analyzing Attacks | `user-guides/events/check-attack.md` |
| Analyzing Incidents | `user-guides/events/check-incident.md` |
| Grouping & Sampling | `user-guides/events/grouping-sampling.md` |
| Vulnerabilities | `user-guides/vulnerabilities.md` |
| Threat Prevention Dashboard | `user-guides/dashboards/threat-prevention.md` |
| API Discovery Dashboard | `user-guides/dashboards/api-discovery.md` |
| OWASP Dashboard | `user-guides/dashboards/owasp-api-top-ten.md` |
| Triggers | `user-guides/triggers/` |
| Search & Reports | `user-guides/search-and-filters/` |
| Account | `user-guides/settings/account.md` |
| General Settings | `user-guides/settings/general.md` |
| Applications | `user-guides/settings/applications.md` |
| Subscriptions | `user-guides/settings/subscriptions.md` |
| Audit Log | `user-guides/settings/audit-log.md` |
| Troubleshooting | `troubleshooting/` |
| FAQ | `faq/` |

---

## Summary

| Section | Subsections | Estimated Articles |
|---------|-------------|-------------------|
| Introduction | 5 | ~15 |
| API Discovery | 4 | ~12 |
| API Protection | 9 | ~35 |
| Testing | 4 | ~15 |
| Deployment | 9 | ~80 |
| Integrations | 7 | ~20 |
| Platform Management | 8 | ~30 |
| **Total** | **46** | **~207** |

---

## Notes

1. **FAST Platform** - Consider keeping as separate advanced section or integrating into Testing
2. **Admin-en folder** - Content should be redistributed across relevant sections
3. **Wizard files** (`*-for-wizard.md`) - Used for UI wizards, may not need public docs
4. **Localization** - Structure applies to English; other languages follow same pattern
