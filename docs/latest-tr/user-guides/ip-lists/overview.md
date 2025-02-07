# IP ile Filtreleme

Wallarm Console'un **IP lists** bölümünde, IP adreslerini, coğrafi konumları, veri merkezlerini veya kaynak türlerini allowlist, denylist ve graylist uygulayarak uygulamalarınıza erişimi kontrol edebilirsiniz.

* **Allowlist**; hiçbir kontrolden geçmeden Wallarm korumasını atlayarak uygulamalarınıza erişim sağlayan güvenilir kaynakların listesidir.
* **Denylist**; uygulamalarınıza erişim sağlayamayan kaynakların listesidir – bu kaynaklardan gelen tüm istekler engellenecektir.
* **Graylist**; yalnızca **safe blocking** [filtration mode](../../admin-en/configure-wallarm-mode.md) kapsamında işlenen şüpheli kaynakların listesidir: graylisted IP kötü niyetli istekler gönderirse, düğüm bunları engellerken meşru isteklerin geçmesine izin verir.

    Graylisted IP'lerden gelen kötü niyetli istekler, şu saldırıların izlerini içerir:

    * [Input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
    * [Attacks of the vpatch type](../rules/vpatch-rule.md)
    * [Attacks detected based on regular expressions](../rules/regex-rule.md)

![All IP lists](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## Allowlist, Denylist ve Graylist'in Birlikte Çalışması

Filtreleme düğümü, IP listelerini analiz ederken seçilen [mode](../../admin-en/configure-wallarm-mode.md) temelinde farklı yaklaşımlar kullanır. Bazı modlarda allowlist, denylist ve graylist yani üç tip IP listeleri değerlendirilirken, diğer modlarda yalnızca belirli IP listelerine odaklanılır.

Aşağıdaki görsel, her çalışma modunda IP listelerinin kombinasyonlarını ve öncelik sıralamasını göstermekte; hangi listelerin her durumda dikkate alındığını vurgulamaktadır:

![IP list priorities](../../images/user-guides/ip-lists/ip-lists-priorities.png)

Bu demektir ki:

* Herhangi bir modda, IP daha önceki listede bulunursa sonraki liste dikkate alınmaz.
* Graylist yalnızca `Safe blocking` modunda değerlendirilir.

!!! warning "İstisnalar"
    Eğer [`wallarm_acl_access_phase off`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) ayarlanmışsa, Wallarm düğümü `Monitoring` modunda denylist'teki IP'lerden gelen istekleri engellemez.

## IP Listelerinin Yapılandırılması

Adımlar:

1. Amacınıza bağlı olarak hangi listeyi kullanacağınıza karar verin.
1. [Eklenecek nesneyi seçin](#select-object): IP, alt ağ, konum, kaynak türü.
1. Nesnenin listede kalacağı [süreyı seçin](#select-time-to-stay-in-list) (genellikle sonsuza dek değil).
1. [Hedef uygulamaya göre sınırlandırma yapın](#limit-by-target-application) (tüm istekler değil, yalnızca belirli uygulamayı hedef alanlar).

### Select object

Herhangi bir IP listesine aşağıdakileri eklemek için **Add object** seçeneğini kullanın:

* **IP veya alt ağ** – desteklenen maksimum alt ağ maskesi, IPv6 adresleri için `/32` ve IPv4 adresleri için `/12`'dir.

* Bu ülke veya bölgedeki tüm IP adreslerini eklemek için **Location** (ülke veya bölge)
* Bu türe ait tüm IP adreslerini eklemek için **Source type**. Mevcut türler:

    * Search Engines
    * Datacenters (AWS, GCP, Oracle, etc.)
    * Anonymous sources (Tor, Proxy, VPN)
    * [Malicious IPs](#malicious-ip-feeds)

![Add object to IP list](../../images/user-guides/ip-lists/add-ip-to-list.png)

!!! info "IP Listelerinin Otomatik Doldurulması"
    Nesneleri manuel olarak eklemenin yanı sıra, **tercih edilen** olan [automatic list population](#automatic-listing) özelliğini de kullanabilirsiniz.

### Listede Kalma Süresini Seçin

Bir nesneyi listeye eklerken, eklenme süresini belirtirsiniz. Minimum süre 5 dakika, varsayılan süre 1 saat ve maksimum süre sonsuza dek olabilir. Süresi dolduğunda nesne otomatik olarak listeden silinir.

Belirtilen süre, herhangi bir zamanda değiştirilebilir – nesnenin menüsünde **Change time period** seçeneğine tıklayarak ayarlamaları yapabilirsiniz.

Manuel nesne ekleme ve silme işlemleriyle birlikte bu sürenin ayarlanması, zaman içinde IP listelerinde değişikliklere neden olur. Tüm listelerin [geçmiş durumlarını](#ip-list-history) görüntüleyebilirsiniz.

### Hedef Uygulamaya Göre Sınırlandırma

Bir nesneyi listeye eklediğinizde, varsayılan olarak listelenen IP'den gelen tüm istekler işlenir. Ancak, bunu sadece belirli [applications](../../user-guides/settings/applications.md) için sınırlayabilirsiniz: bir veya birkaç uygulama seçin; böylece listelenen IP'den gelen istekler yalnızca o uygulamalara özgü işlenir.

## Malicious IP Feeds

**Malicious IPs** [source type](#select-object)'ını herhangi bir IP listesine eklediğinizde, bu seçenek kötü niyetli faaliyetleri nedeniyle bilinen, kamu kaynaklarında yer alan ve uzman analizleriyle doğrulanmış tüm IP adreslerini içerir. Bu veriler, aşağıdaki kaynakların kombinasyonundan çekilmektedir:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

## IP Listesi Geçmişi

IP listeleri yalnızca mevcut durumu değil, geçmişteki durumları da içerir ve farklılık gösterir. Belirli tarihleri seçerek IP listelerinin içeriğini inceleyebilir, sistemin ekleme işleminin (manuel veya otomatik) tam zamanlaması ile ilgili ayrıntılı bir **History** raporu görüntüleyebilirsiniz. Rapor ayrıca değişikliklerden sorumlu kişilere ve her eklemenin nedenine dair veriler sunar. Bu tür bilgiler, uyumluluk ve raporlama için bir denetim izi oluşturulmasına yardımcı olur.

![IP List history](../../images/user-guides/ip-lists/ip-list-history.png)

Listede yer alan güncel nesneleri görmek için **Now** sekmesine geçebilirsiniz.

## Automatic listing

Wallarm, şüpheli trafik üreten IP adreslerini otomatik olarak denylist veya graylist'e ekleyecek şekilde yapılandırılabilir. Bu, şu durumlar için yapılabilir:

* [API abuse prevention](../../api-abuse-prevention/overview.md)
* [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [Multi-attack protection](../../admin-en/configuration-guides/protecting-with-thresholds.md)

Manuel olarak otomatik listeye eklenen bir IP'yi sildiğinizde, yeni kötü niyetli aktivite tespit edilirse otomatik olarak tekrar ekleneceğini unutmayın; ancak:

* **Önceki süre**nin yarısından **önce** eklenmeyecektir.

    Örneğin, bir IP adresi BOLA saldırısı nedeniyle otomatik olarak denylist'e 4 saat eklendiyse ve siz denylist'ten sildiyseniz, sonraki 2 saat boyunca, saldırı gerçekleşse bile otomatik olarak eklenmeyecektir.

* **API Abuse Prevention** için – anında

## Denylist'e Alınan IP'lerden Gelen İstekler

IP denylist'te olsa bile, bu IP'den gelen sonraki istekler hakkında bilgi sahibi olmak faydalıdır. Bu, IP'nin davranışlarının ayrıntılı analizini yapmanıza olanak tanır. Wallarm, denylist'teki kaynak IP'lerden gelen engellenmiş isteklerle ilgili istatistikleri toplayıp gösterir.

!!! info "Özelliğin Kullanılabilirliği"
    Bu özellik, NGINX tabanlı düğümler için node version 4.8'den itibaren kullanılabilir. Bunu [wallarm_acl_export_enable](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) yönergesiyle kontrol edebilirsiniz.

Bu bilgiler aşağıdakiler için mevcuttur:

* Manuel olarak denylist'e eklenen IP'ler
* Otomatik olarak denylist'e eklenen IP'ler:
    * [API abuse prevention](../../api-abuse-prevention/overview.md)
    * [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
    * [Multi-attack protection](../../admin-en/configuration-guides/protecting-with-thresholds.md)

Belirtilen davranışsal saldırılar, ilgili tetikleyici eşik değerlerine bağlı olarak belirli bir istatistik miktarı toplandıktan sonra tespit edilebilir. Bu nedenle, denylist'e eklemeden önce ilk aşamada Wallarm bu bilgileri toplar; ancak, tüm istekler `Monitoring` statüsünde geçer ve görüntülenir.

Eşik değerler aşıldığında, Wallarm IP'yi denylist'e ekler ve sonraki istekleri engeller. Bu IP'ye ait istekleri saldırı listesinde `Blocked` olarak görebilirsiniz. Bu durum, manuel olarak denylist'e eklenen IP'ler için de geçerlidir.

![Events related to denylisted IPs - sending data enabled](../../images/user-guides/events/events-denylisted-export-enabled.png)

Denylist'e eklenen IP'lerden gelen istekleri bulmak için [search tags of filters](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) kullanın: [API abuse related](../../attacks-vulns-list.md#api-abuse), `brute`, `dirbust`, `bola`, `multiple_payloads` (otomatik olarak eklenenler için), `blocked_source` (manuel olarak eklenenler için).

Not: Arama/filtreler, hem `Monitoring` statüsündeki saldırıları hem de – eğer veri gönderimi etkinse – her saldırı türü için `Blocked` statüsündeki saldırıları görüntüler. Manuel olarak denylist'e eklenen IP'ler için hiçbir zaman `Monitoring` statüsünde saldırı görülmez.

`Blocked` statüsündeki saldırılar arasında, denylist'e alınmanın nedenine dair BOLA ayarları, API Abuse Prevention, tetikleyici veya denylist kaydı oluşturan nedenleri görmek için etiketleri kullanın.

## Denylist'e Alınan IP'lerle İlgili Bildirimler Alma

Günlük olarak kullandığınız mesajlaşma uygulamaları veya SIEM sistemleri aracılığıyla yeni denylist'e eklenen IP'ler hakkında bildirim alabilirsiniz. Bildirimleri etkinleştirmek için, **Triggers** bölümünde, **Denylisted IP** koşuluna sahip bir veya birkaç tetikleyici yapılandırın, örneğin:

![Example of trigger for denylisted IP](../../images/user-guides/triggers/trigger-example4.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → **Integrations** bölümüne gidin ve [integration with Slack](../../user-guides/settings/integrations/slack.md) yapılandırın.
1. **Triggers** bölümünde, yukarıda gösterildiği gibi bir tetikleyici oluşturun.
1. **IP Lists** → **Denylist** bölümüne gidip, `1.1.1.1` IP adresini "It is a malicious bot" nedeni ile ekleyin.
1. Slack kanalınızdaki mesajları kontrol edin:
    ```
    [wallarm] New IP address has been denylisted
    
    Notification type: ip_blocked

    IP address 1.1.1.1 has been denylisted until 2024-01-19 15:02:16 +0300 
    for the reason "It is a malicious bot". You can review denylisted IP addresses
    in the "IP lists → Denylist" section of Wallarm Console.

    This notification was triggered by the "Notify about new denylisted IPs" trigger.
    The IP is blocked for the application default.

    Client: Your Company
    Cloud: EU
    ```

## Yük Dengeleyiciler ve CDN'lerin Arkasında Bulunan Düğümlerin IP Listeleri ile Çalışması

Eğer Wallarm düğümünüz bir yük dengeleyici veya CDN'in arkasında yer alıyorsa, son kullanıcı IP adreslerinin doğru raporlanabilmesi için Wallarm düğümünüzü yapılandırdığınızdan emin olun:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP görüntüleri ve Docker düğüm konteyneri dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılmış filtreleme düğümleri için talimatlar](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## API ile Listelerin Yönetilmesi

Wallarm API'yi doğrudan [çağırarak](../../api/request-examples.md#api-calls-to-get-populate-and-delete-ip-list-objects) herhangi bir IP listesinin içeriğini alabilir, nesneler ekleyebilir ve nesneleri silebilirsiniz.