# جرد إصدارات تجهيزة العقدة

يسرد هذا المستند [إصدارات التصحيح](versioning-policy.md#version-format) المتاحة لعقدة Wallarm 4.10 في أشكال مختلفة. يمكنك تعقب إصدارات التصحيح الجديدة وتخطيط الترقيات في الوقت المناسب استنادًا إلى هذا المستند.

## المثبت الشامل

تاريخ التحديثات ينطبق بشكل متزامن على الإصدارات x86_64 وARM64 (نسخة تجريبية) من [المثبِت الشامل](../installation/nginx/all-in-one.md).

[كيفية التحويل من حزم DEB/RPM](nginx-modules.md)

[كيفية التحويل من الإصدار السابق للمثبت الشامل](all-in-one.md)

### 4.10.3 (2024-03-18)

* تم تقليل قيمة معامل `readahead` لـ Tarantool إلى 32KB

### 4.10.2 (2024-03-08)

* تحسينات داخلية لمزيد من الثبات والأمان، بما في ذلك تحسين المزامنة بين العقدة المُصفِّية وCloud Wallarm ، ضمان سلامة المستخدم `wallarm` بواجهة shell غير تفاعلية، وغيرها من التغييرات التي لا تؤثر على التدفق الاستخدامي.
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم تقليل قيمة معلمة `readahead` لـ Tarantool إلى 32KB
* تم إصلاح التالي من الثغرات الأمنية:

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1 (2024-02-21)

* تم إصلاح المشكلة التي تم فيها التحقق الخاطئ من أن ملفات قواعد مخصصة تم تنزيلها جزئيًا ككاملة. تم تنفيذ التنزيل المُتجزَّأ لمعالجة هذا الإصدار.
* تم إصلاح التالي من الثغرات الأمنية:

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

* الإصدار الأولي 4.10، [راجع سجل التغيير](what-is-new.md)

## خريطة Helm لوحدة التحكم في وصول NGINX من Wallarm

[كيفية الترقية](ingress-controller.md)

### 4.10.3 (2024-03-08)

* تحسينات داخلية لمزيد من الثبات والأمان، بما في ذلك تحسين المزامنة بين العقدة المُصفِّية وCloud Wallarm ، ضمان سلامة المستخدم `wallarm` بواجهة shell غير تفاعلية، وغيرها من التغييرات التي لا تؤثر على التدفق الاستخدامي.
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم إصلاح التالي من الثغرات الأمنية:

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.2 (2024-02-21)

* استعادة OpenTracing

### 4.10.1 (2024-02-21)

* تم تحديث حزمة `appstructure`
* تحسينات وتحسينات داخلية:

    * تطبيق الملصقات والتعليقات التوضيحية لـ Tarantool pod
    * التحول إلى supervisord
* تم إصلاح التالي من الثغرات الأمنية:

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

* الإصدار الأولي 4.10، [راجع سجل التغيير](what-is-new.md)


## خريطة Helm لحل Wallarm القائم على eBPF

### 0.10.26 (2024-03-27)

* تم تنفيذ التحقق من السلطة التحقق (CA) للمرور من وكيل eBPF إلى العقدة التجهيزية لـ Wallarm
* تمت إضافة دعم TLS المتبادل (mTLS)، مما يتيح للعقدة التجهيزية التحقق من أمان المرور من وكيل eBPF

    هذا تحت التحكم بواسطة القيمة [`config.mutualTLS`](../installation/oob/ebpf/helm-chart-for-wallarm.md#configmutualtls) في خريطة Helm، معطلة بشكل افتراضي.
* تحديث تبعيات الوكيل

### 0.10.25 (2024-03-19)

* تمت إضافة الدعم لـ [اكتشاف التحشيش في بيانات الاعتماد](../about-wallarm/credential-stuffing.md)
* ارتفعت القيمة الافتراضية لـ `SLAB_ALLOC_ARENA` إلى 2 جيجابايت
* تحسينات داخلية

### 0.10.23 (2024-03-07)

* إصلاح مشكلات مرايا http2 streams في بعض الحالات
* إصلاحات داخلية وتحسينات الاستقرار

### 0.10.22 (2024-03-01)

* [الإصدار الأول](../installation/oob/ebpf/deployment.md)

## صورة Docker المستندة على NGINX

[كيفية الترقية](docker-container.md)

### 4.10.2-1 (2024-03-08)

* تحسينات داخلية لمزيد من الثبات والأمان، بما في ذلك تحسين المزامنة بين العقدة المُصفِّية وCloud Wallarm ، ضمان سلامة المستخدم `wallarm` بواجهة shell غير تفاعلية، وغيرها من التغييرات التي لا تؤثر على التدفق الاستخدامي.
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم إصلاح التالي من الثغرات الأمنية:

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1-1 (2024-02-21)

* تم تحديث حزمة `appstructure`
* تم إصلاح التالي من الثغرات الأمنية:

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

* الإصدار الأولي 4.10، بما في ذلك التحسينات وتعزيزات الأمان لصورة Docker. [راجع سجل التغيير](what-is-new.md)

## صورة آلة أمازون (AMI)

[كيفية الترقية](cloud-image.md)

### 4.10.2-2 (2024-03-20)

* تم تقليل قيمة معامل `readahead` لـ Tarantool إلى 32KB

### 4.10.2-1 (2024-03-08)

* تحسينات داخلية لمزيد من الثبات والأمان، بما في ذلك تحسين المزامنة بين العقدة المُصفِّية وCloud Wallarm ، ضمان سلامة المستخدم `wallarm` بواجهة shell غير تفاعلية، وغيرها من التغييرات التي لا تؤثر على التدفق الاستخدامي.
* تم تحديث حزمة `appstructure`
* تم تحديث حزمة `api-firewall`
* تم إصلاح التالي من الثغرات الأمنية:

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1-2 (2024-02-21)

* تم تحديث حزمة `appstructure`
* تم إصلاح التالي من الثغرات الأمنية:

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

* الإصدار الأولي 4.10، بما في ذلك التحسينات للصورة. [راجع سجل التغيير](what-is-new.md)

## صورة منصة Google Cloud

[كيفية الترقية](cloud-image.md)

### wallarm-node-4-10-20240220-234618

* تم تحديث حزمة `appstructure`
* تم إصلاح التالي من الثغرات الأمنية:

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

* الإصدار الأولي 4.10، بما في ذلك التحسينات للصورة. [راجع سجل التغيير](what-is-new.md)