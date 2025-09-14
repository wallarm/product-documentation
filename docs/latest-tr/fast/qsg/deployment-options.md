---
description: FAST, FAST node ve Wallarm cloud’dan oluşan iki bileşenli bir çözümdür. Bu kılavuz, FAST node’un dağıtımını açıklar.
---

[img-fast-integration]:         ../../images/fast/qsg/en/deployment-options/0-qsg-fast-depl.png
[img-fast-scheme]:              ../../images/fast/qsg/en/deployment-options/1-qsg-fast-work-scheme.png       
[img-fast-deployment-options]:  ../../images/fast/qsg/en/deployment-options/2-qsg-fast-depl-options.png    
[img-insecure-connection]:     ../../images/fast/qsg/common/deployment-options/3-qsg-fast-depl-insecure-cert.png    
[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment-options/4-qsg-fast-depl-scheme.png
    
[link-https-google-gruyere]:    https://google-gruyere.appspot.com    

    
#   Dağıtım seçenekleri

FAST, FAST node ve Wallarm cloud’dan oluşan iki bileşenli bir çözümdür. Bu kılavuz, FAST node’un dağıtımını açıklar.

--8<-- "../include/fast/cloud-note.md"

Uygulama testlerini gerçekleştirmek için, HTTP veya HTTPS istekleri önce FAST node üzerinden proxy’lenir. FAST, buluttan alınan ilkeye göre özgün istekler temelinde yeni bir istek kümesi oluşturur. Yeni oluşturulan istekler bir güvenlik test kümesi meydana getirir ve uygulamayı güvenlik açıklarına karşı test etmek için yürütülür.

![FAST ile test etme süreci][img-fast-integration]

Temel istekler (uygulamalara gönderilen özgün istekler) farklı kaynaklardan elde edilebilir. Örneğin, temel istekler bir uygulama test uzmanı tarafından yazılabilir veya mevcut bir test otomasyon aracı tarafından oluşturulabilir. FAST, tüm temel isteklerin kötü amaçlı olmasını gerektirmez: güvenlik test kümesi meşru istekler temelinde de üretilebilir. FAST node, güvenlik test kümesini oluşturmak ve yürütmek için kullanılır.

![FAST nasıl çalışır][img-fast-scheme]
    
    
##  Mevcut dağıtım seçenekleri 

Üç FAST node dağıtım seçeneğinden birini tercih edebilirsiniz. Node kurulumu şu ortamlardan birinde bulunabilir:
1.  Temel istek kaynağı olarak hizmet veren host (örneğin, bir test uzmanının dizüstü bilgisayarı)
2.  Hedef uygulamanın bulunduğu host
3.  Ayrılmış host

![FAST dağıtım seçenekleri][img-fast-deployment-options]
    
    
##  Başlıca dağıtım hususları

FAST node, bir Docker konteyneri olarak sunulur ve Docker’ı destekleyen her platformda (Linux, Windows ve macOS dahil) çalıştırılabilir.

FAST dağıtımı için Wallarm cloud üzerinde bir hesap zorunludur. Bulut, FAST yapılandırması için bir kullanıcı arayüzü sağlar. Test sonuçları da bulut tarafından toplanır.

FAST node dağıtımını tamamladıktan sonra aşağıdakileri sağlamalısınız:
1.  Node’un hedef uygulamaya erişimi olmalı.
2.  Node’un Wallarm cloud’a erişimi olmalı.
3.  Tüm temel HTTP veya HTTPS istekleri node üzerinden proxy’lenmeli.

!!! info "SSL sertifikası kurulumu"
    Hedef uygulamayla HTTPS kullanarak etkileşim kurmanız durumunda, istek kaynağı, FAST node kurulumundan elde edilen öz imzalı SSL sertifikasına güvenmeyebilir. Örneğin, istek kaynağı olarak Mozilla Firefox tarayıcısını kullanıyorsanız, benzer bir mesajla karşılaşabilirsiniz (diğer tarayıcılar veya istek kaynakları için farklı olabilir):
    
    ![“Güvenli olmayan bağlantı” mesajı][img-insecure-connection]
    
    Sertifika sorununu çözmek için iki seçeneğiniz vardır:

    1.  FAST node’dan alınan öz imzalı SSL sertifikasını, istek kaynağına güvenilir sertifika olarak kurun.
    1.  Mevcut güvenilir SSL sertifikanızı FAST node’unuza kurun.
  
##  Hızlı Başlangıç kılavuzunda FAST dağıtımına özgü noktalar 

Bu kılavuz, node’un istek kaynağıyla yerel olarak kurulduğu dağıtım seçeneğini kullanarak FAST’in çalışma şeklini göstermeyi amaçlamaktadır. 

Bu kılavuzda kullanılan kurulumun aşağıdaki özellikleri vardır:

* Temel istek kaynağı olarak Mozilla Firefox tarayıcısı kullanılır.
* Bir HTTPS temel isteği oluşturulur.
* FAST node’dan alınan öz imzalı SSL sertifikası tarayıcıya kurulur.
* Hedef uygulama olarak Google Gruyere kullanılır.
* Hedef uygulama, XSS güvenlik açıklarına karşı test edilir.
* İlke, Wallarm cloud’un web arayüzüyle oluşturulur.
* Test süreci, Wallarm cloud’un web arayüzüyle başlatılır.

![Hızlı Başlangıç kılavuzu dağıtım şeması][img-qsg-deployment-scheme]

!!! info "Google Gruyere"
    Google Gruyere, güvenlik testleri için özel olarak geliştirilmiş bir uygulamadır. İçine kasıtlı olarak entegre edilmiş birçok güvenlik açığı barındırır. Bu nedenle, her uygulama örneği güvenlik gerekçesiyle izole bir sandbox içinde çalışır. Uygulamayla çalışmaya başlamak için <https://google-gruyere.appspot.com> adresine giderek Gruyere uygulamasının ayrılmış bir örneğiyle bir sandbox başlatmalısınız.