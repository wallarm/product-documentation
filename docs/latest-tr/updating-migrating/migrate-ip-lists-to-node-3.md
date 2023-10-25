# Wallarm düğümü 2.18 ve daha alt sürümlerinden 4.8'e izin listeleri ve yasak listeleri taşıma

Wallarm düğümü 3.x ile birlikte, IP adresi izin listesi ve yasak listesi yapılandırmasının yöntemi değiştirilmiştir. Bu belge, Wallarm düğümü 2.18 veya daha alt sürümünde yapılandırılmış izin listelerini ve yasak listeleri en son Wallarm düğümüne nasıl taşıyacağınızı anlatır.

## Ne değişti?

IP adresi izin listesi ve yasak listesi yapılandırması aşağıdaki şekilde değiştirilmiştir:

* [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) NGINX direktifleri, [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings) Envoy parametreleri ve `WALLARM_ACL_*` çevre değişkenleri kullanımdan kaldırılmıştır. Artık, IP listeleri aşağıdaki şekilde yapılandırılmaktadır:

    * IP izin listeleme veya yasak listeleme işlevselliğini etkinleştirmek için ek adımlar gerekmez. Wallarm düğümü, gelen istekleri işlerken indirilen verileri uygular hale getirerek varsayılan olarak Wallarm Bulutu'ndan IP adresleri listeleri indirir.
    * Engellenen talebe yanıt olarak döndürülen hata kodu ve engelleme sayfası, `wallarm_acl_block_page` yerine [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) direktifi kullanılarak yapılandırılır. 
* İzin verilen ve yasaklanan IP adresleri Wallarm Konsol üzerinden yönetilir.
* [Wallarm Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)ın IP adresleri varsayılan olarak izin listesine alınır. Tarayıcı IP adreslerinin manuel olarak izin listesine alınması artık gerekmemektedir.

## İzin listesi ve yasak listesi yapılandırma taşıma prosedürü

1. Filtreleme düğümü modüllerinizi en son versiyona kadar güncellediğinizi ve Wallarm hesabınız için yeni IP listeleri mantığını etkinleştirmelerini istemek amacıyla [Wallarm teknik desteğine](mailto:support@wallarm.com) bilgi verin.

    Yeni IP listeleri mantığı etkinleştirildiğinde, lütfen Wallarm Konsolu'nu açın ve [**IP listeleri**](../user-guides/ip-lists/overview.md) bölümünün mevcut olduğunu doğrulayın. 
2. Eğer çok kiracılı Wallarm düğümünü güncelliyorsanız, lütfen IP adresi yasak listesini ve çok kiracılı düğümü 2.18 veya daha alt sürümü senkronize etmek için kullanılan scriptleri silin. 3.2 sürümünden itibaren, [IP listelerinin](../user-guides/ip-lists/overview.md) manuel entegrasyonu artık gerekmemektedir.
3. Filtreleme düğümü modüllerinizi, [uygun talimatlara](general-recommendations.md#update-process) uygun olarak, versiyon 4.8'e kadar güncelleyin.
4. Wallarm Tarayıcısının IP adreslerinin izin listesini filtreleme düğümü yapılandırma dosyalarından kaldırın. Filtreleme düğümü 3.x ile birlikte, Tarayıcı IP adresleri varsayılan olarak izin listesine alınır. Önceki Wallarm düğüm sürümlerinde, izin listesi aşağıdaki yöntemlerle yapılandırılabilir:

    * Tarayıcı IP adresleri için devre dışı bırakılmış filtrasyon modu (örneğin: [NGINX yapılandırması](/2.18/admin-en/scanner-ips-allowlisting/), [K8s sidecar contianer](/2.18/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/#step-1-creating-wallarm-configmap), [K8s Ingress controller](/2.18/admin-en/configuration-guides/wallarm-ingress-controller/best-practices/allowlist-wallarm-ip-addresses/)).
    * NGINX direktifi [`allow`](https://nginx.org/en/docs/http/ngx_http_access_module.html#allow).
5. Filtreleme düğümü tarafından engellenmemesi gereken diğer IP adreslerini izin listesine almak için listelenen yöntemler kullanılıyorsa, lütfen bunları [Wallarm Konsolu'ndaki izin listesine](../user-guides/ip-lists/allowlist.md) taşıyın.
6. Yasaklı IP'nin talepte bulunduğunda döndürülen engelleme sayfasını ve hata kodunu yapılandırmak için `wallarm_acl_block_page` direktifini kullanıyorsanız, lütfen direktif ismini `wallarm_block_page` olarak değiştirin ve değerini [talimatlara](../admin-en/configuration-guides/configure-block-page-and-code.md) uygun olarak güncelleyin.
7. `docker run` komutlarından [NGINX](../admin-en/installation-docker-en.md) ve [Envoy](../admin-en/installation-guides/envoy/envoy-docker.md) çevre değişkenleri `WALLARM_ACL_*` silin.
8. (Opsiyonel) Filtreleme düğümü yapılandırma dosyalarından NGINX direktiflerini [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) ve [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings) Envoy parametrelerini kaldırın.