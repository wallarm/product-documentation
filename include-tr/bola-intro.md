## Genel Bakış

[Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi davranışsal saldırılar, adını taşıyan açığı istismar eder. Bu açık, bir saldırganın bir API isteği yoluyla bir nesneye, tanımlayıcısı aracılığıyla erişmesini ve yetkilendirme mekanizmasını atlayarak verilerini okumasını veya değiştirmesini sağlar. Bu makale, uygulamalarınızı BOLA saldırılarına karşı korumanız için size talimatlar verir.

Varsayılan olarak, Wallarm yalnızca BOLA türündeki zafiyetleri (IDOR olarak da bilinir) otomatik olarak tespit eder, ancak istismar girişimlerini algılamaz.

!!! warning "BOLA koruma kısıtlamaları"
    Yalnızca Wallarm node 4.2 ve üstü BOLA saldırı tespitini destekler.

    Wallarm node 4.2 ve üstü, yalnızca aşağıdaki istekleri BOLA saldırı belirtileri açısından analiz eder:

    * HTTP protokolü üzerinden gönderilen istekler.
    * Diğer saldırı türlerine ait belirtiler taşımayan istekler, örneğin, aşağıdaki durumlarda istekler BOLA saldırısı olarak değerlendirilmez:

        * Bu istekler [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) belirtileri içeriyorsa.
        * Bu istekler [rule **Create regexp-based attack indicator**](../../user-guides/rules/regex-rule.md#creating-and-applying-rule) içinde belirtilen düzenli ifadeye uyuyorsa.

## Gereksinimler

BOLA saldırılarından kaynakları korumak için, ortamınızın aşağıdaki gereksinimleri karşıladığından emin olun:

* Eğer filtreleme düğümü bir proxy sunucusu veya yük dengeleyici arkasında dağıtılmışsa, gerçek istemci IP adreslerini görüntülemek için [yapılandırın](../using-proxy-or-balancer-en.md).