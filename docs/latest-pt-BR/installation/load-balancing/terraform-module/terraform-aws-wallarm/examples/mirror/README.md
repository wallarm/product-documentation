# Implementando Wallarm OOB para NGINX, Envoy e espelhamento semelhante usando o Módulo Terraform

Este artigo demonstra o **exemplo** de como implementar o Wallarm na AWS como uma solução Out-of-Band usando o [módulo Terraform do Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/). É esperado que NGINX, Envoy, Istio e/ou Traefik forneçam espelhamento de tráfego.

## Casos de uso

Entre todas as [opções de implementação do Wallarm suportadas](https://docs.wallarm.com/installation/supported-deployment-options), o módulo Terraform é recomendado para a implementação do Wallarm na AWS VPC nestes **casos de uso**:

* Sua infraestrutura existente reside na AWS.
* Você aproveita a prática de Infraestrutura como Código (IaC). O módulo Terraform do Wallarm permite a gestão e provisionamento automatizado do nó Wallarm na AWS, melhorando a eficiência e consistência.

## Requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso à conta com a [função](https://docs.wallarm.com/user-guides/settings/users/#user-roles) de **Administrador** no Console Wallarm nos Clouds EUA ou UE [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)
* Acesso à `https://us1.api.wallarm.com` se trabalhar com o Wallarm Cloud dos EUA ou a `https://api.wallarm.com` se trabalhar com a Wallarm na Nuvem da UE. Por favor, verifique se o acesso não está sendo bloqueado por um firewall

## Arquitetura da solução

![Wallarm para tráfego espelhado](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

Esta solução Wallarm tem os seguintes componentes:

* Balanceador de carga internet-facing direcionando o tráfego para as instâncias do nó Wallarm. Espera-se que um balanceador de carga já tenha sido implementado, o módulo `wallarm` não criará este recurso.
* Qualquer servidor web ou proxy (por exemplo, NGINX, Envoy) servindo tráfego de um balanceador de carga e espelhando solicitações HTTP para um endPoint ALB interno e serviços de back-end. Espera-se que o componente utilizado para o espelhamento de tráfego já tenha sido implementado, o módulo `wallarm` não criará este recurso.
* Um ALB interno aceitando solicitações HTTPS espelhadas de um servidor web ou proxy e as direcionando para as instâncias do nó Wallarm.
* Nó Wallarm analisando solicitações de um ALB interno e enviando dados de tráfego mal-intencionado para a Nuvem Wallarm.

    O exemplo executa os nós Wallarm no modo de monitoramento que impulsiona o comportamento descrito. Se você trocar o [modo](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) para outro valor, os nós continuam a monitorar apenas o tráfego, já que a abordagem [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) não permite o bloqueio de ataques.

Os dois últimos componentes serão implementados pelo módulo `wallarm` fornecido como exemplo.

## Componentes de código

Este exemplo tem os seguintes componentes de código:

* `main.tf`: a principal configuração do módulo `wallarm` a ser implementado como uma solução de espelhamento. A configuração gera um ALB interno na AWS e instâncias Wallarm.

## Executando a solução espelho Wallarm de exemplo

Para executar a solução espelho Wallarm de exemplo, você precisa configurar o espelhamento de solicitações HTTP e, em seguida, implementar a solução.

### 1. Configurando o espelhamento de solicitações HTTP

O espelhamento de tráfego é um recurso fornecido por muitos servidores web e proxy. O [link](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring) fornece a documentação sobre como configurar o espelhamento de tráfego com alguns deles.

### 2. Implementar a solução espelho Wallarm de exemplo

1. Registre-se no Console Wallarm na [Nuvem da UE](https://my.wallarm.com/nodes) ou [Nuvem dos EUA](https://us1.my.wallarm.com/nodes).
1. Abra o Console Wallarm → **Nodes** e crie o nó do tipo **Nó Wallarm**.
1. Copie o token do nó gerado.
1. Clone o repositório contendo o código de exemplo para sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Defina os valores das variáveis nas opções `default` no arquivo `examples/mirror/variables.tf` do repositório clonado e salve as alterações.
1. Implemente a pilha executando os seguintes comandos no diretório `examples/mirror`:

    ```
    terraform init
    terraform apply
    ```

Para remover o ambiente implementado, use o seguinte comando:

```
terraform destroy
```

## Referências

* [AWS VPC com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)