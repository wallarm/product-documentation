[link-yaml]:            https://yaml.org/spec/1.2/spec.html
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-points]:          points/intro.md

# FAST DSL Genel Bakış

FAST, uzantıları tanımlamak için kullanıcılarına bir alan-özel dil (DSL) sağlar. Artık belirli bir programlama becerisine ihtiyaç duymadan uygulamanızdaki güvenlik açıklarını tespit etmek için özel uzantılar oluşturabilirsiniz. Uzantı mekanizması, temel istekleri işlerken ve hedef uygulamada güvenlik açıklarını ararken ek özel mantık uygulamanıza olanak tanır.

FAST uzantıları, bir temel istekte seçilen parametrelerin değiştirilmesiyle veya önceden tanımlanmış bir payload kullanılarak oluşturulan güvenlik testlerinin üretilmesine olanak tanır. Oluşturulan güvenlik testleri ardından hedef uygulamaya gönderilir. Uygulamanın bu testlere verdiği yanıt, hedef uygulamada güvenlik açığı olup olmadığına ilişkin bir sonuca varmak için kullanılır (FAST uzantıları ayrıca güvenlik açıklarını tespit etme yöntemini de tanımlar). 

Uzantılar YAML kullanılarak tanımlanır. YAML sözdizimine ve YAML dosya yapısına aşina olduğunuzu varsayıyoruz. Ayrıntılı bilgi için bu [bağlantıya][link-yaml] gidin.

Uzantı mantığı, düzenli ifadelerle tanımlanan öğeler içerebilir. FAST ifadeleri yalnızca Ruby dilinin düzenli ifade sözdizimini destekler. Ruby düzenli ifade sözdizimine aşina olduğunuz varsayılır. Ayrıntılı bilgi için bu [bağlantıya][link-ruby-regexp] gidin.

--8<-- "../include/fast/cloud-note.md"

!!! info "İstek öğesi tanım sözdizimi"
    Bir FAST uzantısı oluştururken, noktaları kullanarak üzerinde çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir. 

    Ayrıntılı bilgi için bu [bağlantıya][link-points] gidin.