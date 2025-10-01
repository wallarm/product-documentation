# Threat Management Genel Bakış

Wallarm'ın Threat Management'ı güvenlik duruşunuza ilişkin tam, gerçek zamanlı bir görünüm sağlar ve kullanılan koruma araçlarını kontrol etmenize olanak tanır. Bu makale, Threat Management bileşenlerine, amaçlarına ve başlıca imkanlarına genel bir bakış sunar.

## Genel Bakış

Threat Management neler olup bittiğine dair tam bir resim sunar: 

* Saldırılar, uç noktalar, çalışır durumdaki koruma araçları için görselleştirilmiş, etkileşimli özet mi istiyorsunuz? [dashboards](#dashboards) kullanın.
* Gerçekleşen saldırıları, alınan önlemleri ve bu önlemleri sağlayan araçları görmek mi istiyorsunuz? [attacks](#attacks) ile çalışın, araçları kolayca [ayarlayın](check-attack.md#responding-to-attacks).
* Aynı şekilde [incidents](#incidents) ile çalışın.
* Tekil bir saldırı size olup biteni tam olarak anlatmıyor mu? Saldırınızın parçası olduğu [session](#sessions) görünümüne geçin ve kullanıcının önceki ve sonraki tüm aktivitelerini görün.
* Session belirli uç noktalar etrafında mı? Wallarm'ın otomatik olarak keşfettiği tam uç nokta bilgisine geçin ([API Discovery](../../api-discovery/overview.md) gerektirir). Burada uç noktanız için hızlıca kurallar oluşturun.
* Saldırılar, olaylar veya zafiyetlerle ilgili bilgilendirici belgeler mi istiyorsunuz? Seçtiğiniz filtrelenmiş verilerle PDF veya CSV [reports](#reports) oluşturun.

![Threat Management](../../images/user-guides/events/tm-diagram.png)

Tüm Threat Management bileşenleri gelişmiş arama ve filtreleme yetenekleri içerir. Ayrıca, seçtiğiniz filtrelenmiş içerikle saldırılar ve olaylar için PDF ve CSV raporlar oluşturabilirsiniz. Wallarm, istekleri mantıksal olarak saldırılar ve sessions içine birleştirmek için gelişmiş gruplama mekanizmaları kullanır ve uygulama mantığınıza tam uyum sağlamak için Sessions tespitinin nasıl yapıldığını değiştirmenize olanak tanır.

## Dashboards

Threat Management'ın dashboards'ı güvenlik sınırınız ve duruşunuz için görselleştirilmiş özetler sunar. Tamamı etkileşimli olan bu içerikler, sistemin farklı bölümlerindeki ayrıntılara ve verilere ile yapılandırma araçlarına hızlı erişim sağlar.

![Threat Management - dashboards](../../images/user-guides/events/tm-overview-dashboards.png)

* Kötü amaçlı trafik hacmini ve bunun saldırı türlerine, kaynaklara, protokollere, kimlik doğrulama yöntemlerine vb. göre dağılımını [**Threat Prevention**](../../user-guides/dashboards/threat-prevention.md) dashboard'ı ile net biçimde görün.
* Wallarm'ın API Discovery özelliği tarafından toplanan API verilerinizi [**API Discovery**](../../user-guides/dashboards/api-discovery.md) dashboard'ı ile gözden geçirin.
* Wallarm servislerinin NIST siber güvenlik çerçevesi ile nasıl hizalandığını [**NIST Cyber Security Framework 2.0**](../../user-guides/dashboards/nist-csf-2.md) dashboard'ı üzerinden görün.
* [**OWASP API Security Top 10 - 2023**](../../user-guides/dashboards/owasp-api-top-ten.md) dashboard'ında OWASP API Security Top 10 2023 kapsamınızı kontrol edin ve güvenlik kontrollerini proaktif olarak uygulayın.

## Attacks

Wallarm uygulama trafiğini sürekli analiz eder, saldırıları gerçek zamanlı olarak tespit eder ve etkisiz hale getirir. Wallarm Console içindeki [**Attacks**](check-attack.md) bölümü, güvenlik sınırınıza yönelik mevcut sızma girişimlerini analiz etmek ve bunlara karşı korunduğunuzdan emin olmak için merkezi merkezdir; ayrıca ek güvenlik önlemlerini yapılandırma aracıdır.

![Threat Management - Attacks](../../images/user-guides/events/filter-for-falsepositive.png)

**Attacks** bölümüyle şunları yapabilirsiniz:

* Mevcut saldırıları ve Wallarm'ın aldığı önlemleri görün ve görüntülediklerinizi şunlarla sınırlandırın:

    * Belirli türlerdeki saldırılar
    * Belirli IP'lerden veya coğrafi konumlardan
    * Belirli bir zamanda gerçekleşen
    * Belirli uygulamalara veya etki alanlarına yönelik
    * vb.

* Aynı bilgiyi farklı dönemler için görüntüleyin - son 3 aya kadar
* Gelecekte benzer saldırıların ele alınması için [rules](../../user-guides/rules/rules.md#what-you-can-do-with-rules) oluşturun veya değiştirin
* [false positives](check-attack.md#false-positives) vurgulayarak Wallarm'ın karar verme sürecini düzeltin

## Incidents

Incidents, doğrulanmış bir zafiyeti hedef alan saldırılardır. Wallarm Console'daki [**Incidents**](check-incident.md) bölümü, tüm genel saldırı verilerini sömürmeye çalıştığı zafiyetle ilişkilendirir ve böylece şunları yapabilirsiniz:

* **Attacks** içinde mevcut olan tüm bilgi ve araçlara sahip olun
* İlgili zafiyet verilerini ve onunla ilgili tam bilgileri edinin 

![Threat Management - Incidents](../../images/user-guides/events/incident-vuln.png)

## Sessions

[**API Sessions**](../../api-sessions/overview.md)'ın ele aldığı birincil zorluk, Wallarm tarafından tespit edilen tekil saldırılar görüntülendiğinde tam bağlam eksikliğidir. Her session içindeki istek ve yanıtların mantıksal sırasını yakalayarak, API Sessions daha geniş saldırı kalıplarına dair içgörüler sağlar ve güvenlik önlemlerinin etki ettiği iş mantığı alanlarını belirlemeye yardımcı olur.

![!API Sessions bölümü - izlenen sessions](../../images/api-sessions/api-sessions.png)

## Reports

Saldırılar, incidents veya zafiyetler için PDF veya CSV [reports](../../user-guides/search-and-filters/custom-report.md) oluşturun. Seçilmiş veriler mi istiyorsunuz? Filtreleri uygulayın; yalnızca filtrelenen veriler raporun bir parçası olacaktır.

![Attacks - rapor oluşturma](../../images/user-guides/search-and-filters/custom-report.png)
