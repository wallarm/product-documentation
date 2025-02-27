[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../user-guides/rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md
[graylist-populating-docs]:         ../user-guides/ip-lists/graylist.md#managing-graylist
[graylist-docs]:                    ../user-guides/ip-lists/graylist.md
[link-app-conf]:                    ../user-guides/settings/applications.md
[varnish-cache]:                    #why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node
[using-varnish-cache]:              ../user-guides/nodes/cdn-node.md#using-varnish-cache

# Implantando o Node Wallarm com Section.io

O [Section](https://www.section.io/) é um sistema de hospedagem nativa na nuvem que facilita a implantação de um node Wallarm. Ao encaminhar o tráfego por meio dele como um proxy reverso, você pode efetivamente mitigar o tráfego malicioso sem adicionar componentes de terceiros à infraestrutura do seu aplicativo.

## Casos de uso

Entre todas as [opções de implantação Wallarm suportadas](supported-deployment-options.md), esta solução é a recomendada para os seguintes **casos de uso**:

* Você está procurando uma solução de segurança que seja rápida e fácil de implantar para proteger serviços leves.
* Você não tem a capacidade de implantar nós Wallarm dentro de sua infraestrutura de hospedagem.
* Você prefere uma abordagem passiva à implantação, evitando a gestão e manutenção dos nós de filtragem Wallarm.

## Limitações

A solução tem certas limitações:

* Para análise e filtração de alto tráfego, o uso de nós CDN não é recomendado.
* A implantação do tipo de nó CDN não é suportada no [plano gratuito](../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud).
* Com o nó CDN, você pode proteger os domínios de terceiro nível (ou inferior, como 4º-, 5º- etc). Por exemplo, você pode criar um nó CDN para `ple.example.com`, mas não para `example.com`.
* A [configuração direta do aplicativo](../user-guides/settings/applications.md) por meio de procedimentos padrão está indisponível. Entre em contato com a [equipe de suporte do Wallarm](mailto:support@wallarm.com) para obter assistência na configuração.
* [Páginas de bloqueio personalizadas e códigos de erro](../admin-en/configuration-guides/configure-block-page-and-code.md) não são configuráveis. Por padrão, o nó CDN retorna um código de resposta 403 para solicitações bloqueadas.

## Requisitos

--8<-- "../include-pt-BR/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## Como funciona o nó CDN

--8<-- "../include-pt-BR/waf/installation/cdn-node/how-cdn-node-works.md"

## Implantação do nó CDN

1. Abra o Console Wallarm → **Nós** → **CDN** → **Criar nó**.
1. Insira o endereço de domínio a ser protegido, por exemplo, `ple.example.com`.

    O endereço especificado deve ser o domínio de terceiro nível (ou inferior) e não conter o esquema e as barras.
1. Certifique-se de que o Wallarm identifica corretamente o endereço de origem associado ao domínio especificado. Caso contrário, altere o endereço de origem descoberto automaticamente.

    ![Modal de criação de nó CDN][cdn-node-creation-modal]

    !!! aviso "Atualização dinâmica do endereço de origem"
        Se o seu provedor de hospedagem atualiza dinamicamente o endereço IP de origem ou o domínio associado ao recurso protegido, mantenha o endereço de origem especificado na configuração do nó CDN atualizado. O Console do Wallarm permite que você [altere o endereço de origem][update-origin-ip-docs] a qualquer momento.

        Caso contrário, as solicitações não alcançarão o recurso protegido, pois o nó CDN tentará proxyá-las para um endereço de origem incorreto.
1. Aguarde a conclusão do registro do nó CDN.

    Uma vez concluído o registro do nó CDN, o status do nó CDN será alterado para **Requer CNAME**.
1. Adicione o registro CNAME gerado pelo Wallarm aos registros DNS do domínio protegido.

    Se o registro CNAME já estiver configurado para o domínio, substitua seu valor pelo gerado pelo Wallarm.

    ![Modal de criação de nó CDN][cname-required-modal]

    Dependendo do seu provedor de DNS, as alterações nos registros de DNS podem levar até 24 horas para se propagar e ter efeito na Internet. Uma vez propagado o novo registro CNAME, o nó CDN Wallarm irá fazer proxy de todas as solicitações recebidas para o recurso protegido e bloquear as maliciosas.
1. Se necessário, faça o upload do certificado SSL/TLS personalizado.

    Por padrão, o Wallarm gerará o certificado Let's Encrypt para o domínio do nó CDN.
1. Uma vez que as alterações no registro DNS se propagaram, envie um ataque de teste para o domínio protegido:

    ```bash
    curl http://<PROTECTED_DOMAIN>/etc/passwd
    ```

    * Se o endereço IP de origem estiver [na lista cinza][graylist-docs], o nó bloqueará o ataque (o código de resposta HTTP é 403) e o registrará.
    * Se o endereço IP de origem não estiver [na lista cinza][graylist-docs], o nó registrará apenas os ataques detectados. Você pode verificar que os ataques foram registrados no Console Wallarm → **Eventos**:
    
        ![Ataques na interface][attacks-in-ui]

## Próximos passos

O nó CDN Wallarm foi implantado com sucesso!

Conheça as opções de configuração Wallarm:

--8<-- "../include-pt-BR/waf/installation/cdn-node/cdn-node-configuration-options.md"

## Resolução de problemas do nó CDN

--8<-- "../include-pt-BR/waf/installation/cdn-node/cdn-node-troubleshooting.md"
