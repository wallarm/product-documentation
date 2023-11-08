# Exemplo de implantação do Módulo Terraform AWS Wallarm: solução de proxy do zero

Este exemplo demonstra como implantar o Wallarm como um proxy inline em uma Nuvem Privada Virtual AWS (VPC) usando o módulo Terraform. Em contraste com os exemplos de implantação de proxy [regular](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) ou [avançado](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced), essa configuração de exemplo criará recursos da VPC diretamente durante esta implantação de exemplo usando o [módulo Terraform AWS VPC](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/). É por isso que o exemplo é chamado de "solução de proxy do zero".

Esta é a opção de implantação **recomendada** se:

* Você não possui sub-redes, NATs, tabelas de roteamento e outros recursos da VPC configurados. Este exemplo de implantação inicia o [módulo Terraform AWS VPC](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) junto com o módulo Terraform Wallarm para criar recursos da VPC e integrar o Wallarm a eles.
* Você deseja aprender o modo como o módulo Wallarm é integrado com a AWS VPC, os recursos da VPC e as variáveis do módulo necessárias para essa integração.

## Características principais

* Wallarm processa tráfego no modo síncrono que não limita as capacidades do Wallarm e permite a mitigação instantânea de ameaças (`preset=proxy`).
* A solução Wallarm é implantada como uma camada de rede separada que permite que você a controle independentemente de outras camadas e coloque a camada em quase qualquer posição na estrutura da rede. A posição recomendada está atrás de um balanceador de carga voltado para a internet.
* Esta solução não requer que os recursos de DNS e SSL sejam configurados.
* Ele cria recursos da VPC e integra automaticamente o proxy inline Wallarm à VPC criada enquanto o exemplo de proxy regular requer que os recursos da VPC existam e solicita seus identificadores.
* A única variável necessária para executar este exemplo é `token` com o token de nó Wallarm.

## Arquitetura da solução

![Esquema de proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Esta solução de exemplo tem a mesma arquitetura que a [solução de proxy regular](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy):

* Recursos da AWS VPC, incluindo sub-redes, NATs, tabelas de roteamento, EIPs, etc., serão implantados automaticamente pelo módulo [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) durante este lançamento de exemplo. Eles não estão exibidos no esquema fornecido.
* Balanceador de Carga de Aplicação voltado para a Internet roteando tráfego para instâncias de nó Wallarm. Este componente será implantado pelo módulo de exemplo `wallarm` fornecido.
* Instâncias de nó Wallarm analisando o tráfego e encaminhando quaisquer solicitações adicionais. Elementos correspondentes no esquema são instâncias EC2 A, B, C. Este componente será implantado pelo módulo de exemplo `wallarm` fornecido.

    O exemplo executa nós Wallarm no modo de monitoramento que direciona o comportamento descrito. Os nós Wallarm também podem operar em outros modos, incluindo aqueles voltados para bloquear solicitações maliciosas e encaminhar apenas as legítimas. Para saber mais sobre os modos de nó Wallarm, use [nossa documentação](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* Os serviços para os quais os nós Wallarm encaminham solicitações. O serviço pode ser de qualquer tipo, por exemplo:

    * Aplicação AWS API Gateway conectada à VPC por meio de Endpoints da VPC (a implantação correspondente do Terraform Wallarm é abordada no [exemplo para API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * Nós EKS em execução no cluster EKS (configuração do Balanceador de Carga Interno ou Serviço NodePort é recomendada para este caso)
    * Qualquer outro serviço de back-end

    Por padrão, os nós Wallarm encaminharão o tráfego para `https://httpbin.org`. Durante o lançamento deste exemplo, você poderá especificar qualquer outro domínio de serviço ou caminho disponível a partir da Nuvem Privada Virtual AWS (VPC) para encaminhar o tráfego.

## Componentes do código

Este exemplo possui apenas o arquivo de configuração `main.tf` com as seguintes configurações do módulo:

* Configurações do módulo [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) para criar recursos AWS VPS.
* O módulo `wallarm` com a configuração Wallarm a ser implantada como uma solução de proxy. A configuração produz um ALB AWS e instâncias Wallarm.

## Requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso à conta com a função **Administrador** no Console Wallarm na [Nuvem UE](https://my.wallarm.com/) ou [Nuvem US](https://us1.my.wallarm.com/)
* Acesso a `https://api.wallarm.com` se estiver trabalhando com Nuvem Wallarm UE ou a `https://us1.api.wallarm.com` se estiver trabalhando com Nuvem Wallarm US. Certifique-se de que o acesso não está bloqueado por um firewall

## Executando o exemplo de solução de proxy AWS Wallarm

1. Inscreva-se no Console Wallarm na [Nuvem UE](https://my.wallarm.com/nodes) ou [Nuvem US](https://us1.my.wallarm.com/nodes).
1. Abra o Console Wallarm → **Nós** e crie o nó do tipo **Nó Wallarm**.
1. Copie o token de nó gerado.
1. Clone o repositório contendo o código de exemplo para sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Defina os valores das variáveis nas opções `default` no arquivo `examples/from-scratch/variables.tf` do repositório clonado e salve as alterações.
1. Implante a pilha executando os seguintes comandos a partir do diretório `examples/from-scratch`:

    ```
    terraform init
    terraform apply
    ```

Para remover o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Referências

* [Documentação Wallarm](https://docs.wallarm.com)
* [Módulo Terraform que cria recursos VPC na AWS](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws)
* [VPC AWS com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)