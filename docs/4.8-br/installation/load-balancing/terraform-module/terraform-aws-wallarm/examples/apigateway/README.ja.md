# Implementando o Wallarm como um Proxy para Amazon API Gateway

Neste exemplo, mostramos como usar o [módulo Terraform] (https://registry.terraform.io/modules/wallarm/wallarm/aws/) para implantar o Wallarm como um proxy em linha na AWS Virtual Private Cloud (VPC), protegendo assim o [Amazon API Gateway] (https://aws.amazon.com/api-gateway/).

A solução de proxy do Wallarm oferece uma camada de rede adicional, funcionando como um roteador de tráfego HTTP avançado com recursos de WAF e segurança de API. Ele permite rotear solicitações para quase todos os tipos de serviço, incluindo Amazon API Gateway, sem restrições em sua funcionalidade.

## Principais Características

* O Wallarm processa o tráfego no modo de sincronização, que permite a mitigação de ameaças em tempo real, sem limitar as funcionalidades do Wallarm (`preset=proxy`).
* A solução Wallarm é implantada como uma camada de rede separada, que pode ser controlada independentemente do API Gateway.

## Arquitetura da Solução

![Esquema de Proxy Wallarm] (https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

A solução de proxy Wallarm ilustrada inclui os seguintes componentes:

* Um balanceador de carga de aplicativo com acesso à Internet que roteia o tráfego para as instâncias de nó do Wallarm.
* Instâncias de nó do Wallarm que analisam o tráfego e canalizam todas as solicitações para o API Gateway.

    Nesse exemplo, O nó Wallarm é executado em modo de monitoramento para processar o comportamento descrito. Ele também pode operar em outros modos, destinados a bloquear solicitações mal-intencionadas e encaminhar apenas solicitações legítimas. Para mais detalhes sobre os modos do nó Wallarm, por favor consulte a [documentação] (https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* O API Gateway para o qual o nó Wallarm direciona as solicitações. O API Gateway tem as seguintes configurações:

    * O caminho `/demo/demo` é atribuído.
    * Uma única simulação é definida.
    * Durante a implantação deste módulo Terraform, é possível escolher o tipo de endpoint "regional" ou "privado" do [API Gateway] (https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html). Detalhes sobre esses tipos e sobre transições entre eles são fornecidos abaixo.

    Tenha em mente que o exemplo fornecido implementa um API Gateway normal da Amazon, portanto, seu comportamento não é afetado pelo nó Wallarm.

Todos os componentes listados são implantados pelo módulo de exemplo `wallarm`.

## Componentes de Código

Este exemplo inclui os seguintes componentes de código:

* `main.tf`: Configuração principal do módulo `wallarm` que é implantado como uma solução de proxy. A configuração gera AWS ALB e instâncias Wallarm.
* `apigw.tf`: Configuração que gera o Amazon API Gateway, acessível no caminho `/demo/demo`. Uma simulação única está configurada. Durante a implantação do módulo, também é possível escolher entre tipos de endpoint "regionais" e "privados" (consulte os detalhes abaixo).
* `endpoint.tf`: Configuração do AWS VPC Endpoint. É destinado ao tipo "privado" do endpoint API Gateway.

## Diferenças entre os Tipos de Endpoints "Regional" e "Privado" da API Gateway

A variável `apigw_private` define o tipo de endpoint da API Gateway:

* Com a opção "regional", as instâncias do nó Wallarm enviam solicitações para o serviço `execute-api` do API Gateway disponível publicamente. 
* Com a opção "privada", as solicitações são enviadas para um Endpoint AWS VPC conectado ao serviço `execute-api`. **Para implantações de produção, a opção "privada" é recomendada.**

### Outras Opções para Restringir o Acesso à API Gateway

A Amazon permite que você restrinja o acesso ao API Gateway, independentemente do tipo do endpoint "privado" ou "regional", como abaixo:

* Use [políticas de recursos](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) para limitar o acesso a qualquer um dos dois tipos de endpoints.
* Se o tipo de endpoint for "privado", gerencie o acesso ao [IP de origem] (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html).
* Se o tipo de endpoint for "privado", o que implica que o API Gateway é projetado para ser inacessível a partir de uma rede pública, gerencie o acesso por [VPC e/ou Endpoints] (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html).

### Transições Entre os Tipos de Endpoints da API Gateway

Você pode alterar o tipo de endpoint da API Gateway sem recriar os componentes, mas observe as seguintes considerações:

* Quando você altera o tipo de "regional" para "privado", o endpoint público se torna privado e, portanto, inacessível a partir de recursos públicos. Isso se aplica tanto ao endpoint `execute-api` quanto aos nomes de domínio.
* Ao alterar de "privado" para "regional", o endpoint AWS VPC direcionado à API Gateway é desassociado imediatamente, tornando a API Gateway indisponível.
* Como a versão de comunidade do NGINX não detecta automaticamente alterações nos nomes de DNS, a alteração do tipo de endpoint deve ser seguida por um reinício manual do NGINX nas instâncias a partir dos nós Wallarm. 

    Você pode reiniciar ou recriar as instâncias, ou executar `nginx -s reload` em cada instância.

Ao alterar o tipo de endpoint de "regional" para "privado":

1. Crie um endpoint da AWS VPC e conecte-o ao `execute-api`. Um exemplo está no arquivo de configuração `endpoint.tf`.
1. Mude o tipo do endpoint da API Gateway, especificando o endpoint da AWS VPC na configuração da API Gateway. Quando essa operação for concluída, o fluxo de tráfego será interrompido.
1. Execute `nginx -s reload` em cada instância do nó Wallarm ou simplesmente recrie cada nó do Wallarm. Quando essa operação for concluída, o fluxo de tráfego será retomado.

Alterar o tipo de endpoint de "privado" para "regional" geralmente não é recomendado, mas para fazê-lo:

1. Delete o endpoint necessário no modo "privado" que você opera e então altere o endpoint da API Gateway para "regional".
1. Execute `nginx -s reload` em cada instância do nó Wallarm ou simplesmente recrie cada nó do Wallarm. Quando essa operação for concluída, o fluxo de tráfego será retomado.

**Em ambiente de produção, é recomendado mudar a API Gateway para "privado"**. Caso contrário, o tráfego do nó Wallarm para a API Gateway seria enviado pela rede pública, incorrendo em cobranças adicionais.

## Pré-requisitos

* Terraform 1.0.5 ou superior instalado localmente ([download aqui] (https://learn.hashicorp.com/tutorials/terraform/install-cli))
* Acesso à conta com função de **Administrador** Wallarm Console ([nuvem da UE] (https://my.wallarm.com/) ou nuvem dos [EUA] (https://us1.my.wallarm.com/))
* Acesso a `https://api.wallarm.com` se estiver trabalhando na nuvem Wallarm da UE, e acesso a `https://us1.api.wallarm.com` se estiver trabalhando na nuvem Wallarm dos EUA. Certifique-se de que seu firewall não está bloqueando o acesso.

## Exemplo de Execução da Solução de Proxy Wallarm AWS para API Gateway

1. Inscreva-se no Wallarm Console [nuvem da UE] (https://my.wallarm.com/nodes) ou [nuvem dos EUA] (https://us1.my.wallarm.com/nodes).
1. Abra Wallarm Console → **Nós** e crie um nó do tipo **Nó Wallarm**.
1. Copie o token do nó gerado.
1. Duplicar o repositório contendo o código de exemplo para sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Defina os valores das variáveis no padrão dentro do arquivo `variables.tf` no repositório duplicado em `examples/apigateway` e salve as alterações.
1. Execute os seguintes comandos para implantar a pilha a partir do diretório `examples/apigateway`:

    ```
    terraform init
    terraform apply
    ```

Para remover o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Referências

* [AWS VPC com sub-redes públicas e privadas (NAT)] (https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [APIs privadas do API Gateway] (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [Políticas do API Gateway] (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [Exemplos de políticas do API Gateway] (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [Tipos de API Gateway] (https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)