[img-collectd-nagios]:      ../../images/monitoring/collectd-nagios.png

[link-nagios]:              https://www.nagios.org/
[link-nagios-core]:         https://www.nagios.org/downloads/nagios-core/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios-core-install]: https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html
[link-nrpe-docs]:           https://github.com/NagiosEnterprises/nrpe/blob/master/README.md
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-collectd-docs]:       https://www.collectd.org/documentation/manpages/collectd-nagios.html
[link-nrpe-readme]:         https://github.com/NagiosEnterprises/nrpe
[link-nrpe-pdf]:            https://assets.nagios.com/downloads/nagioscore/docs/nrpe/NRPE.pdf
[link-metric]:              ../../admin-en/monitoring/available-metrics.md#number-of-requests

[doc-gauge-abnormal]:        available-metrics.md#number-of-requests
[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[anchor-header-7]:          #7-add-commands-to-the-nrpe-service-configuration-file-on-the-filter-node-to-get-the-required-metrics

#   `collectd-nagios` Yardımcı Programıyla Nagios'a Ölçümleri Aktarma

Bu belge, [Nagios][link-nagios] izleme sistemine (önerilen [Nagios Core][link-nagios-core] sürümü; ancak bu belge herhangi bir Nagios sürümü için uygun) [`collectd-nagios`][link-collectd-nagios] yardımcı programını kullanarak filtre düğümü ölçümlerini aktarma örneği sağlar.

!!! info "Varsayımlar ve gereklilikler"
    *   `collectd` hizmeti, bir Unix etki alanı soketi üzerinden çalışmak üzere yapılandırılmalıdır (detaylar için [buraya][doc-unixsock] bakın).
    *   Nagios Core sürümünün zaten yüklü olduğu varsayılmaktadır.
        
        Değilse, Nagios Core'un kurulumunu yapın (örneğin, bu [talimatları][link-nagios-core-install] izleyin).
    
        Gerekirse, başka bir Nagios sürümünü de kullanabilirsiniz (örneğin, Nagios XI).
        
        "Nagios" terimi bundan sonra, aksi belirtilmedikçe, herhangi bir Nagios sürümüne atıfta bulunmak için kullanılacaktır.
        
    *   Filtre düğümüne ve Nagios ana makinesine bağlanma yeteneğine sahip olmalısınız (örneğin, SSH protokolü üzerinden) ve `root` hesabı veya başka bir süper kullanıcı haklarına sahip hesap altında çalışabilmelisiniz.
    *   Filtre düğümü üzerinde [Nagios Remote Plugin Executor][link-nrpe-docs] hizmeti (bu örnekte *NRPE* olarak anılacaktır) yüklü olmalıdır.  

##  Örnek İş Akışı

--8<-- "../include-tr/monitoring/metric-example.md"

![Örnek iş akışı][img-collectd-nagios]

Bu belgede kullanılan dağıtım şeması:
*   Wallarm filtre düğümü, `10.0.30.5` IP adresi ve `node.example.local` tam etki alanı adı üzerinden erişilebilir bir ana makineye dağıtılmıştır.
*   Nagios, `10.0.30.30` IP adresi üzerinden erişilebilir ayrı bir ana makine üzerine kurulmuştur.
*   Uzak bir ana makine üzerindeki komutları yürütmek için NRPE eklentisi kullanılır. Eklenti, içeriyor
    *   Filtre düğümüyle birlikte izlenen ana makine üzerine kurulan `nrpe` hizmeti. `5666/TCP` standart NRPE portu üzerinden dinler.
    *   `check_nrpe` NRPE Nagios eklentisi, `nrpe` hizmetinin kurulu olduğu uzak ana makine üzerinde komutları yürütmesini sağlar ve Nagios ana makinesi üzerine kurulmuştur.
*   NRPE, `collectd` ölçümlerini Nagios-uyumlu bir biçimde sağlayan `collectd_nagios` yardımcı programını çağırmak için kullanılır.

##  Nagios'a Ölçümleri Aktarma Yapılandırması

!!! info "Bu kurulum örneği hakkında bir not"
    Bu belge, Nagios'un varsayılan parametrelerle zaten yüklendiği durumda NRPE eklentisinin nasıl kurulacağını ve yapılandırılacağını açıklar (Nagios'un `/usr/local/nagios` dizininde kurulu olduğu ve işlemek için `nagios` kullanıcı adını kullandığı varsayılır). Eklentinin veya Nagios'un özelleştirilmiş bir kurulumunu yapıyorsanız, uygun komutları ve belgedeki talimatları gerektiği gibi ayarlayın.

