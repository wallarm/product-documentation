# Conformidade com limites GraphQL

Você pode configurar o Firewall de API para validar consultas GraphQL de entrada contra restrições de consulta predefinidas. Ao aderir a esses limites, você pode proteger sua API GraphQL de consultas maliciosas, incluindo potenciais ataques DoS. Este guia explica como o firewall calcula atributos de consulta como solicitações de nó, profundidade de consulta e complexidade antes de alinhá-los com seus parâmetros definidos.

Ao [executar](docker-container.md) o contêiner Docker Firewall de API para uma API GraphQL, você define limites usando as seguintes variáveis de ambiente:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | Define o número máximo de solicitações de nó que podem ser necessárias para executar a consulta. Definir como `0` desativa a verificação de complexidade. |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | Especifica a profundidade máxima permitida de uma consulta GraphQL. Um valor de `0` significa que a verificação da profundidade da consulta é ignorada. |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | Define o limite superior para a contagem de nós em uma consulta. Quando definido como `0`, a verificação do limite de contagem de nó é ignorada. | 

## Como o cálculo do limite funciona

O Firewall de API utiliza a biblioteca [wundergraph/graphql-go-tools](https://github.com/wundergraph/graphql-go-tools), que adota algoritmos semelhantes aos utilizados pelo GitHub para calcular a complexidade da consulta GraphQL. Central para isso é a função `OperationComplexityEstimator`, que processa uma definição de esquema e uma consulta, examinando iterativamente a consulta para obter tanto sua complexidade como profundidade.

 Você pode ajustar este cálculo integrando argumentos inteiros em campos que significam o número de nós que um campo retorna:

* `diretiva @nodeCountMultiply em DEFINIÇÃO DE ARGUMENTO`

    Indica que o valor Int ao qual a diretiva é aplicada deve ser utilizado como um multiplicador de nó.
* `diretiva @nodeCountSkip em CAMPO`
    Indica que o algoritmo deve ignorar esse Nó. Isso é útil para permitir determinados caminhos de consulta, por exemplo, para introspecção.

Para documentos com várias consultas, a complexidade, profundidade e contagem de nós calculadas se aplicam a todo o documento, não apenas à única consulta sendo executada.

## Exemplos de cálculos

Abaixo, há alguns exemplos que oferecerão uma perspectiva mais clara sobre os cálculos. Eles são baseados no seguinte esquema GraphQL:

```
type User {
    name: String!
    messages(first: Int! @nodeCountMultiply): [Message]
}

type Message {
    id: ID!
    text: String!
    createdBy: String!
    createdAt: Time!
}

type Query {
        __schema: __Schema! @nodeCountSkip
    users(first: Int! @nodeCountMultiply): [User]
    messages(first: Int! @nodeCountMultiply): [Message]
}

type Mutation {
    post(text: String!, username: String!, roomName: String!): Message!
}

type Subscription {
    messageAdded(roomName: String!): Message!
}

scalar Time

directive @nodeCountMultiply on ARGUMENT_DEFINITION
directive @nodeCountSkip on FIELD
```

A profundidade sempre representa os níveis de aninhamento dos campos. Por exemplo, a consulta abaixo tem uma profundidade de 3:

```
{
    a {
        b {
            c
        }
    }
}
```

### Exemplo 1

```
query {
  users(first: 10) {
    name
    messages(first:100) {
      id
      text
    }
  }
}
```

* ContagemDeNó = {int} 1010

    ```
    Contagem de Nó = 10 [users(first: 10)] + 10*100 [messages(first:100)] = 1010
    ```

* Complexidade = {int} 11
    
    ```
    Complexidade = 1 [users(first: 10)] + 10 [messages(first:100)] = 11
    ```

* Profundidade = {int} 3

### Exemplo 2

```
query {
  users(first: 10) {
    name
  }
}
```

* ContagemDeNó = {int} 10

    ```
    Contagem de Nó = 10 [users(first: 10)] = 10
    ```

* Complexidade = {int} 1

    ```
    Complexidade = 1 [users(first: 10)] = 1
    ```
* Profundidade = {int} 2

### Exemplo 3

```
query {
  message(id:1) {
    id
    text
  }
}
```

* ContagemDeNó = {int} 1

    ```
    Contagem de Nó = 1 [message(id:1)] = 1
    ```

* Complexidade = {int} 1

    ```
    Complexidade = 1 [messages(first:1)] = 1
    ```

* Profundidade = {int} 2

### Exemplo 4

```
query {
  users(first: 10) {
    name
    messages(first:1) {
      id
      text
    }
  }
}
```

* ContagemDeNó = {int} 20

    ```
    Contagem de Nó = 10 [users(first: 10)] + 10*1 [messages(first:1)] = 20
    ```

* Complexidade = {int} 11

    ```
    Complexidade = 1 [users(first: 10)] + 10 [messages(first:1)] = 11
    ```

* Profundidade = {int} 3

### Exemplo 5 (consulta de introspecção)

```
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
```

* ContagemDeNó = {int} 0
* Complexidade = {int} 0
* Profundidade = {int} 0

Como a diretiva `__schema: __Schema! @nodeCountSkip` está presente no esquema, a contagem de Nó, a Complexidade e a Profundidade calculadas são todas 0.