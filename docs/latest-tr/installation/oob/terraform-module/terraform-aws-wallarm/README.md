# Wallarm AWS Terraform Modülü

[Wallarm](https://www.wallarm.com/), Dev, Sec ve Ops ekiplerinin bulut tabanlı API'leri güvenli bir şekilde oluşturmak, modern tehditler için izlemek ve tehditler ortaya çıktığında uyarı almak için seçtikleri platformdur. Eski uygulamalarınızı korurken veya yepyeni bulut-tabanlı API'ler oluştururken Wallarm, işinizi yeni tehditlere karşı koruma için ana bileşenler sağlar.

Bu depo, Wallarm'ı [AWS](https://aws.amazon.com/) üzerinde Terraform kullanarak dağıtmak için modülü içerir.

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Wallarm Terraform modülünü uygulayarak, iki temel Wallarm dağıtım seçeneği: vekil ve ayna güvenlik çözümleri olan bir çözüm sağladık. Dağıtım seçeneği, `preset` Wallarm modül değişkeni ile kolayca kontrol edilir. Her iki seçeneğin deneyimini, [sunulan örnekleri](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) dağıtarak veya modülü kendiniz yapılandırarak yaşayabilirsiniz.

## Gereksinimler

* Terraform 1.0.5 veya daha yüksek bir sürüm [yerel olarak yüklenmiş](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Wallarm Console'da **Yönetici** rolü ile hesaba erişim [EU Cloud](https://my.wallarm.com/) veya [US Cloud](https://us1.my.wallarm.com/)
* EU Wallarm Cloud ile çalışırken `https://api.wallarm.com` veya US Wallarm Cloud ile çalışırken `https://us1.api.wallarm.com` erişiminiz olmalıdır. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

## Bu Modül Nasıl Kullanılır?

Bu depo şu dizin yapısına sahiptir:

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): Bu klasör, Wallarm modülünü dağıtmak için gerekli alt modülleri içerir.
* [`örnekler`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): Bu klasör, Wallarm'ı dağıtmak için `modules` klasöründeki modülü farklı şekillerde nasıl kullanabileceğinizi gösterir.

Bu depoyu kullanarak Wallarm'ı üretim amacıyla dağıtmak için:

1. Wallarm Console'da [EU Cloud](https://my.wallarm.com/signup) veya [US Cloud](https://us1.my.wallarm.com/signup) için kaydolun.
1. Wallarm Console'u açın → **Nodes**  ve **Wallarm node** tipinde bir düğüm oluşturun.
1. Oluşturulan düğüm belirtecini kopyalayın.
1. `wallarm` modül kodunu Terraform yapılandırmanıza ekleyin:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."

      host       = "api.wallarm.com" # veya "us1.api.wallarm.com"
      token      = "..."

      instance_type = "..."

      ...
    }
    ```
  
1. Kopyalanan düğüm belirtecini `token` değişkenine belirtin ve diğer gerekli değişkenleri yapılandırın.

## Bu Modül Nasıl Bakım Yapılıyor?

Wallarm AWS Modülü, [Wallarm Ekibi](https://www.wallarm.com/) tarafından yapılmaktadır.

Wallarm AWS Modülü ile ilgili sorularınız veya özellik talepleriniz varsa, [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question) adresine bir e-posta göndermekten çekinmeyin.

## Lisans

Bu kod, [MIT Lisansı](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE) altında yayınlanmıştır.

Hakları Saklıdır &copy; 2022 Wallarm, Inc.