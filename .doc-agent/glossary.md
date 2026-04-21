# Wallarm Glossary

## Product terms

| Term | Definition | Synonyms OK | Do NOT use |
| --- | --- | --- | --- |
| Wallarm | Brand name | | |
| Wallarm Platform | Main product: protects websites, APIs, and microservices | Wallarm | |
| Wallarm Node | Component installed in client infrastructure to analyze requests, detect and block attacks. Subtypes by technology: **Native Node**, **NGINX Node**. By hosting: **Self-Hosted Node**, **Security Edge**. By traffic flow: **in-line**, **Out-of-Band (OOB)** | Node, Filtering Node, Wallarm Filtering Node | WAF Node, filter Node |
| Native Node | Wallarm Node that does not rely on NGINX — lightweight and platform-agnostic | | native Node (lowercase n) |
| NGINX Node | Wallarm Node integrated with NGINX (included in installation package) | | Nginx Node |
| Security Edge | Wallarm-managed deployment — no self-hosting required | Edge Node, Security Edge Node | |
| Self-Hosted Node | Node deployed in customer's own infrastructure (Hybrid or On-Premise) | self-hosted Wallarm Node | |
| in-line | Deployment where traffic passes through Node instances before reaching API | in-line deployment, in-line solution | |
| Out-of-Band (OOB) | Deployment where traffic is mirrored to Node for inspection, not affecting primary data path | OOB deployment, OOB solution | out-of-band (lowercase) |
| origin | Backend server where Node forwards filtered traffic (Security Edge context) | | |
| connector | Two-component solution: platform-specific code bundle on third-party service + external Wallarm Node | Wallarm's connector solution | |
| Wallarm Cloud | Cloud component storing attack data, traffic rules, vulnerability data. Two instances: EU Cloud, US Cloud | Cloud | Wallarm cloud (lowercase c) |
| Wallarm Console | Web interface of Wallarm Cloud. EU: https://my.wallarm.com/ US: https://us1.my.wallarm.com/ | | Wallarm console (lowercase c), Wallarm portal, Wallarm Account, Wallarm UI |
| Wallarm's component | Relatively independent functional block with parts in Cloud, Node, and/or extra artifacts | component, module | Better to avoid "component"/"module" — say "API Discovery" not "API Discovery module" |
| active Node | Node last synced with Cloud less than 2 minutes ago | | |
| inactive Node | Node not synced with Cloud for ~2 minutes (red shaded in Console) | | disabled Node |
| postanalytics module | Component for statistical analysis: detects behavioral attacks, uploads attacks to Cloud | postanalytics | |
| wstore | In-memory storage component replacing Tarantool in latest Node versions | | |
| custom ruleset | Set of rules and mitigation controls created by client for traffic processing | rules, custom rules | LOM, application profile |
| mitigation control | Object in Console extending attack protection with additional security measures | | |
| rule | Object in Console to fine-tune default Wallarm behavior during request analysis. Consists of: condition, action, request point | custom rule | |
| rule condition | Condition that triggers the rule: request point + condition type + value | condition | action |
| request point | Request element (parameter, protocol, method, etc.) described with filter/parser names | point | tag, parameter |
| rule action | Action performed when rule condition is triggered | action | |
| virtual patch | Rule blocking requests that exploit a known but unfixed vulnerability | virtual patching (for the process) | |
| Passive detection | Vulnerability detection method analyzing real traffic requests and responses | Passive vulnerability detection | |
| API Discovery | Module building client's API inventory based on real traffic analysis | | |
| API inventory | Description of client's API: applications, hosts, endpoints, parameters. Built by API Discovery | | |
| anomaly | Potential vulnerability characterized by atypical application reaction to a request | | |
| attack | Intentional action to exploit APIs. Types: **input validation attacks** (SQLi, XSS, etc.), **behavioral attacks** (brute force, BOLA, etc.) | | |
| input validation attack | Attack characterized by specific symbol combinations (SQLi, XSS, RCE, path traversal) | | |
| behavioral attack | Attack characterized by request syntax and/or correlation of request number and timing (brute force, forced browsing, BOLA, API abuse, credential stuffing) | | |
| hit | Serialized malicious request (original request + metadata from Node) | | |
| malicious request | Request with attack signs detected by Node | | invalid request |
| legitimate request | Request without attack signs | | |
| malicious payload | Part of request containing attack stamps (identifier + context) | payload | attack vector |
| false positive | Mistaken detection of attack or vulnerability | | false attack, false vulnerability |
| security issue | Error in application that can be exploited by attacker. Detected via: Passive detection, Threat Replay Testing, Schema-Based Testing, API Attack Surface Management | vulnerability, issue | |
| vulnerability | See **security issue** | security issue, issue | |
| risk level | Characteristic of security issues: how much risk the vulnerability poses | | |
| risk score | Characteristic of API endpoints: how likely to be attacked | | |
| open security issue | Detected vulnerability not yet fixed | | open vulnerability, actual vulnerability |
| closed security issue | Detected vulnerability already fixed/patched/irrelevant/false positive | | inactive vulnerability, fixed vulnerability |
| incident | Occurrence of vulnerability exploited by attacker | security incident | |
| Security Testing suite | Comprehensive platform for detecting security issues at different development stages. Includes: TRT, SBT | Wallarm's Security Testing suite | |
| Threat Replay Testing (TRT) | Analyzes actual attack attempts, sanitizes payloads, replays in non-prod environment | | |
| Schema-Based Testing (SBT) | DAST solution using API schema (OpenAPI spec, Postman collection) for automated security tests | | |
| stamp | Malicious payload identifier. If detected, request is marked malicious | attack sign, attack stamp | global rules, global ruleset |
| general security ruleset | attack stamps (proton.db) + attack contexts (libdetection) + custom ruleset | general ruleset | |
| attack source | Information about where attack was sent from (IP, data center, etc.) | | |
| target | Entity targeted by attack or containing vulnerability (server, database, client) | | |
| fuzzing | Automated testing providing invalid/unexpected/random data as inputs | fuzz testing | |

