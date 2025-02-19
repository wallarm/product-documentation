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

# collectd-nagios Yardımıyla Nagios'a Metrik Aktarımı

Bu belge, filtre düğüm metriklerini [Nagios][link-nagios] izleme sistemine (önerilen sürüm [Nagios Core][link-nagios-core] olmakla birlikte, bu belge herhangi bir Nagios sürümü için uygundur) [`collectd-nagios`][link-collectd-nagios] yardımcı programını kullanarak aktarmaya ilişkin bir örnek sunar.

!!! info "Varsayımlar ve Gereksinimler"
    *   `collectd` servisi, bir Unix domain soketi aracılığıyla çalışacak şekilde yapılandırılmış olmalıdır (ayrıntılar için [buraya][doc-unixsock] bakınız).
    *   Nagios Core sürümünün zaten yüklü olduğu varsayılmaktadır.
        
        Eğer yüklü değilse, Nagios Core'ü yükleyin (örneğin, şu [talimatları][link-nagios-core-install] izleyebilirsiniz).
    
        Gerekirse başka bir Nagios sürümü de kullanılabilir (örneğin, Nagios XI).
        
        Bundan böyle "Nagios" terimi, aksi belirtilmedikçe herhangi bir Nagios sürümünü ifade edecektir.
        
    *   Filtre düğümüne ve Nagios ana makinesine (örneğin, SSH protokolü kullanılarak) bağlanabilme yetkiniz olmalı ve `root` hesabı veya süper kullanıcı haklarına sahip başka bir hesap altında çalışabilmelisiniz.
    *   Filtre düğümünde, bu örnekte *NRPE* olarak anılacak olan [Nagios Remote Plugin Executor][link-nrpe-docs] servisi kurulmuş olmalıdır.   

## Örnek İş Akışı

--8<-- "../include/monitoring/metric-example.md"

![Example workflow][img-collectd-nagios]

Bu belgede aşağıdaki dağıtım şeması kullanılmaktadır:
*   Wallarm filtre düğümü, `10.0.30.5` IP adresi ve `node.example.local` tam nitelikli alan adıyla erişilebilen bir ana makinede dağıtılmıştır.
*   Nagios, `10.0.30.30` IP adresiyle ayrı bir ana makinede kuruludur.
*   Uzaktaki bir ana makinede komut çalıştırmak için NRPE eklentisi kullanılır. Eklenti, şunları içerir:
    *   Filtre düğümüyle birlikte izlenen ana makinede yüklü olan ve `5666/TCP` standart NRPE portunu dinleyen `nrpe` servisi.
    *   Nagios ana makinesine kurulmuş olan ve `nrpe` servisi yüklü uzaktaki ana makinede komut çalıştırılmasını sağlayan `check_nrpe` NRPE Nagios eklentisi.
*   NRPE, `collectd` metriklerini Nagios ile uyumlu formatta sağlayan `collectd_nagios` yardımcı programını çağırmak için kullanılacaktır.

## Nagios'a Metrik Aktarımını Yapılandırma

!!! info "Bu kurulum örneğine ilişkin bir not"
    Bu belge, Nagios varsayılan parametrelerle (Nagios'un `/usr/local/nagios` dizininde kurulu olduğu ve çalışması için `nagios` kullanıcısını kullandığı varsayılmaktadır) yüklüyken NRPE eklentisinin nasıl kurulup yapılandırılacağını anlatmaktadır. Eklentiyi veya Nagios'u varsayılan olmayan bir kurulumla yapıyorsanız, belgede yer alan ilgili komutları ve talimatları ihtiyaçlarınıza göre uyarlayın.

Filtre düğümünden Nagios'a metrik aktarımını yapılandırmak için aşağıdaki adımları izleyin:

### 1. NRPE'nin Nagios Ana Makinesiyle İletişim Kurmasını Yapılandırma 

Bunu gerçekleştirmek için, filtre düğümünde:
1.  NRPE yapılandırma dosyasını açın (varsayılan: `/usr/local/nagios/etc/nrpe.cfg`).
    
2.  Bu dosyada `allowed_hosts` yönergesine, Nagios sunucusunun IP adresini veya tam nitelikli alan adını ekleyin. Örneğin, eğer Nagios ana makinesi `10.0.30.30` IP adresini kullanıyorsa:
    
    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```
    
3.  Uygun komutu çalıştırarak NRPE servisini yeniden başlatın:

    --8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 2. Nagios Ana Makinesinde Nagios NRPE Eklentisini Kurma

Bunu gerçekleştirmek için, Nagios ana makinesinde aşağıdaki adımları izleyin:
1.  NRPE eklentisinin kaynak dosyalarını indirin ve arşivden çıkarın, ayrıca eklentiyi derleyip kurmak için gerekli yardımcı programları yükleyin (ayrıntılar için [NRPE belgelerine][link-nrpe-docs] bakınız). 
2.  Eklenti kaynak kodunun bulunduğu dizine gidin, kaynaklardan derleyin ve ardından eklentiyi kurun.

    Atılması gereken en temel adımlar şunlardır:
    
    ```
    ./configure
    make all
    make install-plugin
    ```
    
### 3. Nagios Ana Makinesinde NRPE Nagios Eklentisinin NRPE Servisiyle Başarılı Bir Şekilde İletişim Kurduğundan Emin Olma

Bunu gerçekleştirmek için, Nagios ana makinesinde aşağıdaki komutu çalıştırın:

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

NRPE normal çalışıyorsa, komut çıktısında NRPE versiyon bilgisi (örneğin, `NRPE v3.2.1`) yer almalıdır.

### 4. Nagios Ana Makinesinde NRPE Nagios Eklentisini Tek Argümanla Çalıştıracak Şekilde `check_nrpe` Komutunu Tanımlama

Bunu gerçekleştirmek için, `/usr/local/nagios/etc/objects/commands.cfg` dosyasına aşağıdaki satırları ekleyin:

```
define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
 }
