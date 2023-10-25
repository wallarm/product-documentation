[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:                      ../qsg/deployment-options.md

#   FAST İle Bir CI/CD Çalışma Akışı

Eğer FAST'ı bir CI/CD çalışma akışına entegre ederseniz, mevcut CI/CD çalışma akışına birkaç ekstra adım eklenir. Bu adımlar, mevcut bir CI/CD işinin bir parçası olabilir veya ayrı bir iş olabilir.

Eylemdeki test çalışması oluşturma durumuna bağlı olarak tam ekstra adımlar değişecektir. Tüm olası senaryolar aşağıda açıklanmıştır.

##  Wallarm API'si Üzerinden Entegrasyon (aka “API Üzerinden Dağıtım”)

Bu senaryoda, FAST düğümü Wallarm API'si üzerinden yönetilir. API ayrıca test çalışmalarını yönetmek için de kullanılır. FAST düğümü ya temel talepleri kaydedebilir veya zaten kaydedilmiş temel taleplerle çalışabilir:

![API üzerinden Entegrasyon][img-api-mode] 

Bu durumda, FAST aşağıdaki davranışları gösterir:
* Tek bir FAST düğüm Docker konteyneri, tek bir karşılık gelen bulut FAST düğümüne bağlıdır. Aynı anda birden fazla konteynerde bir FAST düğümü çalıştırmak için, dağıtmayı planladığınız konteynerlerin sayısı kadar bulut FAST düğümüne ve tokena ihtiyacınız olacaktır.
* Bulut FAST düğümü için yeni bir FAST düğümü oluşturursanız ve bu bulut düğümüne bağlı başka bir FAST düğümü varsa, sonraki düğüm için test çalışması yürütülmesi iptal edilecektir.
* Bir test politikası ve bir test kaydı, birkaç test çalışması ve FAST düğümü tarafından kullanılabilir.

Bu durumda FAST entegrasyonunun nasıl yapıldığına dair detaylar için [bu belgeye][doc-integration-api] bakın.

##  FAST Düğümü Üzerinden Entegrasyon (aka “CI MODE İle Dağıtım”)

Bu senaryoda, FAST düğümü test ve kayıt modlarında kullanılır. İşlem modu, bir konteyneri düğümle dağıtırken 'CI_MODE' çevre değişkenini değiştirerek değiştirilir. FAST düğümü test çalışmalarını kendisi yönetir; bu nedenle, bir CI/CD aracının Wallarm API'si ile etkileşime girmesi gerekmez.

Bu senaryonun şematik bir açıklaması için aşağıdaki resme bakın:

![CI MODE ile Entegrasyon][img-ci-mode]

Bu durumda, FAST aşağıdaki davranışları gösterir:
* Tek bir FAST düğüm Docker konteyneri, tek bir karşılık gelen bulut FAST düğümüne bağlıdır. Aynı anda birden fazla konteynerde bir FAST düğümü çalıştırmak için, dağıtmayı planladığınız konteynerlerin sayısı kadar bulut FAST düğümüne ve tokena ihtiyacınız olacaktır.
    Eş zamanlı CI/CD çalışma akışlarında kullanılmak üzere birçok FAST düğümünü doğru bir şekilde dağıtmak için, CI MODE'ye benzer başka bir yaklaşım kullanmanız gerekecektir. Bu durum [aşağıda][anchor-build-id] açıklanmıştır.
* Bulut FAST düğümü için yeni bir FAST düğümü oluşturursanız ve bu bulut düğümüne bağlı başka bir FAST düğümü varsa, sonraki düğüm için test çalışması yürütülmesi iptal edilecektir.
* Bir test politikası ve bir test kaydı, birkaç test çalışması ve FAST düğümü tarafından kullanılabilir.

Bu durumda FAST entegrasyonunun nasıl yapıldığına dair detaylar için [bu belgeye][doc-integration-ci-mode] bakın.

### Eş Zamanlı CI/CD Çalışma Akışlarında Kullanılmak Üzere CI MODE İle FAST Düğümünün Dağıtılması

FAST düğümünü eş zamanlı CI/CD çalışma akışları için uygun bir şekilde dağıtmak için, yukarıda açıklanan gibi CI MODE'yi kullanmalı ve ek ‘BUILD_ID’ çevre değişkenini düğümün konteynerine geçmelisiniz.

'`BUILD_ID`’ parametresi, tek bir bulut FAST düğümünü kullanırken birkaç farklı test kaydına kaydetmeyi ve bu test kayıtlarını daha sonra birkaç eşzamanlı test çalışması açmak için yeniden kullanmayı sağlar.

Bu senaryonun şematik bir açıklaması için aşağıdaki resme bakın:

![BUILD_ID ile Entegrasyon][img-ci-mode-build-id]

Bu durumda, FAST aşağıdaki davranışları gösterir:
* Birkaç FAST düğümü, eşzamanlı CI/CD çalışma akışlarında çalışmak üzere tek bir bulut FAST düğümü üzerinden çalışabilir. Not edin ki, **aynı token**, tüm bu FAST düğümleri tarafından kullanılır.
* Test çalışmaları, farklı 'BUILD_ID' tanımlayıcıları ile işaretlenmiş farklı test kayıtlarını kullanır.
* Bu test çalışmaları paralel olarak yürütülür; ayrıca, gerekirse farklı test politikaları kullanabilirler.

Eş zamanlı CI/CD çalışma akışlarında FAST'ı nasıl kullanacağınız hakkında ayrıntılı açıklama için [bu belgeye][doc-concurrent-pipelines] bakın.

!!! Bilgi "HTTPS desteği"
    Bu talimat, CI/CD ile FAST’ın HTTP protokolü üzerinden çalışan uygulamanın test edilmesine yönelik entegrasyonunu açıklar.
    
    FAST düğümü ayrıca HTTPS protokolü üzerinden çalışan uygulamaların test edilmesini de destekler. Daha fazla detay [Hızlı Başlangıç kılavuzu][doc-qsg]’nda açıklanmıştır.