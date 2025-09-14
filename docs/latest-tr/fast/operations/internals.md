[img-testpolicy-id]:                        ../../images/fast/operations/common/internals/policy-id.png
[img-execution-timeline-recording]:         ../../images/fast/operations/en/internals/execution-timeline.png
[img-execution-timeline-no-recording]:      ../../images/fast/operations/en/internals/execution-timeline-existing-testrecord.png
[img-testrecord]:                           ../../images/fast/operations/en/internals/testrecord-explained.png           
[img-fast-node]:                            ../../images/fast/operations/common/internals/fast-node.png
[img-reuse-token]:                          ../../images/fast/operations/common/internals/reuse-token.png
[img-components-relations]:                 ../../images/fast/operations/common/internals/components-relations.png
[img-common-timeline-no-recording]:         ../../images/fast/operations/en/internals/common-timeline-existing-testrecord.png

[doc-ci-intro]:                     ../poc/integration-overview.md
[doc-node-deployment-api]:          ../poc/node-deployment.md
[doc-node-deployment-ci-mode]:      ../poc/ci-mode-recording.md
[doc-quick-start]:                  ../qsg/deployment-options.md
[doc-integration-overview]:         ../poc/integration-overview.md

[link-create-policy]:               test-policy/general.md
[link-use-policy]:                  test-policy/using-policy.md
[doc-policy-in-detail]:             test-policy/overview.md

[anchor-testpolicy]:    #fast-test-policy
[anchor-testrun]:       #test-run
[anchor-token]:         #token
[anchor-testrecord]:    #test-record

[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-about-timeout]:                create-testrun.md
[doc-node-deployment]:              ../poc/node-deployment.md#deployment-of-the-docker-container-with-the-fast-node

[link-wl-portal-new-policy]:    https://us1.my.wallarm.com/testing/policies/new#general 
[link-wl-portal-policy-tab]:    https://us1.my.wallarm.com/testing/policies
[link-wl-portal-node-tab]:      https://us1.my.wallarm.com/testing/nodes

#   FAST Nasıl Çalışır

--8<-- "../include/fast/cloud-note.md"

!!! info "Belge içeriğine dair kısa not"
    Aşağıda belirtilen varlıklar arasındaki ilişkiler ve bu bölümde açıklanan test senaryoları, Wallarm API kullanılarak yapılan testlerle ilgilidir. Bu tür testler tüm varlıkları kullanır; bu nedenle bu varlıkların birbirleriyle nasıl etkileştiğine dair bütünsel içgörüler sağlamak mümkündür.
    
    FAST'i bir CI/CD iş akışına entegre ederken bu varlıklar değişmez; ancak adımların sırası belirli bir duruma göre farklılık gösterebilir. Ek ayrıntılar için [bu belgeyi][doc-ci-intro] okuyun.

FAST aşağıdaki varlıkları kullanır:

* [Test kaydı.][anchor-testrecord]
* [FAST test politikası.][anchor-testpolicy]
* [Test çalıştırması.][anchor-testrun]
* [Token.][anchor-token]

Yukarıda bahsedilen varlıklar arasında birkaç önemli ilişki vardır:
* Bir test politikası ve bir test kaydı birden çok test çalıştırması ve FAST düğümü tarafından kullanılabilir.
* Bir token, Wallarm Cloud içindeki tek bir FAST düğümüyle, bu FAST düğümünü içeren tek bir Docker konteyneriyle ve tek bir test çalıştırmasıyla ilişkilidir.
* Mevcut token değerini, token başka bir düğümlü Docker konteyneri tarafından kullanılmıyorsa, FAST düğümünü içeren bir Docker konteynerine iletebilirsiniz.
* Başka bir test çalıştırması mevcutken FAST düğümü için yeni bir test çalıştırması oluşturursanız, mevcut test çalıştırması durur ve yenisiyle değiştirilir.

![Bileşenler arasındaki ilişkiler][img-components-relations]

##   FAST’in Kullandığı Varlıklar

FAST düğümü, istek kaynağından hedef uygulamaya giden tüm istekler için bir proxy görevi görür. Wallarm terminolojisine göre, bu isteklere temel istekler denir.

FAST düğümü istekleri aldığında, daha sonra bunlara dayanarak güvenlik testleri oluşturmak için bu istekleri özel “test kaydı” nesnesine kaydeder. Wallarm terminolojisine göre bu sürece “temel isteklerin kaydı” denir.

