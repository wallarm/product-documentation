# Deployment Options

Wallarm supports many deployment options enabling you to seamlessly integrate the platform with your environment without its modification. Learn the Wallarm deployment options and choose the most appropriate one from this document.

<link rel="stylesheet" href="/supported-platforms.css?v=1" />

## Out-of-Band

<div class="do-section">
    <div class="do-main">
        <div id="mirroring-by-web-servers" class="do-card">
            <img src="../../images/platform-icons/web-server-mirroring.svg" />
            <h3>Mirroring by web servers</h3>
            <p>Out-of-band deployment for traffic mirrored by a web server</p>
        </div>

        <div id="mirroring-by-cloud-platforms" class="do-card">
            <img src="../../images/platform-icons/cloud-mirroring.svg" />
            <h3>Mirroring by cloud platforms</h3>
            <p>Out-of-band deployment for cloud mirrored traffic</p>
        </div>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers">
        <div class="do-card">
            <img src="../../images/platform-icons/web-server-mirroring.svg" />
            <h3>Mirroring by web servers</h3>
            <p>Out-of-band deployment for traffic mirrored by a web server</p>
        </div>

        <a class="do-card" href="../../installation/oob/terraform-module/mirroring-by-web-server/">
            <h3>AWS Terraform module</h3>
            <p>Use the Terraform module to deploy Wallarm OOB on AWS</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/aws-ami/">
            <h3>AWS AMI</h3>
            <p>Deploy Wallarm OOB on AWS using the official Machine Image</p>
        </a>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/gcp-machine-image/">
            <h3>GCP Machine Image</h3>
            <p>Deploy Wallarm OOB on GCP using the official Machine Image</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-cloud-platforms">
        <div class="do-card">
            <img src="../../images/platform-icons/cloud-mirroring.svg" />
            <h3>Mirroring by cloud platforms</h3>
            <p>Out-of-band deployment for cloud mirrored traffic</p>
        </div>

        <a class="do-card" href="../../installation/oob/terraform-module/aws-vpc-mirroring/">
            <h3>AWS Terraform module</h3>
            <p>Deploy Wallarm OOB for AWS VPC Mirroring with Terraform Module</p>
        </a>

    </div>
</div>

## Public clouds

<div class="do-section">
    <div class="do-main">
        <div id="public-clouds-aws" class="do-card">
            <img src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for Wallarm deployment on AWS</p>
        </div>

        <div id="public-clouds-gcp" class="do-card">
            <img src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Artifacts for Wallarm deployment on GCP</p>
        </div>

        <div id="public-clouds-azure" class="do-card">
            <img src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Artifacts for Wallarm deployment on Microsoft Azure</p>
        </div>

        <div id="public-clouds-alibaba" class="do-card">
            <img src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for Wallarm deployment on Alibaba Cloud</p>
        </div>
    </div>

    <div class="do-nested" data-for="public-clouds-aws">
        <div class="do-card">
            <img src="../../images/platform-icons/aws.svg" />
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
            <img src="../../images/platform-icons/terraform.svg" />
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
            <h3>OOB for web server mirroring</h3>
            <p>Wallarm OOB for traffic mirrored by a web server in AWS</p>
        </a>

        <a class="do-card" href="../../installation/cloud-platforms/aws/terraform-module/oob-for-aws-vpc-mirroring/">
            <h3>OOB for AWS VPC Mirroring</h3>
            <p>Wallarm OOB for AWS VPC Mirroring</p>
        </a>
    </div>

    <div class="do-nested" data-for="public-clouds-gcp">
        <div class="do-card">
            <img src="../../images/platform-icons/gcp.svg" />
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
            <img src="../../images/platform-icons/azure-cloud.svg" />
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
            <img src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for Wallarm deployment on Alibaba Cloud</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/alibaba-cloud/docker-container/">
            <h3>ECS</h3>
            <p>Use the Docker image to deploy Wallarm with Elastic Compute Service</p>
        </a>
    </div>
</div>

## CDN

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/cdn-node/">
            <img src="../../images/platform-icons/cdn-node.png" />
            <h3>CDN</h3>
            <p>Deploy Wallarm without placing any third‑party components in your infrastructure</p>
        </a>
    </div>
</div>

## Kubernetes

<div class="do-section">
    <div class="do-main">
        <div id="kubernetes-ingress" class="do-card">
            <img src="../../images/platform-icons/ingress.svg" />
            <h3>Ingress</h3>
            <p>Wallarm solutions for Ingress load balancing and security</p>
        </div>

        <a class="do-card" href="../../installation/kubernetes/sidecar-proxy/deployment/">
            <img src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar</h3>
            <p>Deploy Wallarm Sidecar controller for pod security</p>
        </a>
    </div>

    <div class="do-nested" data-for="kubernetes-ingress">
        <div class="do-card">
            <img src="../../images/platform-icons/ingress.svg" />
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

