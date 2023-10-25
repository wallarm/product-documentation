# Wallarm AWS Terraform Modülünün Yayın Örneği: Gelişmiş Proxy Çözümü

Bu örnekte, Terraform modülünü mevcut bir AWS Sanal Özel Bulut (VPC) içine ileri düzey bir yapılandırmaya sahip bir şeffaf proxy olarak Wallarm'ın nasıl dağıtılacağını açıklıyoruz. [Basit bir proxy dağıtımı](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) na oldukça benzer, ancak sık sık kullanılan ileri düzey yapılandırma seçenekleri gösterilmektedir.

Bu örnekle başlamak zor geliyorsa, öncelikle [basit proxy örneğine](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) bakın.

Wallarm Advanced Proxy çözümü (basit proxy dahil), ağ katmanında ilave işlevsellik içeren gelişmiş bir HTTP trafik yönlendirici ve WAF ve API güvenlik özellikleri sunmaktadır.

## Ana Karakteristikler

Gelişmiş Proxy çözümü basitten şu şekilde farklıdır:

* Bu çözüm bir yük dengeleyici (`lb_enabled=false`) oluşturmaz, ancak mevcut bir yük dengeleyiciye eklenebilecek bir hedef grubu oluşturur.

    Bu, eşzamanlı trafik işleme yaklaşımına sorunsuz bir geçiş sağlar.
* NGINX ve Wallarm yapılandırmaları, sadece standart değişkenlerle değil, `global_snippet`, `http_snippet`, `server_snippet` NGINX snippetleri ile de belirtilir.
* Wallarm düğüm başlatma betiği (cloud-init) tamamlandığında, özel bir `post-cloud-init.sh` betiği, özelleştirilmiş bir HTML index sayfasını `var/www/mysite/index.html` örneği dizinine yerleştirir.
* Dağıtılan yığın, AWS S3'ye sadece okuma erişimini mümkün kılan ek AWS IAM politikalarıyla ilişkilidir.

    Bu örneği "olduğu gibi" kullanırsanız, üzerinde sağlanan erişim gerekli değildir. Bununla birlikte, `post-cloud-init.sh` dosyası genellikle AWS S3'den özel erişim gerektiren bir dosya talebi için pasif bir örnek içerir. `post-cloud-init.sh` dosyasından S3 kodunu aktif hale getirirken, `extra_policies` değişkeni içinde AWS S3 erişim IAM politikasını belirtmeniz gerekecektir.
* Bu çözümde, ek dahili ağ portu 7777'den Wallarm örneğine gelen bağlantılar mümkündür. Bu, `extra_ports` değişkeni ve `http_snippet.conf` ile ayarlanır.

    Port 7777'yi `0.0.0.0/0`'a izin vermek için ek olarak `extra_public_ports` değişkenini kullanabilirsiniz (isteğe bağlı).
* Wallarm düğümleri, trafiği engelleme modunda işler.

## Çözümün Mimarisi

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Örnekteki Wallarm gelişmiş proxy çözümü aşağıdaki bileşenleri içerir:

* Yük dengeleyicisi olmayan bir Auto Scaling grubuna bağlı hedef grup.
* Trafik analiz eden, zararlı istekleri engelleyen ve meşru istekleri ileri düzey bir proxy olarak yönlendiren Wallarm düğüm örneği.

    Bu örnekte, Wallarm düğümlerini, zararlı isteklerin engellenmesini içeren bir davranışı tetikleyen engelleyici modda çalıştırıyoruz. Wallarm düğümleri, trafik izleme işlevini zararlı isteklerin engellenmesini içermeksizin hedeleyen diğer modlarda da çalışabilir. Wallarm düğüm modları hakkında ayrıntılı bilgi için, [dökümantasyonumuzu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanabilirsiniz.
* Wallarm düğümü trafiği `https://httpbin.org`'a yönlendirir.

    Bu örneği çalıştırırken, AWS Sanal Özel Bulut (VPC) içerisindeki diğer kullanılabilir hizmet alanları ve yolları, trafiği proxyli olarak belirlemek mümkün olabilir.

Tüm listelenen bileşenler (proxyli sunucu hariç) sağlanan `wallarm` örnek modülü tarafından dağıtılır.

## Kod Bileşenleri

Bu örnekte aşağıdaki kod bileşenleri bulunur:

* `main.tf`: `wallarm` Modülünün ana yapılandırması, gelişmiş bir proxy çözümü olarak dağıtılır.
* `global_snippet.conf`: `global_snippet` değişkenini kullanarak NGINX genel yapılandırmasına eklenen özelleştirilmiş NGINX yapılandırma örneği. Montajlı ayarlar `load_module`, `stream`, `mail`, `env` vb. yönergeleri içerebilir.
* `http_snippet.conf`: `http_snippet` değişkenini kullanarak `http` NGINX içeriğine eklenen özel bir NGINX yapılandırma. Montajlı ayarlar `map` veya `server` gibi yönergeleri kapsayabilir.
* `server_snippet.conf`: `server_snippet` değişkeninin kullanılmasıyla `server` NGINX içeriğine eklenen özelleştirilmiş bir NGINX yapılandırması. Montajlı ayarlar, `if` NGINX mantığı ve gerekli `location` ayarlarını uygulayabilir.

    Bu snippet ayarları yalnızca port 80'e uygulanır. Diğer portları açmak için, `http_snippet` ile ilgili `server` direktifi belirtin.

    `server_snippet.conf` dosyasında, daha karmaşık bir yapılandırma örneği de bulabilirsiniz.
* `post-cloud-init.sh`: Özelleştirilmiş bir HTML index sayfasını `var/www/mysite/index.html` örneği dizinine yerleştiren özel bir betik. Bu betik, Wallarm düğümünün başlangıç işlemi (cloud-init betiği) sonrasında çalıştırılır.

    `post-cloud-init.sh` dosyasında, AWS S3 içeriğini örnek bir dizine yerleştirmek için bir komut örneğini de bulabilirsiniz. Bu seçeneği kullanmalısınız, S3 erişim politikasını `extra_policies` değişkeni içerisinde belirtmeyi unutmayın.

## Wallarm AWS Proxy Çözümünün Çalıştırılması

1. Wallarm Console'e [AB Bulutu](https://my.wallarm.com/nodes) veya [Amerika Birleşik Devletleri bulutu](https://us1.my.wallarm.com/nodes)'ndan kaydolun.
1. Wallarm Console'u açın → **Düğümler**'e gidin ve **Wallarm Düğümü** tipinde bir düğüm oluşturun.
1. Üretilmiş düğüm jetonunu kopyalayın.
1. Örnekteki kodları içeren reposunu klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. `default` seçeneği aracılığıyla klonlanmış deposundaki `examples/advanced/variables.tf` dosyasında değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/advanced/main.tf`den  `proxy_pass` içerisinde proxylenen sunucunun protokol ve adresini ayarlayın.

    Varsayılan olarak, Wallarm trafiği `https://httpbin.org`'a yönlendirir. Varsayılan değer sizin ihtiyaçlarınıza uygunsa, olduğu gibi bırakın.
1. İstifi dağıtmak için `examples/advanced` dizininden aşağıdaki komutları çalıştırın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılmış ortamı kaldırmak için aşağıdaki komutları kullanın:

```
terraform destroy
```

## Kaynaklar

* [AWS Yük dengeleyicinin Auto Scaling grubuna eklenmesi](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [Kamu ve özel alt ağlar (NAT) ile AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Wallarm Dökümantasyonu](https://docs.wallarm.com)