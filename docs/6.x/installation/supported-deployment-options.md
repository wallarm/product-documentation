# Wallarm Node Deployment Options

Wallarm supports multiple deployment models so you can protect APIs and applications in the environment you already run — from Security Edge and Kubernetes to cloud VMs, API gateways, and edge platforms.

Use this page to quickly choose the right option based on **who hosts the node**, **where your traffic lives**, and whether you need **inline** protection or **out-of-band** analysis.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Security Edge

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="security-edge/overview/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-inline.svg" />
            <h3>Security Edge</h3>
            <p>Overview of the Security Edge deployment model</p>
        </a>

        <a class="do-card" href="security-edge/inline/overview/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-inline.svg" />
            <h3>Security Edge Inline</h3>
            <p>Real-time traffic is redirected through the Edge Node, filtered, and forwarded to your origin</p>
        </a>

        <a class="do-card" href="security-edge/se-connector/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-connectors.svg" />
            <h3>Security Edge Connector</h3>
            <p>Connect the Edge Node to your API platform for asynchronous analysis or real-time blocking</p>
        </a>
    </div>
</div>

## Kubernetes

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>Deploy the NGINX Ingress Controller with integrated Wallarm services</p>
        </a>

        <a class="do-card" href="kubernetes/sidecar-proxy/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar Proxy</h3>
            <p>Deploy Wallarm Sidecar controller for pod security</p>
        </a>

        <a class="do-card" href="oob/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF (out-of-band)</h3>
            <p>Out-of-band deployment on Kubernetes using the eBPF technology</p>
        </a>

        <a class="do-card" href="connectors/kong-ingress-controller/">
            <img class="non-zoomable" src="../../images/platform-icons/kong.svg" />
            <h3>Kong Ingress Controller</h3>
            <p>Deploy Wallarm with Kong Ingress Controller</p>
        </a>

        <a class="do-card" href="connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>gRPC-based external processing filter for Istio-managed APIs</p>
        </a>

        <a class="do-card" href="native-node/helm-chart/">
            <img class="non-zoomable" src="../../images/platform-icons/helm.svg" />
            <h3>Helm Chart for Native Node</h3>
            <p>Run the Native Node in Kubernetes (connectors, Kong, Istio)</p>
        </a>
    </div>
</div>

## Cloud Platforms

<div class="do-section">
    <div class="do-main">
        <div id="public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm deployment on AWS</p>
        </div>

        <div id="public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Artifacts for Wallarm deployment on GCP</p>
        </div>

        <div id="public-clouds-azure" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Artifacts for Wallarm deployment on Microsoft Azure</p>
        </div>

        <div id="public-clouds-alibaba" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for Wallarm deployment on Alibaba Cloud</p>
        </div>

        <a class="do-card" href="heroku/docker-image/">
            <img class="non-zoomable" src="../../images/platform-icons/heroku.svg" />
            <h3>Heroku</h3>
            <p>Build a Wallarm Docker image and run it on Heroku</p>
        </a>

        <a class="do-card" href="cloud-platforms/private-cloud/">
            <img class="non-zoomable" src="../../images/platform-icons/on-premise.svg" />
            <h3>Private Cloud</h3>
            <p>Deploy Wallarm in a private or hybrid cloud</p>
        </a>

        <a class="do-card" href="cloud-platforms/cloud-init/">
            <h3>Cloud-Init Script</h3>
            <p>Use Cloud-Init for automated node deployment</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="inline/compute-instances/aws/aws-ami/">
            <h3>AMI for NGINX Node</h3>
            <p>Use the official Amazon Machine Image for NGINX Node</p>
        </a>

        <a class="do-card" href="native-node/aws-ami/">
            <h3>AMI for Native Node</h3>
            <p>Use the official Amazon Machine Image for Native Node</p>
        </a>

        <a class="do-card" href="cloud-platforms/aws/docker-container/">
            <h3>Docker on ECS</h3>
            <p>Use the Docker image with Elastic Container Service</p>
        </a>

        <div id="public-clouds-aws-terraform" class="do-card">
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="cloud-platforms/aws/aws-waf-integration/">
            <h3>AWS WAF Integration</h3>
            <p>Integrate Wallarm with AWS WAF</p>
        </a>

        <a class="do-card" href="cloud-platforms/aws/costs/">
            <h3>Cost Estimation</h3>
            <p>Estimate deployment costs on AWS</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="cloud-platforms/aws/terraform-module/overview/">
            <h3>Overview</h3>
            <p>Terraform module for Wallarm on AWS</p>
        </a>

        <a class="do-card" href="cloud-platforms/aws/terraform-module/proxy-in-aws-vpc/">
            <h3>Proxy in AWS VPC</h3>
            <p>Wallarm as proxy in AWS Virtual Private Cloud</p>
        </a>

        <a class="do-card" href="cloud-platforms/aws/terraform-module/proxy-for-aws-api-gateway/">
            <h3>Proxy for Amazon API Gateway</h3>
            <p>Wallarm as proxy for Amazon API Gateway protection</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Artifacts for Wallarm deployment on GCP</p>
        </div>

        <a class="do-card" href="inline/compute-instances/gcp/machine-image/">
            <h3>Machine Image for NGINX Node</h3>
            <p>Use the official Google Cloud Machine Image for NGINX Node</p>
        </a>

        <a class="do-card" href="cloud-platforms/gcp/docker-container/">
            <h3>Docker on GCE</h3>
            <p>Use the Docker image with Google Compute Engine</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-azure">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Artifacts for Wallarm deployment on Microsoft Azure</p>
        </div>

        <a class="do-card" href="cloud-platforms/azure/docker-container/">
            <h3>Azure Container Instances</h3>
            <p>Use the Docker image with Azure Container Instances</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-alibaba">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for Wallarm deployment on Alibaba Cloud</p>
        </div>

        <a class="do-card" href="cloud-platforms/alibaba-cloud/docker-container/">
            <h3>Docker on ECS</h3>
            <p>Use the Docker image with Alibaba Elastic Compute Service</p>
        </a>
    </div>
