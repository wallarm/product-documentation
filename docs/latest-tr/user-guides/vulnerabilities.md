# Zafiyetlerin Yönetimi

Zafiyetler, altyapıdaki güvenlik açıklarıdır ve saldırganlar tarafından yetkisiz hasarlı eylemler gerçekleştirmek için kullanılabilirler. Wallarm Konsolundaki **Zafiyetler** bölümü, sistemlerinizde Wallarm tarafından algılanmış olan güvenlik hatalarını analiz etme ve yönetme imkanı sunar.

Wallarm, [keşfetme](../about-wallarm/detecting-vulnerabilities.md) için çeşitli teknikler kullanır. Bunlar arasında:

* **Pasif algılama**: zafiyet, meydana gelen güvenlik olayı nedeniyle bulundu
* **Aktif tehdit doğrulaması**: zafiyet, saldırının doğrulama süreci sırasında bulundu
* **Zafiyet Tarayıcı**: zafiyet, [açığa çıkan varlık](scanner.md) tarama süreci sırasında bulundu

Wallarm, algılanan tüm zafiyetlerin geçmişini **Zafiyetler** bölümüne kaydeder:

![Zafiyetler sekmesi](../images/user-guides/vulnerabilities/check-vuln.png)

## Zafiyet ömrü

Bir zafiyetin yaşam döngüsü, değerlendirme, düzeltme ve doğrulama aşamalarını içerir. Her aşamada, Wallarm size sorunu eksiksiz bir şekilde ele almak ve sistemnizi güçlendirmek için gerekli verileri sağlar. Ayrıca, Wallarm Konsolu, **Aktif** ve **Kapalı** durumlarını kullanarak zafiyetin durumunu kolaylıkla izlemenize ve yönetmenize olanak sağlar.

