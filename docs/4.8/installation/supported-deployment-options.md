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
            <img class="non-zoomable" src="../../images/platform-icons/aws-lambda.svg" />
            <h3>AWS Lambda</h3>
            <p>Deploy Wallarm to secure APIs on AWS that utilize Node.js lambdas</p>
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
            <img class="non-zoomable" src="../../images/platform-icons/aws-lambda.svg" />
            <h3>AWS Lambda</h3>
            <p>Deploy Wallarm to secure APIs on AWS that utilize Node.js lambdas</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Deploy Wallarm to secure traffic running via Cloudflare</p>
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

        <div id="inline-packages-linux" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Linux packages</h3>
            <p>Install Wallarm on a supported OS as the NGINX module</p>
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

    <div class="do-nested" data-for="inline-packages-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Linux packages</h3>
            <p>Install Wallarm on a supported OS as the NGINX module</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/all-in-one/">
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>
        
        <div id="inline-packages-linux-debian-10" class="do-card">
            <h3>Debian 10.x Buster</h3>
            <p>Wallarm packages for Debian 10.x Buster</p>
        </div>

        <div id="inline-packages-linux-debian-11" class="do-card">
            <h3>Debian 11.x Bullseye</h3>
            <p>Wallarm packages for Debian 11.x Bullseye</p>
        </div>

        <div id="inline-packages-linux-ubuntu-18" class="do-card">
            <h3>Ubuntu 18.04 Bionic</h3>
            <p>Wallarm packages for Ubuntu 18.04 Bionic</p>
        </div>

        <div id="inline-packages-linux-ubuntu-20" class="do-card">
            <h3>Ubuntu 20.04 Focal</h3>
            <p>Wallarm packages for Ubuntu 20.04 Focal</p>
        </div>

        <div id="inline-packages-linux-ubuntu-22" class="do-card">
            <h3>Ubuntu 22.04 Jammy</h3>
            <p>Wallarm packages for Ubuntu 22.04 Jammy</p>
        </div>

        <div id="inline-packages-linux-centos-7" class="do-card">
            <h3>CentOS 7.x</h3>
            <p>Wallarm packages for CentOS 7.x</p>
        </div>

        <div id="inline-packages-linux-amazon-linux" class="do-card">
            <h3>Amazon Linux 2.0.2021x and lower</h3>
            <p>Wallarm packages for Amazon Linux 2.0.2021x and lower</p>
        </div>

        <div id="inline-packages-linux-almalinux" class="do-card">
            <h3>AlmaLinux</h3>
            <p>Wallarm packages for AlmaLinux</p>
        </div>

        <div id="inline-packages-linux-rocky-linux" class="do-card">
            <h3>Rocky Linux</h3>
            <p>Wallarm packages for Rocky Linux</p>
        </div>

        <div id="inline-packages-linux-oracle-linux-8" class="do-card">
            <h3>Oracle Linux 8.x</h3>
            <p>Wallarm packages for Oracle Linux 8.x</p>
        </div>

        <div id="inline-packages-linux-rhel-8" class="do-card">
            <h3>RHEL 8.x</h3>
            <p>Wallarm packages for Red Hat Enterprise Linux 8.x</p>
        </div>

    </div>

    <div class="do-nested" data-for="inline-packages-linux-debian-10">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/debian.svg" />
            <h3>Debian 10.x Buster</h3>
            <p>Wallarm packages for Debian 10.x Buster</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-debian-11">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/debian.svg" />
            <h3>Debian 11.x Bullseye</h3>
            <p>Wallarm packages for Debian 11.x Bullseye</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-ubuntu-18">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 18.04 Bionic</h3>
            <p>Wallarm packages for Ubuntu 18.04 Bionic</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-ubuntu-20">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 20.04 Focal</h3>
            <p>Wallarm packages for Ubuntu 20.04 Focal</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-ubuntu-22">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 22.04 Jammy</h3>
            <p>Wallarm packages for Ubuntu 22.04 Jammy</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-centos-7">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/centos.svg" />
            <h3>CentOS 7.x</h3>
            <p>Wallarm packages for CentOS 7.x</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-amazon-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/amazon-linux.svg" />
            <h3>Amazon Linux 2.0.2021x and lower</h3>
            <p>Wallarm packages for Amazon Linux 2.0.2021x and lower</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-almalinux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/almalinux.svg" />
            <h3>AlmaLinux</h3>
            <p>Wallarm packages for AlmaLinux</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-rocky-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/rockylinux.svg" />
            <h3>Rocky Linux</h3>
            <p>Wallarm packages for Rocky Linux</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-oracle-linux-8">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/oracle-linux.svg" />
            <h3>Oracle Linux 8.x</h3>
            <p>Wallarm packages for Oracle Linux 8.x</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-packages-linux-rhel-8">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/redhat.svg" />
            <h3>RHEL 8.x</h3>
            <p>Wallarm packages for Red Hat Enterprise Linux 8.x</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/linux/individual-packages-nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
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

        <div id="mirroring-by-web-servers-linux-packages" class="do-card">
            <h3>Linux</h3>
            <p>Linux packages for Wallarm OOB deployment on a supported OS</p>
        </div>

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

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Linux</h3>
            <p>Linux packages for Wallarm OOB deployment on a supported OS</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/all-in-one/">
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>

        <div id="mirroring-by-web-servers-linux-packages-debian-10" class="do-card">
            <h3>Debian 10.x Buster</h3>
            <p>Wallarm packages for Debian 10.x Buster</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-debian-11" class="do-card">
            <h3>Debian 11.x Bullseye</h3>
            <p>Wallarm packages for Debian 11.x Bullseye</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-ubuntu-18" class="do-card">
            <h3>Ubuntu 18.04 Bionic</h3>
            <p>Wallarm packages for Ubuntu 18.04 Bionic</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-ubuntu-20" class="do-card">
            <h3>Ubuntu 20.04 Focal</h3>
            <p>Wallarm packages for Ubuntu 20.04 Focal</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-ubuntu-22" class="do-card">
            <h3>Ubuntu 22.04 Jammy</h3>
            <p>Wallarm packages for Ubuntu 22.04 Jammy</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-centos-7" class="do-card">
            <h3>CentOS 7.x</h3>
            <p>Wallarm packages for CentOS 7.x</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-amazon-linux" class="do-card">
            <h3>Amazon Linux 2.0.2021x and lower</h3>
            <p>Wallarm packages for Amazon Linux 2.0.2021x and lower</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-almalinux" class="do-card">
            <h3>AlmaLinux</h3>
            <p>Wallarm packages for AlmaLinux</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-rocky-linux" class="do-card">
            <h3>Rocky Linux</h3>
            <p>Wallarm packages for Rocky Linux</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-oracle-linux-8" class="do-card">
            <h3>Oracle Linux 8.x</h3>
            <p>Wallarm packages for Oracle Linux 8.x</p>
        </div>

        <div id="mirroring-by-web-servers-linux-packages-rhel-8" class="do-card">
            <h3>RHEL 8.x</h3>
            <p>Wallarm packages for Red Hat Enterprise Linux 8.x</p>
        </div>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-debian-10">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/debian.svg" />
            <h3>Debian 10.x Buster</h3>
            <p>Wallarm packages for Debian 10.x Buster</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-debian-11">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/debian.svg" />
            <h3>Debian 11.x Bullseye</h3>
            <p>Wallarm packages for Debian 11.x Bullseye</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-ubuntu-18">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 18.04 Bionic</h3>
            <p>Wallarm packages for Ubuntu 18.04 Bionic</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-ubuntu-20">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 20.04 Focal</h3>
            <p>Wallarm packages for Ubuntu 20.04 Focal</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-ubuntu-22">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 22.04 Jammy</h3>
            <p>Wallarm packages for Ubuntu 22.04 Jammy</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-centos-7">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/centos.svg" />
            <h3>CentOS 7.x</h3>
            <p>Wallarm packages for CentOS 7.x</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-amazon-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/amazon-linux.svg" />
            <h3>Amazon Linux 2.0.2021x and lower</h3>
            <p>Wallarm packages for Amazon Linux 2.0.2021x and lower</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-almalinux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/almalinux.svg" />
            <h3>AlmaLinux</h3>
            <p>Wallarm packages for AlmaLinux</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-rocky-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/rockylinux.svg" />
            <h3>Rocky Linux</h3>
            <p>Wallarm packages for Rocky Linux</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-oracle-linux-8">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/oracle-linux.svg" />
            <h3>Oracle Linux 8.x</h3>
            <p>Wallarm packages for Oracle Linux 8.x</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-linux-packages-rhel-8">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/redhat.svg" />
            <h3>RHEL 8.x</h3>
            <p>Wallarm packages for Red Hat Enterprise Linux 8.x</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-stable/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/nginx-distro/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

