[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode
[wallarm-cloud-docs]:               ../../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../settings/users.md
[update-origin-ip-docs]:            #updating-the-origin-address-of-the-protected-resourse
[rules-docs]:                       ../rules/rules.md
[ip-lists-docs]:                    ../ip-lists/overview.md
[integration-docs]:                 ../settings/integrations/integrations-intro.md
[trigger-docs]:                     ../triggers/triggers.md
[application-docs]:                 ../settings/applications.md
[events-docs]:                      ../events/check-attack.md
[graylist-populating-docs]:         ../ip-lists/overview.md
[link-app-conf]:                    ../settings/applications.md
[using-varnish-cache]:              #using-varnish-cache

# CDN filtreleme düğümleri

Wallarm Console UI'nin **Nodes** bölümü, [**Wallarm node**](nodes.md) ve **CDN düğümü** türlerindeki düğümleri yönetmenizi sağlar. Bu makale CDN düğümleri hakkındadır.

!!! info "Ücretsiz katmanda CDN düğümleri"
    [Security Edge Free Tier](../../about-wallarm/subscription-plans.md#security-edge-free-tier) abonelik planında CDN düğümü türünün dağıtımı desteklenmez.

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## Bir düğüm oluşturma

CDN düğümünü oluşturmak için lütfen [yönergeleri](../../installation/cdn-node.md) izleyin.

## Bir düğümün ayrıntılarını görüntüleme

Yüklü düğümün ayrıntıları her düğümün tablosunda ve kartında görüntülenir. Kartı açmak için ilgili tablo kaydına tıklayın.

Aşağıdaki düğüm özellikleri ve metrikleri mevcuttur:

* Korumalı alan adının adına göre oluşturulan düğüm adı
* Düğüm IP adresi
* Korumalı alan adıyla ilişkili origin adresi
* Benzersiz düğüm tanımlayıcı (UUID)
* Düğüm durumu
* SSL/TLS sertifikası: Wallarm tarafından oluşturulan Let's Encrypt veya özel olanı
* Filtreleme düğümünün Wallarm Cloud ile son eşitlenme zamanı
* Filtreleme düğümünün oluşturulma tarihi
* Düğüm tarafından içinde bulunulan ayda işlenen istek sayısı
* Kullanılan custom_ruleset ve proton.db sürümleri
* Yüklü Wallarm paketlerinin sürümleri
* Mevcut bileşen güncellemelerine ilişkin gösterge

![CDN düğüm kartı](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## Korumalı kaynağın origin adresini güncelleme {#updating-the-origin-address-of-the-protected-resourse}

Barındırma sağlayıcınız korunan kaynakla ilişkili origin IP adresini veya alan adını dinamik olarak güncelliyorsa, lütfen CDN düğümü yapılandırmasında belirtilen origin adresini güncel tutun. Aksi halde, CDN düğümü istekleri hatalı bir origin adresine proxy'lemeye çalışacağından, istekler korunan kaynağa ulaşmayacaktır.

Origin adresini güncellemek için **Edit origin address** seçeneğini kullanın.

## Özel SSL/TLS sertifikası yükleme

Wallarm, CDN düğümü alanında HTTPS'i etkinleştiren [Let's Encrypt](https://letsencrypt.org/) sertifikasını otomatik olarak verir. Sertifikalar ihtiyaç halinde otomatik olarak oluşturulur ve yenilenir.

Korumalı alan için zaten bir sertifikanız varsa ve Let's Encrypt sertifikası yerine bunu tercih ediyorsanız, **Update SSL/TLS certificate** seçeneğini kullanarak kendi sertifikanızı yükleyebilirsiniz.

## Varnish Cache kullanma {#using-varnish-cache}

[Varnish Cache](https://varnish-cache.org/intro/index.html#intro) HTTP hızlandırıcısı ile CDN düğümünün kullanılması, kullanıcılara içerik teslimini (ör. sunucu yanıtlarınızı) hızlandırır. Ancak içeriğinizi değiştirdiğinizde, CDN üzerindeki önbelleğe alınmış kopya gecikmeli güncellenebilir; bu da [sorunlara](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node) yol açabilir ve Varnish Cache'i devre dışı bırakmak için bir neden olabilir.

İçerik güncelleme hızına ilişkin sorunları önlemek için Varnish Cache varsayılan olarak devre dışıdır. Varnish Cache'i manuel olarak etkinleştirebilir/devre dışı bırakabilirsiniz. Bunu yapmak için **Nodes** → CDN düğümü menüsü → **Enable Varnish Cache** veya **Disable Varnish Cache** yolunu izleyin.

## Bir düğümü silme

Filtreleme düğümü silindiğinde, alan adınıza gelen isteklerin filtrasyonu durdurulacaktır. Filtreleme düğümünün silinmesi geri alınamaz. Wallarm düğümü, düğümler listesinden kalıcı olarak silinecektir.

1. Korumalı alanın DNS kayıtlarından Wallarm CNAME kaydını silin.

    !!! warning "Kötü amaçlı isteklerin azaltılması durdurulacaktır"
        CNAME kaydı kaldırıldıktan ve değişiklikler İnternet'te etkili olduktan sonra, Wallarm CDN düğümü istek proxy'lemeyi durduracak ve meşru ve kötü amaçlı trafik doğrudan korunan kaynağa gidecektir.

        Bu durum, silinen DNS kaydı etkili olmuşken yeni düğüm sürümü için oluşturulan CNAME kaydı henüz etkili olmamışsa, korunan sunucudaki güvenlik açıklarının istismar edilmesi riskiyle sonuçlanır.
1. Değişikliklerin yayılmasını bekleyin. Gerçek CNAME kaydı durumu Wallarm Console → **Nodes** → **CDN** → **Delete node** içinde görüntülenir.
1. CDN düğümünü düğüm listesinden silin.

![Düğümün silinmesi](../../images/user-guides/nodes/delete-cdn-node.png)

## CDN düğümü sorun giderme

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"