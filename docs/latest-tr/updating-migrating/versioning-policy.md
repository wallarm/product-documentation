# Filtreleme düğümü sürümleme politikası

Bu politika, farklı Wallarm filtreleme düğümü ürünlerinin sürümleme yöntemini ayrıntılar: Linux paketleri, Docker konteynırları, Helm grafikleri vb. Bu belgeyi filtreleme düğümü versiyonunu seçmek ve yüklenmiş paketlerin güncellemelerini planlamak için kullanabilirsiniz.

!!! info "Ürün"
    Ürün, Wallarm düğümlerinin geliştirilmesinin sonucudur ve filtreleme düğümünü platforma yüklemek için kullanılır. Örnek: Linux paketleri, Kong API modülleri, Docker konteynırları vb.

## Versiyon listesi

| Düğüm versiyonu | Çıkış tarihi   | Destek sona erme tarihi |
|------------------|----------------|---------------|
|2.18 ve alt 2.x   |                | Kasım 2021    |
| 3.6 ve alt 3.x   | Ekim 2021      | Kasım 2022    |
| 4.0              | Haziran 2022   | Şubat 2023    |
| 4.2              | Ağustos 2022   | Haziran 2023  |
| 4.4              | Kasım 2022     |               |
| 4.6              | Nisan 2023     |               |
| 4.8              | Ekim 2023      |               |

## Versiyon formatı

Wallarm filtreleme düğümü ürün versiyonları aşağıdaki formata sahiptir:

```bash
<ANA_VERSİYON>.<ALT_VERSİYON>.<YAMA_VERSİYONU>[-<YAPIM_NUMARASI>]
```

| Parametre                  | Açıklama                                                                                                                                                                                                                                                                                                         | Ortalama yayın oranı          |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `<ANA_VERSİYON>`              | Ana Wallarm düğüm versiyonu:<ul><li>Bileşenin büyük revizyonu</li><li>Uyumsuz değişiklikler</li></ul>Başlangıç ​​değeri `2`. Değer, örneğin `3.6.0`, `4.0.0` olacak şekilde 1 artar.                                                                                                                    | Yayın beklenmiyor              |
| `<ALT_VERSİYON>`             | Küçük Wallarm düğüm versiyonu:<ul><li>Yeni ürün özellikleri</li><li>Büyük hata düzeltmeleri</li><li>Diğer uyumlu değişiklikler</li></ul>Değer, örneğin: `4.0`, `4.2` olacak şekilde 2 artar.                                                                                                             | Çeyrek başına bir kez                         |
| `<YAMA_VERSİYONU>`              | Düğüm yama versiyonu:<ul><li>Küçük hata düzeltmeleri</li><li>Özel bir istek sonrası eklenen yeni özellikler</li></ul>Başlangıç değeri `0`. Değer, örneğin: `4.2.0`, `4.2.1` olacak şekilde 1 artar.                                                                                                                                     | Bir ayda bir                        |
| `<YAPIM_NUMARASI>` (isteğe bağlı) | Düğüm yapım versiyonu. Değer, kullanılan paket yapım platformu tarafından otomatik olarak atanır. Değer, manuel bir işlem kullanılarak oluşturulan ürünlere atanmayacaktır.<br />Değer, örneğin: `4.2.0-1`, `4.2.0-2` olacak şekilde 1 artar. İlk yapı başarısız olursa, yapım tekrar çalıştırılır ve değer artırılır. | Yeni `<YAMA_VERSİYONU>` çıktıkça |

Paketleri veya görüntüleri indirirken farklı Wallarm düğüm versiyon formatını kullanmanızı öneririz. Format, [Wallarm düğüm kurulum formuna](../installation/supported-deployment-options.md) bağlıdır:

* `<ANA_VERSİYON>.<ALT_VERSİYON>` Linux paketleri için
* `<ANA_VERSİYON>.<ALT_VERSİYON>.<YAMA_VERSİYONU>` Helm grafikleri için
* `<ANA_VERSİYON>.<ALT_VERSİYON>.<YAMA_VERSİYONU>[-<YAPIM_NUMARASI>]` Docker ve bulut resimleri için

    Wallarm Docker görüntülerini çekerken, filtreleme düğümünün versiyonunu da `<ANA_VERSİYON>.<ALT_VERSİYON>` formatında belirtebilirsiniz. Çekilen filtreleme düğümü versiyonu, en son kullanılabilir yama versiyonunun değişikliklerini içerir, bu yüzden farklı zamanlarda çekilen aynı `<ANA_VERSİYON>.<ALT_VERSİYON>` görüntü versiyonunun davranışı değişebilir.

