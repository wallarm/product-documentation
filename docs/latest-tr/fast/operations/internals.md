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

--8<-- "../include-tr/fast/cloud-note.md"

!!! info "Doküman hakkında kısa bilgi"
    Burada tanımlanan ilişkiler ve test senaryoları, Wallarm API kullanılarak test ederken geçerlidir. Bu tür testler, tüm varlıkları kullanır; bu sayede okuyucuya bu varlıkların birbirleriyle nasıl etkileşime girdiği konusunda bütünleşik bilgiler sunabilme şansımız olur.
    
    FAST'ı bir CI/CD iş akışına entegre ederken, bu varlıklar aynı kalır; ancak aşamaların sırası belirli durumlar için farklı olabilir. Daha fazla ayrıntı için [bu dökümana][doc-ci-intro] bakın.

FAST aşağıdaki varlıkları kullanmaktadır:

* [Test kaydı.][anchor-testrecord]
* [FAST test politikası.][anchor-testpolicy]
* [Test çalıştırma.][anchor-testrun]
* [Token.][anchor-token]

Daha önce belirtilen varlıklar arasında birkaç önemli ilişki bulunmaktadır:
* Bir test politikası ve bir test kaydı, birkaç test çalıştırması ve FAST düğümü tarafından kullanılabilir.
* Bir token, Wallarm bulutundaki tek bir FAST düğümü, bu FAST düğümüne sahip tek bir Docker konteyner ve tek bir test çalıştırması ile ilişkilidir.
* Token şu anda düğümün bulunduğu bir başka Docker konteyner tarafından kullanılmıyorsa, mevcut token değerini bir Docker konteynerine FAST düğümü ile birlikte geçirebilirsiniz.
* Başka bir test çalıştırması bulunan bir FAST düğümü için yeni bir test çalıştırması oluşturursanız, mevcut test çalıştırması durur ve yenisine yerini bırakır.

![Bileşenler arasındaki ilişkiler][img-components-relations]

##   FAST Tarafından Kullanılan Varlıklar

FAST düğümü, istek kaynağından hedef uygulamaya yönelik tüm talepler için bir vekil görevindedir. Wallarm terminolojisi çerçevesinde, bu taleplere *temel talepler* denir.

FAST düğümü talepleri aldığında, daha sonra bunlara dayanarak güvenlik testleri oluşturabilmek için bu talepleri özel bir "test kaydı" nesnesine kaydeder. Bu sürece Wallarm terminolojisi çerçevesinde "temel taleplerin kaydedilmesi" denir.

Temel taleplerin kaydedilmesinin ardından FAST düğümü, bir [*test politikası*][anchor-testpolicy]na uygun olarak güvenlik test seti oluşturur. Daha sonra, güvenlik test seti hedef uygulamanın açık noktaları hakkında değerlendirmeler yapmak üzere çalıştırılır.

Test kaydı, daha önceden kaydedilmiş temel taleplerin aynı hedef uygulamayı veya başka bir hedef uygulamayı tekrar test etmek üzere tekrar kullanılabilmesini sağlar; bu sayede, aynısını FAST düğümü üzerinden göndermek için belirlenmiş aynı temel taleplerin tekrarlanmasına gerek kalmaz. Bu yalnızca test kaydındaki temel taleplerin uygulamayı test etmek için uygun olması durumunda mümkündür.


### Test Kaydı

FAST, test kaydında saklanan temel taleplerden bir güvenlik test seti oluşturur.

Bir test kaydına bazı temel talepleri eklemek için, bu test kaydı ve bir FAST düğümü ile bağlantılı olan bir [test çalıştırma][anchor-testrun] işlemi gerçekleştirilmeli ve bazı temel talepler FAST düğümü üzerinden gönderilmeli. 

Alternatif olarak, bir test çalıştırma oluşturmadan bir test kaydına talepleri doldurmak da mümkündür. Bunu yapmak için, FAST düğümünü kayıt modunda çalıştırmalısınız. Detaylar için [bu dökümanı][doc-node-deployment-ci-mode] inceleyin. 

