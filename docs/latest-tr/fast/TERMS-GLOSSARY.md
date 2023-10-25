[doc-points]:       dsl/points/intro.md
[doc-internals]:    operations/internals.md
[doc-policies]:     operations/test-policy/overview.md
[doc-vuln-list]:    VULN-LIST.md

[vuln-anomaly]:     VULN-LIST.md#anomaly

#   Terimler Sözlüğü

## Güvenlik Açığı

Bir güvenlik açığı, bir web uygulamasının oluşturulması veya uygulanmasında gerek dikkatsizlikten gerek yetersiz bilgiden kaynaklanan ve bilgi güvenliği riskine yol açabilen bir hatadır.

Bilgi güvenliği riskleri şunlardır:

* Yetkisiz veri erişimi; örneğin, kullanıcı verilerini okuma ve değiştirme erişimi.
* Hizmetin reddi.
* Veri bozulması ve diğerleri.

Bir güvenlik açığı İnternet'in bir özelliği değildir. Bir güvenlik açığı sizin sisteminizin bir özelliğidir. Güvenlik açığınızın olup olmaması İnternet trafiğinizden bağımsızdır. İnternet trafiği, ancak, güvenlik açıklarını tespit etmek için kullanılabilir, Wallarm'ın yaptığı şeylerden sadece biri budur.

## Anomali

Bir [tür][vuln-anomaly] güvenlik açığı.

##  Hedef Uygulama

Bir hedef uygulama, FAST kullanılarak güvenlik açıkları için test edilmesi gereken bir web uygulaması veya bir API'dir.

**Ayrıca bakınız:** [FAST bileşenleri arası ilişkiler][doc-internals].

##  İstek Kaynağı 

Bir istek kaynağı, hedef uygulamayı HTTP ve HTTPS isteklerini kullanarak test edecek bir araçtır. FAST, bu isteklere dayanarak güvenlik test seti oluşturabilir ("temel istekler"e bakınız).

##  Güvenlik Test Seti

Bir güvenlik test seti, hedef uygulamadaki güvenlik açıklarını ortaya çıkarmayı sağlar.
Her güvenlik testi bir veya daha fazla test isteğinden oluşur.

##  Test İstekleri

Test istekleri, hedef uygulamaya gönderilecek olan HTTP ve HTTPS istekleridir. Oluşturulan isteklerin bir güvenlik açığını tetikleme olasılığı yüksektir.

Bu tür istekler, test politikasını karşılayan temel istekler temel alınarak FAST tarafından oluşturulur.

##  FAST Düğümü

FAST düğümü, FAST bileşenlerinden biridir.

Düğüm, HTTP ve HTTPS isteklerini ara bulucu olarak kullanır ve bu temel isteklere dayanarak güvenlik testleri oluşturur.

Buna ek olarak, FAST düğümü güvenlik testlerini yürütür. Diğer bir deyişle, düğüm test isteklerini hedef uygulamaya gönderir ve uygulamanın yanıtını kontrol eder ve uygulamada herhangi bir güvenlik açığı olup olmadığını belirler.

##  Wallarm Bulutu

Wallarm Bulutu, FAST bileşenlerinden biridir.
Bulut, kullanıcıya test politikaları oluşturma, test yürütme sürecini yönetme ve test sonuçlarını izleme arayüzü sağlar.

**Ayrıca bakınız:**
* [FAST bileşenleri arası ilişkiler][doc-internals],
* [test politikalarıyla çalışma][doc-policies].


##  Temel İstekler

Temel istekler, istek kaynağından hedef uygulamaya yönlendirilen HTTP ve HTTPS istekleridir.
FAST, bu isteklere dayanarak güvenlik testlerini oluşturur.

Temel olmayan tüm istekler, FAST düğümünden geçirilirken, test seti oluşturma sürecinde bir kaynak olarak kullanılmazlar.

##  Test Çalıştırma

Bir test çalıştırması, FAST kullanılarak güvenlik açığı test sürecinin tek bir iterasyonunu ifade eder.

Test çalıştırması, bir test politikasını bir FAST düğümüne iletir. Politika, hangi temel isteklerin güvenlik testlerine temel olarak hizmet edeceklerini belirler.

Her test çalıştırması, bir token ile tek bir FAST düğümüne sıkı sıkıya bağlıdır.

##  Test Politikası

Bir test politikası, güvenlik açığı tespit sürecinin hangi kurallara göre yürütüleceğini belirleyen bir dizi kuraldır. Özellikle, uygulamanın hangi güvenlik açığı türleri için test edilmesi gerektiğini seçebilirsiniz. Buna ek olarak, politika, temel istekte hangi parametrelerin bir güvenlik test seti oluştururken değiştirilebileceğini belirler. Bu veri parçaları, FAST düğümü tarafından hedef uygulamanın saldırıya açık olup olmadığını bulmak için kullanılan test isteklerini oluşturmak için kullanılır.

**Ayrıca bakınız:**
* [FAST bileşenleri arası ilişkiler][doc-internals],
* [test politikalarıyla çalışma][doc-policies].

##  Temel İstek Elemanı

Bir istek elemanı, bir temel isteğin bir parçasıdır.
Eleman örnekleri:

* HTTP başlığı, 
* HTTP yanıt gövdesi, 
* GET parametreleri, 
* POST parametreleri.

##  Nokta

Bir nokta, temel isteğin bir elemanını işaret eden bir dizedir. Bu dize, gerekli veriyi elde etmek için temel isteğe uygulanması gereken ayrıştırıcıların ve filtrelerin isimlerinin bir dizisini içerir.

Noktalar, daha detaylı bir şekilde [burada][doc-points] açıklanmıştır.

##  Token

Bir token, aşağıdaki amaçları gerçekleştiren benzersiz bir gizli tanımlayıcıdır:
* Bir test çalıştırmasını FAST düğümü ile bağlama.
* Bir test çalıştırması oluşturma ve yönetme.

Token, FAST düğümünün temel özelliklerinden biridir.

**Ayrıca bakınız:** [FAST bileşenleri arası ilişkiler][doc-internals].