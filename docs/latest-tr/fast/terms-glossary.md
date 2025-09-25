[doc-points]:       dsl/points/intro.md
[doc-internals]:    operations/internals.md
[doc-policies]:     operations/test-policy/overview.md
[doc-vuln-list]:    vuln-list.md

[vuln-anomaly]:     vuln-list.md#anomaly

#   Sözlük

## Zafiyet

Zafiyet, bir web uygulaması oluşturulurken veya uygulanırken ihmal ya da yetersiz bilgi nedeniyle yapılan ve bilgi güvenliği riskine yol açabilen bir hatadır.

Bilgi güvenliği riskleri şunlardır:

* Yetkisiz veri erişimi; örneğin, kullanıcı verilerini okuma ve değiştirme erişimi.
* Hizmet engelleme.
* Veri bozulması ve diğerleri.

Zafiyet, İnternet'in bir özelliği değildir. Zafiyet, sisteminizin bir özelliğidir. Zafiyetlerinizin olup olmaması İnternet trafiğinize bağlı değildir. Ancak İnternet trafiği zafiyetleri tespit etmek için kullanılabilir; Wallarm’ın diğer işlevlerinin yanı sıra yaptığı şey de budur.

## Anomali

Bir zafiyet [türü][vuln-anomaly].

##  Hedef Uygulama

Hedef uygulama, FAST kullanılarak zafiyetler açısından test edilmesi gereken bir web uygulaması veya API’dir.

**Ayrıca bakınız:** [FAST bileşenleri arasındaki ilişkiler][doc-internals].

##  İstek Kaynağı 

İstek kaynağı, HTTP ve HTTPS isteklerini kullanarak hedef uygulamayı test edecek bir araçtır. FAST bu istekler temelinde güvenlik test setini oluşturabilir (bkz. “temel istekler”).

##  Güvenlik Test Seti

Güvenlik test seti, hedef uygulamadaki zafiyetlerin ortaya çıkarılmasını sağlar.
Her güvenlik testi bir veya daha fazla test isteğinden oluşur.

##  Test İstekleri

Test istekleri, hedef uygulamaya gönderilecek HTTP ve HTTPS istekleridir. Oluşturulan istekler bir zafiyeti tetikleme olasılığı yüksek olan isteklere örnektir.

Bu tür istekler, test politikasını karşılayan temel istekler temel alınarak FAST tarafından oluşturulur.

##  FAST Node

FAST node, FAST bileşenlerinden biridir.

Node, HTTP ve HTTPS isteklerini proxy’ler ve temel isteklere dayanarak güvenlik testleri oluşturur.

Buna ek olarak, FAST node güvenlik testlerini yürütür. Başka bir deyişle, node, uygulamanın yanıtını kontrol etmek ve uygulamada güvenlik zafiyeti olup olmadığını belirlemek için test isteklerini hedef uygulamaya gönderir.

##  Wallarm Cloud

Wallarm Cloud, FAST bileşenlerinden biridir.
Bulut, test politikaları oluşturmak, test yürütme sürecini yönetmek ve test sonuçlarını gözlemlemek için kullanıcıya bir arayüz sağlar.

**Ayrıca bakınız:**
* [FAST bileşenleri arasındaki ilişkiler][doc-internals],
* [test politikalarıyla çalışma][doc-policies].


##  Temel istekler

Temel istekler, istek kaynağından hedef uygulamaya yönlendirilen HTTP ve HTTPS istekleridir.
FAST, güvenlik testlerini bu istekler temelinde oluşturur.

FAST node üzerinden proxy’lenen fakat temel istek olmayan tüm istekler, test seti oluşturma sürecinde kaynak olarak kullanılmayacaktır.

##  Test Çalıştırması

Bir test çalıştırması, FAST kullanılarak yapılan zafiyet test sürecinin tek bir yinelemesini tanımlar.

Test çalıştırması, bir test politikasını bir FAST node’a iletir. Politika, hangi temel isteklerin güvenlik testlerine temel olacağını tanımlar.

Her test çalıştırması, bir token aracılığıyla tek bir FAST node ile sıkı biçimde ilişkilendirilir.

##  Test Politikası

Test politikası, zafiyet tespit sürecinin hangi kurallara göre yürütüleceğini belirleyen kurallar bütünüdür. Özellikle, uygulamanın hangi zafiyet türlerine karşı test edileceğini seçebilirsiniz. Buna ek olarak, politika, bir güvenlik test seti oluşturulurken temel istekteki hangi parametrelerin değiştirilebileceğini belirler. Bu veriler, hedef uygulamanın sömürülebilir olup olmadığını anlamak için kullanılan test isteklerini oluşturmak amacıyla FAST node tarafından kullanılır.

**Ayrıca bakınız:**
* [FAST bileşenleri arasındaki ilişkiler][doc-internals],
* [test politikalarıyla çalışma][doc-policies].

##  Temel İstek Öğesi

Bir istek öğesi, temel bir isteğin parçasıdır.
Öğe örnekleri:

* HTTP üstbilgisi, 
* HTTP yanıt gövdesi, 
* GET parametreleri, 
* POST parametreleri.

##  Nokta

Nokta, temel isteğin bir öğesini işaret eden bir dizgedir. Bu dizge, gerekli veriyi elde etmek için temel isteğe uygulanması gereken ayrıştırıcı ve filtre adlarının bir diziliminden oluşur.

Noktalar daha ayrıntılı olarak [burada][doc-points] açıklanmıştır.

##  Token

Token, aşağıdaki amaçlara hizmet eden benzersiz ve gizli bir tanımlayıcıdır:
* Bir test çalıştırmasını FAST node ile ilişkilendirmek.
* Bir test çalıştırması oluşturmak ve yönetmek.

Token, FAST node’un temel özelliklerinden biridir.

**Ayrıca bakınız:** [FAST bileşenleri arasındaki ilişkiler][doc-internals].