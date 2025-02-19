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

!!! info "Belgenin İçeriği Hakkında Kısa Not"
    Altındaki ilişkiler (aşağıya bakın) ve bu bölümde tanımlanan test senaryoları, Wallarm API kullanılarak yapılan testlerle ilgilidir. Bu tür testler tüm varlıkları kullanır; bu yüzden okuyucuya bu varlıkların nasıl etkileşime girdiğine dair bütünsel bilgiler sunmak mümkündür.
    
    FAST'in CI/CD iş akışına entegrasyonu sırasında bu varlıklar değişmeden kalır; ancak, adımların sırası belirli durumlar için farklılık gösterebilir. Ek ayrıntılar için [bu belgeye][doc-ci-intro] bakın.

FAST aşağıdaki varlıkları kullanır:

* [Test kaydı.][anchor-testrecord]
* [FAST test politikası.][anchor-testpolicy]
* [Test çalışması.][anchor-testrun]
* [Token.][anchor-token]

Önceden bahsedilen varlıklar arasında bazı önemli ilişkiler vardır:
* Bir test politikası ve test kaydı, birden fazla test çalışması ve FAST düğümü tarafından kullanılabilir.
* Bir token, Wallarm cloud'daki tek bir FAST düğümü, o düğüme sahip tek bir Docker konteyneri ve tek bir test çalışmasıyla ilişkilidir.
* Var olan token değerini, token başka hiçbir Docker konteyneri tarafından kullanılmıyorsa, FAST düğümüne sahip Docker konteynerine geçirebilirsiniz.
* Eğer başka bir test çalışması devam ederken FAST düğümü için yeni bir test çalışması oluşturursanız, mevcut test çalışması durdurulur ve yeni olanıyla değiştirilir.

![Bileşenler Arasındaki İlişkiler][img-components-relations]

##   FAST Tarafından Kullanılan Varlıklar

FAST düğümü, istek kaynağından hedef uygulamaya gelen tüm isteklerin proxy'si olarak hareket eder. Wallarm terminolojisine göre, bu isteklere *baseline requests* adı verilir.

FAST düğümü istekleri aldığında, bunları daha sonra bunlara dayanarak güvenlik testleri oluşturmak için özel “test kaydı” nesnesine kaydeder. Wallarm terminolojisinde bu işleme “baseline requests recording” denir.

Baseline istekler kaydedildikten sonra, FAST düğümü, [*test policy*][anchor-testpolicy]’ye göre bir güvenlik test seti oluşturur. Ardından, hedef uygulamanın güvenlik açıkları açısından değerlendirilmesi için güvenlik test seti çalıştırılır.

Test kaydı, daha önce kaydedilmiş baseline isteklerin aynı hedef uygulama veya başka bir hedef uygulama üzerinde yeniden kullanılmasını sağlar; FAST düğümü üzerinden aynı baseline isteklerin tekrar gönderilmesine gerek yoktur. Bu, yalnızca test kaydındaki baseline istekler uygulamayı test etmek için uygunsa mümkündür.


### Test Kaydı

FAST, test kaydında saklanan baseline isteklerden bir güvenlik test seti oluşturur.

Bazı baseline isteklerle bir test kaydı oluşturmak için, bu test kaydıyla bağlantılı bir [test çalışması][anchor-testrun] yürütülmeli ve bazı baseline istekler FAST düğümü üzerinden gönderilmelidir.  

Alternatif olarak, bir test çalışması oluşturmadan da test kaydı doldurmak mümkündür. Bunu yapmak için, FAST düğümünü kayıt modunda çalıştırmalısınız. Ayrıntılar için [bu belgeye][doc-node-deployment-ci-mode] bakın. 

Test kaydı isteklerle dolduğunda, test kaydında saklanan baseline isteklerin bir alt kümesini kullanarak hedef uygulama için güvenlik açıkları değerlendirmesi yapılabiliyorsa, başka bir test çalışmasıyla birlikte kullanılabilir.  

Tek bir test kaydı, birden fazla FAST düğümü ve test çalışması tarafından kullanılabilir. Bu, aşağıdaki durumlarda yararlı olabilir:
* Aynı hedef uygulama yeniden test ediliyorsa.
* Birden fazla hedef uygulama, aynı baseline isteklerle eşzamanlı olarak test ediliyorsa.

![Test kaydı ile çalışma][img-testrecord]
 

### FAST Test Politikası

Bir *test policy*, güvenlik açığı tespit sürecinin yürütülmesi için bir dizi kural tanımlar. Özellikle, uygulamanın test edilmesi gereken güvenlik açığı türlerini seçebilirsiniz. Ayrıca, politika, güvenlik test seti oluşturulurken baseline istekte hangi parametrelerin işlenebilir olduğunu belirler. Bu veriler, FAST'in test isteklerini oluşturmasında kullanılır; bu test istekleri, hedef uygulamanın istismar edilebilir olup olmadığını tespit etmek için kullanılır.

Yeni bir politika [oluşturabilir][link-create-policy] veya mevcut bir tanesini [kullanabilirsiniz][link-use-policy].

