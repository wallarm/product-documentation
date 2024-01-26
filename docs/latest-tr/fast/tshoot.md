[doc-allowed-host]:     operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-ssl]:              ssl/intro.md
[link-token]:           operations/internals.md#token

#   Sorun Giderme

##  Ortak Sorunlar ve Nasıl Çözüleceği

**Eğer...**

* **... FAST düğümü, konsol çıktısında aşağıdaki mesajlardan birini görüntülüyorsa ne yapmalıyım?**

--8<-- "../include-tr/fast/console-include/tshoot/request-timeout.md"
    
    veya

--8<-- "../include-tr/fast/console-include/tshoot/access-denied.md"
    
    **Çözüm:** Şunu kontrol ettiğinizden emin olun:

    * FAST düğümünün ve ilgili Docker ana bilgisayarının internet erişimi vardır (özellikle, Wallarm `api.wallarm.com` ve `us1.api.wallarm.com` API sunucuları `TCP/443` üzerinden erişilebilir olmalıdır), ve
    * Doğru [token][link-token] değerini kullanıyorsunuz ve uygun Wallarm API sunucusuyla iletişim kuruyorsunuz. FAST'in, Avrupa veya Amerikan bulutlarında bulunduklarına bağlı olarak API sunucularına bağlanmak için *farklı* tokenler kullandığını unutmayın.
    
* **...bir istek kaynağı, FAST düğümünün kendisinden imzalı SSL sertifikasını güvenmiyor mu?**

    **Çözüm:** [Bu talimatlarda][doc-ssl] listelenen herhangi bir yöntemi kullanarak güvenilir bir SSL sertifikası kurun.
    
* **...FAST düğümü çalışıyor ancak hiçbir temel istek kaydedilmiyor mu?**

    **Çözüm:** Aşağıdaki durumları kontrol edin:

    * İstek kaynağı, FAST düğümünü bir proxy sunucusu olarak kullanmak üzere yapılandırılmış ve düğüme bağlanmak için doğru port, alan adı veya IP adresi ile sağlanmıştır.
    * İstek kaynağı, kaynak tarafından kullanılan her protokol için FAST düğümünü bir proxy sunucusu olarak kullanıyordur (sıkça karşılaşılan bir durum, FAST düğümünün bir HTTP proxy'i olarak kullanılması, istek kaynağının HTTPS istekleri göndermeye çalışmasıdır).
    * [`ALLOWED_HOST`][doc-allowed-host] ortam değişkeni doğru şekilde yapılandırılmıştır.
    
* **...FAST düğümünde hiçbir FAST testi veya özel genişletmeler çalışmıyor mu?**

    **Çözüm:** FAST düğümünün temel talepleri kaydettiğini ve bu temel taleplerin düğüm tarafından kullanılan test politikasına uyduğunu kontrol edin.

##  Destek Ekibiyle İletişim Kurma

Eğer sorununuzu yukarıdaki listede bulamıyorsanız veya çözümün yardımcı olmadığını düşünüyorsanız, Wallarm destek ekibiyle iletişime geçin.

Ya [bir e-posta yazabilir](mailto:support@wallarm.com) ya da Wallarm portalındaki formu doldurabilirsiniz. Portal üzerinden bir geri bildirim göndermek için aşağıdakileri yapın:

* Portalın sağ üst köşesindeki soru işaretine tıklayın.
* Açılan yan çubukta, "Wallarm Destek" girişini seçin.
* E-posta yazın ve gönderin.

##  Teşhis Verilerini Toplama

Wallarm destek ekibinden bir üye, FAST düğümü hakkındaki bir parça teşhis verisini toplamanızı isteyebilir.

Birkaç ortam değişkenini ayarlayın, ardından teşhis verilerini toplamak için aşağıdaki komutları yürütün ( `<FAST düğümü konteynerinin adı>` yerine teşhis verilerini almak istediğiniz FAST düğümü konteynerinin gerçek adını yazın):

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <FAST düğümü konteynerinin adı> /usr/local/bin/collect_info_fast.sh

docker cp <FAST düğümü konteynerinin adı>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

Bu komutların başarılı bir şekilde yürütülmesinin ardından, teşhis verileri Docker ana bilgisayarındaki `fast_supout-$TIMESTAMP.tar.gz` arşivinde yer alacaktır. Arşiv adındaki `$TIMESTAMP`, toplama zamanını temsil edecektir.