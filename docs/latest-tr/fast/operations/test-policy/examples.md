# Test Politikası Örnekleri

Bu belgede, FAST test politikalarına ilişkin birkaç örnek sunulmaktadır; FAST dokümantasyonunda kullanılanlar da dahil. Bu örnekler, politikalarla çalışmanın tüm yönlerini gösterir.

!!! info "İstek öğesi açıklama söz dizimi"
    FAST test politikası, bir FAST düğümünün temel isteğin belirli öğeleriyle çalışmasına izin verir veya bunu reddeder.

    Bu öğeler [point'lar](../../dsl/points/intro.md) kullanılarak tanımlanır.

    Aşağıdaki örnek test politikalarında, her temel isteğin öğesinin ardından karşılık gelen point yer alır; örneğin: herhangi bir GET parametresi (`GET_.*`).

!!! info "Zafiyetlerin tespiti"
    [FAST'in tespit edebildiği zafiyetlerin listesi](../../vuln-list.md)

    Lütfen bir test politikası yapılandırılırken seçilen zafiyet türlerinin, hangi yerleşik FAST uzantılarının (diğer adıyla detects) çalıştırılacağını etkilediğini unutmayın.

    Özel FAST uzantıları, politika yapılandırılırken bu zafiyet türü seçilmemiş olsa bile, tasarlandıkları zafiyet türünü tespit etmeye çalışacaktır.

    Örneğin, bir politika hedef uygulamayı RCE açısından test etmeye izin verebilir, ancak özel bir uzantı uygulamayı SQLi zafiyetleri için test edecektir.

## Varsayılan Test Politikası

Bu, yaygın istek öğeleriyle çalışmaya ve tipik zafiyetleri test etmeye izin veren değiştirilemez bir test politikasıdır.

**Bu politika aşağıdaki öğelerle çalışmaya izin verir:**

* herhangi bir GET ve POST parametresi (`GET_.*` ve `POST_.*`)
* URI (`URI`)
* URI içindeki herhangi bir yol (`PATH_.*`)
* URL eylem adı ve uzantısı (`ACTION_NAME` ve `ACTION_EXT`)

**Hedef uygulama**, yerleşik FAST uzantıları tarafından PTRAV, RCE, SQLI, XSS ve XXE zafiyetleri için test edilecektir.

**Bu politikanın aşağıdaki özellikleri vardır:** fuzzing desteklemez. Fuzzer'ı etkinleştirmek için ayrı bir test politikası oluşturun ([örnek](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)).

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "Not"
    Lütfen aşağıdakileri göz önünde bulundurun:

    * Yeni bir test politikası oluşturduğunuzda, ayarları varsayılan politikada kullanılanlarla aynı olur. Yeni politikanın ayarlarını gerektiği gibi değiştirebilirsiniz.
    * Bu politika, FAST'in CI/CD'ye entegrasyonuna ilişkin [örneğinde](../../poc/examples/circleci.md) kullanılabilir.

## Tüm GET ve POST Parametreleriyle Çalışmaya İzin Veren Politika

Bu test politikası, bir istekteki tüm GET (`GET_.*`) ve POST (`POST_.*`) parametreleriyle çalışmaya izin verir.

**Hedef uygulama**, yerleşik FAST uzantıları tarafından XSS zafiyeti için test edilecektir.

**Bu politikanın aşağıdaki özellikleri vardır:** fuzzer devre dışıdır.

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "Not"
    Hızlı Başlangıç kılavuzunda, bu politika [Google Gruyere](../../qsg/test-run.md) hedef uygulamasının güvenlik testini yürütmek için kullanılabilir.

## URI ve Kodlanmış email POST Parametresiyle Çalışmaya İzin Veren Politika (Yalnızca Özel FAST Uzantılarının Çalıştırılmasına İzin Verilir)

Bu test politikası, bir istekteki URI (`URI`) ve `email` POST parametreleriyle çalışmaya izin verir. `email` parametresi JSON içinde kodlanmıştır (`POST_JSON_DOC_HASH_email_value`).

**Bu politikanın aşağıdaki özellikleri vardır:**

* Yalnızca özel FAST uzantılarının çalıştırılmasına izin verilir, yerleşik FAST detects çalıştırılmaz.
* Fuzzer devre dışıdır.

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "Not"
    Bu politika, [örnek özel uzantıları](../../dsl/using-extension.md) çalıştırmak için kullanılabilir.

## URI ve Kodlanmış email POST Parametreleriyle Çalışmaya İzin Veren Politika (Fuzzer Etkin)

Bu politika, bir istekteki `email` POST parametresiyle çalışmaya izin verir. `email` parametresi JSON içinde kodlanmıştır (`POST_JSON_DOC_HASH_email_value`).

**Bu politikanın aşağıdaki özellikleri vardır:**

* Fuzzer etkindir.
* Tüm yerleşik FAST uzantıları devre dışıdır (hiçbir zafiyet seçilmemiştir). Fuzzer kullanılırken bu mümkündür.

**Bu örnek politikada fuzzer şu şekilde yapılandırılmıştır:**

* 123 bayta kadar payload'lar, bir point'in kodu çözülmüş değerinin başına eklenecektir (bu özel durumda tek bir point vardır: `POST_JSON_DOC_HASH_email_value`).
* Şu varsayılır:

    * Sunucu yanıt gövdesinde `SQLITE_ERROR` dizesi bulunuyorsa bir anomali bulunduğu varsayılır.
    * Sunucu yanıt kodu değeri `500`'den küçükse anomali bulunmadığı varsayılır.
    * Tüm payload'lar kontrol edilmişse veya ikiden fazla anomali bulunmuşsa fuzzer yürütmesini durdurur.

![Politika örneği](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "Not"
    Bu politika, [OWASP Juice Shop oturum açma formundaki](../../dsl/extensions-examples/overview.md) zafiyetleri bulmak için kullanılabilir.

## Belirli Bir Point'in Değeriyle Çalışmayı Reddeden Politika

Bu test politikası, bir istekteki `sessionid` GET parametresi (`GET_sessionid_value`) hariç tüm GET (`GET_.*`) parametreleriyle çalışmaya izin verir.

FAST'in belirli bir point ile çalışmasının engellenmesi gerekiyorsa (örneğin, belirli bir parametre değerinin istemeden değiştirilmesi hedef uygulamanın çalışmasını bozabilecekse) bu tür bir davranışı yapılandırmak faydalı olabilir.

**Hedef uygulama**, yerleşik FAST uzantıları tarafından AUTH ve IDOR zafiyetleri için test edilecektir. 

**Bu politikanın aşağıdaki özellikleri vardır:** fuzzer devre dışıdır.

![Örnek politika](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)