# Test Politika Örnekleri

Bu belgede, FAST dokümantasyonunda kullanılanlar dahil olmak üzere, FAST test politikalarından birkaç örnek sunulmaktadır. Bu örnekler, politikalarla çalışma sürecinin tüm yönlerini göstermektedir.

!!! info "İstek öğesi tanım sözdizimi"
    Bir FAST test politikası, FAST düğümüne temel bir isteğin belirli öğeleriyle çalışma izni verir veya reddeder.

    Bu öğeler, [points](../../dsl/points/intro.md) kullanılarak tanımlanmıştır.

    Aşağıdaki örnek test politikalarında, her temel istek öğesinin ardından ilgili point gelir, örneğin: herhangi bir GET parametresi (`GET_.*`).

!!! info "Güvenlik açıklarının tespiti"
    [FAST'in tespit edebileceği güvenlik açıklarının listesi](../../vuln-list.md)

    Lütfen, bir test politikası yapılandırılırken seçilen güvenlik açığı türlerinin, gömülü FAST uzantılarının (diğer adıyla detects) hangilerinin çalıştırılacağını etkilediğini unutmayın.

    Özel FAST uzantıları, politika yapılandırılırken bu güvenlik açığı türü seçilmemiş olsa bile, tasarlandıkları güvenlik açığı türünü tespit etmeye çalışacaktır.

    Örneğin, bir politika, hedef uygulamanın RCE açısından test edilmesine izin verebilir, ancak özel bir uzantı uygulamayı SQLi güvenlik açıkları açısından test edecektir.

## Varsayılan Test Politikası

Bu, yaygın istek öğeleriyle çalışma ve tipik güvenlik açıklarını test etme imkanı veren değiştirilemez bir test politikasını temsil eder.

**Bu politika aşağıdaki öğelerle çalışmaya izin verir:**

* herhangi bir GET ve POST parametreleri (`GET_.*` ve `POST_.*`)
* URI (`URI`)
* URI içindeki herhangi bir yol (`PATH_.*`)
* URL işlem adı ve uzantısı (`ACTION_NAME` ve `ACTION_EXT`)

**Hedef uygulama, gömülü FAST uzantıları tarafından** PTRAV, RCE, SQLI, XSS ve XXE güvenlik açıkları açısından test edilecektir.

**Bu politikanın aşağıdaki özellikleri vardır:** fuzzing desteklenmemektedir. Fuzzer'ı etkinleştirmek için ayrı bir test politikası oluşturun ([örnek](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)).

![Policy example](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "Not"
    Lütfen aşağıdakileri göz önünde bulundurun:

    * Yeni bir test politikası oluşturduğunuzda, ayarları varsayılan politikayla aynı olacaktır. Gerekirse yeni politikanın ayarlarını değiştirebilirsiniz.
    * Bu politika, FAST'in CI/CD'ye entegrasyonunun [örneğinde](../../poc/examples/circleci.md) kullanılabilir.

## Tüm GET ve POST Parametreleriyle Çalışmaya İzin Veren Politika

Bu test politikası, bir istekteki tüm GET (`GET_.*`) ve POST parametreleriyle (`POST_.*`) çalışmaya izin verir.

**Hedef uygulama, gömülü FAST uzantıları tarafından** XSS güvenlik açığı açısından test edilecektir.

**Bu politikanın aşağıdaki özellikleri vardır:** fuzzer devre dışı bırakılmıştır.

![Policy example](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "Not"
    Hızlı Başlangıç kılavuzunda, bu politika [Google Gruyere](../../qsg/test-run.md) hedef uygulamasının güvenlik testlerini gerçekleştirmek için kullanılabilir.

## URI ve Kodlanmış Email POST Parametresiyle Çalışmaya İzin Veren Politika (Yalnızca Özel FAST Uzantılarının Çalışmasına İzin Verilir)

Bu test politikası, bir istekte URI (`URI`) ve `email` POST parametreleriyle çalışmaya izin verir. `email` parametresi JSON formatında kodlanmıştır (`POST_JSON_DOC_HASH_email_value`).

**Bu politikanın aşağıdaki özellikleri vardır:**

* Yalnızca özel FAST uzantılarının çalışmasına izin verilir, gömülü FAST detect'leri çalıştırılmaz.
* Fuzzer devre dışı bırakılmıştır.

![Policy example](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "Not"
    Bu politika, [örnek özel uzantıları](../../dsl/using-extension.md) çalıştırmak için kullanılabilir.

## URI ve Kodlanmış Email POST Parametreleriyle Çalışmaya İzin Veren Politika (Fuzzer Etkin)

Bu politika, bir istekte `email` POST parametreleriyle çalışmaya izin verir. `email` parametresi JSON formatında kodlanmıştır (`POST_JSON_DOC_HASH_email_value`).

**Bu politikanın aşağıdaki özellikleri vardır:**

* Fuzzer etkinleştirilmiştir.
* Tüm gömülü FAST uzantıları devre dışı bırakılmıştır (hiçbir güvenlik açığı seçilmemiştir). Bu, fuzzer kullanılırken yapılabilmektedir.

**Bu örnek politikada, fuzzer şu şekilde yapılandırılmıştır:**

* Maksimum 123 bayta kadar yükler, noktaların (bu özel durumda tek bir point olan `POST_JSON_DOC_HASH_email_value`) kod çözülmüş değerinin başına eklenecektir.
* Aşağıdakiler varsayılmaktadır:
  
    * Server yanıt gövdesinde `SQLITE_ERROR` dizisi varsa anomali bulunmuştur.
    * Server yanıt kodu değeri `500`'den küçükse anomali bulunmamıştır.
    * Fuzzer, ya tüm yükler kontrol edilinceye kadar ya da iki anomali tespit edilinceye kadar çalışmaya devam eder.

![Policy example](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "Not"
    Bu politika, [OWASP Juice Shop giriş formundaki](../../dsl/extensions-examples/overview.md) güvenlik açıklarını bulmak için kullanılabilir.

## Belirli Bir Point'in Değeriyle Çalışmaya İzin Vermeyen Politika

Bu test politikası, bir istekteki tüm GET parametreleriyle (`GET_.*`) çalışmaya izin verir ancak `sessionid` GET parametresi (`GET_sessionid_value`) hariçtir.

Eğer belirli bir point ile çalışmasını engellemek (örneğin, belirli bir parametre değerinin istenmeyen şekilde değiştirilmesi hedef uygulamanın çalışmasını bozabilir) gerekiyorsa bu tarz bir davranışı yapılandırmak yararlı olabilir.

**Hedef uygulama, gömülü FAST uzantıları tarafından** AUTH ve IDOR güvenlik açıkları açısından test edilecektir.

**Bu politikanın aşağıdaki özellikleri vardır:** fuzzer devre dışı bırakılmıştır.

![Example policy](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)