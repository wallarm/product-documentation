# API Firewall'da GraphQL Oyun Alanı

Wallarm API Firewall, geliştiricilere [GraphQL Oyun Alanını](https://github.com/graphql/graphql-playground) sunar. Bu kılavuz, oyun alanının nasıl çalıştırılacağını açıklar.

GraphQL Oyun Alanı, özellikle GraphQL için tasarlanmış bir tarayıcı içi Entegre Geliştirme Ortamı (IDE)'dir. Geliştiricilerin kolaylıkla yazabileceği, inceleyebileceği ve GraphQL sorgularının, mutasyonlarının ve aboneliklerinin bitmek tükenmek bilmeyen olasılıklarına dalabileceği görsel bir platform olarak tasarlanmıştır.

Oyun alanı, şemanın `APIFW_SERVER_URL`'e ayarlanmış URL'den otomatik olarak alınmasıdır. Bu eylem, GraphQL şemasını açığa çıkaran bir iç gözlem sorgusudur. Bu nedenle, `APIFW_GRAPHQL_INTROSPECTION` değişkeninin `true` olarak ayarlanması gerekmektedir. Böylece bu sürece izin verilir, API Firewall günlüklerinde olası hataların önüne geçilir.

Oyun alanını API Firewall içinde etkinleştirmek için aşağıdaki çevre değişkenlerini kullanmanız gerekir:

| Çevre değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_INTROSPECTION` | GraphQL şemanızın şeklini açığa çıkaran iç gözlem sorgularına izin verir. Bu değişkenin `true` olarak ayarlandığından emin olun. |
| `APIFW_GRAPHQL_PLAYGROUND` | Oyun alanı özelliğini değiştirir. Varsayılan olarak `false` olarak ayarlanmıştır. Etkinleştirmek için `true` olarak değiştirin. |
| `APIFW_GRAPHQL_PLAYGROUND_PATH` | Oyun alanının erişilebilir olacağı yolu belirtir. Varsayılan olarak kök yol `/`'dir. |

Bir kez kurulduktan sonra, tarayıcınızdaki belirlenmiş yoldan oyun alanı arayüzüne erişebilirsiniz:

![Oyun Alanı](https://github.com/wallarm/api-firewall/blob/main/images/graphql-playground.png?raw=true)