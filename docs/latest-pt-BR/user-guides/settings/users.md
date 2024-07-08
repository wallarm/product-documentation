[link-audit-log]:               audit-log.md

[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

[img-configure-user]:       ../../images/user-guides/settings/configure-user.png
[img-disabled-users]:       ../../images/user-guides/settings/disabled-users.png
[img-search-user]:          ../../images/user-guides/settings/search-users.png
[img-add-user]:             ../../images/user-guides/settings/integrations/webhook-examples/adding-user.png
[img-user-menu]:            ../../images/user-guides/settings/user-menu.png
[img-disabled-user-menu]:   ../../images/user-guides/settings/disabled-user-menu.png
[img-edit-user]:            ../../images/user-guides/settings/edit-user.png
[img-user-disable-2fa]:     ../../images/user-guides/settings/users-disable-2fa.png
[img-user-menu-disable-2fa]:    ../../images/user-guides/settings/disable-2fa-button.png
[img-disable-delete-multi]:     ../../images/user-guides/settings/users-multi-disable-access.png
[img-enable-delete-multi]:      ../../images/user-guides/settings/users-multi-enable-access.png    

# Configurando usuários

Você pode gerenciar contas de usuário na aba *Usuários* localizada em *Configurações*.

!!! warning "Acesso de administrador"
    Apenas usuários com a função **Administrador** podem acessar essa configuração.

## Funções usuárias 

Usuários dos clientes Wallarm podem ter as seguintes funções:

* **Administrador** com acesso a todas as configurações da Wallarm
* **Analista** com acesso para visualizar as principais configurações da Wallarm e gerenciar informações sobre ataques, [incidentes][link-glossary-incident] e [vulnerabilidades][link-glossary-vulnerability]
* **Somente leitura** com acesso para visualizar as principais configurações da Wallarm
* **Desenvolvedor de API** com acesso para visualizar e baixar o inventário da API descoberto pelo módulo [Descoberta de API](../../api-discovery/overview.md). Essa função permite distinguir usuários cujas tarefas só exigem o uso da Wallarm para obter dados atualizados sobre as APIs da empresa. Esses usuários não têm acesso a nenhuma parte do console da Wallarm, exceto **Descoberta de API** e **configurações → perfil**.

O recurso [multilocatário](../../installation/multi-tenant/overview.md) também permite que você use as funções globais **Administrador Global**, **Analista Global**, **Somente Leitura Global**. Funções globais fornecem aos usuários acesso à conta de locatário técnico e contas de locatário vinculadas, funções regulares fornecem aos usuários acesso apenas à conta de locatário técnico.

Mais informações detalhadas sobre o acesso de diferentes funções de usuário às entidades Wallarm é fornecido na tabela abaixo. O gerenciamento de entidades abrange a criação, edição e exclusão de entidades.

| Entidade              | Administrador / Administrador Global | Analista / Analista Global | Somente Leitura / Somente Leitura Global | Desenvolvedor de API |
|---------------------|--------------------------------------|--------------------------|------------------------------|---|
| **Nós de filtragem**       | Ver e gerenciar                      | Ver                     | Ver                         | - |
| **Painel**       | Ver                                 | Ver                     | Ver                         | - |
| **Eventos**          | Ver e gerenciar                      | Ver e gerenciar          | Ver                         | - |
| **Vulnerabilidades** | Ver e gerenciar                      | Ver e gerenciar          | Ver              | - |
| **Inventário de API por Descoberta de API**   | Ver e gerenciar                      | Ver e gerenciar          | -                            | Ver e baixar |
| **Especificações de API**   | Ver e gerenciar                      | Ver          | Ver                            | Ver |
| **Scanner**         | Ver e gerenciar                      | Ver e gerenciar          | Ver                         | - |
| **Gatilhos**        | Ver e gerenciar                      | -                        | -                            | - |
| **Listas de IP**       | Ver, gerenciar e exportar             | Ver, gerenciar e exportar | Ver e exportar              | - |
| **Regras**           | Ver e gerenciar                      | Ver e gerenciar          | Ver                         | - |
| **Protecção BOLA**           | Ver e gerenciar                      | Ver          | - | - |
| **Integrações**    | Ver e gerenciar                      | -                         | -                            | - |
| **Modo de filtração**        | Ver e gerenciar                      | Ver                     | Ver                         | - |
| **Aplicações**    | Ver e gerenciar                      | Ver                     | Ver                         | - |
| **Usuários**           | Ver e gerenciar                      | -                        | Ver                         | - |
| **Log de atividade**    | Ver                                 | -                        | Ver                         | - |

## Visualizando usuários

Você pode visualizar listas de usuários nas seguintes abas:
*   A aba principal *Usuários* contém todos os usuários da sua empresa registrados na nuvem da Wallarm. Nesta aba, qualquer usuário desativado é realçado em cinza.

    ![Lista de usuários][img-configure-user]

*   A aba *Desativado* contém apenas usuários desativados.

    ![Lista de usuários desativados][img-disabled-users]

Você pode clicar nas células no cabeçalho da tabela para classificar usuários por nome, função, e-mail e última data de login.

Você também pode escolher um ou vários usuários marcando as caixas de seleção à esquerda dos nomes dos usuários; portanto, você será capaz de realizar operações em um grupo de usuários.

## Procurando usuários

Você pode usar o campo de busca acima da tabela para procurar usuários por nome, e-mail ou função do sistema.

![Procurando um usuário][img-search-user]

## Criar um usuário

1.  Na aba *Usuários* da seção *Configurações*, clique no botão *Adicionar usuário*.
2.  Selecione a função do usuário na lista suspensa.
3.  Insira um primeiro e último nome e um e-mail para o usuário.

    ![Formulário Novo usuário][img-add-user]

4.  Clique no botão *Adicionar usuário*.

    O novo usuário receberá um e-mail automático com um link para fazer login e definir uma senha.

Para ser notificado sobre novos usuários adicionados, você pode configurar o [gatilho](../triggers/triggers.md) apropriado. As notificações serão enviadas para os sistemas de mensageiros e SOAR (por exemplo, Slack, Microsoft Teams, OpsGenie).

## Alterar as informações do usuário

Para alterar os dados do usuário, execute as seguintes ações:
1.  Na aba *Usuários* da seção *Configurações*, selecione o usuário a ser editado.
2.  Abra o menu de ações do usuário clicando no botão à direita do usuário correspondente.

    ![Menu de ações do usuário][img-user-menu]

3.  Clique em *Editar configurações do usuário*.
4.  No formulário que aparece, insira as novas informações do usuário e clique no botão *Salvar*.

    ![Formulário de edição de informações do usuário][img-edit-user]

As informações antigas do usuário serão substituídas pelas novas.

## Resetar configurações de autenticação de dois fatores

Para resetar as configurações de autenticação de dois fatores, execute as seguintes ações:
1.  Na aba *Usuários* da seção *Configurações*, selecione o usuário desejado.
2.  Abra o menu de ações do usuário clicando no botão à direita do usuário correspondente.

    ![Menu de ações do usuário][img-user-menu-disable-2fa]

3.  Clique em *Desativar 2FA*.
4.  No formulário que aparece, insira sua senha de conta de administrador da Wallarm e clique no botão *Desativar 2FA*.

    ![Desativando a autenticação de dois fatores][img-user-disable-2fa]

A função de autenticação de dois fatores será desativada para o usuário selecionado. O usuário pode reativar a autenticação de dois fatores nas [configurações do perfil](account.md#enabling-two-factor-authentication).

## Desativar o acesso de um usuário

Desativar o acesso de um usuário desativará sua conta Wallarm.

Para desativar a conta Wallarm de um usuário específico, execute as seguintes ações:
1.  Na aba *Usuários* da seção *Configurações*, selecione o usuário desejado.
2.  Abra o menu de ações do usuário clicando no botão à direita do usuário correspondente.

    ![Menu de ações do usuário][img-user-menu]

3.  Clique em *Desativar acesso*.

Agora o usuário selecionado da sua empresa não será capaz de usar sua conta Wallarm.

Se for necessário desativar o acesso para várias contas de usuário, selecione os usuários cujo acesso você precisa revogar. O painel de ação aparecerá. Clique no botão *Desativar acesso* neste painel.

![Desativando várias contas de usuários][img-disable-delete-multi]

## Ativar acesso de um usuário

Ativar o acesso de um usuário ativa sua conta Wallarm.

Para ativar a conta Wallarm de um usuário específico, execute as seguintes ações:
1.  Na aba *Usuários* da seção *Configurações*, selecione o usuário desejado com acesso desativado.
2.  Abra o menu de ações do usuário clicando no botão à direita do usuário correspondente.

    ![Menu de ações do usuário][img-disabled-user-menu]

3.  Clique em *Ativar acesso*.

Agora o usuário selecionado da sua empresa poderá usar sua conta Wallarm.

Se for necessário ativar o acesso para várias contas de usuário, selecione os usuários que você precisa conceder acesso. O painel de ação aparecerá. Clique no botão *Ativar acesso* neste painel.

![Ativando várias contas de usuários][img-enable-delete-multi]

## Excluir um usuário

Para excluir uma conta de usuário específica, execute as seguintes ações:
1.  Na aba *Usuários* da seção *Configurações*, selecione o usuário a ser excluído.
2.  Abra o menu de ações do usuário clicando no botão à direita do usuário correspondente.

    ![Menu de ações do usuário][img-user-menu]

3.  Clique em *Excluir*.

Se for necessário excluir várias contas de usuário, selecione os usuários cujas contas você precisa excluir. O painel de ação aparecerá. Clique no botão *Excluir* neste painel.

![Excluindo várias contas de usuários][img-disable-delete-multi]