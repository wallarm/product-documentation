# GraphQL API için Docker Üzerinde API Güvenlik Duvarı Çalıştırma

Bu kılavuz, GraphQL API istek doğrulaması için Docker üzerinde [Wallarm API Güvenlik Duvarı](../../index.md) indirme, yükleme ve başlatma işlemlerinden geçer. GraphQL modunda, API Güvenlik Duvarı, bir proxy görevi görerek, kullanıcılardan gelen GraphQL isteklerini HTTP veya WebSocket (`graphql-ws`) protokollerini kullanarak arka uç sunucuya yönlendirir. Sunucunun backend tarafındaki yürütme öncesi, güvenlik duvarı GraphQL sorgusunun karmaşıklığını, derinliğini ve düğüm sayısını kontrol eder.

API Güvenlik Duvarı, GraphQL sorgu yanıtlarını doğrulamaz.

## Gereksinimler

* [Yüklenmiş ve yapılandırılmış Docker](https://docs.docker.com/get-docker/)
* Wallarm API Güvenlik Duvarı ile koruma altına alınması gereken uygulamanın GraphQL API’si için geliştirilmiş [GraphQL özelliği](http://spec.graphql.org/October2021/)

## Docker Üzerinde API Güvenlik Duvarını Çalıştırma Yöntemleri

API Güvenlik Duvarını Docker üzerinde sarf etmenin en hızlı yöntemi [Docker Compose](https://docs.docker.com/compose/)'dur. Aşağıdaki adımlar, bu yöntemin kullanılmasına dayanmaktadır.

Gerekliyse, ayrıca `docker run`'ı da kullanabilirsiniz. Aynı ortamın dağıtılmasında kullanılmak üzere uygun `docker run` komutlarını biz sağladık bu [bölümde](#using-docker-run-to-start-api-firewall).

## Adım 1. `docker-compose.yml` dosyasını oluşturun

API Güvenlik Duvarını ve uygun ortamı Docker Compose kullanarak dağıtmak için, öncelikle aşağıdaki içerikle **docker-compose.yml** dosyasını oluşturun. İlerleyen adımlarda, bu şablonu değiştireceksiniz.

```yml
version: '3.8'

networks:
  api-firewall-network:
    name: api-firewall-network

services:
  api-firewall:
    container_name: api-firewall
    image: wallarm/api-firewall:v0.6.13
    restart: on-failure
    volumes:
      - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    environment:
      APIFW_MODE: graphql
      APIFW_GRAPHQL_SCHEMA: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_GRAPHQL_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY: <MAX_QUERY_COMPLEXITY>
      APIFW_GRAPHQL_MAX_QUERY_DEPTH: <MAX_QUERY_DEPTH>
      APIFW_GRAPHQL_NODE_COUNT_LIMIT: <NODE_COUNT_LIMIT>
      APIFW_GRAPHQL_INTROSPECTION: <ALLOW_INTROSPECTION_OR_NOT>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: <IMAGE_WITH_GRAPHQL_APP>
    restart: on-failure
    ports:
      - <HOST_PORT>:<CONTAINER_PORT>
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## Adım 2. Docker ağını yapılandır

Gerekliyse, **docker-compose.yml** → `networks` da belirtilen [Docker network](https://docs.docker.com/network/) yapılandırmasını değiştirin.

Verilen **docker-compose.yml** Docker'a `api-firewall-network` ağını oluşturmasını ve uygulama ve API Güvenlik Duvarı konteynerlerini bu ağa bağlamasını talimat verir.

Korunan konteynerize uygulama ve API Güvenlik Duvarı için ayrı bir Docker ağı kullanmanızı öneririz; böylelikle el ile bağlantı kurmadan bunların iletişim kurmasına izin verilir. 

## Adım 3. API Güvenlik Duvarında koruma altına alınacak uygulamayı yapılandır

API Güvenlik Duvarında koruma altına alınacak konteynerize uygulamanın yapılandırmasını değiştirin. Bu yapılandırma **docker-compose.yml** → `services.backend` da yapılandırılmış.

Bu şablon Docker'a, belirtilen uygulama Docker konteynerini `api-firewall-network`'a bağlayarak ve `backend` [network alias](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname) belirleyerek çekmesi talimatını verir. Portu gereksinimlerinize göre belirleyebilirsiniz.

Uygulamanızı kurarken, başarılı bir konteyner başlatma için yalnızca gerekli ayarları dahil edin. Özel bir API Güvenlik Duvarı yapılandırması gerekli değildir.

## Adım 4. API Güvenlik Duvarını yapılandır

**docker-compose.yml** → `services.api-firewall` üzerinden API Güvenlik Duvarı yapılandırmasını aşağıdaki şekilde geçirin:

**`services.api-firewall.volumes` ile**, [GraphQL özelliği](http://spec.graphql.org/October2021/)ni API Güvenlik Duvarı konteyner dizinine dağıtın:
    
* `<HOST_PATH_TO_SPEC>`: host makinada yer alan API'niz için GraphQL özelliğinin yolunu ifade eder. Dosya formatı önemli değil ancak genellikle `.graphql` ya da `gql` olur. Örneğin: `/opt/my-api/graphql/schema.graphql`.
* `<CONTAINER_PATH_TO_SPEC>`: GraphQL özelliğinin monte edileceği konteyner dizinine giden yol. Örneğin: `/api-firewall/resources/schema.graphql`.

**`services.api-firewall.environment` ile**, aşağıdaki ortam değişkenlerini kullanarak genel API Güvenlik Duvarı yapılandırmasını belirleyin:

| Ortam değişkeni | Açıklama | Zorunlu mu? |
| -------------------- | ----------- | --------- |
| `APIFW_MODE` | Genel API Güvenlik Duvarı modunu ayarlar. Olası değerler [`PROXY`](../docker-container.md) (varsayılan), `graphql` ve [`API`](../api-mode.md). | Hayır |
| <a name="apifw-api-specs"></a>`APIFW_GRAPHQL_SCHEMA` | Konteynere dağıtılmış GraphQL özelliği dosyasının yoludur, örneğin: `/api-firewall/resources/schema.graphql`. | Evet |
| `APIFW_URL` | API Güvenlik Duvarı için URL. Örneğin: `http://0.0.0.0:8088/`. Port değeri, ev sahibine yayınlanan konteyner portuna karşılık gelmeli.<br><br>Eğer API Güvenlik Duvarı HTTPS protokolünü dinliyorsa, lütfen oluşturulan SSL/TLS sertifikasını ve özel anahtarı konteynere dağıtın ve aşağıda anlatılan **API Güvenlik Duvarı SSL/TLS ayarları**nı konteynere geçirin. | Evet |
| `APIFW_SERVER_URL` | API Güvenlik Duvarı ile korunmuş olması gereken, monte edilmiş özelliği yorumlayan uygulamanın URL'i. Örneğin: `http://backend:80`. | Evet |
| <a name="apifw-graphql-request-validation"></a>`APIFW_GRAPHQL_REQUEST_VALIDATION` | Uygulama URL'ye gönderilen istekleri doğrularken API Güvenlik Duvarı modu:<ul><li>`BLOCK` özellikle monte edilmiş GraphQL şemasına uymayan ve `403 Forbidden` dönen istekleri engeller ve günlüğe kaydeder. Günlükler [`STDOUT` ve `STDERR` Docker services](https://docs.docker.com/config/containers/logging/)'lara gönderilir.</li><li>`LOG_ONLY` uyuşmayan istekleri günlüğe kaydeder (ancak engellemez).</li><li>`DISABLE` istek doğrulamasını kapatır.</li></ul>Bu değişken, [`APIFW_GRAPHQL_WS_CHECK_ORIGIN`](websocket-origin-check.md) dışındaki tüm diğer parametreleri etkiler. Örneğin, `APIFW_GRAPHQL_INTROSPECTION` `false` ve mod `LOG_ONLY` ise, introspection istekleri arka uç sunucuya ulaşır, ancak API Güvenlik Duvarı ilgili bir hata günlüğü oluşturur. | Evet |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | Sorgunun gerçekleştirilmesi için gerekebilecek Node isteklerinin [belirlenmesini](limit-compliance.md) sağlar. `0` girildiğinde karmaşıklık kontrolü devre dışı kalır. Varsayılan değer `0`dır. | Evet |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | Bir GraphQL sorgusunun izin verilen maksimum derinliğini [belirtir](limit-compliance.md). `0` değeri, sorgu derinliği kontrolünün atlandığını gösterir. | Evet |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | Bir sorgudaki düğüm sayısı için üst limiti [belirler](limit-compliance.md). `0` olarak ayarlandığında, düğüm sayısı sınırı kontrolü atlanır. | Evet |
| <a name="apifw-graphql-introspection"></a>`APIFW_GRAPHQL_INTROSPECTION` | GraphQL şemanızın yapısını ifşa eden introspection sorgularına izin verir. `true` olarak belirlendiğinde, bu sorgulara izin verilir. | Evet |
| `APIFW_LOG_LEVEL` | API Güvenlik Duvarı günlükleme düzeyi. Olası değerler:<ul><li>Her türden olayları günlüğe kaydetmek için `DEBUG` (INFO, ERROR, WARNING, ve DEBUG).</li><li>INFO, WARNING ve ERROR türlerindeki olayları günlüğe kaydetmek için `INFO`.</li><li>WARNING ve ERROR türlerindeki olayları günlüğe kaydetmek için `WARNING`.</li><li>Yalnızca ERROR türündeki olayları günlüğe kaydetmek için `ERROR`.</li><li>İçeriklerini de içeren gelen istekleri ve API Güvenlik Duvarı yanıtlarını günlüğe kaydetmek için `TRACE`.</li></ul>Varsayılan değer `DEBUG`'dir. Sağlanan şemayla eşleşmeyen istekler ve yanıtlar içeren olayların hata türü ERROR'dur. | Hayır |
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | `true` olarak ayarlandığı taktirde, yönlendirilen isteklerden `Accept-Encoding` başlığı silinir. Varsayılan değer `false`'dur. | Hayır |
| `APIFW_LOG_FORMAT` | API Güvenlik Duvarı günlüklerinin formatı. Değer `TEXT` veya `JSON` olabilir. Varsayılan değer `TEXT`'dir. | Hayır |

**`services.api-firewall.ports` ve `services.api-firewall.networks` ile**, API Güvenlik Duvarı konteyner portunu ayarlayın ve konteyneri oluşturulan ağa bağlayın.

## Adım 5. Yapılandırılmış ortamı dağıt

Yapılandırılmış ortamı oluşturmak ve başlatmak için aşağıdaki komutu çalıştırın:

```bash
docker-compose up -d --force-recreate
```

Günlük çıktısını kontrol etmek için:

```bash
docker-compose logs -f
```

## Adım 6. API Güvenlik Duvarı işlemi test et

API Güvenlik Duvarı işlemini test etmek için, monte edilmiş GraphQL özelliğiyle eşleşmeyen bir isteği, API Güvenlik Duvarı Docker konteyner adresine gönderin.

`APIFW_GRAPHQL_REQUEST_VALIDATION` `BLOCK` olarak ayarlandığında, güvenlik duvarı aşağıdaki gibi çalışır:

* Eğer API Güvenlik Duvarı isteğe izin verirse, isteği arka uç sunucuya yönlendirir.
* Eğer API Güvenlik Duvarı isteği analiz edemiyorsa, 500 durum koduyla birlikte GraphQL hatası döner.
* API Güvenlik Duvarı tarafından doğrulama başarısız olduğunda, isteği backend sunucuya yönlendirmez fakat istemciye 200 durum koduyla ve yanıtta GraphQL hata verir.

Eğer istek sağlanan API şemasına uymazsa, ilgili HATA mesajı API Güvenlik Duvarı Docker konteyner günlüklerine eklenir, örneğin JSON formatında:

```json
{
  "errors": [
    {
      "message": "field: name not defined on type: Query",
      "path": [
        "query",
        "name"
      ]
    }
  ]
}
```

İstekte birden fazla alanın geçersiz olduğu durumlarda, yalnızca tek bir hata mesajı oluşturulur.

## Adım 7. API Güvenlik Duvarında trafik açılıyor

API Güvenlik Duvarı yapılandırmasını tamamlamak için, lütfen uygulama dağıtım düzeni yapılandırmanızı güncelleyerek API Güvenlik Duvarında gelen trafiği etkinleştirin. Örneğin, bu Ingress, NGINX veya yük dengeleyici ayarlarını güncelleme gerektirir.

## Dağıtılan ortamı durdurma

Docker Compose kullanılarak dağıtılan ortamı durdurmak için aşağıdaki komutu çalıştırın:

```bash
docker-compose down
```

## API Güvenlik Duvarını Başlatmak için `docker run` Kullanma

API Güvenlik Duvarını Docker üzerinde başlatmak için, aşağıdaki örneklerde olduğu gibi normal Docker komutlarını da kullanabilirsiniz:

1. Konteynerize uygulama ve API Güvenlik Duvarının iletişim kurmasına el ile bağlantı kurmadan izin vermek için ayrı bir Docker ağı [oluşturmak için](#step-2-configure-the-docker-network):

    ```bash
    docker network create api-firewall-network
    ```
2. API Güvenlik Duvarında koruma altında olacak konteynerize uygulamayı [başlatmak için](#step-3-configure-the-application-to-be-protected-with-api-firewall):

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p <HOST_PORT>:<CONTAINER_PORT> <IMAGE_WITH_GRAPHQL_APP>
    ```
3. API Güvenlik Duvarını [başlatmak için](#step-4-configure-api-firewall):

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_MODE=graphql \
        -e APIFW_GRAPHQL_SCHEMA=<PATH_TO_MOUNTED_SPEC> -e APIFW_URL=<API_FIREWALL_URL> \
        -e APIFW_SERVER_URL=<PROTECTED_APP_URL> -e APIFW_GRAPHQL_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> \
        -e APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY=<MAX_QUERY_COMPLEXITY> \
        -e APIFW_GRAPHQL_MAX_QUERY_DEPTH=<MAX_QUERY_DEPTH> -e APIFW_GRAPHQL_NODE_COUNT_LIMIT=<NODE_COUNT_LIMIT> \
        -e APIFW_GRAPHQL_INTROSPECTION=<ALLOW_INTROSPECTION_OR_NOT> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. Ortam başlatıldığında, adımlar 6 ve 7'yi takip ederek onu test edin ve API Güvenlik Duvarı üzerinde trafiği etkinleştirin.