[doc-insertion-points]:     insertion-points.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability
[gl-point]:                 ../../terms-glossary.md#point
[gl-anomaly]:               ../../terms-glossary.md#anomaly

# FAST Test Politikaları: Genel Bakış

FAST, bir uygulamada [zaafiyetler][gl-vuln] test etmek için FAST düğüm davranışını kurmanıza izin veren test politikaları kullanır. Bu bölümdeki belgeler, test politikası yönetimi için talimatlar içerir.

!!! bilgi "Terminoloji"
    "FAST test politikası" terimi bu belge bölümünde "politika" olarak kısaltılabilir.

## Test Politikası Prensipleri

FAST, istek öğelerini [noktalar][gl-point] olarak temsil eder ve yalnızca işleme izin verilen bir veya daha fazla nokta içeren isteklerle çalışır. Bu tür noktaların listesi politika üzerinden tanımlanır. İstek, izin verilen noktaları içermezse, atılacak ve onun temelinde hiçbir test isteği oluşturulmayacaktır.

Politika aşağıdaki noktaları düzenler:

* Testlerin nasıl yürütüldüğü
    
    Test sırasında, FAST aşağıda listelenen bir veya daha fazla yöntemi izler:
    
    * İçeriğindeki FAST genişlemelerini kullanarak *tespitler* olarak da bilinen zaafiyetlerin tespiti
    * Özel genişlemeleri kullanarak zaafiyetlerin tespiti
    * FAST fuzz testini kullanarak [anormallik][gl-anomaly] tespiti

* Uygulamanın testi sırasında FAST düğümünün işlemekte olduğu temel istek öğeleri

    İşlenmesine izin verilen Noktalar, politika düzenleyicisinin **Ekleme noktaları** > **İsteğe nerede dahil edilir** bölümünde Wallarm hesabınızda yapılandırıldı. Ekleme noktaları hakkında daha fazla bilgi için bu [bağlantıya][doc-insertion-points] tıklayınız.

* Uygulamanın testi sırasında FAST düğümünün işlemeyi reddettiği temel istek öğeleri

    İşlenmesine izin verilmeyen Noktalar, politika ayarlarının **Ekleme noktaları** > **İsteğe nerede dahil edilmez** bölümünde Wallarm hesabınızda yapılandırıldı. Ekleme noktaları hakkında daha fazla bilgi için bu [bağlantıya][doc-insertion-points] tıklayınız.

    İşlenmesine izin verilmeyen Noktalar, **İsteğe nerede dahil edilir** bölümünde çeşitli noktaların bulunduğu ve ayrı öğelerin işlemesinin gerekliliğinin dışlandığı durumlarda kullanılabilir. Örneğin, tüm GET parametrelerinin işlenmesine izin verilirse (`GET_.*`) ve `uuid` parametresinin işlemesinin dışlanması gerekiyorsa, `GET_uid_value` ifadesi **İsteğe nerede dahil edilmez** bölümüne eklenmelidir.

!!! uyarı "Politika kapsamı"
    Noktaların açıkça dışlandığı durumlarda, FAST düğüm işlemleri yalnızca politika tarafından izin verilen noktalardır.
    
    İsteğin herhangi başka noktasının işlenmesi gerçekleştirilmez.

??? bilgi "Politika örneği"
    ![Politika örneği](../../../images/fast/operations/common/test-policy/overview/policy-flow-example.png)

    Yukarıdaki resim, FAST düğümünüzün zaafiyet tespitinde kullandığı politikayı gösterir. Bu politika, temel istekteki tüm GET parametrelerinin işlemesine izin verir, ancak her zaman hedef uygulamaya dokunmadan geçirilen `token` GET parametresini hariç tutar.

    Ayrıca, politika, fuzzer (şans eseri hatalı veri üretici) etkin olmadığı sürece, yerleşik FAST genişlemelerini ve özel genişlemeleri kullanmanıza izin verir.

    Bu nedenle, tespitlerin ve genişlemelerin kullanılmasıyla zaafiyetlerin test edilmesi yalnızca temel istek **A** (`/app.php?uid=1234`) için gerçekleştirilecektir.

    Temel istek **B** (`/app.php?token=qwe1234`) üzerindeki zaafiyetlerin test edilmesi, GET parametrelerinin işlenmesine izin vermediği için gerçekleştirilmeyecektir. Bunun yerine yasaklı `token` parametresini içerir.
