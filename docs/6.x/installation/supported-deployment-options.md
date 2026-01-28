# Wallarm Node Deployment Options

Wallarm supports multiple deployment models so you can protect APIs and applications in the environment you already run — from Kubernetes and cloud VMs to API gateways and edge platforms.

Use this page to quickly choose the right option based on **who hosts the node**, **where your traffic lives**, and whether you need **inline** protection or **out-of-band** analysis.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Security Edge

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../inline/overview/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-inline.svg" />
            <h3>Security Edge Inline</h3>
            <p>Real-time traffic is redirected through the Edge Node, filtered, and forwarded to your origin</p>
        </a>

        <a class="do-card" href="../se-connector/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-connectors.svg" />
            <h3>Security Edge Connector</h3>
            <p>Connect the Edge Node to your API platform for asynchronous analysis or real-time blocking</p>
        </a>
    </div>
</div>

## Self-hosted inline

### Kubernetes

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>Deploy the NGINX Ingress Controller with integrated Wallarm services</p>
        </a>

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
</div>

### Cloud platforms

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

### Linux VM

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Let Wallarm detect your OS and NGINX version to install the appropriate modules</p>
        </a>
    </div>
</div>

### Docker

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker image (NGINX)</h3>
            <p>Use the NGINX-based Docker image for Wallarm deployment</p>
        </a>
    </div>
</div>

## Self-Hosted out-of-band

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
    </div>

</div>

## All deployment artifacts

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

        <a class="do-card" href="../../installation/packages/aws-ami/">
            <h3>AWS AMI</h3>
            <p>Use the official Machine Image to deploy Wallarm on AWS</p>
        </a>

        <a class="do-card" href="../../installation/packages/gcp-machine-image/">
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

        <a class="do-card" href="../../installation/native-node/aws-ami/">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>AWS AMI</h3>
            <p>Use the official Machine Image to deploy Wallarm on AWS</p>
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

## Enterprise & Advanced

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/on-premise/overview/">
            <img class="non-zoomable" src="../../images/platform-icons/on-premise.svg" />
            <h3>On-premise</h3>
            <p>Host both Wallarm Nodes and the Wallarm Cloud within your environment</p>
        </a>
        
        <a class="do-card" href="../../installation/custom/request-custom-deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/custom-deployment.svg" />
            <h3>Custom Deployment</h3>
            <p style="margin-bottom: 8px">Can't find what you need? Let's discuss a custom solution</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>
