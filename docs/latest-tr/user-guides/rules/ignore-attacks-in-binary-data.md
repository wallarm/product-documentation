# İkili verilerdeki saldırı işaretlerini yoksayma

**İkili verilere izin ver** ve **Belirli dosya türlerine izin ver** kuralları, ikili veriler için standart saldırı algılama kurallarını ayarlamak için kullanılır.

Varsayılan olarak, Wallarm düğümü gelen tüm istekleri bilinen saldırı işaretleri için analiz eder. Analiz sırasında, Wallarm düğümü saldırı işaretlerini düzenli ikili semboller olarak kabul etmeyebilir ve ikili verilerde yanlışlıkla kötü amaçlı yükleri algılayabilir.

**İkili verilere izin ver** ve **Belirli dosya türlerine izin ver** kurallarını kullanarak, ikili veri içeren istek öğelerini belirtmek için açıkça belirleyebilirsiniz. Belirli istek öğesi analizi sırasında, Wallarm düğümü ikili verilerde asla iletilmeyen saldırı işaretlerini yoksayacaktır.

* **İkili verilere izin ver** kuralı, ikili veri içeren istek öğeleri (ör. arşivlenmiş veya şifrelenmiş dosyalar) için saldırı algılama ayarlamasını sağlar.
* **Belirli dosya türlerine izin ver** kuralı, belirli dosya türlerini içeren istek öğeleri (öz. PDF, JPG) için saldırı algılama ayarlamasını sağlar.

## Kuralı Oluşturma ve Uygulama

--8<-- "../include-tr/waf/features/rules/rule-creation-options.md"

**Kurallar** bölümünde kuralı oluşturmak ve uygulamak için:

1. Hangi şekilde olursa olsun, belirli bir istek öğesinde geçirilen ikili veriler için saldırı algılama kurallarını ayarlamak için, Wallarm Konsolu'nun **Kurallar** bölümünde **İkili verilere izin ver** kuralını oluşturun. Kural, aşağıdaki bileşenlerden oluşur:

      * **Koşul** [açıklar](rules.md#branch-description) kuralın uygulanacağı uç noktaları.
      * **İstek kısmı** orijinal istek öğesine işaret eder ve ikili verileri içerir.

         --8<-- "../include-tr/waf/features/rules/request-part-reference.md"
2. Belirli dosya türlerinin belirli bir istek öğesinde geçirilmesi için saldırı algılama kurallarını ayarlamak için, Wallarm Konsolu'nun **Kurallar** bölümünde **Belirli dosya türlerine izin ver** kuralını oluşturun. Kural, aşağıdaki bileşenlerden oluşur:

      * **Koşul** [açıklar](rules.md#branch-description) kuralın uygulanacağı uç noktaları.
      * Saldırı işaretlerini yoksayacak dosya türleri.
      * **İstek kısmı** belirtilen dosya türlerini içeren orijinal istek öğesine işaret eder.

         --8<-- "../include-tr/waf/features/rules/request-part-reference.md"
3. [Kural derlemesinin tamamlanmasını](rules.md) bekleyin.

## Kural Örneği

Diyelim ki, kullanıcı sitedeki form aracılığıyla bir görüntü içeren ikili bir dosya yüklüyor. İstemci, `https://example.com/uploads/` adresine `multipart/form-data` tipinde bir POST isteği gönderir. İkili dosya, `fileContents` adlı gövde parametresinde geçer.

Gövde parametresinde `fileContents` geçen **İkili verilere izin ver** kuralının saldırı algılama düzelterek aşağıdaki gibi görünür:

![“İkili verilere izin ver” kuralının örneği](../../images/user-guides/rules/ignore-binary-attacks-example.png)