Temel istekler kaydedildikten sonra, FAST düğümü bir [test politikası][anchor-testpolicy] doğrultusunda bir güvenlik testi kümesi oluşturur. Ardından hedef uygulamayı zafiyetlere karşı değerlendirmek için güvenlik testi kümesi yürütülür.

Test kaydı, daha önce kaydedilen temel isteklerin aynı hedef uygulamayı veya başka bir hedef uygulamayı yeniden test etmek için tekrar kullanılmasına olanak tanır; temel isteklerin FAST düğümü üzerinden aynı şekilde gönderilmesini tekrar etmenize gerek yoktur. Bu yalnızca test kaydındaki temel istekler uygulamayı test etmeye uygun olduğunda mümkündür.


### Test Kaydı

FAST, güvenlik testi kümesini test kaydında depolanan temel isteklerden oluşturur.

Bir test kaydını bazı temel isteklerle doldurmak için, bu test kaydına ve bir FAST düğümüne bağlı bir [test çalıştırması][anchor-testrun] yürütülmeli ve bazı temel isteklerin FAST düğümü üzerinden gönderilmesi gerekir.  

Alternatif olarak, test çalıştırması oluşturmadan da bir test kaydını doldurmak mümkündür. Bunu yapmak için FAST düğümünü kayıt modunda çalıştırmalısınız. Ayrıntılar için [bu belgeye][doc-node-deployment-ci-mode] bakın. 

Test kaydı isteklerle doldurulduğunda, test altındaki bir uygulama, test kaydında depolanan temel isteklerin bir alt kümesi kullanılarak zafiyetler açısından değerlendirilebiliyorsa, bu kayıt başka bir test çalıştırmasıyla kullanılabilir.  

Tek bir test kaydı birden fazla FAST düğümü ve test çalıştırması tarafından kullanılabilir. Bu, şu durumlarda yararlı olabilir:
* Aynı hedef uygulama tekrar test ediliyor.
* Birden fazla hedef uygulama aynı temel isteklerle eşzamanlı olarak test ediliyor.

![Bir test kaydıyla çalışma][img-testrecord]
 

### FAST Test Politikası

Bir test politikası, zafiyet tespiti sürecini yürütmek için bir dizi kural tanımlar. Özellikle, uygulamanın test edilmesi gereken zafiyet türlerini seçebilirsiniz. Ayrıca politika, bir güvenlik testi kümesi oluşturulurken temel istekteki hangi parametrelerin işlenmeye uygun olduğunu belirler. Bu veriler, hedef uygulamanın istismar edilip edilemeyeceğini anlamak için kullanılacak test isteklerini oluşturmak üzere FAST tarafından kullanılır.

Yeni bir politikayı [oluşturabilir][link-create-policy] veya [mevcut bir politikayı][link-use-policy] kullanabilirsiniz.

!!! info "Uygun Test Politikasını Seçme"
    Test politikasının seçimi, test edilen hedef uygulamanın nasıl çalıştığına bağlıdır. Test ettiğiniz her uygulama için ayrı bir test politikası oluşturmanız önerilir.

!!! info "Ek Bilgi"

    * Hızlı Başlangıç kılavuzundan [test politikası örneği][doc-testpolicy-creation-example]
    * [Test politikası ayrıntıları][doc-policy-in-detail]

### Test Çalıştırması

Bir test çalıştırması, zafiyet test sürecinin tek bir yinelemesini tanımlar.

Bir test çalıştırması şunları içerir:

* [Test politikası][anchor-testpolicy] tanımlayıcısı
* [Test kaydı][anchor-testrecord] tanımlayıcısı

FAST düğümü, hedef bir uygulamanın güvenlik testini gerçekleştirirken bu değerlerden yararlanır.

Her test çalıştırması tek bir FAST düğümüyle sıkı biçimde ilişkilidir. Bu düğüm için test çalıştırması `A` devam ederken FAST düğümü için yeni bir `B` test çalıştırması oluşturursanız, `A` test çalıştırmasının yürütülmesi iptal edilir ve `B` test çalıştırmasıyla değiştirilir.

İki farklı test senaryosu için bir test çalıştırması oluşturmak mümkündür:
* İlk senaryoda, bir hedef uygulama zafiyetler açısından test edilirken, temel isteklerin kaydı da eşzamanlı olarak (yeni bir test kaydına) yapılmaktadır. Temel isteklerin kaydedilebilmesi için isteklerin istek kaynağından hedef uygulamaya FAST düğümü üzerinden akması gerekir. 

    Bu senaryo için bir test çalıştırmasının oluşturulması, bu kılavuz boyunca “test çalıştırması oluşturma” olarak anılacaktır.

