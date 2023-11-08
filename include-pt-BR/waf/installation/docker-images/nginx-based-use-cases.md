Dentre todas as [opções de implantação do Wallarm][platform] suportadas, a imagem Docker baseada em NGINX é recomendada para a implantação do Wallarm nestes **casos de uso**:

* Se a sua organização utiliza uma infraestrutura baseada em Docker, a imagem Docker do Wallarm é a escolha ideal. Ela se integra facilmente à sua configuração existente, seja você empregando uma arquitetura de microserviço que está rodando em AWS ECS, Alibaba ECS, ou outros serviços semelhantes. Essa solução também se aplica àqueles que estão usando máquinas virtuais que buscam uma gestão mais simplificada através de contêineres Docker.
* Se você precisa de um controle refinado sobre cada contêiner, a imagem Docker se destaca. Ela oferece um nível maior de isolamento de recursos do que geralmente é possível com implantações baseadas em VM tradicionais.

Para obter mais informações sobre como executar a imagem Docker do Wallarm baseada em NGINX em serviços populares de orquestração de contêineres na nuvem pública, consulte nossos guias: [AWS ECS][aws-ecs-docs], [GCP GCE][gcp-gce-docs], [Azure Container Instances][azure-container-docs], [Alibaba ECS][alibaba-ecs-docs].
