# Ignorando certos tipos de ataque

A regra **Ignore certos tipos de ataque** permite desativar a detecção de certos tipos de ataque em certos elementos de solicitação.

Por padrão, o nó Wallarm marca a solicitação como um ataque se detectar os sinais de qualquer tipo de ataque em qualquer elemento da solicitação. No entanto, algumas solicitações que contêm sinais de ataque podem realmente ser legítimas (por exemplo, o corpo da solicitação publicando a postagem no Fórum do Administrador de Banco de Dados pode conter a descrição do [comando SQL malicioso](../../attacks-vulns-list.md#sql-injection)).

Se o nó Wallarm marcar a carga útil padrão da solicitação como maliciosa, ocorre um [falso positivo](../../about-wallarm/protecting-against-attacks.md#false-positives). Para evitar falsos positivos, as regras padrão de detecção de ataque precisam ser ajustadas usando as regras personalizadas de certos tipos para acomodar as especificidades do aplicativo protegido. Um desses tipos de regra personalizada é **Ignore certos tipos de ataque**.

## Criando e aplicando a regra

--8<-- "../include-pt-BR/waf/features/rules/rule-creation-options.md"

Para criar e aplicar a regra na seção **Regras**:

1. Crie a regra **Ignore certos tipos de ataque** na seção **Regras** do Console Wallarm. A regra consiste nos seguintes componentes:

      * **Condição** [descreve](rules.md#branch-description) os pontos finais para aplicar a regra.
      * Tipos de ataque a serem ignorados no elemento de solicitação especificado.

        A guia **Certos tipos de ataques** permite selecionar um ou mais tipos de ataque que o nó Wallarm pode detectar no momento da criação da regra.

        A guia **Todos os tipos de ataque (atualização automática)** desativa a detecção de ambos os tipos de ataque que o nó Wallarm pode detectar no momento da criação da regra e aqueles que serão detectados no futuro. Por exemplo: se o Wallarm suportar uma nova detecção de tipo de ataque, o nó ignorará automaticamente os sinais desse tipo de ataque no elemento de solicitação selecionado.
      
      * **Parte da solicitação** aponta para o elemento original da solicitação que não deve ser analisado para sinais do tipo de ataque selecionado.

         --8<-- "../include-pt-BR/waf/features/rules/request-part-reference.md"

2. Aguarde a [compilação da regra ser concluída](rules.md).

## Exemplo de regra

Vamos supor que quando o usuário confirma a publicação da postagem no Fórum do Administrador de Banco de Dados, o cliente envia a solicitação POST para o endpoint `https://exemplo.com/posts/`. Esta solicitação tem as seguintes propriedades:

* O conteúdo do post é passado no parâmetro `postBody` do corpo da solicitação. O conteúdo do post pode incluir comandos SQL que podem ser marcados pelo Wallarm como maliciosos.
* O corpo da solicitação é do tipo `application/json`.

O exemplo da solicitação cURL contendo [injeção de SQL](../../attacks-vulns-list.md#sql-injection):

```bash
curl -H "Content-Type: application/json" -X POST https://exemplo.com/posts -d '{"emailAddress":"johnsmith@exemplo.com", "postHeader":"Injeções de SQL", "postBody":"Meu post descreve a seguinte injeção de SQL: ?id=1%20select%20version();"}'
```

Para ignorar injeções de SQL no parâmetro `postBody` das solicitações para `https://exemplo.com/posts/`, a regra **Ignore certos tipos de ataque** pode ser configurada da seguinte forma:

![Exemplo da regra "Ignore certos tipos de ataque"](../../images/user-guides/rules/ignore-attack-types-rule-example.png)