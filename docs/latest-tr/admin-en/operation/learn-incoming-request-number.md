# API'lerinizin ayda işlediği istek sayısını öğrenme

Wallarm'ın birincil lisanslama/faturalandırma yöntemleri, ortamınıza dağıtılmış Wallarm filtreleme düğümleri tarafından sunulan istek seviyesine dayanır. Bu belge, API'lerinizin işlediği istek sayısını kolayca nasıl öğrenebileceğinizi açıklar.

## Bu bilgiye erişimi olan ekipler

Genellikle, bir şirkette aşağıdaki ekipler bu bilgiye kolayca erişebilir:

* DevOps
* Teknik Operasyonlar
* Bulut Operasyonları
* Platform Operasyonları
* DevSecOps
* Sistem Yöneticileri
* NOC

## İstek sayısını öğrenme yöntemleri

API'nin işlediği istek sayısını öğrenmek için birkaç yöntem vardır:

* ELB veya ALB yük dengeleyicileri (load balancer) kullanan AWS müşterileri, yük dengeleyicilerin AWS izleme metriklerini kullanarak, yük dengeleyicilerin servis verdiği API'ler için günlük ve haftalık istek seviyelerini tahmin edebilir:

    ![AWS izleme örneği](../../images/operation/aws-requests-example.png)

    Örneğin, bir grafik dakikadaki ortalama istek seviyesinin 350 olduğunu gösteriyorsa ve bir ayda ortalama 730 saat olduğunu varsayarsak, aylık istek sayısı `350 * 60 * 730 = 15,330,000` olur.

* HTTP yük dengeleyicilerini kullanan GCP kullanıcıları **https/request_count** izleme metriğini kullanabilir. Bu metrik Network Load Balancers için mevcut değildir.
* Microsoft IIS kullanıcıları, saniye başına ortalama istek sayısını elde etmek ve tek bir IIS sunucusunun ayda hizmet verdiği istek sayısını hesaplamak için **Requests Per Sec** metriğine güvenebilir. Hesaplamada, bir ayda ortalama `730 * 3,600` saniye olduğunu varsayınız.
* New Relic, Datadog, AppDynamics, SignalFX ve benzeri Application Performance Monitoring servislerinin kullanıcıları, bilgiyi APM konsollarından alabilir (edge katmanındaki tüm ilgili sunucular için birleştirilmiş değeri aldığınızdan ve yalnızca tek bir sunucunun değerini almadığınızdan emin olun).
* Datadog, AWS CloudWatch (ve daha birçokları) gibi bulut‑tabanlı altyapı izleme sistemlerinin kullanıcıları veya Prometheus ya da Nagios gibi dahili izleme sistemlerinin kullanıcıları muhtemelen edge konumlarında (yük dengeleyiciler, web sunucuları, API sunucuları) sunulan istek seviyesini hâlihazırda izlemektedir ve bu bilgiyi kullanarak ayda işlenen ortalama istek sayısını kolayca tahmin edebilir.
* Başka bir yaklaşım, edge yük dengeleyicilerinin veya web sunucularının günlüklerini kullanarak belirli bir zaman dilimindeki (ideal olarak 24 saat) günlük kayıtlarını saymaktır; her sunulan istek için bir günlük kaydı olduğu varsayımıyla. Örneğin, bu web sunucusu NGINX erişim günlüğü dosyasını günde bir kez döndürür ve günlük dosyasında 653,525 istek kaydedilmiştir: 

    ```bash
    cd /var/log/nginx/
    zcat access.log.2.gz |wc -l
    # 653525
    ```

    * Sunucunun bir ayda hizmet verdiği isteklerin tahmini sayısı `653,525 * 30 = 19,605,750`’dir.
    * Kullanılan toplam web sunucusu sayısını bilmek, tüm API tarafından işlenen istek sayısını tahmin etmeyi mümkün kılar.

* Google Analytics veya benzeri kullanıcı deneyimi izleme ve gözlemleme servislerini kullanan salt web uygulamaları için, sunulan sayfa sayısı ve tüm gömülü nesneler hakkındaki bilgiler bu servislerden çıkarılabilir.