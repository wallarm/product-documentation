# Nós Wallarm

A seção **Nós** da interface de usuário do Console Wallarm permite que você gerencie os nós dos tipos **Nó Wallarm** e [**Nó CDN**](cdn-node.md). Este artigo é sobre nós Wallarm.

Os módulos de nós Wallarm devem ser implantados no ambiente do cliente para que a Wallarm mitigue o tráfego malicioso. O nó Wallarm opera como um proxy, mitigando solicitações maliciosas e encaminhando solicitações legítimas ao recurso protegido.

Opções de gerenciamento de UI de nó Wallarm:

* Criar novos nós
* Visualizar propriedades e métricas de nós instalados
* Regenerar tokens de nó
* Renomear nós
* Deletar nós

![Nós](../../images/user-guides/nodes/table-nodes.png)

!!! info "Acesso de administrador"
    A criação, exclusão e regeneração de nós/tokens Wallarm estão disponíveis apenas para usuários com a função de **Administrador** ou **Administrador Global**. A visualização dos detalhes dos nós instalados está disponível para todos os usuários.

!!! warning "Tipos regulares e de nuvem de nós removidos"
    A partir da versão 4.6, apenas o [**tipo de nó Wallarm** está disponível](../../updating-migrating/what-is-new.md#removal-of-the-email-password-based-node-registration).

    **Nó Wallarm** utiliza uma abordagem unificada para registrar e configurar em [qualquer ambiente suportado](../../installation/supported-deployment-options.md).

## Criando um nó

Para criar um nó Wallarm usando o [token apropriado](#api-and-node-tokens-for-node-creation):

=== "Com token de API"

    1. Abra o Wallarm Console → **Configurações** → **Tokens de API** na [Nuvem dos EUA](https://us1.my.wallarm.com/settings/api-tokens) ou [Nuvem da UE](https://my.wallarm.com/settings/api-tokens).
    1. Encontre ou crie um token de API com a função de origem `Implantar`.
    1. Copie este token.
    1. Implante um novo nó no [ambiente conveniente](../../installation/supported-deployment-options.md) usando seu token de API. Após o registro do nó, ele aparecerá automaticamente na seção **Nós** do Console Wallarm.

=== "Com token de nó"

    1. Abra o Wallarm Console → **Nós** na [Nuvem dos EUA](https://us1.my.wallarm.com/nodes) ou [Nuvem da UE](https://my.wallarm.com/nodes) e crie o nó do tipo **Nó Wallarm**.

        ![Criação de nó Wallarm](../../images/user-guides/nodes/create-cloud-node.png)

    1. Copie o token gerado.
    1. Implante um novo nó no [ambiente conveniente](../../installation/supported-deployment-options.md) usando seu token de nó.

!!! info "A opção multi-inquilino"
    A opção **multi-inquilino** permite o uso do Wallarm para proteger várias infraestruturas de empresa independentes ou ambientes isolados simultaneamente. [Leia mais](../../installation/multi-tenant/overview.md)

    === "Instalação de token de API"

        Você pode alternar um nó para o modo multi-inquilino após a instalação a partir do menu do nó existente.

    === "Instalação de token de nó"

        Você pode alternar um nó para o modo multi-inquilino durante sua criação ou a partir do menu do nó existente.

## Visualizando detalhes de um nó

Os detalhes do nó de filtragem instalado são exibidos na tabela e no cartão de cada nó de filtragem. Para abrir o cartão, clique no registro adequado da tabela.

As seguintes propriedades e métricas de nó estão disponíveis:

* Nome do nó que foi dado ao nó no momento da criação
* O número médio de solicitações por segundo (RPS)
* Endereço IP do nó
* Identificador único do nó (UUID)
* Token do Nó Wallarm (visível apenas para usuários com a função **Administrador** ou **Administrador Global** [papel](../settings/users.md))
* Horário da última sincronização do nó de filtragem e da Nuvem Wallarm
* Data da criação do nó de filtragem
* Número de solicitações processadas pelo nó no mês atual, você também pode **Ver eventos deste nó para o dia** (muda para a seção **Eventos**)
* Versões de LOM e proton.db utilizados
* Versões dos pacotes Wallarm instalados, NGINX e Envoy (se houver)

![Cartão de nó](../../images/user-guides/nodes/view-wallarm-node.png)

Se um nó Wallarm estiver instalado para várias instâncias (por exemplo, para o processamento inicial de tráfego e a pós-análise de solicitação realizada por diferentes instâncias de servidor), então o número correspondente de nós de filtragem é agrupado em um único registro na tabela. Propriedades e métricas estarão disponíveis para cada instância.

No Wallarm, as instâncias de nós são chamadas de `hostname_NodeUUID`, onde:

* `hostname` é o nome da máquina de trabalho na qual a instância do nó é iniciada
* `NodeUUID` é o identificador único do nó (UUID)

Você pode definir `hostname` manualmente durante a instalação do nó usando o parâmetro `-n` no script `register-node`.

## Regenerando o token do nó

A regeneração do token cria um novo token para o nó.

1. Abra o Wallarm Console → **Nós**.
2. Clique em **Regenerar token** no menu ou cartão do nó.
3. Se o nó já estiver instalado na sua infraestrutura, copie o novo valor do token e especifique-o nas configurações do nó instalado.

![Regenerando o token do nó](../../images/user-guides/nodes/generate-new-token.png)

## Deletando um nó

Quando o nó é excluído, a filtragem de solicitações para o seu aplicativo será interrompida. A exclusão do nó de filtragem não pode ser desfeita. O nó será excluído permanentemente da lista de nós.

1. Abra o Wallarm Console → **Nós**.
1. Selecione um ou mais nós e clique em **Deletar**. Você também pode deletar o nó de filtragem selecionando um botão do menu do nó ou do cartão do nó.
1. Confirme a ação.

## Tokens de API e nó para criação de nó

O nó de filtragem Wallarm interage com a Nuvem Wallarm. Para fornecer ao nó acesso à API da Nuvem Wallarm, você precisa gerar um token no lado da Nuvem e usá-lo na máquina com o nó. Use **Tokens de API** (recomendado) ou **Tokens de nó** para isso:

* [**Tokens de API**](../settings/api-tokens.md) com a função `Implantar` quando:

    * O número de grupos de nós usados para organizar logicamente os nós na interface do usuário não é conhecido antecipadamente (os grupos de nós serão constantemente adicionados/removidos - com os tokens de API você será capaz de gerenciar facilmente esses grupos com a variável `WALLARM_LABELS` definindo o valor do rótulo `grupo`).
    * Você precisa controlar o ciclo de vida do token (você pode especificar a data de expiração ou desabilitar os tokens de API, o que os torna mais seguros).

        !!! info "Tokens de API não são suportados por algumas opções de implantação"
            Tokens de API atualmente não podem ser usados para AWS baseadas no [módulo Terraform](../../installation/cloud-platforms/aws/terraform-module/overview.md). Use os tokens de nó em vez disso.

* **Tokens de nó** quando você sabe antecipadamente quais grupos de nós serão apresentados. Use **Nós** → **Criar nó** para criar e nomear o grupo de nós. Durante a implantação do nó, use o token do grupo para cada nó que você deseja incluir no grupo.

!!! info "Suporte para auto-escala"
    Ambos os tipos de token suportam o recurso de auto-escala de nó disponível em algumas nuvens/opções de instalação.