# SSL/TLS Yapılandırması

Bu kılavuz, API Güvenlik Duvarı ile korunan uygulama arasındaki SSL/TLS bağlantılarını yapılandırmak için ortam değişkenlerinin nasıl ayarlanacağını ve ayrıca API Güvenlik Duvarı sunucusu için anlatır. Bu değişkenleri, [REST API](../installation-guides/docker-container.md) veya [GraphQL API](../installation-guides/graphql/docker-container.md) için API Duvarı Docker konteynerini başlatırken sağlayın.

## API Güvenlik Duvarı ve uygulama arasında güvenli SSL/TLS bağlantısı

API Güvenlik Duvarı ile özel CA sertifikalarını kullanan korunan uygulamanın sunucusu arasında güvenli bir bağlantı kurmak için aşağıdaki ortam değişkenlerini kullanın:

1. Özelleştirilmiş CA sertifikasını API Firewall konteynerine mount edin. Örneğin, `docker-compose.yaml` dosyanızda aşağıdaki değişikliği yapın:

    ```diff
    ...
        ciltler:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CA>:<CONTAINER_PATH_TO_CA>
    ...
    ```
1. Aşağıdaki ortam değişkenlerini kullanarak monte edilen dosya yolunu sağlayın:

| Ortam değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_SERVER_ROOT_CA`<br>(`APIFW_SERVER_INSECURE_CONNECTION` değeri `false` ise) | Docker konteyneri içerisindeki korunan uygulama sunucusunun CA sertifikasına yol. |

## API Güvenlik Duvarı ve uygulama arasında güvensiz bağlantı

API Güvenlik Duvarı ile korunan uygulamanın sunucusu arasında güvensiz bir bağlantı (yani, SSL/TLS doğrulamasını atlatma) kurmak için bu ortam değişkenini kullanın:

| Ortam değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_SERVER_INSECURE_CONNECTION` | Korunan uygulama sunucusunun SSL/TLS sertifika doğrulamasının devre dışı bırakılması gerekip gerekmediğini belirler. Sunucu adresi `APIFW_SERVER_URL` değişkeninde belirtilmiştir. Varsayılan olarak (`false`), sistem, varsayılan CA sertifikası veya `APIFW_SERVER_ROOT_CA`'da belirtilen sertifika ile güvenli bir bağlantı dener. |

## API Firewall sunucusu için SSL/TLS

API Güvenlik Duvarını çalıştıran sunucunun HTTPS bağlantılarını kabul etmesini sağlamak için aşağıdaki adımları izleyin:

1. Sertifika ve özel anahtar dizinini API Firewall konteynerine mount edin. Örneğin, `docker-compose.yaml` dosyanızda aşağıdaki değişikliği yapın:

    ```diff
    ...
        ciltler:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CERT_DIR>:<CONTAINER_PATH_TO_CERT_DIR>
    ...
    ```
1. Aşağıdaki ortam değişkenlerini kullanarak mount edilen dosya yollarını sağlayın:

| Ortam değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_TLS_CERTS_PATH`            | Konteynerdeki sertifika ve özel anahtarın monte edildiği dizine yol. |
| `APIFW_TLS_CERT_FILE`             | API Güvenlik Duvarı için SSL/TLS sertifikasının dosya adı, `APIFW_TLS_CERTS_PATH` dizini içerisinde yer alır. |
| `APIFW_TLS_CERT_KEY`              | API Güvenlik Duvarı için SSL/TLS özel anahtarının dosya adı, `APIFW_TLS_CERTS_PATH` dizini içerisinde bulunur. |
