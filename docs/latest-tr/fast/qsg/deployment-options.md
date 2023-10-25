---
description: FAST, FAST düğümü ve Wallarm bulutundan oluşan iki bileşenli bir çözümdür. Bu kılavuz, FAST düğümünün nasıl dağıtılacağına dair size talimat verir.
---

[img-fast-integration]:         ../../images/fast/qsg/en/deployment-options/0-qsg-fast-depl.png
[img-fast-scheme]:              ../../images/fast/qsg/en/deployment-options/1-qsg-fast-work-scheme.png       
[img-fast-deployment-options]:  ../../images/fast/qsg/en/deployment-options/2-qsg-fast-depl-options.png    
[img-insecure-connection]:     ../../images/fast/qsg/common/deployment-options/3-qsg-fast-depl-insecure-cert.png    
[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment-options/4-qsg-fast-depl-scheme.png
    
[link-https-google-gruyere]:    https://google-gruyere.appspot.com 


#   Dağıtım Seçenekleri

FAST, FAST düğümü ve Wallarm bulutundan oluşan iki bileşenli bir çözümdür. Bu kılavuz, FAST düğümünün nasıl dağıtılacağına dair size talimat verir.

--8<-- "../include/fast/cloud-note.md"

Uygulama testini yürütmek için, HTTP veya HTTPS istekleri öncelikle FAST düğümüne proxy üzerinden aktarılır. FAST, orijinal sorgulara göre buluttan alınan politikaya göre yeni bir istek seti oluşturur. Yeniden oluşturulan istekler, uygulamanın zayıf noktalarını test etmek üzere bir güvenlik test seti oluşturur.

![FAST ile test işlemi][img-fast-integration]

Temel istekler (uygulamalara yapılan orijinal istekler) değişik kaynaklardan elde edilebilir. Örneğin, temel istekler bir uygulama test kullanıcısı tarafından yazılabilir veya mevcut bir test otomasyon aracı tarafından oluşturulabilir. FAST'ın tüm temel isteklerinin zararlı olmasını gerektirmez: güvenlik test seti meşru isteklere dayalı olarak da oluşturulabilir. FAST düğümü, güvenlik test seti oluşturma ve uygulama amaçları için kullanılır. 

![FAST'in çalışma şekli][img-fast-scheme]
    
    
##  Kullanılabilir dağıtım seçenekleri 

FAST düğümünün dağıtımı için üç seçeneğiniz vardır. Düğümün kurulumu aşağıdaki yerlerden birinde olabilir:
1. Temel istek kaynağı olarak hizmet veren ev sahibi (örneğin, bir test kullanıcısının dizüstü bilgisayarı)
2. Hedef uygulamanın bulunduğu ev sahibi
3. Özel ev sahibi

![FAST dağıtım seçenekleri][img-fast-deployment-options]
    
    
##  Ana dağıtım hususları

FAST düğümü bir Docker konteyneri olarak gönderilir ve her platformda Docker’ı destekleyen her platformda çalıştırılabilir (bu Linux, Windows ve macOS'i içerir).

FAST'ın dağıtımı için Wallarm bulutunda bir hesap zorunlu bir gerekliliktedir. Bulut, FAST yapılandırması için bir kullanıcı arayüzü sağlamaktan sorumludur. Test sonuçları da bulut tarafından toplanır.

FAST düğümünün dağıtımını tamamladıktan sonra;
1. Düğümün hedef uygulamaya erişimi vardır.
2. Düğümün Wallarm buluta erişimi vardır.
3. Tüm temel HTTP veya HTTPS istekleri düğüm üzerinden proxy olacaktır.

!!! info "SSL sertifikası yükleme"
    Hedef uygulama ile etkileşim için HTTPS'in kullanılması durumunda, istek kaynağı FAST düğümü kurulumundan elde edilen öz imzalı SSL sertifikasına güvenmeyebilir. Örneğin, Mozilla Firefox tarayıcısını istek kaynağı olarak kullanıyorsanız, benzer bir mesajla karşılaşabilirsiniz (bu, diğer tarayıcılar veya istek kaynakları için farklı olabilir):
    
    ![“Güvensiz bağlantı” mesajı][img-insecure-connection]
    
    Sertifika sorununu çözmek için iki seçeneğiniz vardır:

    1.  Öz imzalı SSL sertifikasını FAST düğümünden istek kaynağına güvenilir bir sertifika olarak yükleyin.
    1.  Mevcut güvenilir SSL sertifikasını FAST düğümünüze yükleyin.
  
##  Hızlı Başlangıç kılavuzunda FAST dağıtımı 

Bu kılavuz, düğümün istek kaynağı ile yerel olarak yüklendiği dağıtım seçeneğini kullanarak FAST işlemini göstermeyi amaçlar.

Bu kılavuzdaki kullanılan kurulumun aşağıdaki özellikleri vardır:

* Mozilla Firefox tarayıcısı, temel istek kaynağı olarak hizmet verir.
* Bir HTTPS temel isteği oluşturulur.
* FAST düğümünden öz imzalı bir SSL sertifikası tarayıcıya yüklenir.
* Google Gruyere, hedef uygulama olarak hizmet verir.
* Hedef uygulama XSS zayıf noktalarına karşı test edilir.
* Politika, Wallarm bulutunun web arayüzü ile oluşturulur.
* Test süreci Wallarm bulutunun web arayüzü ile başlatılır.

![Hızlı Başlangıç kılavuzu dağıtım şeması][img-qsg-deployment-scheme]

!!! info "Google Gruyere"
    Google Gruyere, güvenlik testi için özel olarak oluşturulmuş bir uygulamadır. Bilerek birçok zayıf nokta içerir. Bu nedenle, her uygulama örneği, güvenlik nedenleriyle izole bir sandbox'ta çalışır. Uygulamayı kullanmaya başlamak için, <https://google-gruyere.appspot.com> adresine gitmelisiniz ve Gruyere uygulamasının ayrı bir örneğini olan bir sandbox çalıştırmalısınız.