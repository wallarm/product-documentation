# Gerenciando analisadores de solicitação

A regra **Desativar/Ativar analisador de solicitação** permite gerir o conjunto de analisadores aplicados à solicitação durante sua análise.

Por padrão, ao analisar a solicitação, o nó Wallarm tenta aplicar sequencialmente cada um dos [analisadores](request-processing.md) adequados a cada elemento da solicitação. No entanto, certos analisadores podem ser aplicados erroneamente e, como resultado, o nó Wallarm pode detectar sinais de ataque no valor decodificado.

Por exemplo: o nó Wallarm pode identificar erroneamente dados não codificados como codificados em [Base64](https://en.wikipedia.org/wiki/Base64), uma vez que os símbolos do alfabeto Base64 são frequentemente usados no texto comum, valores de token, valores UUID e outros formatos de dados. Se decodificar os dados não codificados e detectar sinais de ataque no valor resultante, ocorre o [falso positivo](../../about-wallarm/protecting-against-attacks.md#false-positives).

Para evitar falsos positivos nessas situações, é possível desativar os analisadores aplicados erroneamente a certos elementos da solicitação usando a regra **Desativar/Ativar analisador de solicitação**.

## Criando e aplicando a regra

--8<-- "../include-pt-BR/waf/features/rules/rule-creation-options.md"

Para criar e aplicar a regra na seção **Regras**:

1. Crie a regra **Desativar/Ativar analisador de solicitação** na seção **Regras** do Console Wallarm. A regra consiste nos seguintes componentes:

      * **Condição** [descreve](rules.md#branch-description) os endpoints para aplicar a regra.
      * Analisadores a serem desativados / ativados para o elemento de solicitação especificado.      
      * **Parte da solicitação** aponta para o elemento de solicitação original a ser analisado / não analisado com os analisadores selecionados.

         --8<-- "../include-pt-BR/waf/features/rules/request-part-reference.md"
2. Aguarde a [compilação da regra ser concluída](rules.md).

## Exemplo de regra

Vamos supor que as solicitações para `https://example.com/users/` requerem o cabeçalho de autenticação `X-AUTHTOKEN`. O valor do cabeçalho pode conter combinações específicas de símbolos (por exemplo, `=` no final) para ser decodificado potencialmente por Wallarm com o analisador `base64`.

A regra **Desativar/Ativar analisador de solicitação** evitando falsos positivos nos valores `X-AUTHTOKEN` pode ser configurada da seguinte maneira:

![Exemplo da regra "Desativar/Ativar analisador de solicitação"](../../images/user-guides/rules/disable-parsers-example.png)