## Subscription and account terms

| Term | Definition | Synonyms OK | Do NOT use |
| --- | --- | --- | --- |
| subscription plan | Outlines access to Wallarm components and features | subscription | license |
| Cloud Native WAAP | Core subscription for web/API protection against SQLi, XSS, brute force, etc. | WAAP | WAF, NG-WAF |
| Advanced API Security | Enhanced subscription covering all OWASP API Top-10 threats | WAAP + Advanced API Security | |
| Security Testing | Subscription for proactive vulnerability detection | | |
| free tier | Free subscription with monthly quotas (default: 500K requests/month) | | |
| active subscription | Paid plan: application protected, scanned, integrations working | | valid subscription |
| inactive subscription | Unpaid/expired plan: protected but no rule updates or scanning | | |
| trial subscription | Free plan for limited time to evaluate all features | trial, trial period | free license, trial license |
| PoC | Proof of concept demonstration for potential partners/clients | | |
| partner | Organization installing Node and providing Wallarm service to its clients | | vendor |
| customer | Organization using Wallarm to protect its own system | client | |
| user | Person or program using Wallarm Console, with assigned role | | |
| partner account | Partner account for partner scheme implementation | | |
| technical client account | Account for partner company in Wallarm system | tenant | |
| client account | Account for client company | company account, tenant | |
| user account | Account of a user, linked to technical client or client account | | |
| active user | User who can access Console and Cloud | | enabled user |
| inactive user | User who cannot access Console and Cloud (access disabled) | | disabled user |
| two‑factor authentication | Auth via password + confirmation code (e.g., Google Authenticator) | | two-step auth, multi-factor auth |
| sign in to | Get access to existing account | authenticate in | log in |
| sign up for | Create new account | create account, register in | |
| email | User email for authentication | | e-mail, login, username |
| first name and last name | | | login, username |
| multitenancy | Multiple linked accounts for one company in Console | tenant (for linked accounts) | |

## Platform features

| Term | Definition | Synonyms OK | Do NOT use |
| --- | --- | --- | --- |
| application | Entity to separate statistics/events for different apps. Configured via `wallarm_instance` | | instance, pool |
| integration | Tool for sending data from Cloud to third-party systems (SIEM, messengers, webhooks) | | |
| trigger | Tool for custom reactions to events (notifications, IP blocking, etc.) | | |
| security report | Report with data on attacks, incidents, and active vulnerabilities | | |
| audit log | Log of events committed by system, users, or Technical Support | activity log | |
| Wallarm API Console | Interactive API documentation portal | | API Reference |
| Technical Support | Team for technical assistance. Email: support@wallarm.com | Support, Support Team | customer support, client support |
| Sales Team | Team responsible for selling Wallarm products | | |

## Deployment terms

| Term | Definition | Synonyms OK | Do NOT use |
| --- | --- | --- | --- |
| deployment form | Where Node and Cloud are installed: **Hybrid**, **Security Edge**, **On-Premise** | | |
| deployment option | Specific environment variant within a deployment form | | |
| deployment artifact | Material object for Node installation (installer, Helm chart, Docker image, AMI) | artifact | |
| Hybrid deployment | Cloud hosted by Wallarm, Node in customer infrastructure | | |
| On-Premise | Both Cloud and Node in customer infrastructure | On-Premises, on-premises solution | |

## Network terms

| Term | Definition |
| --- | --- |
| API | Web service handling specific protocol (REST, GraphQL, SOAP) |
| API host | Host with at least one API |
| API endpoint | Exact path where HTTP request is sent, e.g., `/api/v1/admin/logs` |
| API base path | URL prefix for all API endpoints |
| subdomain | Domain within another domain. DNS record type: NS |
| host | Network device or function. DNS record type: A |

## Security concepts

| Term | Definition |
| --- | --- |
| prevention | Security activity **before** an incident — stops threat entirely |
| mitigation | Security activity **before/during** an incident — reduces impact |
| remediation | Security activity **after** an incident — corrects the problem |
| denylist / allowlist / graylist | IP lists for access management. Do NOT use: blacklist, whitelist, greylist |

## External component names

Always use official capitalization:
- **NGINX** (not nginx, Nginx)
- **Docker** (not DOCKER, docker)
- **Kubernetes** or **K8s** (Ingress capitalized, controller lowercase)
- **Amazon Web Services / AWS** (not Amazon AWS)
- **Google Cloud Platform / Google Cloud** (not Google cloud)
- **Sumo Logic** (not SumoLogic)
- **GitLab** (not Gitlab)
- **CircleCI** (not Circle CI)
- **Jenkins**
- **Tarantool** (not tarantool)
