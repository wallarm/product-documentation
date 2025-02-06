---
description: Wallarm'un (FAST) otomatik güvenlik testleri oluşturarak ve çalıştırarak web uygulamalarındaki güvenlik açıklarını belirleyen özel bir araçtır.
---

[link-agreements]:      agreements.md

#   Wallarm FAST Genel Bakış

Wallarm'un API Güvenlik Testi Çerçevesi (FAST), web uygulamalarındaki güvenlik açıklarını otomatik olarak güvenlik testleri oluşturarak ve çalıştırarak ortaya çıkarmanızı sağlayan özel bir araçtır. SQL enjeksiyonları ve XSS bu tür güvenlik açıklarına örnektir.

Bir FAST düğümü, hedef uygulamaya yapılan HTTP ve HTTPS isteklerini yönlendiren çözümün temel bileşenlerinden biridir. Hedef uygulamaya yapılan istekleri keser ve orijinal istekleri değiştirerek bir güvenlik testi seti oluşturur. Bu, FAST düğümüne doğrudan entegre edilmiş fuzzing teknikleri ve bir güvenlik açıkları bilgi tabanının varlığı sayesinde mümkün olmaktadır. Düğüm, geniş bir kaynak yelpazesinden sorgular alabilir. Örneğin, mevcut bir otomatik test seti, FAST için sorgu kaynağı olarak hizmet edebilir.

Bir test politikası, güvenlik testi oluşturma sürecinin parametrelerini belirler. Bu tür politikalar, çözümün diğer bir bileşeni olan Wallarm Cloud kullanılarak oluşturulur. Cloud, kullanıcıya test politikaları oluşturma, test yürütme sürecini yönetme ve test sonuçlarını izleme için bir arayüz sağlar.

Güvenlik testi seti hazırlandıktan sonra, FAST düğümü istekleri hedef uygulamaya göndererek testi çalıştırır ve belirli güvenlik açıklarının varlığına ilişkin bir sonuç verir.

Otomasyon yetenekleri, yerleşik güvenlik açıkları bilgi tabanıyla birleşince, FAST DevOps, güvenlik uzmanları, yazılım geliştiriciler ve QA mühendisleri için uygun bir araç haline gelmektedir. FAST sayesinde, güvenlik uzmanlarının derin bilgisini kullanarak güvenlik testi politikaları oluşturmak mümkün olurken, güvenlik alanında uzmanlığı olmayan geliştiricilere de güvenlik testi oluşturma ve yürütme sürecini otomatikleştirme imkanı sunulmuş olur. Böylece iki grup ekip üyesi arasında verimli asenkron iletişim sağlanır. FAST mimarisi, mevcut CI/CD sürecine güvenlik testi oluşturma ve yürütme süreçlerinin entegrasyonuna izin vererek geliştirilen yazılımın genel kalitesinin artırılmasına olanak tanır.

--8<-- "../include/fast/cloud-note-readme.md"

!!! info "Metin formatlama konvansiyonları"
    Bu yönergeler, istenen sonuca ulaşmak için girilmesi veya çalıştırılması gereken çeşitli metin dizeleri ve komutları içermektedir. Kolaylık sağlaması için, hepsi metin formatlama kurallarına uygun biçimlendirilmiştir. Kuralları görmek için, bu [link][link-agreements]'a ilerleyin.

<!-- <div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/Me4o4v7dPyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->