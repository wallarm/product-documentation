* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim.
* Desteklenen OS:

    * Debian 10, 11 ve 12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * RHEL 9.x
    * Oracle Linux 8.x
    * Redox
    * SuSe Linux
    * Diğerleri (liste sürekli genişliyor, işletim sisteminizin listede olup olmadığını kontrol etmek için [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin)

* Tümleşik Wallarm kurulum programını indirmek için `https://meganode.wallarm.com` adresine erişim. Erişimin güvenlik duvarı tarafından engellenmediğinden emin olun.
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Eğer erişim yalnızca proxy sunucu aracılığıyla yapılandırılabiliyorsa, [instructions][configure-proxy-balancer-instr] talimatlarını kullanın.
* Saldırı tespit kurallarının güncellemelerini ve [API specifications][api-spec-enforcement-docs]'ı indirmek, ayrıca [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP’leri almak üzere aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutların süper kullanıcı (örneğin `root`) olarak çalıştırılması.