Filtre düğümünden Nagios'a ölçüm aktarmayı yapılandırmak için aşağıdaki adımları izleyin:

### 1.  NRPE'yi Nagios Ana Makinesiyle İletişim Kuracak Şekilde Yapılandırın 

Bunu yapmak için, bir filtre düğümü ana makinesinde: 
1.  NRPE yapılandırma dosyasını açın (varsayılan: `/usr/local/nagios/etc/nrpe.cfg`).
   
2.  Bu dosyadaki `allowed_hosts` yönergesine Nagios sunucusunun IP adresini veya tam etki alanı adını ekleyin. Örneğin, Nagios ana makinesi `10.0.30.30` IP adresini kullanıyorsa:
   
    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```
   
3.  Uygun komutu yürüterek NRPE hizmetini yeniden başlatın:

    --8<-- "../include-tr/monitoring/nrpe-restart-2.16.md"

### 2.  Nagios NRPE Eklentisini Nagios Ana Makinesine Yükleyin

Bunu yapmak için, Nagios ana makinesinde şu adımları izleyin:
1.  NRPE eklentisinin kaynak dosyalarını indirin ve açın ve eklentiyi oluşturmak ve yüklemek için gerekli yardımcı programları yükleyin (detaylar için [NRPE belgelerine][link-nrpe-docs] bakın). 
2.  Eklenti kaynak kodu ile dizine gidin, kaynaklardan oluşturun ve ardından eklentiyi yükleyin.

    Almanız gereken en minimal adımlar:
    
    ```
    ./configure
    make all
    make install-plugin
    ```
   
### 3.  NRPE Nagios Eklentisinin NRPE Hizmetiyle Başarıyla Etkileşimde Olduğundan Emin Olun

Bunu yapmak için, Nagios ana makinesinde aşağıdaki komutu çalıştırın:

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

NRPE normal işliyorsa, komutun çıktısı bir NRPE sürümünü içermelidir (ör., `NRPE v3.2.1`).

### 4.  `check_nrpe` Komutunu Tanımlayın, Böylece NRPE Nagios Eklentisi Tek Bir Argümanla Nagios Ana Makinesinde Çalıştırılabilir

Bunu yapmak için, `/usr/local/nagios/etc/objects/commands.cfg` dosyasına aşağıdaki satırları ekleyin:

```
define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
 }
