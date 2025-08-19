# Wallarm On-Premises Solution Deployment

This guide provides high-level instructions for deploying Wallarm Cloud and Filtering Nodes in an on‑premise environment.

## Required skills

To deploy and manage Wallarm on-premise, familiarity with the following is recommended:

* Linux system administration (Ubuntu or RHEL)
* Basic Kubernetes administration (Helm, statefulsets, PVCs, cronjobs, etc)
* System monitoring with services like Grafana or Alertmanager

## High-level deployment process

The following is a high-level overview of Wallarm on-premise planning and deployment process:

1. Define a deployment plan using Wallarm's detailed on-premise documentation and assistance from the Wallarm team.
1. Prepare [prerequisites](#system-requirements-for-wallarm-cloud-on-premises): SSL certificates, server credentials, config.yaml, etc.
1. Set up the management workstation with the **wctl** tool and required config files.
1. Provision Wallarm Cloud nodes and deploy the instance using wctl.
1. Configure the load balancer (for production clusters).
1. Configure an on-premise Wallarm Cloud license key.
1. Perform the required configuration of the Wallarm Cloud instance (users, Wallarm product features, triggers, rules, integrations, etc.). [Attack prevention best practices](../../quickstart/attack-prevention-best-practices.md) may be helpful.
1. Deploy and configure Wallarm Filtering Nodes using any of [supported self-hosted deployment options](../../installation/supported-deployment-options.md).

    !!! info "Wallarm Cloud address"
        Configure the Node to connect to your local Wallarm Cloud instead of the Wallarm-managed Cloud. Use the following connection parameters:

        * Local Wallarm Cloud hostname, e.g. `api.wallarm-prod.mycompany.com`
        * Local Wallarm Cloud port: `443/TCP`
        * Node token or API key: generate in the local Wallarm Console as described in the [documentation](../../user-guides/settings/api-tokens.md)

        Example of the `docker run` command:

        ```
        docker run -d -e WALLARM_API_TOKEN='<API_TOKEN>' \
            -e WALLARM_LABELS='group=onprem' \
            -e WALLARM_API_HOST='api.wallarm-prod.mycompany.com' \
            -e NGINX_BACKEND='<BACKEND_IP>:8080' \
            -p 80:80 \
            -e TARANTOOL_MEMORY_GB='<HALF_OF_RAM>.0' \
            -v /etc/hosts:/etc/hosts \
            wallarm/node
        ```
1. Test traffic flow and Wallarm Cloud functionality, using the [Health Check Scenarios](../../admin-en/uat-checklist-en.md).
1. Deploy and configure a [data backup node](#data-backups-and-disaster-recovery-planning).
1. Configure the monitoring of the Wallarm Cloud instance and Filtering Nodes.
1. Perform a detailed test of the whole system and confirm that it meets the customer's requirements.
1. Document the Wallarm Cloud and Filtering Node components, including maintenance activities.
1. Receive from Wallarm training about operating the entire system.

## System requirements for Wallarm Cloud on-premises

The Wallarm Cloud component has the following hardware, network, and system requirements.

### Management workstation

The [management workstation](overview.md#management-workstation) is used to install and operate Wallarm Cloud via the **wctl** tool.

Most Wallarm customers use their work laptops or desktops for this purpose - the hardware requirements are minimal, and most office machines are sufficient.

Alternatively, you can use a dedicated server. If so, it should meet the following requirements:

* Windows, macOS, or Linux operating system
* Intel (AMD64) or ARM64 CPU architecture
* At least 2GB of RAM
* At least 50GB of disk space storage
* Docker installed (to run the **wctl** tool)
* Google Chrome to access the Wallarm Cloud web interface

    You may use another machine with Chrome as long as it has access to the Wallarm Cloud instance.
* Passwordless SSH access to Wallarm Cloud servers
* Proper [network connectivity](#network)

### Wallarm Cloud servers

Wallarm Cloud servers must meet the following requirements:

* Supported operating system:

    * Ubuntu LTS 22.04 (Ubuntu LTS 24.04 is not supported yet)
    * Red Hat Enterprise Linux 8.x and 9.x
* Intel (AMD64) CPU architecture (ARM64 is not supported yet)
* A regular SSH user account with passwordless SSH access from the management workstation and the ability to run `sudo` without a password

    Passwordless SSH login relies on asymmetric encryption: the public key is stored on the server, and the client must present the corresponding private key to authenticate.
* DNS resolvers capable of resolving both internal and external domain names (e.g., `onprem.wallarm.com`)
* SSD or NVMe with at least 350MB/s I/O (HDDs are not supported due to low disk I/O performance)
* ext4 or XFS file system
* At least 1 GB NIC connections
* Static IP addresses (private, public, or both)
* For production deployment:

    * Redundant disk storage (hardware or software RAID1/5/6)
    * Redundant server power suppliers
    * Redundant network interfaces (interface bonding)
* Proper [network connectivity](#network)
* Proper [CPU, memory, and disk space](#capacity-planning)

### Wallarm data backup server

Wallarm recommends using the MinIO open-source software as S3-compatible object storage on the data backup server. The software can be installed in [single-node single-drive](https://min.io/docs/minio/linux/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html) mode.

The MinIO software supports the following system configurations:

* Intel (AMD64) CPU architecture
* At least 2 CPU cores
* At least 32GB of RAM
* Supported operating system:

    * Ubuntu/Debian (any version supported by MinIO)
    * Red Hat Enterprise Linux
* XFS file system

The recommended disk size is 2TB.

### SMTP server

Wallarm Cloud uses email for user invitations, password resets, alerts, and reports.

By default, the instance includes a built-in test email server with a web interface. It intercepts all outgoing messages and displays them for review. **This setup is only recommended for testing**.

For production usage, Wallarm Cloud should be configured to use a customer-provided SMTP server. Required SMTP server parameters are:

* The domain name to be used in outgoing email messages (Wallarm software will use the domain name and username like `no-reply` to generate the **From** email address)
* SMTP server hostname or IP address
* SMTP service port
* Whether the SMTP server supports TLS encryption
* Authentication credentials (username and password)

### Domain name and DNS records

The Wallarm Cloud component should be assigned a separate domain or subdomain in the enterprise's primary domain name. If you are deploying several instances of Wallarm Cloud components (for example, production and staging environments), each instance should be assigned its own domain name.

For example, if the primary company domain is `mycompany.com`, the following subdomains may be assigned to used Wallarm Cloud instances:

* Production environment: `wallarm-prod.mycompany.com`
* Staging environment: `wallarm-staging.mycompany.com`
* Disaster recovery (DR) environment: `wallarm-dr.mycompany.com`

### SSL certificate

For the selected domain name for the planned Wallarm Cloud instance, you will need to provision a proper public or self-signed SSL certificate. The certificate will be used to protect the following network communications:

* From Wallarm filtering nodes to the Wallarm Cloud instance
* From Wallarm administrators (workstations) to the Wallarm Cloud Console UI and API

For your convenience and to speed up the deployment of a Wallarm Cloud **test instance** in your environment, Wallarm engineers can provide you with a temporary SSL certificate and private key for wildcard name `*.onprem.wallarm.tools`, to be used together with the Wallarm Cloud instance domain name  `onprem.wallarm.tools`.

### Network

The servers of a Wallarm Cloud instance should be placed in the same LAN and network subnet, isolated from the Internet and the rest of the internal network.

The servers require the following network connectivity (firewall) permissions:

* Local (host-based) firewalls fully disabled
* Outgoing network connections:

    | From (source) | To (destination) | Destination port(s) | Business justification |
    | ----- | ----- | ----- | ----- |
    | All Wallarm Cloud nodes | https://hibp.onprem.wallarm.com; https://scripts.onprem.wallarm.com; https://packages-versions.onprem.wallarm.com; https://repo.onprem.wallarm.com; https://registry.onprem.wallarm.com; https://configs.onprem.wallarm.com/; (static IP address 34.90.162.10) | 443/TCP | Downloading Wallarm on-prem software packages and containers |
    | All Wallarm Cloud nodes | Wallarm data backup server or S3-compatible object storage service | 443/TCP (or whatever TCP port is used by the employed S3-compatible storage service) | To store data backups |
    | The management workstation | Wallarm data backup server or S3-compatible object storage service | 443/TCP (or whatever TCP port is used by the employed S3-compatible storage service) | To access data backups and store some data required for a successful data recovery |
    | All Wallarm Cloud nodes | The enterprise SMTP server | Typically port 587/TCP (Secure SMTP over TLS) | For dispatching email messages |
    | All Wallarm Cloud nodes | Internal and external third-party integrations/services like SIEM, logs collections, messaging, etc | Application-specific ports | Utilizing the configured [third-party integration](../../user-guides/settings/integrations/integrations-intro.md) |

* Incoming network connections:

    | From (source) | To (destination) | Destination port(s) | Business justification |
    | ----- | ----- | ----- | ----- |
    | All Wallarm filtering nodes | The IP address of the load balancer in front of the Wallarm Cloud cluster nodes; the IP address of the standalone Wallarm Cloud server | 443/TCP | Communication from the filtering nodes to the Wallarm Cloud instance (registration, configuration, attacks/sessions data upload, etc) |
    | The management workstation | All Wallarm Cloud nodes | 6443/TCP (K8s API) | Kubernetes API access |
    | The management workstation | The IP address of the load balancer in front of the Wallarm Cloud cluster nodes; the IP address of the standalone Wallarm Cloud server | 443/TCP | Wallarm Cloud Console UI access |
    | Internal DNS resolvers | The IP address of the load balancer in front of the Wallarm Cloud cluster nodes | 53/UDP | DNS-based vulnerability validations performed by the Wallarm [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md) feature in the customer's application staging environment |
    | All Wallarm Cloud nodes | All Wallarm Cloud nodes | All IP protocols, all TCP and UDP ports | Internal communication between cluster nodes |

* It is strongly recommended to block all Internet-sourced traffic to Wallarm Cloud servers and the load balancer
* NO network connectivity restrictions between servers in a Wallarm Cloud cluster instance

If you would like to use a standalone network load balancer in a cluster mode deployment, the above-mentioned incoming network connection rules should be rearranged to account for the load balancer.

!!! info "Air-gapped network is not supported yet"
    Please note that as for now, a Wallarm Cloud instance cannot be deployed in a fully [air-gapped network](https://en.wikipedia.org/wiki/Air_gap_(networking)).

### Capacity planning

There are several factors affecting the capacity planning for a Wallarm Cloud component deployment:

* Test or production deployment
* Whether the Wallarm's [API Sessions](../../api-sessions/overview.md) and [API Abuse Prevention](../../api-abuse-prevention/overview.md) features are used - the features require a lot of disk storage
* Traffic pattern of the protected API services - Is the traffic level steady over a 24-hour interval? Does the system experience high traffic during specific days of the week or holiday seasons?

The following are the minimum hardware requirements for each Wallarm Cloud node:

* At least 16 CPU cores
* At least 64GB of RAM
* SSD disk size and partitioning:

    * `/(root)` volume - at least 200 GB
    * `/var/lib/wallarm-storage` volume - at least 2.5 TB (can be a part of the root partition)

In a **test** (standalone) deployment, a single server with the above configuration is sufficient.

In a **production** (cluster) deployment, at least 3 servers with the same configuration are required.

With the above minimum configuration, a 3-node production cluster can process up to 1 billion API requests per month (RPM).

If your environment requires more capacity, you should scale each node per every additional 5 billion RPM by adding:

* 2 CPU cores
* 2 GB of RAM
* 100 GB of additional disk space

## Data backups and disaster recovery planning

Wallarm Cloud does not perform regular backups by default. For production deployments, it is strongly recommended to configure data backups.

There are the following options to back up a Wallarm Cloud deployment:

* For one-time backup and if the servers are provisioned using a virtualization platform like VMWare or similar, the customer can gracefully stop the servers and take disk snapshots/backups using tools provided by the virtualization platform.
* Deploy a standalone Wallarm Data Backup Server (WDBS) using the provided [MinIO](https://min.io/docs/minio/linux/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html) installation instructions and configure the Wallarm Cloud instance to perform daily backups to the backup server. Another option is to use any Amazon S3-compatible object storage.

Once Wallarm Cloud data is stored on the Data Backup Server, it will automatically rotate after **10 backup runs** (can be changed by the customer). The customer can optionally use an enterprise data backup system (like a disk or tape-based backup jukebox) to make additional backup copies for long-term or offsite storage.

For Disaster Recovery planning, Wallarm recommends to implement the following architecture:

* Deploy an additional Wallarm Cloud Disaster Recovery instance in the same **standalone** or **cluster** mode as the primary Wallarm Cloud instance, with the DR mode flag set to `true`.
* In the DR mode, the Wallarm Cloud instance will automatically restore on the instance all fresh data backups created on a daily basis by the primary Wallarm Cloud instance and sent to the Wallarm Data Backup Server.

    Note that the primary Wallarm Cloud instance will not send the data directly to the DR Wallarm Cloud instance, all data transfers are happening via the data backup server.  
* While the data is replicated to the DR site regularly (at least daily), the replication is not real-time.
* Normally, the DR site only runs the block storage system and does not run any databases or Wallarm Cloud software components, so the DR instance cannot offer any services without additional reconfiguration steps.

![!](../../images/waf-installation/on-premise/backup-dr.png)

Currently, Wallarm Cloud software does not support automatic failover to the DR site in case of the primary site outage. The following is a high-level overview of the manual DR failover process:

1. Confirm that the primary Wallarm Cloud instance is unavailable; shut down involved server instances if necessary.
1. On the DR instance, confirm that the data backup replication from the Data Backup Server has been successfully completed for the last backup run.
1. Using the **wctl** management tool, switch the DR instance from DR to primary mode. This procedure will introduce the following changes in the configuration of the DR instance:
   
    1. It will stop the data replication process from the Data Backup Server to the DR instance.
    1. It will start the necessary data store and Wallarm application components and finally transition the DR instance to the primary mode.
1. Reconfigure Wallarm filtering nodes to use the newly recovered Wallarm Cloud instance. This can be done using either of the following methods:

    1. Change all relevant DNS records to point their IP address from the old (destroyed) Wallarm Cloud instance to the new recovered instance.
    1. Reconfigure the filtering nodes to use the DNS names associated with the recovered Wallarm Cloud instance.

A well-planned and regularly tested Wallarm Cloud disaster recovery strategy may provide the following RTO and RPO parameters:

* RPO (Recovery Point Objective): 25 hours or less
* RTO (Recovery Time Objective): 1 hour or less

## Security hardening

We recommend following your enterprise security policies and practices while designing, deploying, and managing the Wallarm Cloud instance.

To keep your Wallarm Cloud instance secure, we recommend paying attention to the following aspects:

1. Disable incoming Internet access to all deployed Wallarm Cloud instances (production, staging, disaster recovery, etc.) and the Wallarm data backup server.  
2. Timely deploy OS security patches on all involved servers. Please note that OS patches are provided by OS vendors (RedHat, Ubuntu) and not by Wallarm.  
3. Timely deploy new Wallarm Cloud software releases provided by Wallarm.  
4. Use your existing enterprise security monitoring system (agents) to monitor all involved servers for suspicious activity.  
5. Integrate the Wallarm Cloud service with your enterprise SIEM and notification escalation services to collect and handle important security events generated by the Wallarm software in a timely manner.  
6. Control and periodically review who has access and with what permissions to the Wallarm node servers and the Console UI.
