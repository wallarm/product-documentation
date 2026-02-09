# Wallarm Node Deployment Options

Wallarm supports multiple deployment models — from Security Edge and Kubernetes to cloud VMs and API gateways. Choose by **who hosts the [Node](../about-wallarm/overview.md#filtering-node)**, **where your traffic lives**, and whether you need **inline** or **out-of-band** protection.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Security Edge

Fully managed at the edge: no Node to run. Traffic goes to Wallarm’s edge, is filtered, and forwarded to your origin. Choose Security Edge for zero-infrastructure API security.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../security-edge/inline/overview/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-inline.svg" />
            <h3>Security Edge Inline</h3>
            <p>Point traffic to Wallarm via CNAME for real-time filtering</p>
        </a>

        <a class="do-card" href="../security-edge/se-connector/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-connectors.svg" />
            <h3>Security Edge Connector</h3>
            <p>Connect Edge Node to your API gateway, CDN, or API management platform</p>
        </a>
    </div>
</div>

## Kubernetes

Choose a Kubernetes option if your APIs run in-cluster and you want in-cluster protection or a connector to your mesh/gateway.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>gRPC-based external processing filter for Istio-managed APIs</p>
        </a>

        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>Deploy the NGINX Ingress Controller with integrated Wallarm services</p>
        </a>

        <a class="do-card" href="../connectors/kong-ingress-controller/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong Ingress Controller</h3>
            <p>Deploy Wallarm to secure APIs managed by Kong Ingress Controller</p>
        </a>

        <a class="do-card" href="../native-node/helm-chart/">
            <img class="non-zoomable" src="../../images/platform-icons/helm.svg" />
            <h3>Helm Chart for Native Node</h3>
            <p>Run the Native Node in Kubernetes (for connectors and Istio filter)</p>
        </a>

        <a class="do-card" href="../kubernetes/sidecar-proxy/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar Proxy</h3>
            <p>Deploy Wallarm Sidecar controller for pod security</p>
        </a>

        <a class="do-card" href="../oob/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF (out-of-band)</h3>
            <p>Out-of-band deployment on Kubernetes using the eBPF technology</p>
        </a>
    </div>
</div>

## Cloud platforms

Choose a cloud option if you run in a public or private cloud and want ready-to-use artifacts (AMIs, Docker, Terraform, etc.).

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

        <a class="do-card" href="../heroku/docker-image/">
            <img class="non-zoomable" src="../../images/platform-icons/heroku.svg" />
            <h3>Heroku</h3>
            <p>Build a Wallarm Docker image and run it on Heroku</p>
        </a>

        <a class="do-card" href="../cloud-platforms/private-cloud/">
            <img class="non-zoomable" src="../../images/platform-icons/on-premise.svg" />
            <h3>Private Cloud</h3>
            <p>Deploy Wallarm in a private or hybrid cloud</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="../inline/compute-instances/aws/aws-ami/">
            <h3>AMI for NGINX Node</h3>
            <p>Use the official Amazon Machine Image for NGINX Node (in-line)</p>
        </a>

        <a class="do-card" href="../native-node/aws-ami/">
            <h3>AMI for Native Node</h3>
            <p>Use the official Amazon Machine Image for Native Node (connectors)</p>
        </a>

        <a class="do-card" href="../cloud-platforms/aws/docker-container/">
            <h3>Docker on ECS</h3>
            <p>Use the Docker image with Elastic Container Service</p>
        </a>

        <div id="public-clouds-aws-terraform" class="do-card">
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment on AWS</p>
        </div>
    </div>

    <div class="do-nested" data-for="public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="../cloud-platforms/aws/terraform-module/overview/">
            <h3>Overview</h3>
            <p>Terraform module for Wallarm on AWS</p>
        </a>

        <a class="do-card" href="../cloud-platforms/aws/terraform-module/proxy-in-aws-vpc/">
            <h3>Proxy in AWS VPC</h3>
            <p>Wallarm as proxy in AWS Virtual Private Cloud</p>
        </a>

        <a class="do-card" href="../cloud-platforms/aws/terraform-module/proxy-for-aws-api-gateway/">
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

        <a class="do-card" href="../inline/compute-instances/gcp/machine-image/">
            <h3>Machine Image for NGINX Node</h3>
            <p>Use the official Google Cloud Machine Image for NGINX Node</p>
        </a>

        <a class="do-card" href="../cloud-platforms/gcp/docker-container/">
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

        <a class="do-card" href="../cloud-platforms/azure/docker-container/">
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

        <a class="do-card" href="../cloud-platforms/alibaba-cloud/docker-container/">
            <h3>Docker on ECS</h3>
            <p>Use the Docker image with Alibaba Elastic Compute Service</p>
        </a>
    </div>
</div>

## API gateways

Choose an API gateway connector if traffic already flows through a gateway and you want to add protection alongside it.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../connectors/aws-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-api-gateway.svg" />
            <h3>Amazon API Gateway</h3>
            <p>Deploy Wallarm to build an API inventory from CloudWatch logs</p>
        </a>

        <a class="do-card" href="../connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Secure APIs managed with Layer7 API Gateways</p>
        </a>

        <a class="do-card" href="../connectors/standalone-kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Standalone Kong API Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by standalone Kong API Gateway</p>
        </a>
    </div>
</div>

## CDN

Choose a CDN or edge integration if your traffic is fronted by a CDN and you want protection at the edge.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../connectors/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Secure APIs running on Akamai EdgeWorkers</p>
        </a>

        <a class="do-card" href="../connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Deploy Wallarm to secure traffic delivered through Amazon CloudFront</p>
        </a>

        <a class="do-card" href="../connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Secure APIs running on Azion Edge</p>
        </a>

        <a class="do-card" href="../connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Deploy Wallarm to secure traffic running via Cloudflare</p>
        </a>

        <a class="do-card" href="../connectors/fastly/">
            <img class="non-zoomable" src="../../images/platform-icons/fastly.png" />
            <h3>Fastly</h3>
            <p>Deploy Wallarm to secure APIs running on Fastly</p>
        </a>
    </div>
</div>

## API management platform

Choose an API management connector if you expose APIs through one of these platforms and want to add security without changing it.

<div class="do-section">
    <div class="do-main">
        <div id="apim-mulesoft" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>Mulesoft</h3>
            <p>Use Wallarm Node to secure APIs managed by Mulesoft</p>
        </div>

        <a class="do-card" href="../connectors/azure-api-management/">
            <img class="non-zoomable" src="../../images/platform-icons/azure-apim.svg" />
            <h3>Azure API Management</h3>
            <p>Deploy Wallarm to secure APIs managed by Azure API Management</p>
        </a>

        <a class="do-card" href="../connectors/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Secure APIs running on Apigee</p>
        </a>

        <a class="do-card" href="../connectors/ibm-api-connect/">
            <img class="non-zoomable" src="../../images/platform-icons/ibm-api-connect.svg" />
            <h3>IBM API Connect</h3>
            <p>Deploy Wallarm to secure APIs managed through IBM API Connect</p>
        </a>
    </div>

    <div class="do-nested" data-for="apim-mulesoft">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>Mulesoft</h3>
            <p>Use Wallarm Node to secure APIs managed by Mulesoft</p>
        </div>

        <a class="do-card" href="../connectors/mulesoft-flex/">
            <h3>MuleSoft Flex Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by the Flex Gateway</p>
        </a>

        <a class="do-card" href="../connectors/mulesoft/">
            <h3>MuleSoft Mule Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by the Mule Gateway</p>
        </a>
    </div>
</div>

## TCP traffic mirror

Deploy the Wallarm Node for TCP traffic mirror analysis when you need out-of-band analysis of network-layer mirrored traffic. Wallarm analyzes TCP streams for attack observation without affecting production flow.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCP Traffic Mirror</h3>
            <p>Out-of-band deployment for TCP traffic mirror analysis</p>
        </a>
    </div>
</div>

## Packages & Containers

Choose packages or containers if you run on VMs or bare metal and prefer them over managed options.

<div class="do-section">
    <div class="do-main">
        <div id="packages-linux" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Linux OS</h3>
            <p>Let Wallarm detect your OS version to install the appropriate modules</p>
        </div>

        <div id="containers-docker" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker</h3>
            <p>Use the NGINX-based or Native Node Docker image for Wallarm deployment</p>
        </div>
    </div>

    <div class="do-nested" data-for="packages-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Linux OS</h3>
            <p>Install Wallarm on Linux</p>
        </div>

        <a class="do-card" href="../nginx/all-in-one/">
            <h3>All-in-one installer for NGINX Node</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>

        <a class="do-card" href="../native-node/all-in-one/">
            <h3>All-in-one installer for Native Node</h3>
            <p>Run the Native Node on a virtual machine on Linux (connectors and TCP mirror)</p>
        </a>
    </div>

    <div class="do-nested" data-for="containers-docker">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker</h3>
            <p>Run Wallarm in containers</p>
        </div>

        <a class="do-card" href="../../admin-en/installation-docker-en/">
            <h3>Image for NGINX Node</h3>
            <p>Use the NGINX-based Docker image for Wallarm deployment</p>
        </a>

        <a class="do-card" href="../native-node/docker-image/">
            <h3>Image for Native Node</h3>
            <p>Run the Native Node in a containerized environment using Docker (connectors and TCP mirror)</p>
        </a>
    </div>
</div>

## On-premise

Run the full stack (Nodes + Cloud) in your datacenter. Choose On-Premise for compliance, data residency, or internal policy.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../on-premise/overview/">
            <img class="non-zoomable" src="../../images/platform-icons/on-premise.svg" />
            <h3>On-Premise</h3>
            <p>Host both Wallarm Nodes and the Wallarm Cloud within your environment</p>
        </a>
    </div>
</div>

## Special setups

Deployment options that don’t follow the platform matrix: known scenarios (multi-tenant, separate postanalytics, custom NGINX) and custom requests when nothing above fits.

<div class="do-section">
    <div class="do-main">
        <a class="do-card do-card-no-icon" href="../multi-tenant/overview/">
            <h3>Multi-tenant Node deployment</h3>
            <p>Run Nodes for multiple tenants with per-account data and access isolation, ideal for SaaS and MSPs</p>
        </a>

        <a class="do-card do-card-no-icon" href="../../admin-en/installation-postanalytics-en/">
            <h3>Separate postanalytics</h3>
            <p>Deploy postanalytics on a dedicated host to scale independently and offload the Filtering Node</p>
        </a>

        <a class="do-card do-card-no-icon" href="../custom/custom-nginx-version/">
            <h3>Custom NGINX version</h3>
            <p>Use Wallarm with a custom NGINX build when standard packages do not match your stack</p>
        </a>

        <a class="do-card" href="../custom/request-custom-deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/custom-deployment.svg" />
            <h3>Request custom deployment</h3>
            <p>Need something else? Request a custom deployment or integration</p>
        </a>
    </div>
</div>

## Related documentation

* [Inline traffic flow](inline/overview.md)
* [Out-of-band traffic flow](oob/overview.md)
* [NGINX and Native Node overview](nginx-native-node-internals.md)
* [Connector overview](connectors/overview.md)

<script src="/supported-platforms.min.js?v=1"></script>
