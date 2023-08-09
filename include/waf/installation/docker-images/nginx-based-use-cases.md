Among all supported [Wallarm deployment options][platform], NGINX-based Docker image is recommended for Wallarm deployment in these **use cases**:

* If your organization utilizes Docker-based infrastructure, Wallarm Docker image is the ideal choice. It integrates effortlessly into your existing setup, whether you are employing a microservice architecture running on AWS ECS, Alibaba ECS, or other similar services. This solution also applies to those using virtual machines seeking a more streamlined management through Docker containers.
* If you require fine-grained control over each container, the Docker image excels. It affords a greater level of resource isolation than typically possible with traditional VM-based deployments.

For more information on running Wallarm's NGINX-based Docker image on popular public cloud container orchestration services, refer to our guides: [AWS ECS][aws-ecs-docs], [GCP GCE][gcp-gce-docs], [Azure Container Instances][azure-container-docs], [Alibaba ECS][alibaba-ecs-docs].
