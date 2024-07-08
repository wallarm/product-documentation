# İstek ayrıştırıcılarını yönetme

Kural **Request Parser'ı Devre Dışı Bırak/Etkinleştir** isteğin analizi sırasında uygulanan parser setini yönetmeye izin verir.

Varsayılan olarak, isteği analiz ederken Wallarm düğümü, uygun her bir [ayrıştırıcıyı](request-processing.md) isteğin her bir öğesine sırayla uygulamaya çalışır. Ancak, belirli ayrıştırıcılar yanlışlıkla uygulanabilir ve sonuç olarak, Wallarm düğümü çözümlenmiş değerde saldırı belirtisi tespit edebilir.

Örneğin: Wallarm düğümü, kodlanmamış verileri yanlışlıkla [Base64](https://en.wikipedia.org/wiki/Base64) ile kodlanmış olarak belirleyebilir, çünkü Base64 alfabesinin sembolleri genellikle normal metinlerde, belirteç değerlerinde, UUID değerlerinde ve diğer veri biçimlerinde kullanılır. Kodlanmamış verileri çözümlerken ve sonuç değerinde saldırı belirtilerini tespit ederken, [yanlış pozitif](../../about-wallarm/protecting-against-attacks.md#false-positives) durumu ortaya çıkar.

Bu tür durumlarda yanlış pozitifleri engellemek için, kuralları **Request Parser'ı Devre Dışı Bırak/Etkinleştir** kullanarak belirli istek öğelerine yanlışlıkla uygulanan parserları devre dışı bırakabilirsiniz.

## Kuralın oluşturulması ve uygulanması

--8<-- "../include-tr/waf/features/rules/rule-creation-options.md"

**Kurallar** bölümünde kuralı oluşturmak ve uygulamak için:

1. Wallarm Konsolu'ndaki **Kurallar** bölümünde **Request Parser'ı Devre Dışı Bırak/Etkinleştir** kuralını oluşturun. Kural aşağıdaki bileşenlerden oluşur:

      * **Durum**, kuralın uygulanacağı uç noktaları [tanımlar](rules.md#branch-description).
      * Belirtilen istek öğesi için devre dışı bırakılacak/etkinleştirilecek parserlar.
      * **İstek Parçası**, seçilen parserlarla çözümlenecek/çözümlenmeyecek orijinal istek öğesini belirtir.

         --8<-- "../include-tr/waf/features/rules/request-part-reference.md"
2. [Kural derlemesinin tamamlanmasını](rules.md) bekleyin.

## Kural örneği

Diyelim ki `https://example.com/users/` adresine yapılan istekler `X-AUTHTOKEN` adında bir kimlik doğrulama başlığı gerektiriyor. Başlık değeri, Wallarm tarafından `base64` parser ile potansiyel olarak çözümlenebilecek belirli sembol kombinasyonları (örn. sonunda `=`) içerebilir.

`X-AUTHTOKEN` değerlerinde yanlış pozitifleri önleyen **Request Parser'ı Devre Dışı Bırak/Etkinleştir** kuralı aşağıdaki gibi yapılandırılabilir:

![Örnek kural "Request Parser'ı Devre Dışı Bırak/Etkinleştir"](../../images/user-guides/rules/disable-parsers-example.png)