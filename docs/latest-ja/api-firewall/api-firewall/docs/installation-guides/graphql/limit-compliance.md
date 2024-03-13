# GraphQL の制限遵守

API Firewall を設定して、事前に定義されたクエリ制約に対して受信GraphQLクエリを検証できます。これらの制限に従うことで、悪意のあるクエリ、特に DoS 攻撃の可能性から GraphQL API を保護できます。このガイドでは、ファイアウォールがノードリクエスト、クエリの深さ、および複雑さなどのクエリ属性をどのように計算し、それを設定したパラメーターに合わせるかを説明します。

GraphQL API 用の API Firewall Docker コンテナを[実行](docker-container.md)する際、次の環境変数を使用して制限を設定します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | クエリを実行するために必要な可能性があるノードリクエストの最大数を定義します。`0`に設定すると、複雑さのチェックが無効になります。 |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | GraphQL クエリの最大許容深度を指定します。`0`の値は、クエリの深さのチェックがスキップされることを意味します。 |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | クエリ内のノードカウントの上限を設定します。`0`に設定すると、ノードカウント制限のチェックがスキップされます。 | 

## 制限計算の仕組み

API Firewall は、GitHub が GraphQL クエリの複雑さを計算するために使用するアルゴリズムに類似したアルゴリズムを採用している [wundergraph/graphql-go-tools](https://github.com/wundergraph/graphql-go-tools) ライブラリを利用します。これには `OperationComplexityEstimator` 関数が含まれ、スキーマ定義とクエリを処理して、それらの複雑さと深さを反復して調べます。

フィールドが返すノードの数を示す整数の引数を統合することによって、この計算を微調整できます：

* `directive @nodeCountMultiply on ARGUMENT_DEFINITION`

    このディレクティブが適用される Int 値をノード乗数として使用することを示します。
* `directive @nodeCountSkip on FIELD`
    このアルゴリズムがこのノードをスキップするべきことを示します。これは、特定のクエリ パスを許可リストに登録するなど、有用です（例えば、内省のため）。

複数のクエリを含むドキュメントでは、計算された複雑さ、深さ、ノードカウントは、実行されている単一のクエリだけでなく、ドキュメント全体に適用されます。

## 計算例

以下にいくつかの例を示し、計算のより明確な見方を提供します。これらは次の GraphQL スキーマに基づいています：

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

深さは常にフィールドのネストレベルを表します。たとえば、以下のクエリの深さは3です：

```
{
    a {
        b {
            c
        }
    }
}
```

### 例 1

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

* ノードカウント = {int} 1010

    ```
    ノードカウント = 10 [users(first: 10)] + 10*100 [messages(first:100)] = 1010
    ```

* 複雑さ = {int} 11
    
    ```
    複雑さ = 1 [users(first: 10)] + 10 [messages(first:100)] = 11
    ```

* 深さ = {int} 3

### 例 2

```
query {
  users(first: 10) {
    name
  }
}
```

* ノードカウント = {int} 10

    ```
    ノードカウント = 10 [users(first: 10)] = 10
    ```

* 複雑さ = {int} 1

    ```
    複雑さ = 1 [users(first: 10)] = 1
    ```
* 深さ = {int} 2

### 例 3

```
query {
  message(id:1) {
    id
    text
  }
}
```

* ノードカウント = {int} 1

    ```
    ノードカウント = 1 [message(fid:1)] = 1
    ```

* 複雑さ = {int} 1

    ```
    複雑さ = 1 [messages(first:1)] = 1
    ```

* 深さ = {int} 2

### 例 4

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

* ノードカウント = {int} 20

    ```
    ノードカウント = 10 [users(first: 10)] + 10*1 [messages(first:1)] = 20
    ```

* 複雑さ = {int} 11

    ```
    複雑さ = 1 [users(first: 10)] + 10 [messages(first:1)] = 11
    ```

* 深さ = {int} 3

### 例 5（内省クエリ）

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

* ノードカウント = {int} 0
* 複雑さ = {int} 0
* 深さ = {int} 0

スキーマに `__schema: __Schema! @nodeCountSkip` ディレクティブが存在するため、計算されたノードカウント、複雑さ、および深さはすべて 0 です。