</div>

## API Gateways

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="connectors/aws-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>AWS API Gateway</h3>
            <p>Connect Wallarm to AWS API Gateway</p>
        </a>

        <a class="do-card" href="connectors/layer7-api-gateway/">
            <h3>Broadcom Layer7</h3>
            <p>Connect Wallarm to Broadcom Layer7 API Gateway</p>
        </a>

        <a class="do-card" href="connectors/standalone-kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong.svg" />
            <h3>Kong API Gateway</h3>
            <p>Connect Wallarm to Kong API Gateway</p>
        </a>
    </div>
</div>

## CDN

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="connectors/akamai-edgeworkers/">
            <h3>Akamai EdgeWorkers</h3>
            <p>Deploy Wallarm with Akamai EdgeWorkers</p>
        </a>

        <a class="do-card" href="connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>AWS Lambda</h3>
            <p>Deploy Wallarm with AWS Lambda@Edge</p>
        </a>

        <a class="do-card" href="connectors/azion-edge/">
            <h3>Azion Edge</h3>
            <p>Deploy Wallarm with Azion Edge</p>
        </a>

        <a class="do-card" href="connectors/cloudflare/">
            <h3>Cloudflare</h3>
            <p>Deploy Wallarm with Cloudflare Workers</p>
        </a>

        <a class="do-card" href="connectors/fastly/">
            <h3>Fastly</h3>
            <p>Deploy Wallarm with Fastly</p>
        </a>
    </div>
</div>

## API Management Platform

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="connectors/mulesoft-flex/">
            <h3>MuleSoft Flex API Gateway</h3>
            <p>Connect Wallarm to MuleSoft Flex Gateway</p>
        </a>

        <a class="do-card" href="connectors/mulesoft/">
            <h3>MuleSoft Mule API Gateway</h3>
            <p>Connect Wallarm to MuleSoft Mule Gateway</p>
        </a>

        <a class="do-card" href="connectors/azure-api-management/">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Azure API Management</h3>
            <p>Connect Wallarm to Azure API Management</p>
        </a>

        <a class="do-card" href="connectors/apigee/">
            <h3>Apigee</h3>
            <p>Connect Wallarm to Google Apigee</p>
        </a>

        <a class="do-card" href="connectors/ibm-api-connect/">
            <h3>IBM API Connect</h3>
            <p>Connect Wallarm to IBM API Connect</p>
        </a>
    </div>
</div>

## Packages & Containers

### Linux OS

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="nginx/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer for NGINX Node</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>

        <a class="do-card" href="native-node/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer for Native Node</h3>
            <p>Run the Native Node on a virtual machine on Linux</p>
        </a>
    </div>
</div>

### Docker

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../admin-en/installation-docker-en/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Image for NGINX Node</h3>
            <p>Use the NGINX-based Docker image for Wallarm deployment</p>
        </a>

        <a class="do-card" href="native-node/docker-image/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Image for Native Node</h3>
            <p>Run the Native Node in a containerized environment using Docker</p>
        </a>
    </div>
</div>

### TCP Traffic Mirror

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCP Traffic Mirror</h3>
            <p>Out-of-band deployment for TCP traffic mirror analysis</p>
        </a>
    </div>
</div>

## On-Premise

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="on-premise/overview/">
            <img class="non-zoomable" src="../../images/platform-icons/on-premise.svg" />
            <h3>On-Premise</h3>
            <p>Host both Wallarm Nodes and the Wallarm Cloud within your environment</p>
        </a>

        <a class="do-card" href="on-premise/deployment/">
            <h3>Deployment</h3>
            <p>Deploy Wallarm in your on-premise environment</p>
        </a>

        <a class="do-card" href="on-premise/maintenance/">
            <h3>Maintenance</h3>
            <p>Maintain and update your on-premise deployment</p>
        </a>
    </div>
</div>

## Multi-Tenant

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="multi-tenant/overview/">
            <h3>Multi-Tenant Overview</h3>
            <p>Deploy a single node serving multiple Wallarm accounts</p>
        </a>

        <a class="do-card" href="multi-tenant/configure-accounts/">
            <h3>Configure Accounts</h3>
            <p>Configure tenant accounts for the multi-tenant node</p>
        </a>

        <a class="do-card" href="multi-tenant/deploy-multi-tenant-node/">
            <h3>Deploy Multi-Tenant Node</h3>
            <p>Deploy and configure the multi-tenant node</p>
        </a>
    </div>
</div>

## Custom Deployment

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="custom/request-custom-deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/custom-deployment.svg" />
            <h3>Custom Deployment</h3>
            <p>Can't find what you need? Let's discuss a custom solution</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>