## Packages

<div class="do-section">
    <div class="do-main">
        <div id="packages-docker-images" class="do-card">
            <img src="../../images/platform-icons/docker.svg" />
            <h3>Docker images</h3>
            <p>Deploy the Wallarm node as a Docker container</p>
        </div>

        <div id="packages-linux" class="do-card">
            <img src="../../images/platform-icons/linux.svg" />
            <h3>Linux packages</h3>
            <p>Install Wallarm on a supported OS as the NGINX module</p>
        </div>

        <div id="packages-cloud-images" class="do-card">
            <img src="../../images/platform-icons/cloud.svg" />
            <h3>Cloud images</h3>
            <p>Machine Images to deploy Wallarm on public clouds</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/aws/terraform-module/overview/">
            <img src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>Use the Terraform module for Wallarm deployment on AWS</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-docker-images">
        <div class="do-card">
            <img src="../../images/platform-icons/docker.svg" />
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
            <img src="../../images/platform-icons/cloud.svg" />
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
            <img src="../../images/platform-icons/linux.svg" />
            <h3>Linux packages</h3>
            <p>Install Wallarm on a supported OS as the NGINX module</p>
        </div>

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
    </div>

    <div class="do-nested" data-for="packages-linux-debian-10">
        <div class="do-card">
            <img src="../../images/platform-icons/debian.svg" />
            <h3>Debian 10.x Buster</h3>
            <p>Wallarm packages for Debian 10.x Buster</p>
        </div>

        <a class="do-card" href="../../installation/nginx/dynamic-module-from-distr/">
            <h3>NGINX Distro</h3>
            <p>Packages for OS with NGINX Distro</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-debian-11">
        <div class="do-card">
            <img src="../../images/platform-icons/debian.svg" />
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
            <h3>NGINX Distro</h3>
            <p>Packages for OS with NGINX Distro</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-ubuntu-18">
        <div class="do-card">
            <img src="../../images/platform-icons/ubuntu.svg" />
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
            <img src="../../images/platform-icons/ubuntu.svg" />
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
            <img src="../../images/platform-icons/ubuntu.svg" />
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
            <img src="../../images/platform-icons/centos.svg" />
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
            <h3>NGINX Distro</h3>
            <p>Packages for OS with NGINX Distro</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-amazon-linux">
        <div class="do-card">
            <img src="../../images/platform-icons/amazon-linux.svg" />
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
            <img src="../../images/platform-icons/almalinux.svg" />
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
            <h3>NGINX Distro</h3>
            <p>Packages for OS with NGINX Distro</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-rocky-linux">
        <div class="do-card">
            <img src="../../images/platform-icons/rockylinux.svg" />
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
            <h3>NGINX Distro</h3>
            <p>Packages for OS with NGINX Distro</p>
        </a>
    </div>

    <div class="do-nested" data-for="packages-linux-oracle-linux-8">
        <div class="do-card">
            <img src="../../images/platform-icons/oracle-linux.svg" />
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
            <h3>NGINX Distro</h3>
            <p>Packages for OS with NGINX Distro</p>
        </a>
    </div>
</div>

## Custom deployment method

<div class="do-section">
    <div class="do-main">
        <div class="do-card">
            <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="29" fill="#F3F4F6"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M33 19H39L40.4641 25.2225L45.8995 21.8577L50.1422 26.1003L46.7773 31.5358L53 33V39L46.7774 40.4641L50.1421 45.8994L45.8994 50.1421L40.4642 46.7774L39 53H33L31.5358 46.7773L26.1006 50.1419L21.8579 45.8993L25.2225 40.4641L19 39V33L25.2226 31.5359L21.8578 26.1004L26.1005 21.8578L31.5359 25.2226L33 19ZM36 42C39.3137 42 42 39.3137 42 36C42 32.6863 39.3137 30 36 30C32.6863 30 30 32.6863 30 36C30 39.3137 32.6863 42 36 42Z" fill="#959DAC"/>
            </svg>
            <p style="margin-bottom: 8px">Did not find your platform / approach?</p>
            <a href="mailto:sales@wallarm.com">
                <button type="button" class="wlrm-button">
                    Contact us
                </button>
            </a>
        </div>
    </div>
</div>

<script src="/supported-platforms.js?v=1"></script>