[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md

# Atualizando a imagem Docker baseada em NGINX ou Envoy

Estas instruções descrevem os passos para atualizar a imagem Docker em execução baseada em NGINX ou Envoy 4.x para a versão 4.8.

!!! warning "Usando credenciais de um nó Wallarm já existente"
    Não recomendamos o uso de um nó Wallarm já existente da versão anterior. Siga estas instruções para criar um novo nó de filtragem da versão 4.8 e implantá-lo como um container Docker.

Para atualizar o nó no fim da vida útil (3.6 ou inferior), por favor use [outras instruções](older-versions/docker-container.md).

## Requisitos

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## Passo 1: Baixe a imagem atualizada do nó de filtragem

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:4.8.0-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## Passo 2: Atualize a página de bloqueio do Wallarm (se atualizar imagem baseada em NGINX)

Na nova versão do nó, a página de bloqueio de amostra do Wallarm foi [alterada](what-is-new.md#new-blocking-page). O logotipo e o e-mail de suporte na página agora estão vazios por padrão.

Se o container Docker foi configurado para retornar a página `&/usr/share/nginx/html/wallarm_blocked.html` para solicitações bloqueadas, altere esta configuração da seguinte maneira:

1. [Copie e personalize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) a nova versão de uma página de amostra.
1. [Monte](../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) a página personalizada e o arquivo de configuração NGINX em um novo container Docker na próxima etapa.

## Passo 3: Pare o container em execução

```bash 
docker stop <RUNNING_CONTAINER_NAME>
```

## Passo 4: Execute o container usando a nova imagem

1. Vá para Wallarm Console → **Nodes** e crie o **Nó Wallarm**.

    ![Criação de um nó Wallarm](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Copie o token gerado.
1. Execute a imagem atualizada usando o token copiado. Você pode passar os mesmos parâmetros de configuração que foram passados ao executar uma versão anterior da imagem (exceto pelo token de nó).
    
    Existem duas opções para executar o container usando a imagem atualizada:

    * **Com as variáveis de ambiente** especificando a configuração básica do nó de filtragem
        * [Instruções para o container Docker baseado em NGINX →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
        * [Instruções para o container Docker baseado em Envoy →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * **No arquivo de configuração montado** especificando a configuração avançada do nó de filtragem
        * [Instruções para o container Docker baseado em NGINX →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
        * [Instruções para o container Docker baseado em Envoy →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Passo 5: Teste a operação do nó de filtragem

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Passo 6: Delete o nó de filtragem da versão anterior

Se a imagem implantada da versão 4.8 operar corretamente, você pode excluir o nó de filtragem da versão anterior em Wallarm Console → **Nodes**.
