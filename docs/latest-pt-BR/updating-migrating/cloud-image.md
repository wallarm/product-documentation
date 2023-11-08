[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Atualizando a imagem do nó na nuvem

Estas instruções descrevem os passos para atualizar a imagem do nó na nuvem 4.x implantado no AWS ou GCP até 4.8.

Para atualizar o nó final da vida (3.6 ou inferior), por favor, use as [instruções diferentes](older-versions/cloud-image.md).

## Requisitos

--8<-- "../include-pt-BR/waf/installation/basic-reqs-for-upgrades.md"

## Passo 1: Inicie uma nova instância com o nó de filtragem 4.8

1. Abra a imagem do nó de filtragem Wallarm na plataforma de nuvem do marketplace e prossiga para o lançamento da imagem:
      * [Mercado da Amazon](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [Mercado do GCP](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Na etapa de lançamento, defina as seguintes configurações:

      * Selecione a versão da imagem `4.8.x`
      * Para AWS, selecione o [grupo de segurança criado](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) no campo **Configurações do Grupo de Segurança**
      * Para AWS, selecione o nome do [par de chaves criado](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) no campo **Configurações do par de chaves**
3. Confirme o lançamento da instância.
4. Para GCP, configure a instância seguindo estas [instruções](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance).

## Passo 2: Conecte o nó de filtragem à Wallarm Cloud

1. Conecte-se à instância do nó de filtragem via SSH. Instruções mais detalhadas para conectar-se às instâncias estão disponíveis na documentação da plataforma de nuvem:
      * [Documentação da AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [Documentação do GCP](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Crie um novo nó Wallarm e conecte-o à Wallarm Cloud usando o token gerado conforme descrito nas instruções para a plataforma de nuvem:
      * [AWS](../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## Passo 3: Copie as configurações do nó de filtragem da versão anterior para a nova versão

1. Copie as configurações para processar e encaminhar solicitações dos seguintes arquivos de configuração da versão anterior do nó Wallarm para os arquivos do nó de filtragem 4.8:
      
      * `/etc/nginx/nginx.conf` e outros arquivos com configurações NGINX
      * `/etc/nginx/conf.d/wallarm.conf` com configurações globais do nó de filtragem
      * `/etc/nginx/conf.d/wallarm-status.conf` com as configurações do serviço de monitoramento do nó de filtragem
      * `/etc/environment` com variáveis de ambiente
      * `/etc/default/wallarm-tarantool` com configurações do Tarantool
      * outros arquivos com configurações personalizadas para processar e encaminhar solicitações
1. Se a página `&/usr/share/nginx/html/wallarm_blocked.html` é retornada para solicitações bloqueadas, [copie e personalize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) a sua nova versão.

      Na nova versão do nó, a página de bloqueio de amostra da Wallarm foi [alterada](what-is-new.md#new-blocking-page). O logotipo e o email de suporte na página agora estão vazios por padrão.

Informações detalhadas sobre como trabalhar com arquivos de configuração NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/docs/beginners_guide.html).

A lista de diretivas do nó de filtragem está disponível [aqui](../admin-en/configure-parameters-en.md).

## Passo 4: Reinicie o NGINX

Reinicie o NGINX para aplicar as configurações:

```bash
sudo systemctl restart nginx
```

## Passo 5: Teste a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## Passo 6: Crie a imagem da máquina virtual com base no nó de filtragem 4.8 na AWS ou GCP

Para criar a imagem da máquina virtual com base no nó de filtragem 4.8, siga as instruções para [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) ou [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## Passo 7: Delete a instância anterior do nó Wallarm

Se a nova versão do nó de filtragem estiver configurada e testada com sucesso, remova a instância e a imagem da máquina virtual com a versão anterior do nó de filtragem usando o console de gerenciamento de AWS ou GCP.
