# Uygulamanın ayda kaç istekle başa çıktığını öğrenme

Wallarm'ın temel lisanslama/faturalandırma yöntemleri, ortamınızda konuşlandırılan Wallarm filtreleme düğümlerinin hizmet verdiği istek seviyesine dayanır. Bu belge, uygulamanın ele aldığı talep sayısını kolayca öğrenme yöntemini açıklar.

## Bilgiye erişebilen ekipler

Normalde, bir şirkette aşağıdaki ekipler bilgiye kolayca erişebilir:

* DevOps
* Teknik Operasyonlar
* Bulut Operasyonları
* Platform Operasyonları
* DevSecOps
* Sistem Yöneticileri
* Uygulamaları Yönetenler
* NOC

## İstek sayısını öğrenme yöntemleri

Uygulamanın ele aldığı talep sayısını bulmak için birkaç yöntem vardır:

* AWS müşterileri ELB veya ALB yük dengeleyicilerini kullananlar, yük dengeleyicileri tarafından hizmet verilen uygulamalar için günlük ve haftalık istek seviyesini tahmin etmek için AWS izleme metriklerini kullanabilir:

    ![AWS izleme örneği](../../images/operation/aws-requests-example.png)

    Örneğin, bir grafik dakikada ortalama talep seviyesinin 350 olduğunu gösteriyorsa ve ayda ortalama olarak 730 saat olduğunu varsayarsak, aylık talep sayısı `350 * 60 * 730 = 15,330,000`.

* HTTP yük dengeleyicilerini kullanan GCP kullanıcıları, **https/request_count** izleme metriğini kullanabilir. Bu metrik, Ağ Yük Dengeleyicileri için kullanılabilir değildir.
* Microsoft IIS kullanıcıları, saniyedeki istek sayısının ortalamasını ve tek bir IIS sunucusunun bir ayda hizmet verdiği istek sayısını hesaplamak için **Requests Per Sec** metriğine güvenebilir. Hesaplamada, bir ayda ortalama olarak `730 * 3,600` saniye olduğunu varsayın.
* New Relic, Datadog, AppDynamics, SignalFX gibi Uygulama Performans İzleme hizmetlerini kullananlar, bilgiyi APM konsollarından alabilir. (Sadece kenar katmandaki tüm sunucular için birleştirilmiş değeri elde ettiğinizden emin olun, yani sadece bir sunucuyu değil).
* Datadog, AWS CloudWatch (ve birçok başka) gibi bulut tabanlı altyapı izleme sistemlerini kullanan kullanıcılar veya Prometheus veya Nagios gibi dahili izleme sistemlerini kullanan kullanıcılar, muhtemelen kenar konumlarındaki (yük dengeleyiciler, web sunucuları, uygulama sunucuları) hizmet verilen istek seviyesini zaten izliyorlar ve bu bilgiyi kolayca ortalama aylık işlenen istek sayısını tahmin etmek için kullanabilirler.
* Başka bir yaklaşım, bir süre boyunca (ideali - 24 saat) log kayıtlarının sayısını hesaplamak için kenar yük dengeleyicilerinin veya web sunucularının günlüklerini kullanmaktır, burada bir log kaydının bir isteğe karşılık geldiği varsayılır. Örneğin, bu web sunucusu NGINX erişim günlük dosyasını günde bir kez döndürür ve günlük dosyada 653.525 istek kaydedilmiştir:

    ```bash
    cd /var/log/nginx/
    zcat access.log.2.gz |wc -l
    # 653525
    ```

    * Sunucunun bir ayda hizmet verdiği talep miktarının tahmini, `653,525 * 30 = 19,605,750`.
    * Kullanılan web sunucularının toplam sayısını bilerek, tüm uygulamaların ele aldığı talep sayısını tahmin etmek mümkündür.

* Google Analytics veya benzeri kullanıcı deneyimi izleme ve izleme hizmetlerini kullanan saf web uygulamaları için, hizmet verilen sayılar ve tüm gömülü nesneler hakkındaki bilgiler hizmetlerden çıkarılabilir.