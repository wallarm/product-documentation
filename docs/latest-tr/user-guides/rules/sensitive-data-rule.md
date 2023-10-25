[img-masking]:      ../../images/user-guides/rules/sensitive-data-rule.png

# Veri Gizleme Kuralları

Wallarm düğümü, aşağıdaki verileri Wallarm Buluta gönderir:

* Saldırılarla seri hale getirilmiş talepler
* Wallarm sistem sayaçları
* Sistem istatistikleri: CPU yükü, RAM kullanımı, vb.
* Wallarm sistem istatistikleri: işlenen NGINX isteklerinin sayısı, Tarantool istatistikleri, vb.
* Wallarm'ın uygulama yapısını doğru bir şekilde algılaması için gereken trafik hakkındaki bilgiler

Bazı verilerin, işlendiği sunucunun dışına transferi yapılmamalıdır. Bu kategori genellikle yetkilendirme (çerezler, tokenler, parolalar), kişisel bilgiler ve ödeme bilgilerini içerir.

Wallarm Node, taleplerde veri gizlemeyi destekler. Bu kural, talebi postanalytics modülüne ve Wallarm Buluta göndermeden önce belirtilen talep noktasının orijinal değerini keser. Bu yöntem, hassas verilerin güvenilir ortamın dışına sızmasını önler.

Bu, saldırıların görüntülenmesini, etkin saldırı (tehdit) doğrulamasını ve kaba kuvvet saldırılarının tespitini etkileyebilir.

## Kuralı oluşturma ve uygulama

--8<-- "../include-tr/waf/features/rules/rule-creation-options.md"

## Örnek: Çerez Değerinin Gizlenmesi

**Eğer** aşağıdaki koşullar gerçekleşirse:

* uygulama *example.com* alan adında erişilebilir durumdaysa
* uygulama kullanıcı kimlik doğrulaması için *PHPSESSID* çerezini kullanıyorsa
* güvenlik politikaları, Wallarm'ı kullanan çalışanların bu bilgilere erişimini reddediyorsa

**O zaman**, bu çerez için bir veri gizleme kuralı oluşturmak için aşağıdaki işlemler yapılmalıdır:

1. *Kurallar* sekmesine gidin
1. `example.com/**/*.*` dalını bulun ve *Kural ekle*'yi tıklayın
1. *Hassas veriyi gizle'*yi seçin
1. *Başlık* parametresini seçin ve değerini `COOKIE` olarak girin; *çerez* parametresini seçin ve *bu istek bölümünde* kelimesinden sonra değerini `PHPSESSID` olarak girin

    --8<-- "../include-tr/waf/features/rules/request-part-reference.md"

1. *Oluştur*'a tıklayın

![Hassas verilerin işaretlenmesi][img-masking]
