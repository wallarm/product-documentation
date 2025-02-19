[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-the-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:              ../qsg/deployment-options.md

# Bir CI/CD İş Akışı ile FAST

FAST'i bir CI/CD iş akışına entegre ederseniz, mevcut CI/CD iş akışına birkaç ek adım eklenir. Bu adımlar, mevcut bir CI/CD işinin parçası olabileceği gibi ayrı bir iş olarak da gerçekleştirilebilir.

Tam olarak hangi ek adımların ekleneceği, gerçekleştirilen test çalıştırma senaryosuna bağlı olarak değişecektir. Tüm olası senaryolar aşağıda açıklanmıştır.

## Wallarm API ile Entegrasyon (diğer adıyla “API Üzerinden Dağıtım”)

Bu senaryoda, FAST düğümü Wallarm API üzerinden yönetilir. API, test çalıştırmalarını yönetmek için de kullanılır. FAST düğümü, temel istekleri kaydedebileceği gibi, daha önceden kaydedilmiş temel isteklerle de çalışabilir:
    
![API ile Entegrasyon][img-api-mode] 

Bu senaryoda, FAST şu davranışları sergiler:
* Tek bir FAST düğümü Docker konteyneri, tek bir bulut FAST düğümüne bağlanır. Aynı anda birden fazla konteyneri FAST düğümü ile çalıştırmak için, dağıtmayı planladığınız konteyner sayısıyla eşleşen sayıda bulut FAST düğümü ve token gereklidir.
* Bir bulut FAST düğümü için yeni bir FAST düğümü oluşturursanız ve o bulut düğümüne bağlı başka bir FAST düğümü varsa, test çalıştırması son düğüm için iptal edilecektir.
* Bir test politikası ve bir test kaydı, birden fazla test çalıştırması ve FAST düğümü tarafından kullanılabilir.
    
Bu durumda FAST entegrasyonunun nasıl yapıldığı hakkında detaylar için [bu belgeye][doc-integration-api] bakın. 

## FAST Düğümü ile Entegrasyon (diğer adıyla “CI MODE ile Dağıtım”)

Bu senaryoda, FAST düğümü test ve kayıt modlarında kullanılır. Çalışma modu, düğüm içeren bir konteyner dağıtılırken `CI_MODE` ortam değişkeni ile değiştirilir. FAST düğümü test çalıştırmalarını kendi başına yönetir; bu nedenle, bir CI/CD aracının Wallarm API ile etkileşime girmesine gerek yoktur.

Bu senaryonun şematik açıklaması için aşağıdaki görsele bakın:

![CI MODE ile Entegrasyon][img-ci-mode]

Bu senaryoda, FAST şu davranışları sergiler:
* Tek bir FAST düğümü Docker konteyneri, tek bir bulut FAST düğümüne bağlanır. Aynı anda birden fazla konteyneri FAST düğümü ile çalıştırmak için, dağıtmayı planladığınız konteyner sayısıyla eşleşen sayıda bulut FAST düğümü ve token gereklidir.
    Aynı anda çalışan CI/CD iş akışlarında kullanılmak üzere birden çok FAST düğümünü doğru şekilde dağıtmak için, aşağıda [açıklanan][anchor-build-id] CI MODE'e benzer farklı bir yaklaşım kullanmanız gerekmektedir.
* Bir bulut FAST düğümü için yeni bir FAST düğümü oluşturursanız ve o bulut düğümüne bağlı başka bir FAST düğümü varsa, test çalıştırması son düğüm için iptal edilecektir.
* Bir test politikası ve bir test kaydı, birden fazla test çalıştırması ve FAST düğümü tarafından kullanılabilir.

Bu durumda FAST entegrasyonunun nasıl yapıldığı hakkında detaylar için [bu belgeye][doc-integration-ci-mode] bakın.
    
### Aynı Anda Çalışan CI/CD İş Akışlarında Kullanım için CI MODE ile FAST Düğümü Dağıtımı

Aynı anda çalışan CI/CD iş akışlarında kullanılmak üzere FAST düğümünü dağıtmak için, yukarıda açıklandığı gibi CI MODE kullanılmalı ve düğüm konteynerine ek olarak `BUILD_ID` ortam değişkeni geçirilmelidir.

`BUILD_ID` parametresi, tek bir bulut FAST düğümünü kullanırken birden fazla farklı test kaydının kaydedilmesine olanak sağlar ve bu test kayıtlarını daha sonra birkaç eşzamanlı test çalıştırması başlatmak için yeniden kullanmanızı mümkün kılar.

Bu senaryonun şematik açıklaması için aşağıdaki görsele bakın:

![BUILD_ID ile Entegrasyon][img-ci-mode-build-id]

Bu senaryoda, FAST şu davranışları sergiler:
* Birkaç FAST düğümü, aynı anda çalışan CI/CD iş akışlarında çalışmak üzere tek bir bulut FAST düğümü aracılığıyla çalışabilir. Tüm bu FAST düğümleri **aynı token'ı** kullanır.
* Test çalıştırmaları, farklı `BUILD_ID` tanımlayıcılarıyla işaretlenmiş farklı test kayıtlarını kullanır.
* Bu test çalıştırmaları paralel olarak yürütülür; ayrıca, gerekirse farklı test politikaları kullanabilirler.

Aynı anda çalışan CI/CD iş akışlarında FAST'in nasıl kullanılacağına dair detaylı açıklama için [bu belgeye][doc-concurrent-pipelines] bakın.


!!! info "HTTPS desteği"
    Bu talimat, FAST'in HTTP protokolü üzerinde çalışan uygulamaları test etmek için CI/CD ile entegrasyonunu açıklar.
    
    FAST düğümü, HTTPS protokolü üzerinde çalışan uygulamaların test edilmesini de destekler. Daha detaylı bilgiler [Quick Start rehberinde][doc-qsg] açıklanmıştır.