# İhlal Edilmiş Tokenlerle Taleplerin Engellenmesi

Wallarm API Güvenlik Duvarı, sızdırılan kimlik doğrulama token'larının kullanılmasını önlemek için bir özellik sağlar. Bu kılavuz, bu özelliği [REST API](../installation-guides/docker-container.md) veya [GraphQL API](../installation-guides/graphql/docker-container.md) için API Güvenlik Duvarı Docker konteynerini kullanarak nasıl etkinleştireceğinizi açıklar. 

Bu yetenek, ihlal edilmiş tokenler hakkında tarafınızdan sağlanan verilere dayanır. Bunu etkinleştirmek için, bu token'ları içeren bir .txt dosyasını güvenlik duvarı Docker konteynerine monte edin ve ardından ilgili ortam değişkenini ayarlayın. Bu özelliğe daha derinlemesine bir bakış için, [blog yazımızı](https://lab.wallarm.com/oss-api-firewall-unveils-new-feature-blacklist-for-compromised-api-tokens-and-cookies/) okuyun.

REST API için, bayrakla işaretlenmiş tokenlerden herhangi biri bir istekte ortaya çıkarsa, API Güvenlik Duvarı, [`APIFW_CUSTOM_BLOCK_STATUS_CODE`](../installation-guides/docker-container.md#apifw-custom-block-status-code) ortam değişkeninde belirtilen durum kodunu kullanarak yanıt verir. GraphQL API için, bayrakla işaretlenmiş bir token içeren herhangi bir istek, monte edilmiş şema ile uyumlu olsa bile engellenir.

Reddedenleri etkinleştirme özelliği:

1. İhlal edilmiş token'larla bir .txt dosyası taslağı oluşturun. Her token yeni bir satırda olmalıdır. İşte bir örnek:

    ```txt
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODIifQ.CUq8iJ_LUzQMfDTvArpz6jUyK0Qyn7jZ9WCqE0xKTCA
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODMifQ.BinZ4AcJp_SQz-iFfgKOKPz_jWjEgiVTb9cS8PP4BI0
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODQifQ.j5Iea7KGm7GqjMGBuEZc2akTIoByUaQc5SSX7w_qjY8
    ```
1. Reddedilenler dosyasını güvenlik duvarı Docker konteynerine monte edin. Örneğin, `docker-compose.yaml` dosyanızda aşağıdaki değişikliği yapın:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_LEAKED_TOKEN_FILE>:<CONTAINER_PATH_TO_LEAKED_TOKEN_FILE>
    ...
    ```
1. Docker konteynerini başlatırken aşağıdaki ortam değişkenlerini girin:

| Ortam Değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_DENYLIST_TOKENS_FILE` | Monte edilen reddedenler dosyasının konteynerdeki yolu. Örnek: `/auth-data/tokens-denylist.txt`. |
| `APIFW_DENYLIST_TOKENS_COOKIE_NAME` | Kimlik doğrulama simgesini taşıyan Çerezin adı. |
| `APIFW_DENYLIST_TOKENS_HEADER_NAME` | Kimlik doğrulama simgesini iletirken Başlığın adı. Hem `APIFW_DENYLIST_TOKENS_COOKIE_NAME` hem de `APIFW_DENYLIST_TOKENS_HEADER_NAME` belirtilmişse, API Güvenlik Duvarı ikisini de sırayla kontrol eder. |
| `APIFW_DENYLIST_TOKENS_TRIM_BEARER_PREFIX` | Karşılaştırma sırasında kimlik doğrulama başlığından `Bearer` önekinin kaldırılması gerekip gerekmediğini belirtir. Reddedenler listesindeki token'lar bu öneki içermiyorsa, ancak kimlik doğrulama başlığı yapıyorsa, token'lar doğru bir şekilde eşleştirilmeyebilir. `true` veya `false` (varsayılan) kabul eder. |