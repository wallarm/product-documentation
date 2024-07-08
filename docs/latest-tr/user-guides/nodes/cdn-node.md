[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               ../../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../settings/users.md
[update-origin-ip-docs]:            #updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../rules/rules.md
[ip-lists-docs]:                    ../ip-lists/overview.md
[integration-docs]:                 ../settings/integrations/integrations-intro.md
[trigger-docs]:                     ../triggers/triggers.md
[application-docs]:                 ../settings/applications.md
[events-docs]:                      ../events/check-attack.md
[graylist-populating-docs]:         ../ip-lists/graylist.md#managing-graylist
[link-app-conf]:                    ../settings/applications.md
[using-varnish-cache]:              #using-varnish-cache

# CDN filtreleme düğümleri

Wallarm Konsolu UI'nin **Düğümler** bölümü, [**Wallarm düğümü**](nodes.md) ve **CDN düğümü** türlerinin düğümlerini yönetmenizi sağlar. Bu makale CDN düğümleri hakkındadır.

!!! info "Ücretsiz tier altındaki CDN düğümleri"
    CDN düğümü türünün dağıtımı [Ücretsiz tier planı](../../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud) altında desteklenmez.

--8<-- "../include-tr/waf/installation/cdn-node/how-cdn-node-works.md"

## Bir düğüm oluşturma

CDN düğümü oluşturmak için lütfen [talimatları](../../installation/cdn-node.md) takip edin.

## Bir düğümün detaylarını görüntüleme

Yüklenmiş düğümün detayları, her düğümün tablosunda ve kartında görüntülenir. Kartı açmak için uygun tablo kaydını tıklayın.

Aşağıdaki düğüm özellikleri ve ölçümleri mevcuttur:

* Korunan alan adına dayalı olarak oluşturulan düğüm adı
* Düğüm IP adresi
* Korunan alanla ilişkili köken adresi
* Benzersiz düğüm tanımlayıcısı (UUID)
* Düğüm durumu
* SSL/TLS sertifikası: Wallarm tarafından oluşturulan Let's Encrypt veya özel olan
* Filtreleme düğümü ve Wallarm Bulutun son senkronizasyon zamanı
* Filtreleme düğümünün oluşturulma tarihi
* Düğüm tarafından işlenen isteklerin bu ayki sayısı
* Kullanılan custom_ruleset ve proton.db sürümleri
* Yüklenmiş Wallarm paketlerinin sürümleri
* Kullanılabilir bileşen güncelleştirmeleri göstergesi

![CDN düğüm kartı](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## Korunan kaynağın köken adresini güncelleme

Barındırma sağlayıcınız köken IP adresini veya korunan kaynakla ilişkili alanı dinamik olarak güncelliyorsa, lütfen CDN düğümü yapılandırmasında belirtilen köken adresini güncel tutun. Aksi takdirde, istekler CDN düğümünün onları yanlış bir köken adresine proxy etmeye çalışacağı için korunan kaynağa ulaşmayacaktır.

Köken adresini güncellemek için **Köken adresini düzenle** seçeneğini kullanın.

## Özel SSL/TLS sertifikası yükleme

Wallarm, CDN düğümü alanında HTTPS'i etkinleştiren [Let's Encrypt](https://letsencrypt.org/) sertifikasını otomatik olarak verir. Sertifikalar ihtiyaç duyuldukça otomatik olarak oluşturulur ve yenilenir.

Korunan alan için zaten bir sertifikanız varsa ve Let's Encrypt sertifikasından ziyade bunu tercih ediyorsanız, kendi sertifikanızı **SSL/TLS sertifikası güncelle** seçeneğini kullanarak yükleyebilirsiniz.

## Varnish Cache kullanımı

[Varnish Cache](https://varnish-cache.org/intro/index.html#intro) HTTP hızlandırıcı ile bir CDN düğümünü kullanmak, içeriği kullanıcılara (ör. sunucu yanıtlarınız) daha hızlı iletir. Ancak içeriğinizi değiştirirseniz, CDN'deki önbelleğe alınmış kopya gecikmeyle güncellenebilir, bu da [problemlere](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node) neden olabilir ve Varnish Cache'in devre dışı bırakılmasına neden olabilir.

İçerik güncelleme hızıyla ilgili sorunları önlemek için, Varnish Cache varsayılan olarak devre dışıdır. Varnish Cache'i manuel olarak etkinleştirebilir/devre dışı bırakabilirsiniz. Bunu yapmak için **Düğümler** → CDN düğümü menüsüne gidin → **Varnish Cache'i etkinleştir** veya **Varnish Cache'i devre dışı bırak**.

## Bir düğümü silme

Filtreleme düğümü silindiğinde, alanınıza yapılan isteklerin filtrelemesi durdurulur. Filtreleme düğümünün silinmesi geri alınamaz. Wallarm düğümü, düğüm listesinden kalıcı olarak silinir.

1. Wallarm CNAME kaydını korunan alanın DNS kayıtlarından silin.

    !!! warning "Kötü amaçlı istek azaltma durdurulacak"
        CNAME kaydı kaldırıldıktan ve değişiklikler İnternet'te etkili olduktan sonra, Wallarm CDN düğümü istek yönlendirmeyi durduracak ve meşru ve kötü amaçlı trafik doğrudan korunan kaynağa gidecektir.

        Yeni düğüm sürümü için oluşturulan CNAME kaydı henüz etkili olmadı ancak silinen DNS kaydının etkili olması durumunda korunan sunucunun açıklığının istismar riskini beraberinde getirir.
1. Değişikliklerin yayılmasını bekleyin. Gerçek CNAME kayıt durumu, Wallarm Konsolu → **Düğümler** → **CDN** → **Düğümü sil** 'de görüntülenir.
1. CDN düğümünü düğüm listesinden silin.

![Düğümü silme](../../images/user-guides/nodes/delete-cdn-node.png)

## CDN düğümü sorun giderme

--8<-- "../include-tr/waf/installation/cdn-node/cdn-node-troubleshooting.md"