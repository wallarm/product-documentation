[doc-insertion-points]:     insertion-points.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability
[gl-point]:                 ../../terms-glossary.md#point
[gl-anomaly]:               ../../terms-glossary.md#anomaly

# FAST Test Policies: Genel Bakış

FAST, bir uygulamayı [güvenlik açıkları][gl-vuln] açısından test ederken FAST node davranışını yapılandırmanıza olanak tanıyan test politikalarını kullanır. Bu bölümdeki belgeler, test politikası yönetimi ile ilgili talimatları içerir.

!!! info "Terminoloji"
    Bu belgede "FAST test politikası" terimi "politika" olarak kısaltılabilir.

## Test Politikası İlkeleri

FAST, istek unsurlarını [noktalar][gl-point] olarak temsil eder ve yalnızca işlenmesine izin verilen bir veya daha fazla nokta içeren isteklerle çalışır. Bu noktaların listesi politika tarafından tanımlanır. İstek izin verilen noktaları içermiyorsa, istek göz ardı edilir ve buna dayanarak test istekleri oluşturulmaz.

Politika, aşağıdaki noktaları düzenler:

* Testlerin gerçekleştirilme yöntemi
    
    Test sırasında FAST, aşağıda listelenen bir veya daha fazla yöntemi izler:
    
    * yerleşik FAST uzantıları kullanılarak güvenlik açıklarının tespiti, ayrıca *detects* olarak bilinir
    * özel uzantılar kullanılarak güvenlik açıklarının tespiti
    * FAST fuzz testi kullanılarak [anomaly][gl-anomaly] tespiti

* Uygulama testi sırasında FAST node tarafından işlenen temel istek öğeleri

    İşlenmesine izin verilen noktalar, Wallarm hesabınızdaki politika düzenleyicisinde **Insertion points** > **Where in the request to include** bölümünde yapılandırılır. Insertion points hakkında detaylar için bu [link][doc-insertion-points]'e bakın.

* Uygulama testi sırasında FAST node tarafından işlenmeyen temel istek öğeleri

    İşlenmesine izin verilmeyen noktalar, Wallarm hesabınızdaki test politikası ayarlarının **Insertion points** > **Where in the request to exclude** bölümünde yapılandırılır. Insertion points ile ilgili daha fazla detayı bu [link][doc-insertion-points] üzerinden bulabilirsiniz.

    İşlenmesine izin verilmeyen noktalar, **Where in the request to include** bölümünde çok çeşitli noktaların bulunması ve belirli öğelerin işlenmesinin hariç tutulmasının gerektiği durumlarda kullanılabilir. Örneğin, tüm GET parametreleri işlenmesine izin veriliyorsa (`GET_.*`) ve `uuid` parametresinin işlenmesi hariç tutulmak isteniyorsa, **Where in the request to exclude** bölümüne `GET_uid_value` ifadesi eklenmelidir.

!!! warning "Politika Kapsamı"
    Noktaların açıkça hariç tutulması durumunda, FAST node işlemleri politikanın izin verdiği tek noktalardır.
    
    İstek içindeki diğer herhangi bir noktanın işlenmesi gerçekleştirilmez.

??? info "Politika Örneği"
    ![Politika örneği](../../../images/fast/operations/common/test-policy/overview/policy-flow-example.png)

    Yukarıdaki görsel, FAST node tarafından güvenlik açıklarının tespitinde kullanılan politikayı göstermektedir. Bu politika, hedef uygulamaya hiçbir müdahale olmaksızın iletilen `token` GET parametresi hariç, temel istek içindeki tüm GET parametrelerinin işlenmesine izin verir.

    Ayrıca, politika, fuzzer devre dışı iken yerleşik FAST uzantılarını ve özel uzantıları kullanmanıza olanak tanır.

    Bu nedenle, detects ve uzantılar kullanılarak güvenlik açıkları testi yalnızca temel istek **A** (`/app.php?uid=1234`) için gerçekleştirilecektir.

    Temel istek **B** (`/app.php?token=qwe1234`) için güvenlik açıkları testi gerçekleştirilmeyecektir, çünkü işlenmesine izin verilen GET parametrelerini içermemektedir. Bunun yerine, hariç tutulmuş `token` parametresini içermektedir.