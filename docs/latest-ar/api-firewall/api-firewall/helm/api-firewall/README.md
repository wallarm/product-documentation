# تشارت Helm لجدار حماية API الخاص بـ Wallarm

يقوم هذا التشارت بتهيئة تشغيل جدار حماية API الخاص بـ Wallarm على عنقود [Kubernetes](http://kubernetes.io/) باستخدام مدير الحزم [Helm](https://helm.sh/).

هذا التشارت لم يتم رفعه إلى أي مخزن Helm عام بعد. لتشغيل تشارت Helm، يُرجى استخدام هذا المستودع.

## المتطلبات

* Kubernetes 1.16 أو أحدث
* Helm 2.16 أو أحدث

## التشغيل

لتشغيل تشارت Helm الخاص بجدار حماية API Wallarm:

1. أضف مستودعنا إذا لم تكن قد فعلت ذلك بعد:

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. احصل على آخر نسخة من تشارت helm:

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. قم بتكوين التشارت من خلال تغيير ملف `api-firewall/values.yaml` متبعًا تعليقات الكود.

4. شغل جدار حماية API الخاص بـ Wallarm من هذا التشارت Helm.

لرؤية مثال على تشغيل هذا التشارت Helm، يمكنك تشغيل [عرض Kubernetes الخاص بنا](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes).