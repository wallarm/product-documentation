# Wallarm Bant Dışı (Out-of-Band) Dağıtımına Genel Bakış

Wallarm, trafiğin aynası üzerinden istekleri inceleyen, kendi altyapınızda barındırılan bir Bant Dışı (OOB) güvenlik çözümü olarak dağıtılabilir. Bu makale yaklaşımı ayrıntılı olarak açıklar.

OOB yaklaşımı, Wallarm çözümünün ayrı bir ağ segmentine yerleştirilmesini içerir; böylece gelen trafiği birincil veri yolunu ve dolayısıyla uygulama performansını etkilemeden inceleyebilir. Kötü amaçlı olanlar dahil tüm gelen istekler, yöneltildikleri sunuculara ulaşır.

## Kullanım senaryoları

Trafik aynalama, OOB yaklaşımının temel bileşenidir. Gelen trafiğin bir aynası (kopyası) Wallarm OOB çözümüne gönderilir; çözüm, gerçek trafik yerine kopya üzerinde çalışır.

OOB çözümü yalnızca kötü amaçlı etkinliği kaydeder ve engelleme yapmadığından, gerçek zamanlı koruma gereksinimleri daha az katı olan kuruluşlar için web uygulaması ve API güvenliğini uygulamanın etkili bir yoludur. OOB çözümü aşağıdaki kullanım senaryoları için uygundur:

* Uygulama performansını etkilemeden, web uygulamalarının ve API'lerin karşılaşabileceği tüm potansiyel tehditler hakkında bilgi edinmek.
* Modülü [satır içi](../inline/overview.md) çalıştırmadan önce, trafik kopyası üzerinde Wallarm çözümünü eğitmek.
* Denetim amaçları için güvenlik günlüklerini yakalamak. Wallarm, birçok SIEM sistemi, mesajlaşma uygulaması vb. ile [yerel entegrasyonlar](../../user-guides/settings/integrations/integrations-intro.md) sağlar.

Aşağıdaki şema, Wallarm’ın bant dışı dağıtımındaki genel trafik akışının görsel bir temsilini sunar. Şema, tüm olası altyapı varyasyonlarını kapsamayabilir. Trafik aynası, altyapının bunu destekleyen herhangi bir katmanında oluşturulabilir ve Wallarm düğümlerine gönderilebilir. Buna ek olarak, belirli kurulumlar farklı yük dengeleme ve diğer altyapı düzeyi yapılandırmaları içerebilir.

## Avantajlar

Wallarm’ın OOB dağıtım yaklaşımı, satır içi dağıtımlar gibi diğer dağıtım yöntemlerine kıyasla çeşitli avantajlar sunar:

* Güvenlik çözümü birincil veri yoluyla satır içi çalışırken ortaya çıkabilecek gecikme veya diğer performans sorunlarını yaratmaz.
* Çözüm, birincil veri yolunu etkilemeden ağa eklenip çıkarılabildiği için esneklik ve kolay dağıtım sağlar.

## Sınırlamalar

OOB dağıtım yaklaşımı güvenli olsa da bazı sınırlamalara sahiptir. Aşağıdaki tablo, çeşitli dağıtım seçenekleriyle ilişkili sınırlamaları detaylandırır:

| Özellik | [eBPF](ebpf/deployment.md) | [TCP aynası](tcp-traffic-mirror/deployment.md) |
| --- | --- | --- |
| Kötü amaçlı isteklerin anında engellenmesi | - | - |
| [pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) kullanarak güvenlik açığı keşfi | - | + |
| [API Discovery](../../api-discovery/overview.md) | + (yanıt yapısı hariç) | + |
| [Zorla gezinmeye karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) | + | + |
| [Rate limiting](../../user-guides/rules/rate-limiting.md) | - | - |
| [IP lists](../../user-guides/ip-lists/overview.md) | - | - |

## Desteklenen dağıtım seçenekleri

Wallarm aşağıdaki Bant Dışı (OOB) dağıtım seçeneklerini sunar:

* [eBPF tabanlı çözüm](ebpf/deployment.md)
* [TCP trafik aynası analizi](tcp-traffic-mirror/deployment.md) için çözüm