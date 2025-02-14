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

# `Collectd-nagios` Yardımıyla Zabbix'e Metrik Aktarımı

Bu belge, [Zabbix][link-zabbix] izleme sisteminin [`collectd-nagios`][link-collectd-nagios] yardımıyla filtre düğüm metriklerini dışa aktarma örneği sunar.

## Örnek İş Akışı

--8<-- "../include-tr/monitoring/metric-example.md"

![Örnek iş akışı][img-zabbix-scheme]

Bu belgede aşağıdaki yerleştirme şeması kullanılır:
*   Wallarm filtre düğümü `10.0.30.5` IP adresi ve `node.example.local` tam nitelikli alan adı aracılığıyla erişilebilen bir sunucuya yerleştirilmiştir.
    
    Bu sunucuda, 4.0 LTS [Zabbix ajanı][link-zabbix-agent] bulunmaktadır ve bu ajan

    *   `Collectd-nagios` yardımıyla filtre düğüm metriklerini indirir.
    *   `10050/TCP` portu üzerinden gelen bağlantıları dinler (böylece Zabbix cihazı kullanılarak [pasif kontroller][link-zabbix-passive] gerçekleştirilecektir).
    *   Metrik değerleri Zabbix cihazına aktarır.
    
*   `10.0.30.30` IP adresine (bundan sonra Docker sunucusu olarak anılacaktır) sahip özel bir sunucuda, 4.0 LTS [Zabbix cihazı][link-zabbix-app] Docker konteynır formunda yerleştirilmiştir.
    
    Zabbix cihazı;

    *   Periyodik olarak filtre düğümü sunucusunda yüklü olan Zabbix ajanını izlenen metriklerdeki değişiklikler hakkında bilgi almak için sorgular.
    *   `80/TCP` portu üzerinde kullanılabilir olan Zabbix sunucu yönetim web arabirimini içerir.

## Zabbix'e Metrik Aktarımının Yapılandırılması

!!! info "Önkoşullar"
    Bunun, 

    *   `Collectd` hizmetinin Unix alan soketi üzerinden çalışacak şekilde yapılandırıldığı varsayılmaktadır (Detaylar için [buraya][doc-unixsock] bakınız).
    *   Docker Topluluk Sürümü'nün[link-docker-ce] zaten `10.0.30.30` Docker sunucusu üzerinde yüklü olduğu varsayılmaktadır.
    *   `node.example.local` filtre düğümünün zaten yerleştirildiği ve kullanılabilir olduğu varsayılmaktadır ve daha fazla yapılandırma (örneğin, SSH protokolü aracılığıyla) için kullanılabilir.

### Zabbix'in Yerleştirilmesi

Zabbix cihazı 4.0 LTS'yi Docker sunucusunda yerleştirmek için aşağıdaki komutu çalıştırın:

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

Şimdi çalışan bir Zabbix izleme sisteminiz var.

### Zabbix Ajanının Yerleştirilmesi

Filtre düğümünün bulunduğu bir sunucuda Zabbix Ajanı 4.0 LTS'yi yükleyin:
1.  Filtre düğümüne bağlanın (örneğin, SSH protokolünü kullanarak). `Root` ya da başka bir süper kullanıcı yetkisine sahip hesaptan çalıştığınızdan emin olun.
2.  Zabbix havuzlarına bağlanın (işletim sisteminiz için [talimatlardaki][link-zabbix-repo] "Zabbix havuzunu yükle" seçeneğini kullanın).
3.  Zabbix ajanını uygun bir komut çalıştırarak yükleyin:

    --8<-- "../include-tr/monitoring/install-zabbix-agent.md"

4.  Zabbix Ajanı'nın Zabbix cihazı ile çalışacak şekilde ayarlanmasını yapın. Bunu yapmak için, `/etc/zabbix/zabbix_agentd.conf` yapılandırma dosyasına aşağıdaki değişiklikleri uygulayın:
   
    ```
    Server=10.0.30.30			    # Zabbix IP adresi
    Hostname=node.example.local		# Filtre düğümünün bulunduğu host'un FQDN'si
    ```
    
