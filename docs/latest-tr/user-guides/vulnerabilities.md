# Güvenlik Açıklarını Yönetme

Güvenlik açıkları, saldırganlar tarafından sisteminizde yetkisiz kötü niyetli işlemler gerçekleştirmek amacıyla istismar edilebilecek altyapıdaki güvenlik zaafiyetleridir. Wallarm Console’un **Güvenlik Açıkları** bölümü, Wallarm tarafından sisteminizde tespit edilen güvenlik zaafiyetlerini analiz etmenize ve yönetmenize olanak tanır.

Wallarm, [güvenlik zaafiyetlerini tespit etmek](../about-wallarm/detecting-vulnerabilities.md) için çeşitli teknikler kullanır, bunlar şunları içerir:

* **Pasif tespit**: Güvenlik açığı, hem istekler hem yanıtlar dahil gerçek trafiğin analiz edilmesi sonucu tespit edilmiştir. Bu durum, gerçek bir zaafiyetin kullanıldığı bir güvenlik olayında veya isteklerin, doğrudan zaafiyet kullanımı olmaksızın, tehlike işaretleri (örneğin, tehlikeye karşı bozulmuş JWT'ler) göstermesi halinde meydana gelebilir.
* **Threat Replay Testing**: Güvenlik açığı, saldırı doğrulama sürecinde tespit edilmiştir.
* **Vulnerability Scanner**: Güvenlik açığı, [exposed asset](scanner.md) tarama süreci sırasında tespit edilmiştir.
* **API Discovery Insights**: Güvenlik açığı, GET isteklerinin sorgu parametrelerinde PII aktarımı nedeniyle [API Discovery](../api-discovery/overview.md) modülü tarafından tespit edilmiştir.

Wallarm, tespit edilen tüm güvenlik açıklarının geçmişini **Güvenlik Açıkları** bölümünde saklar:

![Güvenlik Açıkları sekmesi](../images/user-guides/vulnerabilities/check-vuln.png)

## Güvenlik Açığı Yaşam Döngüsü

Bir güvenlik açığının yaşam döngüsü, değerlendirme, iyileştirme ve doğrulama aşamalarını içerir. Her aşamada, Wallarm, sorunu kapsamlı bir şekilde ele almanız ve sisteminizi güçlendirmeniz için gerekli verileri sağlar. Ayrıca, Wallarm Console, **Active** ve **Closed** durumlarını kullanarak güvenlik açığı durumunu kolaylıkla izlemenizi ve yönetmenizi sağlar.

* **Active** durumu, güvenlik açığının altyapıda mevcut olduğunu belirtir.
* **Closed** durumu, güvenlik açığı uygulama tarafında çözüldüğünde veya yanlış pozitif olarak belirlendiğinde kullanılır.

    Bir [yanlış pozitif](../about-wallarm/detecting-vulnerabilities.md#false-positives), meşru bir varlığın yanlışlıkla güvenlik açığı olarak tanımlanması durumunda ortaya çıkar. Yanlış pozitif olduğunu düşündüğünüz bir güvenlik açığı ile karşılaşırsanız, güvenlik açığı menüsündeki uygun seçeneği kullanarak raporlayabilirsiniz. Bu, Wallarm'ın güvenlik açığı tespitinin doğruluğunu artırmaya yardımcı olacaktır. Wallarm, güvenlik açığını yanlış pozitif olarak yeniden sınıflandırır, durumunu **Closed** olarak değiştirir ve daha fazla [yeniden kontrol](#verifying-vulnerabilities) işlemine tabi tutmaz.

Güvenlik açıklarını yönetirken, durumlarını manuel olarak değiştirebilirsiniz. Ayrıca, Wallarm, düzenli olarak [yeniden kontrol](#verifying-vulnerabilities) yapar ve sonuçlara bağlı olarak güvenlik açığı durumlarını otomatik olarak günceller.

![Güvenlik açığı yaşam döngüsü](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

Güvenlik açığı yaşam döngüsündeki değişiklikler, güvenlik açığı değişiklik geçmişinde yansıtılır.

## Güvenlik Açıklarını Değerlendirme ve İyileştirme

Wallarm, her güvenlik açığına, risk seviyesini değerlendirmenize ve güvenlik sorunlarını gidermek için adımlar atmanıza yardımcı olacak detayları sağlar:

* Wallarm sisteminde güvenlik açığının benzersiz tanımlayıcısı
* Güvenlik açığının sömürülmesinin sonuçlarının tehlikesini belirten risk seviyesi

    Wallarm, Common Vulnerability Scoring System (CVSS) çerçevesi, bir güvenlik açığının sömürülme olasılığı, sistem üzerindeki potansiyel etkisi vb. ile otomatik olarak risk seviyesini belirtir. Sisteminizin benzersiz gereksinimleri ve güvenlik önceliklerine göre risk seviyesini kendinize göre değiştirebilirsiniz.
* [Güvenlik açığının türü](../attacks-vulns-list.md) (aynı zamanda açığı sömüren saldırı türü ile de ilişkilidir)
* Güvenlik açığının bulunduğu alan ve yol
* Güvenlik açığını sömürmek amacıyla kötü niyetli yük taşımak için kullanılabilecek parametre
* Güvenliğin nasıl [tespit edildiği](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)
* Güvenlik açığının sömürülmesi durumunda etkilenebilecek hedef bileşen; bu **Server**, **Client** veya **Database** olabilir
* Güvenlik açığının tespit edildiği tarih ve saat
* Güvenlik açığının son [doğrulama tarihi](#verifying-vulnerabilities)
* Güvenlik açığına ait detaylı açıklama, sömürü örneği ve önerilen iyileştirme adımları
* İlgili olaylar
* Güvenlik açığı durum değişikliklerinin geçmişi

Güvenlik açıklarını, [arama dizesi](search-and-filters/use-search.md) ve önceden tanımlanmış filtreleri kullanarak filtreleyebilirsiniz.

![Güvenlik açığı detaylı bilgisi](../images/user-guides/vulnerabilities/vuln-info.png)

Tüm güvenlik açıkları, sisteminizi kötü niyetli saldırılara karşı daha savunmasız hale getirdiğinden, uygulama tarafında düzeltilmelidir. Bir güvenlik açığı düzeltilemiyorsa, [virtual patch](rules/vpatch-rule.md) kuralını kullanmak, ilgili saldırıları engelleyerek olay riskini ortadan kaldırmaya yardımcı olabilir.

## Güvenlik Açıklarını Doğrulama <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm, aktif ve kapalı tüm güvenlik açıklarını düzenli olarak yeniden kontrol eder. Bu, daha önce tespit edilmiş bir güvenlik sorunu için altyapının yeniden test edilmesini içerir. Yeniden kontrol sonucu, güvenlik açığının artık mevcut olmadığını gösteriyorsa, Wallarm durumunu **Closed** olarak değiştirir. Bu durum, sunucunun geçici olarak kullanılamaz olması halinde de meydana gelebilir. Aksine, kapalı durumdaki bir güvenlik açığının yeniden kontrolü, açığın hala uygulamada mevcut olduğunu gösteriyorsa, Wallarm durumunu tekrar **Active** olarak günceller.

Aktif güvenlik açıkları ve bir aydan az sürede düzeltilen açıklar günde bir kez yeniden kontrol edilir. Bir aydan fazla sürede düzeltilen güvenlik açıkları haftada bir kez yeniden kontrol edilir.

Başlangıçtaki güvenlik açığı tespit yöntemine bağlı olarak testler, ya **Vulnerability Scanner** ya da **Threat Replay Testing** modülü tarafından gerçekleştirilir. Otomatik yeniden kontrol süreci için yapılandırma ayarları, [**Configure**](#configuring-vulnerability-detection) düğmesi aracılığıyla kontrol edilebilir.

Pasif olarak tespit edilen güvenlik açıklarını yeniden kontrol etmek mümkün değildir.

Bir güvenlik açığını manuel olarak yeniden kontrol etmeniz gerekiyorsa, güvenlik açığı menüsündeki uygun seçeneği kullanarak yeniden kontrol sürecini başlatabilirsiniz:

![Yeniden kontrol edilebilen bir güvenlik açığı](../images/user-guides/vulnerabilities/recheck-vuln.png)

## Güvenlik Açığı Tespit Yapılandırması

**Configure** düğmesini kullanarak, aşağıdaki seçeneklerle güvenlik açığı tespit yapılandırmasını ayrıntılı olarak ayarlayabilirsiniz:

* Vulnerability Scanner kullanarak tespit etmek istediğiniz belirli güvenlik açığı türlerini seçebilirsiniz. Varsayılan olarak, Scanner mevcut olan tüm güvenlik açığı türlerini hedefleyecek şekilde ayarlanmıştır.
* Hem güvenlik açığı hem de [exposed asset](scanner.md) keşif süreçlerini içeren Basic Scanner işlevselliğini etkinleştirebilir / devre dışı bırakabilirsiniz. Varsayılan olarak, bu işlevsellik etkin durumdadır.

    Aynı geçiş anahtarını **Scanner** bölümünde de bulabilirsiniz. Bir bölümdeki anahtarı değiştirmeniz, diğer bölümdeki ayarın otomatik olarak güncellenmesini sağlar.
* **Recheck vulnerabilities** seçeneğini kullanarak Scanner ile güvenlik açığı yeniden kontrolünü etkinleştirebilir / devre dışı bırakabilirsiniz.
* Güvenlik açığı tespiti ve yeniden kontrolü için **Threat Replay Testing** modülünü etkinleştirebilir / devre dışı bırakabilirsiniz. Bu seçeneğin yalnızca yeniden kontrol sürecini değil, modülün kendisini kontrol ettiğine dikkat edin.

    Varsayılan olarak, bu modül devre dışıdır; etkinleştirmeden önce yapılandırmasıyla ilgili [best practices](../vulnerability-detection/threat-replay-testing/setup.md)’i öğrenin.

![Vuln scan settings](../images/user-guides/vulnerabilities/vuln-scan-settings.png)

Ayrıca, UI’nin [Scanner](scanner.md) bölümünde, Vulnerability Scanner tarafından hangi exposed asset’lerin taranacağını ve her varlık için Scanner tarafından üretilmesine izin verilen RPS/RPM miktarını kontrol edebilirsiniz.

## Güvenlik Açığı Raporunu İndirme

UI’deki ilgili düğmeyi kullanarak, güvenlik açığı verilerini PDF veya CSV raporu olarak dışa aktarabilirsiniz. Wallarm, raporu belirtilen adrese e-posta ile gönderecektir.

PDF, güvenlik açığı ve olay özetlerini içeren görsel olarak zengin raporlar sunmak için uygundur; CSV ise her güvenlik açığı hakkında detaylı bilgi sağlayarak teknik amaçlar için daha elverişlidir. CSV, panolar oluşturmak, en savunmasız API host/uygulamalarının listesini üretmek ve daha fazlası için kullanılabilir.

## Güvenlik Açıklarını Almak için API Çağrısı

Güvenlik açığı detaylarını almak için, Wallarm Console UI’ı kullanmanın yanı sıra [Wallarm API'ye doğrudan çağrı](../api/overview.md) yapabilirsiniz. Aşağıda ilgili API çağrısının örneği bulunmaktadır.

Son 24 saat içinde **Active** durumundaki ilk 50 güvenlik açığını almak için, aşağıdaki istekte `TIMESTAMP` kısmını 24 saat önceki tarihin [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürülmüş hali ile değiştirin:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"