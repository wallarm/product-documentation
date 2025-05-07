[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md

# Deploying the Native Node with AWS AMI

The [Wallarm Native Node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for Wallarm connector self-hosted deployment and TCP traffic mirror analysis. You can run the Native Node on an AWS instance using the [AWS AMI](https://aws.amazon.com/marketplace/pp/prodview-3d5ne4ruxm6j6).

The AMI is based on Debian 12 and includes the all-in-one installer. This installer is the Wallarm script used to deploy and configure the Node. After launching an instance from the AMI, you will execute this script to complete the installation.

Deploying the Wallarm Node from the AMI on AWS typically takes around 10 minutes.

!!! info "Security note"
    This solution is designed to follow AWS security best practices. We recommend avoiding the use of the AWS root account for deployment. Instead, use IAM users or roles with only the necessary permissions.

    The deployment process assumes the principle of least privilege, granting only the minimal access required to provision and operate Wallarm components.

For guidance on estimating AWS infrastructure costs for this deployment, see the [Cost Guidance for Deploying Wallarm in AWS](../cloud-platforms/aws/costs.md) page.

## Use cases and deployment modes

* When deploying a Wallarm node as part of a connector solution for [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md) on AWS.

    Run the image in `connector-server` mode.
* When you need a security solution for [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md) and your infrastructure resides on AWS.
    
    Run the image in `tcp-capture` mode.

## Requirements

* An AWS account
* Understanding of AWS EC2, Security Groups
* Any AWS region of your choice, there are no specific restrictions on the region for the Wallarm node deployment

    Wallarm supports both single availability zone (AZ) and multi availability zone deployments. In multi-AZ setups, Wallarm Nodes can be launched in separate availability zones and placed behind a Load Balancer for high availability.
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Executing all commands on a Wallarm EC2 instance as a superuser (e.g. `root`)
* When running the node in the `connector-server` mode, a **trusted** SSL/TLS certificate for the machine's domain should be issued and uploaded to the machine along with the private key
* When running the node in the `tcp-capture` mode:
    
    * Traffic and response mirroring must be configured with both source and target set up, and the prepared instance chosen as a mirror target. Specific environment requirements must be met, such as allowing specific protocols for traffic mirroring configurations.
    * Mirrored traffic is tagged with either VLAN (802.1q), VXLAN, or SPAN.

## Limitations

* When using the Node in `connector-server` mode, a **trusted** SSL/TLS certificate is required for the machine's domain. Self-signed certificates are not yet supported.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Installation

### 1. Launch a Wallarm Node instance

Launch an EC2 instance using the [Wallarm Native Node AMI](https://aws.amazon.com/marketplace/pp/prodview-3d5ne4ruxm6j6).

Recommended configuration:

* Latest available [AMI version](../../updating-migrating/native-node/node-artifact-versions.md#amazon-machine-image-ami)
* Any preferred AWS region
* EC2 instance type: medium or large (recommended)
* Appropriate [VPC and subnet](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) based on your infrastructure
* [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) inbound access to the port defined in the [Node configuration](#4-prepare-the-configuration-file)
* [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) outbound access to:

    * `https://meganode.wallarm.com` to download the Wallarm installer
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* SSH key pair for accessing the instance

### 2. Connect to the Node instance via SSH

[Use the selected SSH key](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html) to connect to your running EC2 instance:

```bash
ssh -i <your-key.pem> admin@<your-ec2-public-ip>
```

You need to use the `admin` username to connect to the instance.

### 3. Prepare Wallarm token

To register the Node in the Wallarm Cloud, you need an API token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create API token with the `Node deployment/Deployment` usage type.
1. Copy this token.

### 4. Prepare the configuration file

On the EC2 instance, create a file named `wallarm-node-conf.yaml` with one of the following minimal configurations:

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    In the `connector.tls_cert` and `connector.tls_key`, you specify the paths to a **trusted** certificate and private key issued for the machine's domain. They should be mounted to the instance.
=== "tcp-capture"
    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: 'enp7s0:'
      extra_args:
        - -input-raw-engine
        - vxlan
    ```

    In the `goreplay.filter` parameter, you specify the network interface to capture traffic from. To check network interfaces available on the host:

    ```
    ip addr show
    ```

[All configuration parameters](all-in-one-conf.md)

### 5. Run the Node installation script

On the EC2 instance, execute the installer:

=== "connector-server"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=./wallarm-node-conf.yaml --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=./wallarm-node-conf.yaml --host api.wallarm.com
    ```
=== "tcp-capture"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=./wallarm-node-conf.yaml --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=./wallarm-node-conf.yaml --host api.wallarm.com
    ```

* The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).
* `<API_TOKEN>` specifies the generated API token for the `Node deployment/Deployment` usage type.
* `--go-node-config` specifies the path to the configuration file prepared before.

The provided configuration file will be copied to the path: `/opt/wallarm/etc/wallarm/go-node.yaml`.

If needed, you can change the copied file after the installation is finished. To apply the changes, you will need to restart the Wallarm service with `sudo systemctl restart wallarm`.

### 6. Finish the installation

=== "connector-server"
    After deploying the node, the next step is to apply the Wallarm code to your API management platform or service in order to route traffic to the deployed node.

    1. Contact sales@wallarm.com to obtain the Wallarm code bundle for your connector.
    1. Follow the platform-specific instructions to apply the bundle on your API management platform:

        * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly) 
=== "tcp-capture"
    [Proceed to the deployment testing](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution).

## Verifying the node operation

To verify the node is detecting traffic, you can check the logs:

* The Native Node logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default.
* [Standard logs](../../admin-en/configure-logging.md) of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.

For additional debugging, set the [`log.level`](all-in-one-conf.md#loglevel) parameter to `debug`.

## Installer launch options

The AMI includes an installer script with the following launch options:

* Get **help** on the script with:

    ```
    sudo ./aio-native-0.14.0.x86_64.sh -- --help
    ```
* Run the installer in an **interactive** mode and choose the required mode in the 1st step:

    ```
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh
    ```
* <a name="apid-only-mode"></a>You can use the node in API Discovery-only mode. In this mode, attacks - including those detected by the Node's built-in mechanisms and those requiring additional configuration (e.g., credential stuffing, API specification violation attempts, and malicious activity from denylisted and graylisted IPs) - are detected and blocked locally (if enabled) but not exported to Wallarm Cloud. Since there is no attack data in the Cloud, [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md) does not work. Traffic from whitelisted IPs is allowed.

    Meanwhile, [API Discovery](../../api-discovery/overview.md), [API session tracking](../../api-sessions/overview.md), and [security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) remain fully functional, detecting relevant security entities and uploading them to the Cloud for visualization.

    This mode is for those who want to review their API inventory and identify sensitive data first, and plan controlled attack data export accordingly. However, disabling attack export is rare, as Wallarm securely processes attack data and provides [sensitive attack data masking](../../user-guides/rules/sensitive-data-rule.md) if needed.

    To enable API Discovery-only mode:

    1. Create or modify the `/etc/wallarm-override/env.list` file:

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim /etc/wallarm-override/env.list
        ```

        Add the following variable:

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. Follow the [node installation procedure](#installation).

    With the API Discovery-only mode enabled, the `/opt/wallarm/var/log/wallarm/wcli-out.log` log returns the following message:

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

<!-- ## Upgrade and reinstallation

To upgrade the node, follow the [instructions](../../updating-migrating/native-node/all-in-one.md). -->
