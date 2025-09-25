[doc-allowed-host]:     operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-ssl]:              ssl/intro.md
[link-token]:           operations/internals.md#token

#   Sorun Giderme

##  Yaygın Sorunlar ve Nasıl Çözülür

**Ne yapmalı, eğer...**

* **...FAST düğümü konsol çıktısında aşağıdaki mesajlardan birini gösteriyorsa?**

--8<-- "../include/fast/console-include/tshoot/request-timeout.md"
    
    veya

--8<-- "../include/fast/console-include/tshoot/access-denied.md"
    
    **Çözüm:** şu hususlardan emin olun:

    * FAST düğümü ve ilgili Docker host'unun internet erişimi vardır (özellikle Wallarm API sunucuları `api.wallarm.com` ve `us1.api.wallarm.com` adreslerine `TCP/443` üzerinden erişilebilmelidir) ve
    * doğru [belirteç][link-token] değerini kullanıyor ve uygun Wallarm API sunucusuyla iletişim kuruyorsunuz. FAST'in, API sunucularına bağlanmak için bulutun Avrupa’da mı yoksa Amerika’da mı olduğuna bağlı olarak *farklı* belirteçler kullandığını unutmayın.
    
* **...bir istek kaynağı FAST düğümünün öz‑imzalı SSL sertifikasına güvenmiyorsa?**

    **Çözüm:** [bu talimatlarda][doc-ssl] listelenen yöntemlerden herhangi birini kullanarak güvenilir bir SSL sertifikası kurun.
    
* **...FAST düğümü çalışır durumda ancak temel (baseline) istekler kaydedilmiyorsa?**

    **Çözüm:** aşağıdakileri kontrol edin:

    * İstek kaynağı, FAST düğümünü bir proxy sunucusu olarak kullanacak şekilde yapılandırılmıştır ve bağlanmak için düğümün doğru port, alan adı veya IP adresi verilmiştir.
    * İstek kaynağı, kullandığı her protokol için FAST düğümünü proxy sunucusu olarak kullanmaktadır (yaygın bir durum: FAST düğümü HTTP proxy olarak kullanılırken istek kaynağı HTTPS istekleri göndermeye çalışır).
    * [`ALLOWED_HOST`][doc-allowed-host] ortam değişkeni doğru yapılandırılmıştır.
    
* **...FAST testleri veya özel uzantılar FAST düğümünde çalışmıyorsa?**

    **Çözüm:** FAST düğümünün temel istekleri kaydettiğini ve bu temel isteklerin düğümün kullandığı test politikasına uygun olduğunu kontrol edin.

##  Destek Ekibiyle İletişime Geçme

Yukarıdaki listede sorununuzu bulamıyor veya çözümü yararlı bulmuyorsanız, Wallarm destek ekibiyle iletişime geçin.

[Bir e‑posta yazabilir](mailto:support@wallarm.com) veya Wallarm portalındaki formu doldurabilirsiniz. Portal üzerinden geri bildirim göndermek için şunları yapın:

* Portalın sağ üst köşesindeki soru işaretine tıklayın.
* Açılan kenar çubuğunda “Wallarm Support” girdisini seçin.
* Bir e‑posta yazıp gönderin.

##  Tanılama Verilerini Toplama

Wallarm destek ekibinden bir kişi FAST düğümüyle ilgili bazı tanılama verilerini toplamanızı isteyebilir.

Birkaç ortam değişkeni ayarlayın ve verileri toplamak için aşağıdaki komutları çalıştırın (tanılama verilerini almak istediğiniz FAST düğümü konteynerinin gerçek adıyla `<FAST node container's name>` ifadesini değiştirin):

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <FAST node container's name> /usr/local/bin/collect_info_fast.sh

docker cp <FAST node container's name>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

Bu komutlar başarıyla çalıştırıldıktan sonra tanılama verileri Docker host'unda `fast_supout-$TIMESTAMP.tar.gz` arşivine yerleştirilecektir. Arşiv adındaki `$TIMESTAMP`, toplama zamanını temsil eder.