# Deployment Options

Wallarm supports many deployment options enabling you to seamlessly integrate the platform with your environment without its modification. Learn the Wallarm deployment options and choose the most appropriate one from this document.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Edge

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/cdn-node/">
            <img class="non-zoomable" src="../../images/platform-icons/section-io.svg" />
            <h3>Section.io</h3>
            <p>Deploy Wallarm node on Section.io without third-party components in your infrastructure</p>
        </a>

        <a class="do-card" href="../../installation/cdn/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Deploy Wallarm to secure APIs running on Akamai EdgeWorkers</p>
        </a>

        <a class="do-card" href="../../installation/cdn/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Deploy Wallarm to secure APIs running on Azion Edge</p>
        </a>
        
        <a class="do-card" href="../../installation/cdn/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Deploy Wallarm to secure traffic delivered through Amazon CloudFront</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Deploy Wallarm to secure traffic running via Cloudflare</p>
        </a>
    </div>
</div>

## API gateways

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/api-gateways/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>Mulesoft</h3>
            <p>Deploy Wallarm to secure APIs deployed on the MuleSoft Anypoint platform</p>
        </a>

        <a class="do-card" href="../../installation/api-gateways/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Deploy Wallarm to secure APIs running on Apigee</p>
        </a>

        <a class="do-card" href="../../installation/api-gateways/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Deploy Wallarm to secure APIs managed with Layer7 API Gateways</p>
        </a>
    </div>
</div>

## Kubernetes

<div class="do-section">
    <div class="do-main">
        <div id="kubernetes-ingress" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>Ingress</h3>
            <p>Wallarm solutions for Ingress load balancing and security</p>
        </div>

        <a class="do-card" href="../../installation/kubernetes/sidecar-proxy/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar</h3>
            <p>Deploy Wallarm Sidecar controller for pod security</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF</h3>
            <p>Out-of-band deployment on Kubernetes using the eBPF technology</p>
        </a>
    </div>

    <div class="do-nested" data-for="kubernetes-ingress">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>Ingress</h3>
            <p>Wallarm solutions for Ingress load balancing and security</p>
        </div>

        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <h3>NGINX Ingress Controller</h3>
            <p>Deploy the NGINX Ingress Controller with integrated Wallarm services</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/kong-ingress-controller/deployment/">
            <h3>Kong Ingress Controller</h3>
            <p>Deploy the Kong Ingress Controller with integrated Wallarm services</p>
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

        <a class="do-card" href="../../installation/cloud-platforms/aws/terraform-module/oob-for-web-server-mirroring/">
            <h3>OOB for NGINX, Envoy and similar mirroring</h3>
            <p>Wallarm OOB for traffic mirrored by NGINX, Envoy and similar in AWS</p>
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

## Connectors

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>Mulesoft</h3>
            <p>Deploy Wallarm to secure APIs deployed on the MuleSoft Anypoint platform</p>
        </a>

        <a class="do-card" href="../../installation/connectors/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Deploy Wallarm to secure APIs running on Apigee</p>
        </a>

        <a class="do-card" href="../../installation/connectors/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Deploy Wallarm to secure APIs running on Akamai EdgeWorkers</p>
        </a>

        <a class="do-card" href="../../installation/connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Deploy Wallarm to secure APIs running on Azion Edge</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Deploy Wallarm to secure traffic delivered through Amazon CloudFront</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Deploy Wallarm to secure traffic running via Cloudflare</p>
        </a>

        <a class="do-card" href="../../installation/connectors/kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong API Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by Kong Ingress Controller</p>
        </a>

        <a class="do-card" href="../../installation/connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>Deploy Wallarm to secure APIs managed by Istio</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Deploy Wallarm to secure APIs managed with Layer7 API Gateways</p>
        </a>
    </div>
</div>

## In-line

