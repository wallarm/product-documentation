[link-deployment-se]:           ../installation/security-edge/overview.md
[link-deployment-hybrid]:       ../installation/supported-deployment-options.md
[link-deployment-on-prem]:      ../installation/on-premise/overview.md

# Shared Responsibility for Clients' Data

Wallarm relies on a shared responsibility security model. In this model, all parties (Wallarm and its clients) have different areas of responsibilities when it comes to the security of clients' data, including any personally identifiable information (PII) and cardholder data.

## Overview

Wallarm has two main components: **Wallarm filtering node** and **Wallarm Cloud**. See their general descriptions [here](../about-wallarm/overview.md#how-wallarm-works). These components can be deployed in one of three forms for which Wallarm and client's responsibilities are shared differently:

--8<-- "../include/deployment-forms.md"

![Responsibilities scheme](../images/shared-responsibility-variants.png)

## Security Edge

In this deployment form, both Wallarm filtering nodes and Wallarm Cloud components are managed by Wallarm and thus most responsibilities go to Wallarm side.

**Wallarm responsibilities**

* The security and availability of Wallarm cloud environments, the security of Wallarm filtering node code and internal Wallarm systems.

    This includes, but is not limited to: server-level patching, operating the necessary services to deliver Wallarm cloud service, vulnerability testing, security event logging and monitoring, incident management, operational monitoring and 24/7 support. Wallarm is also responsible for managing server and perimeter firewall configurations (security groups) of Wallarm cloud environments.

* Upgrading the [Edge Inline Node](../installation/security-edge/inline/upgrade-and-management.md#upgrading-the-edge-inline) or [Edge Connector Node](../installation/security-edge/se-connector.md#upgrading-the-edge-node) on a [periodic basis](../updating-migrating/versioning-policy.md).
* Providing you with a copy of the latest Wallarm SOC 2 Type II audit report if requested.
* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

**Client responsibilities**

* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.
* Notifying Wallarm in a timely manner of any changes to personnel directly involved with services performed by Wallarm. This personnel may be involved in financial, technical, or ancillary administrative functions directly associated with services provided by Wallarm.

## Hybrid

In this deployment form, Wallarm clients deploy and manage the Wallarm filtering nodes, and Wallarm manages the Wallarm Cloud component and thus responsibilities are shared equally.

**Wallarm responsibilities**

* The security and availability of Wallarm cloud environments, the security of Wallarm filtering node code and internal Wallarm systems.
* Updating the Wallarm filtering node component on a [periodic basis](../updating-migrating/versioning-policy.md). Please note that the application of these updates is the responsibility of the client.
* Providing you with a copy of the latest Wallarm SOC 2 Type II audit report if requested.

**Client responsibilities**

Wallarm clients are responsible for the following points:

* Implementing sound and consistent internal controls regarding general IT system access and system usage appropriateness for all internal components associated with Wallarm, including Wallarm filtering node and Wallarm Cloud.

* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.

* Configuring proper [data export process](../admin-en/export-to-cloud.md) for any sensitive data not to leave the client’s security perimeter, and, in the same time, all data required to detect malicious requests is sent to the Wallarm Cloud.

* Ensuring that transactions for client organizations relating to Wallarm’s services are appropriately authorized, and transactions are secure, timely, and complete.

* Notifying Wallarm in a timely manner of any changes to personnel directly involved with services performed by Wallarm. This personnel may be involved in financial, technical, or ancillary administrative functions directly associated with services provided by Wallarm.

* Updating filtering nodes with new software updates released by Wallarm in a timely manner.

* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

## On-Premise

In this deployment form, both Wallarm filtering node and Wallarm Cloud components are hosted and managed by the client and thus most responsibilities (along with control) go to client side.

**Wallarm responsibilities**

* The security of Wallarm filtering node and Cloud code.
* Updating the Wallarm filtering node and Cloud components on a periodic basis. Please note that the application of these updates is the responsibility of the client.

**Client responsibilities**

* Providing the security and availability of environments used for Wallarm filtering nodes and Cloud deployment.
* Updating filtering nodes and Cloud with new software updates released by Wallarm in a timely manner.
* Implementing sound and consistent internal controls regarding general IT system access and system usage appropriateness for all internal components associated with Wallarm, including Wallarm filtering node and Wallarm Cloud.
* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.
* Ensuring that transactions for client organizations relating to Wallarm’s services are appropriately authorized, and transactions are secure, timely, and complete.
* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

## Visibility and control over data export

Regardless of deployment form, Wallarm provides a full visibility into what data is transferred from node to Cloud and gives a set of comprehensive tools to fully control this export.

See [Control over Export to Cloud](../admin-en/export-to-cloud.md) for details.

## Client data storage in Cloud

In Wallarm's hybrid and cloud deployments, any data sent from filtering nodes is stored in the Wallarm Cloud, fully managed by Wallarm:

* Request and attack data are stored in a PostgreSQL database, with related content persisted in Google Cloud Storage (S3-compatible) and cached in Redis for performance. No third-party services outside Google Cloud are used.
* All storage is hosted on Google Cloud Platform as part of Wallarm’s secure infrastructure.
* GCP complies with GDPR and other international data protection standards, ensuring data security and privacy.
* Wallarm supports deployments in multiple [regions](overview.md#cloud) (US and EU) to keep data within preferred jurisdictions.
