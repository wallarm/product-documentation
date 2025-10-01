# IP'ye göre filtreleme

Wallarm Console'un **IP lists** bölümünde, IP adreslerini, coğrafi konumları, veri merkezlerini veya source types'ları allowlisting, denylisting ve graylisting uygulayarak uygulamalarınıza erişimi kontrol edebilirsiniz.

* **Allowlist**, Wallarm korumasını atlayan ve uygulamalarınıza herhangi bir kontrol olmadan erişen güvenilir kaynaklar listesidir.
* **Denylist**, uygulamalarınıza erişemeyen kaynaklar listesidir - bunlardan gelen tüm istekler engellenecektir.
* **Graylist**, yalnızca **Safe blocking** [filtration mode](../../admin-en/configure-wallarm-mode.md) modunda şu şekilde düğüm tarafından işlenen şüpheli kaynaklar listesidir: graylist'teki IP kötü amaçlı istekler gönderirse, düğüm bu istekleri engellerken meşru istekleri izin verir; diğer IP'lerden gelen istekler ise asla engellenmez, ancak kötü amaçlı olanlar tespit edilir ve **Attacks** bölümünde `Monitoring` durumuyla görüntülenir.

    Graylist'teki IP'lerden gelen kötü amaçlı istekler aşağıdaki saldırı türlerinin belirtilerini içeren isteklere karşılık gelir:

    * [Girdi doğrulama saldırıları](../../attacks-vulns-list.md#attack-types)
    * [vpatch türü saldırılar](../rules/vpatch-rule.md)
    * [Düzenli ifadelere dayalı olarak tespit edilen saldırılar](../rules/regex-rule.md)

![Tüm IP listeleri](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## Allowlist, denylist ve graylist birlikte nasıl çalışır

Filtreleme düğümü, IP listelerini analiz etmek için seçilen çalışma [mode](../../admin-en/configure-wallarm-mode.md)'una göre farklı yaklaşımlar kullanır. Bazı modlarda allowlists, denylists ve graylists olmak üzere üç tür IP listesinin tamamını değerlendirir. Ancak, diğer modlarda yalnızca belirli IP listelerine odaklanır.

Aşağıda sunulan görsel, her çalışma modunda IP listelerinin önceliklerini ve kombinasyonlarını görsel olarak temsil ederek hangi listelerin dikkate alındığını vurgular:

![IP listesi öncelikleri](../../images/user-guides/ip-lists/ip-lists-priorities.png)

Bunun anlamı şudur:

* Herhangi bir modda, IP önceki listede bulunursa, bir sonraki dikkate alınmaz.
* Graylist yalnızca `Safe blocking` modunda dikkate alınır.

!!! warning "İstisnalar"
    Eğer [`wallarm_acl_access_phase off`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) ise, Wallarm düğümü `Monitoring` modunda denylist'teki IP'lerden gelen istekleri engellemez.

## IP listelerini yapılandırma

Adımlar:

1. Amacınıza bağlı olarak hangi listeyi kullanacağınıza karar verin.
1. [Hangi nesnenin ekleneceğini](#select-object) seçin: IP, alt ağ, konum, source type.
1. Nesnenin listede kalacağı [süreyi seçin](#select-time-to-stay-in-list) (genellikle sonsuza kadar değildir).
1. [Hedef uygulamaya göre sınırlandırın](#limit-by-target-application) (tüm istekler değil, yalnızca belirli uygulamayı hedefleyenler).

### Nesne seçin {#select-object}

Herhangi bir IP listesine aşağıdakileri eklemek için **Add object** kullanın:

* **IP veya alt ağ** - desteklenen maksimum alt ağ maskesi IPv6 adresleri için `/32`, IPv4 adresleri için `/12`'dir.

* Bu ülke veya bölgede kayıtlı tüm IP adreslerini eklemek için **Konum** (ülke veya bölge)
* Bu türe ait tüm IP adreslerini eklemek için **Source type**. Mevcut türler:

    * Search Engines
    * Datacenters (AWS, GCP, Oracle, etc.)
    * Anonymous sources (Tor, Proxy, VPN)
    * [Malicious IPs](#malicious-ip-feeds)

![IP listesine nesne ekleme](../../images/user-guides/ip-lists/add-ip-to-list.png)

!!! info "IP listelerinin otomatik doldurulması"
    Nesneleri manuel eklemeye ek olarak, **tercih edilen** [otomatik liste doldurmayı](#automatic-listing) kullanabileceğinizi unutmayın.

### Listede kalma süresini seçin {#select-time-to-stay-in-list}

Bir nesneyi listeye eklerken, ne kadar süreyle ekleneceğini belirtirsiniz. Minimum süre 5 dakika, varsayılan 1 saat, maksimum ise sonsuzdur. Süre dolduğunda nesne listeden otomatik olarak silinir.

Belirtilen süreyi daha sonra istediğiniz anda değiştirebilirsiniz - bunu yapmak için nesnenin menüsünde **Change time period**'a tıklayın ve ayarlamaları yapın.

Bu süreyi ayarlamak, nesneleri manuel ekleme ve silme ile birlikte, IP listelerinin zamanla değişmesine yol açar. Tüm listelerin [geçmiş durumlarını](#ip-list-history) görüntüleyebilirsiniz.

### Hedef Applications ile sınırlandırma {#limit-by-target-application}

Bir nesneyi listeye eklerken, varsayılan olarak listelenen IP'den gelen tüm istekler işlenir. Ancak bunu hedef [applications](../../user-guides/settings/applications.md) ile sınırlayabilirsiniz: bir veya birkaç application seçin ve yalnızca listelenen IP'den bu applications'a yönelik istekler işlenecektir.

## Kötü amaçlı IP beslemeleri {#malicious-ip-feeds}

**Malicious IPs** [source type](#select-object)'ını IP listelerinden birine eklerken, bunun herkese açık kaynaklarda belirtilen ve uzman analiziyle doğrulanmış, kötü amaçlı etkinlikle iyi bilinen tüm IP adreslerini içereceğini dikkate alın. Bu verileri aşağıdaki kaynakların bir kombinasyonundan çekiyoruz:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

## IP listesi geçmişi {#ip-list-history}

IP listelerinin yalnızca mevcut durumu değil, aynı zamanda [geçmişteki](#select-time-to-stay-in-list) durumları da vardır ve bunlar farklı olabilir. IP listesi içeriğini incelemek için belirli tarihleri seçin; sistem, ekleme zamanı ve yönteminin (manuel veya otomatik) ayrıntılı olarak yer aldığı bir **History** döndürecektir. Rapor ayrıca değişikliklerden sorumlu kişilere ve her eklemenin nedenlerine ilişkin verileri de sunar. Bu tür içgörüler, uyumluluk ve raporlama için bir denetim izi sağlamaya yardımcı olur.

![IP Listesi geçmişi](../../images/user-guides/ip-lists/ip-list-history.png)

Listenin mevcut durumunu almak için **Now** sekmesine geri dönerek, listede şu anda yer alan nesneleri görüntüleyebilirsiniz.

## Otomatik listeleme {#automatic-listing}

Wallarm'ın şüpheli trafik üreten IP adreslerini otomatik olarak denylist'e veya graylist'e almasını etkinleştirebilirsiniz. Bu, şu durumlar için yapılabilir:

* [API abuse prevention](../../api-abuse-prevention/overview.md)
* [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [Multi-attack protection](../../admin-en/configuration-guides/protecting-with-thresholds.md)

Şunu unutmayın: Otomatik olarak listeye alınmış bir IP'yi manuel olarak silerseniz, yeni kötü amaçlı etkinlik tespit edilirse tekrar otomatik olarak eklenecektir ancak:

* **Önceki sürenin** yarısından önce değil

    Örneğin, bir IP adresi üzerinden gelen bir BOLA saldırısı nedeniyle otomatik olarak 4 saatliğine denylist'e alındıysa ve siz onu denylist'ten silerseniz, saldırılar olsa bile sonraki 2 saat içinde tekrar eklenmez.

* **API Abuse Prevention** için - derhal

## Denylist'teki IP'lerden gelen istekler

Bir IP denylist'te olsa bile, ondan gelen sonraki istekler hakkında bilgi sahibi olmak iyidir. Bu, IP'nin davranışının hassas analizini yapmayı sağlar. Wallarm, denylist'teki kaynak IP'lerden engellenen isteklere ilişkin istatistikleri toplar ve gösterir.

!!! info "Özellik kullanılabilirliği"
    Özellik, NGINX tabanlı düğümler için düğüm sürüm 4.8'den itibaren mevcuttur. Bunu [wallarm_acl_export_enable](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) yönergesiyle kontrol edebilirsiniz.

Bu bilgiler şunlar için kullanılabilir:

* Manuel olarak denylist'e alınan IP'ler
* Şu mekanizmalar tarafından otomatik olarak denylist'e alınan IP'ler:

    * [API abuse prevention](../../api-abuse-prevention/overview.md)
    * [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
    * [Multi-attack protection](../../admin-en/configuration-guides/protecting-with-thresholds.md)

Listelenen davranışsal saldırılar yalnızca belirli istatistikler biriktirildikten sonra tespit edilebilir; gerekli miktar ilgili tetikleyici eşiklerine bağlıdır. Bu nedenle ilk aşamada, denylist'e alınmadan önce, Wallarm bu bilgiyi toplar ancak tüm istekler iletilir ve `Monitoring` durumuyla saldırılar olarak görüntülenir.

Tetikleyici eşikleri aşıldığında, Wallarm IP'yi denylist'e ekler ve sonraki istekleri engeller. Bu IP'den gelen `Blocked` istekleri Attacks listesinde görürsünüz. Bu, manuel olarak denylist'e alınan IP'ler için de geçerlidir.

![Denylist'teki IP'lerle ilgili olaylar - veri gönderimi etkin](../../images/user-guides/events/events-denylisted-export-enabled.png)

Denylist'teki IP'lerden gelen istekleri bulmak için [search tags of filters](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) kullanın: otomatik listelemeler için [API abuse related](../../attacks-vulns-list.md#api-abuse), `brute`, `dirbust`, `bola`, `multiple_payloads`, manuel olanlar için `blocked_source`.

Search/filters'ın, her saldırı türü için hem `Monitoring` durumundaki saldırıları hem de - bilgi gönderimi etkinse - `Blocked` durumundakileri göstereceğini unutmayın. Manuel olarak denylist'e alınan IP'ler için `Monitoring` durumunda bir saldırı hiç oluşmaz.

`Blocked` durumundaki saldırılar arasında, denylist'e alınma nedenine geçmek için etiketleri kullanın - BOLA ayarları, API Abuse Prevention, trigger veya denylist'teki ilgili kayıt.

## Denylist'e alınan IP'ler için bildirim alma

Her gün kullandığınız mesajlaşma veya SIEM sistemleri üzerinden yeni denylist'e alınan IP'ler hakkında bildirimler alabilirsiniz. Bildirimleri etkinleştirmek için, **Triggers** bölümünde **Denylisted IP** koşuluna sahip bir veya birkaç trigger yapılandırın, örneğin:

![Denylist'e alınan IP için tetikleyici örneği](../../images/user-guides/triggers/trigger-example4.png)

**Trigger'ı test etmek için:**

1. Wallarm Console → **Integrations** bölümüne [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) cloud'unda gidin ve [Slack ile entegrasyonu](../../user-guides/settings/integrations/slack.md) yapılandırın.
1. **Triggers** içinde, yukarıda gösterildiği gibi bir trigger oluşturun.
1. **IP Lists** → **Denylist**'e gidin ve `1.1.1.1` IP'sini "It is a malicious bot" nedeni ile ekleyin.
1. Slack kanalınızdaki şu gibi mesajları kontrol edin:
    ```
    [wallarm] Yeni bir IP adresi denylist'e alındı
    
    Notification type: ip_blocked

    IP address 1.1.1.1, "It is a malicious bot" nedeniyle 
    2024-01-19 15:02:16 +0300 tarihine kadar denylist'e alındı. Denylist'e alınan IP adreslerini
    Wallarm Console'un "IP lists → Denylist" bölümünde inceleyebilirsiniz.

    Bu bildirim "Notify about new denylisted IPs" trigger'ı tarafından tetiklendi.
    IP, application default için engellendi.

    Client: Your Company
    Cloud: EU
    ```

## Yük dengeleyiciler ve CDN'lerin arkasındaki düğümlerin IP listeleriyle çalışacak şekilde yapılandırılması

Wallarm düğümü bir yük dengeleyici veya CDN'in arkasında bulunuyorsa, son kullanıcı IP adreslerini doğru şekilde raporlamak için Wallarm düğümünüzü yapılandırdığınızdan emin olun:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP imajları ve Docker düğüm konteyneri dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için talimatlar](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## API üzerinden listeleri yönetme

Herhangi bir IP listesinin içeriğini alabilir, nesnelerle doldurabilir ve doğrudan [Wallarm API'yi arayarak](../../api/request-examples.md#api-calls-to-get-populate-and-delete-ip-list-objects) nesneleri listeden silebilirsiniz.