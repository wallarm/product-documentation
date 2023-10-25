# Docker Üzerinde API Güvenlik Duvarını REST API İçin Çalıştırma

Bu kılavuz, REST API istek doğrulaması için Docker üzerinde [Wallarm API Güvenlik Duvarı](../index.md) yüklemeyi, indirmeyi ve başlatmayı anlatmaktadır.

## Gereksinimler

* [Docker kurulu ve yapılandırılmış](https://docs.docker.com/get-docker/)
* Wallarm API Güvenlik Duvarı ile korunması gereken uygulamanın REST API'si için geliştirilmiş [OpenAPI 3.0 özelliği](https://swagger.io/specification/)

## API Güvenlik Duvarını Docker Üzerinde Çalıştırma Yöntemleri

API Güvenlik Duvarını Docker üzerinde en hızlı şekilde konuşlandırmanın yöntemi [Docker Compose](https://docs.docker.com/compose/)tur. Aşağıdaki adımlar bu yöntemin kullanılmasına dayanmaktadır.

Gerekli olduğunda `docker run`'ı da kullanabilirsiniz. Aynı ortamı konuşlandırmak için doğru `docker run` komutlarını bu [bölümde](#using-docker-run-to-start-api-firewall) sağladık.

## Adım 1. `docker-compose.yml` dosyasını oluşturun

API Güvenlik Duvarını ve doğru ortamı Docker Compose kullanarak konuşlandırmak için, önce şu içeriğe sahip **docker-compose.yml** dosyasını oluşturun:

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
      APIFW_API_SPECS: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_RESPONSE_VALIDATION: <RESPONSE_VALIDATION_MODE>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: kennethreitz/httpbin
    restart: on-failure
    ports:
      - 8090:8090
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## Adım 2. Docker ağını yapılandırın

Gerekli olduğunda **docker-compose.yml** → `networks` içinde belirtilen [Docker ağ](https://docs.docker.com/network/) yapılandırmasını değiştirin.

Sağlanan **docker-compose.yml** Docker'a uygulama ve API Güvenlik Duvarı konteynerlerini `api-firewall-network` ağına bağlayarak ağı oluşturması talimatını verir.

Konteynerleştirilmiş uygulamanın ve API Güvenlik Duvarının iletişimini elle bağlamadan sağlamak için ayrı bir Docker ağı kullanmanız önerilir.

## Adım 3. API Güvenlik Duvarı ile korunacak uygulamayı yapılandırın

API Güvenlik Duvarı ile korunacak konteynerleştirilmiş uygulamanın yapılandırmasını değiştirin. Bu yapılandırma **docker-compose.yml** → `services.backend` içinde tanımlanır.

Sağlanan **docker-compose.yml**, Docker'a `api-firewall-network` ağına bağlanmış ve `backend` [ağ takma adı]() ile atanan [kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) Docker konteynerini başlatması talimatını verir. Konteyner portu 8090'dır.

Kendi uygulamanızı yapılandırıyorsanız, yalnızca doğru uygulama konteyner başlatma için gerekli ayarları belirleyin. API Güvenlik Duvarı için özel bir yapılandırma gerekmez.

## Adım 4. API Güvenlik Duvarını yapılandırın

**docker-compose.yml** → `services.api-firewall` içinde API Güvenlik Duvarı yapılandırmasını aşağıdaki gibi ilettin:

**`services.api-firewall.volumes` ile** lütfen [OpenAPI 3.0 özelliğini](https://swagger.io/specification/) API Güvenlik Duvarı konteyner dizinine monte edin:
    
* `<HOST_PATH_TO_SPEC>`: Ana makinede bulunan uygulamanızın REST API'si için OpenAPI 3.0 özelliğinin yoludur. Kabul edilen dosya formatları YAML ve JSON'dur (`.yaml`, `.yml`, `.json` dosya uzantıları). Örneğin: `/opt/my-api/openapi3/swagger.json`.
* `<CONTAINER_PATH_TO_SPEC>`: OpenAPI 3.0 özelliğini monte edeceğiniz konteyner dizininin yoludur. Örneğin: `/api-firewall/resources/swagger.json`.

**`services.api-firewall.environment` ile** lütfen aşağıdaki ortam değişkenlerinden genel API Güvenlik Duvarı yapılandırmasını belirleyin:

| Ortam değişkeni             | Açıklama                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Gerekli mi? |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| <a name="apifw-api-specs"></a>`APIFW_API_SPECS`                  | OpenAPI 3.0 özelliğinin bulunduğu yolu belirtir.<ul><li>Örneğin konteynere monte edilen özelliğin dosyasının bulunduğu yol: `/api-firewall/resources/swagger.json`. Konteyneri çalışırken bu dosyayı `-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>` seçeneği ile monte edin.</li><li>Örneğin özelliğin dosyasının URL adresi: `https://example.com/swagger.json`. Konteyneri çalışırken `-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>` seçeneğini atlayın.</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Evet        |
| `APIFW_URL`                         | API Güvenlik Duvarı için URL. Örneğin: `http://0.0.0.0:8088/`. Port değeri, ana makineye yayınlanan konteyner portuna karşılık gelmelidir.<br><br>Eğer API Güvenlik Duvarı HTTPS protokolünü dinliyorsa, lütfen oluşturulan SSL/TLS sertifikasını ve özel anahtarı konteynere monte edin ve aşağıda tarif edilen **API Güvenlik Duvarı SSL/TLS ayarlarını** konteynere verin.  | Evet |
| `APIFW_SERVER_URL`                | API Güvenlik Duvarı ile korunması gereken, monte edilen OpenAPI özelliğinde tanımlanan uygulamanın URL'si. Örneğin: `http://backend:80`.  | Evet |
| `APIFW_REQUEST_VALIDATION`        | API Güvenlik Duvarının, uygulama URL'sine gönderilen istekleri doğrulama modu:<ul><li>`BLOCK` monte edilen OpenAPI 3.0 özelliği ile eşleşmeyen istekleri engellemek ve loglamak için (engellenen isteklere `403 Forbidden` yanıtı döndürülür). Loglar, [`STDOUT` ve `STDERR` Docker hizmetlerine](https://docs.docker.com/config/containers/logging/) gönderilir.</li><li>`LOG_ONLY` monte edilen OpenAPI 3.0 özelliği ile eşleşmeyen istekleri yalnızca loglamak ama engellememek için. Loglar, [`STDOUT` ve `STDERR` Docker hizmetlerine](https://docs.docker.com/config/containers/logging/) gönderilir.</li><li>`DISABLE` istek doğrulamasını devre dışı bırakmak için.</li></ul>                                                                                                                              | Evet |
| `APIFW_RESPONSE_VALIDATION`       | API Güvenlik Duvarının, gelen isteklere uygulama yanıtlarını doğrulama modu:<ul><li>`BLOCK` monte edilen OpenAPI 3.0 özelliği ile eşleşmeyen uygulama yanıtı nedeniyle isteği engellemek ve loglamak için. Bu istek uygulama URL'sine yönlendirilecek ancak istemci `403 Forbidden` yanıtını alacak. Loglar, [`STDOUT` ve `STDERR` Docker hizmetlerine](https://docs.docker.com/config/containers/logging/) gönderilir.</li><li>`LOG_ONLY` monte edilen OpenAPI 3.0 özelliği ile eşleşmeyen uygulama yanıtı nedeniyle isteği yalnızca loglamak ama engellememek için. Loglar, [`STDOUT` ve `STDERR` Docker hizmetlerine](https://docs.docker.com/config/containers/logging/) gönderilir.</li><li>`DISABLE` yanıt doğrulamasını devre dışı bırakmak için.</li></ul> | Evet |
| `APIFW_LOG_LEVEL`                 | API Güvenlik Duvarı loglama seviyesi. Olası değerler:<ul><li>`DEBUG` her türlü olayı loglamak için (INFO, ERROR, WARNING, and DEBUG).</li><li>`INFO` INFO, WARNING, ve ERROR türündeki olayları loglamak için.</li><li>`WARNING` WARNING ve ERROR türündeki olayları loglamak için.</li><li>`ERROR` yalnızca ERROR türündeki olayları loglamak için.</li><li>`TRACE` gelen istekleri ve API Güvenlik Duvarı yanıtlarını, içeriklerini de içerecek şekilde loglamak için.</li></ul> Varsayılan değer `DEBUG`'dır. Sağlanan şemanın dışında kalan istek ve yanıtlar hakkındaki loglar ERROR türünde olacaktır.                                                                                                                         | Hayır       |
| <a name="apifw-custom-block-status-code"></a>`APIFW_CUSTOM_BLOCK_STATUS_CODE` | API Güvenlik Duvarı `BLOCK` modunda çalışıyorken ve istek veya yanıt, monte edilen OpenAPI 3.0 özelliği ile eşleşmiyorsa dönecek [HTTP yanıt durum kodu](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). Varsayılan değer `403`. | Hayır |
| `APIFW_ADD_VALIDATION_STATUS_HEADER`<br>(EXPERIMENTAL) | Buğun isteğin `Apifw-Validation-Status` başlıklı bir yanıt döndürülmesi gerekip gerekmediğini belirtir, bu başlık isteğin engellendiği sebebi içerir. Değer `true` veya `false` olabilir. Varsayılan değer `false`.| Hayır |
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | Eğer `true` olarak ayarlanırsa, yönlendirilen isteklerden `Accept-Encoding` başlığı silinir. Varsayılan değer `false`. | Hayır |
| `APIFW_LOG_FORMAT` | API Güvenlik Duvarı loglarının biçimi. Değer `TEXT` veya `JSON` olabilir. Varsayılan değer `TEXT`. | Hayır |
| `APIFW_SHADOW_API_EXCLUDE_LIST`<br>(yalnızca API Güvenlik Duvarı hem istekleri hem de yanıtları için `LOG_ONLY` modunda çalışıyorsa) | Talep edilen API uç noktasının özellikte dahil edilmemiş ve bir gölge olmadığını gösteren [HTTP yanıt durum kodları](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). Birden fazla durum kodunu noktalı virgül ile ayırarak belirtebilirsiniz (örneğin `404;401`). Varsayılan değer `404`.<br><br>Varsayılan olarak, API Güvenlik Duvarı hem istekleri hem de yanıtları için `LOG_ONLY` modunda çalıştığında, özellikte dahil edilmemiş tüm uç noktaları ve `404` dışındaki kodları döndürüyorsa bunları gölge olarak işaretler. | Hayır |
| `APIFW_MODE` | Genel API Güvenlik Duvarı modunu belirler. Olası değerler `PROXY` (varsayılan), [`graphql`](graphql/docker-container.md) ve [`API`](api-mode.md). | Hayır |
| `APIFW_PASS_OPTIONS` | `true` olarak ayarlandığında, API Güvenlik Duvarı özellikte belirtilen uç noktaları için `OPTIONS` isteklerine izin verir, bu da `OPTIONS` yönteminin tanımlanmamış olabileceği anlamına gelir. Varsayılan değer `false`. | Hayır |
| `APIFW_SHADOW_API_UNKNOWN_PARAMETERS_DETECTION` | Bu, isteklerin OpenAPI özelliğinde tanımlananların dışındaki parametrelerle geldiğinde özellikle eşleşmeyen bir istek olarak algılanıp algılanmayacağını belirtir. Varsayılan değer `true`.<br><br>Eğer API Güvenlik Duvarını [`API` modunda](api-mode.md) çalıştırıyorsanız, bu değişkenin adı `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION` olarak değişir. | Hayır |

**`services.api-firewall.ports` ve `services.api-firewall.networks` ile** API Güvenlik Duvarı konteyner portunu belirleyin ve konteyneri oluşturulan ağa bağlayın. Sağlanan **docker-compose.yml**, Docker'a API Güvenlik Duvarını `api-firewall-network` [ağı](https://docs.docker.com/network/) üzerinde 8088 portunda başlatması talimatını verir.

## Adım 5. Yapılandırılmış ortamı konuşlandırın

Yapılandırılmış ortamı oluşturmak ve başlatmak için aşağıdaki komutu çalıştırın:

```bash
docker-compose up -d --force-recreate
```

Log çıktısını kontrol etmek için:

```bash
docker-compose logs -f
```

## Adım 6. API Güvenlik Duvarı işlemini test edin

API Güvenlik Duvarı işlemini test etmek için, monte edilen Açık API 3.0 özelliği ile eşleşmeyen isteği API Güvenlik Duvarı Docker konteyner adresine gönderin. Örneğin, tamsayı değeri gereken bir parametreye dize değeri geçirebilirsiniz.

Eğer istek sağladığınız API şemasıyla eşleşmiyorsa, uygun HATA mesajı API Güvenlik Duvarı Docker konteyner loglarına eklenecektir.

## Adım 7. API Güvenlik Duvarında trafiği etkinleştirin

API Güvenlik Duvarı yapılandırmasını tamamlamak için, lütfen uygulamanızın konuşlandırma şeması yapılandırmasını güncelleyerek API Güvenlik Duvarı üzerinde gelen trafiği etkinleştirin. Örneğin, bu Ingress, NGINX veya yük dengeleyici ayarlarını güncellemeyi gerektirebilir.

## Konuşlandırılan ortamı durdurma

Docker Compose kullanılarak konuşlandırılan ortamı durdurmak için aşağıdaki komutu çalıştırın:

```bash
docker-compose down
```

## API Güvenlik Duvarını başlatmak için `docker run` kullanma

API Güvenlik Duvarını Docker üzerinde başlatmak için, aşağıdaki örneklerde olduğu gibi düzenli Docker komutlarını da kullanabilirsiniz:

1. [Konteynerleştirilmiş uygulamanın ve API Güvenlik Duvarının iletişimini elle bağlamadan sağlamak için ayrı bir Docker ağı oluşturmak](#step-2-configure-the-docker-network) için:

    ```bash
    docker network create api-firewall-network
    ```
2. [API Güvenlik Duvarı ile korunacak konteynerleştirilmiş uygulamayı başlatmak](#step-3-configure-the-application-to-be-protected-with-api-firewall) için:

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p 8090:8090 kennethreitz/httpbin
    ```
3. [API Güvenlik Duvarını başlatmak](#step-4-configure-api-firewall) için:

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_API_SPECS=<PATH_TO_MOUNTED_SPEC> \
        -e APIFW_URL=<API_FIREWALL_URL> -e APIFW_SERVER_URL=<PROTECTED_APP_URL> \
        -e APIFW_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> -e APIFW_RESPONSE_VALIDATION=<RESPONSE_VALIDATION_MODE> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. Ortam başlatıldığında, adımlar 6 ve 7’yi takiben test edin ve API Güvenlik Duvarında trafiği etkinleştirin.