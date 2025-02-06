# Uygulamanın Ayda İşlenen İstek Sayısını Öğrenme

Wallarm'ın ana lisanslama/faturalandırma yöntemleri, ortamınıza dağıtılan Wallarm filtreleme düğümleri tarafından işlenen istek seviyesine dayanmaktadır. Bu doküman, uygulama tarafından işlenen istek sayısını nasıl kolayca öğrenebileceğinizi açıklar.

## Bilgilere Erişim Hakkına Sahip Takımlar

Normalde, bir şirkette aşağıdaki takımlar bu bilgilere kolayca erişebilir:

* DevOps
* Technical Operations
* Cloud Operations
* Platform Operations
* DevSecOps
* System Administrators
* Application Administrators
* NOC

## İstek Sayısını Öğrenme Yöntemleri

Uygulama tarafından işlenen istek sayısını öğrenmenin birkaç yöntemi bulunmaktadır:

* ELB veya ALB yük dengeleyicilerini kullanan AWS müşterileri, yük dengeleyicileri tarafından sunulan uygulamalara ait günlük ve haftalık istek seviyelerini tahmin etmek için AWS'nın yük dengeleyici izleme metriklerini kullanabilir:

    ![AWS monitoring example](../../images/operation/aws-requests-example.png)

    Örneğin, bir grafik ortalama dakikada 350 istek olduğunu gösteriyorsa ve bir ayda ortalama 730 saat olduğu varsayılırsa, aylık istek sayısı `350 * 60 * 730 = 15,330,000` olacaktır.

* HTTP yük dengeleyicilerini kullanan GCP kullanıcıları **https/request_count** izleme metriğini kullanabilir. Bu metrik, Network Load Balancers için mevcut değildir.
* Microsoft IIS kullanıcıları, saniyede ortalama istek sayısını elde etmek ve tek bir IIS sunucusu tarafından aylık işlenen istek sayısını hesaplamak için **Requests Per Sec** metriğine başvurabilir. Hesaplamada, bir ayda ortalama `730 * 3,600` saniye olduğu varsayılmaktadır.
* New Relic, Datadog, AppDynamics, SignalFX ve benzeri Application Performance Monitoring hizmetlerini kullanan kullanıcılar, APM konsollarından bu bilgiyi edinebilir (katman kenarındaki tüm sunucular için toplu bir değer aldığınızdan emin olun, sadece bir sunucu için değil).
* Datadog, AWS CloudWatch (ve diğer birçok) gibi bulut tabanlı altyapı izleme sistemlerini veya Prometheus ya da Nagios gibi dahili izleme sistemlerini kullanan kullanıcılar, muhtemelen kenar konumlarındaki (yük dengeleyiciler, web sunucuları, uygulama sunucuları) işlenen istek seviyelerini zaten izlemekte ve bu bilgiyi kullanarak aylık ortalama işlenen istek sayısını kolayca tahmin edebilmektedir.
* Başka bir yöntem ise, kenar yük dengeleyicilerin veya web sunucularının günlüklerini kullanarak, bir süre içerisindeki (ideal olarak 24 saat) günlük kayıtlarının sayısını saymaktır; burada her işlenen istek için bir günlük kaydı olduğu varsayılmaktadır. Örneğin, bu web sunucusu NGINX erişim günlük dosyasını günde bir kez döndürüyor ve günlük dosyasında 653,525 istek kaydediliyor:

    ```bash
    cd /var/log/nginx/
    zcat access.log.2.gz |wc -l
    # 653525
    ```

    * Sunucu tarafından aylık işlenen istek sayısının tahmini `653,525 * 30 = 19,605,750`'dir.
    * Kullanılan toplam web sunucusu sayısını bilmek, tüm uygulamanın işlediği istek sayısını tahmin etmeyi mümkün kılar.

* Google Analytics veya benzeri kullanıcı deneyimi izleme hizmetlerini kullanan saf web uygulamaları için, sunulan sayfa sayısı ve tüm gömülü nesneler hakkındaki bilgiler hizmetlerden çıkarılabilir.