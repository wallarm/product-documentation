# Wallarm node 2.18 ve alt sürümlerden 6.x'e izin ve engelleme listelerinin taşınması

Wallarm node 3.x ile birlikte, IP adresi izin listesi (allowlist) ve engelleme listesi (denylist) yapılandırma yöntemi değişti. Bu belge, Wallarm node 2.18 veya daha eski sürümlerde yapılandırılmış izin ve engelleme listelerini en son Wallarm node sürümüne nasıl taşıyacağınızı açıklar.

## Neler değişti?

IP adresi izin ve engelleme listelerinin yapılandırılması şu şekilde değişti:

* `wallarm_acl_*` NGINX yönergeleri ve `WALLARM_ACL_*` ortam değişkenleri kullanımdan kaldırıldı. Artık IP listeleri şu şekilde yapılandırılır:

    * IP allowlisting veya denylisting işlevini etkinleştirmek için ek adımlar gerekmez. Wallarm node varsayılan olarak IP adresi listelerini Wallarm Cloud üzerinden indirir ve gelen istekleri işlerken indirilmiş veriyi uygular.
    * Engelleme sayfası ve engellenen isteğe yanıtta döndürülen hata kodu, `wallarm_acl_block_page` yerine [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) yönergesi kullanılarak yapılandırılır.
* İzin verilen ve engellenen IP adresleri Wallarm Console üzerinden yönetilir.
* Şirket kaynaklarını güvenlik açıkları için taramak ve ek güvenlik testleri başlatmak amacıyla kullanılan [Wallarm'ın güvenlik açığı tarama IP'leri](../admin-en/scanner-addresses.md) varsayılan olarak allowlist edilir. Bu adreslerin manuel olarak allowlist edilmesi artık gerekli değildir.

## İzin ve engelleme listesi yapılandırmasını taşıma prosedürü

1. [Wallarm teknik desteğini](mailto:support@wallarm.com) en son sürüme güncelleme yaptığınızı bildirin ve Wallarm hesabınız için yeni IP listeleri mantığının etkinleştirilmesini talep edin.

    Yeni IP listeleri mantığı etkinleştirildiğinde, lütfen Wallarm Console'u açın ve [**IP lists**](../user-guides/ip-lists/overview.md) bölümünün mevcut olduğundan emin olun.
2. Çok kiracılı (multi-tenant) Wallarm node'u güncelliyorsanız, IP adresi engelleme listesini çok kiracılı 2.18 veya daha eski node ile senkronize etmek için kullanılan betikleri silin. 3.2 sürümünden itibaren [IP listeleri](../user-guides/ip-lists/overview.md) için manuel entegrasyon artık gerekli değildir. 
3. Filtreleme düğümü modüllerini [uygun talimatları](general-recommendations.md#update-process) izleyerek 6.x sürümüne güncelleyin.
4. Şirket kaynaklarını güvenlik açıkları için taramak ve ek güvenlik testleri başlatmak amacıyla kullanılan [Wallarm'ın güvenlik açığı tarama IP'lerini](../admin-en/scanner-addresses.md) filtreleme düğümü yapılandırma dosyalarındaki allowlist'ten çıkarın. Filtreleme düğümünün 3.x sürümünden itibaren bu adresler varsayılan olarak allowlist edilir.
5. Filtreleme düğümü tarafından engellenmemesi gereken diğer IP adreslerini allowlist etmek için listelenen yöntemler kullanılıyorsa, bunları [Wallarm Console içindeki allowlist](../user-guides/ip-lists/overview.md)'e taşıyın.
6. Engellenen IP'den gelen isteklerde döndürülen engelleme sayfasını ve hata kodunu yapılandırmak için `wallarm_acl_block_page` yönergesini kullandıysanız, yönerge adını `wallarm_block_page` ile değiştirin ve değerini [talimatlara](../admin-en/configuration-guides/configure-block-page-and-code.md) uygun olarak güncelleyin.
7. `docker run` komutlarından [NGINX](../admin-en/installation-docker-en.md) ortam değişkenleri `WALLARM_ACL_*` öğelerini kaldırın.
8. (İsteğe bağlı) Filtreleme düğümü yapılandırma dosyalarından `wallarm_acl_*` NGINX yönergelerini kaldırın.