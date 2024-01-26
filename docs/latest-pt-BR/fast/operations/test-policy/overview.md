[doc-insertion-points]:     insertion-points.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability
[gl-point]:                 ../../terms-glossary.md#point
[gl-anomaly]:               ../../terms-glossary.md#anomaly

# Políticas de teste FAST: Visão Geral

O FAST usa políticas de teste que permitem que você configure o comportamento do nó FAST ao testar um aplicativo para [vulnerabilidades][gl-vuln]. Documentos nesta seção contêm instruções para a gestão de políticas de teste.

!!! info "Terminologia"
    O termo "política de teste FAST" pode ser abreviado como "política" nesta seção de documentação.

## Princípios da Política de Teste

O FAST representa elementos de solicitação como [pontos][gl-point] e trabalha apenas com aquelas solicitações que contêm um ou mais pontos permitidos para processamento. A lista desses pontos é definida pela política. Se a solicitação não contiver pontos permitidos, ela será descartada e nenhum pedido de teste será criado em base à ela.

A política regula os seguintes pontos:

* A maneira como os testes são realizados

    Durante o teste, o FAST segue um ou mais métodos listados abaixo:

    * detecção de vulnerabilidades usando extensões internas do FAST, também conhecidas como *detects*
    * detecção de vulnerabilidades usando extensões personalizadas
    * detecção de [anomalias][gl-anomaly] usando testes de fuzz do FAST

* Elementos do pedido básico que o nó FAST processa durante o teste do aplicativo

    Os pontos permitidos para processamento são configurados na seção **Pontos de inserção** > **Onde incluir na solicitação** do editor de política na sua conta Wallarm. Veja detalhes sobre os pontos de inserção por este [link][doc-insertion-points].

* Elementos do pedido básico que o nó FAST não processa durante o teste do aplicativo

    Pontos que não são permitidos para processamento são configurados na seção **Pontos de inserção** > **Onde excluir na solicitação** das configurações da política de teste na sua conta Wallarm. Você pode encontrar mais detalhes sobre pontos de inserção nesse [link][doc-insertion-points].

    Pontos não permitidos para processamento podem ser usados quando há uma grande variedade de pontos na seção **Onde incluir na solicitação** e é necessário excluir o processamento de elementos separados. Por exemplo, se todos os parâmetros GET são permitidos para processamento (`GET_.*`) e é necessário excluir o processamento do parâmetro `uuid`, a expressão `GET_uid_value` deve ser adicionada na seção **Onde excluir na solicitação**.

!!! alerta "Escopo da política"
    Ao excluir explicitamente pontos, os processos do nó FAST são os únicos pontos permitidos pela política.
    
    O processamento de quaisquer outros pontos na solicitação não é realizado.

??? info "Exemplo de política"
    ![Exemplo de política](../../../images/fast/operations/common/test-policy/overview/policy-flow-example.png)

    A imagem acima demonstra a política usada pelo nó FAST na detecção de vulnerabilidades. Esta política permite o processamento de todos os parâmetros GET na solicitação base, excluindo o parâmetro GET `token`, que sempre é passado para o aplicativo alvo intocado.

    Além disso, a política permite que você use as extensões internas do FAST e extensões personalizadas enquanto o fuzzér está inativo.

    Portanto, o teste para detecção de vulnerabilidades usando detecções e extensões será realizado apenas para a solicitação base **A** (`/app.php?uid=1234`).

    O teste para detecção de vulnerabilidades na solicitação base **B** (`/app.php?token=qwe1234`) não será realizado, já que ela não contém parâmetros GET permitidos para processamento. Em vez disso, contém o parâmetro `token` excluído.