Birbirinden farklı Wallarm düğümleri paketlerinin versiyonları aynı ürünler içinde farklı olabilir. Örneğin; sadece bir paketin güncellenmesi gerekiyorsa, kalan paketler önceki versiyonu korur.

## Sürüm desteği

Wallarm yalnızca filtreleme düğümünün son 3 versiyonunu aşağıdaki şekillerde destekler:

* En son versiyon için (ör. 4.2): paket indirmeye izin verir, hata düzeltmeleri yayınlar ve kullanılan versiyonda güvenlik açıkları tespit etmesi durumunda üçüncü taraf bileşenlerini günceller. Özel bir istek sonrası yeni özellikler yayınlayabilir.
* Önceki versiyon için (ör. 4.0): paket indirmeye izin verir ve hata düzeltmeleri yayınlar.
* Üçüncü mevcut versiyon için (ör. 3.6): en son versiyonun çıkış tarihinden sonra 3 ay boyunca paket indirmeye izin verir ve hata düzeltmeleri yayınlar. 3 ay sonunda, versiyon kullanımdan kaldırılacaktır.

Kullanımdan kaldırılan versiyonlara ait düğüm ürünleri indirilmeye ve yüklemeye müsaittir fakat hata düzeltmeleri ve yeni özellikler bu versiyonlarda yayınlanmaz.

Filtreleme düğümünü ilk kez yüklerken, en son kullanılabilir versiyonu kullanmanızı öneririz. Zaten yüklenmiş düğümlerin bulunduğu bir ortamda ek bir filtreleme düğümü yüklerken, tam uyumluluk için tüm kurulumlarda aynı versiyonu kullanmanızı öneririz.

## NGINX yükseltme

Wallarm modüllerinin çoğu, kendi versiyonlarının NGINX bileşenleriyle dağıtılır. Wallarm modüllerinin NGINX bileşenlerinin son versiyonlarıyla çalışmaya devam etmesini sağlamak için aşağıdaki şekilde güncelliyoruz:

* Wallarm DEB ve RPM paketleri resmi NGINX ve NGINX Plus modülleri temel alır. Yeni bir NGINX / NGINX Plus versiyonu çıktığında, Wallarm versiyonunu güncelleme konusunda 1 gün içinde taahhüt verir. Wallarm, bu güncellemeyi desteklenen düğüm versiyonlarının yeni küçük/yama versiyonu olarak yayınlar.
* Wallarm İngress Kontrolcüsü, [Topluluk Ingress NGINX Kontrolcüsü](https://github.com/kubernetes/ingress-nginx) temelindedir. Yeni bir Topluluk Ingress NGINX Kontrolcüsü versiyonu çıktığında, Wallarm kendi versiyonunu güncelleme konusunda 30 gün içerisinde taahhüt verir. Wallarm, bu güncellemeyi en son Ingress kontrolcüsü sürümünün yeni küçük versiyonu olarak yayınlar.

## Sürüm güncelleme

Ürünü yüklerken, güncellerken veya yapılandırırken en son kullanılabilir filtreleme düğümü sürümünü kullanıyorsunuzdur. Wallarm düğüm talimatları en son kullanılabilir yama ve yapımı otomatik olarak yükleyen komutları açıklar.

## Yeni versiyon bilgilendirmesi

Wallarm, yeni ana ve küçük versiyonlar hakkındaki bilgileri aşağıdaki kaynaklarda yayınlar:

* Kamu Dokümantasyonu
* [Haber portalı](https://changelog.wallarm.com/)
* Wallarm Konsolu

     ![Wallarm Konsolu'nda yeni bir versiyon hakkında bildirim](../images/updating-migrating/wallarm-console-new-version-notification.png)

Ana ve küçük Wallarm düğüm versiyonları ve Wallarm düğüm yama versiyonları için kullanılabilir güncellemeler hakkındaki bilgiler, ayrıca Wallarm Konsolu → **Düğümler** bölümünde düzenli düğümler için görüntülenir. Her paketin **Güncel** durumu veya kullanılabilir güncellemelerin listesi vardır. Örneğin, yüklenmiş son bileşen versiyonlarına sahip filtreleme düğümünün kartı şöyle görünür:

![Düğüm kartı](../images/user-guides/nodes/view-regular-node-comp-vers.png)

### Güncelleme prosedürü

Yeni filtreleme düğümü ana ve küçük versiyonlarının yayınlanmasıyla birlikte, kurulum talimatları da yayınlanır. Yüklenmiş ürünleri güncelleme konusundaki talimatlara erişmek için lütfen **Güncelleme ve Taşıma** bölümünden ilgili talimatları kullanın.