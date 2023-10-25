# Wallarm hizmet durumu sayfası

Bu kılavuz, Wallarm hizmet durumu sayfası hakkında ayrıntılar içerir.

## Wallarm'ın hizmet durumunu gösteren bir sayfası var mı?

Evet, Wallarm durum sayfası https://status.wallarm.com adresinde mevcuttur. Bu sayfa, her bir Wallarm Bulutu için Wallarm Konsolu ve Wallarm API hizmetlerinin erişilebilirliği hakkında canlı ve tarihsel verileri görüntüler:

* **Wallarm US Cloud**
* **Wallarm EU Cloud**

![Wallarm durum sayfası](../images/status-page.png)

## Hizmet durumu değiştiğinde bir bildirim alacak mıyım?

Evet, güncellemelere aboneyseniz alırsınız. Abone olmak için, lütfen **GÜNCELLEMELERE ABONE OL**'u tıklayın ve abonelik kanalını seçin:

* **Email** Wallarm'ın bir olay oluşturduğunda, güncellediğinde veya bir olayı çözdüğünde bildirim almak için.
* **SMS** Wallarm'ın bir olay oluşturduğunda veya çözdüğünde bildirim almak için.
* **Slack** olay güncellemeleri ve bakım durumu mesajları almak için.
* **Webhook** Wallarm'ın bir olay oluşturduğunda, bir olayı güncellediğinde, bir olayı çözdüğünde veya bir hizmet durumunu değiştirdiğinde bildirim almak için.

## Hizmet durumları ne anlama gelir?

* **Performans düşüklüğü** hizmetin çalıştığı ancak yavaş olduğu veya başka bir şekilde hafifçe etkilendiği anlamına gelir.
* **Kısmi kesinti** hizmetlerin bir alt küme için tamamen arızalı olduğu anlamına gelir.
* **Büyük kesinti** hizmetlerin tamamen kullanılamaz olduğu anlamına gelir.

## Bir olay ne zaman oluşturulur?

Hizmetlerin çalışmadığı durumlarda olaylar oluşturulur. Çalışmama durumu ile ilgili bir etkinlik sırasında, sorunu, bunun hakkında ne yaptığımızı ve sorunun ne zaman çözüleceğini beklediğimizi anlatan bir sayfa ekliyoruz.

Zaman geçtikçe, olayın nedeni belirlenir, belirlenen olay onarılır ve olay durumu, mevcut durumu yansıtacak şekilde güncellenir.