* **Aktif** durum, zafiyetin altyapıyı tehdit ettiğini gösterir.
* **Kapalı** durum, zafiyetin uygulama tarafında çözüldüğü ya da yanlış bir pozitif olduğu belirlendiğinde kullanılır.

    Bir [yanlış pozitif](../about-wallarm/detecting-vulnerabilities.md#false-positives), meşru bir varlığın yanlışlıkla bir zafiyet olarak tanımlanması durumudur. Eğer yanlış pozitif olduğuna inandığınız bir zafiyetle karşılaşırsanız, bunu zafiyet menüsündeki uygun seçenekle bildirebilirsiniz. Bu, Wallarm'ın zafiyet tanıma doğruluğunu artıracaktır. Wallarm, zafiyeti yanlış pozitif olarak yeniden sınıflandırır, durumunu **Kapalı**'ya değiştirir ve bunu daha fazla [yeniden kontrol](#verifying-vulnerabilities) etmez.

Zafiyetleri yönetirken, zafiyet durumlarını manuel olarak değiştirebilirsiniz. Ayrıca, Wallarm düzenli olarak zafiyetleri [yeniden kontrol](#verifying-vulnerabilities) eder ve sonuçlara bağlı olarak zafiyetlerin durumunu otomatik olarak değiştirir.

![Zafiyet ömrü](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

Zafiyetlerin yaşam döngüsündeki değişiklikler, zafiyetin değişim geçmişinde yansıtılır.

## Zafiyetleri değerlendirme ve giderme

Wallarm, risk seviyesini değerlendirmenize ve güvenlik sorunlarını ele almak için adımlar atmaya yardımcı olacak detaylarla her zafiyet sağlar:

* Wallarm sistemi içinde zafiyetin eşsiz tanımlayıcısı
* Zafiyetin istismarının sonuçlarının tehlikesini belirten risk seviyesi

    Wallarm, ortak zafiyet puanlama sistem (CVSS) çerçevesini kullanarak otomatik olarak zafiyet riskini gösterir, bir zafiyetin istismar olasılığı, bunun sistem üzerindeki potansiyel etkisi gibi. Sisteminizin benzersiz gereksinimlerine ve güvenlik önceliklerinize dayanarak risk seviyesini kendi değerinize değiştirebilirsiniz.
* Zafiyetin [türü](../attacks-vulns-list.md), bu tür aynı zamanda zafiyeti istismar eden saldırı türüne de karşılık gelir
* Zafiyetin bulunduğu alan ve yol
* Zafiyeti istismar eden kötü amaçlı yükü geçirmek için kullanılabilecek parametre
* Zafiyetin hangi yöntemle [algılandığı](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)
* Bir zafiyetin istismar edilmesi durumunda etkilenebilecek hedef bileşen, **Sunucu**, **İstemci**, **Veritabanı** olabilir
* Zafiyetin algılandığı tarih ve saat
* Zafiyetin [son doğrulama tarihi](#verifying-vulnerabilities)
* Ayrıntılı zafiyet açıklaması, istismar örneği ve önerilen düzeltme adımları
* İlgili olaylar
* Zafiyet durum değişiklikleri geçmişi

Zafiyetleri, [arama string](search-and-filters/use-search.md) ve önceden tanımlanmış filtreleri kullanarak filtreleyebilirsiniz.

![Ayrıntılı zafiyet bilgisi](../images/user-guides/vulnerabilities/vuln-info.png)

Tüm zafiyetlerin uygulama tarafında düzeltilemesi gereklidir çünkü bunlar sistemnizi kötü amaçlı eylemlere daha yatkın hale getirir. Bir zafiyet düzeltilemiyorsa, [sanal yamam](rules/vpatch-rule.md) kuralını kullanmak ilgili saldırıları engellemeye ve bir olay riskini ortadan kaldırmaya yardımcı olabilir.

## Zafiyetleri doğrulama <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm, aktif ve kapatılmış zafiyetleri düzenli olarak yeniden kontrol eder. Bu, daha önce keşfedilen bir güvenlik sorununu yeniden test etmeyi içerir. Yeniden kontrol sonucu, zafiyetin artık mevcut olmadığını gösteriyorsa, Wallarm durumunu **Kapalı**'ya değiştirir. Bu, sunucunun geçici olarak kullanılamaz olması durumunda da olabilir. Tersine, bir zafiyetin kapalı olduğunun yeniden kontrol edilmesi, zafiyetin hala uygulama içinde var olduğunu gösteriyorsa, Wallarm durumunu **Aktif**'e geri döndürür.

Aktif zafiyetler ve bir aydan az bir süre önce düzeltilen zafiyetler günde bir kez yeniden kontrol edilir. Bir aydan fazla bir süre önce düzeltilmiş olan zafiyetler haftada bir kere yeniden kontrol edilir.

Başlangıçtaki zafiyet algılama yöntemine bağlı olarak, test, **Zafiyet Tarayıcı** veya **Aktif Tehdit Doğrulama** modülü tarafından gerçekleştirilir. Otomatik yeniden kontrol süreci için yapılandırma ayarları, [**Yapılandır**](#configuring-vulnerability-detection) düğmesi aracılığıyla kontrol edilebilir.

Pasif olarak algılanan zafiyetlerin yeniden kontrol edilmesi mümkün değildir.

Bir zafiyeti manuel olarak yeniden kontrol etmeniz gerekiyorsa, zafiyet menüsündeki uygun seçeneği kullanarak yeniden kontrol sürecini başlatabilirsiniz:

![Yeniden kontrol edilebilecek bir zafiyet](../images/user-guides/vulnerabilities/recheck-vuln.png)

## Zafiyet algılamasının yapılandırılması

Zafiyet algılama konfigürasyonu, **Yapılandır** düğmesi kullanılarak daha da geliştirilebilir, bu yöntemle aşağıdaki seçenekler ayarlanabilir:

* Zafiyet Tarayıcısının algılamasını istediğiniz belirli zafiyet türlerini seçebilirsiniz. Tarayıcı varsayılan olarak tüm mevcut zafiyet türlerini hedefi alacak şekilde ayarlanmıştır.
* Zafiyet ve [açığa çıkan varlık](scanner.md) keşif süreçlerini içeren **Temel Tarayıcı işlevini** etkinleştirin / devre dışı bırakın. Bu işlevsellik varsayılan olarak etkindir.

    Aynı anahtar anahtarı **Tarayıcı** bölümünde de bulabilirsiniz. Anahtarı bir bölümde değiştirmek, diğer bölümdeki ayarı da otomatik olarak günceller.
* Tarayıcı ile zafiyetlerin yeniden kontrolünü etkinleştirin / devre dışı bırakın **Zafiyetleri Yeniden Kontrol Et** seçeneği kullanılarak.
* Zafiyet tespiti ve yeniden kontrolü için **Aktif tehdit doğrulaması** modülünü etkinleştirin / devre dışı bırakın. Bu seçenek, modülün kendisini kontrol eder, sadece yeniden kontrol sürecini değil.

    Bu modül varsayılan olarak devre dışıdır, etkinleştirmeden önce yapılandırmasının [en iyi uygulamalarını](../vulnerability-detection/threat-replay-testing/setup.md) öğrenin.

![Zafiyet tarama ayarları](../images/user-guides/vulnerabilities/vuln-scan-settings.png)

Ayrıca, kullanıcı arayüzündeki [**Tarayıcı**](scanner.md) bölümünde hangi açığa çıkan varlıkların Zafiyet Tarayıcısı tarafından taranması gerektiğini ve Tarayıcının her varlık için izin verilen RPS/RPM'yi kontrol edebilirsiniz.

## Zafiyet raporunu indirme

Zafiyet verilerini bir PDF veya CSV raporuna dışa aktarabilirsiniz. Bunun için kullanıcı arayüzündeki ilgili düğmeyi kullanabilirsiniz. Wallarm, raporu belirtilen adrese e-posta ile gönderecektir.

PDF, zafiyet ve olay özetleriyle görsel açıdan zengin raporlar sunmak için iyidir, CSV ise her zafiyet hakkında ayrıntılı bilgi sağladığından teknik amaçlar için daha uygundur. CSV, gösterge panoları oluşturmak, en savunmasız API ana makine/uygulama listesini oluşturmak ve daha fazlası için kullanılabilir.

## Zafiyetleri almak için API çağrısı

Zafiyet ayrıntılarını almak için, Wallarm Konsolu Kullanıcı Arayüzünü kullanmanın yanı sıra Wallarm API'sini [direkt olarak çağırabilirsiniz](../api/overview.md). Aşağıda, ilgili API çağrısının örneği yer almaktadır.

Son 24 saat içinde durumu **Aktif** olan ilk 50 zafiyeti almak için, aşağıdaki isteği kullanın ve `TIMESTAMP`'ı, tarihi 24 saat önceye dönüştürülen [Unix Zaman Damgası](https://www.unixtimestamp.com/) biçimine dönüştürerek yerine koyun:

--8<-- "../include-tr/api-request-examples/get-vulnerabilities.md"