* İkinci senaryoda, bir hedef uygulama, mevcut ve boş olmayan bir test kaydından çıkarılan temel istekler kullanılarak zafiyetler açısından test edilir. Bu senaryoda herhangi bir istek kaynağını dağıtmanız gerekmez.

    Bu senaryo için bir test çalıştırmasının oluşturulması, bu kılavuz boyunca “test çalıştırması kopyalama” olarak anılacaktır.

Bir test çalıştırması oluşturduğunuzda veya kopyaladığınızda, yürütmesi hemen başlar. Etkin senaryoya bağlı olarak yürütme süreci farklı adımları izler (aşağıya bakın).

### Test Çalıştırması Yürütme Akışı (temel isteklerin kaydı gerçekleşir)

Bir test çalıştırması oluşturduğunuzda, yürütmesi hemen başlar ve şu adımları izler:

1.  Bir FAST düğümü bir test çalıştırmasını bekler. 

    FAST düğümü, test çalıştırmasının başladığını anladığında, test politikasını ve test kaydı tanımlayıcılarını test çalıştırmasından alır.
    
2.  Tanımlayıcılar alındıktan sonra, temel isteklerin kayıt süreci başlar.
    
    Artık FAST düğümü istek kaynağından hedef uygulamaya gelen istekleri almaya hazırdır.
    
3.  İstek kaydının etkin olduğu dikkate alındığında, mevcut testlerin yürütülmesini başlatma zamanıdır. HTTP ve HTTPS istekleri FAST düğümü üzerinden gönderilir ve düğüm bunları temel istek olarak tanır.

    Tüm temel istekler, test çalıştırmasıyla ilişkili test kaydında depolanacaktır.
    
4.  Test yürütmesi tamamlandıktan sonra kayıt sürecini durdurabilirsiniz.
    
    Bir test çalıştırması oluşturulduktan sonra özel bir zaman aşımı değeri ayarlanır. Bu değer, FAST'in temel isteklerin yokluğu nedeniyle kayıt sürecini durdurmadan önce yeni temel istekleri ne kadar süre beklemesi gerektiğini belirler ([`inactivity_timeout`][doc-about-timeout] parametresi).
    
    Kayıt sürecini manuel olarak durdurmazsanız: 
    
    * FAST güvenlik testleri çoktan bitmiş olsa bile, test çalıştırması zaman aşımı değeri dolana kadar yürütmesine devam eder.
    * Diğer test çalıştırmaları, bu test çalıştırması durana kadar test kaydını yeniden kullanamaz. 
    
    Bekleyen başka temel istek yoksa kayıt sürecini FAST düğümünde durdurabilirsiniz. Şunlara dikkat edin:

    *  Güvenlik testlerinin oluşturulması ve yürütülmesi süreçleri durdurulmaz. Test çalıştırmasının yürütmesi, hedef uygulamanın zafiyetlere karşı değerlendirilmesi tamamlandığında durur. Bu davranış, CI/CD işinin yürütme süresini azaltmaya yardımcı olur.
    *  Kayıt durdurulur durdurulmaz diğer test çalıştırmaları test kaydını yeniden kullanma olanağı kazanır.
    
5.  FAST düğümü, gelen her temel isteğe dayalı olarak bir veya daha fazla test isteği oluşturur (yalnızca temel istek uygulanan test politikasını sağlıyorsa).
     
6.  FAST düğümü, test isteklerini hedef uygulamaya göndererek yürütür.

Temel isteklerin kayıt sürecinin durdurulması, test isteklerinin oluşturulması ve yürütülmesi süreçlerini etkilemez.

Temel isteklerin kaydedilmesi ile FAST güvenlik testlerinin oluşturulması ve yürütülmesi süreçleri paralel olarak çalışır:

![Test çalıştırması yürütme akışı (temel istek kaydı gerçekleşir)][img-execution-timeline-recording]

Not: yukarıdaki grafik, [FAST hızlı başlangıç kılavuzunda][doc-quick-start] açıklanan akışı göstermektedir. Temel istek kaydının olduğu bir akış, manuel güvenlik testi veya CI/CD araçları kullanılarak otomatik güvenlik testi için uygundur.

