# GraphQL Sınırları Uyumluluğu

Gelen GraphQL sorgularını önceden belirlenmiş sorgu sınırlarına karşı doğrulamak için API Güvenlik Duvarını yapılandırabilirsiniz. Bu sınırlara uyarak, GraphQL API'nizi kötü amaçlı sorgulardan, potansiyel DoS saldırıları da dahil olmak üzere, koruyabilirsiniz. Bu kılavuz, güvenlik duvarının düğüm istekleri, sorgu derinliği ve karmaşıklığı gibi sorgu özniteliklerini nasıl hesapladığını ve bunları belirlenen parametrelerinizle nasıl hizaladığını anlatır.

Bir GraphQL API için API Güvenlik Duvarını Docker konteynerinde [çalıştırırken](docker-container.md), aşağıdaki ortam değişkenlerini kullanarak sınırlar belirlersiniz:

| Ortam değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | Sorgunun yürütülmesi için gereken maksimum Düğüm istek sayısını tanımlar. Bunu `0` olarak ayarlama, karmaşıklık kontrolünü devre dışı bırakır. |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | Bir GraphQL sorgusunun maksimum izin verilen derinliğini belirtir. `0` değeri, sorgu derinlik kontrolünün atlandığı anlamına gelir. |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | Bir sorgudaki düğüm sayısının üst sınırını belirler. `0` olarak ayarlandığında, düğüm sayısı limit kontrolü atlanır. | 

## Limit hesaplama nasıl çalışır

API Güvenlik Duvarı, [wundergraph/graphql-go-tools](https://github.com/wundergraph/graphql-go-tools) kütüphanesini kullanır, ki bu da GitHub tarafından kullanılan algoritmaları, GraphQL sorgu karmaşıklığını hesaplama konusunda benimser.  Bu sürecin merkezinde `OperationComplexityEstimator` fonksiyonu bulunur, bu fonksiyon bir şema tanımını ve bir sorguyu işler, sorgunun karmaşıklığı ve derinliğini iteratif olarak inceleyerek elde eder.

Bir alanın döndürdüğü Düğümlerin sayısını belirten alanlara tam sayı argümanları entegre ederek bu hesaplamayı ince ayar yapabilirsiniz:

* `directive @nodeCountMultiply on ARGUMENT_DEFINITION`

    Yönergenin uygulandığı Int değerinin bir Düğüm çarpanı olarak kullanılması gerektiğini belirtir.
* `directive @nodeCountSkip on FIELD`

    Algoritmanın bu Düğümü atlaması gerektiğini belirtir. Bu, örneğin iç gözlem için belirli sorgu yollarını beyaz listeye almada yararlıdır.
   
Birden fazla sorgusu olan belgeler için hesaplanan karmaşıklık, derinlik ve düğüm sayısı, yürütülen tek sorguya değil, tüm belgeye uygulanır.

## Hesaplama örnekleri

Aşağıda hesaplamalara dair daha net bir bakış açısı sağlaması için birkaç örnek bulunmaktadır. Bunlar aşağıdaki GraphQL şemasına dayanmaktadır:

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

Derinlik her zaman alanların döngü yapılarının seviyelerini temsil eder. Örneğin, aşağıdaki sorgunun derinliği 3'tür:

```
{
    a {
        b {
            c
        }
    }
}
```

### Örnek 1

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

* NodeCount = {int} 1010

    ```
    Node count = 10 [users(first: 10)] + 10*100 [messages(first:100)] = 1010
    ```

* Complexity = {int} 11
    
    ```
    Complexity = 1 [users(first: 10)] + 10 [messages(first:100)] = 11
    ```

* Depth = {int} 3

### Örnek 2

```
query {
  users(first: 10) {
    name
  }
}
```

* NodeCount = {int} 10

    ```
    Node count = 10 [users(first: 10)] = 10
    ```

* Complexity = {int} 1

    ```
    Complexity = 1 [users(first: 10)] = 1
    ```
* Depth = {int} 2

### Örnek 3

```
query {
  message(id:1) {
    id
    text
  }
}
```

* NodeCount = {int} 1

    ```
    Node count = 1 [message(id:1)] = 1
    ```

* Complexity = {int} 1

    ```
    Complexity = 1 [message(id:1)] = 1
    ```

* Depth = {int} 2

### Örnek 4

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

* NodeCount = {int} 20

    ```
    Node count = 10 [users(first: 10)] + 10*1 [messages(first:1)] = 20
    ```

* Complexity = {int} 11

    ```
    Complexity = 1 [users(first: 10)] + 10 [messages(first:1)] = 11
    ```

* Depth = {int} 3

### Örnek 5 (İntrospection sorgusu)

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

* NodeCount = {int} 0
* Complexity = {int} 0
* Depth = {int} 0

Şemada `__schema: __Schema! @nodeCountSkip` yönergesi mevcut olduğundan, hesaplanan NodeCount, Complexity ve Depth değerleri hepsi 0'dır.