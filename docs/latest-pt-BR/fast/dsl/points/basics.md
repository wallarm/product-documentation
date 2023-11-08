[link-fast]:                ../intro.md
[link-parsers]:             parsers.md

# Conceitos Básicos

[Extensões FAST][link-fast] descrevem a lógica de processamento do elemento de solicitação base que é usada para criar novas solicitações de teste. O principal propósito de *pontos* é especificar qual parte do dado da solicitação baseline deve passar pelas ações que são descritas na extensão.

Um ponto é uma string que indica a parte da solicitação base em que a ação especificada na extensão deve ser aplicada. Essa string compõe uma sequência de nomes de parsers e filtros que devem ser aplicados à solicitação base para obter os dados necessários.

* *Parsers* criam estruturas de dados baseadas na entrada de string recebida.
* *Filtros* são usados para
obter certos valores da estrutura de dados criada pelos parsers.

Outros filtros e parsers podem ser aplicados aos valores que os filtros apontam. Ao aplicar sequencialmente parsers e filtros à solicitação, você pode extrair os valores do elemento da solicitação que são necessários para o processamento futuro.

A variedade de parsers e filtros que podem ser usados em um ponto permite a criação de extensões que usam o formato de solicitações da aplicação web alvo.

As [subseções seguintes][link-parsers] descrevem parsers e filtros que podem ser usados em pontos de extensão FAST DSL.