Bu senaryoda, test çalıştırmasını yönetmek için Wallarm API gereklidir. Ayrıntılar için [bu belgeye][doc-node-deployment-api] bakın. 


### Test Çalıştırması Yürütme Akışı (önceden kaydedilmiş temel istekler kullanılır)

Bir test çalıştırmasını kopyaladığınızda, yürütmesi hemen başlar ve şu adımları izler:

1.  Bir FAST düğümü bir test çalıştırmasını bekler. 

    FAST düğümü, test çalıştırmasının başladığını anladığında, test politikasını ve test kaydı tanımlayıcılarını test çalıştırmasından alır.
    
2.  Tanımlayıcılar alındıktan sonra, düğüm temel istekleri test kaydından çıkarır.

3.  FAST düğümü, çıkarılan her bir temel isteğe dayanarak bir veya daha fazla test isteği oluşturur (yalnızca temel istek uygulanan test politikasını sağlıyorsa).

4.  FAST düğümü, test isteklerini hedef uygulamaya göndererek yürütür.

Temel isteklerin çıkarılması süreci, FAST güvenlik testlerinin oluşturulması ve yürütülmesinden önce gerçekleşir:

![Test çalıştırması yürütme akışı (önceden kaydedilmiş temel istekler kullanılır)][img-execution-timeline-no-recording]

Bunun, [FAST hızlı başlangıç kılavuzunda][doc-quick-start] kullanılan yürütme akışı olduğunu unutmayın. Önceden kaydedilmiş temel istekleri kullanan akış, CI/CD araçlarıyla otomatik güvenlik testi için uygundur.

Bu senaryoda, test çalıştırmasını yönetmek için Wallarm API veya CI modunda FAST düğümü kullanılabilir. Ayrıntılar için [bu belgeye][doc-integration-overview] bakın.

Aşağıdaki grafik, yukarıda gösterilen zaman çizelgesine uyan en yaygın karşılaşılan CI/CD iş akışını göstermektedir:

![Test çalıştırması yürütme akışı (CI Modu)][img-common-timeline-no-recording]


##  Test Çalıştırmalarıyla Çalışma

Bu kılavuzu okurken, özellikle API çağrılarını kullanarak test çalıştırması yürütme sürecini nasıl yöneteceğinizi öğreneceksiniz:
* İstek kaynağından başka istek gelmiyorsa, temel isteklerin kayıt sürecini nasıl durduracağınız.
* Test çalıştırması yürütme durumunu nasıl kontrol edeceğiniz.

Bu tür API çağrılarını yapmak ve test çalıştırmasını FAST düğümüne bağlamak için bir [token][anchor-token] edinmeniz gerekir.

### Token

Bir FAST düğümü şunlardan oluşur:
* FAST yazılımının çalışır durumda olduğu Docker konteyneri.
    
    Trafiğin proxy’lenmesi, güvenlik testlerinin oluşturulması ve yürütülmesi süreçleri burada gerçekleşir.
    
* Wallarm Cloud içindeki FAST düğümü.

Bir token, çalışan Docker konteynerini buluttaki FAST düğümüne bağlar:

![FAST düğümü][img-fast-node]

Bir FAST düğümünü dağıtmak için şunları yapın:
1.  [Wallarm portal][link-wl-portal-node-tab] üzerinden Wallarm Cloud içinde bir FAST düğümü oluşturun. Sağlanan token'ı kopyalayın.
2.  Düğümle birlikte bir Docker konteyneri dağıtın ve token değerini konteynere iletin (bu süreç [burada][doc-node-deployment] ayrıntılı olarak açıklanmıştır).

Token şu amaçlara da hizmet eder:
* Test çalıştırmasını FAST düğümüne bağlamak.
* API çağrıları yaparak test çalıştırması yürütme sürecini yönetmenize izin vermek.

Gerektiği kadar çok FAST düğümünü Wallarm Cloud içinde oluşturabilir ve her düğüm için bir token alabilirsiniz. Örneğin, FAST'in gerekli olduğu birkaç CI/CD işiniz varsa, her iş için bulutta bir FAST düğümü başlatabilirsiniz.

Token'ları, başka etkin FAST düğümlü Docker konteynerleri tarafından kullanılmıyorlarsa yeniden kullanmak mümkündür (ör. aynı token'ı kullanan düğümlü herhangi bir Docker konteyneri durdurulmuş veya kaldırılmışsa):

![Token’ı yeniden kullanma][img-reuse-token]