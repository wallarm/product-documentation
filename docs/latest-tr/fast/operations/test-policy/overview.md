[doc-insertion-points]:     insertion-points.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability
[gl-point]:                 ../../terms-glossary.md#point
[gl-anomaly]:               ../../terms-glossary.md#anomaly

# FAST Test Politikaları: Genel Bakış

FAST, bir uygulamayı [zafiyetlere][gl-vuln] karşı test ederken FAST düğümünün davranışını yapılandırmanıza olanak tanıyan test politikaları kullanır. Bu bölümdeki belgeler test politikası yönetimine ilişkin talimatlar içerir.

!!! info "Terimler"
    Bu dokümantasyon bölümünde "FAST test policy" ifadesi kısaca "policy" olarak anılabilir.

## Test Politikası İlkeleri

FAST, istek öğelerini [noktalar][gl-point] olarak temsil eder ve yalnızca işlenmesine izin verilen bir veya daha fazla nokta içeren isteklerle çalışır. Bu tür noktaların listesi politika ile tanımlanır. İstek, izin verilen noktalar içermiyorsa atılır ve bu istek temel alınarak test istekleri oluşturulmaz.

Politika aşağıdaki noktaları düzenler:

* Testlerin yürütülme şekli
    
    Test sırasında, FAST aşağıda listelenen bir veya daha fazla yöntemi izler:
    
    * yerleşik FAST uzantılarını kullanarak zafiyet tespiti, *detects* olarak da bilinir
    * özel uzantıları kullanarak zafiyet tespiti
    * FAST fuzz testi kullanarak [anomali][gl-anomaly] tespiti

* Uygulama testi sırasında FAST düğümünün işlediği temel isteğin öğeleri

    İşlenmesine izin verilen noktalar, Wallarm hesabınızdaki politika düzenleyicisinde **Insertion points** > **Where in the request to include** bölümünde yapılandırılır. Insertion points hakkında ayrıntılar için bu [bağlantıya][doc-insertion-points] bakın.

* Uygulama testi sırasında FAST düğümünün işlemediği temel isteğin öğeleri

    İşlenmesine izin verilmeyen noktalar, Wallarm hesabınızdaki test politikası ayarlarında **Insertion points** > **Where in the request to exclude** bölümünde yapılandırılır. Insertion points hakkında daha fazla bilgiyi şu [bağlantıda][doc-insertion-points] bulabilirsiniz.

    İşlenmesine izin verilmeyen noktalar, **Where in the request to include** bölümünde çok çeşitli noktalar olduğunda ve belirli öğelerin işlenmesinin hariç tutulması gerektiğinde kullanılabilir. Örneğin, tüm GET parametrelerinin işlenmesine izin verilmişse (`GET_.*`) ve `uuid` parametresinin işlenmesinin hariç tutulması gerekiyorsa, **Where in the request to exclude** bölümüne `GET_uid_value` ifadesi eklenmelidir.

!!! warning "Politika kapsamı"
    Noktaları açıkça hariç tuttuğunuzda, FAST düğümü yalnızca politika tarafından izin verilen noktaları işler.
    
    İstekteki diğer hiçbir nokta işlenmez.

??? info "Politika örneği"
    ![Politika örneği](../../../images/fast/operations/common/test-policy/overview/policy-flow-example.png)

    Yukarıdaki görsel, FAST düğümünün zafiyet tespitinde kullandığı politikayı göstermektedir. Bu politika, hedef uygulamaya her zaman dokunulmadan iletilen `token` GET parametresi hariç, temel istekteki tüm GET parametrelerinin işlenmesine izin verir.

    Ayrıca, politika fuzzer devre dışıyken yerleşik FAST uzantılarını ve özel uzantıları kullanmanıza izin verir.

    Dolayısıyla, detects ve uzantılar kullanılarak zafiyet testi yalnızca temel istek **A** (`/app.php?uid=1234`)
    .
    
    Temel istek **B** (`/app.php?token=qwe1234`) üzerinde zafiyet testi yapılmayacaktır çünkü işlenmesine izin verilen GET parametrelerini içermez. Bunun yerine, hariç tutulan `token` parametresini içerir.