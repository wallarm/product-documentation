# إدارة Wallarm باستخدام Terraform

إذا كنت تستخدم [Terraform](https://www.terraform.io/) لإدارة البنيات التحتية الخاصة بك، فقد تكون هذه خيارًا مريحًا لاستخدامه في إدارة Wallarm. يتيح [مزود Wallarm](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) لـ Terraform القيام بذلك.

## المتطلبات

* معرفة الأساسيات [Terraform](https://www.terraform.io/)
* الإصدار الثنائي من Terraform 0.15.5 أو أعلى
* حساب Wallarm في [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* الوصول إلى الحساب بدور **المدير** [الدور](../../user-guides/settings/users.md#user-roles) في وحدة تحكم Wallarm في السحابة الأمريكية أو الأوروبية
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأوروبية. الرجاء التأكد من عدم حظر الوصول بواسطة جدار الحماية

## تثبيت المزود

1. انسخ وألصق في تكوين Terraform الخاص بك:

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

لربط مزود Terraform الخاص بـ Wallarm بحساب Wallarm الخاص بك في [السحابة الأمريKية](https://us1.my.wallarm.com/signup) أو [السحابة الأوروبية](https://my.wallarm.com/signup)، قم بتعيين بيانات اعتماد الوصول إلى API في تكوين Terraform الخاص بك:

=== "السحابة الأمريKية"
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

* `<WALLARM_API_TOKEN>` يتيح الوصول إلى API لحساب Wallarm الخاص بك. [كيفية الحصول عليه →](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>` هو معرّف المستأجر (العميل)؛ مطلوب فقط عند استخدام ميزة [العديد من المستأجرين](../../installation/multi-tenant/overview.md). خذ `id` (وليس `uuid`) كما هو موضح [هنا](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

راجع [التفاصيل](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) في وثائق مزود Wallarm.

## إدارة Wallarm بالمزود

مع مزود Wallarm، عبر Terraform يمكنك إدارة:

* [العُقد](../../user-guides/nodes/nodes.md) في حسابك
* [التطبيقات](../../user-guides/settings/applications.md)
* [القواعد](../../user-guides/rules/rules.md)
* [المُشغلات](../../user-guides/triggers/triggers.md)
* عناوين IP في [القائمة السوداء](../../user-guides/ip-lists/overview.md)، [القائمة البيضاء](../../user-guides/ip-lists/overview.md) و[القائمة الرمادية](../../user-guides/ip-lists/overview.md)
* [المستخدمين](../../user-guides/settings/users.md)
* [التكاملات](../../user-guides/settings/integrations/integrations-intro.md)
* وضع [الترشيح العالمي](../../admin-en/configure-wallarm-mode.md)
* نطاق [الماسح](../../user-guides/scanner.md)
* [الثغرات الأمنية](../../user-guides/vulnerabilities.md)

!!! معلومات "مزود Wallarm Terraform وعُقد CDN"
    حاليًا لا يمكن إدارة [عُقد CDN](../../user-guides/nodes/cdn-node.md) عبر مزود Wallarm لـ Terraform.

راجع كيفية تنفيذ العمليات المدرجة في [وثائق](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) مزود Wallarm.

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

التكوين يقوم بالتالي:

* الاتصال بالسحابة الأمريكية → حساب الشركة بالرمز المميز لـ API الخاص بـ Wallarm.
* `resource "wallarm_global_mode" "global_block"` → يضبط وضع الترشيح العالمي على `الإعدادات المحلية (الافتراضي)` مما يعني أن وضع الترشيح يتم التحكم فيه محليًا على كل عقدة.
* `resource "wallarm_application" "tf_app"` → ينشئ تطبيقًا باسم `Terraform Application 001` بالمعرف `42`.
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → ينشئ قاعدة تضبط وضع ترشيح حركة المرور إلى `المراقبة` لجميع الطلبات المرسلة عبر بروتوكول HTTPS إلى التطبيق بالمعرف `42`.

## مزيد من المعلومات حول Wallarm وTerraform

Terraform يدعم عددًا من التكاملات (**[المزودين](https://www.terraform.io/language/providers)**) والتكوينات الجاهزة للاستخدام (**[وحدات](https://www.terraform.io/language/modules)**) المتاحة للمستخدمين عبر ال[سجل](https://www.terraform.io/registry#navigating-the-registry) العام، معبأ بواسطة عدد من البائعين.

لهذا السجل، نشرت Wallarm:

* [مزود Wallarm](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) لإدارة Wallarm عبر Terraform. يُوصف في المقال الحالي.
* [وحدة Wallarm](../../installation/cloud-platforms/aws/terraform-module/overview.md) لنشر العقدة إلى AWS من بيئة متوافقة مع Terraform.

هذان أداتان مستقلتان تُستخدمان لأغراض مختلفة. ليس من الضروري استخدام أحدهما للآخر.