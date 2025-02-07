---
description: FAST, FAST node ve Wallarm cloud'dan oluşan iki bileşenli bir çözümdür. Bu kılavuz, FAST node'un dağıtımını gerçekleştirmenizi anlatır.
---

[img-fast-integration]:         ../../images/fast/qsg/en/deployment-options/0-qsg-fast-depl.png
[img-fast-scheme]:              ../../images/fast/qsg/en/deployment-options/1-qsg-fast-work-scheme.png       
[img-fast-deployment-options]:  ../../images/fast/qsg/en/deployment-options/2-qsg-fast-depl-options.png    
[img-insecure-connection]:     ../../images/fast/qsg/common/deployment-options/3-qsg-fast-depl-insecure-cert.png    
[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment-options/4-qsg-fast-depl-scheme.png
    
[link-https-google-gruyere]:    https://google-gruyere.appspot.com    

    
#   Dağıtım Seçenekleri

FAST, FAST node ve Wallarm cloud'dan oluşan iki bileşenli bir çözümdür. Bu kılavuz, FAST node'un dağıtımını gerçekleştirmenizi anlatır.

--8<-- "../include/fast/cloud-note.md"

Uygulama testlerini gerçekleştirmek için, HTTP veya HTTPS istekleri öncelikle FAST node üzerinden proxy edilir. FAST, cloud'dan alınan politika doğrultusunda orijinal sorgulara dayalı yeni bir istek seti oluşturur. Oluşturulan bu yeni istekler, uygulamanın güvenlik açıklarını test etmek amacıyla bir güvenlik test seti oluşturur ve yürütülür.

![FAST ile test etme süreci][img-fast-integration]

Temel istekler (uygulamalara yönelik orijinal istekler) farklı kaynaklardan elde edilebilir. Örneğin, temel istekler bir uygulama test uzmanı tarafından yazılabilir veya mevcut bir test otomasyon aracı tarafından oluşturulabilir. FAST, tüm temel isteklerin kötü niyetli olmasını gerektirmez: meşru isteklerden de bir güvenlik test seti oluşturulabilir. FAST node, güvenlik test seti oluşturma ve yürütme amaçları için kullanılır.

![FAST'in çalışma prensibi][img-fast-scheme]
    
    
##  Mevcut Dağıtım Seçenekleri 

Üç farklı FAST node dağıtım seçeneği arasından seçim yapabilirsiniz. Node kurulumu şu konumlardan birinde bulunabilir:
1.  Temel istek kaynağı olarak hizmet veren host (örneğin, bir test uzmanının dizüstü bilgisayarı)
2.  Hedef uygulamanın bulunduğu host
3.  Özel host

![FAST dağıtım seçenekleri][img-fast-deployment-options]
    
    
##  Ana Dağıtım Hususları

FAST node, bir Docker container olarak sunulur ve Docker'ı destekleyen her platformda çalıştırılabilir (bu Linux, Windows ve macOS'u içerir).

FAST dağıtımı için Wallarm cloud'da bir hesap zorunludur. Cloud, FAST yapılandırması için bir kullanıcı arayüzü sağlamaktan sorumludur. Test sonuçları da cloud tarafından toplanır.

FAST node dağıtımını tamamladıktan sonra aşağıdakileri sağladığınızdan emin olun:
1.  Node'un hedef uygulamaya erişimi var.
2.  Node'un Wallarm cloud'a erişimi var.
3.  Tüm temel HTTP veya HTTPS istekleri node üzerinden proxy edilecektir.

!!! info "SSL certificate installation"
    Hedef uygulamayla HTTPS üzerinden etkileşimde bulunulması durumunda, istek kaynağı FAST node kurulumundan alınan kendi kendine imzalı SSL sertifikasına güvenmeyebilir. Örneğin, istek kaynağı olarak Mozilla Firefox tarayıcısını kullanıyorsanız, benzer bir mesajla karşılaşabilirsiniz (diğer tarayıcılar veya istek kaynakları için farklı olabilir):
    
    ![“Insecure connection” message][img-insecure-connection]
    
    Sertifika sorununu çözmek için iki seçeneğiniz vardır:
    
    1.  FAST node'dan alınan kendi kendine imzalı SSL sertifikasını, istek kaynağına güvenilir sertifika olarak yükleyin.
    1.  Mevcut güvenilir SSL sertifikasını FAST node'unuza yükleyin.
  
##  Hızlı Başlangıç Kılavuzundaki FAST Dağıtım Özellikleri 

Bu kılavuz, node'un istek kaynağı ile birlikte yerel olarak kurulduğu dağıtım seçeneğini kullanarak FAST'in çalışma şeklini göstermeyi amaçlamaktadır.

Bu kılavuzda kullanılan kurulum aşağıdaki özelliklere sahiptir:

* Mozilla Firefox tarayıcısı temel istek kaynağı olarak görev yapar.
* Bir HTTPS temel isteği oluşturulur.
* FAST node'dan alınan kendi kendine imzalı SSL sertifikası tarayıcıya yüklenir.
* Google Gruyere, hedef uygulama olarak hizmet verir.
* Hedef uygulama, XSS güvenlik açıklarına karşı test edilir.
* Politika, Wallarm cloud'un web arayüzü kullanılarak oluşturulur.
* Test süreci, Wallarm cloud'un web arayüzü ile başlatılır.

![Hızlı Başlangıç kılavuzu dağıtım şeması][img-qsg-deployment-scheme]

!!! info "Google Gruyere"
    Google Gruyere, güvenlik testi için özel olarak geliştirilmiş bir uygulamadır. Bilerek entegre edilmiş birçok güvenlik açığı içerir. Bu nedenle, her uygulama örneği güvenlik gerekçesiyle izole bir sandbox ortamında çalışır. Uygulama ile çalışmaya başlamak için <https://google-gruyere.appspot.com> adresine gidip, ayrılmış bir Gruyere uygulama örneği ile bir sandbox başlatmalısınız.