[link-yaml]:            https://yaml.org/spec/1.2/spec.html
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-points]:          points/intro.md

# FAST DSL Genel Bakış

FAST, kullanıcılara eklentileri tanımlamak için alan özel bir dil (DSL) sağlar. Artık belirli programlama becerilerine sahip olmanıza gerek kalmadan uygulamanızdaki zafiyetleri tespit etmek için özel eklentiler oluşturabilirsiniz. Eklenti mekanizması, temel isteklerin işlenmesi ve hedef uygulamadaki zafiyetlerin araştırılması için ek özel mantığın uygulanmasına olanak sağlar. 

FAST eklentileri, bir temel istekte seçilen parametreleri değiştirerek veya önceden tanımlanmış bir yük kullanarak oluşturulan güvenlik testlerinin oluşturulmasına olanak sağlar. Üretilen güvenlik testleri ardından hedef uygulamaya gönderilir. Uygulamanın bu testlere yanıtı, hedef uygulamada zafiyet olup olmadığına dair bir sonuca ulaşmak için kullanılır (FAST eklentileri ayrıca zafiyetleri tespit etme yöntemini de tanımlar).

Eklentiler YAML kullanılarak tanımlanır. YAML sözdizimi ve YAML dosya yapısına aşina olduğunuzu varsayıyoruz. Detaylı bilgi için bu [bağlantıya][link-yaml] tıklayın.

Eklentilerin mantığı, düzenli ifadelerle tanımlanan unsurları da içerebilir. FAST ifadeleri yalnızca Ruby dilinde düzenli ifade sözdizimi destekler. Ruby düzenli ifade sözdizimi ile aşina olduğunuzu varsayıyoruz. Detaylı bilgi için bu [bağlantıya][link-ruby-regexp] tıklayın.

--8<-- "../include/fast/cloud-note.md"

!!! bilgi "İstek elemanı açıklama sözdizimi"
    Bir FAST eklentisi oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız ve çalışmak istediğiniz istek öğelerini doğru bir şekilde tanımlamak için noktaları kullanmanız gerekmektedir. 
    
    Detaylı bilgi için bu [bağlantıya][link-points] tıklayın.