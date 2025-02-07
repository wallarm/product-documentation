# Sorun Giderme

## Yaygın Sorunlar ve Çözüm Yolları

**Ne Yapılmalı...**

* **...FAST node aşağıdaki mesajlardan birini konsol çıktısında gösteriyorsa?**

--8<-- "../include/fast/console-include/tshoot/request-timeout.md"
    
    veya

--8<-- "../include/fast/console-include/tshoot/access-denied.md"
    
    **Çözüm:** şunlardan emin olun:

    * FAST node ve ilgili Docker host internet erişimine sahip olmalı (özellikle, Wallarm `api.wallarm.com` ve `us1.api.wallarm.com` API sunucuları `TCP/443` üzerinden erişilebilir olmalıdır), ve
    * doğru [token][link-token] değeri kullanılıyor olmalı ve ilgili Wallarm API sunucusu ile iletişim kurulmalıdır. FAST'in, API sunucularına Avrupa ya da Amerika bulutlarında yer aldığına bağlı olarak *farklı* tokenlar kullandığını unutmayın.
    
* **...bir istek kaynağı FAST node'un imzasız SSL sertifikasına güvenmiyorsa?**

    **Çözüm:** [bu talimatlarda][doc-ssl] listelenen herhangi bir yöntem kullanılarak güvenilir bir SSL sertifikası kurun.
    
* **...FAST node çalışıyor ancak temel istekler kaydedilmiyorsa?**

    **Çözüm:** şunları kontrol edin:

    * İstek kaynağı, FAST node'u bir proxy sunucusu olarak kullanacak şekilde yapılandırılmış olmalı ve bağlantı kurulacak node'un doğru port, alan adı veya IP adresi sağlanmış olmalıdır.
    * İstek kaynağı, kullanılan tüm protokoller için FAST node'u bir proxy sunucusu olarak kullanmalıdır (yaygın bir durum, FAST node'un HTTP proxy olarak kullanılması, fakat istek kaynağının HTTPS istekleri göndermeye çalışmasıdır).
    * [`ALLOWED_HOST`][doc-allowed-host] ortam değişkeni doğru şekilde yapılandırılmış olmalıdır.
    
* **...FAST node üzerinde FAST testleri veya özel eklentiler çalışmıyorsa?**

    **Çözüm:** FAST node'un temel istekleri kaydettiğinden ve bu temel isteklerin node tarafından kullanılan test politikasına uygun olduğundan emin olun.

## Destek Ekibiyle İletişim

Eğer yukarıdaki listede sorununuzu bulamıyorsanız veya çözümü yetersiz buluyorsanız, Wallarm destek ekibiyle iletişime geçin.

E-posta [yazabilir](mailto:support@wallarm.com) veya Wallarm portalındaki formu doldurabilirsiniz. Portal üzerinden geri bildirim göndermek için şu adımları izleyin:

* Portalın sağ üst köşesinde bulunan soru işaretine tıklayın.
* Açılan kenar çubuğunda “Wallarm Support” öğesini seçin.
* Bir e-posta yazın ve gönderin.

## Tanılama Verisi Toplama

Wallarm destek ekibinden bir üye, FAST node ile ilgili bir tanılama verisi toplamanızı isteyebilir.

Birkaç ortam değişkeni ayarlayın, ardından aşağıdaki komutları çalıştırarak veriyi toplayın ( `<FAST node container's name>` kısmını, tanılama verisini almak istediğiniz FAST node container'ının gerçek adı ile değiştirin):

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <FAST node container's name> /usr/local/bin/collect_info_fast.sh

docker cp <FAST node container's name>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

Bu komutların başarılı şekilde çalıştırılmasından sonra tanılama verisi Docker host üzerinde `fast_supout-$TIMESTAMP.tar.gz` arşivine koyulacaktır. Arşiv adındaki `$TIMESTAMP` toplama zamanını temsil edecektir.

[doc-allowed-host]:     operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-ssl]:              ssl/intro.md
[link-token]:           operations/internals.md#token