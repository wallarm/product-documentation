# AWS Ortamlarında AWS WAF ve Wallarm'ın Entegrasyonu

Modern bulut mimarilerinde hem çevreyi hem de uygulamanın çekirdeğini korumak için katmanlı bir güvenlik yaklaşımı esastır. AWS ortamlarında, AWS WAF yük dengeleyiciler ve API ağ geçitleri gibi giriş noktalarını savunurken, Wallarm yığının daha derinlerindeki API'leri ve mikroservisleri korur.

Bir derinlemesine savunma stratejisinde birleştirildiğinde, uçtan uygulama katmanına kadar web uygulamaları ve API'ler için kapsamlı koruma sağlarlar.

![!](../../../images/waf-installation/aws/aws-waf-wallarm-responsibilities.png)

## AWS WAF: AWS altyapısı için çevre koruması

[AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html), uygulamalara ulaşmadan önce HTTP(S) trafiğini gerçek zamanlı olarak filtreleyerek ağ sınırında ilk savunma hattı görevi görür. Web ACL'leri kullanarak SQL enjeksiyonu ve XSS gibi yaygın tehditleri engeller ve bir isteğin çeşitli kısımlarını — başlıklar, URI, gövde ve daha fazlasını — inceleyebilir.

Tam yönetilen bir hizmet olarak AWS WAF, otomatik ölçeklenir ve DDoS koruması için AWS Shield ile, hesaplar genelinde merkezi kural uygulaması için Firewall Manager ile entegre olur. 

AWS WAF, bilinen tehditleri ve kötü amaçlı kalıpları ölçekli bir şekilde engelleyen bir çevre savunması oluşturur ve genel bulut altyapısını kalkanlar. Ancak, daha karmaşık, uygulama katmanı veya API'ye özgü saldırıları belirlemek çoğu zaman daha derin bir inceleme gerektirir — Wallarm'ın üstesinden gelmek üzere tasarlandığı alan.

## Wallarm: mikroservisler için API odaklı uygulama güvenliği

Wallarm, özellikle API'ler ve mikroservis tabanlı mimariler gibi modern uygulamaları güvence altına almak için tasarlanmış bir Gelişmiş API Güvenliği platformudur. AWS WAF çevreye odaklanırken, Wallarm uygulamaya daha yakın çalışır ve API'leriniz, mikroservisleriniz ve uygulama mantığınız hakkında bağlamla trafiği analiz eder.

Wallarm, geleneksel kalıp tabanlı WAF'ların kaçırabileceği karmaşık saldırıları yakalamak için derin istek incelemesi, uyarlanabilir filtreleme ve yapay zeka destekli tehdit tespiti kullanır. 

Wallarm, özellikle JSON API isteğinde bir mantık hatasının istismarı veya bir parametre kurcalama saldırısı gibi API'ye özgü tehditleri ve normal API davranışından sapan olağan dışı kullanım kalıplarını yakalayan anomali tespitinde başarılıdır.

## Dağıtım topolojisi

### Bulut‑yerel yığında dağıtım

Wallarm, bulut ve konteynerize ortamlarda sorunsuz dağıtım için tasarlanmıştır. Kapsüllenmiş bir servis, inline proxy olarak veya NGINX ya da Kong gibi proxy'lerle entegre bir modül olarak çalışabilir.

AWS'de Wallarm; EKS, ECS (Fargate dâhil) üzerinde ya da AMI aracılığıyla EC2 üzerinde dağıtımı destekleyerek çeşitli mimariler için esneklik sunar. Modern API protokollerini — REST, GraphQL, gRPC, WebSocket — destekler ve bu katmanlar boyunca trafiği korur.

Wallarm düğümleri, hizmetleriniz büyüdükçe güvenlik katmanının da onlarla birlikte ölçeklenmesini sağlayarak AWS Auto Scaling veya Kubernetes otomatik ölçekleyicilerini kullanarak otomatik olarak ölçeklenir.

