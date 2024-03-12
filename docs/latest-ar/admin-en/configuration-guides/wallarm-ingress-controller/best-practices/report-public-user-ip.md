# تقرير صحيح لعنوان IP العام للمستخدم النهائي (وحدة تحكم Ingress المستندة إلى NGINX)

تصف هذه التعليمات تكوين وحدة تحكم Wallarm Ingress المطلوب لتحديد عنوان IP الأصلي لعميل (المستخدم النهائي) عند وضع وحدة التحكم خلف موازن التحميل.

بشكل افتراضي، تفترض وحدة التحكم Ingress أنها معرضة مباشرة للإنترنت وأن عناوين IP للعملاء المتصلين هي عناوينهم الفعلية. ومع ذلك، يمكن أن تمر الطلبات عبر موازن التحميل (مثل AWS ELB أو Google Network Load Balancer) قبل إرسالها إلى وحدة التحكم Ingress.

في المواقف التي يتم فيها وضع وحدة التحكم خلف موازن التحميل، تعتبر وحدة التحكم Ingress أن IP موازن التحميل هو IP العميل النهائي الحقيقي، والذي يمكن أن يؤدي إلى [تشغيل غير صحيح لبعض ميزات Wallarm](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address). للإبلاغ عن عناوين IP الصحيحة للمستخدمين النهائيين إلى وحدة التحكم Ingress، يرجى تكوين وحدة التحكم كما هو موضح أدناه.

## الخطوة 1: تمكين تمرير عنوان IP الحقيقي للعميل على طبقة الشبكة

تعتمد هذه الميزة بشكل كبير على منصة السحابة المستخدمة؛ في غالبية الحالات، يمكن تفعيلها بتعيين خاصية الملف `values.yaml` `controller.service.externalTrafficPolicy` إلى القيمة `Local`:

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## الخطوة 2: تمكين وحدة التحكم Ingress لأخذ القيمة من رأس طلب HTTP X-FORWARDED-FOR

عادة، تقوم موازنات التحميل بإضافة الرأس HTTP [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) الذي يحتوي على عنوان IP الأصلي للعميل. يمكنك العثور على اسم الرأس الدقيق في وثائق موازن التحميل.

يمكن لوحدة تحكم Wallarm Ingress أخذ عنوان IP الحقيقي للمستخدم النهائي من هذا الرأس إذا تم تكوين `values.yaml` الخاص بوحدة التحكم على النحو التالي:

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [الوثائق حول معلمة `enable-real-ip`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* في معلمة [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header)، يرجى تحديد اسم رأس موازن التحميل الذي يحتوي على عنوان IP الأصلي للعميل