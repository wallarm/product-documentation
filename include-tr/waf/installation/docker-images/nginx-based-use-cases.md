Among all supported [Wallarm deployment options][platform], NGINX-based Docker image is recommended for Wallarm deployment in these **use cases**:

Desteklenen tüm [Wallarm deployment options][platform] arasında, NGINX tabanlı Docker görüntüsü, Wallarm dağıtımı için şu **kullanım durumları**nda önerilir:

* If your organization utilizes Docker-based infrastructure, Wallarm Docker image is the ideal choice. It integrates effortlessly into your existing setup, whether you are employing a microservice architecture running on AWS ECS, Alibaba ECS, or other similar services. This solution also applies to those using virtual machines seeking a more streamlined management through Docker containers.

Kuruluşunuz Docker tabanlı altyapıyı kullanıyorsa, Wallarm Docker image ideal seçimdir. Mevcut yapınıza sorunsuz bir şekilde entegre olur; bu, AWS ECS, Alibaba ECS veya benzeri hizmetleri çalıştıran mikroservis mimarisi kullanıyor olsanız da geçerlidir. Bu çözüm, Docker kapsayıcıları aracılığıyla daha basitleştirilmiş yönetim arayan sanal makineleri kullananlar için de uygundur.

* If you require fine-grained control over each container, the Docker image excels. It affords a greater level of resource isolation than typically possible with traditional VM-based deployments.

Her kapsayıcı üzerinde ayrıntılı kontrol gerekliyse, Docker image üstün performans gösterir. Geleneksel VM tabanlı dağıtımlarla genellikle mümkün olanın ötesinde bir kaynak izolasyonu sağlar.

For more information on running Wallarm's NGINX-based Docker image on popular public cloud container orchestration services, refer to our guides: [AWS ECS][aws-ecs-docs], [GCP GCE][gcp-gce-docs], [Azure Container Instances][azure-container-docs], [Alibaba ECS][alibaba-ecs-docs].

Wallarm'ın NGINX tabanlı Docker image'ının popüler genel bulut kapsayıcı düzenleme hizmetlerinde nasıl çalıştırılacağı hakkında daha fazla bilgi için rehberlerimize bakınız: [AWS ECS][aws-ecs-docs], [GCP GCE][gcp-gce-docs], [Azure Container Instances][azure-container-docs], [Alibaba ECS][alibaba-ecs-docs].