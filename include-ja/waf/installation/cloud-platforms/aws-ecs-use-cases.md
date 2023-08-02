Among all supported [Wallarm deployment options][platform], Wallarm deployment on AWS ECS using the Docker image is recommended in these **use cases**:

1. If your applications are already containerized and running on AWS ECS and your team follows DevOps practices, using Wallarm Docker image and ECS could fit better into your CI/CD pipelines.
1. Your application follows a microservices architecture. With Wallarm's NGINX-based Docker image you can get granular security at the level of individual services.
1. Resource optimization is essential. The lightweight nature of Docker containers, including the NGINX-based Docker image, uses fewer resources than traditional VM-based deployments, allowing for more efficient use of system resources.
