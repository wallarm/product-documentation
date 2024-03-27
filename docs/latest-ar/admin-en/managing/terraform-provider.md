# إدارة Wallarm باستخدام Terraform

إذا كنت تستخدم [Terraform](https://www.terraform.io/) لإدارة البنيات التحتية الخاصة بك، فقد يكون خيارًا مريحًا لك إستخدامه لإدارة Wallarm. يسمح [مزود Wallarm](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) لـ Terraform بذلك.

## المتطلبات

* معرفة أساسيات [Terraform](https://www.terraform.io/)
* الإصدار الثنائي لـ Terraform 0.15.5 أو أعلى
* حساب Wallarm في [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* الوصول إلى الحساب بـ **الدور** [المدير](../../user-guides/settings/users.md#user-roles) في لوحة تحكم Wallarm في السحابة الأمريكية أو الأوروبية [السحابة](../../about-wallarm/overview.md#cloud)
* الوصول إلى `https://us1.api.wallarm.com` في حالة العمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` في حالة العمل مع سحابة Wallarm الأوروبية. يُرجى التأكد من أن الوصول لم يتم حظره بواسطة جدار حماية

## تثبيت المزود

1. انسخ والصق في تكوين Terraform الخاص بك:

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.3.1"
        }
      }
    }

    provider "wallarm" {
      # خيارات التكوين
    }
    ```

1. قم بتشغيل `terraform init`.

## ربط المزود بحساب Wallarm الخاص بك

لربط مزود Terraform الخاص بـ Wallarm بحساب Wallarm الخاص بك في [السحابة الأمريكية](https://us1.my.wallarm.com/signup) أو [السحابة الأوروبية](https://my.wallarm.com/signup)، قم بتعيين بيانات اعتماد الوصول إلى API في تكوين Terraform الخاص بك:

=== "السحابة الأمريكية"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # مطلوب فقط عند استخدام ميزة العديد من المستأجرين:
      # client_id = <CLIENT_ID>
    }
    ```
=== "السحابة الأوروبية"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # مطلوب فقط عند استخدام ميزة العديد من المستأجرين:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>` يسمح بالوصول إلى API لحساب Wallarm الخاص بك. [كيفية الحصول عليه →](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>` هو ID المستأجر (العميل)؛ مطلوب فقط عند استخدام ميزة [العديد من المستأجرين](../../installation/multi-tenant/overview.md). خذ `id` (ليس `uuid`) كما هو موضح [هنا](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

انظر [التفاصيل](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) في وثائق مزود Wallarm.

## إدارة Wallarm باستخدام المزود

باستخدام مزود Wallarm، من خلال Terraform يمكنك إدارة:

* [العقد](../../user-guides/nodes/nodes.md) في حسابك
* [التطبيقات](../../user-guides/settings/applications.md)
* [القواعد](../../user-guides/rules/rules.md)
* [المحفزات](../../user-guides/triggers/triggers.md)
* IPs في [قائمة الحظر](../../user-guides/ip-lists/overview.md)، [قائمة السماح](../../user-guides/ip-lists/overview.md) و [قائمة الرمادي](../../user-guides/ip-lists/overview.md)
* [المستخدمين](../../user-guides/settings/users.md)
* [التكاملات](../../user-guides/settings/integrations/integrations-intro.md)
* وضع [التصفية العالمي](../../admin-en/configure-wallarm-mode.md)
* نطاق [الماسح الضوئي](../../user-guides/scanner.md)
* [الثغرات](../../user-guides/vulnerabilities.md)

!!! info "مزود Wallarm Terraform وعقد CDN"
    حاليًا لا يمكن إدارة [عقد CDN](../../user-guides/nodes/cdn-node.md) عبر مزود Wallarm Terraform.

انظر كيفية تنفيذ العمليات المذكورة في [الوثائق](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) لمزود Wallarm.

## مثال على الاستخدام

أدناه مثال على تكوين Terraform لـ Wallarm:

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

احفظ ملف التكوين، ثم قم بتنفيذ `terraform apply`.

التكوين يؤدي الآتي:

* يربط بالسحابة الأمريكية → حساب الشركة بالرمز الخاص بـ Wallarm API المقدم.
* `resource "wallarm_global_mode" "global_block"` → يضبط وضع الترشيح العالمي إلى `الإعدادات المحلية (default)` وهو ما يعني أن وضع التصفية يتم التحكم فيه محليًا على كل عقدة.
* `resource "wallarm_application" "tf_app"` → ينشئ تطبيقًا باسم `Terraform Application 001` بمعرف `42`.
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → ينشئ قاعدة تحدد وضع ترشيح الحركة إلى `المراقبة` لجميع الطلبات المرسلة عبر بروتوكول HTTPS إلى التطبيق بمعرف `42`.

## مزيد من المعلومات حول Wallarm و Terraform

Terraform يدعم عددًا من التكاملات (**[المزودين](https://www.terraform.io/language/providers)**) والتكوينات الجاهزة للاستخدام (**[الوحدات](https://www.terraform.io/language/modules)**) المتاحة للمستخدمين عبر السجل العام [السجل](https://www.terraform.io/registry#navigating-the-registry)، الذي تملأه عدد من البائعين.

إلى هذا السجل، نشرت Wallarm:

* [مزود Wallarm](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) لإدارة Wallarm عبر Terraform. وصف في المقال الحالي.
* [الوحدة النمطية Wallarm](../../installation/cloud-platforms/aws/terraform-module/overview.md) لنشر العقدة إلى AWS من بيئة متوافقة مع Terraform.

هذين هما أداتان مستقلتان تُستخدمان لأغراض مختلفة. ليس من الضروري استخدام واحدة للاستفادة من الأخرى.