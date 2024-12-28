[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# Atualizando uma imagem Docker NGINX- ou Envoy-based EOL

Essas instruções descrevem as etapas para atualizar a imagem Docker NGINX- ending- ou Envoy-based (versão 3.6 e inferior) para a versão 4.8.

--8<-- "../include-pt-BR/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/requirements-docker-nginx-4.0.md"

## Passo 1: Informe o suporte técnico da Wallarm que você está atualizando os módulos do nó de filtragem (somente se atualizando o nó 2.18 ou inferior)

Se estiver atualizando o nó 2.18 ou inferior, informe ao [Suporte Técnico da Wallarm](mailto:support@wallarm.com) que você está atualizando os módulos do nó de filtragem para 4.8 e peça para ativar a nova lógica de lista de IPs para a sua conta da Wallarm. Quando a nova lógica da lista de IPs estiver ativada, confira se a seção [**Listas de IP**](../../user-guides/ip-lists/overview.md) do Console Wallarm está disponível.

## Passo 2: Desative o módulo de verificação de ameaça ativa (somente se atualizando o nó 2.16 ou inferior)

Se estiver atualizando o nó Wallarm 2.16 ou inferior, desative o módulo [Verificação de ameaça ativa](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) no Wallarm Console → **Vulnerabilidades** → **Configurar**.

A operação do módulo pode causar [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives) durante o processo de atualização. Desativar o módulo minimiza esse risco.

## Passo 3: Atualize a porta da API

--8<-- "../include-pt-BR/waf/upgrade/api-port-443.md"

## Passo 4: Baixe a imagem atualizada do nó de filtragem 

=== "Imagem baseada em NGINX"
    ``` bash
    docker pull wallarm/node:4.8.0-1
    ```
=== "Imagem baseada em Envoy"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## Passo 5: Mude para a conexão baseada em token com o Wallarm Cloud

Com o lançamento da versão 4.x, a abordagem como se conectar ao Wallarm Cloud foi atualizada como segue:

* [A abordagem baseada em "email e senha" foi descontinuada](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens). Nessa abordagem, o nó foi registrado no Wallarm Cloud automaticamente ao iniciar o contêiner com as credenciais corretas passadas nas variáveis `DEPLOY_USER` e `DEPLOY_PASSWORD`.
* A abordagem baseada em token foi incluída. Para conectar o container ao Cloud, execute o container com a variável `WALLARM_API_TOKEN` contendo o token do nó Wallarm copiado da UI do Console Wallarm.

Recomenda-se usar a nova abordagem para executar a imagem 4.8. A abordagem baseada em "email e senha" será excluída em versões futuras, portanto, faça a migração antes.

Para criar um novo nó Wallarm e obter seu token:

1. Abra o Wallarm Console → **Nós** no [US Cloud](https://us1.my.wallarm.com/nodes) ou [EU Cloud](https://my.wallarm.com/nodes) e crie o nó do tipo **Nó Wallarm**.

    ![Criação do nó Wallarm](../../images/user-guides/nodes/create-cloud-node.png)
1. Copie o token gerado.

## Passo 6: Migrar allowlists e denylists da versão anterior do nó Wallarm para 4.8 (somente se atualizando o nó 2.18 ou inferior)

Se estiver atualizando o nó 2.18 ou inferior, [migre](../migrate-ip-lists-to-node-3.md) a configuração de allowlist e denylist da versão anterior do nó Wallarm para 4.8.

## Passo 7: Mude das opções de configuração descontinuadas

Existem as seguintes opções de configuração descontinuadas:

* A variável de ambiente `WALLARM_ACL_ENABLE` foi descontinuada. Se as listas de IP foram [migradas](../migrate-ip-lists-to-node-3.md) para a nova versão do nó, remova esta variável do comando `docker run`.
* As seguintes diretivas NGINX foram renomeadas:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

Nós apenas alteramos os nomes das diretivas, a lógica delas permanece a mesma. As diretivas com os nomes anteriores serão descontinuadas em breve, então você é recomendado a renomeá-las antes.
    
Por favor, verifique se as diretivas com os nomes antigos estão explicitamente especificadas nos arquivos de configuração montados. Se sim, renomeie-os.
* A [variável de registro](../../admin-en/configure-logging.md#filter-node-variables) `wallarm_request_time` foi renomeada para `wallarm_request_cpu_time`.

Nós apenas alteramos o nome da variável, a lógica dela permanece a mesma. O nome antigo também é temporariamente suportado, mas mesmo assim é recomendável renomear a variável.
* Os seguintes parâmetros do Envoy foram renomeados:

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * Seção `tsets` → `rulesets` e, correspondente, as entradas `tsN` nesta seção → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

Nós apenas alteramos os nomes dos parâmetros, a lógica deles permanece a mesma. Os parâmetros com nomes antigos serão descontinuados em breve, então você é recomendado a renomeá-los antes.
    
Por favor, verifique se os parâmetros com os nomes antigos estão explicitamente especificados nos arquivos de configuração montados. Se sim, renomeie-os.

## Passo 8: Atualize a página de bloqueio do Wallarm (se atualizando a imagem baseada em NGINX)

Na nova versão do nó, a página de amostra de bloqueio do Wallarm foi [alterada](what-is-new.md#new-blocking-page). O logotipo e o email de suporte na página agora estão vazios por padrão.

Se o container Docker foi configurado para retornar a página `&/usr/share/nginx/html/wallarm_blocked.html` para solicitações bloqueadas, altere essa configuração da seguinte forma:

1. [Copie e personalize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) a nova versão de uma página de amostra.
1. [Monte](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) a página personalizada e o arquivo de configuração NGINX em um novo container Docker na próxima etapa.

## Passo 9: Transfira a configuração de detecção de ataque `overlimit_res` de diretivas para a regra

--8<-- "../include-pt-BR/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## Passo 10: Pare o container em execução

```bash
docker stop <NOME_DO_CONTAINER_EXECUTANDO>
```

## Passo 11: Execute o container usando a imagem atualizada

Execute o contêiner usando a imagem atualizada. Você pode passar os mesmos parâmetros de configuração que foram passados ao executar uma versão de imagem anterior, exceto os listados nas etapas anteriores.

Existem duas opções para executar o contêiner usando a imagem atualizada:

* **Com as variáveis de ambiente** especificando a configuração básica do nó de filtragem
    * [Instruções para o contêiner Docker baseado em NGINX →](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Instruções para o contêiner Docker baseado em Envoy →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **No arquivo de configuração montado** especificando a configuração avançada do nó de filtragem
    * [Instruções para o contêiner Docker baseado em NGINX →](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [Instruções para o contêiner Docker baseado em Envoy →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Passo 12: Ajuste as configurações do modo de filtragem do nó Wallarm às mudanças lançadas nas últimas versões (somente se atualizando o nó 2.18 ou inferior)

1. Certifique-se de que o comportamento esperado das configurações listadas abaixo corresponde à [lógica modificada dos modos de filtragem `off` e `monitoring`](what-is-new.md#filtration-modes):
      * Variável de ambiente [`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) ou a diretiva [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode) do contêiner Docker baseado em NGINX
      * Variável de ambiente [`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) ou a diretiva [`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) do contêiner Docker baseado em Envoy
      * [Regra de filtragem geral configurada no Wallarm Console](../../user-guides/settings/general.md)
      * [Regras de filtragem de baixo nível configuradas no Wallarm Console](../../user-guides/rules/wallarm-mode-rule.md)
2. Se o comportamento esperado não corresponder à lógica modificada do modo de filtragem, ajuste as configurações do modo de filtragem às mudanças lançadas usando as [instruções](../../admin-en/configure-wallarm-mode.md).

## Passo 13: Teste a operação do nó de filtragem

--8<-- "../include-pt-BR/waf/installation/test-after-node-type-upgrade.md"

## Passo 14: Exclua o nó de filtragem da versão anterior

Se a imagem implantada da versão 4.8 opera corretamente, você pode excluir o nó de filtragem da versão anterior na seção Wallarm Console → **Nós**.

## Passo 15: Reative o módulo de verificação de ameaça ativa (somente se atualizando o nó 2.16 ou inferior)

Aprenda a [recomendação sobre a configuração do módulo de verificação de ameaça ativa](../../vulnerability-detection/threat-replay-testing/setup.md) e reative-o se necessário.

Depois de um tempo, certifique-se de que a operação do módulo não causa falsos positivos. Em caso de false positives, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).