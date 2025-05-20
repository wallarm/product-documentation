# Wallarm node 2.18 ve daha eski sürümlerden 5.0'a Allowlist ve Denylist Geçişi

Wallarm node 3.x ile birlikte IP adresi allowlist ve denylist yapılandırma yöntemi değiştirildi. Bu belge, Wallarm node 2.18 veya daha eski sürümlerde yapılandırılmış allowlist ve denylist'lerin en son Wallarm node sürümüne nasıl taşınacağını anlatır.

## Ne Değişti?

IP adresi allowlist ve denylist yapılandırması aşağıdaki gibi değiştirildi:

* `wallarm_acl_*` NGINX direktifleri, `acl` Envoy parametreleri ve `WALLARM_ACL_*` ortam değişkenleri kullanımdan kaldırılmıştır. Artık IP listeleri aşağıdaki şekilde yapılandırılmaktadır:
  
  * IP allowlisting veya denylisting işlevselliğini etkinleştirmek için ek adımlar gerekmez. Wallarm node varsayılan olarak IP adresi listelerini Wallarm Cloud'dan indirir ve gelen istekleri işlerken indirilen verileri uygular.
  * Engelleme sayfası ve engellenen isteğe döndürülen hata kodu, `wallarm_acl_block_page` yerine [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) direktifi kullanılarak yapılandırılır.
* Allowlist'e ve denylist'e eklenmiş IP adresleri Wallarm Console üzerinden yönetilir.
* [Wallarm Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) IP adresleri varsayılan olarak allowlist'e eklenir. Scanner IP adreslerinin manuel olarak allowlist'e eklenmesi artık gerekmemektedir.

## Allowlist ve Denylist Yapılandırmasının Geçiş Prosedürü

1. [Wallarm technical support](mailto:support@wallarm.com)’a, filtreleme node modüllerini en son sürüme güncellediğinizi ve Wallarm hesabınız için yeni IP listeleri mantığının etkinleştirilmesini talep ettiğinizi bildirin.  
   Yeni IP listeleri mantığı etkinleştirildiğinde, lütfen Wallarm Console’u açın ve [**IP lists**](../user-guides/ip-lists/overview.md) bölümünün mevcut olduğunu kontrol edin.
2. Çok kiracılı (multi-tenant) Wallarm node güncelliyorsanız, IP adresi denylist senkronizasyonu için kullanılan scriptleri ve 2.18 veya daha eski sürümlerdeki multi-tenant node’ları silin. 3.2 sürümünden itibaren, [IP lists](../user-guides/ip-lists/overview.md) 'in manuel entegrasyonu artık gerekmemektedir. 
3. Filtreleme node modüllerini [uygun talimatları](general-recommendations.md#update-process) izleyerek 5.0 sürümüne güncelleyin.
4. Wallarm Scanner IP adreslerinin allowlist girişini filtreleme node yapılandırma dosyalarından kaldırın. Filtreleme node 3.x'ten itibaren, Scanner IP adresleri varsayılan olarak allowlist'e eklenmektedir.
5. Eğer listelenen yöntemler filtreleme node tarafından engellenmemesi gereken diğer IP adreslerini allowlist'e eklemek için kullanılıyorsa, lütfen bu adresleri [Wallarm Console’daki allowlist](../user-guides/ip-lists/overview.md) bölümüne taşıyın.
6. Eğer denylist'e eklenen IP'nin isteği başlatması durumunda döndürülen engelleme sayfası ve hata kodunu yapılandırmak için `wallarm_acl_block_page` direktifini kullandıysanız, lütfen bu direktif adını `wallarm_block_page` ile değiştirin ve [talimatları](../admin-en/configuration-guides/configure-block-page-and-code.md) izleyerek değerini güncelleyin.
7. [NGINX](../admin-en/installation-docker-en.md) ve [Envoy](../admin-en/installation-guides/envoy/envoy-docker.md) ortam değişkenleri `WALLARM_ACL_*`'i `docker run` komutlarından kaldırın.
8. (İsteğe Bağlı) Filtreleme node yapılandırma dosyalarından NGINX direktifleri `wallarm_acl_*` ve Envoy parametreleri `acl` kaldırın.