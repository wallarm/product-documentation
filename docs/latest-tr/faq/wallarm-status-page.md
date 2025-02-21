# Wallarm hizmet durumu sayfası

Bu rehber, Wallarm hizmet durumu sayfasıyla ilgili ayrıntıları içermektedir.

## Wallarm hizmet kullanılabilirliğini gösteren bir sayfaya sahip mi?

Evet, Wallarm durum sayfasına https://status.wallarm.com adresinden erişebilirsiniz. Sayfa, her bir Wallarm Cloud için Wallarm Console ve Wallarm API hizmetlerinin kullanılabilirliğine dair canlı ve geçmiş verileri göstermektedir:

* **Wallarm US Cloud**
* **Wallarm EU Cloud**

![Wallarm durum sayfası](../images/status-page.png)

## Bir hizmet durumu değiştiğinde bildirim alacak mıyım?

Evet, eğer güncellemeleri abone olduysanız bildirim alacaksınız. Abone olmak için lütfen **GÜNCELLEMELERE ABONE OL** butonuna tıklayın ve abonelik kanalını seçin:

* **Email**: Wallarm bir arıza oluşturduğunda, güncellediğinde veya çözdüğünde bildirim alacaksınız.
* **SMS**: Wallarm bir arıza oluşturduğunda veya çözdüğünde bildirim alacaksınız.
* **Slack**: Arıza güncellemeleri ve bakım durum mesajları alacaksınız.
* **Webhook**: Wallarm bir arıza oluşturduğunda, güncellediğinde, çözdüğünde veya bir hizmet durumunu değiştirdiğinde bildirim alacaksınız.

## Hizmet durumları ne anlama gelmektedir?

* **Düşük performans**: Hizmet çalışıyor ancak yavaş veya başka şekillerde hafifçe etkilenmiş demektir.
* **Kısmi kesinti**: Hizmetler, belirli bir müşteri grubunda tamamen çalışmıyor demektir.
* **Büyük kesinti**: Hizmetler tamamen kullanılamaz demektir.

## Bir arıza ne zaman oluşturulur?

Hizmetlerde kesinti yaşandığında arıza oluşturulur. Kesintiyle ilgili bir olay sırasında, yaşanan sorunun ne olduğu, bu durumla ilgili olarak ne yapıldığı ve sorunun ne zaman çözüleceğine dair açıklamalar içeren bir sayfa ekliyoruz.

Zaman ilerledikçe, arızanın nedeni tespit edilir, tespit edilen arıza giderilir ve arıza durumu güncel durumu yansıtacak şekilde güncellenir.