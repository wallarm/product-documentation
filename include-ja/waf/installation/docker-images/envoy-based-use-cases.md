Among all supported [Wallarm deployment options][supported-deployments], Envoy-based Docker image is recommended for Wallarm deployment in these **use cases**:

1. Deploying Wallarm using the Envoy-based Docker image aligns with your Docker-based infrastructure.
1. Your services are built around Envoy and you need to extend its functionalities with Wallarm's security features.
1. Your application follows a microservices architecture. With Wallarm's Envoy-based Docker image you can get granular security at the level of individual services.
1. The security solution should be intergrated into CI/CD pipelines. The Docker image integrates seamlessly into CI/CD pipelines for automated deployment.
1. Resource optimization is essential. The lightweight nature of Docker containers, including the Envoy-based Docker image, uses fewer resources than traditional VM-based deployments, allowing for more efficient use of system resources.