```

### 5. Filtre Düğümü Ana Makinesine `collectd_nagios` Yardımcı Programını Yükleyin

Aşağıdaki komutlardan birini çalıştırın:

--8<-- "../include-tr/monitoring/install-collectd-utils.md"

### 6.  `collectd-nagios` Yardımcı Programını `nagios` Kullanıcısının Adına Yükseltilmiş Ayrıcalıklarla Çalışacak Şekilde Yapılandırın

Bunu yapmak için, filtre düğümü ana makinesinde aşağıdaki adımları uygulayın:
1.  [`visudo`][link-visudo] yardımcı programını kullanarak, `/etc/sudoers` dosyasına aşağıdaki satırı ekleyin:
   
    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
   
    Bu, `nagios` kullanıcısının herhangi bir parola sağlama gereksinimi olmadan `sudo` kullanarak `collectd-nagios` yardımcı programını süper kullanıcı ayrıcalıklarıyla çalıştırmasını sağlar.

   
    !!! info "`collectd-nagios`'un süper kullanıcı ayrıcalıklarıyla çalıştırılması"
        Yardımcı programın süper kullanıcı ayrıcalıklarıyla çalıştırılması gerekir çünkü veri almak için `collectd` Unix etki alanı soketini kullanır. Yalnızca bir süper kullanıcı bu sokete erişebilir.

2.  `nagios` kullanıcısının `collectd` tarafından `nagios` kullanıcıına ölçüm değerlerini alabildiğini kontrol edin, aşağıdaki test komutunu yürütün:
   
    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    Bu komut, `nagios` kullanıcısının [`wallarm_nginx/gauge-abnormal`][link-metric] ölçümünün değerini (`node.example.local` ana makinesi için işlenen isteklerin sayısı) almasını sağlar.
    
    **Komut çıktısının örneği:**
    
    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3.  NRPE hizmeti yapılandırma dosyasına bir önek ekleyin, böylece `sudo` yardımcı programını kullanarak komutları yürütebilir hale gelir:
    
    ```
    command_prefix=/usr/bin/sudo
    ```

### 7.  Gerekli Ölçümleri Almak İçin NRPE Hizmeti Yapılandırma Dosyasına Komutlar Ekleyin

Örneğin, filtre düğümü için `node.example.local` tam etki alanı adı olan `wallarm_nginx/gauge-abnormal` ölçümünü alacak bir `check_wallarm_nginx_abnormal` adlı komut oluşturmak için, NRPE hizmetinin yapılandırma dosyasına aşağıdaki satırı ekleyin:

```
command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```

!!! info "Bir ölçü için eşik değerlerini nasıl ayarlanır"
    Gerekirse, `collectd-nagios` yardımcı programının `WARNING`  veya `CRITICAL` durumunu döndüreceği bir değer aralığını belirleyebilir, bu -w ve -c seçeneklerini kullanarak yapılır (ayrıntılı bilgi, yardımcı programın [belgeleri][link-collectd-docs]nde bulunabilir).


NRPE hizmeti yapılandırma dosyasına tüm gerekli komutları ekledikten sonra, uygun komutu çalıştırarak hizmeti yeniden başlatın:

--8<-- "../include-tr/monitoring/nrpe-restart-2.16.md"

### 8.  Nagios Ana Makinesinde, Yapılandırma Dosyalarını Kullanarak Filtre Düğümü Ana Makinesini Belirtin ve İzlemek İçin Hizmetleri Tanımlayın

!!! info "Hizmetler ve Ölçümler"
    Bu belge, bir Nagios hizmetinin bir ölçüme eşit olduğunu varsayar.


Örneğin, bu aşağıdaki gibi yapılabilir:
1.  Aşağıdaki içeriğe sahip bir `/usr/local/nagios/etc/objects/nodes.cfg` dosyası oluşturun:
    
    ```
    define host{
     use linux-server
     host_name node.example.local
     address 10.0.30.5
    }

    define service {
      use generic-service
      host_name node.example.local
      check_command check_nrpe!check_wallarm_nginx_abnormal
      max_check_attempts 5
      service_description wallarm_nginx_abnormal
    }
    ```

    Bu dosya, `10.0.30.5` IP adresine ve `node.example.local` hostuna ait `check_wallarm_nginx_abnormal` hizmetin durumunu kontrol etmek için komutu tanımlar, bu da filtre düğümünden `wallarm_nginx/gauge-abnormal` ölçümünü almayı ifade eder (bkz. [`check_wallarm_nginx_abnormal`][anchor-header-7] komutunun açıklaması).

2.  Nagios yapılandırma dosyasına (varsayılan `/usr/local/nagios/etc/nagios.cfg`) aşağıdaki satırı ekleyin:
    
    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```
    
    Bu, Nagios'un bir sonraki başlangıcı için `nodes.cfg` dosyasındaki verileri başlamak için gereklidir.

3.  Uygun bir komut çalıştırarak Nagios hizmetini yeniden başlatın:

--8<-- "../include-tr/monitoring/nagios-restart-2.16.md"

## Kurulum Tamamlandı

Nagios, şimdi filtre düğümünün belirli bir ölçümü ile ilişkilendirilmiş hizmeti izliyor. Gerekirse, ilgilendiğiniz metrikleri kontrol etmek için diğer komutlar ve hizmetler tanımlayabilirsiniz.

!!! info "NRPE hakkında bilgi"
    NRPE hakkında ek bilgi kaynakları:
    
    *   NRPE'nin GitHub üzerindeki [README][link-nrpe-readme] dosyası;
    *   NRPE belgeleri ([PDF][link-nrpe-pdf]).
