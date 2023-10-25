# Micro Focus ArcSight Logger Logstash Üzerinden

Bu talimatlar, Wallarm'ın olayları ArcSight Logger sistemine daha da ileri göndermek için Logstash veri koleksiyoncusu ile örnek entegrasyonunu sağlar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook akışı](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "ArcSight ESM'in Kurumsal sürümü ile entegrasyon "
    Logları Logstash'tan ArcSight ESM'in Kurumsal sürümüne yönlendirmek için, ArcSight tarafında Syslog Connector'u yapılandırmanız ve ardından logları Logstash'tan Connector portuna yönlendirmeniz önerilir. Konnektörlerin daha ayrıntılı bir açıklamasını almak için, [resmi ArcSight SmartConnector belgeleri](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)nden **SmartConnector User Guide**'ı indirin.

## Kullanılan Kaynaklar

* CentOS 7.8 üzerine kurulu [ArcSight Logger 7.1](#arcsight-logger-configuration) ve WEB URL `https://192.168.1.73:443`
* Debian 11.x (bullseye) üzerine kurulu [Logstash 7.7.0](#logstash-configuration) ve `https://logstash.example.domain.com` üzerinde erişilebilir
* [Logstash entegrasyonunu yapılandırmak](#configuration-of-logstash-integration) için [EU bulutu](https://my.wallarm.com)ndaki Wallarm Console'ye yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

ArcSight Logger ve Logstash hizmetlerine yapılan bağlantılar örnek olarak verildiğinden, yanıt vermiyorlar.

### ArcSight Logger Yapılandırması 

ArcSight Logger, aşağıdaki gibi yapılandırılmış `Wallarm Logstash logs` log alıcısına sahiptir:

* Loglar UDP aracılığıyla alınır (`Type = UDP Receiver`)
* Dinleme portu `514`'dür
* Olaylar syslog çözümleyici ile ayrıştırılır 
* Diğer varsayılan ayarlar

![ArcSight Logger'da alıcı yapılandırması](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

Alıcı yapılandırmasının daha ayrıntılı bir açıklamasını almak için, lütfen uygun sürümün **Logger Installation Guide**ını [resmi ArcSight Logger belgeleri](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc)'nden indirin.

### Logstash Yapılandırması 

Wallarm, Logstash ara veri toplayıcısına webhooks aracılığıyla log gönderdiğinden, Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Genel URL'ye sahip olmak
* Logları ArcSight Logger'a yönlendirmek, bu örnek, logları yönlendirmek için `syslog` eklentisini kullanır

Logstash `logstash-sample.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme `input` bölümünde yapılandırılmıştır:
    * Trafik 5044 portuna gönderilir
    * Logstash yalnızca HTTPS bağlantılarını kabul eder şekilde yapılandırılmıştır
    * Logstash TLS sertifikası, genel olarak güvenilen bir CA tarafından imzalanan `/etc/server.crt` dosyasındadır
    * TLS sertifikası için özel anahtar `/etc/server.key` dosyasında bulunmaktadır
* Logları ArcSight Logger'a yönlendirme ve log çıktısı `output` bölümünde yapılandırılmıştır:
    * Tüm olay logları, IP adresi `https://192.168.1.73:514` olan Logstash'dan ArcSight Logger'a yönlendirilir
    * Loglar, [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına göre JSON formatında Logstash'dan ArcSight Logger'a yönlendirilir
    * ArcSight Logger ile bağlantı UDP üzerinden kurulur
    * Logstash logları ek olarak komut satırına yazdırılır (15. kod satırı). Bu ayar, olayların Logstash üzerinden loglandığını doğrulamak için kullanılır

```bash linenums="1"
input {
  http { # HTTP ve HTTPS trafik için giriş eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafik işleme
    ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
    ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
  }
}
output {
  syslog { # Logları Logstash'tan Syslog üzerinden yönlendirmek için çıkış eklentisi
    host => "192.168.1.73" # Logları yönlendirmek için IP adresi
    port => "514" # Logları yönlendirmek için port
    protocol => "udp" # bağlantı protokolü
    codec => json # yönlendirilen logların formatı
  }
  stdout {} # Logstash loglarını komut satırında yazdırmak için çıkış eklentisi
}
```

Yapılandırma dosyalarının daha ayrıntılı bir açıklaması [resmi Logstash belgeleri](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)'nde mevcuttur.

!!! info "Logstash Yapılandırmasının Test Edilmesi"
    Logstash loglarının oluşturulduğunu ve ArcSight Logger'a yönlendirildiğini kontrol etmek için, POST isteği Logstash' gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash logları:**
    ![Logstash logları](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **ArcSight Logger'daki olay:**
    ![ArcSight Logger olayı](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Logstash Entegrasyonunun Yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![Logstash ile Webhook entegrasyonu](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash entegrasyonu yapılandırması hakkında daha fazla bilgi](../logstash.md)

## Örnek Testi

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstash olayı şu şekilde loglar:

![Logstash'tan ArcSight Logger'da yeni kullanıcı hakkında log](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

ArcSight Logger olaylarında aşağıdaki giriş görüntülenir:

![Logstash'tan ArcSight Logger'da yeni kullanıcı kartı](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)