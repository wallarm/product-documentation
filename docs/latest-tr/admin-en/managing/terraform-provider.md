# Terraform Kullanarak Wallarm Yönetimi

Altyapılarınızı yönetmek için [Terraform](https://www.terraform.io/) kullanıyorsanız, Wallarm'ı yönetmek için de kullanmak sizin için rahat bir seçenek olabilir. Terraform için [Wallarm sağlayıcısı](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) bunu yapmanıza izin verir.

## Gereksinimler

* [Terraform](https://www.terraform.io/) temellerini bilmek
* Terraform 0.15.5 binary veya daha yükseği
* [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/)'ndaki Wallarm hesabı
* Wallarm Konsolu'ndaki [Cloud](../../about-wallarm/overview.md#cloud)'da **Yönetici**  [rol](../../user-guides/settings/users.md#user-roles)-ine sahip hesaba erişim
* ABD Wallarm Bulutu ile çalışırken `https://us1.api.wallarm.com` adresine veya AB Wallarm Bulutu ile çalışırken `https://api.wallarm.com` adresine erişim.  Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun

## Sağlayıcı kurulumu

1. Terraform yapılandırmanıza kopyalayın ve yapıştırın:

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.1.2"
        }
      }
    }

    provider "wallarm" {
      # Configuration options
    }
    ```

1. `terraform init`i çalıştırın.

## Sağlayıcıyı Wallarm hesabınıza bağlama

Wallarm Terraform sağlayıcısını [ABD](https://us1.my.wallarm.com/signup) veya [AB](https://my.wallarm.com/signup) Bulutundaki Wallarm hesabınıza bağlamak için, API erişim bilgilerinizi Terraform yapılandırmanızda ayarlayın:

=== "ABD Bulutu"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # Multitenancy özelliği kullanıldığında yalnızca gereklidir:
      # client_id = <CLIENT_ID>
    }
    ```
=== "AB Bulutu"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # Multitenancy özelliği kullanıldığında yalnızca gereklidir:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>` Wallarm hesabınızın API'sine erişime izin verir. [Nasıl alınır →](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>` kiracının (müşterinin) ID'si; yalnızca [multitenancy](../../installation/multi-tenant/overview.md) özelliği kullanıldığında gereklidir. [Burada](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api) tarif edildiği gibi `id`'yi (not `uuid`) alın.

Wallarm sağlayıcı belgelerinde [ayrıntıları](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) görün.

## Sağlayıcı ile Wallarm'ın yönetimi

Wallarm sağlayıcı ile, Terraform üzerinden şunları yönetebilirsiniz:

* Hesabınızdaki [Düğümler](../../user-guides/nodes/nodes.md)
* [Uygulamalar](../../user-guides/settings/applications.md)
* [Kurallar](../../user-guides/rules/rules.md)
* [Tetikleyiciler](../../user-guides/triggers/triggers.md)
* [Reddedilenlist](../../user-guides/ip-lists/denylist.md), [izinlisten](../../user-guides/ip-lists/allowlist.md) ve [gri listeler](../../user-guides/ip-lists/graylist.md)'deki IP'ler
* [Kullanıcılar](../../user-guides/settings/users.md)
* [Entegrasyonlar](../../user-guides/settings/integrations/integrations-intro.md)
* Küresel [filtrasyon modu](../../admin-en/configure-wallarm-mode.md)
* [Tarayıcı](../../user-guides/scanner.md) kapsamı
* [Zafiyetler](../../user-guides/vulnerabilities.md)

!!! info "Wallarm Terraform sağlayıcısı ve CDN düğümleri"
    Şu anda [CDN düğümleri](../../user-guides/nodes/cdn-node.md) Wallarm Terraform sağlayıcısı aracılığıyla yönetilemiyor.

Listelenen işlemlerin nasıl gerçekleştirileceğini Wallarm sağlayıcı [belgelerinde](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) görün.

## Kullanım Örneği

Aşağıda, Wallarm için bir Terraform yapılandırması örneği bulunmaktadır:

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

Yapılandırma aşağıdakileri yapar:

* Verilen Wallarm API token'i ile ABD Bulutu'na → şirket hesabına bağlanır.
* `resource "wallarm_global_mode" "global_block"` → küresel filtrasyon modunu `Local settings (default)` olarak ayarlar, bu da filtrasyon modunun her düğümde lokal olarak kontrol edildiği anlamına gelir.
* `resource "wallarm_application" "tf_app"` → `Terraform Application 001` adında, ID'si `42` olan bir uygulama oluşturur.
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → ID'si `42` olan uygulamaya HTTPS protokolü üzerinden gönderilen tüm istekler için trafik filtrasyon modunu `Monitoring` olarak ayarlayan bir kural oluşturur.

## Wallarm ve Terraform Hakkında Daha Fazla Bilgi

Terraform, kullanıcıların halka açık [kaynak](https://www.terraform.io/registry#navigating-the-registry) üzerinden erişebileceği bir dizi entegrasyon (**[sağlayıcılar](https://www.terraform.io/language/providers)**) ve kullanıma hazır yapılandırmaları (**[modüller](https://www.terraform.io/language/modules)**) destekler, bu yapılandırmalar bir dizi satıcı tarafından oluşturulmuştur.

Wallarm, bu kaynağa:

* Wallarm'ı Terraform üzerinden yönetmek için [Wallarm sağlayıcısı](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)'nı yayınlamıştır. Mevcut makalede bu anlatılmaktadır.
* Terraform uyumlu ortamdan AWS'ye düğümü dağıtmak için [Wallarm modülünü](../../installation/cloud-platforms/aws/terraform-module/overview.md) yayınlamıştır.

Bu iki araç bağımsız araçlardır ve farklı amaçlar için kullanılırlar. Bir diğerinin kullanılması zorunlu değildir.
