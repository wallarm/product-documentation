# IP adresi izin listesi

**Allowlist** talepleri saldırı belirtileri içeren IP adreslerden geldiği taktirde bile uygulamalarınıza erişimine izin verilen güvendiğiniz IP adreslerinin listesidir. Allowlist diğer listeler arasında en yüksek önceliğe sahip olduğu için, herhangi bir [filtreleme modu](../../admin-en/configure-wallarm-mode.md)'ndaki filtreleme düğümü izin listesine eklenmiş IP adreslerinden gelen istekleri engellemeyecektir.

Wallarm Konsolu → **IP listeleri** → **Allowlist** bölümünden, izin verilen IP adreslerini aşağıdaki şekillerde yönetebilirsiniz:

--8<-- "../include-tr/waf/features/ip-lists/common-actions-with-lists-overview.md"

![IP izin listesi](../../images/user-guides/ip-lists/allowlist-apps.png)

!!! info "Listenin eski adı"
   IP adresi izin listesinin eski adı "IP adresi beyaz listesi".

## IP izin listesinin kullanım örnekleri

Eğer diğer güvendiğiniz araçları kullanıyorsanız ve bu araçlar potansiyel olarak zararlı istekleri başlatıyorsa, bu araçların kaynak IP'lerini manuel olarak izin listesine eklemeniz gerekmektedir.

## Bir nesneyi listeye ekleme

!!! info "Çok kiracılı düğümde bir IP adresini listeye ekleme"
    Eğer [çok kiracılı düğüm](../../installation/multi-tenant/overview.md) kurduysanız, lütfen öncelikle IP adresinin listeye eklendiği [kiracı hesabına](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) geçin.

Listeye bir IP adresi, alt ağ ya da IP adresi grubu eklemek için:

1. Wallarm Konsolu → **IP listeleri** → **Allowlist**'i açın ve **Nesne ekle** düğmesine tıklayın.
1. Açılır menüden, yeni nesneyi eklemek istediğiniz listeyi seçin.
2. Aşağıdaki yolların birinde bir IP adresi veya IP adresi grubunu belirtin:

    * Tek bir **IP adresi** veya bir **alt ağ** girişi yapın

        !!! info "Desteklenen alt ağ maskeleri"
            Desteklenen maksimum alt ağ maskesi `/32` IPv6 adresleri ve `/12` IPv4 adresleri için.
    
    * Bu ülke veya bölgede kayıtlı tüm IP adreslerini eklemek için bir **ülke** veya **bölge** (coğrafi konum) seçin
    * Bu tipe ait tüm IP adreslerini eklemek için **kaynak tipi**'ni seçin, ör.:
        * Tor ağındaki IP adresleri için **Tor** 
        * Kamu ya da web vekil sunucularının IP adresleri için **Proxy**
        * Arama motoru örümceklerinin IP adresleri için **Search Engine Spiders**
        * Sanal özel ağların IP adresleri için **VPN**
        * Amazon AWS'de kayıtlı IP adresleri için **AWS**
        * Halka açık kaynaklarda belirtilen ve uzman analizlerle doğrulanmış kötü niyetli aktivite için bilinen IP adresleri için **Kötü Amaçlı IP'ler**. Bu bilgileri aşağıdaki kaynakların birleşiminden alıyoruz:
        
            * [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
            * [Proofpoint Gelişen Tehditler Kuralları](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
            * [DigitalSide Tehdit İstihbarat Deposu](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
            * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
            * [www.blocklist.de](https://www.blocklist.de/en/export.html)
            * [NGINX son derece kötü bot engelleyici](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
            * [IPsum](https://github.com/stamparm/ipsum)

3. Belirtilen IP adreslerine erişimi sağlama veya kısıtlama uygulamalarını seçin.
4. Bir IP adresini veya bir IP adresi grubunu listeye eklemek için süreyi belirleyin. Minimum değer 5 dakika, maksimum değer süresiz.
5. Bir IP adresi veya bir IP adresi grubunu listeye eklemek için sebebini belirtin.

![Listeye IP ekle (uygulama ile)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

--8<-- "../include-tr/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"