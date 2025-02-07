# Micro Focus ArcSight Logger via Fluentd

Bu yönergeler, Wallarm'ın Fluentd veri toplayıcısı ile örnek entegrasyonunu ve bu entegrasyon sayesinde olayların ArcSight Logger sistemine iletilmesini sağlamaktadır.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "Integration with the Enterprise version of ArcSight ESM"
    Fluentd'den ArcSight ESM Enterprise sürümüne log iletimini yapılandırmak için, ArcSight tarafında Syslog Connector'ün yapılandırılması ve ardından Fluentd'den connector portuna logların iletilmesi önerilir. Konnektörler hakkında daha ayrıntılı bilgi için lütfen [resmi ArcSight SmartConnector dokümantasyonundan](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs) **SmartConnector User Guide**'ı indirin.

## Used resources

* CentOS 7.8 üzerine kurulmuş, WEB URL'si `https://192.168.1.73:443` olan [ArcSight Logger 7.1](#arcsight-logger-configuration)
* Debian 11.x (bullseye) üzerine kurulmuş ve `https://fluentd-example-domain.com` üzerinden ulaşılabilen [Fluentd](#fluentd-configuration)
* [Fluentd entegrasyonunu yapılandırmak](#configuration-of-fluentd-integration) için [EU cloud](https://my.wallarm.com) üzerindeki Wallarm Console'a yönetici erişimi

--8<-- "../include/cloud-ip-by-request.md"

Örnek olarak gösterilen ArcSight Logger ve Fluentd servis bağlantıları yanıt vermemektedir.

### ArcSight Logger configuration

ArcSight Logger, `Wallarm Fluentd logs` isimli log alıcısını aşağıdaki şekilde yapılandırmıştır:

* Loglar UDP üzerinden alınır (`Type = UDP Receiver`)
* Dinleme portu `514`'tür
* Olaylar syslog ayrıştırıcısı ile işlenir
* Diğer varsayılan ayarlar

![Configuration of receiver in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

Alıcı yapılandırmasının daha ayrıntılı açıklamasını almak için lütfen [resmi ArcSight Logger dokümantasyonundan](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) uygun sürüme ait **Logger Installation Guide**'ı indirin.

### Fluentd configuration

Wallarm, logları webhooks aracılığıyla Fluentd ara veri toplayıcısına gönderdiğinden, Fluentd yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmeli
* HTTPS isteklerini kabul etmeli
* Genel bir URL'ye sahip olmalı
* Logları ArcSight Logger'a yönlendirmeli; bu örnekte logları yönlendirmek için `remote_syslog` eklentisi kullanılmıştır

Fluentd, `td-agent.conf` dosyasında yapılandırılmıştır:

* Gelen webhook işleme `source` yönergesinde yapılandırılmıştır:
    * Trafik 9880 portuna yönlendirilir
    * Fluentd yalnızca HTTPS bağlantılarını kabul edecek şekilde yapılandırılmıştır
    * Genel olarak güvenilen bir CA tarafından imzalanan Fluentd TLS sertifikası `/etc/ssl/certs/fluentd.crt` dosyasında yer almaktadır
    * TLS sertifikasına ait özel anahtar `/etc/ssl/private/fluentd.key` dosyasında bulunmaktadır
* ArcSight Logger'a log yönlendirme ve log çıktısı `match` yönergesinde yapılandırılmıştır:
    * Tüm olay logları Fluentd'den kopyalanarak `https://192.168.1.73:514` IP adresindeki ArcSight Logger'a yönlendirilir
    * Loglar, Fluentd'den ArcSight Logger'a [Syslog](https://en.wikipedia.org/wiki/Syslog) standardına uygun JSON formatında iletilir
    * ArcSight Logger ile bağlantı UDP üzerinden sağlanır
    * Fluentd logları, ek olarak komut satırında JSON formatında (19-22 kod satırı) yazdırılır. Bu ayar, olayların Fluentd üzerinden kaydedildiğini doğrulamak için kullanılır

```bash linenums="1"
<source>
  @type http # input plugin for HTTP and HTTPS traffic
  port 9880 # port for incoming requests
  <transport tls> # configuration for connections handling
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # output plugin to forward logs from Fluentd via Syslog
      host 192.168.1.73 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol udp # connection protocol
    <format>
      @type json # format of forwarded logs
    </format>
  </store>
  <store>
     @type stdout # output plugin to print Fluentd logs on the command line
     output_type json # format of logs printed on the command line
  </store>
</match>
```

Yapılandırma dosyalarının daha ayrıntılı açıklaması [resmi Fluentd dokümantasyonunda](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Testing Fluentd configuration"
    Fluentd loglarının oluşturulduğunu ve ArcSight Logger'a yönlendirildiğini kontrol etmek için Fluentd'ye PUT veya POST isteği gönderilebilir.

    **Request example:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd logs:**
    ![Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **Event in ArcSight Logger:**
    ![Logs in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### Configuration of Fluentd integration

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[More details on the Fluentd integration configuration](../fluentd.md)

## Example testing

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd olayı aşağıdaki şekilde loglayacaktır:

![Fluentd log about new user](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

ArcSight Logger olaylarında aşağıdaki giriş görüntülenecektir:

![Events in ArccSiight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)