```

### 5. Filtre Düğüm Ana Makinesinde `collectd_nagios` Yardımcı Programını Kurma

Aşağıdaki komutlardan birini çalıştırın:

--8<-- "../include/monitoring/install-collectd-utils.md"

### 6. `collectd-nagios` Yardımcı Programını, `nagios` Kullanıcısı Adına Yükseltilmiş Ayrıcalıklarla Çalıştırılacak Şekilde Yapılandırma

Bunu gerçekleştirmek için, filtre düğümünde aşağıdaki adımları izleyin:
1.  [`visudo`][link-visudo] yardımcı programını kullanarak, `/etc/sudoers` dosyasına aşağıdaki satırı ekleyin:
    
    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
    
    Bu, `nagios` kullanıcısının `sudo` aracılığıyla şifre girmeden `collectd-nagios` yardımcı programını süper kullanıcı ayrıcalıklarıyla çalıştırmasına olanak tanır.

    
    !!! info "collectd-nagios'un Süper Kullanıcı Ayrıcalıklarıyla Çalıştırılması"
        Yardımcı program, `collectd` Unix domain soketine veri almak için erişim gerektirdiğinden süper kullanıcı ayrıcalıklarıyla çalıştırılmalıdır. Bu sokete sadece süper kullanıcı erişebilir.

2.  `nagios` kullanıcısının `collectd`'den metrik değerlerini alabileceğinden emin olmak için aşağıdaki test komutunu çalıştırın:
    
    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    Bu komut, `node.example.local` ana makinesi için [`wallarm_nginx/gauge-abnormal`][link-metric] metriğinin (işlenen istek sayısı) değerini almayı sağlar.
    
    **Komut çıktısına bir örnek:**
    
    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3.  NRPE servisi yapılandırma dosyasına, `sudo` yardımcı programını kullanarak komutları çalıştırabilmesi için bir önek ekleyin:
    
    ```
    command_prefix=/usr/bin/sudo
    ```

### 7. Filtre Düğümünde Gerekli Metrikleri Almak İçin NRPE Servisi Yapılandırma Dosyasına Komutlar Ekleyin

Örneğin, `node.example.local` tam nitelikli alan adına sahip filtre düğümü için `wallarm_nginx/gauge-abnormal` metriğini alacak olan `check_wallarm_nginx_abnormal` adında bir komut oluşturmak için, NRPE servisi yapılandırma dosyasına aşağıdaki satırı ekleyin:

```
command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```


!!! info "Bir metriğe eşik değerleri belirleme hakkında"
    Gerekirse, `collectd-nagios` yardımcı programının `WARNING` veya `CRITICAL` durumunu döndüreceği değer aralığını, ilgili `-w` ve `-c` seçeneklerini kullanarak belirleyebilirsiniz (ayrıntılar yardımcı program [belgelerinde][link-collectd-docs] mevcuttur).


Gerekli tüm komutlar NRPE servisi yapılandırma dosyasına eklendikten sonra, uygun komutu çalıştırarak servisi yeniden başlatın:

--8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 8. Nagios Ana Makinesinde, Filtre Düğüm Ana Makinesini Belirtmek ve İzlenecek Servisleri Tanımlamak İçin Yapılandırma Dosyalarını Kullanma

!!! info "Servisler ve Metrikler"
    Bu belgede, bir Nagios servisi ile bir metrik eşdeğer kabul edilmektedir.


Örneğin, bu aşağıdaki gibi yapılabilir:
1.  `/usr/local/nagios/etc/objects/nodes.cfg` dosyasını aşağıdaki içerikle oluşturun:
    
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

    Bu dosya, `10.0.30.5` IP adresiyle `node.example.local` ana makinesini ve filtre düğümünden `wallarm_nginx/gauge-abnormal` metriğinin alınarak `wallarm_nginx_abnormal` servisi durumunun kontrol edileceğini tanımlar (bkz. [`check_wallarm_nginx_abnormal`][anchor-header-7] komutunun açıklaması).

2.  Nagios yapılandırma dosyasına (varsayılan olarak `/usr/local/nagios/etc/nagios.cfg`) aşağıdaki satırı ekleyin:
    
    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```
    
    Bu, Nagios'un bir sonraki başlatmada `nodes.cfg` dosyasındaki verileri kullanmaya başlaması için gereklidir.

3.  Uygun komutu çalıştırarak Nagios servisini yeniden başlatın:

--8<-- "../include/monitoring/nagios-restart-2.16.md"

## Kurulum Tamamlandı

Artık Nagios, filtre düğümüne ait belirli metrikle ilişkilendirilmiş servisi izlemektedir. Gerektiğinde, ilgi duyduğunuz metrikleri kontrol etmek için diğer komutları ve servisleri de tanımlayabilirsiniz.


!!! info "NRPE Hakkında Bilgi"
    NRPE hakkında ek bilgi kaynakları:
    
    *   GitHub'daki NRPE'nin [README'si][link-nrpe-readme];
    *   NRPE belgeleri ([PDF][link-nrpe-pdf]).