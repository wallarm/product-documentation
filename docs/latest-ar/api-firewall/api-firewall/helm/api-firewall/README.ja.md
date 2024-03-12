# Wallarm API Firewall لـ Helm Charts

هذا الجدول يُستخدم لتهيئة نشر Wallarm API Firewall على مجموعات Kubernetes باستخدام مدير الحزم [Helm](https://helm.sh/).

هذا الجدول لم يتم رفعه بعد إلى مخزن Helm العام. يُرجى استخدام هذا المستودع لنشر جدول Helm.

## الشروط المطلوبة

* Kubernetes 1.16 أو أحدث
* Helm 2.16 أو أحدث

## النشر

لنشر جدول Helm لـ Wallarm API Firewall:

1. إذا لم تكن قد أضفت المستودع بعد، يُرجى إضافته:

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. احصل على أحدث نسخة من جدول helm:

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. تابع تعليمات التعليق بالكود، وعدّل ملف `api-firewall/values.yaml` لتهيئة الجدول.

4. نشر Wallarm API Firewall من هذا الجدول Helm.

إذا كنت ترغب في معرفة مثال على نشر هذا الجدول Helm، يمكنك تشغيل عرضنا التوضيحي على [Kubernetes](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes).