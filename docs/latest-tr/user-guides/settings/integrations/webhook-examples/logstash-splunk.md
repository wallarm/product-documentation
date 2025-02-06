[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Logstash ile Splunk Enterprise

Bu talimatlar, Wallarm'ın Logstash veri toplayıcısı ile entegrasyon örneğini sunarak olayların Splunk SIEM sistemine iletilmesini sağlamaktadır.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## Kullanılan kaynaklar

* [Splunk Enterprise](#splunk-enterprise-configuration) ile WEB URL `https://109.111.35.11:8000` ve API URL `https://109.111.35.11:8088`
* [Logstash 7.7.0](#logstash-configuration) Debian 11.x (bullseye) üzerinde kurulmuş ve `https://logstash.example.domain.com` adresinden erişilebilir
* Wallarm Console'da [EU cloud](https://my.wallarm.com) üzerinde [Logstash entegrasyonunun yapılandırılması](#configuration-of-logstash-integration) için yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Splunk Enterprise ve Logstash servislerine ait bağlantılar örnek olarak verildiğinden, yanıt vermemektedir.

### Splunk Enterprise yapılandırması

Logstash günlükleri, `Wallarm Logstash logs` adı ve diğer varsayılan ayarlarla Splunk HTTP Event Controller'a gönderilmektedir:

![HTTP Event Collector Configuration](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

HTTP Event Controller'a erişmek için oluşturulan `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb` token'ı kullanılacaktır.

Splunk HTTP Event Controller kurulumu hakkında daha ayrıntılı açıklama [resmi Splunk dokümantasyonunda](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector) mevcuttur.

### Logstash yapılandırması

Wallarm, günlükleri webhooks aracılığıyla Logstash ara veri toplayıcısına gönderdiğinden, Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Genel URL'ye sahip olmak
* Günlükleri Splunk Enterprise'a iletmek; bu örnekte günlükleri iletmek için `http` eklentisi kullanılmaktadır

Logstash, `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işlemesi `input` bölümünde yapılandırılır:
    * Trafik port 5044'e gönderilir
    * Logstash yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilir bir CA tarafından imzalanan Logstash TLS sertifikası `/etc/server.crt` dosyasında yer almaktadır
    * TLS sertifikası için özel anahtar `/etc/server.key` dosyasında yer almaktadır
* Günlüklerin Splunk'a iletilmesi ve log çıktısı `output` bölümünde yapılandırılır:
    * Günlükler Logstash'dan Splunk'a JSON formatında iletilir
    * Tüm olay günlükleri, POST istekleri aracılığıyla Logstash'dan Splunk API uç noktasına `https://109.111.35.11:8088/services/collector/raw` iletilir. İstekleri yetkilendirmek için HTTPS Event Collector token'ı kullanılır
    * Logstash günlükleri ayrıca komut satırında (15. kod satırında) yazdırılır. Bu ayar, olayların Logstash üzerinden kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
input {
  http { # input plugin for HTTP and HTTPS traffic
    port => 5044 # port for incoming requests
    ssl => true # HTTPS traffic processing
    ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
    ssl_key => "/etc/server.key" # private key for TLS certificate
  }
}
output {
  http { # output plugin to forward logs from Logstash via HTTP/HTTPS protocol
    format => "json" # format of forwarded logs
    http_method => "post" # HTTP method used to forward logs
    url => "https://109.111.35.11:8088/services/collector/raw" # ednpoint to forward logs to
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # HTTP headers to authorize requests
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

Yapılandırma dosyaları hakkında daha detaylı açıklama [resmi Logstash dokümantasyonunda](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) mevcuttur.

!!! info "Logstash yapılandırmasının test edilmesi"
    Logstash günlüklerinin oluşturulduğunu ve Splunk'a iletildiğini kontrol etmek için, POST isteği Logstash'e gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash günlükleri:**
    ![Logstash logs](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunk olayı:**
    ![Splunk events](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Logstash entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Webhook integration with Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyon yapılandırması hakkında daha fazla ayrıntı](../logstash.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash, olayı aşağıdaki gibi kaydedecektir:

![Log about new user in Splunk from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

Splunk olaylarında aşağıdaki kayıt görüntülenecektir:

![New user card in Splunk from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## Olayların bir gösterge panelinde düzenlenmesi

--8<-- "../include/integrations/application-for-splunk.md"