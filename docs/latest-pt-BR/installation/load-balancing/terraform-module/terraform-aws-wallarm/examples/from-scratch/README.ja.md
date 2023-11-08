					# Exemplos de implantação do módulo Wallarm AWS Terraform: solução de proxy do zero

Este exemplo demonstra como implantar o Wallarm na AWS Virtual Private Cloud (VPC) como um proxy inline usando o módulo Terraform. Em contraste com os exemplos de implantação de proxy [normal](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) ou [avançado](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced), este exemplo de configuração cria recursos de VPC diretamente durante a implantação usando o [módulo AWS VPC Terraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/). Por isso, esse exemplo é chamado de exemplo de "solução de proxy do zero".

Aqui estão as opções de implantação **recomendadas**:

* Quando os recursos da VPC, como sub-redes, NAT, tabela de roteamento e outros, não estão configurados. Neste exemplo de implantação, o módulo [AWS VPC Terraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) é lançado em conjunto com o módulo Terraform Wallarm para criar recursos da VPC e integrá-los ao Wallarm.
* Quando você deseja aprender como o módulo Wallarm é integrado à AWS VPC e quais recursos da VPC e variáveis de módulo são necessários para esta integração.

## Principais características

* O Wallarm processa o tráfego em modo de sincronização, permitindo a mitigação de ameaças imediatas sem comprometer os recursos do Wallarm (`preset=proxy`).
* O Wallarm é implementado como uma camada de rede independente que pode ser controlada independentemente de outras camadas e pode ser colocada em praticamente qualquer posição na estrutura da rede. A posição recomendada está atrás do balanceador de carga voltado para a Internet.
* Esta solução não requer a configuração de recursos de DNS e SSL.
* Cria recursos da VPC e integra automaticamente o proxy inline do Wallarm à VPC criada, enquanto, por outro lado, o exemplo de proxy normal requer a existência de recursos da VPC e a solicitação de seus identificadores.
* A única variável necessária para executar este exemplo é o `token` com o token do nó Wallarm.

## Arquitetura da solução

![Esquema do proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

A solução neste exemplo tem a mesma arquitetura que a [solução de proxy normal](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy):

* Recursos da AWS VPC como sub-redes, NAT, tabela de roteamento, EIP, etc., são automaticamente implantados durante a inicialização deste exemplo pelo módulo [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/). Eles não são exibidos no esquema fornecido.
* Balanceador de carga de aplicativo voltado para a Internet que direciona o tráfego para as instâncias do nó Wallarm. Este componente é implantado pelo módulo de exemplo `wallarm` fornecido.
* Instâncias do nó Wallarm que analisam o tráfego e fazem proxy de todas as solicitações. Os elementos correspondentes no esquema são as instâncias EC2 A, B e C. Este componente é implantado pelo módulo de exemplo `wallarm` fornecido.

   No exemplo, os nós Wallarm operam no modo de monitoramento que conduz o comportamento descrito. Os nós Wallarm também podem operar em outros modos, incluindo um destinado a bloquear solicitações maliciosas e enviar somente solicitações legítimas. Para mais detalhes sobre os modos de nó Wallarm, consulte nossa [documentação](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* Serviço para o qual o nó Wallarm faz  proxy das solicitações. O serviço pode ser de qualquer tipo. Por exemplo:
  
    * Aplicativo AWS API Gateway conectado à VPC por meio de um endpoint da VPC (um exemplo correspondente de implantação Terraform do Wallarm é abordado no [exemplo do API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * Nó EKS executando em um cluster EKS (para este caso, é recomendada a configuração do Internal Load Balancer ou do NodePort Service)
    * Outros serviços de back-end arbitrários

    Por padrão, o nó Wallarm encaminha o tráfego para `https://httpbin.org`. Durante a inicialização deste exemplo, você pode especificar qualquer outro domínio ou caminho de serviço disponível a partir da AWS Virtual Private Cloud (VPC) para ser o destino do tráfego de proxy.

## Componentes do código

Este exemplo possui um único arquivo de configuração `main.tf` com as configurações dos módulos a seguir:

* Configuração do módulo [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) para criar os recursos da AWS VPC.
* Módulo `wallarm` com a configuração do Wallarm para ser implantado como uma solução de proxy que gera o AWS ALB e as instâncias Wallarm.

## Pré-requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso a uma conta com a função de **administrador** no console do Wallarm. [Nuvem EU](https://my.wallarm.com/) ou [Nuvem US](https://us1.my.wallarm.com/)
* Verifique se o acesso a `https://api.wallarm.com` (se estiver usando a Nuvem Wallarm EU) ou `https://us1.api.wallarm.com` (se estiver usando a Nuvem Wallarm US) está disponível e não está bloqueado pelo firewall.

## Executando o exemplo da solução de proxy AWS Wallarm

1. Faça login no console Wallarm [Nuvem EU](https://my.wallarm.com/nodes) ou [Nuvem US](https://us1.my.wallarm.com/nodes).
1. Abra Wallarm Console → **Nodes** e crie um nó do tipo **Wallarm node**.
1. Copie o token do nó gerado.
1. Clone o repositório contendo o código do exemplo para sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. No arquivo `variables.tf` no repositório clonado em `examples/from-scratch`, defina os valores das variáveis do `default` e salve as alterações.
1. Execute os seguintes comandos a partir do diretório `examples/from-scratch` para implantar a stack:

    ```
    terraform init
    terraform apply
    ```

Para destruir o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Referências

* [Documentação Wallarm](https://docs.wallarm.com)
* [Módulo Terraform que cria os recursos da VPC na AWS](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)
* [AWS VPC com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)