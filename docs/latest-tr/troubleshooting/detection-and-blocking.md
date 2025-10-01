# Saldırı Tespiti ve Engelleme Sorun Giderme

## Saldırılar görüntülenmiyor

Trafikten gelen saldırıların Wallarm Cloud'a yüklenmediğinden ve bunun sonucunda Wallarm Console arayüzünde görünmediğinden şüpheleniyorsanız, sorunu gidermek için bu makaleyi kullanın.

Sorunu gidermek için aşağıdaki adımları sırasıyla uygulayın:

1. Daha ileri hata ayıklama için bazı zararlı trafik oluşturun.
1. Filtreleme düğümünün çalışma modunu kontrol edin.
1. Günlükleri toplayın ve Wallarm destek ekibiyle paylaşın.

**Bazı zararlı trafik oluşturun**

Wallarm modüllerinin daha ileri hata ayıklaması için:

1. Aşağıdaki zararlı trafiği gönderin:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    `<FILTERING_NODE_IP>` ifadesini kontrol etmek istediğiniz filtreleme düğümü IP’si ile değiştirin. Gerekirse komuta `Host:` başlığını ekleyin.
1. Saldırıların Wallarm Console → **Attacks** bölümünde görünmesi için en fazla 2 dakika bekleyin. 100 isteğin tamamı görünürse, filtreleme düğümü düzgün çalışıyor demektir.
1. Filtreleme düğümünün yüklü olduğu sunucuya bağlanın ve [düğüm metriklerini](../admin-en/configure-statistics-service.md) alın:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Devamında, `wallarm-status` çıktısına atıfta bulunacağız.

**Filtreleme düğümünün çalışma modunu kontrol edin**

Filtreleme düğümünün çalışma modunu şu şekilde kontrol edin:

1. Filtreleme düğümünün [modunun](../admin-en/configure-wallarm-mode.md) `off` dışında olduğundan emin olun. Düğüm `off` modunda gelen trafiği işlemez.

    `off` modu, `wallarm-status` metriklerinin artmamasının yaygın bir nedenidir.
1. Düğüm NGINX tabanlıysa, ayarların uygulandığından emin olmak için NGINX’i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. Saldırıların hâlâ Bulut’a yüklenmediğinden emin olmak için zararlı trafiği tekrar oluşturun.

**Günlükleri yakalayın ve Wallarm destek ekibiyle paylaşın**

Yukarıdaki adımlar sorunu çözmeye yardımcı olmadıysa, aşağıdaki şekilde düğüm günlüklerini toplayın ve Wallarm destek ekibiyle paylaşın:

1. Wallarm düğümünün kurulu olduğu sunucuya bağlanın.
1. `wallarm-status` çıktısını aşağıdaki gibi alın:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Çıktıyı kopyalayın.
1. Wallarm tanılama betiğini çalıştırın:

    ```bash
    /opt/wallarm/collect-info.sh
    ```

    Günlükleri içeren oluşturulmuş dosyayı alın.
1. Daha ayrıntılı inceleme için toplanan tüm verileri [Wallarm destek ekibine](mailto:support@wallarm.com) gönderin.

## Filtreleme düğümünün RPS ve APS değerleri Bulut’a aktarılmıyor

Filtreleme düğümünün RPS (saniye başına istek) ve APS (saniye başına saldırı) bilgileri Wallarm cloud’a aktarılmıyorsa, olası neden SELinux’tur.

