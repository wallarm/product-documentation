[link-yaml]:            https://yaml.org/spec/1.2/spec.html
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-points]:          points/intro.md

# FAST DSL Genel Bakış

FAST, kullanıcılara eklentileri tanımlamak için domain-specific language (DSL) sağlar. Artık uygulamanızdaki güvenlik açıklarını tespit etmek için belirli programlama becerilerine sahip olmadan özel eklentiler oluşturabilirsiniz. Eklenti mekanizması, temel istekleri işlemek ve hedef uygulamadaki güvenlik açıklarını aramak amacıyla ek özel mantık uygulamanıza olanak tanır.

FAST eklentileri, temel istek içerisinde seçilen parametrelerin değiştirilmesi veya önceden tanımlı bir payload kullanılarak oluşturulan güvenlik testlerinin üretilmesine imkan tanır. Oluşturulan güvenlik testleri daha sonra hedef uygulamaya gönderilir. Uygulamanın bu testlere verdiği yanıt, hedef uygulamada güvenlik açığı bulunup bulunmadığına karar vermek için kullanılır (FAST eklentileri aynı zamanda güvenlik açıklarını tespit etme yöntemini de tanımlar).

Eklentiler YAML kullanılarak tanımlanır. YAML sözdizimi ve YAML dosya yapısına aşina olduğunuzu varsayıyoruz. Detaylı bilgi için bu [link][link-yaml] adresine gidin.

Eklentilerin mantığı, düzenli ifadeler ile tanımlanan öğeleri içerebilir. FAST ifadeleri yalnızca Ruby dilinin düzenli ifade sözdizimini destekler. Ruby düzenli ifade sözdizimi hakkında bilgi sahibi olduğunuzu varsayıyoruz. Detaylı bilgi için bu [link][link-ruby-regexp] adresine gidin.

--8<-- "../include/fast/cloud-note.md"

!!! info "İstek öğesi açıklama sözdizimi"
    Bir FAST eklentisi oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlayarak, points kullanarak çalışmanız gereken istek öğelerini doğru şekilde tanımlamanız gerekir.

    Detaylı bilgi için bu [link][link-points] adresine gidin.