# Wallarm On-Premise Deployment

Wallarm, partnerlar, büyük işletmeler ve kapsamlı bir on-premise güvenlik sistemi arayan her türlü organizasyon için tasarlanmış bir on-premise çözümü sunar. Bu teklif, Wallarm'ın güvenlik altyapısının doğrudan kendi ortamlarınıza entegre edilmesine olanak tanır. Bu makale, bu teklife nasıl erişileceği ve kullanılacağı hakkında bilgi sunar.

!!! info "Herhangi bir soru için iletişime geçin"
    Lütfen on-premise dağıtımla ilgili sorularınız veya talepleriniz için [Wallarm's sales team](mailto:sales@wallarm.com) ile iletişime geçin.

Wallarm mimarisi, [iki ana bileşen etrafında](../about-wallarm/overview.md#how-wallarm-works) inşa edilmiştir:

* Filtering node: İhtiyaçlarınıza uygun esnek dağıtım seçenekleri sunan, altyapınız içerisinde dağıtılan bileşen.
* Wallarm Cloud: Geleneksel olarak Wallarm tarafından dışarıda barındırılan bileşen. On-premise dağıtım modelinde, Wallarm Cloud'un kendi altyapınız içerisinde dağıtılmasını sağlayan bir yöntem sunuyoruz. Bu yaklaşım, hizmet dağıtımının kapsamlı doğası nedeniyle tüm altyapının organize edilmesini gerektirir. Tüm gerekli servisleri otomatik olarak başlatan bir script sağlayarak bu süreci basitleştiriyoruz.

![On-premise deployment](../images/waf-installation/on-premise.png)

## Deploying Wallarm Cloud on-premise

On-premise dağıtım için, Wallarm Cloud'u kendi altyapınızda dağıtmanız gerekmektedir. Wallarm, backend ve frontend bileşenleri (Wallarm Console UI) dahil olmak üzere tüm gerekli Cloud servislerini birkaç adımda dağıtan bir script sağlayarak bu süreci basitleştirir.

### Requirements

Wallarm Cloud'u on-premise dağıtmak için, aşağıdaki kriterlere uygun bir compute instance hazırlamanız gerekir.

**Operating system**

* Ubuntu LTS 18.04, 20.04, 22.04
* Debian 11.x, 12.x
* Red Hat Enterprise Linux 8.x

**System requirements**

* Sunucu, bağımsız bir birim olarak tahsis edilmelidir. Ayrılmış güç kaynağı tahsis edilmesi tavsiye edilir.
* Kurulum, güncellemeler ve hata ayıklama için `root` yetkileri gereklidir.

Minimal kaynak gereksinimleri:

* 16+ çekirdek
* 48 GB+ bellek
* 300 GB SSD root depolama (HDD'ler yavaş performanstaki sebepten yetersizdir; NVMe kabul edilebilir ancak gerekmemektedir). Sunucu yapılandırmasının, root dizinine (ve isteğe bağlı olarak /boot dizinine) yalnızca varsayılan işletim sistemi mount noktalarını içerdiğinden emin olun. Ek disk hacimleri veya depolama bölümleri oluşturulmamalıdır.
* Ayda 100 milyon istek için 1 yıllık veri depolaması amacıyla ek 100 GB depolama

Ayda 1 milyardan fazla istek için önerilen kaynak gereksinimleri:

* 32+ çekirdek
* 80 GB+ bellek (120 GB önerilir)
* 500 GB SSD root depolama (HDD'ler yavaş performanstaki sebepten yetersizdir; NVMe kabul edilebilir ancak gerekmemektedir). Sunucu yapılandırmasının, root dizinine (ve isteğe bağlı olarak /boot dizinine) yalnızca varsayılan işletim sistemi mount noktalarını içerdiğinden emin olun. Ek disk hacimleri veya depolama bölümleri oluşturulmamalıdır.
* Ayda 100 milyon istek için 1 yıllık veri depolaması amacıyla ek 100 GB depolama

<a name="network_reqs_cloud"></a>**Network requirements**

* Lisans anahtarını ve kurulum/güncelleme paketlerini indirmek için 80 ve 443 portlarıyla `https://onprem.wallarm.com` ve `https://meganode.wallarm.com` adreslerine izin verilen çıkış bağlantıları. Bu domain, statik bir IP adresinden çalışır ve DNS'in de onu çözmesi gerekmektedir.
* Instance için 3-5 seviye DNS wildcard kaydı yapılandırılmalıdır (örneğin, `*.wallarm.companyname.tld`).

    Instance'ın bu DNS kayıtları üzerinden Wallarm filtering node'larına ve gerekli istemcilere erişilebilir olduğundan emin olun. Erişim, güvenlik gereksinimlerinize bağlı olarak VPN üzerinden kısıtlanabilir veya dış erişime açık bırakılabilir.

    ??? info "Alternatif domain adları"
        Eğer joker kart (wildcard) Common Name (CN) mümkün değilse, aşağıdaki bireysel domain adlarını yapılandırın:

        * `wallarm.companyname.tld`
        * `my.wallarm.companyname.tld`
        * `api.wallarm.companyname.tld`
        * `sso.wallarm.companyname.tld `
        * `ldap.wallarm.companyname.tld`
        * `console.wallarm.companyname.tld`
        * `ui.wallarm.companyname.tld`
        * `ql.wallarm.companyname.tld`
        * `minio.wallarm.companyname.tld`
        * `minio-ui.wallarm.companyname.tld`
        * `prometheus.wallarm.companyname.tld`
        * `alertmanager.wallarm.companyname.tld`
        * `grafana.wallarm.companyname.tld`
* Güvenilir veya dahili bir CA tarafından verilen geçerli bir SSL/TLS wildcard sertifikası (ve anahtarı). Tüm filtering node instance'ları ve tarayıcıların bu SSL/TLS sertifika/anahtar çiftini güvenilir olarak tanıması gerekmektedir.

**Software dependencies**

Sadece gerekli yazılımları içeren temiz bir işletim sistemi kurulumu ile başlayın. Dağıtım süreci, sonrasında (containerd, Kubernetes vb. dahil) ek paketler kuracaktır. Aşağıdaki koşulların sağlandığından emin olun:

* SSHd servisi TCP port 22 üzerinde çalışır durumda olmalı ve SSH anahtar doğrulaması etkinleştirilmiş olmalıdır.
* Aşağıdaki paketler önceden kurulmuş olmalıdır (bunlar çoğu sistemde varsayılan olarak gelir):

    * `iproute`
    * `iptables`
    * `bash`
    * `curl`
    * `ca-certificates`

    === "Debian-based OS"
        ```
        apt-get install iproute2 iptables bash curl ca-certificates
        ```
    === "Red Hat-based OS"
        ```
        yum install iproute iptables bash curl ca-certificates
        ```
* SELinux tamamen devre dışı bırakılmış olmalıdır; performans açısından permissive mod yetersizdir.
* Herhangi bir güvenlik duvarı (ör. `firewalld`, `ufw`) ağ kısıtlamalarını önlemek amacıyla tamamen devre dışı bırakılmalıdır.
* SWAP belleği devre dışı bırakılmalıdır.

    ```
    swapon -s
    ```

### Procedure

Hazır compute instance üzerinde Wallarm Cloud'u on-premise dağıtmak için:

1. Cloud servislerinin dağıtım script'ini, ilgili talimatları ve ilk kimlik bilgilerini elde etmek için [sales team](mailto:sales@wallarm.com?subject=Wallarm%20on-premise%20deployment&body=Dear%20Wallarm%20Sales%20Team%2C%0A%0AI%20am%20writing%20to%20express%20my%20interest%20in%20deploying%20the%20Wallarm%20platform%20on-premise.%20Could%20you%20please%20provide%20me%20with%20the%20necessary%20scripts%20for%20deployment%2C%20detailed%20information%20on%20the%20appropriate%20subscription%20plans%2C%20and%20comprehensive%20instructions%3F) ile iletişime geçin.
1. Yukarıda belirtilen gereksinimlere uygun olarak sanal (veya fiziksel) bir makine hazırlayın.
1. Kurulum paketini hazırlanan instance'a yükleyin ve çözüm bileşenlerini dağıtmak için çalıştırın.
1. Instance'ın IP adresine işaret eden bir DNS wildcard kaydı yapılandırın (örneğin, `*.wallarm.companyname.tld`).

    `my.wallarm.companyname.tld`, `api.wallarm.companyname.tld` ve [gereken diğer bireysel domain adlarının](#network_reqs_cloud) bu IP adresine çözüldüğünden emin olun.
1. Kurulum paketiyle birlikte sağlanan ilk yapılandırma kılavuzunu takip edin.
1. Yapılandırma tamamlandığında, `https://my.wallarm.companyname.tld` (veya yapılandırdığınız ilgili domain kaydı) adresine erişin ve kurulum paketinde sağlanan ilk kimlik bilgileriyle giriş yapmayı deneyin.

Artık, on-premise UI üzerinden, barındırılan Cloud versiyonu gibi, Wallarm platformunu yapılandırabilirsiniz, örneğin:

* [Node dağıtımı için token oluşturma](../user-guides/settings/api-tokens.md)
* [Saldırı ve isabetleri gözden geçirme](../user-guides/events/check-attack.md)
* [Trafik filtreleme kurallarını değiştirme](../user-guides/rules/rules.md)
* [API Discovery](../api-discovery/overview.md) gibi ek platform modüllerini yönetme

Tüm işlevler bu dokümantasyon sitesinde belirtilmiştir. Farklı Cloud'lardaki Wallarm Console UI linklerine makaleler içerisinde referans verirken, kendi domaininizi ve on-premise Wallarm Cloud'u dağıttığınız arayüzü kullanın.

## Deploying Wallarm filtering node

On-premise Wallarm filtering node için dağıtım süreci, standart filtering node dağıtım prosedürlerine benzer. İhtiyaçlarınıza ve altyapınıza uygun bir dağıtım seçeneği belirleyin ve seçtiğiniz dağıtım yöntemi için belirtilen özel gereksinimleri dikkate alarak kılavuzlarımızı takip edin.

### Requirements

Bir filtering node dağıtmak için, aşağıdaki kriterlere uygun bir compute instance hazırlayın:

* Trafik hacminize göre optimize edilmiş, node operasyonunu destekleyecek yeterli CPU, bellek ve depolama. Genel kaynak tahsisi önerileri için [buraya](../admin-en/configuration-guides/allocate-resources-for-node.md) bakın.
* On-premise Cloud instance'ının TCP/80 ve TCP/443 portlarına erişim.
* Seçtiğiniz dağıtım yöntemi makalesinde belirtilen diğer gereksinimlere uyum.

### Procedure

On-premise bir filtering node dağıtmak için:

1. Mevcut seçeneklerden bir [dağıtım seçeneği](supported-deployment-options.md) belirleyin ve verilen talimatlara uyun. Satır içi veya out-of-band (OOB) yapılandırmalar dahil olmak üzere tüm seçenekler on-premise dağıtımı destekler.

    Node kurulumu sırasında, Wallarm Cloud host'unu tanımlayan parametrelerde, daha önce oluşturduğunuz Wallarm Cloud instance'ının domaini olan `api.wallarm.companyname.tld` yazın.
1. Çalışan instance'ın domaininin, IP adresine çözüldüğünden emin olun. Örneğin, domain `wallarm.node.com` olarak yapılandırıldıysa, bu domain instance'ın IP'sine işaret etmelidir.

## Testing the deployment

Dağıtımı test etmek için:

1. Filtering node instance'ına yönelik test Path Traversal saldırısını çalıştırın:

    ```bash
    curl http://localhost/etc/passwd
    ```
1. Dağıtılan Wallarm Console UI'ya erişin ve ilgili saldırının saldırı listesinde göründüğünü kontrol edin.

## Limitations

Aşağıdaki işlevler, şu anda on-premise Wallarm çözümü tarafından desteklenmemektedir:

* [Exposed Asset Scanner](../user-guides/scanner.md)
* [Threat Replay Testing](../vulnerability-detection/threat-replay-testing/overview.md)
* [API Leaks](../api-attack-surface/security-issues.md#api-leaks)