[AWS için tüm Wallarm dağıtım seçenekleri](../../../installation/supported-deployment-options.md#public-clouds)

### API ve mikroservis koruma yetenekleri

Wallarm, API trafiğini derinlemesine anlama konusunda öne çıkar. Karmaşık JSON/XML yüklerini ayrıştırabilir, iç içe parametreleri işleyebilir ve suistimali önlemek için API şemalarını zorlayabilir. Geleneksel WAF'ların sıklıkla kaçırdığı mantık tabanlı API saldırılarının (ör. BOLA, toplu atama (mass assignment)) aksine, Wallarm iş mantığı suistimalini, zehirlenmiş sorguları ve çok adımlı saldırı zincirlerini tespit eder.

Ayrıca yanlış pozitifleri azaltmak için potansiyel güvenlik açıklarını güvenli biçimde test etmeyi sağlayan tehdit yeniden oynatma testini destekler.

API kullanımı, saldırı kalıpları ve gölge API'lere ilişkin ayrıntılı içgörülerle Wallarm, AWS WAF'in uç düzey filtrelemesini tamamlayarak uygulama katmanında görünürlük ve koruma ekler. Birlikte, hem bilinen hem de gelişmekte olan tehditleri engelleyen katmanlı bir savunma oluştururlar.

[Wallarm yetenekleri hakkında daha fazla bilgi](../../../about-wallarm/overview.md)

### Tamamlayıcı katmanlı güvenlik yaklaşımı

AWS WAF ve Wallarm'ı birleştirmek, her katmanın farklı tehditleri hedeflediği gerçek bir derinlemesine savunma modeli sağlar:

* AWS WAF, bilinen enjeksiyon kalıpları, botlar ve tarayıcılar gibi geniş kapsamlı, çevre düzeyindeki saldırıları filtreleyerek, trafik uygulamaya ulaşmadan önce gürültüyü ve trafik yükünü azaltır.
* Wallarm ise kalan trafiği API farkındalığı ve uyarlanabilir tespit ile inceler; çevre filtrelerinin gözden kaçırabileceği iş mantığı suistimali veya sıfır‑gün API saldırıları gibi daha ince tehditleri yakalar.

Bu katmanlı kurulum, her aracın en iyi yaptığı şeyi yapmasına olanak tanır: AWS WAF genel güvenlik kurallarını (IP bloklamaları, coğrafi kısıtlamalar, oran sınırları) uygularken, Wallarm derin trafik analizi ve davranışsal bağlamla uygulama içini korur. Sonuç, geliştirilmiş tespit, daha az yanlış pozitif ve daha az manuel kural ayarıdır.

Temel filtrelemeyi AWS WAF'e bırakarak ve Wallarm'ın karmaşık, uygulamaya özgü tehditlere odaklanmasını sağlayarak ekipler daha ölçeklenebilir, daha doğru ve daha dayanıklı bir güvenlik mimarisinden yararlanır. Bu yaklaşım, bulut‑yerel en iyi uygulamalarla uyumludur ve modern uygulamaların hem giriş noktalarını hem de iç işleyişini korumaya yardımcı olur.

### Yüksek seviyeli entegrasyon mimarisi

Birleşik AWS WAF + Wallarm mimarisi aşağıdaki katmanlı mimari olarak görselleştirilebilir:

1. Çevre Katmanı - AWS giriş noktalarında AWS WAF

    İnternet trafiği önce CloudFront, API Gateway veya ALB gibi servislere ulaşır; burada AWS WAF, Web ACL kurallarını uygulayarak istekler uygulamaya ulaşmadan önce SQLi, XSS ve botlar gibi bilinen tehditleri engeller. Ayrıca gürültüyü daha da azaltmak için IP, coğrafi ya da hız temelli politikalar uygulayabilir.
1. Uygulama Katmanı - Wallarm Filtreleme Düğümleri

    Temiz trafik daha sonra ECS, EKS veya EC2 üzerinde çalışan Wallarm düğümlerine akar. Akıllı bir proxy veya ingress denetleyicisi olarak hareket eden Wallarm, derin API incelemesi gerçekleştirir; mantık kusurlarını, çok adımlı saldırıları ve anormal kalıpları tespit eder. Yalnızca doğrulanmış trafik uygulama servislerine iletilir.
1. İç Katman - Mikroservisler ve Veri Depoları

    Doğrulanmış istekler, her iki katman tarafından zaten filtrelenmiş olarak — API'ler, mikroservisler, veritabanları — çekirdek bileşenlere ulaşır. Wallarm, veri sızıntısını önlemek gibi amaçlarla, giden yanıtları da inceleyebilir. mTLS veya IAM gibi servisler arası ek korumalar bu katmanı daha da güçlendirebilir. 

![!](../../../images/waf-installation/aws/aws-waf-wallarm-deployment.png)

Yaygın bir model: ALB + AWS WAF → Wallarm → Uygulama. Wallarm, altyapıda büyük değişiklikler gerektirmeden esnek dağıtımları destekler — ALB'nin arkasında inline, EKS'te bir ingress olarak veya API Gateway ya da CloudFront origin'lerinin arkasında. Standart AWS ağ yapısıyla uyumluluğu, hem genel hem de dahili trafik yollarını korumasına olanak tanır.