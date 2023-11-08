Os testes de integração permitem verificar a corretude da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação. Para testar a integração, você pode usar o botão **Testar integração** ao criar ou editar a integração.

A integração é testada da seguinte maneira:

* Notificações de teste com o prefixo `[Mensagem de teste]` são enviadas para o sistema selecionado.
* As notificações de teste abrangem os seguintes eventos (cada um em um registro único):

    * Novo usuário na conta da empresa
    * Novo IP descoberto no escopo da empresa
    * Novo gatilho na conta da empresa
    * Nova vulnerabilidade de segurança descoberta
* As notificações de teste incluem dados de teste.