### Zabbix Ajanını Kullanarak Metrik Toplamanın Yapılandırılması

Filtre düğümüne (örneğin, SSH protokolünü kullanarak) bağlanın ve metrik toplamanın Zabbix ajanı üzerinden yapılandırılmasını yapın. Bunu yapmak için filtre düğümünün bulunduğu sunucudaki aşağıdaki adımları gerçekleştirin:

####    1.  `collectd_nagios` yardımını yükleyin.
    
İlgili komutu çalıştırın:

--8<-- "../include-tr/monitoring/install-collectd-utils.md"


####    2.  `collectd-nagios` yardımını `zabbix` kullanıcısı lehine yükseltilmiş ayrıcalıklarla çalışacak şekilde yapılandırın
   
[`visudo`][link-visudo] yardımını kullanarak aşağıdaki satırı `/etc/sudoers` dosyasına ekleyin:
    
```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```
    
Bu, `zabbix` kullanıcısının `sudo` yardımını kullanarak ve bir şifreyi sağlamaya gerek kalmadan `collectd-nagios` yardımını süper kullanıcı ayrıcalıklarıyla çalıştırmasını sağlar.

!!! info "`collectd-nagios`'un süper kullanıcı ayrıcalıklarıyla çalıştırılması"
    Yardım, `collectd` Unix alan soketini veri almak için kullanır. Bu sokete yalnızca süper kullanıcı erişebilir.
    
    `zabbix`'ın `sudoers` listesine eklemek dışında bir alternatif olarak, Zabbix ajanını `root` olarak çalışacak şekilde yapılandırabilirsiniz (bu bir güvenlik riski oluşturabilir, bu yüzden tavsiye edilmez). Bu, ajan yapılandırma dosyasında [`AllowRoot`][link-allowroot] seçeneğini etkinleştirerek sağlanır.
        
####    3.  `zabbix` kullanıcısının `collectd`den metrik değerlerini alabildiğinden emin olun
    
Filtre düğümünde aşağıdaki test komutunu çalıştırın:
    
``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```

Bu komut, `zabbix` kullanıcısını `node.example.local` hostuna filtre düğümünün bulunduğu yerde [`wallarm_nginx/gauge-abnormal`][link-metric] metriğinin değerini almak için çağırır.
    
**Komut çıktısının örneği:**

```
TAMAM: 0 kritik, 0 uyarı, 1 tamam | değer=0.000000;;;;
```
    
####    4.  İhtiyacınız olan metrikleri almak için filtre düğümü hostu üzerindeki Zabbix ajanı yapılandırma dosyasına özel parametreler ekleyin
    
Örneğin, `node.example.local` tam nitelikli alan adı ile filtre düğümü için `wallarm_nginx/gauge-abnormal` metriğine karşılık gelen özel bir `wallarm_nginx-gauge-abnormal` parametresi oluşturmak için yapılandırma dosyasına aşağıdaki satırı ekleyin:
   
```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local | sed -n "s/.*value\=\(.*\);;;;.*/\1/p"
```
!!! info "Metrik değerinin ayrıştırılması"
    `collectd-nagios` yardımına ve `OKAY: 0 kritik, 0 uyarı, 1 tamam | value=0.000000;;;;`, gibi bir çıktıya karşılık gelen bir metrik değerini çıkarırken, bu çıktı `sed` yardımına gereksiz karakterleri silmek için `sed` script'i oluşturarak borulanır.
    
    Script'lerin söz dizimi hakkında daha fazla bilgi için [`sed` dökümantasyonunu][link-sed-docs] inceleyin.

####    5.  Gerekli tüm komutlar Zabbix ajanı yapılandırma dosyasına eklendikten sonra, ajanı yeniden başlatın.

--8<-- "../include-tr/monitoring/zabbix-agent-restart-2.16.md"

## Ayarlanma Tamamlandı

Şimdi Wallarm'a özgü metriklere ilişkin kullanıcı parametrelerini Zabbix ile izleyebilirsiniz.