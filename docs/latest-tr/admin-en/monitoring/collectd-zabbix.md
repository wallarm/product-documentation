[img-zabbix-scheme]:        ../../images/monitoring/zabbix-scheme.png

[link-zabbix]:              https://www.zabbix.com/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-zabbix-agent]:        https://www.zabbix.com/zabbix_agent
[link-zabbix-passive]:      https://www.zabbix.com/documentation/4.0/manual/appendix/items/activepassive
[link-zabbix-app]:          https://hub.docker.com/r/zabbix/zabbix-appliance
[link-docker-ce]:           https://docs.docker.com/install/
[link-zabbix-repo]:         https://www.zabbix.com/download
[link-allowroot]:           https://www.zabbix.com/documentation/4.0/manual/appendix/config/zabbix_agentd
[link-sed-docs]:            https://www.gnu.org/software/sed/manual/sed.html#sed-script-overview
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-metric]:              available-metrics.md#number-of-requests

[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

# Zabbix'e `collectd-nagios` Yardımcısı ile Metriklerin Dışa Aktarılması

Bu doküman, filtre düğümü metriklerinin [Zabbix][link-zabbix] izleme sistemine, [`collectd-nagios`][link-collectd-nagios] yardımcısı kullanılarak nasıl dışa aktarılacağını gösteren bir örnek sunmaktadır.

## Örnek İş Akışı

--8<-- "../include/monitoring/metric-example.md"


![Örnek iş akışı][img-zabbix-scheme]

Bu dokümanda aşağıdaki dağıtım şeması kullanılmaktadır:
*   Wallarm filtre düğümü, `10.0.30.5` IP adresi ve `node.example.local` tam nitelikli alan adı üzerinden erişilebilen bir sunucuda dağıtılmıştır.
    
    Sunucuda [Zabbix agent][link-zabbix-agent] 4.0 LTS kuruludur ve

    *   `collectd-nagios` yardımcısı kullanılarak filtre düğümü metriklerini indirir.
    *   `10050/TCP` portu üzerinden gelen bağlantıları dinler (böylece [pasif kontroller][link-zabbix-passive] Zabbix Appliance kullanılarak gerçekleştirilecektir).
    *   Metrik değerlerini Zabbix Appliance'e iletir.
    
*   `10.0.30.30` IP adresine sahip ayrı bir sunucuda (bundan sonra Docker sunucusu olarak anılacaktır), [Zabbix Appliance][link-zabbix-app] 4.0 LTS, bir Docker konteyneri şeklinde dağıtılmıştır.
    
    Zabbix Appliance şunları içerir:
    
    *   Filtre düğümü sunucusuna kurulu Zabbix agent'ı periyodik olarak sorgulayan bir Zabbix sunucusu (izlenen metriklerdeki değişikliklere dair bilgi almak için).
    *   `80/TCP` portu üzerinden erişilebilen Zabbix sunucu yönetim web arayüzü.

    
## Zabbix'e Metrik Dışa Aktarımını Yapılandırma


!!! info "Ön Koşullar"
    Şu varsayımlarda bulunulmaktadır:

    *   `collectd` servisi, bir Unix alan soketi üzerinden çalışacak şekilde yapılandırılmıştır (ayrıntılar için [buraya][doc-unixsock] bakınız).
    *   `10.0.30.30` Docker sunucusunda [Docker Community Edition][link-docker-ce] zaten kuruludur.
    *   `node.example.local` filtre düğümü zaten dağıtılmış, yapılandırılmış, ek yapılandırmalara (örneğin SSH protokolü üzerinden) uygun şekilde erişilebilir ve çalışmaktadır.

### Zabbix Dağıtımı

Zabbix Appliance 4.0 LTS'i dağıtmak için, Docker sunucusunda aşağıdaki komutu çalıştırın:

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

Artık çalışan bir Zabbix izleme sistemine sahipsiniz.

### Zabbix Agent'ının Dağıtımı

Filtre düğümünün bulunduğu bir sunucuya Zabbix Agent 4.0 LTS'i kurun:
1.  Filtre düğümüne bağlanın (örneğin, SSH protokolü kullanılarak). `root` veya süper kullanıcı ayrıcalıklarına sahip başka bir hesapla çalıştığınızdan emin olun.
2.  Zabbix deposunu etkinleştirin (işletim sisteminize ait [talimatlardaki][link-zabbix-repo] “Install Zabbix repository” bölümünü kullanın).
3.  Uygun komutu çalıştırarak Zabbix agent'ı kurun:

    --8<-- "../include/monitoring/install-zabbix-agent.md"

4.  Zabbix Agent'ını, Zabbix Appliance ile çalışacak şekilde yapılandırın. Bunun için `/etc/zabbix/zabbix_agentd.conf` yapılandırma dosyasında aşağıdaki değişiklikleri yapın:
   
    ```
    Server=10.0.30.30			    # Zabbix IP adresi
    Hostname=node.example.local		# Filtre düğümünün FQDN'i
    ```
    
### Zabbix Agent Kullanarak Metrik Toplamayı Yapılandırma

Filtre düğümüne bağlanın (örneğin, SSH protokolü kullanılarak) ve Zabbix agent aracılığıyla metriklerin toplanmasını yapılandırın. Bunun için, filtre düğümünün bulunduğu sunucuda aşağıdaki adımları izleyin:

#### 1. `collectd_nagios` Yardımcısını Kurun
    
Uygun komutu çalıştırın:

--8<-- "../include/monitoring/install-collectd-utils.md"


#### 2. `collectd-nagios` yardımcısının, `zabbix` kullanıcısı adına yükseltilmiş ayrıcalıklarla çalıştırılmasını yapılandırın
   
`/etc/sudoers` dosyasına aşağıdaki satırı eklemek için [`visudo`][link-visudo] yardımcı programını kullanın:
    
```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```
    
Bu, `zabbix` kullanıcısına şifresiz olarak `sudo` kullanarak `collectd-nagios` yardımcısını süper kullanıcı ayrıcalıklarıyla çalıştırma imkânı tanır.


!!! info "`collectd-nagios`'u süper kullanıcı ayrıcalıklarıyla çalıştırma"
    Yardımcı program, `collectd` Unix alan soketini kullanarak veri aldığı için süper kullanıcı ayrıcalıklarıyla çalıştırılmalıdır. Bu sokete yalnızca süper kullanıcı erişebilir.
    
    `zabbix` kullanıcısının `sudoers` listesine eklenmesinin bir alternatifi olarak, Zabbix agent'ını `root` olarak çalıştırmayı yapılandırabilirsiniz (bu, güvenlik riski oluşturabileceği için önerilmez). Bu, agent yapılandırma dosyasında [`AllowRoot`][link-allowroot] seçeneği etkinleştirilerek gerçekleştirilebilir.
        
#### 3. `zabbix` kullanıcısının, `collectd`'den metrik değerlerini alabileceğinden emin olun
    
Filtre düğümünde aşağıdaki test komutunu çalıştırın:
    
``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
```

Bu komut, `node.example.local` filtre düğümüne ait [`curl_json-wallarm_nginx/gauge-abnormal`][link-metric] metrik değerini almak için `zabbix` kullanıcısını çalıştırır.
    
**Komut çıktısına bir örnek:**

```
OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
```
    
#### 4. İhtiyacınız olan metrikleri alabilmek için, filtre düğüm sunucusundaki Zabbix agent yapılandırma dosyasına özel parametreler ekleyin
    
Örneğin, `node.example.local` tam nitelikli alan adına sahip bir filtre düğümü için `curl_json-wallarm_nginx/gauge-abnormal` metriğine karşılık gelen `wallarm_nginx-gauge-abnormal` özel parametresini oluşturmak üzere, yapılandırma dosyasına aşağıdaki satırı ekleyin:
   
```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local | sed -n "s/.*value\=\(.*\);;;;.*/\1/p"
```
!!! info "Bir metrik değerinin çıkarılması"
    `collectd-nagios` yardımcısının çıktısında `value=` ifadesinden sonra gelen metrik değerini (örneğin, `OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;`) çıkarmak için, bu çıktı gereksiz karakterleri ayıklayarak `sed` yardımcı programına yönlendirilir.
    
    `sed` komut dosyası sözdizimi hakkında daha fazla bilgi için [`sed` dokümantasyonuna][link-sed-docs] bakınız.

#### 5. Gerekli tüm komutlar Zabbix agent yapılandırma dosyasına eklendikten sonra, agent'ı yeniden başlatın

--8<-- "../include/monitoring/zabbix-agent-restart-2.16.md"

## Kurulum Tamamlandı

Artık Wallarm'a özgü metriklere ilişkin kullanıcı parametrelerini Zabbix ile izleyebilirsiniz.