# Self-Hosted Deployment Options

In a self-hosted deployment, you are responsible for installing and operating the **[Wallarm Node](../about-wallarm/overview.md#filtering-node) within your infrastructure** - on Kubernetes clusters, virtual machines, or cloud environments. This gives you full control over configuration, networking, and scaling.

Wallarm supports many deployment options enabling you to seamlessly integrate the platform with your environment. Learn the options and choose the most appropriate one from this document.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Kubernetes

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>Deploy the NGINX Ingress Controller with integrated Wallarm services</p>
        </a>

        <a class="do-card" href="../../installation/oob/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF</h3>
            <p>Out-of-band deployment on Kubernetes using the eBPF technology</p>
        </a>
    </div>
</div>

## Public clouds

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

        <a class="do-card" href=../../installation/heroku/docker-image/>
            <img class="non-zoomable" src="../../images/platform-icons/heroku.svg" />
            <h3>Heroku</h3>
            <p>Build a Wallarm Docker image and run it on Heroku</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/aws/ami/">
            <h3>AMI</h3>
            <p>Use the official Amazon Machine Image to deploy Wallarm</p>
        </a>

        <a class="do-card" href="../../installation/cloud-platforms/aws/docker-container/">
            <h3>ECS</h3>
            <p>Use the Docker image to deploy Wallarm with Elastic Container Service</p>
        </a>

        <div id="public-clouds-aws-terraform" class="do-card">
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment</p>
        </div>
    </div>

    <div class="do-nested" data-for="public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/aws/terraform-module/proxy-in-aws-vpc/">
            <h3>Proxy in AWS VPC</h3>
            <p>Wallarm as proxy in AWS Virtual Private Cloud</p>
        </a>

        <a class="do-card" href="../../installation/cloud-platforms/aws/terraform-module/proxy-for-aws-api-gateway/">
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

        <a class="do-card" href="../../installation/cloud-platforms/gcp/machine-image/">
            <h3>Machine Image</h3>
            <p>Use the official Google Cloud Machine Image to deploy Wallarm</p>
        </a>

        <a class="do-card" href="../../installation/cloud-platforms/gcp/docker-container/">
            <h3>GCE</h3>
            <p>Use the Docker image to deploy Wallarm with Google Compute Engine</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-azure">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Artifacts for Wallarm deployment on Microsoft Azure</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/azure/docker-container/">
            <h3>Azure Container Instances</h3>
            <p>Use the Docker image to deploy Wallarm with Azure Container Instances</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-alibaba">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for Wallarm deployment on Alibaba Cloud</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/alibaba-cloud/docker-container/">
            <h3>ECS</h3>
            <p>Use the Docker image to deploy Wallarm with Elastic Compute Service</p>
        </a>
    </div>
</div>

## API gateways

Choose an API gateway connector if traffic already flows through a gateway and you want to add protection alongside it.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Secure APIs managed with Layer7 API Gateways</p>
        </a>

        <a class="do-card" href="../../installation/connectors/kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong API Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by Kong API Gateway</p>
        </a>
    </div>
</div>

## CDN

Choose a CDN or edge integration if your traffic is fronted by a CDN and you want protection at the edge.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Secure APIs running on Akamai EdgeWorkers</p>
        </a>

        <a class="do-card" href="../../installation/connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Deploy Wallarm to secure traffic delivered through Amazon CloudFront</p>
        </a>

        <a class="do-card" href="../../installation/connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Secure APIs running on Azion Edge</p>
        </a>

        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Deploy Wallarm to secure traffic running via Cloudflare</p>
        </a>

        <a class="do-card" href="../../installation/connectors/fastly/">
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
        <a class="do-card" href="../../installation/connectors/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>MuleSoft</h3>
            <p>Deploy Wallarm to secure APIs managed by MuleSoft</p>
        </a>

        <a class="do-card" href="../../installation/connectors/ibm-api-connect/">
            <img class="non-zoomable" src="../../images/platform-icons/ibm-api-connect.svg" />
            <h3>IBM API Connect</h3>
            <p>Deploy Wallarm to secure APIs managed through IBM API Connect</p>
        </a>
    </div>
</div>

## Packages & containers

Choose packages or containers if you run on VMs or bare metal and prefer them over managed options.

<div class="do-section">
    <div class="do-main">

        <div id="packages-nginx-node" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/nginx.svg">
            <h3>NGINX Node</h3>
            <p>Node for infrastructures that rely on NGINX</p>
        </div>

        <div id="packages-native-node" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/native-node.svg">
            <h3>Native Node</h3>
            <p>Self-hosted node for connectors or TCP traffic</p>
        </div>

    </div>

    <div class="do-nested" data-for="packages-nginx-node">

        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/nginx.svg">
            <h3>NGINX Node</h3>
            <p>Node for infrastructures that rely on NGINX</p>
        </div>

        <a class="do-card" href="../../installation/nginx/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>

        <a class="do-card" href="../../admin-en/installation-docker-en/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker image (NGINX)</h3>
            <p>Use the NGINX-based Docker image for Wallarm deployment</p>
        </a>

        <div id="packages-cloud-images" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/cloud.svg" />
            <h3>Cloud images</h3>
            <p>Machine Images to deploy Wallarm on public clouds</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/aws/terraform-module/overview/">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment on AWS</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-cloud-images">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/cloud.svg" />
            <h3>Cloud images</h3>
            <p>Machine Images to deploy Wallarm on public clouds</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/aws/ami/">
            <h3>AWS AMI</h3>
            <p>Use the official Machine Image to deploy Wallarm on AWS</p>
        </a>

        <a class="do-card" href="../../installation/cloud-platforms/gcp/machine-image/">
            <h3>GCP Machine image</h3>
            <p>Use the official Machine Image to deploy Wallarm on Google Cloud</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-native-node">

        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/native-node.svg">
            <h3>Native Node</h3>
            <p>Self-hosted node for connectors or TCP traffic</p>
        </div>

        <a class="do-card" href="../../installation/native-node/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Run the Native Node on a virtual machine on Linux</p>
        </a>

        <a class="do-card" href="../../installation/native-node/helm-chart/">
            <img class="non-zoomable" src="../../images/platform-icons/helm.svg" />
            <h3>Helm chart</h3>
            <p>Run the Native Node in an infrastructure utilizing K8s</p>
        </a>

        <a class="do-card" href="../../installation/native-node/docker-image/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker image</h3>
            <p>Run the Native Node in a containerized environment using Docker</p>
        </a>
    </div>


</div>

## On-premise

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/on-premise/overview/">
            <img class="non-zoomable" src="../../images/platform-icons/on-premise.svg" />
            <h3>On-Premise</h3>
            <p>Host both Wallarm Nodes and the Wallarm Cloud within your environment</p>
        </a>
    </div>
</div>

## Special setups

Deployment options that don't follow the platform matrix: known scenarios (multi-tenant, separate postanalytics, custom NGINX) and custom requests when nothing above fits.

<div class="do-section">
    <div class="do-main">
        <a class="do-card do-card-no-icon" href="../../installation/multi-tenant/overview/">
            <h3>Multi-tenant Node deployment</h3>
            <p>Run Nodes for multiple tenants with per-account data and access isolation, ideal for SaaS and MSPs</p>
        </a>

        <a class="do-card do-card-no-icon" href="../../admin-en/installation-postanalytics-en/">
            <h3>Separate postanalytics</h3>
            <p>Deploy postanalytics on a dedicated host to scale independently and offload the Filtering Node</p>
        </a>

        <a class="do-card do-card-no-icon" href="../../installation/custom/custom-nginx-version/">
            <h3>Custom NGINX version</h3>
            <p>Use Wallarm with a custom NGINX build when standard packages do not match your stack</p>
        </a>

        <a class="do-card" href="../../installation/custom/request-custom-deployment/">
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