<div class="do-section">
    <div class="do-main">
        <div id="inline-compute-instances" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/compute-instance.svg" />
            <h3>Compute instances</h3>
            <p>Select an artifact or a solution for running Wallarm in-line on a compute instance</p>
        </div>

        <div id="inline-kubernetes" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/kubernetes.svg" />
            <h3>Kubernetes</h3>
            <p>Select a solution for running Wallarm in-line on Kubernetes</p>
        </div>
    </div>

    <div class="do-nested" data-for="inline-compute-instances">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/compute-instance.svg" />
            <h3>Compute instances</h3>
            <p>Select an artifact or a solution for running Wallarm in-line on a compute instance</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>

        <div id="inline-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm deployment on AWS</p>
        </div>

        <div id="inline-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Artifacts for Wallarm deployment on GCP</p>
        </div>

        <div id="inline-public-clouds-azure" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Artifacts for Wallarm deployment on Microsoft Azure</p>
        </div>

        <div id="inline-public-clouds-alibaba" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for Wallarm deployment on Alibaba Cloud</p>
        </div>

        <div id="inline-packages-docker-images" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker images</h3>
            <p>Deploy the Wallarm node as a Docker container</p>
        </div>

    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ami/">
            <h3>AMI</h3>
            <p>Use the official Amazon Machine Image to deploy Wallarm</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ecs/">
            <h3>ECS</h3>
            <p>Use the Docker image to deploy Wallarm with Elastic Container Service</p>
        </a>

        <div id="inline-public-clouds-aws-terraform" class="do-card">
            <h3>Terraform module</h3>
            <p>Use the Terraform module for in-line Wallarm deployment</p>
        </div>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>Use the Terraform module for in-line Wallarm deployment on AWS</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-vpc/">
            <h3>Proxy in AWS VPC</h3>
            <p>Wallarm as proxy in AWS Virtual Private Cloud</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-api-gateway/">
            <h3>Proxy for Amazon API Gateway</h3>
            <p>Wallarm as proxy for Amazon API Gateway protection</p>
        </a>

    </div>

    <div class="do-nested" data-for="inline-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Artifacts for Wallarm deployment on GCP</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/machine-image/">
            <h3>Machine Image</h3>
            <p>Use the official Google Cloud Machine Image to deploy Wallarm</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/gce/">
            <h3>GCE</h3>
            <p>Use the Docker image to deploy Wallarm with Google Compute Engine</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-azure">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Artifacts for Wallarm deployment on Microsoft Azure</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/azure/docker-image/">
            <h3>Azure Container Instances</h3>
            <p>Use the Docker image to deploy Wallarm with Azure Container Instances</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-alibaba">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for Wallarm deployment on Alibaba Cloud</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/alibaba/docker-image/">
            <h3>ECS</h3>
            <p>Use the Docker image to deploy Wallarm with Elastic Compute Service</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-docker-images">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker images</h3>
            <p>Deploy the Wallarm node as a Docker container</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/docker/nginx-based/">
            <h3>Docker image (NGINX)</h3>
            <p>Use the NGINX-based Docker image for Wallarm deployment</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/docker/envoy-based/">
            <h3>Docker image (Envoy)</h3>
            <p>Use the Envoy-based Docker image for Wallarm deployment</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-kubernetes">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/kubernetes.svg" />
            <h3>Kubernetes</h3>
            <p>Select a solution for running Wallarm in-line on Kubernetes</p>
        </div>

        <a class="do-card" href="../../installation/inline/kubernetes/nginx-ingress-controller/">
            <h3>NGINX Ingress Controller</h3>
            <p>Deploy the NGINX Ingress Controller with integrated Wallarm services</p>
        </a>

        <a class="do-card" href="../../installation/inline/kubernetes/kong-ingress-controller/deployment/">
            <h3>Kong Ingress Controller</h3>
            <p>Deploy the Kong Ingress Controller with integrated Wallarm services</p>
        </a>

        <a class="do-card" href="../../installation/inline/kubernetes/sidecar-proxy/deployment/">
            <h3>Sidecar Controller</h3>
            <p>Deploy Wallarm Sidecar controller for pod security</p>
        </a>
    </div>
</div>

