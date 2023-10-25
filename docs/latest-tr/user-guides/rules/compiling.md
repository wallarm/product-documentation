# Özel kurallar kümesi oluşturma ve boşaltma

Bir özel kurallar kümesi, belirli bir istemci trafiğinin işlenmesinin özel durumlarını tanımlar (örneğin, özel saldırı algılama kuralları belirleme veya hassas verileri maskelama olanağı sağlar). Wallarm düğümü, gelen isteklerin analizi sırasında özel kurallar kümesine dayanır.

Özel kurallardaki değişiklikler hemen etkili olmaz. Değişiklikler, özel kurallar kümesi **oluşturma** ve **filtreleme düğümüne boşaltma** tamamlandıktan sonra sadece sorgu analiz sürecine uygulanır.

## Özel kurallar kümesi oluşturma

Yeni bir kural eklemek, Wallarm Konsolu → **Kurallar**'da mevcut kuralları silmek veya değiştirmek bir özel kurallar kümesi oluşturur. Oluşturma süreci sırasında, kurallar optimize edilir ve filtreleme düğümü için kabul edilen bir formata derlenir. Bir özel kurallar kümesini oluşturma süreci genellikle birkaç saniye ile karmaşık kural ağaçları için bir saate kadar sürer.

Özel kurallar kümesi oluşturma durumu ve beklenen tamamlanma süresi Wallarm Konsolu'nda gösterilir. Devam eden bir oluşturma olmaması durumunda, arayüz son tamamlanan oluşturma tarihini gösterir.

![Oluşturma durumu](../../images/user-guides/rules/build-rules-status.png)

## Özel kurallar kümesini filtreleme düğümüne boşaltma

Özel kurallar kümesi oluşturulması, filtreleme düğümü ve Wallarm Bulutu senkronizasyonu sırasında filtreleme düğümüne boşaltılır. Varsayılan olarak, filtreleme düğümü ve Wallarm Bulutu senkronizasyonu her 2-4 dakikada bir başlatılır. [Filtreleme düğümü ve Wallarm Bulutu senkronizasyonu konfigürasyonu hakkında daha fazla bilgi →](../../admin-en/configure-cloud-node-synchronization-en.md)

Bir özel kurallar kümesini filtreleme düğümüne boşaltma durumu, `/var/log/wallarm/syncnode.log` dosyasına kaydedilir.

Aynı Wallarm hesabına bağlı tüm Wallarm düğümleri, trafik filtremesi için varsayılan ve özel kuralların aynı setini alır. Yine de, farklı uygulamalar için farklı kuralları uygulayabilirsiniz, uygun uygulama kimliklerini veya benzersiz HTTP istek parametrelerini, örneğin başlıkları, sorgu dizesi parametrelerini vb. kullanarak.