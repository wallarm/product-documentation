# Uç Nokta Risk Skoru <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md) otomatik olarak API envanterinizdeki her uç nokta için bir **risk skoru** hesaplar. Risk skoru, hangi uç noktaların saldırı hedefi olmasının en muhtemel olduğunu anlamanıza ve bu nedenle güvenlik çabalarınıza odaklanmanız gereken noktaları belirlemenize olanak tanır.

## Risk Skoru Faktörleri

Risk skoru, nihai risk skoru hesaplanırken her birinin kendi ağırlığına sahip çeşitli faktörlerden oluşur. Varsayılan olarak, tüm faktörlerden en yüksek ağırlık uç nokta risk skoru olarak kullanılır.

| Factor | Description | Default weight |
| --- | --- | --- |
| Aktif Güvenlik Açıkları | [Active vulnerabilities](../about-wallarm/detecting-vulnerabilities.md) yetkisiz veri erişimine veya bozulmasına neden olabilir. | 9 |
| Muhtemelen BOLA'ya Karşı Savunmasız | Kullanıcı kimlikleri gibi [değişken yol parçalarının](exploring.md#variability) varlığı, örneğin `/api/articles/author/{parameter_X}`. Saldırganlar nesne kimliklerini manipüle edebilir ve yetersiz istek doğrulaması durumunda nesnenin hassas verilerini okuyabilir veya değiştirebilir ([BOLA attacks](../admin-en/configuration-guides/protecting-against-bola.md)). | 6 |
| Hassas Verilere Sahip Parametreler | API'lere doğrudan saldırmak yerine, saldırganlar [hassas verileri](overview.md#sensitive-data-detection) çalabilir ve kaynaklarınıza sorunsuz bir şekilde erişmek için kullanabilir. | 8 |
| Sorgu ve Gövde Parametreleri Sayısı | Çok sayıda parametre, saldırı yönlerinin sayısını artırır. | 6 |
| XML / JSON Nesnelerini Kabul Eder | İsteklerde gönderilen XML veya JSON nesneleri, saldırganlar tarafından sunucuya kötü amaçlı XML harici varlıkları ve enjeksiyonları aktarmak için kullanılabilir. | 6 |
| Sunucuya Dosya Yüklemeye İzin Verir | Uç noktalar, kötü amaçlı kod içeren dosyaların sunucuya yüklendiği [Remote Code Execution (RCE)](../attacks-vulns-list.md#remote-code-execution-rce) saldırıları tarafından sıklıkla hedef alınır. Bu uç noktaları güvence altına almak için, [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) tarafından önerildiği gibi, yüklenen dosya uzantıları ve içerikleri doğru şekilde doğrulanmalıdır. | 6 |

Risk skoru tahminini, faktörlerin önemine ilişkin anlayışınıza göre uyarlamak için risk skoru hesaplamasında her bir faktörün ağırlığını ve hesaplama yöntemini [konfigüre edebilirsiniz](#customizing-risk-score-calculation).

## Risk Skoru Düzeyleri

Risk skoru `1` (en düşük) ile `10` (en yüksek) arasında olabilir:

| Value | Risk level | Color |
| --------- | ----------- | --------- |
| 1 to 3 | Düşük | Gray |
| 4 to 7 | Orta | Orange |
| 8 to 10 | Yüksek | Red |

* `1`, bu uç nokta için hiç risk faktörü olmadığı anlamına gelir.
* Kullanılmayan uç noktalar için risk skoru görüntülenmez (`N/A`).
* **Risk** sütununda risk skoruna göre sıralayın.
* **Risk score** filtresini kullanarak `High`, `Medium` veya `Low` filtreleyin.

Uç noktanın risk skoruna neyin sebep olduğunu ve riski nasıl azaltacağınızı anlamak için uç nokta detaylarına gidin:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

Ayrıca, **Dashboards** → **API Discovery** bölümünde [US](https://us1.my.wallarm.com/dashboard-api-discovery) veya [EU](https://my.wallarm.com/dashboard-api-discovery) Cloud'da API'lerin risk skoru düzeylerine göre özet bilgileri de alabilirsiniz.

## Risk Skoru Hesaplamasını Özelleştirme

Risk skoru hesaplamasında her bir faktörün ağırlığını ve hesaplama yöntemini yapılandırabilirsiniz.

Risk skorunun hesaplanış şeklini değiştirmek için: 

1. **API Discovery** bölümünde **Configure API Discovery** butonuna tıklayın.
2. **Risk scoring** sekmesine geçin.
3. Hesaplama yöntemini seçin: en yüksek veya ortalama ağırlık.
4. Gerekirse, risk skorunu etkilemesini istemediğiniz faktörleri devre dışı bırakın.
5. Kalanlar için ağırlıkları ayarlayın.

    ![API Discovery - Risk score setup](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)

6. Değişiklikleri kaydedin. Wallarm, yeni ayarlara göre uç noktalarınızın risk skorunu birkaç dakika içinde yeniden hesaplayacaktır.