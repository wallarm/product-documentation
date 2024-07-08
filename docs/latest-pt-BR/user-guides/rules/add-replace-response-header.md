# Definindo headers de resposta

A regra **Alterar headers de resposta do servidor** permite adicionar, deletar headers de resposta do servidor e alterar seus valores.

Este tipo de regra é mais frequentemente usado para configurar a camada adicional de segurança do aplicativo, por exemplo:

* Para adicionar o header de resposta [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) controlando os recursos que o cliente tem permissão para carregar para uma determinada página. Isso ajuda a proteger contra os ataques de [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss).

    Se seu servidor não retornar este header por padrão, é recomendado adicioná-lo usando a regra **Alterar headers de resposta do servidor**. Nos Documentos Web da MDN, você pode encontrar descrições de [valores possíveis do header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) e [exemplos de uso do header](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases).

    Da mesma forma, essa regra pode ser usada para adicionar os headers de resposta [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection), [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options).
* Para alterar o cabeçalho NGINX `Server` ou qualquer outro cabeçalho contendo os dados das versões dos módulos instalados. Esses dados podem ser potencialmente usados pelo atacante para descobrir vulnerabilidades das versões dos módulos instalados e, como resultado, explorar as vulnerabilidades descobertas.

    O cabeçalho NGINX `Server` pode ser alterado a partir do nó Wallarm 2.16.

A regra **Alterar headers de resposta do servidor** também pode ser usada para resolver qualquer problema técnico ou de negócios que você tenha.

## Criando e aplicando a regra

--8<-- "../include-pt-BR/waf/features/rules/rule-creation-options.md"

Para criar e aplicar a regra na seção **Regras**:

1. Crie a regra **Alterar headers de resposta do servidor** na seção **Regras** do Console Wallarm. A regra consiste nos seguintes componentes:

     * **Condição** [descreve](rules.md#branch-description) os endpoints para aplicar a regra.
     * Nome do cabeçalho a ser adicionado ou para substituir seu valor.
     * Novo valor do cabeçalho especificado.

        Para excluir um cabeçalho de resposta existente, deixe o valor deste cabeçalho na guia **Substituir** vazio.

2. Aguarde a [compilação da regra ser concluída](rules.md).

## Exemplo de regra

Para permitir que todo o conteúdo de `https://example.com/*` venha apenas da origem do site, você pode adicionar o cabeçalho de resposta [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) usando a regra **Alterar headers de resposta do servidor** da seguinte maneira:

![Exemplo da regra "Alterar headers de resposta do servidor"](../../images/user-guides/rules/add-replace-response-header.png)