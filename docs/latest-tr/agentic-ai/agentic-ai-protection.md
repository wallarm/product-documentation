# Agentic AI Koruması (Erken Erişim)

Wallarm, AI ajanlarını, AI proxy’lerini ve AI özellikleri olan API’leri enjeksiyon saldırılarını ve veri sızıntılarını önleyerek, maliyetleri kontrol ederek ve güvenli, uyumlu operasyonları sağlayarak API-öncelikli bir yaklaşımla korur.

![Çalışırken Agentic AI - şema](../images/agentic-ai-protection/agentic-ai-schema.png)

## AI Ajanlarına Yönelik Yaygın Saldırılar

AI Ajanlarına yönelik yaygın saldırılar şunları içerir:

* Jailbreak’ler:

    * Sömürü amacıyla gizli sistem istemlerinin ve talimatlarının elde edilmesi.
    * İçerik filtrelerini atlatmak için şifrelenmiş istem komutlarının enjekte edilmesi.
    * Bir ajan tarafından yetkisiz işlemler için kısıtlı API’lerin çağrılması.

* Ajan API’lerine yönelik saldırılar:

    * Ajanların kullandığı araçlara, yaygın API saldırılarıyla yönelik saldırılar ve istismarlar.
    * Dahili API’ler üzerinden hassas veri sızıntıları.
    * Zayıf kimlik doğrulama ve yanlış yapılandırmaların istismarı.

* Botlar ve Ajan Kötüye Kullanımı:

    * Yavaş ve düşük hacimli saldırılar ve DDoS dahil olmak üzere otomatik bot saldırıları.
    * Kullanımın kötüye kullanımı ve kredi aşımları, lisans kötüye kullanımı dahil.
    * Otomatik hesap ele geçirme saldırıları.
    * Kitlesel istem enjeksiyonu.

* Kontrolsüz ve gölge AI Ajanları:

    * Gölge BT tarafından devreye alınan ajanlarda uygun güvenlik sıkılaştırması yoktur ve saldırganlar için arka kapılar bırakır.
    * Paylaşımlı ortamlarda yetkisiz ajanlar tarafından kiracılar arası veri sızıntıları.
    * Korunmasız gölge ajanların istismarı, kredi hırsızlığı ve çok büyük altyapı faturaları riski taşır.

Wallarm’ın Agentic AI Korumasının detaylı açıklamasını resmi sitede [buradan](https://www.wallarm.com/solutions/s-protect-agentic-ai) görebilirsiniz.

## Koruma nasıl çalışır

Wallarm’ın AI Ajanlarına yönelik saldırılara karşı koruması birkaç basit adımda çalışır:

1. Uygun dağıtım seçeneğini kullanarak Wallarm [filtreleme düğümünü](../about-wallarm/overview.md#how-wallarm-works) dağıtırsınız: [kendi barındırılan](../installation/supported-deployment-options.md), [Security Edge](../installation/security-edge/overview.md), [bağlayıcı kurulumu](../installation/connectors/overview.md).
1. İsteğe bağlı olarak, Wallarm’ın [API Discovery](../api-discovery/overview.md) özelliğini etkinleştirerek API envanterinizdeki AI/LLM uç noktalarının [otomatik keşfini](agentic-ai-discovery.md) açarsınız.
1. Wallarm Console içinde, Agentic AI için saldırıların nasıl tespit edilip nasıl hafifletileceğini tanımlayan [özel koruma politikaları](../user-guides/rules/rules.md) oluşturursunuz (geliştirme aşamasında).
1. Wallarm saldırıları otomatik olarak tespit eder ve [işlem uygular](../admin-en/configure-wallarm-mode.md) (sadece bir saldırıyı kaydetmek veya gerçek zamanlı olarak kaydedip engellemek).
1. Tespit edilen ve engellenen saldırılar [API Sessions](../api-sessions/overview.md) içinde görüntülenir. Kötü amaçlı istek ayrıntılarında, tespit ve/veya engellemeye neden olan politikaya geri bağlantı sunulur.

![Agentic AI’ye yönelik saldırılara karşı Wallarm - API Sessions](../images/agentic-ai-protection/agentic-ai-wallarm-demo-results.png)

## Demo

Wallarm’ın Agentic AI Koruması şu anda geliştirilmekte olan bir **erken erişim** özelliğidir - [demo](demo.md)’yu inceleyebilirsiniz.