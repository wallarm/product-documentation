[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console
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

Wallarm Console UI'nin **Nodes** bölümü, [**Wallarm node**](nodes.md) ve **CDN node** tipindeki düğümleri yönetmenizi sağlar. Bu makale CDN düğümleri hakkındadır.

!!! info "Free tier altındaki CDN düğümleri"
    [Free tier planı](../../about-wallarm/subscription-plans.md#free-tier) kapsamında CDN node tipinin dağıtımı desteklenmez.

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## Düğüm Oluşturma

CDN düğümünü oluşturmak için lütfen [talimatları](../../installation/cdn-node.md) izleyin.

## Bir Düğümün Ayrıntılarını Görüntüleme

Yüklü düğümün ayrıntıları, her düğümün tablosunda ve kartında görüntülenir. Kartı açmak için ilgili tablo kaydına tıklayın.

Aşağıdaki düğüm özellikleri ve ölçümleri mevcuttur:

* Korunan alan adının adına göre oluşturulan düğüm adı
* Düğüm IP adresi
* Korunan alan adıyla ilişkili orijin adresi
* Benzersiz düğüm tanımlayıcısı (UUID)
* Düğüm durumu
* SSL/TLS sertifikası: Wallarm tarafından oluşturulan Let's Encrypt veya özel sertifika
* Filtreleme düğümü ile Wallarm Cloud arasındaki son senkronizasyon zamanı
* Filtreleme düğümünün oluşturulma tarihi
* Düğüm tarafından mevcut ay içinde işlenen istek sayısı
* Kullanılan custom_ruleset ve proton.db sürümleri
* Yüklü Wallarm paketlerinin sürümleri
* Mevcut bileşen güncellemelerinin göstergesi

![CDN düğüm kartı](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## Korunan Kaynağın Orijin Adresini Güncelleme

Barındırma sağlayıcınız, korunan kaynakla ilişkili orijin IP adresini veya alan adını dinamik olarak güncelliyorsa, lütfen CDN düğüm yapılandırmasında belirtilen orijin adresini güncel tutun. Aksi halde, CDN düğümü istekleri yanlış orijin adresine yönlendirmeye çalışacağından istekler korunan kaynağa ulaşamaz.

Orijin adresini güncellemek için **Edit origin address** seçeneğini kullanın.

## Özel SSL/TLS Sertifikasını Yükleme

Wallarm, CDN düğüm alan adında HTTPS'yi etkinleştiren [Let's Encrypt](https://letsencrypt.org/) sertifikasını otomatik olarak sağlar. Sertifikalar ihtiyaç duyulduğunda otomatik olarak oluşturulur ve yenilenir.

Eğer korunan alan adı için zaten bir sertifikanız varsa ve bunu Let's Encrypt sertifikası yerine tercih ediyorsanız, **Update SSL/TLS certificate** seçeneğini kullanarak kendi sertifikanızı yükleyebilirsiniz.

## Varnish Cache Kullanımı

[Varnish Cache](https://varnish-cache.org/intro/index.html#intro) HTTP hızlandırıcısı ile bir CDN düğümü kullanmak, kullanıcılara (örneğin, sunucu yanıtlarınıza) içerik dağıtımını hızlandırır. Ancak, içeriğinizi değiştirirseniz, CDN'deki önbelleğe alınmış kopya gecikmeli olarak güncellenebilir; bu durum [sorunlara](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node) yol açabilir ve Varnish Cache'in devre dışı bırakılmasına neden olabilir.

İçerik güncelleme hızındaki sorunları önlemek için, Varnish Cache varsayılan olarak devre dışıdır. Varnish Cache'i manuel olarak etkinleştirebilir veya devre dışı bırakabilirsiniz. Bunun için **Nodes** → CDN node menüsü → **Enable Varnish Cache** veya **Disable Varnish Cache** seçeneğine gidin.

## Düğümü Silme

Filtreleme düğümü silindiğinde, alan adınıza gelen isteklerin filtrelenmesi durdurulur. Filtreleme düğümünün silinmesi geri alınamaz. Wallarm düğümü, düğüm listesinden kalıcı olarak silinecektir.

1. Korunan alan adının DNS kayıtlarından Wallarm CNAME kaydını silin.

    !!! warning "Zararlı istek azaltması durdurulacak"
        CNAME kaydı kaldırılıp değişiklikler İnternet'te yürürlüğe girdiğinde, Wallarm CDN düğümü istek proxy işlemini durdurur ve yasal ile zararlı trafik doğrudan korunan kaynağa gider.

        Bu durum, silinen DNS kaydı yürürlüğe girerken, yeni düğüm sürümü için oluşturulan CNAME kaydının henüz geçerli olmaması riskini doğurur.
1. Değişikliklerin yayılmasını bekleyin. Gerçek CNAME kayıt durumu Wallarm Console → **Nodes** → **CDN** → **Delete node** bölümünde görüntülenir.
1. Düğüm listesinden CDN düğümünü silin.

![Düğümü Silme](../../images/user-guides/nodes/delete-cdn-node.png)

## CDN Düğümü Sorun Giderme

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"