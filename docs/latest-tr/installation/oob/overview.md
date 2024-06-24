# Wallarm Out-of-Band (OOB) Dağıtımının Genel Bakışı

Wallarm, trafiğin bir aynası üzerinden talepleri inceleyen bir Out-of-Band (OOB) güvenlik çözümü olarak dağıtılabilir. Bu makale yaklaşımı ayrıntılı bir şekilde açıklar.

OOB yaklaşımı, Wallarm çözümünü ayrı bir ağ segmentine yerleştirme işlemi içerir; burada çözüm gelen trafiği inceleyebilir, ana veri yolu ve sonuç olarak uygulama performansını etkilemeden. Tüm gelen talepler, kötü niyetli olanlar da dahil olmak üzere hedeflendikleri sunuculara ulaşır.

## Kullanım Dalıları

Trafik aynalama, OOB yaklaşımının ana bileşenidir. Gelen trafiğin bir ayna (kopya) hattı, Wallarm OOB çözümüne gönderilir ve bu çözüm, gerçek trafiğin yerine, kopyası üzerinde çalışır.

OOB çözümü sadece kötü niyetli etkinlikleri kaydeder ancak engellemez, bu da gerekli olan gerçek zamanlı koruma gereksinimleri daha az katı olan kuruluşlar için web uygulaması ve API güvenliğini uygulamanın etkili bir yoludur. OOB çözümü aşağıdaki kullanım durumları için uygundur:

* Uygulama performansını etkilemeden, web uygulamalarının ve API'lerin karşılaşabilecekleri tüm potansiyel tehditler hakkında bilgi edinin.
* Modülü [in-line](../inline/overview.md) çalıştırmadan önce Wallarm çözümünü trafiğin kopyası üzerinde eğitin.
* Denetleme amacıyla güvenlik günlüklerini yakalayın. Wallarm, birçok SIEM sistemi, mesajlaşma uygulamaları vb. ile [doğal entegrasyonlar](../../user-guides/settings/integrations/integrations-intro.md) sağlar.

Aşağıdaki diyagram, Wallarm'ın dış bant dağıtımındaki genel trafik akışının görsel bir temsili olup, tüm olası altyapı varyasyonlarını yakalamayabilir. Trafik aynası, altyapının destekleyici katmanlarının herhangi birinde oluşturulabilir ve Wallarm düğümlerine gönderilebilir. Ayrıca, belirli kurulumlar yük dağıtımı ve diğer altyapı düzeyi yapılandırmaları içerebilir.

![OOB şeması](../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Avantajları ve Sınırlamaları

OOB yaklaşımı, Wallarm dağıtımı için diğer dağıtım yöntemlerine göre birkaç avantaj sunar, örneğin inline dağıtımlar:

* Ana veri yoluna paralel çalışan güvenlik çözümünde yaşanabilecek gecikme veya diğer performans sorunlarını ortaya çıkarmaz.
* Esneklik ve dağıtım kolaylığı sağlar, çünkü çözüm ağındaki bir etkisi olmaksızın ağa eklenebilir veya çıkarılabilir.

OOB'ların güvenilir dağıtımı olmasına rağmen, bazı sınırlamaları vardır:

* Wallarm, trafik analizinin gerçek trafik akışına bakılmaksızın ilerlemesine bağlı olarak kötün niyetli talepleri hemen engellemez.

    Wallarm sadece saldırıları gözlemler ve size [Wallarm Konsolu'ndaki detayları](../../user-guides/events/analyze-attack.md) sunar.
* [Pasif algılama](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemi ile zafiyet tespiti doğru bir şekilde çalışmaz. Çözüm, bir API'nin savunmasız olup olmadığını, sunucunun zafiyetleri test etmek için tipik olan kötü niyetli taleplere yanıt vermesine dayanarak belirler.
* [Wallarm API Keşfi](../../about-wallarm/api-discovery.md), sunucu yanıtlarının modül çalışması için gerekli olduğu API envanterini sizin trafiğinize dayanarak araştırmaz.
* [Zorla gezinmeye karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md), yanıt kodu analizi gerektirir ki bu şu anlık teknik olarak mümkün değildir.

## Desteklenen dağıtım seçenekleri

Wallarm, NGINX, Envoy, Istio gibi hizmetler tarafından aynalanan trafik için Out of Band (OOB) dağıtım seçenekleri sunar. Genellikle trafik aynalama için yerleşik modüller veya özellikler sunarlar.

Eğer bu çözümler tarafından aynalanan trafiği analiz edecek bir OOB güvenlik çözümü arıyorsanız, [uygun Wallarm dağıtım seçeneği genel bakışına](web-server-mirroring/overview.md) bakınız.