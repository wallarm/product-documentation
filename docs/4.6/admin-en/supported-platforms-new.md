<link rel="stylesheet" href="/supported-platforms.css?v=1" />

# Deployment options

Wallarm supports many deployment options enabling you to seamlessly integrate the platform with your environment without its modification. Learn the Wallarm deployment options and choose the most appropriate one from this document.

## Cloud platforms

<div class="do-section">
    <div class="do-main">
        <div id="cloud-platforms-aws" class="do-card">
            <img src="../../images/platform-icons/aws.svg" />
            <h3>AWS (AMI)</h3>
            <p>Reliable, scalable, and inexpensive cloud computing services.</p>
        </div>

        <div class="do-card">
            <img src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud Platform</h3>
            <p>Run Apps, Host Sites & Store Data.</p>
        </div>

        <div class="do-card">
            <img src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>A cloud computing service for building, testing, deploying, and managing applications and services.</p>
        </div>

        <a class="do-card" href="http://127.0.0.1:8000">\
            <img src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>A Chinese cloud computing company, a subsidiary of Alibaba Group.</p>
        </a>

        <div class="do-card">
            <img src="../../images/platform-icons/private-cloud.svg" />
            <h3>Private Clouds</h3>
            <p>Deploy Wallarm to private clouds.</p>
        </div>
    </div>

    <div class="do-nested" data-for="cloud-platforms-aws">
        <div class="do-card">
            <img src="../../images/platform-icons/aws.svg" />
            <h3>AWS (AMI)</h3>
            <p>Reliable, scalable, and inexpensive cloud computing services.</p>
        </div>

        <div class="do-card">
            <h3>Google Cloud<br/>Platform</h3>
            <p>Reliable, scalable, and inexpensive cloud computing services.</p>
        </div>

        <div id="cloud-platforms-aws-terraform" class="do-card">
            <h3>Terraform module</h3>
            <p>Run Apps, Host Sites & Store Data.</p>
        </div>

        <div id="cloud-platforms-aws-kubernetes" class="do-card">
            <h3>Kubernetes</h3>
            <p>Reliable, scalable, and inexpensive cloud computing services.</p>
        </div>

        <div class="do-card">
            <h3>Docker container</h3>
            <p>Run Apps, Host Sites & Store Data.</p>
        </div>
    </div>

    <div class="do-nested" data-for="cloud-platforms-aws-terraform">
        <div class="do-card">
            <img src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>Run Apps, Host Sites & Store Data.</p>
        </div>

        <a class="do-card" href="http://127.0.0.1:8000">
            <h3>With Wallarm deployment</h3>
            <p>Reliable, scalable, and inexpensive cloud computing services.</p>
        </a>

        <a class="do-card" href="http://127.0.0.1:8000">
            <h3>Akamai EdgeWorkers OOB</h3>
            <p>Run Apps, Host Sites & Store Data.</p>
        </a>

        <a class="do-card" href="http://127.0.0.1:8000">
            <h3>CloudFlare Cloud Worker OOB</h3>
            <p>Reliable, scalable, and inexpensive cloud computing services.</p>
        </a>
    </div>

    <div class="do-nested" data-for="cloud-platforms-aws-kubernetes">
        <div class="do-card">
            <img src="../../images/platform-icons/kubernetes.svg" />
            <h3>Kubernetes</h3>
            <p>Run Apps, Host Sites & Store Data.</p>
        </div>

        <a class="do-card" href="http://127.0.0.1:8000">
            <h3>With Wallarm deployment</h3>
            <p>Reliable, scalable, and inexpensive cloud computing services.</p>
        </a>

        <a class="do-card" href="http://127.0.0.1:8000">
            <h3>Akamai EdgeWorkers OOB</h3>
            <p>Run Apps, Host Sites & Store Data.</p>
        </a>
    </div>
</div>

## Docker images

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../admin-en/installation-docker-en/">
            <img src="../../images/platform-icons/docker.svg" />
            <img src="../../images/platform-icons/nginx.svg" />
            <h3>Docker image (NGINX)</h3>
            <p>Deploy the NGINX-based Wallarm node as a Docker container</p>
        </a>
    
        <a class="do-card" href="../../admin-en/installation-guides/envoy/envoy-docker/">
            <img src="../../images/platform-icons/docker.svg" />
            <img src="../../images/platform-icons/envoy.svg" />
            <h3>Docker image (Envoy)</h3>
            <p>Deploy the Envoy-based Wallarm node as a Docker container</p>
        </a>
    </div>
</div>

## Serverless deployment

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/cdn-node/">
            <img src="../../images/platform-icons/cdn-node.png" />
            <h3>CDN node</h3>
            <p>Deploy the Wallarm node without placing any third‑party components in the application's infrastructure</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.js?v=1"></script>
