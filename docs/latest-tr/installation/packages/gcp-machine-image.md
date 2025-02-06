[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace
[img-ssh-key-generation]:       ../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../installation/supported-deployment-options.md
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../oob/overview.md#limitations
[wallarm-mode]:                     ../../admin-en/configure-wallarm-mode.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[wallarm-api-via-proxy]:            ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../admin-en/configure-parameters-en.md#wallarm_force
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm Cloud'u Google Cloud Platform'da Dağıtma: Inline ve Out-of-Band Modları

## Giriş

Bu makale, Wallarm Cloud'un Google Cloud Platform üzerinde inline ve out-of-band (OOB) modlarında nasıl dağıtılacağına dair adım adım yönergeler sunar. Her iki dağıtım modunun da kendine özgü avantajları vardır: Inline mod, trafiğin gerçek zamanlı olarak işlenmesini sağlar; out-of-band mod ise ek güvenlik ve yedeklilik sunar. Aşağıdaki adımları izleyerek sisteminizi hızla devreye alabilirsiniz.

## Ön Gereksinimler

- Geçerli bir Google Cloud Platform hesabı.
- Projenizin yapılandırılmış ve gerekli izinlere sahip olması.
- Temel SSH ve ağ bağlantısı bilgisi.

## Adım 1: GCP Hesabınızı Hazırlayın

Google Cloud Marketplace üzerinden veya manuel olarak yeni bir proje oluşturun. Ayrıntılar için lütfen [link-launch-instance] adresine bakınız.

## Adım 2: SSH Anahtarınızı Oluşturun

Bağlantı güvenliğini sağlamak için kendi SSH anahtarlarınızı oluşturun. Bu işlemin nasıl yapılacağını görmek için [img-ssh-key-generation] görseline göz atabilirsiniz.

## Adım 3: Wallarm Filtreleme Düğümünü Dağıtın

Wallarm Filtreleme düğümünü dağıtmak için sağlanan yönergeleri izleyin. Dağıtım seçenekleri hakkında bilgi edinmek için [deployment-platform-docs] dokümanına ve düğüm token'ı oluşturma konusuna ilişkin detaylar için [node-token] dökümantasyonuna göz atın.

## Adım 4: Yapılandırma ve Ayarlar

Kurulum tamamlandıktan sonra API belirteçleri ([api-token]) ve düğüm oluşturma sırasında kullanılan token türleri ([wallarm-token-types]) gibi ayarları yapılandırmanız gerekmektedir. Ayrıca, sistem kaynaklarınızı optimize etmek için [allocate-memory-docs] dokümanında belirtilen kaynak tahsisi yönergelerine, istek işleme sınırlandırması için [limiting-request-processing] ve log yapılandırmaları için [logs-docs] dökümanına bakınız.

## Adım 5: Test ve Doğrulama

Kurulum sonrası, sistemin doğru çalıştığından emin olmak için çeşitli testler yapın. Örneğin, [ptrav-attack-docs] kılavuzunu kullanarak Path Traversal saldırısı simülasyonlarını inceleyebilir, test saldırıları sırasında [attacks-in-ui-image] görselini referans alabilirsiniz.

## Inline ve Out-of-Band Modlarının Karşılaştırılması

- **Inline Mod:** Trafiğin doğrudan Wallarm Cloud üzerinden yönlendirilmesiyle gerçek zamanlı müdahale imkanı sunar.
- **Out-of-Band Mod (OOB):** Trafiğin ayrı bir izleme kanalı üzerinden kontrol edilmesi sayesinde ek güvenlik önlemleri ve yedeklilik sağlar.

Her iki modun avantajları ve sınırlamaları hakkında daha fazla bilgiye [oob-advantages-limitations], [inline-docs] ve [oob-docs] dokümanlarından ulaşabilirsiniz. Ayrıca, Wallarm modunun detaylı yapılandırması için [wallarm-mode] yönergelerini inceleyiniz.

## Ek Bilgiler

- **Otomatik Ölçeklendirme:** Dinamik kaynak yönetimi için [autoscaling-docs] dökümanını referans alın.
- **Proxy ve Yük Dengeleyici Ayarları:** Gerçek IP yapılandırması hakkında [real-ip-docs] dökümanında detaylar mevcuttur.
- **Trafik Yansıtma:** Örnek yapılandırma ve trafik mirroring (yansıtma) örnekleri için [web-server-mirroring-examples] adresine bakınız.
- **Grup Düğümler:** Düğümlerin gruplanmış görünümü için [img-grouped-nodes] görselini inceleyebilirsiniz.
- **Gelişmiş Ayarlar:** Ek konfigürasyon detayları için [wallarm-nginx-directives] ve [wallarm_force_directive] dokümanlarına göz atınız.
- **Diğer Konular:** IP listeleri yönetimi ([ip-lists-docs]) ve API spesifikasyonunun uygulanması ([api-spec-enforcement-docs]) konularında daha fazla bilgi edinmek için ilgili dökümanları inceleyin.

## Sonuç

Bu makale, Wallarm Cloud'un Google Cloud Platform üzerindeki dağıtım sürecinde inline ve out-of-band modlarının nasıl uygulanabileceğini açıklamaktadır. İhtiyaçlarınıza en uygun yöntemi seçerek sisteminizi güvenli, esnek ve verimli bir şekilde devreye alabilirsiniz.