Test kaydı talepler ile doldurulmuş durumdaysa, test edilecek uygulamanın, test kaydında saklanan temel taleplerin bir alt kümesini kullanarak açıklıklarının değerlendirilmesi mümkün ise, bu test kaydını başka bir test çalıştırması ile kullanabilirsiniz.

Tek bir test kaydı, birden çok FAST düğümü ve test çalıştırması tarafından kullanılabilir. Bu, özellikle:
* Aynı hedef uygulamanın tekrar test edilmesi durumunda.
* Aynı temel talepler ile birden çok hedef uygulamanın eş zamanlı olarak test edilmesi durumunda.

![Bir test kaydı ile çalışma][img-testrecord]
 

### FAST Test Politikası

Bir *test politikası*, zafiyet tespit sürecinin nasıl yürütüleceğini belirleyen bir kural setidir. Özellikle, uygulamanın test edilmesi gereken zafiyet türlerini seçebilirsiniz. Ayrıca, politika, güvenlik test seti oluştururken temel talepte hangi parametrelerin işleme uygun olduğunu belirler. Bu veri parçaları, FAST tarafından hedef uygulamanın düzgün çalışıp çalışmadığını belirlemek için kullanılan test taleplerini oluşturmak için kullanılır.

Yeni bir politika [oluşturabilir][link-create-policy] veya [mevcut bir politikayı][link-use-policy] kullanabilirsiniz.

!!! info "Uygun Test Politikasını Seçme"
    Test politikasının seçimi, test edilen hedef uygulamanın nasıl çalıştığına bağlıdır. Her test ettiğiniz uygulama için ayrı bir test politikası oluşturmanız önerilir.

!!! info "Ek Bilgi"

    * Hızlı Başlangıç rehberinden [test politikası örneği][doc-testpolicy-creation-example] 
    * [Test politikasının ayrıntıları][doc-policy-in-detail]

### Testi Çalıştırma

Bir *test çalıştırma*, zafiyet test sürecinin tek bir iterasyonunu tanımlar.

Bir test çalıştırması içerir:

* [Test politikası][anchor-testpolicy] tanımlayıcısı
* [Test kayıt][anchor-testrecord] tanımlayıcısı

FAST düğümü, bir hedef uygulamanın güvenlik testini gerçekleştirirken bu değerleri kullanır.

Her test çalıştırması, tek bir FAST düğümü ile sıkı bir şekilde bağlantılıdır. Bu düğüm için başka bir test çalıştırması 'A' devam ederken bu düğüm için yeni bir test çalıştırması 'B' oluşturursanız, test çalıştırması 'A'nın çalışması durdurulur ve test çalıştırması 'B' tarafından yerine getirilir.

Farklı iki test senaryosu için bir test çalıştırması oluşturabilirsiniz:
* İlk senaryoda, hedef uygulama zafiyetler için test edilir ve temel taleplerin kayıtları eş zamanlı olarak gerçekleştirilir (yeni bir test kaydına). Temel talepler, temel taleplerin kaydedilebilmesi için istek kaynağından hedef uygulamaya doğru FAST düğümü üzerinden akmalıdır. 

    Bu yol gösterici boyunca bu senaryo için bir test çalıştırmasının oluşturulmasına “test çalıştırması oluşturmak” şeklinde atıfta bulunulacaktır.

* İkinci senaryoda, hedef uygulama zafiyetler için mevcut, boş olmayan bir test kaydından çıkarılan temel talepler kullanılarak test edilir. Bu senaryoda, herhangi bir istek kaynağını dağıtmanıza gerek yoktur.

    Bu yol gösterici boyunca bu senaryo için bir test çalıştırması oluşturulmasına “test çalıştırmasını kopyalamak” şeklinde atıfta bulunulacaktır.

Bir test çalıştırması oluşturduğunuzda veya bir test çalıştırmasını kopyaladığınızda, çalıştırma hemen başlar. Çalışma süreci, hangi test senaryosunun kullanıldığına bağlı olarak farklı aşamaları izler (aşağıya bakın).

