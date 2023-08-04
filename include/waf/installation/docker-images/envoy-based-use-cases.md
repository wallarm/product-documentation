Among all supported [Wallarm deployment options][supported-deployments], Envoy-based Docker image is recommended for Wallarm deployment in these **use cases**:

* If your organization utilizes Docker-based infrastructure, Wallarm Docker image is the ideal choice. It integrates effortlessly into your existing setup, whether you are employing a microservice architecture running on AWS ECS, Alibaba ECS, or other similar services. This solution also applies to those using virtual machines seeking a more streamlined management through Docker containers.
* If you require fine-grained control over each container, the Docker image excels. It affords a greater level of resource isolation than typically possible with traditional VM-based deployments.
