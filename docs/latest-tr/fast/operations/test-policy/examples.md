# Test Politikası Örnekleri

Bu belgede FAST test politikalarının birkaç örneği sunulmaktadır, aşağıdaki örnekler FAST belgelerinde kullanılır. Bu örnekler, politikalarla çalışmanın tüm yönlerini gösterir.

!!! info "İstek öğesi açıklama sözdizimi"
    Bir FAST test politikası, belirli temel istek öğeleriyle bir FAST düğümünü çalışma iznini izin verir ya da reddeder.

    Bu öğeler [puanlar](../../dsl/points/intro.md) kullanılarak tanımlanır.

    Aşağıdaki örnek test politikalarında, her temel isteğin öğesi, any GET parametresi (`GET_.*`) gibi, ilgili puanla birlikte izlenir.

!!! info "Zafiyetlerin Tespiti"
    [FAST'ın tespit edebileceği zafiyetler listesi](../../vuln-list.md)

    Bir test politikasının yapılandırılması sırasında seçilen zafiyet türlerinin, yerleşik FAST eklentisi (aka tespitler) hangilerinin çalıştırılacağını etkileyeceğini lütfen unutmayın.

    Özel FAST eklentileri, bu zafiyet türü bir politika yapılandırırken seçilmediyse bile, tasarlandıkları zafiyet türünü tespit etmeye çalışacaktır.

    Örneğin, bir politika RCE için hedef uygulamanın test edilmesine izin verebilir, ancak özel extension SQLi zafiyetleri için uygulamayı test eder.

## Varsayılan Test Politikası

Bu, yaygın istek öğeleriyle çalışmaya ve tipik zafiyetleri test etmeye izin veren değiştirilemeyen bir test politikasıdır.

**Bu politika şu öğelerle çalışmayı mümkün kılar:**

* tüm GET ve POST parametreleri (`GET_.*` ve `POST_.*`)
* URI (`URI`)
* URI'deki tüm yollar (`PATH_.*`)
* URL işlem adı ve uzantısı (`ACTION_NAME` ve `ACTION_EXT`)

**Hedef uygulama, PTRAV, RCE, SQLI, XSS ve XXE zafiyetlerini yerleşik FAST eklentisi tarafından test edilecektir.**

**Bu politikanın aşağıdaki özellikler vardır:** fuzzer'ı desteklemez. Fuzzer'ı etkinleştirmek için ayrı bir test politikası oluşturun ([örnek](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)).

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "Not"
    Aşağıdakileri göz önünde bulundurun:

    * Yeni bir test politikası oluşturduğunuzda, ayarları varsayılan politikada kullanılanlarla aynı olacaktır. Yeni politikanın ayarlarını ihtiyaçlarınıza göre değiştirebilirsiniz.
    * Bu politika, FAST'ın CI/CD'ye entegrasyonunun [örneğinde](../../poc/examples/circleci.md) kullanılabilir.

## Tüm GET ve POST Parametreleriyle Çalışmaya İzin Veren Politika

Bu test politikası, bir istekte tüm GET (`GET_.*`) ve POST parametreleri (`POST_.*`) ile çalışmayı mümkün kılar.

**Hedef uygulama, XSS zafiyeti için yerleşik FAST eklentileri tarafından test edilecektir.**

**Bu politikanın aşağıdaki özellikler vardır:** fuzzer devre dışı.

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "Not"
    Hızlı Başlangıç kılavuzunda, bu politika [Google Gruyere](../../qsg/test-run.md) hedef uygulamasının güvenlik testini yapmak için kullanılabilir.

## URI ve JSON Kodlu email POST Parametresiyle Çalışmaya İzin Veren Politika (Yalnızca Özel FAST Eklentileri Çalıştırılabilir)

Bu test politikası, bir isteğin URI (`URI`) ve `email` POST parametreleriyle çalışmayı mümkün kılar. `email` parametresi JSON'da kodlanmıştır (`POST_JSON_DOC_HASH_email_value`).

**Bu politikanın aşağıdaki özellikler vardır:**

* Sadece özel FAST eklentileri çalıştırılabilir, yerleşik FAST tespitleri çalıştırılmaz.
* Fuzzer devre dışı.

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "Not"
    Bu politika, [özel eklentileri örnekle](../../dsl/using-extension.md) çalıştırmak için kullanılabilir.

## URI ve JSON Kodlu email POST Parametreleriyle Çalışmaya İzin Veren Politika (Fuzzer Etkin)

Bu politika, bir istekte `email` POST parametresiyle çalışmayı mümkün kılar. `email` parametresi JSON'da kodlanmıştır (`POST_JSON_DOC_HASH_email_value`).

**Bu politikanın aşağıdaki özellikler vardır:**

* Fuzzer etkin.
* Tüm yerleşik FAST eklentileri devre dışı (hiçbir zafiyet seçilmez). Bu, fuzzer'ı kullanırken yapılabilecek bir durumdur.

**Bu örnek politikada, fuzzer şu şekilde yapılandırılmıştır:**

* Yüklerin en fazla 123 baytı, bir puanın kodlanmış değerinin başına eklenmelidir (bu özel durumda, yalnızca `POST_JSON_DOC_HASH_email_value` puanı vardır).
* Aşağıdaki durumlar varsayılır:

    * Bir anormallik, `SQLITE_ERROR` dizesi sunucu yanıt gövdesinde sunuldugunda bulunmuştur.
    * Hiçbir anormallik bulunmaz, sunucu yanıt kodu değeri `500`'den az olduğunda.
    * Fuzzer, tüm yükler kontrol edildiyse veya iki taneden fazla anormal bulunduysa çalışmayı durdurur.

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "Not"
    Bu politika, [OWASP Juice Shop login formu](../../dsl/extensions-examples/overview.md)ndaki zafiyetleri bulmak için kullanılabilir.

## Belirli Bir Puanın Değerli Çalışmayı Reddeden Politika

Bu test politikası, bir istekte tüm GET parametreleri (`GET_.*`) ile çalışmayı, `sessionid` GET parametresi (`GET_sessionid_value`) dışında, mümkün kılar.

Bu tür bir davranışı yapılandırmanın yararlı olması, belirli bir puanla FAST'ın çalışmasını reddetmek gerektiğinde (örneğin, belirli bir parametre değerinin yanlışlıkla değiştirilmesi hedef uygulamanın işleyişini bozabilir) olabilir.

**Hedef uygulama, AUTH ve IDOR zafiyetlerini yerleşik FAST eklentileri tarafından test edilecektir.**

**Bu politikanın aşağıdaki özellikleri vardır:** fuzzer devre dışı.

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)