!!! info "Uygun Test Politikasının Seçilmesi"
    Test politikasının seçimi, test edilen hedef uygulamanın nasıl çalıştığına bağlıdır. Test ettiğiniz her uygulama için ayrı bir test politikası oluşturmanız önerilir.

!!! info "Ek Bilgiler"

    * Hızlı Başlangıç kılavuzundan [Test politikası örneği][doc-testpolicy-creation-example]
    * [Test politikası detayları][doc-policy-in-detail]

### Test Çalışması

Bir *test run* (test çalışması), güvenlik açığı test sürecinin tek yinelemesini ifade eder.

Bir test çalışması şunları içerir:

* [Test policy][anchor-testpolicy] tanımlayıcısı
* [Test record][anchor-testrecord] tanımlayıcısı

FAST düğümü, hedef uygulamanın güvenlik testi gerçekleştirilirken bu değerleri kullanır.

Her test çalışması, tek bir FAST düğümüyle sıkı sıkıya bağlıdır. Eğer, o düğüm için test çalışması `A` devam ederken yeni bir `B` test çalışması oluşturulursa, test çalışması `A` durdurulur ve yerine `B` çalışması geçer.

İki farklı test senaryosu için test çalışması oluşturmak mümkündür:
* İlk senaryoda, bir hedef uygulama güvenlik açıkları açısından test edilirken, baseline isteklerin kaydı aynı anda (yeni bir test kaydına) yapılmaktadır. Baseline isteklerin kaydedilebilmesi için istek kaynağından hedef uygulamaya FAST düğümü üzerinden akması gerekir. 

    Bu senaryo için oluşturulan test çalışması bundan böyle kılavuzda “test run creation” (test çalışması oluşturma) olarak anılacaktır.

* İkinci senaryoda, bir hedef uygulama, boş olmayan mevcut bir test kaydından çıkarılan baseline isteklerle test edilir. Bu senaryoda, herhangi bir istek kaynağı dağıtmaya gerek yoktur.

Bu senaryoda, oluşturulan veya kopyalanan test çalışması anında yürütülmeye başlar. İşe alınan test senaryosuna bağlı olarak, yürütme süreci farklı adımları takip eder (aşağıya bakın).

### Test Çalışması Yürütme Akışı (baseline istek kaydının yapıldığı senaryo)

Bir test çalışması oluşturduğunuzda, yürütülmesi hemen başlar ve aşağıdaki adımları takip eder:

1.  Bir FAST düğümü, test çalışmasını bekler. 

    FAST düğümü test çalışmasının başladığını belirlediğinde, test politikasını ve test kaydı tanımlayıcılarını test çalışmasından alır.
    
2.  Tanımlayıcılar elde edildikten sonra, *baseline request kaydetme süreci* başlar.
    
    Şimdi FAST düğümü, istek kaynağından hedef uygulamaya gelen istekleri almaya hazırdır.
    
3.  Kayıt işlemi aktifken, mevcut testlerin yürütülmesine başlama zamanı gelmiştir. HTTP ve HTTPS istekleri FAST düğümü üzerinden gönderildiğinde, bu istekler baseline request olarak algılanır.

    Tüm baseline istekler, test çalışmasıyla ilişkili test kaydında saklanacaktır.
    
4.  Test yürütmesi tamamlandıktan sonra, kayıt sürecini durdurabilirsiniz.
    
    Test çalışması oluşturulduktan sonra özel bir zaman aşımı değeri ayarlanır. Bu zaman aşımı, FAST'in yeni baseline istekleri bekleyeceği süreyi, yeni baseline isteklerin gelmemesi durumunda kayıt sürecinin durdurulma zamanını belirler ([`inactivity_timeout`][doc-about-timeout] parametresi).
    
    Kayıt sürecini manuel olarak durdurmazsanız:
    
    * Test çalışması, FAST güvenlik testleri bitmiş olsa bile zaman aşımı dolana kadar yürütülmeye devam eder.
    * Diğer test çalışmaları, bu test çalışması durana kadar test kaydını kullanamaz.
    
    Kayıt sürecini, bekleyen başka baseline istek kalmadığında FAST düğümünde durdurabilirsiniz. Şunları unutmayın:

    *  Güvenlik testlerinin oluşturulması ve yürütülmesi süreçleri durdurulmaz. Hedef uygulamanın güvenlik açıkları açısından değerlendirilmesi tamamlandığında test çalışması yürütmesi sona erer. Bu davranış, CI/CD işinin yürütme süresini azaltmaya yardımcı olur.
    *  Kayıt süreci durduğunda, diğer test çalışmaları test kaydını yeniden kullanmaya başlayabilir.
    
5.  FAST düğümü, her gelen baseline isteğe dayalı olarak, (yalnızca ilgili baseline istek uygulanan test politikasını karşılıyorsa) bir veya daha fazla test isteği oluşturur.
     
6.  FAST düğümü, test isteklerini hedef uygulamaya göndererek yürütür.

