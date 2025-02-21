[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Hassas Verilerin Maskelenmesi

İsteklerinizdeki hassas verilerin, altyapınız içinde güvenli kalması ve [Wallarm Cloud](../../about-wallarm/overview.md#how-wallarm-works) dahil olmak üzere üçüncü taraf bir servise iletilmemesi çok önemlidir. Bu hedef, [shared responsibility model](../../about-wallarm/shared-responsibility.md) kullanılarak gerçekleştirilir: Wallarm, kendi tarafından kötü niyetli istekler hakkındaki veriler hariç hiçbir veri iletmez; bu da hassas verilerin sızdırılmasını son derece düşük bir olasılığa indirger - sizden beklenen ise hassas verilerin maskelenmesi olup, bu da korunan bilgi alanlarının güvenlik çevreniz dışına asla çıkmayacağının ek bir güvencesini sağlar.

Wallarm, veri maskeleme yapılandırması için **Mask sensitive data** [kuralını](../rules/rules.md) sunar. Wallarm düğümü, Wallarm Cloud'a aşağıdaki verileri gönderir:

* Saldırı içeren serileştirilmiş istekler
* Wallarm sistem sayaçları
* Sistem istatistikleri: CPU yükü, RAM kullanımı, vb.
* Wallarm sistem istatistikleri: işlenen NGINX isteklerinin sayısı, Tarantool istatistikleri, vb.
* Wallarm'ın uygulama yapısını doğru tespit edebilmesi için gereken trafik doğasına ilişkin bilgiler

**Mask sensitive data** kuralı, istek post-analytics modülüne ve Wallarm Cloud'a gönderilmeden önce belirtilen istek noktasının orijinal değerini keser. Bu yöntem, hassas verilerin güvenilir ortamın dışına sızmasını engeller.

Bu işlem, saldırıların görüntülenmesini, aktif saldırı (tehdit) doğrulamasını ve kaba kuvvet saldırılarının tespit edilmesini etkileyebilir.

## Kural Oluşturma ve Uygulama

Veri maskesini ayarlamak ve uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **Change requests/responses** → **Mask sensitive data** seçeneğini tıklayın.
1. **If request is** kısmında, kuralın uygulanacağı kapsamı [describe](rules.md#configuring) edin.
1. **In this part of request** bölümünde, orijinal değerinin kesilmesi gereken [request points](request-processing.md) belirtin.
1. [Kuralın derlenip filtreleme düğümüne yüklenmesini tamamlamasını](rules.md#ruleset-lifecycle) bekleyin.

## Örnek: Bir çerez değerinin maskelenmesi

Diyelim ki, `example.com` alan adına erişilebilen uygulamanız, kullanıcı doğrulaması için `PHPSESSID` çerezini kullanıyor ve Wallarm kullanan çalışanların bu bilgilere erişimini engellemek istiyorsunuz.

Bunu yapmak için, ekrandaki görüntüde gösterildiği gibi **Mask sensitive data** kuralını ayarlayın.

--8<-- "../include/waf/features/rules/request-part-reference.md"

![Marking sensitive data][img-masking]