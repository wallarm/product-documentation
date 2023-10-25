* Wallarm Konsolu'ndaki **Yönetici** rolü ile hesaba [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için erişim.
* Desteklenen İşletim Sistemleri:

    * Debian 10, 11 ve 12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * Oracle Linux 8.x
    * Redos
    * SuSe Linux
    * Diğerleri (liste sürekli genişliyor, İS'nizin listeye dahil olup olmadığını kontrol etmek için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin)

* Tüm bir Wallarm yükleyiciyi indirmek için `https://meganode.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` adresine veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim sadece proxy sunucu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın.
* Google Cloud Storage'ın IP adreslerine, [link](https://www.gstatic.com/ipranges/goog.json) içinde listelenen. Bireysel IP adreslerinin yerine tüm ülkeleri, bölgeleri veya veri merkezlerini [beyaz listeye alırken, karaliste oluştururken veya gri liste oluştururken][ip-lists-docs], Wallarm düğümü, IP listelerindeki girişlere ilişkin kesin IP adreslerini Google Storage'da barındırılan toplanan veritabanından alır.
* Tüm komutları bir süper kullanıcı olarak (ör. `root`) çalıştırma.