### Test Çalıştırmasının Çalışma Akışı (temel taleplerin kaydedilmesi gerçekleşiyor)

Bir test çalıştırması oluşturduğunuzda, çalışmasının hemen başlar ve aşağıdaki adımları izler:

1.  Bir FAST düğümü, bir test çalıştırmasını bekler. 

    FAST düğümü, test çalıştırmasının başladığını belirler belirlemez, düğüm test politikası ve test kaydının tanımlayıcılarını test çalıştırmasından alır.
    
2.  Bu tanımlayıcıları aldıktan sonra, *temel taleplerin kayıt süreci* başlar.
    
    Şimdi FAST düğümü, istek kaynağından hedef uygulamaya doğru talepler almak üzere hazırdır.
    
3.  Talep kaydının aktif olduğu görüldüğünde, mevcut testlerin uygulamasına başlanır. HTTP ve HTTPS talepleri, FAST düğümü tarafından temel talepler olarak tanınacak şekilde düğüm üzerinden gönderilir.

    Tüm temel talepler, test çalıştırması ile eşleşen test kaydında saklanır.
    
4.  Test uygulaması bittikten sonra, kayıt sürecini durdurabilirsiniz.
    
    Bir test çalıştırması oluşturulduktan sonra ayarlanan özel bir zaman aşımı değeri vardır. Bu değer, FAST'ın yeni temel talepleri beklerken kayıt işlemini temel taleplerin olmaması nedeniyle ne kadar süre boyunca durduracağını belirler ( [`inactivity_timeout`][doc-about-timeout] parametresi).
    
    Kayıt sürecini manuel olarak durdurmazsanız, o zaman: 
    
    * Test çalışması, FAST güvenlik testleri çoktan bitmiş olsa bile zaman aşımı süresi dolumuna kadar çalıştırmasını sürdürür.
    * Diğer test çalışmaları, bu test çalışması durana kadar test kaydını yeniden kullanamazlar. 
    
    Daha fazla temel talep beklemediğinizi biliyorsanız, FAST düğümündeki kayıt sürecini durdurabilirsiniz. Şunları not edin:

    *  Güvenlik testlerinin oluşum ve çalıştırılması sürecinin durdurulması gerekli değildir. Test çalıştırması, hedef uygulamanın zafiyet değerlendirmesinin bitmesiyle durur. Bu davranış, CI/CD işinin çalıştırılma süresini azaltmaya yardımcı olur.
    *  Diğer test çalışmaları, kayıt durdurulduğunda test kaydını yeniden kullanma yeteneği kazanırlar.
    
5.  FAST düğümü, her gelen temel talep bazında bir veya daha fazla test talebi oluşturur (yalnızca temel talep, uygulanan test politikasını karşılıyorsa).
     
6.  FAST düğümü, test taleplerini hedef uygulamaya göndererek bu talepleri çalıştırır.

Temel taleplerin kayıt sürecini durdurmak, test taleplerinin oluşturulması ve çalıştırılması süreçlerine etki etmez.

Temel taleplerin kaydedilmesi ve FAST güvenlik testlerinin oluşturulması ve çalıştırılması süreçleri paralel olarak gerçekleştirilir:

![Test çalıştırması çalıştırma akışı (temel talep kayıt işlemi gerçekleşiyor)][img-execution-timeline-recording]

Not: Yukarıdaki grafik, [FAST hızlı başlangıç kılavuzunda][doc-quick-start] açıklanan akışı gösterir. Temel taleplerin kaydedilmesi ile ilgili akış, manuel güvenlik testleri veya CI/CD araçları kullanılarak otomatik güvenlik testleri için uygundur.

Bu senaryoda, test çalıştırmasını yönetmek için Wallarm API'si gereklidir. Detaylar için [bu dökümanı][doc-node-deployment-api] inceleyin. 


### Test Çalıştırmasının Çalışma Akışı (önceden kaydedilmiş temel talepler kullanılıyor)