Baseline istek kaydetme sürecinin durdurulması, test isteklerinin oluşturulması ve yürütülmesi süreçleri üzerinde hiçbir etki yapmaz.

Baseline istek kaydetme ve FAST güvenlik testlerinin oluşturulması ile yürütülmesi süreçleri paralel olarak çalışır:

![Test run execution flow (baseline request recording takes place)][img-execution-timeline-recording]

Not: yukarıdaki grafik, [FAST quick start guide][doc-quick-start]’te açıklanan akışı göstermektedir. Baseline istek kaydı yapılan akış, manuel güvenlik testi veya CI/CD araçları kullanılarak yapılan otomatik güvenlik testi için uygundur.

Bu senaryoda, test çalışmasını yönetmek için Wallarm API gereklidir. Ayrıntılar için [bu belgeye][doc-node-deployment-api] bakın. 


### Test Çalışması Yürütme Akışı (önceden kaydedilmiş baseline isteklerin kullanıldığı senaryo)

Bir test çalışmasını kopyaladığınızda, yürütülmesi hemen başlar ve aşağıdaki adımları izler:

1.  Bir FAST düğümü, test çalışmasını bekler. 

    FAST düğümü test çalışmasının başladığını belirlediğinde, test politikasını ve test kaydı tanımlayıcılarını test çalışmasından alır.
    
2.  Tanımlayıcılar elde edildikten sonra, düğüm test kaydından baseline istekleri çıkarır.

3.  FAST düğümü, çıkarılan her baseline isteğe dayalı olarak (yalnızca ilgili baseline istek uygulanan test politikasını karşılıyorsa) bir veya daha fazla test isteği oluşturur.

4.  FAST düğümü, test isteklerini hedef uygulamaya göndererek yürütür.

Baseline request çıkarma işlemi, FAST güvenlik testlerinin oluşturulması ve yürütülmesinden önce gerçekleşir:

![Test run execution flow (pre-recorded baseline requests are used)][img-execution-timeline-no-recording]

[FAST quick start guide][doc-quick-start]’te açıklanan akışın bu olduğunu unutmayın. Önceden kaydedilmiş baseline isteklerin kullanıldığı akış, CI/CD araçları kullanılarak yapılan otomatik güvenlik testleri için uygundur.

Bu senaryoda, test çalışmasını yönetmek için Wallarm API veya CI modundaki FAST düğümü kullanılabilir. Ayrıntılar için [bu belgeye][doc-integration-overview] bakın.

Aşağıdaki grafik, yukarıda gösterilen zaman çizelgesine uyan en yaygın karşılaşılan CI/CD iş akışını gösterir:

![Test run execution flow (CI Mode)][img-common-timeline-no-recording]


##  Test Çalışmaları ile Çalışma

Bu kılavuzu okurken, API çağrıları kullanılarak test çalışması yürütme sürecinin nasıl yönetileceğini öğreneceksiniz, özellikle:
* İstek kaynağından başka istek kalmadığında baseline istek kaydetme sürecinin nasıl durdurulacağını.
* Test çalışması yürütme durumunun nasıl kontrol edileceğini.

Test çalışmasını FAST düğümüyle ilişkilendirmek ve API çağrıları yapmak için bir [*token*][anchor-token] edinmeniz gerekmektedir.

### Token

Bir FAST düğümü şunlardan oluşur:
* FAST yazılımının çalıştığı aktif Docker konteyneri.
    
    Trafik proxyleme, güvenlik testlerinin oluşturulması ve yürütülmesi işlemlerinin burada gerçekleşir.
    
* Wallarm cloud FAST düğümü.

Bir token, çalışan Docker konteynerini cloud'daki FAST düğümü ile bağlar:

![FAST düğümü][img-fast-node]

Bir FAST düğümü dağıtmak için, aşağıdakileri yapın:
1.  Wallarm portalı kullanarak [Wallarm portal][link-wl-portal-node-tab] üzerinden bir FAST düğümü oluşturun. Sağlanan tokenı kopyalayın.
2.  Düğüm içeren bir Docker konteyneri dağıtın ve token değerini konteynere geçirin (bu süreç [burada][doc-node-deployment] ayrıntılı olarak açıklanmıştır).

Token ayrıca aşağıdaki amaçlarla hizmet eder:
* Test çalışmasını FAST düğümü ile bağlamak.
* API çağrıları yaparak test çalışması yürütme sürecini yönetmenize olanak tanımak.

Gerektiği kadar çok FAST düğümü oluşturabilir ve her düğüm için bir token edinebilirsiniz. Örneğin, FAST'in gerektirdiği birkaç CI/CD işiniz varsa, her iş için cloud'da bir FAST düğümü oluşturabilirsiniz.

Daha önce elde ettiğiniz tokenları, başka aktif Docker konteynerleri tarafından kullanılmıyorsa (örneğin, aynı tokenı kullanan herhangi bir Docker konteyneri durdurulmuş veya kaldırılmışsa) yeniden kullanmak mümkündür:

![Token'ın yeniden kullanımı][img-reuse-token]