# Güvenlik Açıklarını Yönetme

Güvenlik açıkları, saldırganların sisteminizde yetkisiz ve kötü niyetli işlemler gerçekleştirmek için istismar edebileceği altyapıdaki güvenlik kusurlarıdır. Wallarm Console içinde, Wallarm tarafından sisteminizde tespit edilen güvenlik kusurlarını analiz edip yönetebilirsiniz:


* **Vulnerabilities** bölümünde
* **AASM** → **Security Issues** bölümünde

Wallarm, güvenlik zafiyetlerini [keşfetmek](../about-wallarm/detecting-vulnerabilities.md) için çeşitli teknikler kullanır, bunlar şunları içerir:

* **Pasif tespit**: güvenlik açığı, talepler ve yanıtlar dahil gerçek trafiğin analiz edilmesiyle bulunmuştur. Bu, gerçek bir kusurun istismar edildiği bir güvenlik olayı sırasında veya taleplerin doğrudan bir kusur istismarı olmadan, örneğin ele geçirilmiş JWT’ler gibi güvenlik açığı belirtileri göstermesi durumunda gerçekleşebilir.
* **Threat Replay Testing**: güvenlik açığı, Wallarm tarafından başlatılan [saldırı tekrar yürütme güvenlik testleri](../vulnerability-detection/threat-replay-testing/overview.md) sırasında bulunmuştur.
* **API Attack Surface Management (AASM)**: harici host’ları ve onların API’lerini [keşfeder](../api-attack-surface/overview.md), ardından her biri için eksik WAF/WAAP çözümlerini belirler ve güvenlik açıklarını bulur.
* **API Discovery insights**: güvenlik açığı, GET isteklerinin sorgu parametrelerinde PII aktarımı nedeniyle [API Discovery](../api-discovery/overview.md) modülü tarafından bulunmuştur.

Wallarm, tespit edilen tüm güvenlik açıklarının geçmişini **Vulnerabilities** bölümünde saklar:

![Vulnerabilities tab](../images/user-guides/vulnerabilities/check-vuln.png)

## Güvenlik açığı yaşam döngüsü

Bir güvenlik açığının yaşam döngüsü değerlendirme, giderme ve doğrulama aşamalarını içerir. Her aşamada, Wallarm sorunu kapsamlı şekilde ele almanız ve sisteminizi güçlendirmeniz için gerekli verileri sağlar. Ek olarak, Wallarm Console, **Active** ve **Closed** durumlarını kullanarak güvenlik açığı durumunu kolayca izlemenizi ve yönetmenizi sağlar.

