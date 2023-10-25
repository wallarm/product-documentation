# WebSocket Köken Doğrulaması

Bir tarayıcı bir WebSocket bağlantısı başlattığında, otomatik olarak talebin geldiği alan adını belirten bir `Origin` başlığı ekler. Wallarm API Güvenlik Duvarı ile WebSocket bağlantısının yükseltme aşamasında `Origin` başlığının değerinin önceden tanımlanmış listenizle eşleştiğinden emin olabilirsiniz. Bu makale, [GraphQL sorguları](docker-container.md) için `Origin` doğrulamasını nasıl etkinleştireceğinizi anlatmaktadır.

Varsayılan olarak, WebSocket Köken doğrulama özelliği devre dışıdır. Etkinleştirmek için aşağıdaki ortam değişkenlerini yapılandırın:

| Ortam değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_WS_CHECK_ORIGIN` | WebSocket yükseltme aşamasında `Origin` başlığının doğrulanmasını etkinleştirir. Varsayılan: `false`. |
| `APIFW_GRAPHQL_WS_ORIGIN` (`APIFW_GRAPHQL_WS_CHECK_ORIGIN` `true` ise gereklidir) | WebSocket bağlantıları için izin verilen kökenler listesi. Kökenler `;` ile ayrılır. |

`APIFW_GRAPHQL_WS_CHECK_ORIGIN` [`APIFW_GRAPHQL_REQUEST_VALIDATION`](docker-container.md#apifw-graphql-request-validation) bağımsız olarak çalışır. Hatalı `Origin` başlığına sahip WebSocket talepleri, talebin doğrulama modundan bağımsız olarak engellenecektir.