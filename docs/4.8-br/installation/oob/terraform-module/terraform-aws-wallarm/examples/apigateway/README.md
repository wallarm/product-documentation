# Implantando o Wallarm como Proxy para Amazon API Gateway

Este exemplo demonstra como proteger [Amazon API Gateway](https://aws.amazon.com/api-gateway/) com Wallarm implantado como proxy inline para AWS Virtual Private Cloud (VPC) usando o [módulo Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

A solução de proxy Wallarm fornece uma camada de rede funcional adicional atuando como um roteador de tráfego HTTP avançado com as funções de segurança WAF e API. Ele pode rotear solicitações para quase qualquer tipo de serviço, incluindo Amazon API Gateway, sem limitar suas capacidades.

## Casos de uso

Entre todas as [opções de implantação do Wallarm suportadas](https://docs.wallarm.com/installation/supported-deployment-options), o módulo Terraform é recomendado para a implantação do Wallarm no AWS VPC nestes **casos de uso**:

* Sua infraestrutura existente reside na AWS.
* Você aproveita a prática de Infraestrutura como Código (IaC). O módulo Terraform do Wallarm permite o gerenciamento e provisionamento automatizado do nó Wallarm na AWS, aprimorando a eficiência e consistência.

## Requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso à conta com a função de **Administrador** [role](https://docs.wallarm.com/user-guides/settings/users/#user-roles) no Console Wallarm no [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud) dos EUA ou da UE
* Acesso a `https://us1.api.wallarm.com` se trabalhando com Wallarm Cloud dos EUA ou para `https://api.wallarm.com` se estiver trabalhando com Wallarm Cloud da UE. Certifique-se de que o acesso não está bloqueado por um firewall

## Arquitetura da solução

![Esquema do proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

A solução de proxy Wallarm de exemplo tem os seguintes componentes:

* Application Load Balancer voltado para a internet roteando tráfego para as instâncias de nó Wallarm.
* Instâncias de nó Wallarm analisando o tráfego e fazendo proxy de quaisquer solicitações para API Gateway.

    O exemplo executa os nós Wallarm no modo de monitoramento que direciona o comportamento descrito. Os nós Wallarm também podem operar em outros modos, incluindo aqueles destinados a bloquear solicitações maliciosas e encaminhar apenas aquelas legítimas ainda. Para saber mais sobre os modos de nó do Wallarm, use [nossa documentação](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* API Gateway para o qual os nós Wallarm fazem proxy das solicitações. O API Gateway tem as seguintes configurações:

    * O caminho `/demo/demo` atribuído.
    * Um único mock configurado.
    * Durante esta implantação do módulo Terraform, você pode escolher entre o tipo de endpoint "regional" ou "privado" [para o API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html). Mais detalhes sobre esses tipos e a migração entre eles são fornecidas abaixo.

    Observe que o exemplo fornecido implanta um Amazon API Gateway regular, portanto, sua operação não será afetada pelos nós Wallarm.

Todos os componentes listados, incluindo o API Gateway, serão implantados pelo módulo de exemplo `wallarm` fornecido.

## Componentes do código

Este exemplo tem os seguintes componentes de código:

* `main.tf`: a configuração principal do módulo `wallarm` a ser implantado como uma solução de proxy. A configuração produz um AWS ALB e instâncias Wallarm.
* `apigw.tf`: a configuração que produz o Amazon API Gateway acessível sob o caminho `/demo/demo` com uma única integração de mock configurada. Durante a implantação do módulo, você também pode escolher entre o tipo de ponto de extremidade "regional" ou "privado" (veja detalhes abaixo).
* `endpoint.tf`: a configuração do ponto de extremidade AWS VPC para o tipo "privado" do ponto de extremidade do API Gateway.

## Diferença entre os terminais "regional" e "privado" da API Gateway

A variável `apigw_private` define o tipo de endpoint da API Gateway:

* Com a opção "regional", as instâncias de nó Wallarm enviarão solicitações para o serviço [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) do API Gateway disponível ao público.
* Com a opção "privada" - para os pontos finais do AWS VPC anexados ao serviço `execute-api`. **Para implantação de produção, a opção "privada" é a recomendada.**

### Mais opções para restringir o acesso ao API Gateway

A Amazon também permite que você restrinja o acesso ao seu API Gateway, independentemente do tipo de endpoint "privado" ou "regional", da seguinte maneira:

* Usando [políticas de recursos](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) com qualquer um dos dois tipos de extremidades especificados.
* Gerenciando o acesso por [IPs de origem](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html), se o tipo de endpoint for "privado".
* Gerenciando o acesso por [VPC e/ou Endpoint](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html), se o tipo de endpoint for "privado" que já pressupõe que o API Gateway esteja indisponível a partir de redes públicas por design.

### Migração entre os tipos de endpoint do API Gateway

Você pode alterar o tipo de endpoint do API Gateway sem recriar o componente, mas considere o seguinte:

* Uma vez que o tipo é alterado de "regional" para "privado", os endpoints públicos se tornarão privados e, portanto, indisponíveis a partir de recursos públicos. Isso se aplica tanto aos endpoints `execute-api` quanto aos nomes de domínio.
* Uma vez que o tipo é alterado de "privado" para "regional", os terminais VPC AWS direcionados ao seu API Gateway serão imediatamente dissociados, e o API Gateway ficará indisponível.
* Como o NGINX da versão da comunidade não pode detectar automaticamente mudanças no nome do DNS, o tipo de endpoint alterado deve ser seguido pelo reinício manual do NGINX nas instâncias do nó Wallarm.

    Você pode reiniciar, recriar instâncias ou executar `nginx -s reload` em cada instância.

Se estiver alterando o tipo de endpoint de "regional" para "privado":

1. Crie o endpoint AWS VPC e anexe-o a `execute-api`. Você encontrará o exemplo no arquivo de configuração `endpoint.tf`.
1. Mude o tipo de endpoint da API Gateway e especifique o endpoint AWS VPC na configuração da API Gateway. Uma vez concluído, o fluxo de tráfego será interrompido.
1. Execute `nginx -s reload` em cada instância do nó Wallarm ou simplesmente recrie cada nó Wallarm. Uma vez concluído, o fluxo de tráfego será restaurado.

Não é recomendado alterar o tipo de endpoint de "privado" para "regional", mas se você fizer isso:

1. Remova o endpoint necessário para rodar no modo "privado" e somente então mude o endpoint da API Gateway para "regional".
1. Execute `nginx -s reload` em cada instância do nó Wallarm ou simplesmente recrie cada nó Wallarm. Uma vez concluído, o fluxo de tráfego será restaurado.

**Para a produção, é recomendado mudar seu API Gateway para "privado"**, caso contrário, o tráfego dos nós Wallarm para o API Gateway passará pela rede pública e poderá gerar encargos adicionais.

## Executando a solução de proxy Wallarm AWS de exemplo para API Gateway

1. Inscreva-se no Console Wallarm no [Cloud da UE](https://my.wallarm.com/nodes) ou [Cloud dos EUA](https://us1.my.wallarm.com/nodes).
1. Abra o Console Wallarm → **Nós** e crie o nó do tipo **Nó Wallarm**.
1. Copie o token de nó gerado.
1. Clone o repositório contendo o código de exemplo em sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Defina os valores da variável nas opções `default` no arquivo `examples/apigateway/variables.tf` do repositório clonado e salve as alterações.
1. Implante a pilha executando os seguintes comandos do diretório `examples/apigateway`:

    ```
    terraform init
    terraform apply
    ```

Para remover o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Referências

* [AWS VPC com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [APIs privadas do API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [Políticas do API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [Exemplos de Políticas do API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [Tipos de API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)