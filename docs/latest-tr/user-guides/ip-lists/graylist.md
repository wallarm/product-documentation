[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

# IP adresinin gri listesi

**Graylist**, şüpheli IP adreslerinin **güvenli engelleyici** [filtrasyon modu](../../admin-en/configure-wallarm-mode.md)nda düğüm tarafından işleme alınan bir liste olup, özellikle, gri listeye alınmış IP'nin zararlı istekleri başlatması durumunda bu istekleri engellerken geçerli isteklere izin verir.

Gri listeye alınan IP'lerden kaynaklanan zararlı istekler aşağıdaki saldırı belirtilerini içerir:

* [Girdi doğrulama saldırıları](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
* [Tipine göre vpatch saldırıları](../rules/vpatch-rule.md)
* [Düzenli ifadelere dayalı olarak tespit edilen saldırılar](../rules/regex-rule.md)

Gri liste ile karşılaştırıldığında, [red listesi](../ip-lists/denylist.md) uygulamalarınıza hiçbir şekilde ulaşması izin verilmeyen IP adreslerini belirtir - düğüm, red listedeki kaynaklardan gelen bile geçerli trafiği engeller. IP gri listelemesi, [yanlış pozitiflerin](../../about-wallarm/protecting-against-attacks.md#false-positives) azaltılmasını hedefleyen seçeneklerden biridir.

Filtreleme düğümünün davranışı, gri listeye alınan IP adresleri aynı zamanda beyaz listeye de alındıysa farklılık gösterebilir, [listelerin öncelikleri hakkında daha fazla bilgi](overview.md#algorithm-of-ip-lists-processing) için tıklayınız.

Wallarm Konsolu → **IP listeleri** → **Graylist** kısmından, gri listeye alınan IP adreslerini aşağıdaki şekillerde yönetebilirsiniz:

--8<-- "../include-tr/waf/features/ip-lists/common-actions-with-lists-overview.md"

![IP graylist](../../images/user-guides/ip-lists/graylist.png)

!!! bilgi "Listenin eski adı"
    IP adresinin gri listesinin eski adı "IP adresleri gri listesi"dir.

## IP gri listesi kullanım örnekleri

* Arka arkaya birkaç saldırı başlatan IP adreslerini gri listeye alınız.

    Bir saldırı, bir IP adresinden farklı türlerdeki zararlı yükleri içeren birkaç isteği içerebilir. Zararlı isteklerin çoğunu engelleyip bu IP adresinden kaynaklanan geçerli isteklere izin vermek için bir metot, bu IP'yi gri listeye alınmasıdır. Kaynak IP'nin gri listeye alınmasından önceki eşik değerini ve uygun tepkiyi [tetikleyici](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) ile Ayarlayabilirsiniz.

    Kaynak IP'nin gri listeye alınması [yanlış pozitiflerin](../../about-wallarm/protecting-against-attacks.md#false-positives) sayısını önemli ölçüde azaltabilir.
* Genellikle zararlı trafik üreten IP adreslerini, ülkeleri, bölgeleri, veri merkezlerini, ağları (örneğin, Tor) gri listeye alınız. Wallarm düğümü, gri listelere alınan nesneler tarafından üretilen geçerli isteklere izin verip zararlı istekleri engeller.

## Bir nesneyi listeye ekleme

Hem Wallarm'ın, **şüpheli bir trafik çıkardıkları takdirde** IP adreslerini **otomatik olarak** gri listeye almasını etkinleştirebilirsiniz hem de nesneleri **manuel olarak** gri listeye alabilirsiniz.

!!! bilgi "Çok başlıklı düğümdeki bir IP adresinin listeye eklenmesi"
    Eğer [çok kiracılı düğümü](../../installation/multi-tenant/overview.md) kurduysanız, lütfen öncelikle IP adresinin listeye ekleneceği [kiracı hesabına](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) geçin.

    Otomatik IP gri listelemek için tetikleyiciler de kiracı seviyelerinde yapılandırılmalıdır.

### Otomatik gri liste oluşturma (önerilir)

[Tetikleyiciler](../../user-guides/triggers/triggers.md) işlevi, aşağıdaki koşullarla IP'lerin otomatik gri listelemesini sağlar:

* Aşağıdaki türlerde zararlı istekler: [`Kaba kuvvet`,` Forcing browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md).
* Bir IP tarafından üretilen `Zararlı yüklerin sayısı`.
* Yeni şirket hesapları, IP'nin 1 saat içinde 3'ten fazla farklı zararlı yük ürettiğinde IP'yi gri listeye alan [ön yapılandırılmış (varsayılan) tetikleyici](../../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers) ile özellendirilmiştir.

`IP adresini gri listeye al` tepkisine sahip tetikleyiciler, belirtilen olaylara belirtilen zaman çerçevesi için otomatik olarak IP'leri gri listeye alır. Tetikleyicileri Wallarm Konsolu → **Tetikleyiciler** kısmından yapılandırabilirsiniz.

### Manuel gri liste oluşturma

Manuel olarak bir IP adresini, alt ağı veya IP adreslerinin grubunu listeye eklemek için:

1. Wallarm Konsolu → **IP listeleri** → **Graylist**'i açın ve **Nesne Ekle**'ye tıklayın.
2. Aşağıdaki yollardan birinde bir IP adresi veya adresler grubunu belirtin:

    * Tek bir **IP adresi** veya bir **alt ağ** girin

        !!! bilgi "Desteklenen alt ağ maskeleri"
            Desteklenen maksimum alt ağ maskesi IPv6 adresleri için `/32`, IPv4 adresleri için `/12`dir.
    
    * Tüm IP adreslerinin bu ülkede veya bölgede kayıtlı olduğu bir **ülke** veya bir **bölge** (coğrafi konum) seçin
    * Bu türde bulunan tüm IP adreslerini eklemek için **kaynak tipi**'ni seçin, örneğin:
        * **Tor** Tor ağının IP adresleri için
        * **Proxy** Kamu ya da web proxy sunucularının IP adresleri için
        * **Search Engine Spiders** Arama motoru örümceklerinin IP adresleri için
        * **VPN** Sanal özel ağların IP adresleri için
        * **AWS** Amazon AWS'de kayıtlı IP adresleri için
        * **Malicious IPs** Zararlı aktiviteler için iyi bilinen IP adresleri için, kamu kaynakları tarafından belirtilmiştir ve uzman analizi tarafından doğrulanmıştır. Bu verileri aşağıdaki kaynakların birleşiminden toplarız:

            * [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
            * [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
            * [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
            * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
            * [www.blocklist.de](https://www.blocklist.de/en/export.html)
            * [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
            * [IPsum](https://github.com/stamparm/ipsum)

3. Belirtilen IP adresleri için erişime izin verdiğiniz veya sınırladığınız uygulamaları seçin.
4. Bir IP adresinin veya bir IP adresler grubunun listeye hangi süre boyunca eklenmesi gerektiğini seçin. Minimum değer 5 dakika, maksimum değer sonsuzluğa kadar olan bir süredir.
5. Bir IP adresini veya bir IP adresler grubunun listeye eklenme nedenini belirtin.

![Listeye IP ekleme (uygulama ile birlikte)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### Otomatik botların IP'lerinin gri listeye alınması

--8<-- "../include-tr/waf/features/ip-lists/autopopulation-by-antibot.md"

--8<-- "../include-tr/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
