# Wallarm Out-of-Band Dağıtımına Genel Bakış

Wallarm, trafiğin bir yansıması (mirror) aracılığıyla gelen istekleri inceleyen kendi kendine barındırılan bir Out-of-Band (OOB) güvenlik çözümü olarak dağıtılabilir. Bu makale, yaklaşımı ayrıntılı olarak açıklamaktadır.

OOB yaklaşımı, Wallarm çözümünün ayrı bir ağ segmentine yerleştirilmesini içerir; böylece gelen trafik, ana veri yolunu etkilemeden incelenebilir ve sonuç olarak uygulama performansı etkilenmez. Tüm gelen istekler, kötü niyetli olanlar da dahil olmak üzere, adreslendikleri sunuculara ulaşır.

## Kullanım Senaryoları

Trafik yansıtma, OOB yaklaşımının temel bileşenidir. Gelen trafiğin bir kopyası, gerçek trafik yerine kopya üzerinde çalışan Wallarm OOB çözümüne gönderilir.

OOB çözümü yalnızca kötü amaçlı etkinlikleri kaydettiği, ancak bunları engellemediği için, gerçek zamanlı koruma gereksinimleri daha az katı olan kuruluşlar için web uygulaması ve API güvenliğini uygulamanın etkili bir yoludur. OOB çözümü aşağıdaki kullanım senaryoları için uygundur:

* Uygulama performansını etkilemeden, web uygulamalarının ve API'lerin karşılaşabileceği tüm potansiyel tehditler hakkında bilgi edinin.
* Wallarm çözümünü, modülü [in-line](../inline/overview.md) çalıştırmadan önce trafik kopyası üzerinde eğitin.
* Denetim amaçlı güvenlik günlüklerini yakalayın. Wallarm, birçok SIEM sistemi, mesajlaşma uygulamaları vb. ile [native integrations](../../user-guides/settings/integrations/integrations-intro.md) sunmaktadır.

Aşağıdaki diyagram, Wallarm'un out-of-band dağıtımındaki genel trafik akışının görsel bir temsilini sunmaktadır. Diyagram, tüm olası altyapı varyasyonlarını yansıtmayabilir. Trafik yansıtması, altyapının destekleyen herhangi bir katmanında oluşturulabilir ve Wallarm düğümlerine gönderilebilir. Ayrıca, belirli kurulumlar değişken yük dengeleme ve diğer altyapı düzeyi yapılandırmaları içerebilir.

![OOB scheme](../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Avantajlar

Wallarm dağıtımında OOB yaklaşımı, in-line dağıtımlar gibi diğer dağıtım yöntemlerine göre birkaç avantaj sunar:

* Güvenlik çözümü, ana veri yoluyla birlikte in-line çalışırken oluşabilecek gecikme veya diğer performans sorunlarını tetiklemez.
* Çözüm, ana veri yolunu etkilemeden ağa eklenip kaldırılabileceği için esneklik ve kolay dağıtım imkanı sağlar.

## Sınırlamalar

OOB dağıtım yaklaşımının güvenliğine rağmen bazı sınırlamaları vardır. Aşağıdaki tablo, çeşitli dağıtım seçeneklerine ilişkin sınırlamaları detaylandırmaktadır:

| Özellik | [eBPF](ebpf/deployment.md) | [TCP mirror](tcp-traffic-mirror/deployment.md) | [Web server mirror](web-server-mirroring/overview.md) |
| --- | --- | --- | --- |
| Kötü niyetli isteklerin anında engellenmesi | - | - | - |
| [Passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) kullanarak zafiyet keşfi | - | + | - |
| [API Discovery](../../api-discovery/overview.md) | + (yanıt yapısı hariç) | + | - |
| [Protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) | + | + | - |
| [Rate limiting](../../user-guides/rules/rate-limiting.md) | - | - | - |
| [IP lists](../../user-guides/ip-lists/overview.md) | - | - | - |

## Desteklenen Dağıtım Seçenekleri

Wallarm, aşağıdaki Out-of-Band (OOB) dağıtım seçeneklerini sunar:

* [eBPF tabanlı çözüm](ebpf/deployment.md)
* [TCP trafik yansıtma analizi](tcp-traffic-mirror/deployment.md) çözümü
* Birçok mevcut Wallarm artifact'ı, NGINX, Envoy, Istio vb. gibi hizmetler tarafından yansıtılan trafiği analiz etmek için [Wallarm'un dağıtımında kullanılabilir.](web-server-mirroring/overview.md) Bu hizmetler tipik olarak, yerleşik trafik yansıtma özellikleri sunar ve Wallarm artifact'ları, bu tür çözümler tarafından yansıtılan trafiğin analizine uygundur.