</div>

## Packages

<div class="do-section">
    <div class="do-main">
        <div id="packages-docker-images" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker images</h3>
            <p>Deploy the Wallarm node as a Docker container</p>
        </div>

        <div id="packages-linux" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Linux packages</h3>
            <p>Install Wallarm on a supported OS as the NGINX module</p>
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

    <div class="do-nested" data-for="packages-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Linux packages</h3>
            <p>Install Wallarm on a supported OS as the NGINX module</p>
        </div>

        <a class="do-card" href="../../installation/nginx/all-in-one/">
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>

        <div id="packages-linux-debian-10" class="do-card">
            <h3>Debian 10.x Buster</h3>
            <p>Wallarm packages for Debian 10.x Buster</p>
        </div>

        <div id="packages-linux-debian-11" class="do-card">
            <h3>Debian 11.x Bullseye</h3>
            <p>Wallarm packages for Debian 11.x Bullseye</p>
        </div>

        <div id="packages-linux-ubuntu-18" class="do-card">
            <h3>Ubuntu 18.04 Bionic</h3>
            <p>Wallarm packages for Ubuntu 18.04 Bionic</p>
        </div>

        <div id="packages-linux-ubuntu-20" class="do-card">
            <h3>Ubuntu 20.04 Focal</h3>
            <p>Wallarm packages for Ubuntu 20.04 Focal</p>
        </div>

        <div id="packages-linux-ubuntu-22" class="do-card">
            <h3>Ubuntu 22.04 Jammy</h3>
            <p>Wallarm packages for Ubuntu 22.04 Jammy</p>
        </div>

        <div id="packages-linux-centos-7" class="do-card">
            <h3>CentOS 7.x</h3>
            <p>Wallarm packages for CentOS 7.x</p>
        </div>

        <div id="packages-linux-amazon-linux" class="do-card">
            <h3>Amazon Linux 2.0.2021x and lower</h3>
            <p>Wallarm packages for Amazon Linux 2.0.2021x and lower</p>
        </div>

        <div id="packages-linux-almalinux" class="do-card">
            <h3>AlmaLinux</h3>
            <p>Wallarm packages for AlmaLinux</p>
        </div>

        <div id="packages-linux-rocky-linux" class="do-card">
            <h3>Rocky Linux</h3>
            <p>Wallarm packages for Rocky Linux</p>
        </div>

        <div id="packages-linux-oracle-linux-8" class="do-card">
            <h3>Oracle Linux 8.x</h3>
            <p>Wallarm packages for Oracle Linux 8.x</p>
        </div>

        <div id="packages-linux-rhel-8" class="do-card">
            <h3>RHEL 8.x</h3>
            <p>Wallarm packages for Red Hat Enterprise Linux 8.x</p>
        </div>
    </div>

    <div class="do-nested" data-for="packages-linux-debian-10">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/debian.svg" />
            <h3>Debian 10.x Buster</h3>
            <p>Wallarm packages for Debian 10.x Buster</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-debian-11">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/debian.svg" />
            <h3>Debian 11.x Bullseye</h3>
            <p>Wallarm packages for Debian 11.x Bullseye</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-ubuntu-18">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 18.04 Bionic</h3>
            <p>Wallarm packages for Ubuntu 18.04 Bionic</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-ubuntu-20">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 20.04 Focal</h3>
            <p>Wallarm packages for Ubuntu 20.04 Focal</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-ubuntu-22">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/ubuntu.svg" />
            <h3>Ubuntu 22.04 Jammy</h3>
            <p>Wallarm packages for Ubuntu 22.04 Jammy</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-centos-7">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/centos.svg" />
            <h3>CentOS 7.x</h3>
            <p>Wallarm packages for CentOS 7.x</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-amazon-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/amazon-linux.svg" />
            <h3>Amazon Linux 2.0.2021x and lower</h3>
            <p>Wallarm packages for Amazon Linux 2.0.2021x and lower</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-almalinux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/almalinux.svg" />
            <h3>AlmaLinux</h3>
            <p>Wallarm packages for AlmaLinux</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-rocky-linux">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/rockylinux.svg" />
            <h3>Rocky Linux</h3>
            <p>Wallarm packages for Rocky Linux</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-oracle-linux-8">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/oracle-linux.svg" />
            <h3>Oracle Linux 8.x</h3>
            <p>Wallarm packages for Oracle Linux 8.x</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-rhel-8">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/redhat.svg" />
            <h3>RHEL 8.x</h3>
            <p>Wallarm packages for Red Hat Enterprise Linux 8.x</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module/">
            <h3>NGINX Stable</h3>
            <p>Packages for OS with NGINX Stable</p>
        </a>

        <a class="do-card" href="../../installation/nginx-plus/">
            <h3>NGINX Plus</h3>
            <p>Packages for OS with NGINX Plus</p>
        </a>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>Distribution-provided NGINX</h3>
            <p>Packages for OS with NGINX installed from the Debian/CentOS software repositories</p>
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
