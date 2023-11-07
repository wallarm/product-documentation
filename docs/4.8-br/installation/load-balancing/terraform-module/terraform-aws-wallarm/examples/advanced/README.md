# Exemplo de implantação do Módulo Terraform AWS Wallarm: solução avançada de proxy

Este exemplo demonstra como implantar o Wallarm como um proxy inline com configurações avançadas em uma Virtual Private Cloud (VPC) da AWS existente, usando o módulo Terraform. É muito semelhante à [implantação de proxy simples](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy), mas com algumas opções de configuração avançadas frequentes demonstradas.

Para um começo mais fácil com este exemplo, dê uma olhada primeiro no [exemplo de proxy simples](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy).

A solução avançada de proxy Wallarm (bem como um proxy simples) fornece uma camada de rede funcional adicional que atua como um roteador avançado de tráfego HTTP com as funções de segurança WAF e API.

## Principais características

A solução avançada de proxy difere da simples da seguinte maneira:

* A solução não cria nenhum balanceador de carga (`lb_enabled=false`), mas ainda cria um grupo de destino que você pode anexar posteriormente a um balanceador de carga existente.

    Isso pode ajudar a mudar para a abordagem de processamento de tráfego síncrono de maneira transparente.
* A configuração do NGINX e Wallarm é especificada não apenas nas variáveis padrão, mas também nos trechos de código `global_snippet`, `http_snippet` e `server_snippet` do NGINX.
* Uma vez que o script de inicialização do nó Wallarm (cloud-init) esteja concluído, o script personalizado `post-cloud-init.sh` colocará a página de índice HTML personalizada no diretório da instância `/var/www/mysite/index.html`.
* A pilha implantada está associada à política extra do IAM da AWS que permite o acesso somente leitura à AWS S3.

    Se usar este exemplo "como está", o acesso fornecido não será necessário. No entanto, o arquivo `post-cloud-init.sh` contém um exemplo inativo de solicitação de arquivos da AWS S3 que geralmente requer acesso especial. Se você ativar o código S3 do arquivo `post-cloud-init.sh`, precisará especificar as políticas de acesso IAM da AWS S3 na variável `extra_policies`.
* A solução permite conexões de entrada para instâncias Wallarm a partir da porta de rede interna extra, 7777. Isso é configurado com a variável `extra_ports` e `http_snippet.conf`.

    Para permitir a porta 7777 para `0.0.0.0/0`, você pode usar a variável `extra_public_ports` (opcionalmente).
* O nó Wallarm processa o tráfego no modo de bloqueio.

## Arquitetura da solução

![Esquema de proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

O exemplo avançado de solução de proxy Wallarm tem os seguintes componentes:

* Grupo-alvo anexado ao grupo de Auto Scaling sem balanceador de carga.
* Instâncias de nó Wallarm analisando o tráfego, bloqueando solicitações maliciosas e fazendo proxy de solicitações legítimas posteriores.

    O exemplo executa os nós Wallarm no modo de bloqueio que resulta no comportamento descrito. Os nós Wallarm também podem operar em outros modos, incluindo aqueles focados apenas no monitoramento de tráfego, sem o bloqueio de solicitações maliciosas. Para saber mais sobre os modos de nó Wallarm, use [nossa documentação](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* Os nós Wallarm fazem proxy do tráfego para `https://httpbin.org`.

    Durante o lançamento deste exemplo, você poderá especificar qualquer outro domínio ou caminho de serviço disponível na Virtual Private Cloud (VPC) da AWS para fazer o proxy de tráfego.

Todos os componentes listados (exceto para o servidor proxied) serão implantados pelo módulo de exemplo `wallarm` fornecido.

## Componentes do código

Este exemplo possui os seguintes componentes de código:

* `main.tf`: a configuração principal do módulo `wallarm` a ser implantado como uma solução avançada de proxy.
* `global_snippet.conf`: exemplo de uma configuração personalizada do NGINX a ser adicionada à configuração global do NGINX usando a variável `global_snippet`. A configuração montada pode incluir diretivas como `load_module`, `stream`, `mail` ou `env`.
* `http_snippet.conf`: configuração personalizada do NGINX a ser adicionada ao contexto `http` do NGINX usando a variável `http_snippet`. A configuração montada pode incluir diretivas como `map` ou `server`.
* `server_snippet.conf`: configuração personalizada do NGINX a ser adicionada ao contexto `server` do NGINX usando a variável `server_snippet`. A configuração montada pode introduzir a lógica `if` do NGINX e as configurações `location` necessárias.

    Esta configuração de trecho será aplicada apenas à porta 80. Para abrir outra porta, especifique a diretiva `server` correspondente em `http_snippet`.

    No arquivo `server_snippet.conf`, você também encontrará um exemplo de configuração mais complicado.
* `post-cloud-init.sh`: o script personalizado que coloca a página de índice HTML personalizada no diretório da instância `/var/www/mysite/index.html`. O script será executado após a inicialização do nó Wallarm (o script cloud-init).

    No arquivo `post-cloud-init.sh`, você também encontrará os comandos de exemplo para colocar o conteúdo do AWS S3 no diretório da instância. Se usar esta opção, não se esqueça de especificar a política de acesso ao S3 na variável `extra_policies`.

## Executando o exemplo da solução proxy AWS Wallarm

1. Inscreva-se no Console Wallarm na [Nuvem EU](https://my.wallarm.com/nodes) ou [Nuvem US](https://us1.my.wallarm.com/nodes).
1. Abra o Console Wallarm → **Nós** e crie o nó do tipo **Nó Wallarm**.
1. Copie o token do nó gerado.
1. Clone o repositório que contém o código de exemplo para sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Defina os valores das variáveis nas opções `default` no arquivo `variables.tf` da pasta `examples/advanced` do repositório clonado e salve as alterações.
1. Defina o protocolo e o endereço do servidor proxied em `examples/advanced/main.tf` → `proxy_pass`.

    Por padrão, o Wallarm fará proxy do tráfego para `https://httpbin.org`. Se o valor padrão atender às suas necessidades, deixe-o como está.
1. Implante a pilha executando os seguintes comandos no diretório `examples/advanced`:

    ```
    terraform init
    terraform apply
    ```

Para remover o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Referências

* [Anexando um balanceador de carga AWS a um grupo de Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [VPC da AWS com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Documentação Wallarm](https://docs.wallarm.com)
