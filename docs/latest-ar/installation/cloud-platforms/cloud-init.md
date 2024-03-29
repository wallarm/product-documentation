# مواصفات سكربت `cloud-init` الخاص بـ Wallarm

إذا كنت تتبع منهج البنية التحتية كرمز (IaC)، فقد تحتاج إلى استخدام سكربت [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) لنشر عقدة Wallarm على السحابة العامة. ابتداءً من الإصدار 4.0، توزع Wallarm صور سحابية بها سكربت `cloud-init.py` جاهز للاستخدام ويُشرح في هذا الموضوع.

## نظرة عامة على سكربت `cloud-init` الخاص بـ Wallarm

سكربت `cloud-init` الخاص بـ Wallarm متوفر تحت المسار `/opt/wallarm/usr/share/wallarm-common/cloud-init.py` في [صورة AWS السحابية الخاصة بـ Wallarm](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe). يقوم هذا السكربت بتنفيذ كل من التكوين الأولي والمتقدم للعقدة بمراحل رئيسية تشمل:

* تشغيل عقدة Wallarm التي تم إنشاؤها مسبقًا في سحابة Wallarm من خلال تنفيذ سكربت تسجيل العقدة `register-node` الخاص بـ Wallarm
* تكوين العقدة وفقًا إما للنهج الوكيل أو المرآة المحدد في متغير `preset` (إذا تم نشر Wallarm باستخدام [وحدة Terraform](aws/terraform-module/overview.md))
* تهيئة العقدة بدقة وفقًا لأجزاء NGINX
* تهيئة عقدة Wallarm
* أداء فحوصات الصحة لموزع الأحمال

يتم تشغيل سكربت `cloud-init` مرة واحدة فقط عند بدء تشغيل العقدة، وإعادة تشغيل العقدة لا يقوي بتشغيله. ستجد المزيد من التفاصيل في [وثائق AWS حول مفهوم السكربت](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html).

## تشغيل سكربت `cloud-init` الخاص بـ Wallarm

يمكنك تشغيل سكربت `cloud-init` الخاص بـ Wallarm كما يلي:

* إطلاق عقدة سحابية واستخدام البيانات الوصفية الخاصة بها لوصف تشغيل سكربت `cloud-init.py`
* إنشاء قالب إطلاق العقدة مع سكربت `cloud-init.py` ثم إنشاء مجموعة توسيع تلقائي بناءً عليه

مثال على تنفيذ السكربت لتشغيل عقدة Wallarm كخادم وكيل لـ [httpbin.org](https://httpbin.org):

```bash
#!/bin/bash
set -e

### منع NGINX من التشغيل بدون
### Wallarm مفعل، لا يُوصى بتشغيل
### فحص الصحة قبل اكتمال كل الأمور
###
systemctl stop nginx.service

/opt/wallarm/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo تم تكوين عقدة Wallarm بنجاح!
```

لتلبية منهج البنية التحتية كرمز (IaC)، قمنا بتنفيذ [وحدة Terraform لـ AWS](aws/terraform-module/overview.md) التي يمكن أن تكون مثالًا توضيحيًا على استخدام سكربت `cloud-init` الخاص بـ Wallarm.

## بيانات مساعدة سكربت `cloud-init` الخاص بـ Wallarm

```plain
usage: /opt/wallarm/usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

يشغّل عقدة Wallarm بالتكوين المحدد في عنقود PaaS. https://docs.wallarm.com/waf-installation/cloud-
platforms/cloud-init/

الوسيطات الاختيارية:
  -h, --help            يُظهر رسالة المساعدة ويخرج
  -t TOKEN, --token TOKEN
                        رمز عقدة Wallarm المنسوخ من واجهة Wallarm Console.
  -H HOST, --host HOST  خادم API الخاص بـ Wallarm المحدد لسحابة Wallarm المُستخدمة: https://docs.wallarm.com/about-wallarm-
                        waf/overview/#cloud. افتراضيًا، api.wallarm.com.
  --skip-register       يتجاوز مرحلة تشغيل العقدة المحلية المُنشأة في سحابة Wallarm (يتجاوز تنفيذ سكربت register-node).
                        هذه المرحلة ضرورية لنجاح نشر العقدة.
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        مُعدّة مسبقة لعقدة Wallarm: "proxy" للعمل كخادم وكيل، "mirror" لمعالجة الحركة المعكوسة، "custom" للتكوين المُحدد عبر أجزاء NGINX فقط.
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        وضع تصفية الحركة: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        بروتوكول الخادم الوكيل وعنوانه. مطلوب إذا تم تحديد "proxy" كمُعدة مسبقة.
  --libdetection        سواء كان يتم استخدام مكتبة libdetection خلال تحليل الحركة: https://docs.wallarm.com/about-wallarm-
                        waf/protecting-against-attacks.md#library-libdetection.
  --global-snippet GLOBAL_SNIPPET_FILE
                        التكوين المخصص لإضافته إلى التكوين العالمي لـ NGINX.
  --http-snippet HTTP_SNIPPET_FILE
                        التكوين المخصص لإضافته إلى كتلة التكوين "http" لـ NGINX.
  --server-snippet SERVER_SNIPPET_FILE
                        التكوين المخصص لإضافته إلى كتلة التكوين "server" لـ NGINX.
  -l LOG_LEVEL, --log LOG_LEVEL
                        مستوى التفصيلية.

هذا السكربت يغطي بعض التكوينات الأكثر شعبية لـ AWS، GCP، Azure وغيرها من PaaS. إذا كنت بحاجة إلى تكوين أقوى،
نرحب بك لمراجعة وثائق عقدة Wallarm العامة: https://docs.wallarm.com.
```