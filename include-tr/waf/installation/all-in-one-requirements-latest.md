* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüne sahip hesaba erişim.
* Desteklenen işletim sistemleri:

    * Debian 10, 11 ve 12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * Oracle Linux 9.x
    * RHEL 8.x
    * RHEL 9.x
    * Oracle Linux 8.x
    * Redox
    * SuSe Linux
    * Diğerleri (liste sürekli genişlemektedir; işletim sisteminizin listede olup olmadığını kontrol etmek için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin)

* Hepsi bir arada Wallarm yükleyicisini indirmek için `https://meganode.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa [talimatları][configure-proxy-balancer-instr] kullanın.
* Saldırı tespit kurallarının güncellemelerini ve [API spesifikasyonlarını][api-spec-enforcement-docs] indirmek ve ayrıca [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutları süper kullanıcı olarak çalıştırma (ör. `root`).