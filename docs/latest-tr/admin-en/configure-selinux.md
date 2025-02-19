[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux
[doc-monitoring]:   monitoring/intro.md

# SELinux Sorun Giderme

[SELinux][link-selinux], RedHat tabanlı Linux dağıtımlarında (ör., CentOS veya Amazon Linux 2.0.2021x ve daha düşük) varsayılan olarak kurulu ve etkindir. SELinux, Debian veya Ubuntu gibi diğer Linux dağıtımlarında da kurulabilir.

SELinux'un varlığını ve durumunu kontrol etmek için aşağıdaki komutu çalıştırın:

``` bash
sestatus
```

## Otomatik Yapılandırma

Bir filtreleme düğümüne sahip bir ana makinada SELinux mekanizması etkinse, düğüm kurulumu veya yükseltme sırasında, [all-in-one installer](../installation/inline/compute-instances/linux/all-in-one.md) düğümün müdahale etmemesi için otomatik yapılandırmasını gerçekleştirir.

Bu, çoğu durumda SELinux'tan kaynaklanan sorunların olmayacağı anlamına gelir.

## Sorun Giderme

[Eğer otomatik yapılandırma](#automatic-configuration) sonrasında hâlâ SELinux'tan kaynaklanabilecek sorunlar yaşıyorsanız:

* Filtre düğümünün RPS (saniyedeki istek) ve APS (saniyedeki saldırı) değerleri Wallarm Cloud'a aktarılmayacaktır.
* Filtre düğüm metriklerini TCP protokolü aracılığıyla izleme sistemlerine aktarmak mümkün olmayacaktır (bkz. [“Monitoring the Filter Node”][doc-monitoring]).
* Diğer olası problemler.

Aşağıdakileri yapın:

1. Geçici olarak SELinux'u devre dışı bırakmak için `setenforce 0` komutunu çalıştırın.

    SELinux, bir sonraki yeniden başlatmaya kadar devre dışı kalacaktır.

1. Sorun(lar)ın ortadan kalkıp kalkmadığını kontrol edin.
1. Yardım için [Wallarm](mailto:support@wallarm.com) teknik desteği ile iletişime geçin.

    !!! warning "SELinux’un kalıcı olarak devre dışı bırakılması önerilmez"
        Güvenlik sorunları nedeniyle SELinux'un kalıcı olarak devre dışı bırakılması önerilmez.