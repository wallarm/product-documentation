# IBM QRadar via Logstash

Bu talimatlar, Wallarm ile Logstash veri toplayıcısının örnek entegrasyonunu sağlayarak olayların QRadar SIEM sistemine iletilmesini açıklar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## Kullanılan Kaynaklar

* Debian 11.x (bullseye) üzerinde kurulu ve `https://logstash.example.domain.com` adresinden erişilebilen [Logstash 7.7.0](#logstash-configuration)
* Linux Red Hat üzerinde kurulu ve `https://109.111.35.11:514` IP adresinden erişilebilen [QRadar V7.3.3](#qradar-configuration-optional)
* [Logstash entegrasyonunu yapılandırmak](#configuration-of-logstash-integration) için [EU cloud](https://my.wallarm.com) üzerindeki Wallarm Console'a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Logstash ve QRadar servislerine ait bağlantılar örnek olarak verildiğinden, bunlar yanıt vermemektedir.

### Logstash yapılandırması

Wallarm, logları webhooks aracılığıyla Logstash ara veri toplayıcısına gönderdiğinden, Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmelidir
* HTTPS isteklerini kabul etmelidir
* Genel (public) URL'ye sahip olmalıdır
* Logları IBM QRadar'a iletmelidir, bu örnekte logları iletmek için `syslog` eklentisi kullanılmaktadır

Logstash, `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme, `input` bölümünde yapılandırılmıştır:
    * Trafik port 5044'e gönderilir
    * Logstash yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanmış Logstash TLS sertifikası `/etc/server.crt` dosyasında bulunmaktadır
    * TLS sertifikası için özel anahtar `/etc/server.key` dosyasında bulunmaktadır
* QRadar'a log iletimi ve log çıktısı, `output` bölümünde yapılandırılmıştır:
    * Tüm olay logları, Logstash'ten QRadar'a `https://109.111.35.11:514` IP adresine iletilir
    * Loglar, Logstash'ten QRadar'a, [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına uygun JSON formatında iletilir
    * QRadar ile bağlantı TCP üzerinden kurulur
    * Logstash logları ayrıca komut satırında yazdırılır (15. kod satırı). Bu ayar, olayların Logstash aracılığıyla loglandığını doğrulamak için kullanılır

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
  syslog { # output plugin to forward logs from Logstash via Syslog
    host => "109.111.35.11" # IP address to forward logs to
    port => "514" # port to forward logs to
    protocol => "tcp" # connection protocol
    codec => json # format of forwarded logs
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

Yapılandırma dosyalarına ilişkin daha ayrıntılı açıklama, [resmi Logstash dokümantasyonunda](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) mevcuttur.

!!! info "Logstash Yapılandırmasının Test Edilmesi"
    Logstash loglarının oluşturulduğunu ve QRadar'a iletildiğini kontrol etmek için, Logstash'e POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash logları:**
    ![Logs in Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadar logları:**
    ![Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadar log yükü:**
    ![Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadar Yapılandırması (isteğe bağlı)

QRadar'da log kaynağı yapılandırılır. Bu, QRadar'daki tüm loglar arasında Logstash loglarını kolayca bulmaya yardımcı olur ve ayrıca ileri düzey log filtrelemesi için de kullanılabilir. Log kaynağı aşağıdaki şekilde yapılandırılır:

* **Log Source Name**: `Logstash`
* **Log Source Description**: `Logs from Logstash`
* **Log Source Type**: Syslog standardı kullanılarak gelen log ayrıştırıcısının türü `Universal LEEF`
* **Protocol Configuration**: Log iletim standardı `Syslog`
* **Log Source Identifier**: Logstash IP adresi
* Diğer varsayılan ayarlar

QRadar log kaynağı kurulumu hakkında daha ayrıntılı açıklama [resmi IBM dokümantasyonunda](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf) mevcuttur.

![Logstash için QRadar log kaynağı kurulumu](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Logstash entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Logstash ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyon yapılandırmasıyla ilgili daha fazla ayrıntı](../logstash.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash olayı aşağıdaki şekilde loglayacaktır:

![QRadar'da Logstash'tan gelen yeni kullanıcı logu](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

QRadar log yükünde JSON formatında aşağıdaki veriler görüntülenecektir:

![QRadar'da Logstash'tan gelen yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)