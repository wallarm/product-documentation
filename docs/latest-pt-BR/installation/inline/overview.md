# Implementação em Linha do Nó Wallarm

A Wallarm pode ser implantada em linha para mitigar ameaças em tempo real. Neste caso, o tráfego para as APIs protegidas passa pelas instâncias do nó Wallarm antes de chegar à API. Não há como um invasor contornar os nós Wallarm, desde que estejam em linha e sejam a única rota disponível para os usuários finais. Este artigo explica a abordagem em detalhes.
As instâncias do nó Wallarm ficam entre o cliente e os servidores, analisando o tráfego de entrada, atenuando requisições maliciosas e encaminhando requisições legítimas para o servidor protegido.

## Casos de uso

A solução Wallarm Inline é adequada para os seguintes casos de uso:

* Mitigar requisições maliciosas como injeções SQli, XSS, abuso de API, força bruta antes de chegarem ao servidor da aplicação.
* Obter conhecimento sobre vulnerabilidades de segurança ativas em seu sistema e aplicar patches virtuais antes de corrigir o código do aplicativo.
* Observar o inventário da API e rastrear dados sensíveis.

## Vantagens e requisitos específicos

A abordagem de implementação em linha para a implantação da Wallarm oferece várias vantagens em relação a outros métodos de implementação, como as [implantações OOB](../oob/overview.md):

* A Wallarm bloqueia instantaneamente solicitações maliciosas, pois a análise de tráfego ocorre em tempo real.
* Todos os recursos da Wallarm, incluindo o [API Discovery](../../api-discovery/overview.md) e a [detecção de vulnerabilidades](../../about-wallarm/detecting-vulnerabilities.md), funcionam sem limitações já que a Wallarm tem acesso a ambas as requisições recebidas e respostas do servidor.

Para implementar um esquema inline, você precisará alterar a rota do tráfego em sua infraestrutura. Além disso, considere cuidadosamente a [alocação de recursos](../../admin-en/configuration-guides/allocate-resources-for-node.md) para os nós Wallarm para garantir um serviço ininterrupto.

Ao implantar nós Wallarm em nuvens públicas como AWS ou GCP para ambientes de produção, é necessário usar um grupo de dimensionamento automático adequadamente configurado para desempenho, escalabilidade e resistência ideais (consulte os artigos para a [AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) ou [GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md)).

## Modelos de implantação e métodos de implantação suportados

Quando se trata de implantar Wallarm em linha, há dois modelos comuns a considerar: implantação de instância de computação e implantação Kubernetes.

Você pode escolher o modelo e o método de implantação com base nas especificidades da sua infraestrutura. Se precisar de assistência para escolher o modelo e o método de implantação corretos, sinta-se à vontade para entrar em contato com nossa [equipe de vendas](mailto:sales@wallarm.com) e fornecer a eles informações adicionais sobre sua infraestrutura para orientação personalizada.

### Executando Wallarm em instâncias de computação

Neste modelo, você implanta Wallarm como um aparelho virtual dentro de sua infraestrutura. O aparelho virtual pode ser instalado como uma VM, contêiner ou instância em nuvem.

Ao implantar um nó Wallarm, você tem a flexibilidade de posicioná-lo em diferentes localizações dentro da topologia da sua rede. No entanto, a abordagem recomendada é colocar a instância do nó atrás de um balanceador de carga público, à frente dos seus serviços de back-end, ou um balanceador de carga privado, geralmente localizado antes dos serviços de back-end. O seguinte diagrama ilustra o fluxo de tráfego típico nesta configuração:

![Diagrama do esquema de filtragem em linha](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

Os balanceadores de carga podem ser classificados em dois tipos: L4 e L7. O tipo de balanceador de carga determina como o desembarque SSL é tratado, o que é crucial ao integrar Wallarm à sua infraestrutura existente.

* Se você usa um balanceador de carga L4, comumente o desembarque SSL é tratado por um servidor web posicionado atrás do balanceador de carga ou por outros meios em sua infraestrutura sem a instância Wallarm. No entanto, ao implantar o nó Wallarm, você precisa configurar o desembarque SSL na instância Wallarm.
* Se você usa um balanceador de carga L7, comumente o desembarque SSL é tratado pelo próprio balanceador de carga, e o nó Wallarm receberá HTTP puro.

A Wallarm oferece os seguintes artefatos e soluções para a execução da Wallarm em instâncias de computação:

**Amazon Web Services (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* Módulo Terraform:
    * [Proxy no AWS VPC](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Proxy para Amazon API Gateway](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**Google Cloud Platform (GCP)**

* [Imagem de máquina](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Instâncias de Contêiner Azure](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**Imagens Docker**

* [Baseado em NGINX](compute-instances/docker/nginx-based.md)
* [Baseado em Envoy](compute-instances/docker/envoy-based.md)

**Pacotes Linux**

* [Pacotes individuais para NGINX estável](compute-instances/linux/individual-packages-nginx-stable.md)
* [Pacotes individuais para NGINX Plus](compute-instances/linux/individual-packages-nginx-plus.md)
* [Pacotes individuais para NGINX fornecido pela distribuição](compute-instances/linux/individual-packages-nginx-distro.md)
* [Instalador completo](compute-instances/linux/all-in-one.md)

### Executando Wallarm no Kubernetes

Se você utiliza o Kubernetes para orquestração de contêineres, a Wallarm pode ser implantada como uma solução nativa do Kubernetes. Ele se integra perfeitamente aos clusters do Kubernetes, aproveitando recursos como controladores de entrada ou sidecar.

A Wallarm oferece os seguintes artefatos e soluções para executar Wallarm no Kubernetes:

* [Controlador de Ingress NGINX](../../admin-en/installation-kubernetes-en.md)
* [Controlador de Ingress Kong](../kubernetes/kong-ingress-controller/deployment.md)
* [Controlador Sidecar](../kubernetes/sidecar-proxy/deployment.md)