# Implantando o Espelhamento Wallarm OOB de NGINX, Envoy, e semelhantes com o Módulo Terraform

Este artigo mostra um **exemplo** de como usar o [Módulo Terraform da Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/) para implantar a Wallarm no AWS como uma solução Out-of-Band. É esperado que NGINX, Envoy, Istio, e/ou Traefik forneçam espelhamento de tráfego.

## Características principais

* Wallarm processa tráfego em um modo assíncrono (`preset=mirror`), sem afetar o fluxo de tráfego atual, tornando essa abordagem a mais segura.
* A solução Wallarm é implantada como uma camada de rede separada, controlável independentemente de outras camadas, e pode ser posicionada em quase qualquer lugar na estrutura de rede. O local recomendado é dentro de uma rede privada.

## Arquitetura da solução

![Wallarm para tráfego espelhado](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

A solução Wallarm nesta demonstração inclui:

* Balanceador de carga com interface para a Internet (Internet-facing) que roteia tráfego para instâncias de nó Wallarm. É esperado que o balanceador de carga já esteja implantado, e o módulo `wallarm` não criará este recurso.
* Qualquer servidor web ou proxy que forneça tráfego do balanceador de carga e espelhe solicitações HTTP para o ponto de extremidade do ALB interno e o serviço backend (ex: NGINX, Envoy). O componente usado para espelhamento de tráfego é esperado que já esteja implantado, e o módulo `wallarm` não criará este recurso.
* ALB interno que aceita solicitações HTTPS espelhadas do servidor web ou proxy e as redireciona para instâncias de nó Wallarm.
* Nó Wallarm que analisa solicitações vindo do ALB interno e envia dados de tráfego malicioso para a nuvem Wallarm.

    Nesta demonstração, o nó Wallarm é executado no modo de monitoramento que conduz ao comportamento descrito acima. Ao mudar o [modo](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) para outro valor, o nó continuará a monitorar o tráfego, uma vez que a abordagem [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) não permite bloquear ataques.

Os dois últimos componentes são implantados pelo módulo `wallarm` do exemplo fornecido.

## Componentes do código

Este exemplo inclui os seguintes componentes de código:

* `main.tf`: configuração principal do módulo `wallarm` que é implantado como uma solução de espelhamento. Esta configuração gera o ALB interno da AWS e as instâncias Wallarm.

## Configurando o espelhamento de solicitações HTTP

O espelhamento de tráfego é um recurso oferecido por vários servidores web e proxies. Este [link](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring) fornece documentação sobre como configurar o espelhamento de tráfego em vários servidores.

## Limitações

Apesar da solução do exemplo descrito ser a solução Wallarm Out-of-Band mais funcional, existem algumas limitações inerentes à abordagem assíncrona:

* Como a análise de tráfego acontece independentemente do fluxo de tráfego atual, o nó Wallarm não bloqueará solicitações maliciosas instantaneamente.
* Esta solução requer componentes adicionais, que são um servidor web ou proxy que fornece espelhamento de tráfego ou uma ferramenta semelhante (ex: NGINX, Envoy, Istio, Traefik, módulo Kong personalizado, etc).

## Executando a solução de espelhamento do exemplo Wallarm

1. Cadastre-se no console Wallarm na [Nuvem EU](https://my.wallarm.com/nodes) ou [Nuvem US](https://us1.my.wallarm.com/nodes).
1. Abra Wallarm Console → **Nós** e crie um nó do tipo **Nó Wallarm**.
1. Copie o token do nó gerado.
1. Clone o repositório que contém o código do exemplo para sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Configure os valores das variáveis na opção `default` do arquivo `variables.tf` no repositório clonado em `examples/mirror` e salve as alterações.
1. A partir do diretório `examples/mirror`, execute os seguintes comandos para implantar a stack:

    ```
    terraform init
    terraform apply
    ```

Para destruir o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Material de referência

* [VPC da AWS com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)