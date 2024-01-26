---
description: Wallarm'ın FAST'ı, otomatik güvenlik testleri oluşturup çalıştırarak web uygulamalarındaki güvenlik açıklarını belirleyen özel olarak üretilmiş bir araçtır.
---

[link-sozlesmeler]:      agreements.md

#   Wallarm FAST Hakkında

Wallarm'ın API Güvenlik Test Çerçevesi (FAST), SQL enjeksiyonları ve XSS gibi güvenlik açıklarını otomatik bir şekilde ortaya çıkaran ve bu testleri yürüten özel bir araçtır.

Çözümün özünü, hedef uygulamaya yönlendirilen HTTP ve HTTPS isteklerini yönlendiren bir FAST düğümü oluşturur. Bu düğüm, hedef uygulamaya yönlendirilen istekleri yakalar ve orijinal isteklerde değişiklikler yaparak bir güvenlik test paketi oluşturur. Bu, fuzzing tekniklerinin ve açıklık bilgi tabanının doğrudan FAST düğümüne entegre edilmesi sayesinde mümkündür. Bu düğüm, sorguları geniş bir kaynak çeşitliliğinden alabilir. Örneğin, mevcut bir otomatik test paketi, FAST için sorgu kaynağı olarak çalışabilir.

Bir test politikası, güvenlik test grubu oluşturma sürecinin parametrelerini belirler. Bu politikalar, çözümün başka bir bölümü olan Wallarm Cloud aracılığıyla oluşturulur. Bulut, kullanıcıya test politikaları oluşturma, test yürütme sürecini yönetme ve test sonuçlarını görüntüleme için bir arayüz sağlar.

Güvenlik test paketi hazırlandıktan sonra, FAST düğümü bu testleri hedef uygulamaya istekler göndererek sürdürecek ve belirli açıkların varlığı hakkında bir sonuç sunacaktır.

Otomasyon yetenekleri ve dahili güvenlik açığı bilgi tabanı ile birleştiğinde, FAST, DevOps, güvenlik uzmanları, yazılım geliştiricileri ve QA mühendisleri için uygun bir araç haline gelir. FAST ile, güvenlik uzmanlarının derin bilgilerini kullanarak güvenlik test politikaları oluşturmak mümkünken, güvenlik alanında uzmanlık sahibi olmayan geliştiricilere güvenlik testi oluşturma ve yürütme sürecini otomatikleştirme imkanı sağlanır. Bu şekilde, her iki ekip üyesi grubu da birbirleriyle eşzamanlı olarak etkin bir şekilde iletişim kurabilir. FAST mimarisi, güvenlik testi oluşturma ve yürütme süreçlerini mevcut CI/CD sürecine entegre etmeyi mümkün kılar, böylece geliştirilen yazılımın genel kalitesi arttırılabilir.

--8<-- "../include-tr/fast/cloud-note-readme.md"

!!! info "Metin biçimlendirme kuralları"
    Bu rehberler, istenen sonucu elde etmek için girilmesi veya çalıştırılması gereken çeşitli metin dizeleri ve komutları içerir. Sizin rahatınız için, hepsi metin biçimlendirme kurallarına uygun olarak biçimlendirilmiştir. Kuralları görmek için bu [bağlantıya][link-sozlesmeler] ilerleyin.

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/Me4o4v7dPyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>