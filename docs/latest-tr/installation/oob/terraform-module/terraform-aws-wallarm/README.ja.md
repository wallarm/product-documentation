# Wallarm AWS Terraform Modülü

[Wallarm](https://www.wallarm.com/), Dev, Sec, Ops takımlarının bulut yerlisi API'leri güvenli bir şekilde oluşturmak, modern tehditleri izlemek ve tehdit doğduğunda uyarı almak için seçtiği platformdur. Mevcut bir uygulamayı koruyun ya da yeni çıkan bir bulut yerlisi API'yi koruyun, Wallarm işinizi yeni tehditlere karşı koruma anahtarı sağlar.

Bu depo, Terraform kullanarak [AWS](https://aws.amazon.com/) üzerinde Wallarm'ı konuşlandırmak için bir modül içerir.

![Wallarm vekil şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Wallarm Terraform modülünü uygulayarak, proxy ve ayna olmak üzere iki ana Wallarm konuşlandırma seçeneğini mümkün kılan bir çözüm sunuyoruz. Konuşlandırma seçenekleri, `preset` Wallarm modül değişkeni ile kolayca kontrol edilebilir. Modülü kendiniz [olası örnekleri](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) konuşlandırarak veya modülü ayarlayarak deneyin.

## Gereklilikler

* Terraform 1.0.5 veya daha yeni bir sürümünün [yerel olarak yüklenmiş](https://learn.hashicorp.com/tutorials/terraform/install-cli) olması
* Wallarm konsoluna erişiminiz olması ve **Yönetici** rolüne sahip bir hesap ile [EU Bulutu](https://my.wallarm.com/) veya [US Bulutu](https://us1.my.wallarm.com/) var olması
* EU Wallarm Cloud kullanıyorsanız `https://api.wallarm.com`, US Wallarm Cloud kullanıyorsanız `https://us1.api.wallarm.com` erişimi var. Erişiminiz bir güvenlik duvarı tarafından engellenmediğini kontrol edin.

## Bu modülü nasıl kullanırım?

Bu depoda aşağıdaki klasör yapısı bulunmaktadır:

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): Bu klasör, Wallarm modülünü konuşlandırmak için gerekli alt modülleri içerir.
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): Bu klasör, Wallarm'ı konuşlandırmak için `modules` klasöründeki modülleri kullanmanın çeşitli örneklerini gösterir.

Wallarm'ı bu depoyu kullanarak üretim ortamına yaymak için:

1. Wallarm konsoluna [EU Cloud](https://my.wallarm.com/signup) veya [US Cloud](https://us1.my.wallarm.com/signup) üzerinden kaydolun.
1. Wallarm konsolunu açın ve **Nodes** bölümünde **Wallarm Nodo** türünde bir nodo oluşturun.
1. Üretilen nodo belirtecini kopyalayın.
1. Aşağıdaki gibi `wallarm` modülünün kodunu Terraform yapılandırmanıza ekleyin:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."

      host       = "api.wallarm.com" # or "us1.api.wallarm.com"
      token      = "..."

      instance_type = "..."

      ...
    }
    ```
1. `token` değişkenine kopyaladığınız nodo belirtecini belirtin ve diğer gereken değişkenleri ayarlayın.

## Bu modül nasıl bakım yapılır?

Wallarm AWS modülünü, [Wallarm ekibi](https://www.wallarm.com/) bakım yapmaktadır.

Wallarm AWS modülü hakkında sorularınız veya özellik talepleriniz varsa, lütfen [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question) adresine e-posta göndermekten çekinmeyin.

## Lisans

Bu kod, [MIT lisansı](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE) altında yayınlanmıştır.

Telif hakkı © 2022 Wallarm, Inc.