[SELinux](https://www.redhat.com/en/topics/linux/what-is-selinux) RedHat tabanlı Linux dağıtımlarında (ör. CentOS veya Amazon Linux 2.0.2021x ve altı) varsayılan olarak kurulu ve etkindir. SELinux, Debian veya Ubuntu gibi diğer Linux dağıtımlarına da kurulabilir.

SELinux’un varlığını ve durumunu aşağıdaki komutu çalıştırarak kontrol edin:

``` bash
sestatus
```

Filtreleme düğümünün bulunduğu bir ana bilgisayarda SELinux mekanizması etkinse, düğüm kurulumu veya yükseltmesi sırasında [all-in-one yükleyici](../installation/inline/compute-instances/linux/all-in-one.md), düğümün SELinux ile çakışmaması için otomatik yapılandırmayı gerçekleştirir.

Otomatik yapılandırmadan sonra hâlâ SeLinux’un neden olabileceği sorunlar yaşıyorsanız, aşağıdakileri yapın:

1. SELinux’u geçici olarak devre dışı bırakmak için `setenforce 0` komutunu çalıştırın.

    Bir sonraki yeniden başlatmaya kadar SELinux devre dışı kalacaktır.

1. Sorun(lar)ın ortadan kalkıp kalkmadığını kontrol edin.
1. Yardım için [İletişime geçin](mailto:support@wallarm.com) Wallarm teknik desteğiyle.

    !!! warning "SELinux’un kalıcı olarak devre dışı bırakılması önerilmez"
        Güvenlik sorunları nedeniyle SELinux’un kalıcı olarak devre dışı bırakılması önerilmez.

## Filtreleme düğümü engelleme modunda (`wallarm_mode block`) çalışırken saldırıları engellemiyor

`wallarm_mode` yönergesinin kullanımı, trafik filtreleme modu yapılandırma yöntemlerinden yalnızca biridir. Bu yapılandırma yöntemlerinden bazıları, `wallarm_mode` yönergesi değerinden daha yüksek önceliğe sahiptir.

`wallarm_mode block` ile engelleme modunu yapılandırdıysanız ancak Wallarm filtreleme düğümü saldırıları engellemiyorsa, filtreleme modunun diğer yapılandırma yöntemleriyle geçersiz kılınmadığından emin olun:

* [**Set filtration mode** kuralını](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode) kullanmak
* [Wallarm Console’un **General** bölümü](../admin-en/configure-wallarm-mode.md#general-filtration-mode) içinde

[Filtreleme modu yapılandırma yöntemleri hakkında daha fazla bilgi →](../admin-en/configure-parameters-en.md)

## Kullanıcı meşru bir istekten sonra engelleme sayfası görüyor

Kullanıcınız, Wallarm önlemlerine rağmen meşru bir isteğin engellendiğini bildiriyorsa, bu makalede açıklandığı gibi isteği inceleyip değerlendirebilirsiniz.

Wallarm tarafından meşru bir isteğin engellenmesi sorununu çözmek için şu adımları izleyin:

1. Kullanıcıdan, engellenen istekle ilgili aşağıdakilerden biri olan bilgileri ekran görüntüsü değil, metin olarak sağlamasını isteyin:

    * Yapılandırılmışsa, Wallarm [engelleme sayfası](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) tarafından sağlanan bilgiler (kullanıcının IP adresi, istek UUID’si ve önceden yapılandırılmış diğer öğeleri içerebilir).

        ![Wallarm engelleme sayfası](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! warning "Engelleme sayfası kullanımı"
            Varsayılan veya özelleştirilmiş Wallarm engelleme sayfasını kullanmıyorsanız, kullanıcıdan uygun bilgileri almak için bunu [yapılandırmanız](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) şiddetle önerilir. Unutmayın ki örnek bir sayfa bile engellenen istekle ilgili anlamlı bilgileri toplar ve kolayca kopyalanmasına izin verir. Ek olarak, bu tür bir sayfayı özelleştirebilir veya tamamen yeniden oluşturup kullanıcılara bilgilendirici bir engelleme mesajı döndürebilirsiniz.
    
    * Kullanıcının istemci isteği ve yanıtının kopyası. Tarayıcı sayfa kaynak kodu veya terminal istemcisinin metin tabanlı girdi ve çıktısı uygundur.

1. Wallarm Console → [**Attacks**](../user-guides/events/check-attack.md) veya [**Incidents**](../user-guides/events/check-incident.md) bölümünde, engellenen istekle ilgili olayı [arama](../user-guides/search-and-filters/use-search.md) ile bulun. Örneğin, [istek kimliğine göre arayın](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. Olayı inceleyerek hatalı mı yoksa meşru bir engelleme mi olduğunu belirleyin.
1. Eğer hatalı bir engelleme ise, aşağıdaki önlemlerden birini veya birkaçının kombinasyonunu uygulayarak sorunu çözün: 

    * [Yanlış pozitiflere](../user-guides/events/check-attack.md#false-positives) karşı önlemler
    * [Kuralları](../user-guides/rules/rules.md) yeniden yapılandırma
    * [Tetikleyicileri](../user-guides/triggers/triggers.md) yeniden yapılandırma
    * [IP listelerini](../user-guides/ip-lists/overview.md) değiştirme

1. Başlangıçta kullanıcı tarafından sağlanan bilgiler eksikse veya güvenle uygulanabilecek önlemlerden emin değilseniz, daha fazla yardım ve inceleme için ayrıntıları [Wallarm desteği](mailto:support@wallarm.com) ile paylaşın.