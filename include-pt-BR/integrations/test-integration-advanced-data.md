Os testes de integração permitem verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato de notificação. Para testar a integração, você pode usar o botão **Testar integração** ao criar ou editar a integração.

O teste de integração é realizado da seguinte maneira:

* As notificações de teste com o prefixo `[Mensagem de teste]` são enviadas para o sistema selecionado.
* As notificações de teste abrangem os seguintes eventos (cada um em um único registro):

    * Novo usuário na conta da empresa
    * Nova ocorrência detectada
    * Novo IP descoberto no escopo da empresa
    * Novo gatilho na conta da empresa
    * Nova vulnerabilidade de segurança descoberta
* As notificações de teste incluem dados de teste.