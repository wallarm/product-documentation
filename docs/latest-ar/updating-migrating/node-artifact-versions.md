# جرد إصدارات مقتنيات العقدة 

يُسرد هذا الوثيقة الإصدارات المتاحة [للتصحيحات](versioning-policy.md#version-format) لـ Wallarm node 4.10 في أشكال مختلفة. يمكنك تتبع الإصدارات الجديدة للتصحيحات وتخطيط التحديثات في الوقت المناسب استنادًا إلى هذا الوثيقة.

## المثبت الشامل

ينطبق تاريخ التحديثات متزامنًا على الإصدارات x86_64 و ARM64 (beta) لـ [المثبت الشامل](../installation/nginx/all-in-one.md).

[كيف تنقل من حزم DEB/RPM](nginx-modules.md)

[كيفية الانتقال من إصدار المثبت الشامل السابق](all-in-one.md)

### 4.10.2 (2024-03-08)

* تحسينات داخلية لتحقيق موثوقية وأمان أعلى، بما في ذلك تحسين التزامن بين العقدة الفرعية و Wallarm Cloud، وتأمين المستخدم `wallarm` بغلاف غير تفاعلي، وتغييرات أخرى لا تؤثر على تدفق الاستخدام
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم إصلاح الثغرات الأمنية: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1 (2024-02-21)

* تم حل مشكلة حيث تم التحقق بالخطأ من ملفات قواعد مخصصة قد تم تحميلها جزئيًا كما لو كانت كاملة. تم تنفيذ التنزيل المقسم لمعالجة هذه المشكلة
* تم إصلاح الثغرات الأمنية:

    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2021-41816](https://nvd.nist.gov/vuln/detail/CVE-2021-41816)
    * [CVE-2021-33621](https://nvd.nist.gov/vuln/detail/CVE-2021-33621)
    * [CVE-2021-41819](https://nvd.nist.gov/vuln/detail/CVE-2021-41819)
    * [CVE-2021-41817](https://nvd.nist.gov/vuln/detail/CVE-2021-41817)
    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2023-28755](https://nvd.nist.gov/vuln/detail/CVE-2023-28755)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)

### 4.10.0 (2024-02-02)

* الإصدار الأولي 4.10، [انظر سجل التغيير](what-is-new.md)

## رسم بياني Helm لمتحكم Wallarm NGINX Ingress 

[كيفية الترقية](ingress-controller.md)

### 4.10.3 (2024-03-08)

* تحسينات داخلية لتحقيق موثوقية وأمان أعلى، بما في ذلك تحسين التزامن بين العقدة الفرعية و Wallarm Cloud، وتأمين المستخدم `wallarm` بغلاف غير تفاعلي، وتغييرات أخرى لا تؤثر على تدفق الاستخدام
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم إصلاح الثغرات الأمنية: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.2 (2024-02-21)

* استعادة OpenTracing

### 4.10.1 (2024-02-21)

* تم تحديث حزمة `appstructure`
* التعزيزات الداخلية والتحسينات:
    
    * تنفيذ التسميات والتعليقات الموضحة لـ Tarantool pod
    * الانتقال إلى supervisord
* تم إصلاح الثغرات الأمنية:

    * [CVE-2021-41816](https://nvd.nist.gov/vuln/detail/CVE-2021-41816)
    * [CVE-2021-41819](https://nvd.nist.gov/vuln/detail/CVE-2021-41819)
    * [CVE-2021-33621](https://nvd.nist.gov/vuln/detail/CVE-2021-33621)
    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2023-28755](https://nvd.nist.gov/vuln/detail/CVE-2023-28755)
    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-41817](https://nvd.nist.gov/vuln/detail/CVE-2021-41817)

### 4.10.0 (2024-02-01)

* الإصدار الأولي 4.10، [انظر سجل التغيير](what-is-new.md)

## رسم بياني Helm لـ Wallarm حل الأساسي على eBPF

### 0.10.23 (2024-03-07)

* تم حل مشاكل المرايا الخاصة بتيارات http2 في بعض الحالات
* الإصلاحات الداخلية وتحسينات الاستقرار

### 0.10.22 (2024-03-01)

* [الإصدار الأولي](../installation/oob/ebpf/deployment.md)

## الصورة التي تعتمد على NGINX في Docker

[كيفية الترقية](docker-container.md)

### 4.10.2-1 (2024-03-08)

* تحسينات داخلية لتحقيق موثوقية وأمان أعلى، بما في ذلك تحسين التزامن بين العقدة الفرعية و Wallarm Cloud، وتأمين المستخدم `wallarm` بغلاف غير تفاعلي، وتغييرات أخرى لا تؤثر على تدفق الاستخدام
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم إصلاح الثغرات الأمنية: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1-1 (2024-02-21)

* تم تحديث حزمة `appstructure`
* تم إصلاح الثغرات الأمنية:

    * [CVE-2021-43998](https://nvd.nist.gov/vuln/detail/CVE-2021-43998)
    * [CVE-2021-38553](https://nvd.nist.gov/vuln/detail/CVE-2021-38553)
    * [CVE-2023-5954](https://nvd.nist.gov/vuln/detail/CVE-2023-5954)
    * [CVE-2023-5077](https://nvd.nist.gov/vuln/detail/CVE-2023-5077)
    * [CVE-2023-24999](https://nvd.nist.gov/vuln/detail/CVE-2023-24999)
    * [CVE-2021-32923](https://nvd.nist.gov/vuln/detail/CVE-2021-32923)
    * [CVE-2021-3282](https://nvd.nist.gov/vuln/detail/CVE-2021-3282)
    * [CVE-2021-41816](https://nvd.nist.gov/vuln/detail/CVE-2021-41816)
    * [CVE-2021-41819](https://nvd.nist.gov/vuln/detail/CVE-2021-41819)
    * [CVE-2021-33621](https://nvd.nist.gov/vuln/detail/CVE-2021-33621)
    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2022-3920](https://nvd.nist.gov/vuln/detail/CVE-2022-3920)
    * [CVE-2023-39325](https://nvd.nist.gov/vuln/detail/CVE-2023-39325)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2023-45283](https://nvd.nist.gov/vuln/detail/CVE-2023-45283)
    * [GHSA-m425-mq94-257g](https://github.com/advisories/GHSA-m425-mq94-257g)

### 4.10.0-1 (2024-02-02)

* الإصدار الأولي 4.10، بما في ذلك التحسينات و تعزيزات الأمان لصورة Docker. [انظر سجل التغيير](what-is-new.md)

## صورة الجهاز (AMI) في Amazon 

[كيفية الترقية](cloud-image.md)

### 4.10.2-1 (2024-03-08)

* تحسينات داخلية لتحقيق موثوقية وأمان أعلى، بما في ذلك تحسين التزامن بين العقدة الفرعية و Wallarm Cloud، وتأمين المستخدم `wallarm` بغلاف غير تفاعلي، وتغييرات أخرى لا تؤثر على تدفق الاستخدام
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم إصلاح الثغرات الأمنية: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1-2 (2024-02-21)

* تم تحديث حزمة `appstructure`
* تم إصلاح الثغرات الأمنية:

    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2023-4408](https://nvd.nist.gov/vuln/detail/CVE-2023-4408)
    * [CVE-2023-50387](https://nvd.nist.gov/vuln/detail/CVE-2023-50387)
    * [CVE-2023-50868](https://nvd.nist.gov/vuln/detail/CVE-2023-50868)
    * [CVE-2023-5517](https://nvd.nist.gov/vuln/detail/CVE-2023-5517)
    * [CVE-2023-5679](https://nvd.nist.gov/vuln/detail/CVE-2023-5679)
    * [CVE-2024-0553](https://nvd.nist.gov/vuln/detail/CVE-2024-0553)
    * [CVE-2024-0567](https://nvd.nist.gov/vuln/detail/CVE-2024-0567)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)

### 4.10.0-1 (2024-02-02)

* الإصدار الأولي 4.10، بما في ذلك التحسينات للصورة. [انظر سجل التغيير](what-is-new.md)

## صورة Google Cloud Platform

[كيفية الترقية](cloud-image.md)

### wallarm-node-4-10-20240220-234618

* تم تحديث حزمة `appstructure`
* تم إصلاح الثغرات الأمنية:

    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2023-4408](https://nvd.nist.gov/vuln/detail/CVE-2023-4408)
    * [CVE-2023-50387](https://nvd.nist.gov/vuln/detail/CVE-2023-50387)
    * [CVE-2023-50868](https://nvd.nist.gov/vuln/detail/CVE-2023-50868)
    * [CVE-2023-5517](https://nvd.nist.gov/vuln/detail/CVE-2023-5517)
    * [CVE-2023-5679](https://nvd.nist.gov/vuln/detail/CVE-2023-5679)
    * [CVE-2024-0553](https://nvd.nist.gov/vuln/detail/CVE-2024-0553)
    * [CVE-2024-0567](https://nvd.nist.gov/vuln/detail/CVE-2024-0567)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)

### wallarm-node-4-10-20240126-175315 (2024-02-02)

* الإصدار الأولي 4.10، بما في ذلك التحسينات للصورة. [انظر سجل التغيير](what-is-new.md)