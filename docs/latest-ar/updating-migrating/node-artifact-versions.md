# جرد لإصدارات القطعة المادية

تقدم هذه المستندات قائمة بـ [إصدارات الرقعة](versioning-policy.md#version-format) المتاحة للعقدة Wallarm 4.10 في أشكال مختلفة. يمكنك تتبع إصدارات الرقعة الجديدة وتخطيط التحديثات المناسبة بناءً على هذا المستند.

## المثبت الشامل

تاريخ التحديثات ينطبق على نسخ x86_64 و ARM64 (بيتا) من [المثبت الشامل](../installation/nginx/all-in-one.md) في نفس الوقت.

[كيفية الترحيل من حزم DEB/RPM](nginx-modules.md)

[كيفية الترحيل من الإصدار السابق للمثبت الشامل](all-in-one.md)

### 4.10.1 (2024-02-21)

* تم إصلاح المشكلة التي كانت تعتبر بالخطأ الملفات المخصصة الجزئيا مصادقة عليها ككاملة. تم تنفيذ التنزيل التجزئي لمعالجة هذه المشكلة
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

* الإصدارة الأولى 4.10، [انظر سجل التغيير](what-is-new.md)

## الرسم البياني لـ Helm لوحدة التحكم Wallarm NGINX Ingress

[كيفية الترقية](ingress-controller.md)

### 4.10.2 (2024-02-21)

* استعادة OpenTracing

### 4.10.1 (2024-02-21)

* تم تحديث حزمة `appstructure`
* التحسينات والتعديلات الداخلية:
    
    * تم تنفيذ التسميات والتعليقات التوضيحية لوحدة Tarantool
    * التحول إلى supervisord
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

* الإصدارة الأولى 4.10، [انظر سجل التغيير](what-is-new.md)

## الرسم البياني لـ Helm لحل Wallarm المبني على eBPF

### 0.10.23 (2024-03-07)

* تم إصلاح مشكلات تطابق تيارات http2 في بعض الحالات
* عمليات تحسينات وإصلاحات داخلية

### 0.10.22 (2024-03-01)

* [الإصدارة الأولى](../installation/oob/ebpf/deployment.md)

## الصورة Docker المستندة على NGINX

[كيفية الترقية](docker-container.md)

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

* الإصدارة الأولى 4.10، بما في ذلك التحسينات وتعزيزات الأمان للصورة Docker. [انظر سجل التغيير](what-is-new.md)

## صورة الجهاز الأمازون (AMI)

[كيفية التشغيل](cloud-image.md)

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

* الإصدارة الأولى 4.10، بما في ذلك التحسينات للصورة. [انظر سجل التغيير](what-is-new.md)

## صورة منصة جوجل السحابية

[كيفية التشغيل](cloud-image.md)

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

* الإصدارة الأولى 4.10، بما في ذلك التحسينات للصورة. [انظر سجل التغيير](what-is-new.md)