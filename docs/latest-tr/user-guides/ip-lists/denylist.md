# IP adresi engelleme listesi

**Engelleme listesi**, meşru istekler oluştursa bile uygulamalarınıza erişim izni olmayan IP adreslerinin listesidir. Herhangi bir [modda](../../admin-en/configure-wallarm-mode.md) filtreleme düğümü, engelleme listesindeki IP adreslerinden gelen tüm istekleri engeller (IP'ler [izin verilen liste](allowlist.md) içinde çoğaltılmazsa).

Wallarm Konsolunda → **IP listeleri** → **Engelleme listesi**, engellenmiş IP adreslerini aşağıdaki şekilde yönetebilirsiniz:

--8<-- "../include-tr/waf/features/ip-lists/common-actions-with-lists-overview.md"

![IP Engelleme listesi](../../images/user-guides/ip-lists/denylist-apps.png)

!!! info "Listenin eski adı"
    IP adresleri engelleme listesinin eski adı "IP adresi yasaklama listesi"dir.

## IP engelleme listesi kullanım örnekleri

* Birkaç ardışık saldırının kaynağı olan IP adreslerini engelleyin.

    Bir saldırı, bir IP adresinden kaynaklanan ve farklı türde kötü amaçlı yükler içeren birkaç isteği içerebilir. Bu tür saldırıları engelleme yöntemlerinden biri, istek kaynağını engellemektir. Kaynak IP engelleme eşiği ve uygun tepkiyi yapılandırarak otomatik kaynak IP engelleme oluşturabilirsiniz. Bunu [tetikleyici](../triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) içinde ayarlayabilirsiniz.
* Davranış temelli saldırıları engelleyin.

    Wallarm filtreleme düğümü, kötü amaçlı bir yük algılandığında en zararlı trafiği talep üzerine engelleyebilir. Ancak, her tek isteğin meşru olduğu davranışa dayalı saldırılarda, kaynaktan engelleme gerekebilir.

    Davranışsal saldırı kaynaklarının otomatik engellenmesi, varsayılan olarak devre dışıdır. [Kaba kuvvet saldırılarına karşı koruma yapılandırma talimatları →](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-steps)

## Bir nesneyi listeye ekleme

**Şüpheli bir trafik ürettikleri takdirde IP adreslerini otomatik olarak engelleme listesine almasını** Wallarm'a sağlayabilir veya nesneleri **manüel olarak** engelleme listesine ekleyebilirsiniz.

!!! info "Bir IP adresini çok kiracılı bir düğümdeki listeye ekleme"
    [Çok kiracılı düğüm](../../installation/multi-tenant/overview.md) kurduysanız, lütfen önce bir kiracının [hesabına](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) geçiniz ve IP adresini bir listeye ekleyiniz.

### Otomatik engelleme listesi doldurma (önerilir)

[Tetikleyiciler](../../user-guides/triggers/triggers.md) işlevi, aşağıdaki koşullara göre IP'lerin otomatik engelleme listesini sağlar:

* [`Kaba Kuvvet`, `Zorlanmış Tarama`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md) türündeki kötü amaçlı istekler.
* Bir IP tarafından üretilen `kötü niyetli yük sayısı`.

Belirtilen etkinliklere `IP adresini engelleme listesine alma` tepki olarak tetikleyicilere sahip olanlar, belirtilen bir zaman aralığı için IP'leri otomatik olarak engelleme listesine alır. Tetikleyicileri Wallarm Konsolunda → **Tetikleyiciler** bölümünde yapılandırabilirsiniz.

### Manuel engelleme listesi oluşturma

Bir IP adresini, alt ağı veya IP adreslerinin bir grubunu listeye eklemek için:

1. Wallarm Konsolunu → **IP listeleri** → **Engelleme listesi** açın ve **Nesne ekle** düğmesini tıklayın.
2. Açılan listeden, yeni nesnenin ekleneceği listeyi seçin.
3. Aşağıdaki yollardan biriyle bir IP adresi veya IP adreslerinin bir grubunu belirtin:

    * Tek bir **IP adresi** veya **alt ağ** girin

        !!! info "Desteklenen alt ağ maskeleri"
            Desteklenen maksimum alt ağ maskesi IPv6 adresleri için `/32` ve IPv4 adresleri için `/12` 'dir.
    
    * Tüm IP adreslerini eklemek için bir **ülke** veya **bölge** (coğrafi konum) seçin
    * Bu tipe ait olan tüm IP adreslerini eklemek için **kaynak türü** seçin, örneğin:
        * **Tor** için Tor ağının IP adresleri
        * **Proxy** için umumi ya da web proxy sunucularının IP adresleri
        * **Arama Motoru Örümcekleri** için arama motoru örümceklerinin IP adresleri
        * **VPN** için sanal özel ağların IP adresleri
        * **AWS** için Amazon AWS'ye kayıtlı IP adresleri
        * **Kötü Amaçlı IPler** için kötü niyetli etkinliğiyle tanınan IP adreslerini ekleme, bu, halka açık kaynaklarca belirtilen ve uzman analizi tarafından doğrulanan bu verileri. Bu verileri aşağıdaki kaynakların bir kombinasyonundan alıyoruz:
        
            * [Topluca Ağ Güvenliği Zekası](http://cinsscore.com/list/ci-badguys.txt)
            * [Proofpoint Ortaya Çıkan Tehditler Kuralları](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
            * [DigitalSide Tehdit-Intel Havuzu](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
            * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
            * [www.blocklist.de](https://www.blocklist.de/en/export.html)
            * [NGINX nihai güçlüközleyici tıpasmaşonu](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
            * [IPsum](https://github.com/stamparm/ipsum)

4. Belirtilen IP adreslerine izin verilen veya kısıtlanan uygulamaları seçin.
5. Bir IP adresini veya IP adreslerinin bir grubunun ne kadar süreyle listeye eklenmesi gerektiğini seçin. Minimum değer 5 dakikadır, maksimum değer süresizdir.
6. Bir IP adresini veya IP adreslerinin bir grubunun listeye eklenme nedenini belirtin.

![IP listeye ekleme (uygulama dahil)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### Otomatik botların IP'lerinin engelleme listesine alması

--8<-- "../include-tr/waf/features/ip-lists/autopopulation-by-antibot.md"

## Engelleme listesine alınan IP'ler hakkında bildirim alın

Engelleme listesine alınan yeni IP'ler hakkında her gün kullandığınız mesajlaşma veya SIEM sistemleri aracılığıyla bilgilendirme alabilirsiniz. Bu bilgilendirmeyi etkinleştirmek için uygun [tetikleyici](../triggers/triggers.md)yi yapılandırın, örneğin:

![Engelleme listesine alınan IP için tetikleyici örneği](../../images/user-guides/triggers/trigger-example4.png)

--8<-- "../include-tr/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
