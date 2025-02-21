# IBM QRadar via Fluentd

Bu talimatlar, Wallarm'ın Fluentd veri toplayıcısı ile entegrasyonunun örneğini sunar ve olayları QRadar SIEM sistemine iletmek üzere yapılandırılmıştır.

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## Kullanılan kaynaklar

* [Fluentd](#fluentd-configuration) Debian 11.x (bullseye)'de kurulu ve `https://fluentd-example-domain.com` adresinde mevcuttur
* [QRadar V7.3.3](#qradar-configuration-optional) Linux Red Hat üzerinde kurulu olup IP adresi `https://109.111.35.11:514` şeklindedir
* Wallarm Console'da [EU cloud](https://my.wallarm.com) üzerinden yönetici erişimi ile [Fluentd entegrasyonunu yapılandırmak](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

Fluentd ve QRadar servislerine ait bağlantılar örnek olarak verildiğinden, yanıt vermemektedir.

### Fluentd yapılandırması

Wallarm, logları webhooks aracılığıyla Fluentd ara veri toplayıcısına gönderdiğinden, Fluentd yapılandırmasının aşağıdaki gereksinimleri karşılaması gerekir:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Genel erişime açık bir URL'ye sahip olmak
* Logları IBM QRadar'a iletmek, bu örnekte logları iletmek için `remote_syslog` eklentisi kullanılmıştır

Fluentd, `td-agent.conf` dosyasında yapılandırılır:

* Gelen webhook işleme, `source` yönergesinde yapılandırılmıştır:
    * Trafik 9880 numaralı porta gönderilir
    * Fluentd, yalnızca HTTPS bağlantılarını kabul edecek şekilde ayarlanmıştır
    * Halka açık CA tarafından imzalanmış Fluentd TLS sertifikası `/etc/ssl/certs/fluentd.crt` dosyasında yer almaktadır
    * TLS sertifikası için özel anahtar `/etc/ssl/private/fluentd.key` dosyasında yer almaktadır
* Logların QRadar'a iletilmesi ve log çıktısı `match` yönergesinde yapılandırılmıştır:
    * Tüm olay logları, Fluentd'den kopyalanarak `https://109.111.35.11:514` adresindeki QRadar'a iletilir
    * Loglar, Syslog standardına uygun olarak JSON formatında Fluentd'den QRadar'a iletilir ([Syslog](https://en.wikipedia.org/wiki/Syslog))
    * QRadar ile bağlantı TCP üzerinden kurulmuştur
    * Fluentd logları, ayrıca komut satırında JSON formatında yazdırılır (19-22 kod satırı). Bu ayar, olayların Fluentd aracılığıyla loglandığının doğrulanması için kullanılır

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
      host 109.111.35.11 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol tcp # connection protocol
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

Yapılandırma dosyalarına ilişkin daha ayrıntılı açıklama [resmi Fluentd dokümantasyonunda](https://docs.fluentd.org/configuration/config-file) mevcuttur.

!!! info "Fluentd yapılandırmasının test edilmesi"
    Fluentd loglarının oluşturulduğunu ve QRadar'a iletildiğini kontrol etmek için Fluentd'ye PUT veya POST isteği gönderilebilir.

    **İstek örneği:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd logları:**
    ![Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadar logları:**
    ![Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadar log yükü:**
    ![Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadar yapılandırması (isteğe bağlı)

QRadar'da log kaynağı yapılandırılır. Bu, QRadar'daki tüm loglar arasında Fluentd loglarını kolayca bulmayı sağlar ve ayrıca ileri düzey log filtrelemesi için de kullanılabilir. Log kaynağı aşağıdaki şekilde yapılandırılmıştır:

* **Log Source Name**: Fluentd
* **Log Source Description**: Fluentd'den gelen loglar
* **Log Source Type**: Gelen log parçalayıcı türü, Syslog standardı ile kullanılan `Universal LEEF`
* **Protocol Configuration**: Log iletim standardı: `Syslog`
* **Log Source Identifier**: Fluentd IP adresi
* Diğer varsayılan ayarlar

QRadar log kaynağı kurulumu hakkında daha ayrıntılı bilgi [resmi IBM dokümantasyonunda](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf) mevcuttur.

![QRadar log source setup for Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Fluentd entegrasyonunun yapılandırılması

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd entegrasyon yapılandırması hakkında daha fazla bilgi](../fluentd.md)

## Örnek test

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentd, olayı aşağıdaki gibi loglayacaktır:

![Log about new user in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

Aşağıdaki JSON formatındaki veriler, QRadar log yükünde görüntülenecektir:

![New user card in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)