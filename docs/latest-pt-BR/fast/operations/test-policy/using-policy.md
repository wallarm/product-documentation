[img-set-policy-in-gui]:    ../../../images/fast/operations/common/test-policy/overview/tr-gui-set-policy.png
[img-get-policy-id]:        ../../../images/fast/operations/common/test-policy/overview/get-policy-id.png

[doc-pol-tr-relations]:     ../internals.md#fast-test-policy
[doc-tr-creation-gui]:      ../create-testrun.md#creating-a-test-run-via-web-interface
[doc-tr-creation-api]:      ../create-testrun.md#creating-a-test-run-via-api
[doc-tr-copying-gui]:       ../copy-testrun.md#copying-a-test-run-via-web-interface
[doc-tr-copying-api]:       ../copy-testrun.md#copying-a-test-run-via-an-api

[doc-ci-mode]:              ../../poc/integration-overview-ci-mode.md
[doc-tr-pid-envvar]:        ../../poc/ci-mode-testing.md#environment-variables-in-testing-mode

[link-pol-list-eu]:         https://my.wallarm.com/testing/policies/     
[link-pol-list-us]:         https://us1.my.wallarm.com/testing/policies/


# Usando Políticas de Teste

As políticas de teste estão [relacionadas][doc-pol-tr-relations] com os testes de segurança. Ao criar uma iteração de teste, cada política de teste definirá e especificará o comportamento do nó FAST. 

Você pode especificar a política de teste das seguintes maneiras:

* Usando a interface, se o teste for [criado][doc-tr-creation-gui] ou [copiado][doc-tr-copying-gui], em seguida, selecione a política do menu suspenso **Política de Teste**:

    ![Selecionando a política de teste durante a criação de uma execução de teste pela interface][img-set-policy-in-gui] 

* Especifique a ID da política de teste:
    * na solicitação de API se o teste for [criado][doc-tr-creation-api] ou [copiado][doc-tr-copying-api] via métodos de API
    * na variável de ambiente [`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar] se você gerencia o teste no [nó FAST][doc-ci-mode]
        
    Você pode encontrar a ID da política de teste na lista de políticas na sua conta Wallarm para a [nuvem EU][link-pol-list-eu] ou a [nuvem US][link-pol-list-us].

    ![Obtendo ID da política][img-get-policy-id]

!!! info "Política de teste padrão"
    FAST cria e aplica automaticamente a **Política Padrão**. Esta política testa uma aplicação em busca de vulnerabilidades típicas, verificando os pontos de solicitação mais comumente usados.

    Por favor, note que as configurações da política de teste padrão não podem ser alteradas.