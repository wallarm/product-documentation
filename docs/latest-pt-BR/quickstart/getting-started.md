[operation-mode-rule-docs]: ../user-guides/rules/wallarm-mode-rule.md
[filtration-modes-docs]: ../admin-en/configure-wallarm-mode.md
[graylist-docs]: ../user-guides/ip-lists/graylist.md
[wallarm-cloud-docs]: ../about-wallarm/overview.md#cloud
[user-roles-docs]: ../user-guides/settings/users.md
[rules-docs]: ../user-guides/rules/rules.md
[ip-lists-docs]: ../user-guides/ip-lists/overview.md
[integration-docs]: ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]: ../user-guides/triggers/triggers.md
[application-docs]: ../user-guides/settings/applications.md
[events-docs]: ../user-guides/events/check-attack.md
[sqli-attack-desc]: ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]: ../attacks-vulns-list.md#crosssite-scripting-xss

# Início rápido na plataforma Wallarm

A plataforma Wallarm protege aplicativos da web, APIs e microserviços contra ataques OWASP e OWASP Top 10, bots e abusos de aplicativos com falsos positivos ultra baixos. Você pode começar a usar a plataforma completa gratuitamente com um limite de 500 mil solicitações de API mensais ao seguir este guia.

Em um início rápido, você irá registrar sua conta Wallarm e executar o primeiro nó de filtragem Wallarm em poucos minutos. Tendo uma cota gratuita, você poderá experimentar a potência do produto em tráfego real. 

## Conheça Wallarm no Playground

Para explorar o Wallarm antes mesmo de se inscrever e implementar quaisquer componentes em seu ambiente, use o [Wallarm Playground](https://playground.wallarm.com/?utm_source=wallarm_docs_quickstartpt).

No Playground, você pode acessar a visualização do Console Wallarm como se estivesse preenchida com dados reais. O Console Wallarm é o principal componente da plataforma Wallarm que exibe dados sobre tráfego processado e permite o ajuste fino da plataforma. Portanto, com o Playground você pode aprender e experimentar como o produto funciona e obter alguns exemplos úteis de seu uso no modo somente leitura.

![UI para criar conta](../images/playground.png)

Para experimentar as capacidades da solução Wallarm em seu tráfego, [crie uma conta gratuita](#criar-conta-wallarm-e-obter-plano-gratis).

## Criar conta Wallarm e obter plano grátis

Para criar uma conta Wallarm:

1. Siga o link de registro na [Nuvem dos EUA](https://us1.my.wallarm.com/signup) ou na [Nuvem da UE](https://my.wallarm.com/signup) do Wallarm e insira seus dados pessoais.

    [Mais detalhes sobre as nuvens Wallarm →](../about-wallarm/overview.md#cloud)
1. Confirme sua conta seguindo o link da mensagem de confirmação enviada para o seu email.

Uma vez que a conta é registrada e confirmada, ela é automaticamente atribuída ao **Plano grátis** ou **Teste gratuito**, dependendo da Nuvem Wallarm usada:

* Na Nuvem dos EUA, o Plano Grátis permite que você explore o poder da solução Wallarm gratuitamente para 500 mil solicitações mensais.
* Na Nuvem da UE, existe um período de teste que permite explorar a solução Wallarm gratuitamente por 14 dias.

Continue implementando o [primeiro nó de filtragem Wallarm](#implantar-o-nó-de-filtragem-wallarm).

## Implantar o nó de filtragem Wallarm

Wallarm suporta [várias opções para implementação do nó de filtragem](../installation/supported-deployment-options.md). Você pode aprender e escolher o mais apropriado ou seguir o caminho mais rápido para começar com o Wallarm conforme descrito abaixo.

Para implantar rapidamente o nó como um componente de sua infraestrutura, primeiro certifique-se de que você tenha:

* [Docker instalado](https://docs.docker.com/engine/install/)
* O [papel de **Administrador**][user-roles-docs] na conta Wallarm

Implante o nó de filtragem Wallarm a partir da imagem Docker:

1. Abra o Console Wallarm → **Nós** na [Nuvem dos EUA](https://us1.my.wallarm.com/nodes) ou na [Nuvem da UE](https://my.wallarm.com/nodes) e crie o nó do tipo **Nó Wallarm**.

   ![Criação do nó Wallarm](../images/create-wallarm-node-empty-list.png)

   Quanto à caixa de seleção **Nó multi-inquilino**, deixe-a desmarcada. Essa caixa de seleção está relacionada à configuração de um recurso correspondente que não faz parte de um início rápido.
1. Copie o token gerado.
1. Execute o contêiner com o nó:

=== "Nuvem dos EUA"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.8.0-1
    ```
=== "Nuvem da UE"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.8.0-1
    ```

Variável de ambiente | Descrição| Obrigatório
--- | ---- | ----
`WALLARM_API_TOKEN` | Token do nó Wallarm copiado da interface do usuário do Console Wallarm. | Sim
`NGINX_BACKEND` | Domínio ou endereço IP do recurso para proteger com a solução Wallarm. | Sim
`WALLARM_API_HOST` | Servidor de API do Wallarm:<ul><li>`us1.api.wallarm.com` para a Nuvem dos EUA</li><li>`api.wallarm.com` para a Nuvem da UE</li></ul>Por padrão: `api.wallarm.com`. | Não
`WALLARM_MODE` | Modo do nó:<ul><li>`block` para bloquear solicitações maliciosas</li><li>`safe_blocking` para bloquear apenas aquelas solicitações maliciosas originárias de [endereços IP em lista cinza][graylist-docs]</li><li>`monitoring` para analisar mas não bloquear solicitações</li><li>`off` para desativar a análise e processamento de tráfego</li></ul>Por padrão: `monitoring`.<br>[Descrição detalhada dos modos de filtragem →][filtration-modes-docs] | Não

Para testar a implantação, execute o primeiro ataque com o payload malicioso [Path Traversal](../attacks-vulns-list.md#path-traversal):

```
curl http://localhost/etc/passwd
```

Se `NGINX_BACKEND` for `example.com`, passe adicionalmente a opção `-H 'Host: example.com'` no comando curl.

Como o nó opera no [modo de filtragem de **monitoramento**](../admin-en/configure-wallarm-mode.md#available-filtration-modes) por padrão, o nó Wallarm não bloqueará o ataque, mas o registrará. Para verificar se o ataque foi registrado, prossiga para o Console Wallarm → **Eventos**:

![Ataques na interface](../images/admin-guides/test-attacks-quickstart.png)

## Próximos passos

A implantação rápida do nó Wallarm foi concluída com sucesso!

Para obter mais da etapa de implantação:

* [Aprenda o guia completo sobre a implantação do nó Wallarm baseado em NGINX com Docker](../admin-en/installation-docker-en.md)
* [Saiba todas as opções de implantação suportadas pelo Wallarm](../installation/supported-deployment-options.md)

Para ajustar ainda mais o nó implantado, aprenda os recursos:

--8<-- "../include-pt-BR/waf/installation/quick-start-configuration-options-4.4.md"