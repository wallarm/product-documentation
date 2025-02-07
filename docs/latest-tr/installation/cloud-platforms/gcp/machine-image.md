[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace
[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../../oob/overview.md#limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[inline-docs]:                      ../../inline/overview.md
[oob-docs]:                         ../../oob/overview.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[web-server-mirroring-examples]:    ../../oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../admin-en/configure-parameters-en.md#wallarm_force
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../../api-specification-enforcement/overview.md

# Google Cloud Platform'da Wallarm Inline ve OOB Yüklemesi

Bu makale, Google Cloud Platform (GCP) üzerinde Wallarm inline ve out-of-band (OOB) düğümlerinin hızlı ve güvenli bir şekilde nasıl konuşlandırılacağını adım adım açıklamaktadır. Aşağıda yer alan yönergeler, sisteminizin en iyi şekilde yapılandırılması için gereken temel adımları ve önemli referansları içermektedir.

## Başlamadan Önce

- Bir Google Cloud hesabınızın olduğundan ve gerekli izinlere sahip olduğunuzdan emin olun.
- GCP Marketplace üzerinden başlatma işlemi yapmak için [link-launch-instance] adresindeki örneği kullanabilirsiniz.
- SSH anahtarınızı oluşturmayı unutmayın; bunun için [img-ssh-key-generation] görselinde gösterilen adımları izleyebilirsiniz.

## Adım 1 – SSH Anahtarı ve Erişim

Öncelikle, GCP örneğinize güvenli erişim sağlamak amacıyla SSH anahtarı oluşturmanız gerekmektedir. 
- SSH anahtarınız oluşturulduktan sonra, ilgili kılavuzlardan yararlanarak bağlantınızı test edebilirsiniz.
- Erişim yapılandırması sırasında karşılaşılabilecek 2FA gibi ek güvenlik önlemleri için [img-wl-console-users] görseline göz atabilirsiniz.

## Adım 2 – Wallarm Düğümünün Konuşlandırılması

Wallarm inline düğümünüzü oluşturmak için şu adımları uygulayın:

1. **Düğüm Oluşturma:**  
   - Yeni bir düğüm oluşturmak için [node-token] bağlantısındaki yönergeleri takip edin.
   - Düğüm oluşturma sürecinde [img-create-wallarm-node] görselinde yer alan adımları da referans alabilirsiniz.

2. **API ve Token Yapılandırması:**  
   - Wallarm API erişimi için [api-token] dökümantasyonundaki talimatlara uyun.
   - Düğüm oluşturma sırasında kullanacağınız token türleri hakkında [wallarm-token-types] bölümünden bilgi alabilirsiniz.

3. **Platform Uyumluluğu:**  
   - Uygun dağıtım seçenekleri ve platform desteği için [deployment-platform-docs] ve [platform] dökümanlarını inceleyin.

## Adım 3 – Yapılandırma ve İleri Ayarlar

### Ölçeklendirme ve Kaynak Yönetimi

- **Otomatik Ölçeklendirme:**  
  - Artan trafik ve yük durumunda otomatik ölçeklendirme için [autoscaling-docs] kılavuzunu okuyun.
  
- **Bellek ve Kaynak Tahsisi:**  
  - Düğüm kaynaklarının doğru şekilde tahsisi için [allocate-memory-docs] belgesinde yer alan önerileri uygulayın.

### Güvenlik ve Loglama

- **Güvenlik Yapılandırması:**  
  - Path Traversal gibi saldırılara karşı korunma yöntemlerini öğrenmek için [ptrav-attack-docs] dökümanına bakınız.
  - Düşük gecikmeli erişim için [real-ip-docs] kılavuzunu dikkate alın.
  
- **Log Yönetimi:**  
  - Sistem loglarının yapılandırılması ve yönetimi için [logs-docs] dökümanını inceleyin.

### İleri Düzey Parametre Ayarları

- **Nginx Direktifleri ve Wallarm Force:**  
  - Yapılandırma sırasında özel ayarlar yapmanız gerekiyorsa [wallarm-nginx-directives] dökümanında açıklanan direktifleri ve [wallarm_force_directive] bölümünü referans alın.
  
- **İstek İşleme Sınırlamaları:**  
  - Yüksek trafik altında kaynak korunumu sağlamak için [limiting-request-processing] bölümündeki yönergeleri uygulayın.

## Ek Özellikler ve Öneriler

- **OOB Avantajları ve Sınırlamaları:**  
  - Wallarm OOB modunun sunduğu avantajlar ve karşılaşılabilecek sınırlamalar hakkında detaylı bilgi için [oob-advantages-limitations] dökümanına bakabilirsiniz.
  
- **API Erişimi ve Proxy Kullanımı:**  
  - Wallarm API'sine erişim sağlamak için [wallarm-api-via-proxy] kılavuzundaki adımları takip edin.
  
- **Web Sunucu Yansıtma:**  
  - Trafik yansıtma ile ilgili konfigürasyon örnekleri için [web-server-mirroring-examples] bölümündeki örneklere göz atabilirsiniz.
  
- **Gruplanmış Düğümler:**  
  - Çoklu düğüm yapıları oluşturmak ve yönetmek için [img-grouped-nodes] görselinde yer alan yapıya göz atın.

- **Cloud-Init ve Diğer Platform Entegrasyonları:**  
  - GCP üzerinde otomatik yapılandırma için [cloud-init-spec] dökümanını inceleyin.
  
- **IP Listeleri ve API Speki Uygulaması:**  
  - Güvenlik duvarı politikaları ve IP listeleri hakkında ayrıntılar için [ip-lists-docs] belgesini, ayrıca API spesifikasyonu uygulaması için [api-spec-enforcement-docs] referansını kullanın.

## Sonuç

Bu rehberde, Google Cloud Platform üzerinde Wallarm inline ve OOB düğümlerinin nasıl konuşlandırılacağına dair temel adımlar anlatılmıştır. Yapılandırma, ölçeklendirme ve güvenlik ayarları gibi kritik konularda ilgili dökümanlara ([versioning-policy], [deployment-platform-docs], [inline-docs], [oob-docs]) mutlaka göz atınız. Herhangi bir sorunla karşılaşırsanız destek ekibiyle iletişime geçebilir veya dökümantasyonlarımızı detaylıca inceleyebilirsiniz.