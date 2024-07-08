# Ignorando sinais de ataque nos dados binários

As regras **Permitir dados binários** e **Permitir certos tipos de arquivo** são usadas para ajustar as regras padrão de detecção de ataques para dados binários.

Por padrão, o nó Wallarm analisa requisições de entrada para todos os sinais de ataque conhecidos. Durante a análise, o nó Wallarm pode não considerar os sinais de ataque como símbolos binários regulares e detectar erroneamente cargas maliciosas nos dados binários.

Usando as regras **Permitir dados binários** e **Permitir certos tipos de arquivo**, você pode especificar explicitamente elementos de solicitação contendo dados binários. Durante a análise do elemento de solicitação especificado, o nó Wallarm ignorará os sinais de ataque que nunca podem ser passados nos dados binários.

* A regra **Permitir dados binários** permite o ajuste fino da detecção de ataques para elementos de solicitação contendo dados binários (por exemplo, arquivos arquivados ou criptografados).
* A regra **Permitir certos tipos de arquivo** permite o ajuste fino da detecção de ataques para elementos de solicitação contendo tipos de arquivos específicos (por exemplo, PDF, JPG).

## Criando e aplicando a regra

--8<-- "../include-pt-BR/waf/features/rules/rule-creation-options.md"

Para criar e aplicar a regra na seção **Regras**:

1. Para ajustar as regras de detecção de ataques para os dados binários passados no elemento de solicitação especificado de qualquer maneira, crie a regra **Permitir dados binários** na seção **Regras** do console Wallarm. A regra consiste nos seguintes componentes:

    * **Condição** [descreve](rules.md#branch-description) os pontos finais para aplicar a regra.
    * **Parte da solicitação** aponta para o elemento de solicitação original contendo os dados binários.

         --8<-- "../include-pt-BR/waf/features/rules/request-part-reference.md"
2. Para ajustar as regras de detecção de ataques para certos tipos de arquivos passados no elemento de solicitação especificado, crie a regra **Permitir certos tipos de arquivo** na seção **Regras** do console Wallarm. A regra consiste nos seguintes componentes:

    * **Condição** [descreve](rules.md#branch-description) os pontos finais para aplicar a regra.
    * Tipos de arquivos para ignorar os sinais de ataque.
    * **Parte da solicitação** aponta para o elemento de solicitação original contendo os tipos de arquivos especificados.

         --8<-- "../include-pt-BR/waf/features/rules/request-part-reference.md"
3. Aguarde a [compilação da regra ser concluída](rules.md).

## Exemplo de regra

Digamos que, ao usuário fazer o upload do arquivo binário com a imagem usando o formulário no site, o cliente envia a solicitação POST do tipo `multipart/form-data` para `https://example.com/uploads/`. O arquivo binário é passado no parâmetro do corpo `fileContents`.

A regra **Permitir dados binários** ajustando a detecção de ataques no parâmetro `fileContents` é a seguinte:

![Exemplo da regra "Permitir dados binários"](../../images/user-guides/rules/ignore-binary-attacks-example.png)