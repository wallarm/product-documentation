# الالتزام بحدود GraphQL

يُمكنك تهيئة جدار الحماية API للتحقق من استعلامات GraphQL الواردة مقابل قيود الاستعلام المحددة مسبقًا. من خلال الالتزام بهذه الحدود، يُمكنك حماية واجهة برمجة تطبيقات GraphQL الخاصة بك من الاستعلامات الخبيثة، بما في ذلك الهجمات المحتملة للحرمان من الخدمة (DoS). يوضح هذا الدليل كيف يحسب جدار الحماية خصائص الاستعلام مثل طلبات العقدة وعمق الاستعلام وتعقيده قبل مطابقتها مع المعايير التي حددتها.

عند [تشغيل](docker-container.md) حاوية Docker لجدار حماية API لواجهة برمجة تطبيقات GraphQL، تقوم بتعيين الحدود باستخدام المتغيرات البيئية التالية:

| متغير البيئة | الوصف |
| ------------ | ----- |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | يُحدد الحد الأقصى لعدد طلبات العقدة التي قد تكون مطلوبة لتنفيذ الاستعلام. تعيينه إلى `0` يُعطل فحص التعقيد. |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | يُحدد العمق الأقصى المسموح به لاستعلام GraphQL. قيمة `0` تعني تجاوز فحص عمق الاستعلام. |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | يُحدد الحد الأقصى لعدد العقد في استعلام. عند تعيينه إلى `0`، يتم تخطي فحص حد العدد. |

## كيفية عمل حساب الحدود

يستفيد جدار الحماية API من مكتبة [wundergraph/graphql-go-tools](https://github.com/wundergraph/graphql-go-tools)، التي تعتمد خوارزميات مماثلة لتلك التي تستخدمها GitHub لحساب تعقيد استعلام GraphQL. الأساس في ذلك هو دالة `OperationComplexityEstimator`، التي تعالج تعريف المخطط والاستعلام، مُفحصة الاستعلام تكراريًا للحصول على كل من تعقيده وعمقه.

يُمكنك تعديل هذا الحساب بدمج وسيطات صحيحة على الحقول التي تُشير إلى عدد العقد التي يُعيد الحقل:

* `directive @nodeCountMultiply on ARGUMENT_DEFINITION`

    يُشير إلى أن القيمة الصحيحة المُطبق عليها الأمر يجب أن تُستخدم كمضاعف للعقدة.
* `directive @nodeCountSkip on FIELD`
    يُشير إلى أن الخوارزمية يجب أن تتجاهل هذه العقدة. هذا مفيد لتبييض بعض مسارات الاستعلام، مثل الاستعلام التأملي.

بالنسبة للوثائق ذات الاستعلامات المتعددة، ينطبق تعقيد الحساب، والعمق، وعدد العقد على الوثيقة بأكملها، وليس فقط على الاستعلام الذي يتم تشغيله.

## أمثلة للحساب

أدناه هناك بعض الأمثلة التي ستمنح منظورًا أوضح على الحسابات. وهي مبنية على مخطط GraphQL التالي:

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

عمق يُمثل دائمًا مستويات تداخل الحقول. على سبيل المثال، الاستعلام أدناه له عمق 3:

```
{
    a {
        b {
            c
        }
    }
}
```

### مثال 1

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

* عدد العقد = {int} 1010

    ```
    عدد العقد = 10 [users(first: 10)] + 10*100 [messages(first:100)] = 1010
    ```

* التعقيد = {int} 11
    
    ```
    التعقيد = 1 [users(first: 10)] + 10 [messages(first:100)] = 11
    ```

* العمق = {int} 3

### مثال 2

```
query {
  users(first: 10) {
    name
  }
}
```

* عدد العقد = {int} 10

    ```
    عدد العقد = 10 [users(first: 10)] = 10
    ```

* التعقيد = {int} 1

    ```
    التعقيد = 1 [users(first: 10)] = 1
    ```
* العمق = {int} 2

### مثال 3

```
query {
  message(id:1) {
    id
    text
  }
}
```

* عدد العقد = {int} 1

    ```
    عدد العقد = 1 [message(fid:1)] = 1
    ```

* التعقيد = {int} 1

    ```
    التعقيد = 1 [messages(first:1)] = 1
    ```

* العمق = {int} 2

### مثال 4

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

* عدد العقد = {int} 20

    ```
    عدد العقد = 10 [users(first: 10)] + 10*1 [messages(first:1)] = 20
    ```

* التعقيد = {int} 11

    ```
    التعقيد = 1 [users(first: 10)] + 10 [messages(first:1)] = 11
    ```

* العمق = {int} 3

### مثال 5 (استعلام تأملي)

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

* عدد العقد = {int} 0
* التعقيد = {int} 0
* العمق = {int} 0

بما أن الأمر `__schema: __Schema! @nodeCountSkip` موجود في المخطط، فإن عدد العقد المحسوب، والتعقيد، والعمق كلهم 0.