Bir test çalıştırması kopyaladığınızda, çalışmasına hemen başlar ve aşağıdaki adımları izler:

1.  Bir FAST düğümü, bir test çalıştırmasını bekler. 

    FAST düğümü, test çalıştırmasının başladığını belirler belirlemez, düğüm test politikası ve test kaydının tanımlayıcılarını test çalıştırmasından alır.
    
2.  Bu tanımlayıcıları aldıktan sonra, düğüm test kaydından temel talepleri çıkarır.

3.  FAST düğümü, her bir çıkarılan temel talep bazında bir veya daha fazla test talebi oluşturur (yalnızca temel talep, uygulanan test politikasını karşılıyorsa).

4.  FAST düğümü, test taleplerini hedef uygulamaya göndererek bu talepleri çalıştırır.

Temel taleplerin çıkarılma süreci, FAST güvenlik testlerinin oluşturulması ve çalıştırılması süreçlerinden önce gerçekleşir:

![Test çalıştırması çalıştırma akışı (önceden kaydedilmiş temel talepler kullanılıyor)][img-execution-timeline-no-recording]

Not edilmesi gerekenler; bu, [FAST hızlı başlangıç kılavuzunda][doc-quick-start] kullanılan çalışma akışıdır. Önceden kaydedilmiş temel taleplerin kullanıldığı akış, CI/CD araçları kullanılarak otomatik güvenlik testleri için uygundur.

Bu senaryoda, test çalıştırmasını yönetmek için Wallarm API veya CI modunda FAST düğümü kullanılabilir. Detaylar için [bu dökümanı][doc-integration-overview] inceleyin.

Aşağıdaki grafik, yukarıda gösterilen zaman çizelgesine uyan en yaygın CI/CD iş akışını göstermektedir:

![Test çalıştırması çalıştırma akışı (CI Modu)][img-common-timeline-no-recording]


##  Test Çalıştırmaları ile Çalışma

Bu rehberi okurken, API çağrıları kullanarak test çalıştırması yürütme sürecini nasıl yöneteceğinizi öğreneceksiniz, özellikle:
* İstek kaynağından daha fazla talep bulunmadığında temel taleplerin kayıt sürecini nasıl durduracağınızı.
* Test çalıştırması yürütme durumunu nasıl kontrol edeceğinizi.

Bu tür API çağrıları yapabilmek ve test çalıştırmasını FAST düğümüne bağlamak için bir [*token*][anchor-token] almanız gerekmektedir.

### Token

Bir FAST düğümünde şunlar bulunur:
* Çalışan Docker konteyneri ile FAST yazılımı.
    
    Bu, trafik proxy'leme, güvenlik testi oluşturma, yürütme süreçlerinin yer aldığı yerdir.
    
* Wallarm bulutundaki FAST düğümü.

Bir token, çalışan Docker konteyneri ile bulutta bulunan FAST düğümünü bağlar:

![FAST düğümü][img-fast-node]

Bir FAST düğümünü dağıtmak için aşağıdakileri yapınız:
1.  [Wallarm portalı][link-wl-portal-node-tab] kullanarak Wallarm bulutunda bir FAST düğümü oluşturun. Sağlanan tokeni kopyalayın.
2.  Düğüm ile birlikte bir Docker konteyneri oluşturun ve token değerini konteynere geçin (bu süreç [burada][doc-node-deployment] ayrıntılarıyla anlatılmıştır).

Token ayrıca aşağıdaki amaçlara da hizmet eder:
* Test çalıştırmasını FAST düğümü ile bağlar.
* API çağrıları yaparak test çalıştırması yürütme sürecini yönetmenizi sağlar.

Daha önce aldığınız tokenları, bu tokenlar başka bir aktif Docker konteyneri tarafından kullanılmıyorsa yeniden kullanabilirsiniz (örneğin, aynı tokeni kullanan herhangi bir Docker konteyneri ile bir düğüm durdu veya kaldırıldı):

![Token'un yeniden kullanılması][img-reuse-token]