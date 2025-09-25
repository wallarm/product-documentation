# Uç Nokta Risk Puanı <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md), API envanterinizdeki her uç nokta için otomatik olarak bir **risk puanı** hesaplar. Risk puanı, hangi uç noktaların saldırı hedefi olma olasılığının daha yüksek olduğunu anlamanıza ve güvenlik çalışmalarınızı bu uç noktalara odaklamanıza yardımcı olur.

## Risk puanı faktörleri

Risk puanı, her biri nihai risk puanı hesaplanırken kendi ağırlığına sahip çeşitli faktörlerden oluşur. Varsayılan olarak, tüm faktörler arasından en yüksek ağırlık uç nokta risk puanı olarak kullanılır.

| Faktör | Açıklama | Varsayılan ağırlık |
| --- | --- | --- |
| Aktif güvenlik açıkları | [Aktif güvenlik açıkları](../about-wallarm/detecting-vulnerabilities.md), yetkisiz veri erişimi veya bozulmasına neden olabilir. | 9 |
| Potansiyel olarak BOLA'ya karşı savunmasız | [Değişken yol parçalarının](exploring.md#variability) varlığı, ör. kullanıcı kimlikleri, `/api/articles/author/{parameter_X}` gibi. Saldırganlar, nesne kimliklerini manipüle ederek ve yetersiz istek kimlik doğrulaması durumunda, nesnenin hassas verilerini okuyabilir veya değiştirebilirler ([BOLA saldırıları](../admin-en/configuration-guides/protecting-against-bola.md)). | 6 |
| Hassas veriler içeren parametreler | Saldırganlar, API'lere doğrudan saldırmak yerine [hassas verileri](overview.md#sensitive-data-detection) çalabilir ve bunları kullanarak kaynaklarınıza kolayca ulaşabilir. | 8 |
| Sorgu ve gövde parametrelerinin sayısı | Çok sayıda parametre, saldırı yönlerinin sayısını artırır. | 6 |
| XML / JSON nesnelerini kabul eder | İsteklerde iletilen XML veya JSON nesneleri, saldırganlar tarafından kötü amaçlı XML harici varlıklarını ve enjeksiyonları sunucuya aktarmak için kullanılabilir. | 6 |
| Sunucuya dosya yüklemeye izin verir | Uç noktalar sıklıkla [Remote Code Execution (RCE)](../attacks-vulns-list.md#remote-code-execution-rce) saldırılarının hedefidir; bu saldırılarda kötü amaçlı kod içeren dosyalar sunucuya yüklenir. Bu uç noktaları güvence altına almak için, yüklenen dosyaların uzantıları ve içerikleri [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) tarafından önerildiği şekilde doğru şekilde doğrulanmalıdır. | 6 |

Faktörlerin önemine ilişkin anlayışınıza göre risk puanı tahminini uyarlamak için, risk puanı hesaplamasında her bir faktörün ağırlığını ve hesaplama yöntemini [yapılandırabilirsiniz](#customizing-risk-score-calculation).

## Risk puanı düzeyleri

Risk puanı `1` (en düşük) ile `10` (en yüksek) arasında olabilir:

| Değer | Risk düzeyi | Renk |
| --------- | ----------- | --------- |
| 1 ila 3 | Düşük | Gri |
| 4 ila 7 | Orta | Turuncu |
| 8 ila 10 | Yüksek | Kırmızı |

* `1`, bu uç nokta için risk faktörü olmadığı anlamına gelir.
* Kullanılmayan uç noktalar için risk puanı görüntülenmez (`N/A`).
* Risk puanına göre **Risk** sütununda sıralayın.
* `High`, `Medium` veya `Low` için **Risk score** filtresini kullanın.

Bir uç noktanın risk puanına neyin neden olduğunu ve riski nasıl azaltabileceğinizi anlamak için uç nokta ayrıntılarına gidin:

![API Discovery - Risk puanı](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

Ayrıca API'lerin risk puanı düzeylerine göre özetini [US](https://us1.my.wallarm.com/dashboard-api-discovery) veya [EU](https://my.wallarm.com/dashboard-api-discovery) Cloud içinde **Dashboards** → **API Discovery** bölümünde alabilirsiniz.

## Risk puanı hesaplamasını özelleştirme

Risk puanı hesaplamasında her bir faktörün ağırlığını ve hesaplama yöntemini yapılandırabilirsiniz.

Risk puanının nasıl hesaplandığını değiştirmek için: 

1. **API Discovery** bölümünde **Configure API Discovery** düğmesine tıklayın.
1. **Risk scoring** sekmesine geçin.
1. Hesaplama yöntemini seçin: highest veya average weight.
1. Gerekirse, risk puanını etkilemesini istemediğiniz faktörleri devre dışı bırakın.
1. Kalanlar için ağırlıkları ayarlayın.

    ![API Discovery - Risk puanı ayarı](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)

1. Değişiklikleri kaydedin. Wallarm, birkaç dakika içinde yeni ayarlara uygun olarak uç noktalarınız için risk puanını yeniden hesaplayacaktır.