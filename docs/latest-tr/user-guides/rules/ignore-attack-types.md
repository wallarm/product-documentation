# Belirli saldırı türlerini görmezden gelme

**Belirli saldırı türlerini gözardı et** kuralı, belirli istek ögelerinde belirli saldırı türlerinin algılanmasını devre dışı bırakmayı sağlar.

Varsayılan olarak, Wallarm düğümü, bir istek ögesinde herhangi bir saldırı türü belirtisini algıladığında isteği bir saldırı olarak işaretler. Ancak, saldırı belirtileri içeren bazı istekler aslında meşru olabilir (örneğin, Veritabanı Yöneticisi Forumu'nda gönderi yayınlayan isteğin gövdesi [kötü niyetli SQL komutu](../../attacks-vulns-list.md#sql-injection) açıklamasını içerebilir).

Wallarm düğümü, isteğin standart yükünü kötü niyetli olarak işaretlerse, bir [yanlış pozitif](../../about-wallarm/protecting-against-attacks.md#false-positives) oluşur. Yanlış pozitifleri önlemek için, standart saldırı tespit kurallarının, korunan uygulamanın özelliklerine uyacak şekilde belirli türlerdeki özel kurallar kullanılarak ayarlanması gerekir. Bu özel kural türlerinden biri **Belirli saldırı türlerini gözardı et**'dir.

## Kuralın oluşturulması ve uygulanması

--8<-- "../include-tr/waf/features/rules/rule-creation-options.md"

**Kurallar** bölümünde kuralı oluşturmak ve uygulamak için:

1. Wallarm Konsolu'nun **Kurallar** bölümünde **Belirli saldırı türlerini görmezden gel** kuralını oluşturun. Kural aşağıdaki bileşenlerden oluşur:

      * **Durum** kuralın uygulanacağı uç noktaları [tanımlar](rules.md#branch-description).
      * Belirtilen istek ögesinde yok sayılacak saldırı türleri.
        
        **Belirli saldırı türleri** sekmesi, kural oluşturulduğu sıradaki bir veya daha fazla saldırı türünü seçmenizi sağlar.

        **Tüm saldırı türleri (otomatik güncellenme)** sekmesi, kural oluşturulduğu sırada Wallarm düğümünün algılayabileceği ve gelecekte algılayabileceği her iki saldırı türünün algılanmasını devre dışı bırakır. Örneğin: Wallarm, yeni bir saldırı türü algılamayı desteklerse, düğüm otomatik olarak bu saldırı türüne ait belirtileri seçili istek ögesinde görmezden gelecektir.
      
      * **İstek Parçası** seçilen saldırı türü belirtileri için analiz edilmemesi gereken orijinal istek öğesini belirtir.
        
         --8<-- "../include-tr/waf/features/rules/request-part-reference.md"

2. [Kural derlemenin tamamlanmasını](rules.md) bekleyin.

## Kural örneği

Diyelim ki kullanıcı, Veritabanı Yöneticisi Forumu'nda gönderinin yayınlanmasını onayladığında, istemci `https://example.com/posts/` uç noktasına POST isteği gönderir. Bu isteğin aşağıdaki özellikleri vardır:

* Gönderi içeriği, `postBody` adlı istek gövdesi parametresinde geçer. Gönderi içeriği, Wallarm tarafından kötü niyetli olarak işaretlenmiş olabilecek SQL komutlarını içerebilir.
* İstek gövdesi `application/json` tipindedir.

[SQL enjeksiyonu](../../attacks-vulns-list.md#sql-injection) içeren cURL isteği örneği:

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

`https://example.com/posts/` adresine yapılan isteklerin `postBody` parametresindeki SQL enjeksiyonlarını görmezden gelmek için, **Belirli saldırı türlerini görmezden gel** kuralı aşağıdaki şekilde yapılandırılabilir:

![Belirli saldırı türlerini görmezden gelme" kuralının örneği](../../images/user-guides/rules/ignore-attack-types-rule-example.png)