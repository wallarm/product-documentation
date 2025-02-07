* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console üzerinde **Administrator** rolüne sahip hesaba erişim.
* Desteklenen İşletim Sistemleri:

    * Debian 10, 11 ve 12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * Oracle Linux 8.x
    * Redox
    * SuSe Linux
    * Diğerleri (liste sürekli genişlemektedir, işletim sisteminizin listede olup olmadığını kontrol etmek için [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin)

* Tüm bir Wallarm kurulum dosyasını indirmek için `https://meganode.wallarm.com` adresine erişim. Erişimin güvenlik duvarı tarafından engellenmediğinden emin olun.
* US Wallarm Cloud ile çalışma için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışma için `https://api.wallarm.com` adresine erişim. Eğer erişim yalnızca proxy sunucu üzerinden yapılandırılabiliyorsa, [instructions][configure-proxy-balancer-instr] bağlantısını kullanın.
* Saldırı tespit kurallarına yönelik güncellemeleri indirmek ve [izin verilen, engellenen veya gri listeye alınan][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutları süper kullanıcı (örneğin `root`) olarak çalıştırın.