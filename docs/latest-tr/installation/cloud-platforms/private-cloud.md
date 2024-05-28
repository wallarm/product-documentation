[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# Özel Bulutlarda Wallarm'ın Dağıtımı

Özel bulutlar, yalnızca tek bir organizasyon veya varlığa özgü şekilde dağıtılan bulut ortamlarıdır ve kaynaklar üzerinde özel kullanım ve kontrol sağlar. Bu makale, Wallarm düğümünün özel bulutlara nasıl dağıtılacağına dair ilkeleri özetlemektedir.

## Adım 1: Kapsamınızı ve Wallarm dağıtımına yaklaşımınızı anlayın

Wallarm'ı özel bulutunuza dağıtmadan önce, uygulama manzaranızın kapsamını anlamak ve Wallarm dağıtımı için en uygun yaklaşımı belirlemek esastır. Bu değerlendirmede aşağıdaki özellikleri göz önünde bulundurun:

* Güvence altına alınacak kapsamın değerlendirmesi: uygulama manzaranızı değerlendirin ve koruma gerektiren kritik uygulamaları belirleyin. Verilerin hassasiyeti, ihlal durumundaki potansiyel etki ve uyumluluk gereklilikleri gibi faktörleri göz önünde bulundurun. Bu değerlendirmesi, özel bulutunuzdaki en önemli varlıkları korumaya yönelik çabalarınızı önceliklendirmeniz ve odaklamanızda yardımcı olur.
* [In-line](../inline/overview.md) karşı [out-of-band (OOB)](../oob/overview.md) analizi: Wallarm'ı in-line analiz için mi, yoksa out-of-band trafik analizi için mi dağıtmak istediğinizi belirleyin. In-line analiz, Wallarm düğümlerinin uygulamalarınızın trafik yoluna dağıtılmasını içerirken, OOB analiz aynalanan trafikleri yakalama ve analiz etmeyi içerir.
* Wallarm düğümlerinin yerleştirilmesi: Seçtiğiniz yaklaşıma (in-line veya OOB analizi) dayanarak, Wallarm düğümlerinin özel bulut altyapınızda uygun yerleşimini belirleyin. In-line analiz için, Wallarm düğümlerini uygulamalarınıza yakın yerlere yerleştirmeyi düşünün, örneğin aynı VLAN veya alt ağ içinde. OOB analizi için, ayna trafiklerinin Wallarm düğümleri tarafından analiz edilmek üzere doğru şekilde yönlendirilmesini sağlayın.

## Adım 2: Wallarm için giden bağlantılara izin verin

Özel bulutlarda genellikle dışa çıkan bağlantılarda kısıtlamalar bulunmaktadır. Wallarm'ın düzgün çalışmasını sağlamak için dışa çıkan bağlantıları etkinleştirmeniz gerekmektedir, bu da kurulum sırasında paketleri indirmeye, yerel düğüm örnekleri ile Wallarm Bulutu arasında ağ bağlantısını kurmaya ve Wallarm özelliklerin tamamen işler hale getirmeye izin verecektir.

Özel bulutlarda genellikle IP adreslerine dayalı olarak erişim sağlanır. Wallarm, aşağıdaki DNS kayıtlarına erişim yapmayı gerektirir:

* `35.235.66.155` ABD Wallarm Cloud'una (`us1.api.wallarm.com`) erişim sağlamalıdır ki bu, güvenlik kurallarını almak, saldırı verilerini yüklemek vb. işlemler için gereklidir.
* `34.90.110.226` AB Wallarm Cloud'una (`api.wallarm.com`) erişim sağlamalıdır ki bu, güvenlik kurallarını almak, saldırı verilerini yüklemek vb. işlemler için gereklidir.
* IP adresleri Docker Hub tarafından kullanılmaktadır eğer Wallarm'ı Docker görüntüsünden çalıştırmayı seçerseniz.
* `34.111.12.147` (`repo.wallarm.com`) eğer Wallarm düğümünü [NGINX stabil](../nginx/dynamic-module.md)/[NGINX Plus](../nginx-plus.md)/[dağıtım sağlayan NGINX](../nginx/dynamic-module-from-distr.md) için bireysel Linux paketlerinden yüklemeyi seçerseniz. Düğüm yüklemesi için paketler bu adresten indirilir.
* `35.244.197.238` (`https://meganode.wallarm.com`) eğer Wallarm'ı [tümleşik yükleyici](../nginx/all-in-one.md) ile yüklemeyi seçerseniz. Yükleyici bu adresten indirilir.
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```

## Adım 3: Dağıtım modelini ve Wallarm eserini seçin

Wallarm, organizasyonların özel bulut ortamı için en uygun seçeneği seçmelerini sağlayan esnek dağıtım modelleri sunar. İki yaygın dağıtım modeli **sanal alet dağıtımı** ve **Kubernetes dağıtımı**dır.

### Sanal alet dağıtımı

Bu modelde, Wallarm'ı özel bulut altyapınızda bir sanal alet olarak dağıtırsınız. Sanal alet bir VM veya konteyner olarak yüklenebilir. Wallarm düğümünü aşağıdaki eserlerden birini kullanarak dağıtmayı seçebilirsiniz:

* Docker görüntüleri:
    * [NGINX tabanlı Docker görüntüsü](../../admin-en/installation-docker-en.md)
    * [Envoy tabanlı Docker görüntüsü](../../admin-en/installation-guides/envoy/envoy-docker.md)
* Linux paketleri:
    * [NGINX stabil için bireysel Linux paketleri](../nginx/dynamic-module.md)
    * [NGINX Plus için bireysel Linux paketleri](../nginx-plus.md)
    * [Dağıtımı Sağlanan NGINX için Bireysel Linux paketleri](../nginx/dynamic-module-from-distr.md)
    * [Linux için Tüm‑Bir‑Arada Yükleyici](../nginx/all-in-one.md)

### Kubernetes dağıtımı

Özel bulutunuz konteyner yönetimi için Kubernetes'i kullanıyorsa, Wallarm bir Kubernetes yerel çözümü olarak dağıtılabilir. Kubernetes kümesiyle sorunsuz bir şekilde entegre olur, giriş kontrolörleri, yan taraftaki konteynerler veya özel Kubernetes kaynakları gibi özelliklerden yararlanır. Wallarm'ı aşağıdaki çözümlerden birini kullanarak dağıtmayı seçebilirsiniz:

* [NGINX tabanlı Giriş kontrolörü](../../admin-en/installation-kubernetes-en.md)
* [Kong tabanlı Giriş kontrolörü](../kubernetes/kong-ingress-controller/deployment.md)
* [Yan taraftaki kontrolör](../kubernetes/sidecar-proxy/deployment.md)