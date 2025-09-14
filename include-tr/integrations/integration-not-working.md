Sisteme bildirimler istekler aracılığıyla gönderilir. Sistem kullanılamaz durumdaysa veya entegrasyon parametreleri yanlış yapılandırılmışsa, isteğin yanıtında hata kodu döndürülür.

Sistem, Wallarm isteğine `2xx` dışındaki herhangi bir kodla yanıt verirse, Wallarm `2xx` kodu alınana kadar belirli aralıklarla isteği yeniden gönderir:

* İlk çevrim aralıkları: 1, 3, 5, 10, 10 saniye
* İkinci çevrim aralıkları: 0, 1, 3, 5, 30 saniye
* Üçüncü çevrim aralıkları:  1, 1, 3, 5, 10, 30 dakika

Başarısız isteklerin oranı 12 saat içinde %60'a ulaşırsa, entegrasyon otomatik olarak devre dışı bırakılır. Sistem bildirimleri alıyorsanız, otomatik olarak devre dışı bırakılan entegrasyon hakkında bir mesaj alırsınız.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->