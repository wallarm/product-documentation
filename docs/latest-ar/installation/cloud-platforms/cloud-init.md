# مواصفات سكربت البدء السحابي Wallarm

إذا كنت تُتبع النهج البنية كود Infrastructure as Code (IaC)، قد تحتاج إلى استخدام سكربت [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) لتوزيع عقدة Wallarm على السحابة العامة. ابتداءً من الإصدار 4.0، توزع Wallarm صورها السحابية مع سكربت `cloud-init.py` جاهز للاستخدام والذي يُوصَف في هذا الموضوع.

## نظرة عامة على سكربت البدء السحابي Wallarm

سكربت `cloud-init` من Wallarm متاح تحت المسار `/opt/wallarm/usr/share/wallarm-common/cloud-init.py` في [صورة Wallarm على سحاب AWS](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe). يقوم هذا السكربت بكلٍ من التكوين الأولي والمتقدم للنموذج مع المراحل الرئيسية التالية المُشاركة:

* يُشغل عقدة Wallarm التي تم إنشاؤها مسبقًا في سحابة Wallarm من خلال تنفيذ سكربت تسجيل العقدة `register-node` من Wallarm
* يُكون النموذج وفقًا لطريقة الوكيل أو المرآة المُحددة في المتغير `preset` (إذا كان يتم نشر Wallarm باستخدام [وحدة Terraform](aws/terraform-module/overview.md))
* يُعدل النموذج بدقة وفقًا لمقتطفات NGINX
* يُعدل عقدة Wallarm
* يُجري فحوصات الصحة لموازن الحمل

يتم تشغيل سكربت `cloud-init` مرة واحدة فقط عند بدء تشغيل النموذج، إعادة تشغيل النموذج لا يُجبر على إطلاقه. ستجد المزيد من التفاصيل في [وثائق AWS حول مفهوم السكربت](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html).

## تشغيل سكربت البدء السحابي Wallarm

يمكنك تشغيل سكربت البدء السحابي Wallarm كما يلي:

* إطلاق نموذج سحابي واستخدام بياناته الوصفية لوصف تشغيل سكربت `cloud-init.py`
* إنشاء قالب إطلاق نموذج مع سكربت `cloud-init.py` ثم إنشاء مجموعة توسيع تلقائي بناءً عليه

مثال على تنفيذ السكربت لتشغيل عقدة Wallarm كخادم وكيل لـ [httpbin.org](https://httpbin.org):

```bash
#!/bin/bash
set -e

### منع تشغيل NGINX بدون
### تمكين Wallarm، لا يُنصح بتنفيذ
### فحص الصحة قبل إتمام كل الأمور
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

للوفاء بنهج البنية كود Infrastructure as Code (IaC)، قمنا بتنفيذ [وحدة Terraform لـ AWS](aws/terraform-module/overview.md) التي يمكن أن تكون مثالًا توضيحيًا على استخدام سكربت البدء السحابي Wallarm.

## بيانات مساعدة سكربت البدء السحابي Wallarm

```plain
usage: /opt/wallarm/usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

يُشغل عقدة Wallarm بالتكوين المحدد في عنقود PaaS. https://docs.wallarm.com/waf-installation/cloud-
platforms/cloud-init/

الخيارات الاختيارية:
  -h, --help            يعرض هذه الرسالة المساعدة ويخرج
  -t TOKEN, --token TOKEN
                        رمز عقدة Wallarm المنسوخ من واجهة Wallarm Console.
  -H HOST, --host HOST  خادم API Wallarm المحدد لسحابة Wallarm المُستخدمة: https://docs.wallarm.com/about-wallarm-
                        waf/overview/#cloud. بشكل افتراضي، api.wallarm.com.
  --skip-register       يتخطى مرحلة تشغيل المحلي للعقدة التي تم إنشاؤها في سحابة Wallarm (يتجاوز تنفيذ سكربت register-node).
                        هذه المرحلة ضرورية لنشر العقدة بنجاح.
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        الإعداد المسبق لعقدة Wallarm: "proxy" للعقدة لتعمل كخادم وكيل، "mirror" للعقدة لمعالجة الحركة المعكوسة، "custom" للتكوين المُعرف عبر مقتطفات NGINX فقط.
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        وضع ترشيح الحركة: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        بروتوكول الخادم المُوكَل وعنوانه. مطلوب إذا تم تحديد "proxy" كإعداد مسبق.
  --libdetection        ما إذا كان سيتم استخدام مكتبة libdetection أثناء تحليل الحركة: https://docs.wallarm.com/about-wallarm-
                        waf/protecting-against-attacks.md#library-libdetection.
  --global-snippet GLOBAL_SNIPPET_FILE
                        التكوين المخصص المراد إضافته إلى التكوين العالمي لـ NGINX.
  --http-snippet HTTP_SNIPPET_FILE
                        التكوين المخصص المراد إضافته إلى كتلة التكوين "http" لـ NGINX.
  --server-snippet SERVER_SNIPPET_FILE
                        التكوين المخصص المراد إضافته إلى كتلة التكوين "server" لـ NGINX.
  -l LOG_LEVEL, --log LOG_LEVEL
                        مستوى التفصيلية.

هذا السكربت يغطي بعض التكوينات الأكثر شعبية لـ AWS، GCP، Azure وغيرها من منصات PaaS. إذا كنت بحاجة إلى تكوين أكثر قوة،
نرحب بك لمراجعة وثائق عقدة Wallarm العامة: https://docs.wallarm.com.
```