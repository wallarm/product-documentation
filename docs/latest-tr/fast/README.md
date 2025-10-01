---
description: Wallarm'ın FAST'i, otomatik güvenlik testleri oluşturarak ve çalıştırarak web uygulamalarındaki güvenlik açıklarını belirlemek için özel olarak tasarlanmış bir araçtır.
---

[link-agreements]:      agreements.md

#   Wallarm FAST Genel Bakış

Wallarm'ın API Güvenlik Testi için Çerçevesi (FAST), güvenlik testlerini otomatik olarak oluşturarak ve çalıştırarak web uygulamalarındaki güvenlik açıklarını ortaya çıkarmanıza olanak tanıyan, bu amaç için özel olarak tasarlanmış bir araçtır. Bu tür güvenlik açıklarına SQL enjeksiyonları ve XSS örnek verilebilir.

Hedef uygulamaya HTTP ve HTTPS isteklerini yeniden yönlendiren bir FAST düğümü, çözümün temel bir bileşenidir. Hedef uygulamaya giden istekleri yakalar ve orijinal istekleri değiştirerek bir güvenlik test seti oluşturur. Bu, fuzzing tekniklerinin ve bir güvenlik açıkları bilgi tabanının doğrudan FAST düğümüne dahil edilmesi sayesinde mümkündür. Düğüm, çok çeşitli kaynaklardan sorgular alabilir. Örneğin, mevcut bir otomatik test seti, FAST için sorgu kaynağı olarak hizmet edebilir.

Bir test politikası, güvenlik testi üretim sürecinin parametrelerini tanımlar. Bu tür politikalar, çözümün başka bir bileşeni olan Wallarm Cloud kullanılarak oluşturulur. Bulut, kullanıcıya test politikaları oluşturma, test yürütme sürecini yönetme ve test sonuçlarını gözlemleme için bir arayüz sağlar.

Güvenlik test seti hazırlandıktan sonra, FAST düğümü istekleri hedef uygulamaya göndererek test setini çalıştırır ve belirli güvenlik açıklarının varlığına ilişkin bir sonuç sunar. 

Yerleşik güvenlik açıkları bilgi tabanıyla birleştirilmiş otomasyon yetenekleri göz önüne alındığında, FAST; DevOps, güvenlik uzmanları, yazılım geliştiriciler ve QA mühendisleri için uygun bir araçtır. FAST ile güvenlik uzmanlarının derin bilgisinden güvenlik testi politikaları oluşturmak için yararlanmak mümkündür; aynı zamanda güvenlik alanında uzmanlığı olmayan geliştiricilere güvenlik testi üretimi ve yürütmesini otomatikleştirme olanağı sağlar. Böylece her iki ekip üyesi grubu da birbirleriyle eşzamansız olarak etkili bir şekilde iletişim kurabilir. FAST mimarisi, güvenlik testi üretimi ve yürütme süreçlerinin mevcut CI/CD sürecine entegre edilmesine olanak tanır; bu sayede geliştirilen yazılımın genel kalitesi artırılabilir.

--8<-- "../include/fast/cloud-note-readme.md"

!!! info "Metin biçimlendirme kuralları"
    Bu kılavuzlar, istenen sonuca ulaşmak için girilmesi veya çalıştırılması gereken çeşitli metin dizeleri ve komutlar içerir. Kolaylık sağlaması için bunların tümü metin biçimlendirme kurallarına uygun şekilde biçimlendirilmiştir. Kuralları görmek için bu [bağlantıya][link-agreements] gidin.

<!-- <div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/Me4o4v7dPyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->