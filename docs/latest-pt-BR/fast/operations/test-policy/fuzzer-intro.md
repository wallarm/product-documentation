[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# Configuração do Processo de Detecção de Anomalias: Visão geral

Além da detecção de [vulnerabilidades][gl-vuln], o FAST pode detectar [anomalias][gl-anomaly] usando o *fuzzer*.

Esta seção da documentação descreve os seguintes pontos:

* [Princípios de Operação do Fuzzer][doc-fuzzer-internals]
* [Configuração do Fuzzer Usando o Editor de Política][doc-fuzzer-configuration]

??? info "Exemplo de Anomalia"
    O comportamento anômalo do aplicativo alvo [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/) é demonstrado no [exemplo da extensão FAST](../../dsl/extensions-examples/mod-extension.md).

    Este aplicativo alvo geralmente responde à solicitação de autorização com uma combinação incorreta de login e senha com o código `403 Não Autorizado` e a mensagem `E-mail ou senha inválidos.`.

    No entanto, se o símbolo `'` for passado em qualquer parte do valor de login, o aplicativo responde com o código `500 Erro Interno do Servidor` e a mensagem `...SequelizeDatabaseError: SQLITE_ERROR:...`; tal comportamento é anômalo.

    Essa anomalia não leva à exploração direta de qualquer vulnerabilidade, mas fornece ao atacante informações sobre a arquitetura do aplicativo e sugere a execução do ataque por [Injeção SQL](../../vuln-list.md#sql-injection).
