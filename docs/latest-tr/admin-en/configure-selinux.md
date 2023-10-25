[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux
[doc-monitoring]:   monitoring/intro.md

# SELinux'i Yapılandırma

[Filtre düğümüyle birlikte SELinux][link-selinux] mekanizması etkinleştirilmiş bir ana bilgisayarda bulunuyorsa, filtre düğümüne müdahale edebilir ve işlevsiz hâle getirebilir:
* Filtre düğümünün RPS (saniyedeki istekler) ve APS (saniyedeki saldırılar) değerleri Wallarm buluta aktarılamaz.
* Filtre düğümü ölçüm değerlerini TCP protokolü aracılığıyla izleme sistemlerine aktarmak mümkün olmayacaktır ([ “Filtre Düğümünü İzleme”][doc-monitoring] konusuna bakınız).

SELinux, RedHat tabanlı Linux dağıtımlarında (örneğin, CentOS veya Amazon Linux 2.0.2021x ve daha düşük) varsayılan olarak yüklüdür ve etkindir. SELinux ayrıca Debian veya Ubuntu gibi diğer Linux dağıtımlarında da yüklü olabilir.  

SELinux'un ya devre dışı bırakılması ya da filtre düğümünün işleyişine müdahale etmemesi için yapılandırılması zorunludur.

## SELinux Durumunu Kontrol Etme

Aşağıdaki komutu çalıştırın:

``` bash
sestatus
```

Çıktıyı inceleyin:
* `SELinux durumu: etkin`
* `SELinux durumu: devre dışı`

## SELinux'i Yapılandırma

SELinux etkin durumdayken filtre düğümünün işlevselliğini sürdürebilmesi için `collectd` aracının TCP soketi kullanmasına izin verin. Bunu yapmak için aşağıdaki komutu çalıştırın:

``` bash
setsebool -P collectd_tcp_network_connect 1
```

Yukarıda belirtilen komutun başarıyla çalıştırılıp çalıştırılmadığını kontrol etmek için aşağıdaki komutu çalıştırın:

``` bash
semanage export | grep collectd_tcp_network_connect
```

Çıktı bu dizeyi içermelidir:
```
boolean -m -1 collectd_tcp_network_connect
```

## SELinux'i Devre Dışı Bırakma

SELinux'u devre dışı duruma getirmek için
*   ya  `setenforce 0` komutunu çalıştırın (SELinux, bir sonraki yeniden başlatmaya kadar devre dışı kalır) veya
*   `/etc/selinux/config` dosyasında `SELINUX` değişkeninin değerini `disabled` olarak ayarlayın, ardından yeniden başlatın (SELinux, kalıcı olarak devre dışı kalır).