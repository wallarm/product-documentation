[img-custom-dsl-slider]:    ../../../images/fast/operations/en/test-policy/policy-editor/custom-slider.png

[link-user-extensions]:     ../../dsl/intro.md
[link-connect-extensions]:  ../../dsl/using-extension.md

[doc-fuzzer]:               fuzzer-intro.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability

[vuln-ptrav]:               ../../vuln-list.md#path-traversal
[vuln-rce]:                 ../../vuln-list.md#remote-code-execution-rce
[vuln-sqli]:                ../../vuln-list.md#sql-injection
[vuln-xss]:                 ../../vuln-list.md#cross-site-scripting-xss
[vuln-xxe]:                 ../../vuln-list.md#attack-on-xml-external-entity-xxe


#   Configuração do Processo de Detecção de Vulnerabilidade

O FAST detecta [vulnerabilidades][gl-vuln] utilizando as seguintes opções:

* Extensões integradas FAST
* [Extensões personalizadas][link-user-extensions]

    !!! info "Extensões personalizadas"
        Para usar as extensões personalizadas, por favor [conecte][link-connect-extensions] elas ao nó FAST.

Você pode controlar a maneira de detectar vulnerabilidades no aplicativo das seguintes maneiras:

* Se você deseja realizar testes usando a extensão integrada FAST, marque as caixas de vulnerabilidades das quais você deseja executar testes.
* Se você deseja realizar testes usando apenas extensões personalizadas, excluindo as extensões integradas FAST, desmarque todas as caixas ou ative o interruptor **Use apenas DSL personalizado** e selecione as vulnerabilidades da lista.

    ![O interruptor DSL personalizado][img-custom-dsl-slider]

    Por favor, note que se o interruptor **Use apenas DSL personalizado** estiver ativado, então as extensões integradas FAST e o [FAST fuzzer][doc-fuzzer] serão desativados. Se o FAST fuzzer estiver habilitado, então o interruptor **Use apenas DSL personalizado** se tornará inativo novamente.

!!! info "Vulnerabilidades básicas"
    Ao criar uma política, as vulnerabilidades mais típicas que podem ser detectadas nas aplicações são selecionadas por padrão:

    * [travessia de caminho (PTRAV)][vuln-ptrav],
    * [execução remota de código (RCE)][vuln-rce],
    * [injeção de SQL (SQLi)][vuln-sqli],
    * [cross-site scripting (XSS)][vuln-xss],
    * [vulnerabilidade ao ataque em entidade externa XML (XXE)][vuln-xxe].
    
    Se você usar políticas personalizadas, poderá desabilitar o teste da aplicação para uma vulnerabilidade específica ao desmarcar a caixa correspondente a qualquer momento.