* **Active** durumu, güvenlik açığının altyapıda var olduğunu gösterir.
* **Closed** durumu, güvenlik açığının uygulama tarafında giderildiğinde veya yanlış pozitif olarak belirlendiğinde kullanılır.

    Bir [yanlış pozitif](../about-wallarm/detecting-vulnerabilities.md#false-positives), meşru bir varlığın yanlışlıkla güvenlik açığı olarak tanımlanması durumunda ortaya çıkar. Yanlış pozitif olduğunu düşündüğünüz bir güvenlik açığı ile karşılaşırsanız, güvenlik açığı menüsündeki uygun seçeneği kullanarak bunu bildirebilirsiniz. Bu, Wallarm’ın güvenlik açığı tespitinin doğruluğunu artırmaya yardımcı olacaktır. Wallarm, güvenlik açığını yanlış pozitif olarak yeniden sınıflandırır, durumunu **Closed** olarak değiştirir ve daha fazla [yeniden kontrol](#verifying-vulnerabilities) uygulamaz.

Güvenlik açıklarını yönetirken, güvenlik açığı durumlarını manuel olarak değiştirebilirsiniz. Ek olarak, Wallarm güvenlik açıklarını düzenli olarak [yeniden kontrol eder](#verifying-vulnerabilities) ve sonuçlara bağlı olarak güvenlik açıklarının durumunu otomatik olarak değiştirir.

![Güvenlik açığı yaşam döngüsü](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

Güvenlik açığı yaşam döngüsündeki değişiklikler, güvenlik açığı değişiklik geçmişine yansıtılır.

## Güvenlik açıklarını değerlendirme ve giderme

Wallarm, her bir güvenlik açığı için risk düzeyini değerlendirmenize ve güvenlik sorunlarını ele almak için adımlar atmanıza yardımcı olan ayrıntılar sağlar:

* Wallarm sistemindeki güvenlik açığının benzersiz tanımlayıcısı
* Güvenlik açığının istismar edilmesinin sonuçlarının tehlikesini gösteren risk seviyesi

    Wallarm, Common Vulnerability Scoring System (CVSS) çerçevesini, bir güvenlik açığının istismar edilme olasılığını, sistem üzerindeki potansiyel etkisini vb. kullanarak güvenlik açığı riskini otomatik olarak belirtir. Kendi benzersiz sistem gereksinimleriniz ve güvenlik öncelikleriniz doğrultusunda risk seviyesini kendi değerinize göre değiştirebilirsiniz.
* Güvenlik açığının [türü](../attacks-vulns-list.md); bu aynı zamanda güvenlik açığını istismar eden saldırı türlerine karşılık gelir
* Güvenlik açığının bulunduğu alan adı ve yol
* Güvenlik açığını istismar eden kötü amaçlı payload’ın geçirilebileceği parametre
* Güvenlik açığının [tespit edildiği](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) yöntem
* Güvenlik açığı istismar edilirse etkilenebilecek hedef bileşen; **Server**, **Client**, **Database** olabilir
* Güvenlik açığının tespit edildiği tarih ve saat
* Güvenlik açığının son [doğrulama tarihi](#verifying-vulnerabilities)
* Ayrıntılı güvenlik açığı açıklaması, istismar örneği ve önerilen giderme adımları
* İlgili olaylar
* Güvenlik açığı durumu değişiklik geçmişi

Güvenlik açıklarını [arama dizesi](search-and-filters/use-search.md) ve ön tanımlı filtreleri kullanarak filtreleyebilirsiniz.

![Güvenlik açığına ilişkin ayrıntılı bilgiler](../images/user-guides/vulnerabilities/vuln-info.png)

Tüm güvenlik açıkları, sisteminizi kötü amaçlı eylemlere karşı daha savunmasız hale getirdiğinden uygulama tarafında düzeltilmelidir. Bir güvenlik açığı düzeltilemiyorsa, [virtual patch](rules/vpatch-rule.md) kuralını kullanmak ilgili saldırıları engellemeye ve olay riskini ortadan kaldırmaya yardımcı olabilir.

## Verifying vulnerabilities <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm, hem aktif hem de kapatılmış güvenlik açıklarını düzenli olarak yeniden kontrol eder. Bu, daha önce keşfedilmiş bir güvenlik sorununa ilişkin altyapının tekrar test edilmesini içerir. Yeniden kontrol sonucunda güvenlik açığının artık mevcut olmadığı anlaşılıyorsa, Wallarm durumunu **Closed** olarak değiştirir. Bu, sunucu geçici olarak kullanılamıyorsa da meydana gelebilir. Tersine, kapatılmış bir güvenlik açığının yeniden kontrolü, uygulamada hâlâ mevcut olduğunu gösterirse, Wallarm durumunu tekrar **Active** olarak değiştirir.

Aktif güvenlik açıkları ve bir aydan daha kısa süre önce düzeltilen güvenlik açıkları günde bir kez yeniden kontrol edilir. Bir aydan daha uzun süre önce düzeltilen güvenlik açıkları ise haftada bir kez yeniden kontrol edilir.

Başlangıçtaki güvenlik açığı tespit yöntemine bağlı olarak, testler ya **API Attack Surface Management (AASM)** ya da **Threat Replay Testing** modülü tarafından gerçekleştirilir.

Pasif olarak tespit edilen güvenlik açıklarının yeniden kontrol edilmesi mümkün değildir.

Bir güvenlik açığını manuel olarak yeniden kontrol etmeniz gerekiyorsa, güvenlik açığı menüsündeki uygun seçeneği kullanarak yeniden kontrol sürecini tetikleyebilirsiniz:

![Yeniden kontrol edilebilen bir güvenlik açığı](../images/user-guides/vulnerabilities/recheck-vuln.png)

## Güvenlik açığı raporunu indirme

Güvenlik açığı verilerini UI’daki ilgili düğmeyi kullanarak PDF veya CSV raporu olarak dışa aktarabilirsiniz. Wallarm, raporu belirtilen adrese e-posta ile gönderir.

PDF, güvenlik açığı ve olay özetleriyle görsel olarak zengin raporlar sunmak için uygundur; CSV ise her bir güvenlik açığı hakkında ayrıntılı bilgi sağlayarak teknik amaçlar için daha uygundur. CSV; panolar oluşturmak, en savunmasız API host’ları/uygulamalarının bir listesini üretmek ve daha fazlası için kullanılabilir.

## Güvenlik açıklarını almak için API çağrısı

Güvenlik açığı ayrıntılarını almak için Wallarm Console UI’yı kullanmanın yanı sıra [Wallarm API’yi doğrudan çağırabilirsiniz](../api/overview.md). Aşağıda ilgili API çağrısına bir örnek bulunmaktadır.

Son 24 saat içinde **Active** durumundaki ilk 50 güvenlik açığını almak için, aşağıdaki isteği kullanın ve `TIMESTAMP` değerini 24 saat önceki tarihin [Unix zaman damgası](https://www.unixtimestamp.com/) biçimine dönüştürülmüş haliyle değiştirin:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"