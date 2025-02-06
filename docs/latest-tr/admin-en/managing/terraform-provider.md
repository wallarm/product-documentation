# Terraform Kullanarak Wallarm Yönetimi

Eğer altyapılarınızı yönetmek için [Terraform](https://www.terraform.io/) kullanıyorsanız, Wallarm'ı yönetmek için de bu aracı kullanmak sizin için uygun bir seçenek olabilir. Terraform için [Wallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) bu imkanı sunar.

## Gereksinimler

* [Terraform](https://www.terraform.io/) temellerini bilmek
* Terraform 0.15.5 veya daha üstü binary
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) üzerindeki Wallarm hesabı
* US veya EU [Cloud](../../about-wallarm/overview.md#cloud) içindeki Wallarm Console’da **Administrator** [rolüne](../../user-guides/settings/users.md#user-roles) sahip hesaba erişim
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` ya da EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` erişimi. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun

## Provider Kurulumu

1. Terraform konfigürasyonunuza aşağıdakini kopyalayıp yapıştırın:

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.5.0"
        }
      }
    }

    provider "wallarm" {
      # Configuration options
    }
    ```

1. `terraform init` komutunu çalıştırın.

## Provider'ı Wallarm Hesabınıza Bağlama

Wallarm Terraform provider'ını US veya EU [Cloud](../../about-wallarm/overview.md#cloud) üzerindeki Wallarm hesabınıza bağlamak için, Terraform konfigürasyonunuzda API erişim kimlik bilgilerinizi ayarlayın:

=== "US Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # Multitenancy özelliği kullanılıyorsa zorunludur:
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # Multitenancy özelliği kullanılıyorsa zorunludur:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>`, Wallarm hesabınızın API erişimine izin verir. [How to get it →](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>`, kiracı (client) ID’sidir; yalnızca [multitenancy](../../installation/multi-tenant/overview.md) özelliği kullanılıyorsa gereklidir. Burada açıklandığı gibi `id` (uuid değil) alın [buraya](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api) bakın.

Wallarm provider dökümantasyonunda [detayları](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) inceleyebilirsiniz.

## Provider ile Wallarm Yönetimi

Wallarm provider sayesinde, Terraform üzerinden şunları yönetebilirsiniz:

* [Kendi Kendine Barındırılan Düğümler](../../user-guides/nodes/nodes.md)
* [Uygulamalar](../../user-guides/settings/applications.md)
* [Kurallar](../../user-guides/rules/rules.md)
* [Tetikleyiciler](../../user-guides/triggers/triggers.md)
* [Denylist](../../user-guides/ip-lists/overview.md), [allowlist](../../user-guides/ip-lists/overview.md) ve [graylist](../../user-guides/ip-lists/overview.md) içindeki IP'ler
* [Kullanıcılar](../../user-guides/settings/users.md)
* [Entegrasyonlar](../../user-guides/settings/integrations/integrations-intro.md)
* Global [filtration mode](../../admin-en/configure-wallarm-mode.md)
* [Scanner](../../user-guides/scanner.md) kapsamı
* [Vulnerabilities](../../user-guides/vulnerabilities.md)

!!! info "Wallarm Terraform provider ve Edge Düğümleri"
    Şu anda, Edge [inline](../../installation/security-edge/deployment.md) ve [connector](../../installation/se-connector.md) düğümleri Wallarm Terraform provider aracılığıyla yönetilememektedir.

Liste halinde belirtilen işlemlerin nasıl gerçekleştirileceğini Wallarm provider [dökümantasyonunda](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) görebilirsiniz.

## Kullanım Örneği

Aşağıda Wallarm için Terraform konfigürasyon örneği verilmiştir:

```
provider "wallarm" {
  api_token = "<WALLARM_API_TOKEN>"
  api_host = "https://us1.api.wallarm.com"
}

resource "wallarm_global_mode" "global_block" {
  waf_mode = "default"
}

resource "wallarm_application" "tf_app" {
  name = "Terraform Application 001"
  app_id = 42
}

resource "wallarm_rule_mode" "tiredful_api_mode" {
  mode =  "monitoring"

  action {
    point = {
      instance = 42
    }
  }

  action {
    type = "regex"
    point = {
      scheme = "https"
    }
  }
}
```

Konfigürasyon dosyasını kaydedin, ardından `terraform apply` komutunu çalıştırın.

Konfigürasyonun yaptığı işlemler şunlardır:

* Sağlanan Wallarm API token ile US Cloud’daki şirket hesabına bağlanır.
* `resource "wallarm_global_mode" "global_block"` → global filtreleme modunu `Local settings (default)` olarak ayarlar; bu, filtreleme modunun her düğümde yerel olarak kontrol edildiği anlamına gelir.
* `resource "wallarm_application" "tf_app"` → ID’si `42` olan `Terraform Application 001` adlı uygulamayı oluşturur.
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → ID’si `42` olan uygulamaya HTTPS protokolü üzerinden gönderilen tüm istekler için trafik filtreleme modunu `Monitoring` olarak ayarlar.

## Wallarm ve Terraform Hakkında Daha Fazla Bilgi

Terraform, kullanıcıların public [registry](https://www.terraform.io/registry#navigating-the-registry) üzerinden erişebildiği (**[providers](https://www.terraform.io/language/providers)**) entegrasyonları ve hazır konfigürasyonları (**[modules](https://www.terraform.io/language/modules)**) destekler; bu registry birçok satıcı tarafından oluşturulmaktadır.

Bu registry'e Wallarm tarafından şunlar yayınlanmıştır:

* Terraform üzerinden Wallarm'ı yönetmek için [Wallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs). Bu makalede açıklanmıştır.
* Terraform uyumlu ortamdan AWS’ye düğümü dağıtmak için [Wallarm module](../../installation/cloud-platforms/aws/terraform-module/overview.md).

Bu iki araç, farklı amaçlara hizmet eden bağımsız araçlardır. Birini kullanmak diğerine ihtiyaç duymaz.