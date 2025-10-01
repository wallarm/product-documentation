[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Özel Bulutlarda Wallarm Dağıtımı

Özel bulutlar, kaynaklar üzerinde özel kullanım ve kontrol sağlayan, yalnızca tek bir kuruluş veya varlık için devreye alınmış bulut ortamlarıdır. Bu makale, Wallarm düğümünün özel bulutlara dağıtım ilkelerine genel bir bakış sunar.

## Adım 1: Kapsamınızı ve Wallarm dağıtım yaklaşımınızı anlayın

Özel bulutunuza Wallarm dağıtmadan önce, uygulama ortamınızın kapsamını anlamanız ve Wallarm dağıtımı için en uygun yaklaşımı belirlemeniz önemlidir. Bu değerlendirme sırasında aşağıdaki özellikleri göz önünde bulundurun:

* Güvence altına alınacak kapsamın değerlendirilmesi: uygulama ortamınızı değerlendirin ve korunması gereken kritik uygulamaları belirleyin. Veri hassasiyeti, ihlallerin potansiyel etkisi ve uyumluluk gereklilikleri gibi faktörleri dikkate alın. Bu değerlendirme, özel bulutunuzdaki en önemli varlıkları korumaya odaklanmanızı ve önceliklendirmenizi sağlar.
* [Hat içi](../inline/overview.md) ile [bant dışı (OOB)](../oob/overview.md) analiz: Wallarm’ı hat içi analiz için mi yoksa bant dışı trafik analizi için mi dağıtmak istediğinizi belirleyin. Hat içi analiz, Wallarm düğümlerinin uygulamalarınızın trafik yoluna yerleştirilmesini içerirken, OOB analiz yansıtılan trafiğin yakalanıp analiz edilmesini içerir.
* Wallarm düğümlerinin konumlandırılması: Seçtiğiniz yaklaşıma (hat içi veya OOB analiz) bağlı olarak, özel bulut altyapınız içinde Wallarm düğümlerinin uygun konumunu belirleyin. Hat içi analiz için, Wallarm düğümlerini uygulamalarınıza yakın, örneğin aynı VLAN veya alt ağ içinde konumlandırmayı düşünün. OOB analiz için, yansıtılan trafiğin analiz için Wallarm düğümlerine düzgün şekilde yönlendirileceğinden emin olun.

## Adım 2: Wallarm için giden bağlantılara izin verin

Özel bulutlarda, giden bağlantılara sıklıkla kısıtlamalar getirilir. Wallarm’ın düzgün çalışmasını sağlamak için, kurulum sırasında paketleri indirebilmesi, yerel düğüm örnekleri ile Wallarm Cloud arasında ağ bağlantısı kurabilmesi ve Wallarm özelliklerini tam olarak işler hale getirebilmesi amacıyla giden bağlantıları etkinleştirmek gerekir.

Özel bulutlarda erişim genellikle IP adreslerine göre verilir. Wallarm’ın aşağıdaki DNS kayıtlarına erişmesi gerekir:

* Güvenlik kurallarını almak, saldırı verilerini yüklemek vb. için Wallarm Cloud’a erişim sağlamak üzere aşağıdaki adresler:

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm’ı bir Docker imajından çalıştırmayı seçerseniz Docker Hub tarafından kullanılan IP adresleri.
* `35.244.197.238` (`https://meganode.wallarm.com`) adresi; Wallarm’ı [All‑in‑One Installer](../nginx/all-in-one.md) ile kurmak için. Yükleyici bu adresten indirilir.
* Saldırı tespit kurallarının güncellemelerini ve [API spesifikasyonlarını][api-spec-enforcement-docs] indirmek ve ayrıca [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak üzere aşağıdaki IP adresleri.

    --8<-- "../include/wallarm-cloud-ips.md"

## Adım 3: Dağıtım modelini ve Wallarm artifaktını seçin

Wallarm, kuruluşların özel bulut ortamları için en uygun seçeneği belirlemesine olanak tanıyan esnek dağıtım modelleri sunar. İki yaygın dağıtım modeli, **sanal aygıt dağıtımı** ve **Kubernetes dağıtımı**dır.

### Sanal aygıt dağıtımı

Bu modelde, Wallarm’ı özel bulut altyapınız içinde bir sanal aygıt olarak dağıtırsınız. Sanal aygıt, bir VM veya konteyner olarak kurulabilir. Wallarm düğümünü aşağıdaki artifaktlardan biriyle dağıtmayı seçebilirsiniz:

* [NGINX tabanlı Docker imajı](../../admin-en/installation-docker-en.md)
* [Linux için All‑in‑One Installer](../nginx/all-in-one.md)

### Kubernetes dağıtımı

Özel bulutunuz kapsayıcı orkestrasyonu için Kubernetes kullanıyorsa, Wallarm Kubernetes-yerel bir çözüm olarak dağıtılabilir. Ingress denetleyicileri, sidecar konteynerleri veya özel Kubernetes kaynakları gibi özelliklerden yararlanarak Kubernetes kümeleriyle sorunsuz şekilde bütünleşir. Wallarm’ı aşağıdaki çözümlerden birini kullanarak dağıtmayı seçebilirsiniz:

* [NGINX tabanlı Ingress denetleyicisi](../../admin-en/installation-kubernetes-en.md)
* [Sidecar denetleyicisi](../kubernetes/sidecar-proxy/deployment.md)