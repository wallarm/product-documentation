Sistemlere bildirimler istekler aracılığıyla gönderilir. Sistem kullanılamaz durumda ya da entegrasyon parametreleri yanlış yapılandırılmışsa, hata kodu isteğe verilen yanıtta geri döner.

Eğer sistem Wallarm isteğine `2xx` dışında herhangi bir kod ile yanıt verirse, Wallarm `2xx` kodu alınıncaya kadar belirli aralıklarla isteği yeniden gönderir:

* İlk döngü aralıkları: 1, 3, 5, 10, 10 saniye
* İkinci döngü aralıkları: 0, 1, 3, 5, 30 saniye
* Üçüncü döngü aralıkları: 1, 1, 3, 5, 10, 30 dakika

Başarısız isteklerin yüzdesi 12 saat içinde %60'a ulaşırsa, entegrasyon otomatik olarak devre dışı bırakılır. Eğer sistem bildirimlerini alıyorsanız, otomatik olarak devre dışı bırakılan entegrasyon hakkında bir mesaj alırsınız.

<!-- ## Demo videolar

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->