Notifications to the system are sent via requests. If the system is unavailable or integration parameters are configured incorrectly, the error code is returned in the response to the request.

Bildirimler sisteme istekler aracılığıyla gönderilir. Sistemin kullanılamaması veya entegrasyon parametrelerinin yanlış yapılandırılmış olması durumunda, istek yanıtında hata kodu döndürülür.

If the system responds to Wallarm request with any code other than `2xx`, Wallarm resends the request with the interval until the `2xx` code is received:

Eğer sistem, Wallarm isteğine `2xx` dışında herhangi bir kod ile yanıt verirse, Wallarm `2xx` kodu alınana kadar belirli aralıklarla isteği tekrar gönderir:

* The first cycle intervals: 1, 3, 5, 10, 10 seconds  
  İlk döngü aralıkları: 1, 3, 5, 10, 10 saniye
* The second cycle intervals: 0, 1, 3, 5, 30 seconds  
  İkinci döngü aralıkları: 0, 1, 3, 5, 30 saniye
* The third cycle intervals:  1, 1, 3, 5, 10, 30 minutes  
  Üçüncü döngü aralıkları: 1, 1, 3, 5, 10, 30 dakika

If the percentage of unsuccessful requests reaches 60% in 12 hours, the integration is automatically disabled. If you receive system notifications, you will get a message about automatically disabled integration.

12 saat içinde başarısız isteklerin oranı %60'a ulaşırsa, entegrasyon otomatik olarak devre dışı bırakılır. Sistem bildirimleri alırsanız, otomatik olarak devre dışı bırakılan entegrasyonla ilgili bir mesaj alırsınız.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->