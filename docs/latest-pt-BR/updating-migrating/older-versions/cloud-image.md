[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md

# Atualizando uma imagem de nó em nuvem EOL

Estas instruções descrevem as etapas para atualizar a imagem do nó em nuvem fim de vida (versão 3.6 e inferior) implantada no AWS ou GCP até 4.8.

--8<-- "../include-pt-BR/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/basic-reqs-for-upgrades.md"

## Passo 1: Informe o suporte técnico do Wallarm que você está atualizando os módulos do nó de filtragem (somente se estiver atualizando o nó 2.18 ou inferior)

Se estiver atualizando o nó 2.18 ou inferior, por favor informe o [suporte técnico do Wallarm](mailto:support@wallarm.com) que você está atualizando os módulos do nó de filtragem para a versão mais recente e peça para ativar a nova lógica da lista de IPs para sua conta Wallarm. Quando a nova lógica de lista de IPs estiver ativada, assegure-se de que a seção [**Listas de IPs**](../../user-guides/ip-lists/overview.md) do Wallarm Console esteja disponível.

## Passo 2: Desative o módulo de verificação de ameaças ativas (somente se estiver atualizando o nó 2.16 ou inferior)

Se você estiver atualizando o nó Wallarm 2.16 ou inferior, por favor, desative o módulo [Verificação de Ameaça Ativa](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) em Wallarm Console → **Vulnerabilidades** → **Configurar**.

O funcionamento do módulo pode causar [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives) durante o processo de atualização. Desativar o módulo minimiza esse risco.

## Passo 3: Atualize a porta da API

--8<-- "../include-pt-BR/waf/upgrade/api-port-443.md"

## Passo 4: Inicie uma nova instância com o nó de filtragem 4.8

1. Abra a imagem do nó de filtragem do Wallarm no mercado de plataforma em nuvem e prossiga com o lançamento da imagem:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Na etapa de lançamento, defina as seguintes configurações:

      * Selecione a versão da imagem `4.8.x`
      * Para AWS, selecione o [grupo de segurança criado](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) no campo **Configurações do Grupo de Segurança**
      * Para AWS, selecione o nome do [par de chaves criado](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) no campo **Configurações do Par de Chaves**
3. Confirme o lançamento da instância.
4. Para o GCP, configure a instância de acordo com estas [instruções](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance).

## Passo 5: Ajuste as configurações do modo de filtragem do Wallarm node às alterações lançadas nas últimas versões (somente se estiver atualizando o nó 2.18 ou inferior)

1. Certifique-se de que o comportamento esperado das configurações listadas abaixo corresponde à [a lógica alterada dos modos de filtragem `off` e `monitoring`](what-is-new.md#filtration-modes):
      * [Diretiva `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Regra geral de filtragem configurada no Wallarm Console](../../user-guides/settings/general.md)
      * [Regras de filtragem de baixo nível configuradas no Wallarm Console](../../user-guides/rules/wallarm-mode-rule.md)
2. Se o comportamento esperado não corresponder à lógica de modo de filtragem alterada, ajuste as configurações de modo de filtragem às alterações lançadas usando as [instruções](../../admin-en/configure-wallarm-mode.md).

## Passo 6: Conecte o nó de filtragem à Nuvem Wallarm

1. Conecte-se à instância do nó de filtragem via SSH. Instruções mais detalhadas para a conexão com instâncias estão disponíveis na documentação da plataforma em nuvem:
      * [Documentação AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [Documentação GCP](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Crie um novo nó Wallarm e conecte-o à Nuvem Wallarm usando o token gerado conforme descrito nas instruções para a plataforma em nuvem:
      * [AWS](../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## Passo 7: Copie as configurações do nó de filtragem da versão anterior para a nova versão

1. Copie as configurações para processamento e proxy de solicitações dos seguintes arquivos de configuração da versão anterior do nó Wallarm para os arquivos do nó de filtragem 4.8:
      * `/etc/nginx/nginx.conf` e outros arquivos com configurações de NGINX
      * `/etc/nginx/conf.d/wallarm.conf` com configurações globais do node de filtragem
      * `/etc/nginx/conf.d/wallarm-status.conf` com as configurações do serviço de monitoramento do nó de filtragem

        Certifique-se de que o conteúdo do arquivo copiado corresponde à [configuração segura recomendada](../../admin-en/configure-statistics-service.md#configuring-the-statistics-service).

      * `/etc/environment` com variáveis de ambiente
      * `/etc/default/wallarm-tarantool` com configurações de Tarantool
      * outros arquivos com configurações personalizadas para processamento e proxy de solicitações
2. Renomeie as seguintes diretivas de NGINX se estiverem explicitamente especificadas em arquivos de configuração:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Só mudamos os nomes das diretivas, a lógica permanece a mesma. As diretivas com nomes antigos serão descontinuadas em breve, por isso, recomenda-se renomeá-las antes.
3. Se o [formato de log extendido](../../admin-en/configure-logging.md#filter-node-variables) estiver configurado, verifique se a variável `wallarm_request_time` está especificada explicitamente na configuração.

      Se sim, por favor, renomeie-o para `wallarm_request_cpu_time`.

      Só mudamos o nome da variável, a lógica permanece a mesma. O nome antigo ainda é suportado temporariamente, mas ainda assim é recomendado renomear a variável.
4. Se estiver atualizando o nó 2.18 ou inferior, [migre](../migrate-ip-lists-to-node-3.md) a configuração da lista de permissões e da lista de negações da versão anterior do nó Wallarm para 4.8.
5. Se a página `&/usr/share/nginx/html/wallarm_blocked.html` for retornada para solicitações bloqueadas, [copie e personalize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) sua nova versão.

      Na nova versão do nó, a página de bloqueio de amostra do Wallarm foi [alterada](what-is-new.md#new-blocking-page). O logotipo e o e-mail de suporte na página agora estão vazios por padrão.

Informações detalhadas sobre como trabalhar com arquivos de configuração do NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/docs/beginners_guide.html).

A lista de diretivas do nó de filtragem está disponível [aqui](../../admin-en/configure-parameters-en.md).

## Passo 8: Transfira a configuração de detecção de ataque `overlimit_res` das diretivas para a regra

--8<-- "../include-pt-BR/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## Passo 9: Reinicie o NGINX

Reinicie o NGINX para aplicar as configurações:

```bash
sudo systemctl restart nginx
```

## Passo 10: Teste a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## Passo 11: Crie a imagem da máquina virtual baseada no nó de filtragem 4.8 na AWS ou GCP

Para criar a imagem da máquina virtual baseada no nó de filtragem 4.8, siga as instruções para [AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) ou [GCP](../../admin-en/installation-guides/google-cloud/create-image.md).

## Passo 12: Delete a instância do nó Wallarm anterior

Se a nova versão do nó de filtragem estiver configurada e testada com sucesso, remova a instância e a imagem da máquina virtual com a versão anterior do nó de filtragem usando o console de gerenciamento da AWS ou GCP.

## Passo 13: Reative o módulo de verificação de ameaças ativas (somente se estiver atualizando o nó 2.16 ou inferior)

Aprenda a [recomendação sobre a configuração do módulo de Verificação de Ameaça Ativa](../../vulnerability-detection/threat-replay-testing/setup.md) e reative-o, se necessário.

Depois de um tempo, assegure-se de que a operação do módulo não cause falsos positivos. Se encontrar falsos positivos, entre em contato com o [suporte técnico do Wallarm](mailto:support@wallarm.com).