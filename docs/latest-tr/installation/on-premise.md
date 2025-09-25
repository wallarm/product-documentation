# Wallarm On-Premise Dağıtımı

Wallarm, iş ortakları, büyük işletmeler ve kapsamlı bir on-premise güvenlik sistemi arayan tüm kuruluşlar için tasarlanmış bir on-premise çözüm sunar. Bu teklif, Wallarm'ın güvenlik altyapısının doğrudan kendi ortamlarınıza entegre edilmesine olanak tanır. Bu makale, bu teklife nasıl erişileceği ve nasıl kullanılacağı hakkında bilgi sağlar.

## Genel Bakış

Wallarm mimarisi [iki ana bileşen](../about-wallarm/overview.md#how-wallarm-works) etrafında inşa edilmiştir:

* Filtreleme düğümü: Altyapınız içinde konuşlandırılır ve ihtiyaçlarınıza uygun esnek dağıtım seçeneklerine izin verir.
* Wallarm Cloud: Geleneksel olarak Wallarm tarafından dışarıda barındırılır. On-Premise dağıtım modelinde, Wallarm Cloud'u kendi altyapınız içinde dağıtmanıza yönelik bir yöntem sunuyoruz. Bu yaklaşım, hizmet dağıtımının kapsamlı doğası nedeniyle tüm altyapının organize edilmesini gerektirir. Gerekli tüm hizmetleri otomatik olarak başlatan bir komut dosyası sağlayarak bu süreci basitleştiriyoruz.

![On-Premise dağıtım](../images/waf-installation/on-premise.png)

## Erişim ve ayrıntılar

On-Premise dağıtımla ilgili her türlü soru veya talebiniz için lütfen [Wallarm satış ekibi](mailto:sales@wallarm.com) ile iletişime geçin.

## Sınırlamalar

Aşağıdaki işlevler şu anda Wallarm'ın on-premise çözümü tarafından desteklenmemektedir:

* [Tehdit Yeniden Oynatma Testi](../vulnerability-detection/threat-replay-testing/overview.md)
* [API Saldırı Yüzeyi Yönetimi](../api-attack-surface/overview.md)