[img-remove-point]:        ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]:          ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]:          ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:         ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:         ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:  ../../dsl/points/parsers/http.md#action_name-filter
[link-action-ext-point]:   ../../dsl/points/parsers/http.md#action_ext-filter
[link-uri-point]:          ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:          ../../dsl/points/parsers.md

# Configuração das Regras de Processamento de Pontos

Os pontos são configurados na seção **Insertion Points** do editor de políticas em sua conta Wallarm. Esta seção é dividida em dois blocos:

* **Onde incluir na solicitação** para pontos permitidos para processamento
* **Onde excluir na solicitação** para pontos não permitidos para processamento

Para adicionar a lista formada de pontos, use o botão **Adicionar ponto de inserção** no bloco necessário.

Para excluir o ponto, use o símbolo «—» ao lado dele:

![Excluindo um ponto][img-remove-point]

!!! info "Pontos básicos"
   Ao criar uma política, pontos típicos são automaticamente adicionados à seção **Onde incluir na solicitação**:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: qualquer parte do [caminho] da URI[link-path-point]
    * `ACTION_NAME`: [ação][link-action-name-point]
    * `ACTION_EXT`: [extensão][link-action-ext-point]
    * `GET_.*`: qualquer [parâmetro GET][link-get-point]
    * `POST_.*`: qualquer [parâmetro POST][link-post-point]
    
    A lista de pontos na seção **Onde excluir na solicitação** está vazia por padrão.

   A mesma lista de pontos é configurada para a política padrão. Esta política não pode ser alterada.


!!! info "Referência de ponto"
    Ao criar ou editar pontos, você pode clicar no link **Como usar** para obter detalhes adicionais sobre pontos.

    ![Referência de ponto][img-point-help]

    A lista completa de pontos que o FAST pode processar está disponível pelo [link][doc-point-list].