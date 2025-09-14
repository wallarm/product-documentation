# Terraform kullanarak Wallarm'ı yönetme

Altyapılarınızı yönetmek için [Terraform](https://www.terraform.io/) kullanıyorsanız, Wallarm'ı yönetmek için de onu kullanmak sizin için rahat bir seçenek olabilir. Terraform için [Wallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) bunu yapmanıza olanak tanır.

## Gereksinimler

* [Terraform](https://www.terraform.io/) temellerini bilmek
* Terraform 0.15.5 veya daha yeni ikili dosya
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) üzerinde Wallarm hesabı
* US veya EU [Bulut](../../about-wallarm/overview.md#cloud) ortamında Wallarm Console içinde **Administrator** [rolüne](../../user-guides/settings/users.md#user-roles) sahip hesaba erişim
* US Wallarm Cloud ile çalışırken `https://us1.api.wallarm.com`a veya EU Wallarm Cloud ile çalışırken `https://api.wallarm.com`a erişim. Lütfen erişimin güvenlik duvarı tarafından engellenmediğinden emin olun

## Sağlayıcının kurulumu

1. Aşağıdakini Terraform yapılandırmanıza kopyalayıp yapıştırın:

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
      # Yapılandırma seçenekleri
    }
    ```

1. `terraform init` komutunu çalıştırın.

## Sağlayıcıyı Wallarm hesabınıza bağlama

Wallarm Terraform provider'ını [US](https://us1.my.wallarm.com/signup) veya [EU](https://my.wallarm.com/signup) Cloud içindeki Wallarm hesabınıza bağlamak için, Terraform yapılandırmanızda API erişim kimlik bilgilerini ayarlayın:

=== "US Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # Yalnızca çoklu kiracılık özelliği kullanıldığında gereklidir:
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # Yalnızca çoklu kiracılık özelliği kullanıldığında gereklidir:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>`, Wallarm hesabınızın API'sine erişim sağlar. [Nasıl alınır →](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>`, kiracının (müşteri) kimliğidir; yalnızca [çoklu kiracılık](../../installation/multi-tenant/overview.md) özelliği kullanıldığında gereklidir. [Burada](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api) açıklandığı gibi `uuid` değil `id` değerini alın.

Ayrıntılar için Wallarm provider belgelerine bakın: [ayrıntılar](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs).

## Sağlayıcı ile Wallarm'ı yönetme

Wallarm provider ile, Terraform aracılığıyla şunları yönetebilirsiniz:

* [Kendi barındırılan düğümler](../../user-guides/nodes/nodes.md)
* [Uygulamalar](../../user-guides/settings/applications.md)
* [Kurallar](../../user-guides/rules/rules.md)
* [Tetikleyiciler](../../user-guides/triggers/triggers.md)
* [denylist](../../user-guides/ip-lists/overview.md), [allowlist](../../user-guides/ip-lists/overview.md) ve [graylist](../../user-guides/ip-lists/overview.md) içindeki IP'ler
* [Kullanıcılar](../../user-guides/settings/users.md)
* [Entegrasyonlar](../../user-guides/settings/integrations/integrations-intro.md)
* Global [filtreleme modu](../../admin-en/configure-wallarm-mode.md)
* [Güvenlik açıkları](../../user-guides/vulnerabilities.md)

!!! info "Wallarm Terraform provider ve Edge düğümleri"
    Şu anda, Edge [inline](../../installation/security-edge/inline/overview.md) ve [connector](../../installation/security-edge/se-connector.md) düğümleri Wallarm Terraform provider üzerinden yönetilememektedir.

Listelenen işlemlerin nasıl gerçekleştirileceğini Wallarm provider [belgelerinde](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) görebilirsiniz.

## Kullanım örneği

Aşağıda Wallarm için Terraform yapılandırma örneği verilmiştir:

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

Yapılandırma dosyasını kaydedin, ardından `terraform apply` komutunu çalıştırın.

Yapılandırma şunları yapar:

* US Cloud → şirket hesabına, sağlanan Wallarm API belirteci ile bağlanır.
* `resource "wallarm_global_mode" "global_block"` → global filtreleme modunu `Local settings (default)` olarak ayarlar; bu, filtreleme modunun her düğümde yerel olarak kontrol edildiği anlamına gelir.
* `resource "wallarm_application" "tf_app"` → `Terraform Application 001` adlı, `42` kimliğine sahip uygulamayı oluşturur.
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → HTTPS protokolü üzerinden `42` kimlikli uygulamaya gönderilen tüm istekler için trafik filtreleme modunu `Monitoring` olarak ayarlayan bir kural oluşturur.

## Wallarm ve Terraform hakkında daha fazla bilgi

Terraform, bir dizi entegrasyonu (**[providers](https://www.terraform.io/language/providers)**) ve kullanıma hazır yapılandırmaları (**[modules](https://www.terraform.io/language/modules)**) birden çok sağlayıcı tarafından sağlanan herkese açık [kayıt](https://www.terraform.io/registry#navigating-the-registry) üzerinden kullanıcılara sunar.

Bu kayıt içine Wallarm şunları yayımladı:

* Terraform aracılığıyla Wallarm'ı yönetmek için [Wallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs). Bu yazıda açıklanmıştır.
* Terraform uyumlu bir ortamdan AWS'ye düğüm dağıtmak için [Wallarm modülü](../../installation/cloud-platforms/aws/terraform-module/overview.md).

Bu ikisi farklı amaçlar için kullanılan, birbirinden bağımsız araçlardır. Birini kullanmak için diğerine ihtiyaç yoktur.