O nó CDN do Wallarm opera como um proxy reverso para o servidor protegido. Ele analisa o tráfego de entrada, mitiga solicitações maliciosas e encaminha solicitações legítimas para o servidor protegido.

![Esquema de operação do nó CDN][cdn-node-operation-scheme]

!!! warning "O que pode ser protegido com o nó CDN"
    Com o nó CDN você pode proteger os domínios de terceiro nível (ou inferior, como 4º, 5º, etc.). Por exemplo, você pode criar um nó CDN para `ple.example.com`, mas não para `example.com`.

Quanto às outras características do nó CDN do Wallarm:

* Hospedado pelo provedor de nuvem de terceiros (Section.io), portanto, nenhum recurso é necessário da sua infraestrutura para implantar o nó CDN.

    !!! info "Upload de dados de solicitação para o provedor de nuvem de terceiros"
        Alguns dados sobre as solicitações processadas são carregados para o serviço Lumen.
* Faz o upload de alguns dados de solicitação para a Nuvem Wallarm. [Saiba mais sobre os dados carregados e a redução dos dados sensíveis][data-to-wallarm-cloud-docs]
* [Opera][operation-modes-docs] no modo de **bloqueio seguro** confiando no [conteúdo da lista de IPs cinza][graylist-populating-docs] para identificar tráfego suspeito e bloqueá-lo.

    Para alterar o modo, use a [regra][operation-mode-rule-docs] correspondente.
* O nó CDN é totalmente configurado via Wallarm Console UI. A única configuração a ser alterada de outra forma é adicionar o registro CNAME do Wallarm aos registros de DNS do recurso protegido.
* Você pode solicitar que a [equipe de suporte do Wallarm](mailto:support@wallarm.com) realize a [configuração do aplicativo][link-app-conf] para o seu nó.