## Out-of-band

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/oob/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF</h3>
            <p>Out-of-band deployment on Kubernetes using the eBPF technology</p>
        </a>

        <a class="do-card" href="../../installation/oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCP Traffic Mirror Analysis</h3>
            <p>Out-of-band deployment for TCP traffic mirror analysis</p>
        </a>

        <div id="mirroring-by-web-servers" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/web-server-mirroring.svg" />
            <h3>Mirroring by NGINX, Envoy and similar</h3>
            <p>Out-of-band deployment for traffic mirrored by NGINX, Envoy and similar</p>
        </div>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/web-server-mirroring.svg" />
            <h3>Mirroring by NGINX, Envoy and similar</h3>
            <p>Out-of-band deployment for traffic mirrored by NGINX, Envoy and similar</p>
        </div>

        <div id="mirroring-by-web-servers-public-clouds" class="do-card">
            <h3>Public Clouds</h3>
            <p>Artifacts for Wallarm OOB deployment on public clouds</p>
        </div>

        <div id="mirroring-by-web-servers-docker" class="do-card">
            <h3>Docker</h3>
            <p>Docker images for Wallarm OOB deployment</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>

    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-public-clouds">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/cloud.svg" />
            <h3>Public clouds</h3>
            <p>Artifacts for Wallarm OOB deployment on public clouds</p>
        </div>

        <div id="mirroring-by-web-servers-public-clouds-aws" class="do-card">
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm OOB deployment on AWS</p>
        </div>

        <div id="mirroring-by-web-servers-public-clouds-gcp" class="do-card">
            <h3>Google Cloud</h3>
            <p>Artifacts for Wallarm OOB deployment on GCP</p>
        </div>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm OOB deployment on AWS</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/aws-ami/">
            <h3>AMI</h3>
            <p>Use the official Machine Image to deploy Wallarm OOB on AWS</p>
        </a>

        <a class="do-card" href="../../installation/oob/terraform-module/mirroring-by-web-server/">
            <h3>Terraform module</h3>
            <p>Use the Terraform module to deploy Wallarm OOB on Kubernetes running on AWS</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Artifacts for Wallarm OOB deployment on Google Cloud</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/gcp/machine-image/">
            <h3>Machine Image</h3>
            <p>Use the official Machine Image to deploy Wallarm OOB on Google Cloud</p>
        </a>
    </div>


    <div class="do-nested" data-for="mirroring-by-web-servers-docker">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker</h3>
            <p>Docker images for Wallarm OOB deployment</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/docker-image/">
            <h3>Docker image (NGINX)</h3>
            <p>Use the NGINX-based Docker image for Wallarm OOB deployment</p>
        </a>
    </div>

</div>

## Packages

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/nginx/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>
        
        <div id="packages-docker-images" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker images</h3>
            <p>Deploy the Wallarm node as a Docker container</p>
        </div>

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

    <div class="do-nested" data-for="packages-docker-images">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker images</h3>
            <p>Deploy the Wallarm node as a Docker container</p>
        </div>

        <a class="do-card" href="../../admin-en/installation-docker-en/">
            <h3>Docker image (NGINX)</h3>
            <p>Use the NGINX-based Docker image for Wallarm deployment</p>
        </a>

        <a class="do-card" href="../../admin-en/installation-guides/envoy/envoy-docker/">
            <h3>Docker image (Envoy)</h3>
            <p>Use the Envoy-based Docker image for Wallarm deployment</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-cloud-images">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/cloud.svg" />
            <h3>Cloud images</h3>
            <p>Machine Images to deploy Wallarm on public clouds</p>
        </div>

        <a class="do-card" href="../../installation/packages/aws-ami/">
            <h3>AWS AMI</h3>
            <p>Use the official Machine Image to deploy Wallarm on AWS</p>
        </a>

        <a class="do-card" href="../../installation/packages/gcp-machine-image/">
            <h3>GCP Machine image</h3>
            <p>Use the official Machine Image to deploy Wallarm on Google Cloud</p>
        </a>
    </div>

</div>

## Custom deployment

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/on-premise/">
            <img class="non-zoomable" src="../../images/platform-icons/on-premise.svg" />
            <h3>On-premise</h3>
            <p>Integrate the Wallarm's infrastructure directly into your own environment</p>
        </a>

        <a class="do-card" href="../../installation/custom/custom-nginx-version/">
            <img class="non-zoomable" src="../../images/platform-icons/nginx.svg" />
            <h3>Custom NGINX</h3>
            <p>Request Wallarm Linux packages for a custom NGINX</p>
        </a>

        <a class="do-card" href=../../installation/heroku/docker-image/>
            <img class="non-zoomable" src="../../images/platform-icons/heroku.svg" />
            <h3>Heroku</h3>
            <p>Build a Wallarm Docker image and run it on Heroku</p>
        </a>

        <a class="do-card" href="../../installation/custom/request-custom-deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/custom-deployment.svg" />
            <h3>Custom Deployment</h3>
            <p style="margin-bottom: 8px">Can't find what you need? Let's discuss a custom solution</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>
