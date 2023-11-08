# Implementando Wallarm como Proxy no AWS VPC

Este exemplo demonstra como implementar o Wallarm como um proxy inline para uma nuvem privada virtual AWS (VPC) existente, usando o [módulo Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

A solução de proxy Wallarm fornece uma camada de rede funcional adicional atuando como um roteador de tráfego HTTP avançado com as funções de segurança WAF e API.

Você pode ver a flexibilidade da solução em ação experimentando a [solução de proxy avançada](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced).

## Casos de uso

Entre todas as [opções de implementação da Wallarm](https://docs.wallarm.com/installation/supported-deployment-options) suportadas, o módulo Terraform é recomendado para a implementação Wallarm no AWS VPC nestes **casos de uso**:

* Sua infraestrutura existente reside na AWS.
* Você utiliza a prática de Infraestrutura como Código (IaC). O módulo Terraform Wallarm permite o gerenciamento e provisionamento automatizados do nó Wallarm na AWS, aumentando a eficiência e consistência.

## Requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso à conta com o [papel](https://docs.wallarm.com/user-guides/settings/users/#user-roles) de **Administrador** no Console Wallarm na nuvem dos EUA ou da UE.
* Acesso a `https://us1.api.wallarm.com` se estiver trabalhando com Wallarm Cloud dos EUA ou a `https://api.wallarm.com` se estiver trabalhando com Wallarm Cloud da UE. Certifique-se de que o acesso não está bloqueado por um firewall.

## Arquitetura da solução

![Esquema do proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

A solução de proxy de exemplo da Wallarm tem os seguintes componentes:

* Balanceador de carga de aplicativo voltado para a internet que direciona o tráfego para as instâncias do nó Wallarm.
* Instâncias de nós Wallarm analisando o tráfego e fazendo proxy de quaisquer solicitações subsequentes. Os elementos correspondentes no esquema são as instâncias EC2 A, B, C.

    O exemplo executa os nós Wallarm no modo de monitoramento que impulsiona o comportamento descrito. Os nós da Wallarm também podem operar em outros modos, incluindo aqueles destinados a bloquear solicitações maliciosas e encaminhar apenas aquelas legítimas. Para saber mais sobre os modos de nó do Wallarm, use [nossa documentação](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* Os serviços aos quais os nós Wallarm fazem proxy das solicitações. O serviço pode ser de qualquer tipo, por exemplo:

    * Aplicação AWS API Gateway conectada à VPC via VPC Endpoints (a implementação correspondente do Terraform Wallarm é abordada no [exemplo para API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * Nós EKS executando no cluster EKS (a configuração de um Balanceador de Carga Interno ou serviço NodePort é recomendada para este caso)
    * Qualquer outro serviço de backend

    Por padrão, os nós Wallarm rotearão o tráfego para `https://httpbin.org`. Durante o lançamento deste exemplo, você poderá especificar qualquer outro domínio de serviço ou caminho disponível em Virtual Private Cloud (VPC) para fazer o proxy do tráfego.

    A opção de configuração do módulo `https_redirect_code = 302` permitirá redirecionar com segurança as solicitações HTTP para HTTPS pelo AWS ALB.

Todos os componentes listados (exceto o servidor roteado) serão implementados pelo módulo de exemplo `wallarm` fornecido.

## Componentes de código

Este exemplo possui os seguintes componentes de código:

* `main.tf`: a configuração principal do módulo `wallarm` a ser implementado como uma solução de proxy. A configuração produz um AWS ALB e instâncias Wallarm.
* `ssl.tf`: a configuração de descarregamento SSL/TLS que emite automaticamente um novo Certificado de Gerenciador AWS (ACM) para o domínio especificado na variável `domain_name` e o vincula ao AWS ALB.

    Para desativar o recurso, remova ou comente as instruções nos arquivos `ssl.tf` e `dns.tf`, e também desabilite as opções `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` na definição do módulo `wallarm`. Com o recurso desativado, você poderá usar apenas a porta HTTP (80).
* `dns.tf`: Provisão de configuração AWS Route 53 para registro DNS para o AWS ALB.

    Para desativar o recurso, siga a nota acima.

## Executando a solução de proxy Wallarm AWS de exemplo

1. Cadastre-se no Console Wallarm na [Nuvem da UE](https://my.wallarm.com/nodes) ou [Nuvem dos EUA](https://us1.my.wallarm.com/nodes).
1. Abra o Console Wallarm → **Nodes** e crie o nó do tipo **Wallarm node**.
1. Copie o token do nó gerado.
1. Clone o repositório contendo o código de exemplo para sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Defina os valores das variáveis nas opções `default` no arquivo `examples/proxy/variables.tf` do repositório clonado e salve as alterações.
1. Defina o protocolo do servidor roteado e o endereço em `examples/proxy/main.tf` → `proxy_pass`.

    Por padrão, a Wallarm roteará o tráfego para `https://httpbin.org`. Se o valor padrão atender às suas necessidades, deixe-o inalterado.
1. Implemente a pilha executando os seguintes comandos do diretório `examples/proxy`:

    ```
    terraform init
    terraform apply
    ```

Para remover o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Solução de problemas

### Wallarm cria e termina instâncias repetidamente

A configuração fornecida do grupo de Auto Scaling AWS se concentra na mais alta confiabilidade e suavidade do serviço. A criação e terminação repetidas de instâncias EC2 durante a inicialização do grupo de Auto Scaling AWS podem ser causadas por falhas nas verificações de integridade.

Para resolver o problema, revise e conserte as seguintes configurações:

* O token do nó Wallarm tem o valor válido copiado da IU do Console Wallarm
* A configuração do NGINX é válida
* Os nomes de domínio especificados na configuração do NGINX foram resolvidos com sucesso (por exemplo, o valor `proxy_pass`)


**VIA EXTREMA** Se as configurações acima forem válidas, você pode tentar encontrar a razão do problema desabilitando manualmente as verificações de integridade da ELB nas configurações do grupo de Auto Scaling. Isso manterá as instâncias ativas mesmo se a configuração do serviço for inválida, as instâncias não serão reiniciadas. Você será capaz de analisar completamente os logs e depurar o serviço, ao invés de investigar o problema em poucos minutos.

## Referências

* [Certificados ACM da AWS](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [VPC AWS com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)