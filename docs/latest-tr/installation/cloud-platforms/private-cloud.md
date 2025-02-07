[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Özel Bulutlarda Wallarm Dağıtımı

Özel bulutlar, yalnızca tek bir organizasyon veya varlığa özel dağıtılan bulut ortamlarıdır ve kaynaklar üzerinde özel kullanım ve kontrol sağlar. Bu makale, özel bulutlara Wallarm düğümü dağıtımının ilkelerini genel hatlarıyla sunmaktadır.

## Adım 1: Wallarm Dağıtımınızın Kapsamını ve Yaklaşımını Anlayın

Özel bulutunuzda Wallarm'u dağıtmadan önce, uygulama manzaranızın kapsamını anlamak ve Wallarm dağıtımı için en uygun yaklaşımı belirlemek esastır. Bu değerlendirme sırasında aşağıdaki özellikleri göz önünde bulundurun:

* Güvence altına alınacak kapsamın değerlendirilmesi: Uygulama manzaranızı değerlendirin ve korunması gereken kritik uygulamaları belirleyin. Veri hassasiyeti, ihlallerin potansiyel etkisi ve uyum gereksinimleri gibi faktörleri göz önünde bulundurun. Bu değerlendirme, özel bulutunuzdaki en önemli varlıkları korumaya yönelik çabalarınızı önceliklendirmenize ve odaklanmanıza yardımcı olur.
* [In-line](../inline/overview.md) ve [out-of-band (OOB)](../oob/overview.md) analizi: Wallarm'u in-line analiz için mi yoksa out-of-band trafik analizi için mi dağıtmak istediğinizi belirleyin. In-line analiz, Wallarm düğümlerinin uygulamalarınızın trafik yoluna yerleştirilmesini içerirken; OOB analiz, yansıtılan trafiğin yakalanması ve analiz edilmesini içerir.
* Wallarm düğümlerinin yerleştirilmesi: Seçtiğiniz yaklaşıma (in-line veya OOB analiz) bağlı olarak, özel bulut altyapınız içinde Wallarm düğümlerinin uygun yerleşimini belirleyin. In-line analiz için, Wallarm düğümlerini uygulamalarınıza yakın, örneğin aynı VLAN veya alt ağ içinde yerleştirmeyi düşünün. OOB analiz için ise, yansıtılan trafiğin analiz için doğru şekilde Wallarm düğümlerine yönlendirileceğinden emin olun.

## Adım 2: Wallarm İçin Giden Bağlantılara İzin Verin

Özel bulutlarda, genellikle giden bağlantılar üzerinde kısıtlamalar bulunur. Wallarm'un düzgün çalışmasını sağlamak için, kurulum sırasında paketleri indirmesine, yerel düğüm örnekleri ile Wallarm Cloud arasında ağ bağlantısı kurmasına ve Wallarm özelliklerini tam olarak aktif hale getirmesine olanak tanıyacak şekilde giden bağlantıların etkinleştirilmesi gerekmektedir.

Özel bulutlarda erişim genellikle IP adreslerine dayalı olarak verilir. Wallarm, aşağıdaki DNS kayıtlarına erişim gerektirir:

* Güvenlik kurallarını almak, saldırı verilerini yüklemek vb. işlemler için Wallarm Cloud'a erişim sağlayacak aşağıdaki adresler:

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm'u bir Docker imajından çalıştırmayı seçerseniz, Docker Hub tarafından kullanılan IP adresleri.
* `35.244.197.238` (`https://meganode.wallarm.com`) [all-in-one installer](../nginx/all-in-one.md) aracılığıyla Wallarm'u kurmak içindir. Yükleyici bu adresten indirilmektedir.
* Saldırı tespit kurallarının güncellemelerini ve [API specifications][api-spec-enforcement-docs]'u indirmek, ayrıca [izin verilen, yasaklanan veya gri listeye alınmış][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için doğru IP'leri almak üzere aşağıdaki IP adresleri:

    --8<-- "../include/wallarm-cloud-ips.md"

## Adım 3: Dağıtım Modelini ve Wallarm Ürünü Seçin

Wallarm, kuruluşların özel bulut ortamları için en uygun seçeneği belirlemesine olanak tanıyan esnek dağıtım modelleri sunar. En yaygın iki dağıtım modeli **virtual appliance deployment** ve **Kubernetes deployment**'tır.

### Virtual appliance deployment

Bu modelde, Wallarm'u özel bulut altyapınız içinde bir virtual appliance olarak dağıtırsınız. Virtual appliance, bir VM veya konteyner olarak kurulabilir. Aşağıdaki ürünlerden birini kullanarak Wallarm düğümünü dağıtmayı seçebilirsiniz:

* Docker images:
    * [NGINX-based Docker image](../../admin-en/installation-docker-en.md)
    * [Envoy-based Docker image](../../admin-en/installation-guides/envoy/envoy-docker.md)
* [All‑in‑One Installer for Linux](../nginx/all-in-one.md)

### Kubernetes deployment

Eğer özel bulutunuz konteyner orkestrasiyonu için Kubernetes kullanıyorsa, Wallarm Kubernetes'e özgü bir çözüm olarak dağıtılabilir. Kubernetes kümeleriyle sorunsuz bir şekilde entegre olur; ingress controller'lar, sidecar konteynerlar veya özel Kubernetes kaynakları gibi özelliklerden yararlanır. Aşağıdaki çözümlerden birini kullanarak Wallarm'u dağıtmayı seçebilirsiniz:

* [NGINX-based Ingress controller](../../admin-en/installation-kubernetes-en.md)
* [Kong-based Ingress controller](../kubernetes/kong-ingress-controller/deployment.md)
* [Sidecar controller](../kubernetes/sidecar-proxy/deployment.md)