## Genel Bakış

[Bozuk Nesne Düzeyi Yetkilendirme (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi davranışsal saldırılar, aynı adlı zafiyeti sömürür. Bu zafiyet, bir saldırganın bir nesneye tanımlayıcısı aracılığıyla bir API isteğiyle erişmesine ve yetkilendirme mekanizmasını atlayarak verilerini okumasına veya değiştirmesine olanak tanır. Bu makale, uygulamalarınızı BOLA saldırılarına karşı korumanıza yardımcı olur.

Varsayılan olarak, Wallarm yalnızca BOLA türündeki (IDOR olarak da bilinen) zafiyetleri otomatik olarak keşfeder, ancak bunların istismar girişimlerini tespit etmez.

!!! warning "BOLA koruma kısıtlamaları"
    Yalnızca Wallarm node 4.2 ve üzeri, BOLA saldırı tespitini destekler.

    Wallarm node 4.2 ve üzeri, BOLA saldırısı belirtileri için yalnızca aşağıdaki istekleri analiz eder:

    * HTTP protokolü üzerinden gönderilen istekler.
    * Diğer saldırı türlerinin belirtilerini içermeyen istekler, örn. aşağıdaki durumlarda istekler BOLA saldırısı olarak değerlendirilmez:

        * Bu istekler [girdi doğrulama saldırılarının](../../attacks-vulns-list.md#attack-types) belirtilerini içeriyorsa.
        * Bu istekler, [**Create regexp-based attack indicator** kuralında](../../user-guides/rules/regex-rule.md#creating-and-applying-rule) belirtilen düzenli ifadeyle eşleşiyorsa.

## Gereksinimler

Kaynakları BOLA saldırılarından korumak için ortamınızın aşağıdaki gereksinimleri karşıladığından emin olun:

* Filtreleme düğümü bir proxy sunucusunun veya yük dengeleyicinin arkasında konuşlandırılmışsa, gerçek istemcilerin IP adreslerinin görüntülenmesini [yapılandırın](../using-proxy-or-balancer-en.md).