[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-the-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:              ../qsg/deployment-options.md

#   FAST ile bir CI/CD İş Akışı

FAST’i bir CI/CD iş akışına entegre ederseniz, mevcut CI/CD iş akışına birkaç ek adım eklenecektir. Bu adımlar ya mevcut bir CI/CD işinin parçası olabilir ya da ayrı bir iş olabilir.   

Uygulamadaki test çalıştırması oluşturma senaryosuna bağlı olarak bu ek adımların tam listesi farklılık gösterecektir. Olası tüm senaryolar aşağıda açıklanmıştır.

##  Wallarm API aracılığıyla entegrasyon (diğer adıyla “API üzerinden dağıtım”)

Bu senaryoda FAST düğümü Wallarm API aracılığıyla yönetilir. API, test çalıştırmalarını yönetmek için de kullanılır. FAST düğümü ya temel (baseline) istekleri kaydedebilir ya da önceden kaydedilmiş temel isteklerle çalışabilir:
    
![API ile entegrasyon][img-api-mode] 

Bu senaryoda FAST aşağıdaki davranışları sergiler:
* Tek bir FAST düğümü Docker konteyneri, karşılık gelen tek bir bulut FAST düğümüne bağlıdır. Aynı anda birden fazla FAST düğümü konteyneri çalıştırmak için, dağıtmayı planladığınız konteyner sayısıyla aynı sayıda bulut FAST düğümüne ve tokene ihtiyacınız vardır.
* Bir bulut FAST düğümü için yeni bir FAST düğümü oluşturursanız ve bu bulut düğümüne bağlı başka bir FAST düğümü zaten mevcutsa, söz konusu diğer düğüm için test çalıştırması sonlandırılır.
* Bir test politikası ve bir test kaydı birden çok test çalıştırması ve FAST düğümü tarafından kullanılabilir.
    
Bu durumda FAST entegrasyonunun nasıl yapıldığına ilişkin ayrıntılar için [bu belgeye][doc-integration-api] bakın. 

##  FAST Düğümü aracılığıyla entegrasyon (diğer adıyla “CI MODE ile dağıtım”)

Bu senaryoda FAST düğümü test etme ve kayıt modlarında kullanılır. Düğümle birlikte konteyneri dağıtırken `CI_MODE` ortam değişkenini ayarlayarak çalışma modu değiştirilir. FAST düğümü test çalıştırmalarını kendi başına yönetir; bu nedenle bir CI/CD aracının Wallarm API ile etkileşime girmesine gerek yoktur.

Bu senaryonun şematik açıklaması için aşağıdaki görsele bakın:

![CI MODE ile entegrasyon][img-ci-mode]

Bu senaryoda FAST aşağıdaki davranışları sergiler:
* Tek bir FAST düğümü Docker konteyneri, karşılık gelen tek bir bulut FAST düğümüne bağlıdır. Aynı anda birden fazla FAST düğümü konteyneri çalıştırmak için, dağıtmayı planladığınız konteyner sayısıyla aynı sayıda bulut FAST düğümüne ve tokene ihtiyacınız vardır.
    Eşzamanlı CI/CD iş akışlarında kullanılacak çok sayıda FAST düğümünü doğru şekilde dağıtmak için, aşağıda [açıklanan][anchor-build-id] CI MODE’a benzer farklı bir yaklaşım kullanmanız gerekecektir.
* Bir bulut FAST düğümü için yeni bir FAST düğümü oluşturursanız ve bu bulut düğümüne bağlı başka bir FAST düğümü zaten mevcutsa, söz konusu diğer düğüm için test çalıştırması sonlandırılır.
* Bir test politikası ve bir test kaydı birden çok test çalıştırması ve FAST düğümü tarafından kullanılabilir.

Bu durumda FAST entegrasyonunun nasıl yapıldığına ilişkin ayrıntılar için [bu belgeye][doc-integration-ci-mode] bakın. 
    

<a id="deploying-the-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows"></a>
### Eşzamanlı CI/CD İş Akışlarında Kullanım için CI MODE ile FAST Düğümünü Dağıtma

FAST düğümünü eşzamanlı CI/CD iş akışlarına uygun şekilde dağıtmak için, yukarıda açıklandığı gibi CI MODE’u kullanmalı ve düğümün konteynerine ek `BUILD_ID` ortam değişkenini iletmelisiniz.

`BUILD_ID` parametresi, tek bir bulut FAST düğümü kullanırken birkaç farklı test kaydına kayıt yapılmasına ve bu test kayıtlarının daha sonra birkaç eşzamanlı test çalıştırmasını başlatmak için yeniden kullanılmasına olanak tanır.

Bu senaryonun şematik açıklaması için aşağıdaki görsele bakın:

![BUILD_ID ile entegrasyon][img-ci-mode-build-id]

Bu senaryoda FAST aşağıdaki davranışları sergiler:
* Birkaç FAST düğümü, eşzamanlı CI/CD iş akışlarında çalışmak üzere tek bir bulut FAST düğümü üzerinden çalışabilir. Dikkat edin, bu FAST düğümlerinin tümü tarafından **aynı token kullanılır**.
* Test çalıştırmaları, farklı `BUILD_ID` tanımlayıcılarıyla işaretlenmiş farklı test kayıtlarını kullanır.
* Bu test çalıştırmaları paralel olarak yürütülür; ayrıca gerekirse farklı test politikaları da kullanabilirler.

FAST’i eşzamanlı CI/CD iş akışlarında nasıl kullanacağınıza dair ayrıntılı açıklama için [bu belgeye][doc-concurrent-pipelines] bakın.


!!! info "HTTPS desteği"
    Bu yönerge, HTTP protokolü üzerinden çalışan uygulamayı test etmek için FAST’in CI/CD ile entegrasyonunu açıklar.
    
    FAST düğümü, HTTPS protokolü üzerinden çalışan uygulamaların test edilmesini de destekler. Daha fazla ayrıntı için [Hızlı Başlangıç kılavuzu][doc-qsg] bölümüne bakın.