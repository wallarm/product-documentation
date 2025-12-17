# Internals of NGINX and Native Self-Hosted Wallarm Nodes

The Wallarm Node is the core component of the Wallarm platform, responsible for filtering and analyzing traffic. You can deploy it in your environment (self-hosted) or on Wallarm's Security Edge. When deploying a **self-hosted node**, you have two options: the **NGINX Node** or the **Native Node**.

These two nodes differ architecturally and are designed for specific deployment use cases.

## NGINX Node

The NGINX Node integrates seamlessly with NGINX, making it perfect for infrastructures that already rely on NGINX for traffic management. It leverages NGINX's capabilities while adding Wallarm's security and traffic filtering features.

The following [artifacts](../updating-migrating/node-artifact-versions.md) are available for deploying the NGINX Node:

* [All-in-one installer](nginx/all-in-one.md)
* [Docker image](../admin-en/installation-docker-en.md)
* [AWS AMI](packages/aws-ami.md)
* [GCP Machine Image](packages/gcp-machine-image.md)
* Helm chart for [NGINX Ingress Controller](../admin-en/installation-kubernetes-en.md), [Sidecar Controller](kubernetes/sidecar-proxy/deployment.md), [eBPF](kubernetes/ebpf/deployment.md) deployments

Find your **use case below** and deploy the NGINX Node in the appropriate form-factor.

### Kubernetes

Find an NGINX Node deployment solution for your Kubernetes environment:

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

### Connectors

API deployment can be done in various ways, including utilizing external tools such as Azion Edge. If you are looking for a way to secure these APIs with Wallarm, we offer a solution in the form of ["connectors"](connectors/overview.md) specifically designed for such cases.

The NGINX Node is used for the platforms listed below, however the analysis is limited to incoming requests.

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Secure APIs running on Azion Edge</p>
        </a>
    </div>
</div>

### In-line

Traffic to protected APIs passes through Wallarm NGINX Node instances before it reaches the API. There is no chance of an attacker bypassing Wallarm nodes as long as they are inline and are the only path available to end users. [Read more](inline/overview.md)

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/inline/compute-instances/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Run the node on a machine with a Linux OS</p>
        </a>

        <div id="inline-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for deployment on AWS</p>
        </div>

        <div id="inline-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Artifacts for deployment on GCP</p>
        </div>

        <div id="inline-public-clouds-azure" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Artifacts for deployment on Microsoft Azure</p>
        </div>

        <div id="inline-public-clouds-alibaba" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Artifacts for deployment on Alibaba Cloud</p>
        </div>

        <a class="do-card" href=../../installation/heroku/docker-image/>
            <img class="non-zoomable" src="../../images/platform-icons/heroku.svg" />
            <h3>Heroku</h3>
            <p>Build a Wallarm Docker image and run it on Heroku</p>
        </a>
        
        <a class="do-card" href="../../installation/inline/compute-instances/docker/nginx-based/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker image</h3>
            <p>Run the node in the containerized environment</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>Artifacts for deployment on AWS</p>
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
            <p>Artifacts for deployment on GCP</p>
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
            <p>Artifacts for deployment on Microsoft Azure</p>
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
            <p>Artifacts for deployment on Alibaba Cloud</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/alibaba/docker-image/">
            <h3>ECS</h3>
            <p>Use the Docker image to deploy Wallarm with Elastic Compute Service</p>
        </a>
    </div>

</div>

## Native Node

The Native Node does not rely on NGINX. It was developed for environments where NGINX is not required or where a more lightweight and platform-agnostic solution is preferred.

The following [artifacts](../updating-migrating/native-node/node-artifact-versions.md) are available for deploying the Native Node:

* [All-in-one installer](native-node/all-in-one.md)
* [Docker image](native-node/docker-image.md)
* [AWS AMI](native-node/aws-ami.md)
* [Helm chart](native-node/helm-chart.md)

Find your **use case below** and deploy the Native Node in the appropriate form-factor.

### Connectors

API deployment can be done in various ways, including utilizing external tools such as Akamai Edge, MuleSoft, etc. If you are looking for a way to secure these APIs with Wallarm, we offer a solution in the form of ["connectors"](connectors/overview.md) specifically designed for such cases.

The Native Node works with the following platforms with no limitations:

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>MuleSoft Mule Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by the Mule Gateway</p>
        </a>

        <a class="do-card" href="../../installation/connectors/mulesoft-flex/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft-flex-gateway.png" />
            <h3>MuleSoft Flex Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by the Flex Gateway</p>
        </a>

        <a class="do-card" href="../../installation/connectors/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Secure APIs running on Apigee</p>
        </a>

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

        <a class="do-card" href="../../installation/connectors/aws-api-gateway">
            <img class="non-zoomable" src="../../images/platform-icons/aws-api-gateway.svg" />
            <h3>Amazon API Gateway</h3>
            <p>Deploy Wallarm to build an API inventory from CloudWatch logs</p>
        </a>        
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Deploy Wallarm to secure traffic running via Cloudflare</p>
        </a>

        <a class="do-card" href="../../installation/connectors/standalone-kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Standalone Kong API Gateway</h3>
            <p>Deploy Wallarm to secure APIs managed by standalone Kong API Gateway</p>
        </a>

        <a class="do-card" href="../../installation/connectors/kong-ingress-controller/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong Ingress Controller</h3>
            <p>Deploy Wallarm to secure APIs managed by Kong Ingress Controller</p>
        </a>

        <a class="do-card" href="../../installation/connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>Deploy Wallarm in-line or OOB to secure APIs managed by Istio</p>
        </a>

        <a class="do-card" href="../../installation/connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Secure APIs managed with Layer7 API Gateways</p>
        </a>

        <a class="do-card" href="../../installation/connectors/fastly/">
            <img class="non-zoomable" src="../../images/platform-icons/fastly.png" />
            <h3>Fastly</h3>
            <p>Deploy Wallarm to secure APIs running on Fastly</p>
        </a>

        <a class="do-card" href="../../installation/connectors/ibm-api-connect/">
            <img class="non-zoomable" src="../../images/platform-icons/ibm-api-connect.svg" />
            <h3>IBM API Connect</h3>
            <p>Deploy Wallarm to secure APIs managed through IBM API Connect</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/azure-api-management/">
            <img class="non-zoomable" src="../../images/platform-icons/azure-apim.svg" />
            <h3>Azure API Management</h3>
            <p>Deploy Wallarm to secure APIs managed by Azure API Management</p>
        </a>
    </div>
</div>

### Out-of-band

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCP Traffic Mirror Analysis</h3>
            <p>Out-of-band deployment for TCP traffic mirror analysis</p>
        </a>
    </div>
</div>

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

<script src="/nginx-native-internals.js"></script>
