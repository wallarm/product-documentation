# Exemplos de implantação do módulo Wallarm AWS Terraform: Solução avançada de proxy

Este exemplo descreve como implantar o Wallarm como um proxy inline com configurações avançadas em um Virtual Private Cloud (VPC) da AWS existente usando o módulo Terraform. É semelhante ao [implantação de proxy simples](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy), mas apresenta opções de configurações avançadas frequentemente usadas.

Se você está tendo dificuldades para começar com este exemplo, recomendamos que você veja primeiro a [exemplo de proxy simples](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy).

A solução avançada de proxy da Wallarm (incluindo também a solução simples) fornece um camada adicional de rede com recursos de WAF e segurança de API como um roteador avançado de tráfego HTTP.

## Características principais

A solução de proxy avançada difere da solução simples das seguintes maneiras:

* Esta solução não cria um balanceador de carga ( `lb_enabled=false` ), mas ainda assim cria um grupo de destino que pode ser anexado ao balanceador de carga existente.

    Isso permite que você mude facilmente para uma abordagem de processamento de tráfego síncrono.
* As configurações do NGINX e da Wallarm são específicadas não apenas em variáveis padrão, mas também nos snippets do NGINX `global_snippet` , `http_snippet` , `server_snippet`.
* Após o script de inicialização do nó Wallarm (cloud-init) ser concluído, um script personalizado `post-cloud-init.sh` coloca a página de índice HTML personalizada na instância do diretório `/var/www/mysite/index.html`.
* A pilha implantada está associada a políticas adicionais do AWS IAM que permitem acesso somente leitura ao AWS S3.

    Se você estiver usando este exemplo "como está", o acesso fornecido não será necessário. No entanto, o arquivo `post-cloud-init.sh` inclui um exemplo inativo de uma solicitação de arquivo do AWS S3, que geralmente requer acesso especial. Se você pretende ativar o código do S3 do arquivo `post-cloud-init.sh`, você precisará especificar a política de acesso ao S3 no AWS IAM dentro da variável `extra_policies`.
* Esta solução permite conexões de entrada para a instância Wallarm a partir da porta da rede interna adicional 7777. Isso é configurado pela variável `extra_ports` e pelo `http_snippet.conf`.

    Para permitir a porta 7777 para `0.0.0.0/0` , você também pode opcionalmente usar a variável `extra_public_ports` .
* Os nós da Wallarm processam o tráfego no modo de bloqueio.

## Arquitetura da solução

![Esquema do Proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

A solução avançada de proxy Wallarm do exemplo inclui os seguintes componentes:

* Grupo de destino anexado ao grupo de Auto Scaling sem balanceador de carga.
* Instâncias de nó Wallarm que analisam o tráfego, bloqueiam solicitações maliciosas e fazem proxy de solicitações legítimas.

    Neste exemplo, executamos os nós Wallarm no modo de bloqueio, que impulsiona o comportamento descrito. Os nós Wallarm também podem operar em outros modos que visam apenas o monitoramento de tráfego, sem bloquear solicitações maliciosas. Consulte [nossa documentação](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) para obter detalhes sobre os modos do nó Wallarm.
* Os nós Wallarm fazem proxy do tráfego para `https://httpbin.org`.

    Durante a execução deste exemplo, você pode especificar outros domínios e caminhos de serviço disponíveis a partir do VPC da AWS para serem usados como proxy de tráfego.

Todos os componentes listados (com exceção do servidor proxy) são implantados pelo módulo de exemplo `wallarm` fornecido.

## Componentes do código

Este exemplo inclui os seguintes componentes de código:

* `main.tf` : A configuração principal do módulo `wallarm` é implantada como uma solução avançada de proxy.
* `global_snippet.conf` : Um exemplo de configuração personalizada do NGINX que é adicionada à configuração global do NGINX usando a variável `global_snippet`. A configuração montada pode incluir diretivas como `load_module` , `stream` , `mail` , `env` , etc.
* `http_snippet.conf` : Uma configuração personalizada do NGINX que é adicionada ao contexto `http` do NGINX usando a variável `http_snippet`. A configuração montada pode incluir diretivas como `map` , `server` , etc.
* `server_snippet.conf` : Uma configuração personalizada do NGINX que é adicionada ao contexto `server` do NGINX usando a variável `server_snippet`. A configuração montada pode introduzir lógica `if` do NGINX e as configurações `location` necessárias.

    Esta configuração de snippet é aplicada apenas à porta 80. Para abrir outras portas, especifique a diretiva `server` correspondente em `http_snippet`.

    No arquivo `server_snippet.conf` , você também pode encontrar um exemplo de configuração mais complexo.
* `post-cloud-init.sh` : Um script personalizado que coloca a página de índice HTML personalizada na instância do diretório `/var/www/mysite/index.html`. Este script é executado após a inicialização do nó Wallarm (o script cloud-init).

    No arquivo `post-cloud-init.sh` , você também pode encontrar um exemplo de comando que coloca o conteúdo do AWS S3 no diretório da instância. Não se esqueça de especificar a política de acesso ao S3 dentro da variável `extra_policies` se você planeja usar esta opção.

## Execução da solução de proxy Wallarm AWS

1. Inscreva-se no Console Wallarm na [Nuvem da UE](https://my.wallarm.com/nodes) ou na [Nuvem dos EUA](https://us1.my.wallarm.com/nodes).
2. Abra Wallarm Console → **Nodes** e crie um nó do tipo **Wallarm Node**.
3. Copie o token do nó gerado.
4. Clone o repositório contendo o código do exemplo para o seu computador:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
5. Configure os valores das variáveis na opção `default` dentro do arquivo `variables.tf` em `examples/advanced` do repositório clonado e salve suas alterações.
6. Configure o protocolo e o endereço do servidor que será feito proxy em `proxy_pass` dentro de `examples/advanced/main.tf`.

    Por padrão, Wallarm faz proxy do tráfego para `https://httpbin.org`. Se o valor padrão atender às suas necessidades, deixe-o como está.
7. Execute os seguintes comandos no diretório `examples/advanced` para implantar a pilha:

    ```
    terraform init
    terraform apply
    ```

Para remover o ambiente implantado, use o seguinte comando:

```
terraform destroy
```

## Referências

* [Anexar um balanceador de carga ao Auto Scaling Group da AWS](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [VPC da AWS com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Documentação da Wallarm](https://docs.wallarm.com)