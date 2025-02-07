[doc-points]:       dsl/points/intro.md
[doc-internals]:    operations/internals.md
[doc-policies]:     operations/test-policy/overview.md
[doc-vuln-list]:    vuln-list.md

[vuln-anomaly]:     vuln-list.md#anomaly

# Sözlük

## Güvenlik Açığı

Güvenlik açığı, bir web uygulamasını inşa ederken veya uygularken ihmalkarlık ya da yetersiz bilgi nedeniyle yapılan ve bilgi güvenliği riskine yol açabilecek bir hatadır.

Bilgi güvenliği riskleri şunlardır:

* Yetkisiz veri erişimi; örneğin, kullanıcı verilerini okuma ve değiştirme erişimi.
* Hizmet reddi.
* Veri bozulması ve diğerleri.

Güvenlik açığı, İnternetin bir özelliği değildir. Güvenlik açığı, sisteminizin bir özelliğidir. Güvenlik açığına sahip olmanız ya da olmamanız, İnternet trafiğinize bağlı değildir. Ancak, İnternet trafiği, güvenlik açıklarını tespit etmek için kullanılabilir; bu, Wallarm'ın diğer işlevleri arasında yer almaktadır.

## Anomali

Bir [tür][vuln-anomaly] güvenlik açığıdır.

## Hedef Uygulama

Bir hedef uygulama, FAST kullanılarak güvenlik açıkları için test edilmesi gereken bir web uygulaması ya da API'dir.

**Ayrıca bakınız:** [relations between FAST components][doc-internals].

## İstek Kaynağı

Bir istek kaynağı, HTTP ve HTTPS istekleri kullanarak hedef uygulamayı test edecek olan bir araçtır. FAST, bu istekler temelinde güvenlik testi setini oluşturabilir (bkz. “baseline requests”).

## Güvenlik Test Seti

Bir güvenlik test seti, hedef uygulamadaki güvenlik açıklarını ortaya çıkarmaya olanak sağlar. Her güvenlik testi, bir veya daha fazla test isteğinden oluşur.

## Test İstekleri

Test istekleri, hedef uygulamaya gönderilecek HTTP ve HTTPS istekleridir. Oluşturulan isteklerin, güvenlik açığını tetiklemesi oldukça muhtemeldir.

Bu tür istekler, test politikasını karşılayan baseline requests temelinde FAST tarafından oluşturulur.

## FAST Node

FAST node, FAST bileşenlerinden biridir.

Node, HTTP ve HTTPS isteklerini proxy'ler ve baseline requests temelinde güvenlik testleri oluşturur.

Buna ek olarak, FAST node güvenlik testlerini yürütür. Diğer bir deyişle, node, uygulamanın yanıtını kontrol etmek ve uygulamada herhangi bir güvenlik açığı olup olmadığını belirlemek için test isteklerini hedef uygulamaya gönderir.

## Wallarm Cloud

Wallarm Cloud, FAST bileşenlerinden biridir.
Cloud, kullanıcılara test politikaları oluşturma, test yürütme sürecini yönetme ve test sonuçlarını gözlemleme arayüzü sağlar.

**Ayrıca bakınız:**
* [relations between FAST components][doc-internals],
* [working with test policies][doc-policies].

## Temel İstekler

Baseline requests, istek kaynağından hedef uygulamaya yönlendirilen HTTP ve HTTPS istekleridir.
FAST, bu istekler temelinde güvenlik testlerini oluşturur.

FAST node aracılığıyla proxy'lenen tüm baseline olmayan istekler, test seti oluşturma sürecinde kaynak olarak kullanılmaz.

## Test Çalışması

Bir test çalışması, FAST kullanılarak gerçekleştirilen güvenlik açığı test sürecinin tek bir iterasyonunu tanımlar.

Test çalışması, bir test politikasını FAST node'a iletir. Politika, hangi baseline requests'in güvenlik testleri için temel oluşturacağını belirler.

Her test çalışması, token aracılığıyla tek bir FAST node ile yakından ilişkilendirilmiştir.

## Test Politikası

Bir test politikası, güvenlik açığı tespit sürecinin nasıl yürütüleceğini belirleyen kurallar bütünüdür. Özellikle, uygulamanın test edileceği güvenlik açığı türlerini seçebilirsiniz. Ayrıca, politika, bir güvenlik test seti oluşturulurken baseline istekteki hangi parametrelerin değiştirilebilir olduğunu belirler. Bu veriler, hedef uygulamanın istismar edilebilir olup olmadığını tespit etmek için kullanılacak test isteklerini oluşturmak için FAST node tarafından kullanılır.

**Ayrıca bakınız:**
* [relations between FAST components][doc-internals],
* [working with test policies][doc-policies].

## Temel İstek Öğesi

Bir istek öğesi, baseline isteğin bir parçasıdır.
Örnek öğeler:

* HTTP başlığı,
* HTTP yanıt gövdesi,
* GET parametreleri,
* POST parametreleri.

## Nokta

Bir nokta, baseline isteğin bir öğesine işaret eden dizedir. Bu dize, gerekli veriyi elde etmek amacıyla baseline isteğe uygulanması gereken parser ve filtrelerin isim dizisinden oluşur.

Noktalar daha detaylı olarak [burada][doc-points] açıklanmaktadır.

## Token

Token, aşağıdaki amaçlara hizmet eden benzersiz gizli tanımlayıcıdır:
* Bir test çalışmasını FAST node ile ilişkilendirmek.
* Bir test çalışması oluşturmak ve yönetmek.

Token, FAST node’un temel özelliklerinden biridir.

**Ayrıca bakınız:** [relations between FAST components][doc-internals].