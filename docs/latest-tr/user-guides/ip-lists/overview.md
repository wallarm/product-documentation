# IP listelerinin türleri ve temel mantığı

Wallarm Konsolu'ndaki **IP listeleri** bölümünde, IP adreslerini izin verme, engelleme ve gri liste yapma yoluyla uygulamalarınıza erişimi kontrol edebilirsiniz.

* **İzin verilenler listesi**, içlerinden kaynaklanan istekler saldırı belirtileri içerse bile uygulamalarınıza erişmeye izin verilen güvendiğiniz IP adreslerinin bir listesidir.
* **Engellenenler listesi**, uygulamalarınıza erişmeye izin verilmeyen IP adreslerinin bir listesidir. Filtreleme düğümü, engellenmiş IP adreslerinden kaynaklanan tüm istekleri engeller.
* **Gri liste**, içlerinden kaynaklanan istekler saldırı belirtileri içermezse uygulamalarınıza erişmeye izin verilen IP adreslerinin bir listesidir.

![Tüm IP listeleri](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## IP listelerinin işlenme algoritması

Filtreleme düğümü, IP listelerini analiz etmek için seçilen işlem [moduna](../../admin-en/configure-wallarm-mode.md) dayalı farklı yaklaşımlar kullanır. Belirli modlarda, izin verilenler listesi, engellenenler listesi ve gri listeler olmak üzere üç tip IP listesini değerlendirir. Ancak, diğer modlarda yalnızca belirli IP listelerine odaklanır.

Aşağıda sağlanan görüntü, her işlem modunda IP listelerinin önceliklerini ve kombinasyonlarını görsel olarak temsil eder ve her durumda hangi listelerin dikkate alındığını vurgular:

![IP listesi öncelikleri](../../images/user-guides/ip-lists/ip-lists-priorities.png)

## IP listelerinin yapılandırılması

IP listelerini yapılandırmak için:

1. Wallarm düğümü bir yük dengeleyici veya CDN'nin arkasında bulunuyorsa, Wallarm düğümünüzün uç kullanıcı IP adreslerini doğru bir şekilde bildirmesini sağlamak için düğümünüzü yapılandırdığınızdan emin olun:

    * [NGINX tabanlı Wallarm düğümleri için talimatlar](../../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP imajları ve Docker düğüm konteynırı dahil)
    * [Filtreleme düğümlerinin Wallarm Kubernetes Ingress denetleyicisi olarak dağıtılması için talimatlar](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
2. İstek kaynaklarını IP listelerine ekleyin:

    * [İzin verilenler listesi](allowlist.md)
    * [Engellenenler listesi](denylist.md)
    * [Gri liste](graylist.md)

!!! uyarı "Ek trafik filtreleme tesislerinin kullanılması"
    Otomatik olarak trafik filtrelemek ve engellemek için ek tesisler (yazılım veya donanım) kullanıyorsanız, [Wallarm Tarayıcısı](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) için IP adreslerini izin verilenler listesine eklemenizi öneririz. Bu, Wallarm bileşenlerinin kaynaklarınızı sorunsuz bir şekilde taramasına izin verecektir.

    * [Wallarm US Cloud'da kayıtlı Tarayıcı IP adresi](../../admin-en/scanner-addresses.md)
    * [Wallarm EU Cloud'da kayıtlı Tarayıcı IP adresi](../../admin-en/scanner-addresses.md)