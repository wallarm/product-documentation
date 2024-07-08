[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               ../../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../settings/users.md
[update-origin-ip-docs]:            #updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../rules/rules.md
[ip-lists-docs]:                    ../ip-lists/overview.md
[integration-docs]:                 ../settings/integrations/integrations-intro.md
[trigger-docs]:                     ../triggers/triggers.md
[application-docs]:                 ../settings/applications.md
[events-docs]:                      ../events/check-attack.md
[graylist-populating-docs]:         ../ip-lists/graylist.md#managing-graylist
[link-app-conf]:                    ../settings/applications.md
[using-varnish-cache]:              #using-varnish-cache

# Nós de filtragem de CDN

A seção **Nós** da UI do Console Wallarm permite que você gerencie os nós dos tipos [**Nó Wallarm**](nodes.md) e **Nó CDN**. Este artigo é sobre nós CDN.

!!! info "Nós de CDN na versão gratuita"
    A implantação do tipo de nó CDN não é suportada pelo [plano gratuito](../../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud).

--8<-- "../include-pt-BR/waf/installation/cdn-node/how-cdn-node-works.md"

## Criando um nó

Para criar o nó CDN, siga as [instruções](../../installation/cdn-node.md).

## Visualizando detalhes de um nó

Os detalhes do nó instalado são exibidos na tabela e em cada cartão do nó. Para abrir o cartão, clique no registro da tabela apropriado.

As seguintes propriedades e métricas do nó estão disponíveis:

* Nome do nó gerado com base no nome do domínio protegido
* Endereço IP do nó
* Endereço de origem associado ao domínio protegido
* Identificador único do nó (UUID)
* Status do nó
* Certificado SSL/TLS: Let's Encrypt gerado pelo Wallarm ou personalizado
* Tempo da última sincronização do nó de filtragem e Wallarm Cloud
* Data da criação do nó de filtragem
* Número de solicitações processadas pelo nó no mês atual
* Versões dos custom_ruleset e proton.db utilizados
* Versões dos pacotes Wallarm instalados
* Indicador de atualizações de componentes disponíveis

![Cartão do nó CDN](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## Atualizando o endereço de origem do recurso protegido

Se o seu provedor de hospedagem atualizar dinamicamente o endereço IP de origem ou domínio associado ao recurso protegido, mantenha o endereço de origem especificado na configuração do nó CDN atualizado. Caso contrário, as solicitações não chegarão ao recurso protegido, pois o nó CDN tentará encaminhá-las para um endereço de origem incorreto.

Para atualizar o endereço de origem, use a opção **Editar endereço de origem**.

## Carregando o certificado SSL/TLS personalizado

A Wallarm emite automaticamente o certificado [Let's Encrypt](https://letsencrypt.org/) permitindo HTTPS no domínio do nó CDN. Certificados são gerados e renovados automaticamente conforme necessário.

Se você já possui um certificado para o domínio protegido e prefere usar esse em vez do certificado Let's Encrypt, você pode fazer o upload do seu próprio certificado usando a opção **Atualizar certificado SSL/TLS**.

## Usando Varnish Cache

Utilizar um nó CDN com o acelerador HTTP [Varnish Cache](https://varnish-cache.org/intro/index.html#intro) acelera a entrega de conteúdo para os usuários (por exemplo, suas respostas do servidor). No entanto, se você alterar seu conteúdo, a cópia em cache no CDN pode ser atualizada com atraso, o que pode causar [problemas](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node) e ser o motivo para desativar o Varnish Cache.

Para evitar problemas com a velocidade de atualização do conteúdo, o Varnish Cache é desativado por padrão. Você pode ativar/desativar o Varnish Cache manualmente. Para fazer isso, prossiga para **Nós** → menu Nó CDN → **Ativar Varnish Cache** ou **Desativar Varnish Cache**.

## Excluindo um nó

Quando o nó de filtragem é excluído, a filtragem de solicitações para o seu domínio será interrompida. A exclusão do nó de filtragem não pode ser desfeita. O nó Wallarm será excluído permanentemente da lista de nós.

1. Exclua o registro CNAME do Wallarm dos registros de DNS do domínio protegido.

    !!! warning "Mitigação de solicitações maliciosas será interrompida"
        Assim que o registro CNAME for removido e as alterações entrarem em vigor na Internet, o nó CDN do Wallarm interromperá o encaminhamento de solicitações e o tráfego legítimo e malicioso irá diretamente para o recurso protegido.

        Isso resulta no risco de exploração de vulnerabilidades do servidor protegido quando o registro de DNS excluído entrou em vigor, mas o registro CNAME gerado para a nova versão do nó ainda não entrou em vigor.
1. Aguarde as mudanças serem propagadas. O status atual do registro CNAME é exibido em Console Wallarm → **Nós** → **CDN** → **Excluir nó**.
1. Exclua o nó CDN da lista de nós.

![Excluindo o nó](../../images/user-guides/nodes/delete-cdn-node.png)

## Solução de problemas do nó CDN

--8<-- "../include-pt-BR/waf/installation/cdn-node/cdn-node-troubleshooting.md"