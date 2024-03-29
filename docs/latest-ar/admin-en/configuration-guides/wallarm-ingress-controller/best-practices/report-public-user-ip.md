# التقرير الصحيح لعنوان IP العام للمستخدم النهائي (متحكم الدخول المبني على NGINX)

توضح هذه التعليمات التكوين المطلوب لمتحكم الدخول الخاص بـWallarm لتحديد عنوان IP الأصلي للعميل (المستخدم النهائي) عندما يتم وضع المتحكم خلف جهاز توازن الحمل.

افتراضيًا، يعتبر متحكم الدخول أنه معرض مباشرةً للإنترنتوأن عناوين IP للعملاء المتصلين هي عناوينهم الفعلية. ومع ذلك، يمكن تمرير الطلبات عبر جهاز توازن الحمل (مثل AWS ELB أو Google Network Load Balancer) قبل إرسالها إلى متحكم الدخول.

في الحالات التي يتم فيها وضع المتحكم خلف جهاز توازن الحمل، يعتبر متحكم الدخول أن IP جهاز توازن الحمل هو عنوان IP الحقيقي للمستخدم النهائي، ما يمكن أن يؤدي إلى [عملية غير صحيحة لبعض ميزات Wallarm](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address). للإبلاغ عن عناوين IP الصحيحة للمستخدمين النهائيين إلى متحكم الدخول، يُرجى تكوين المتحكم كما هو موضح أدناه.

## الخطوة الأولى: تمكين مرور عنوان IP الحقيقي للعميل على طبقة الشبكة

تعتمد هذه الميزة بشكل كبير على منصة السحابة المستخدمة؛ في معظم الحالات، يمكن تفعيلها بتعيين خاصية `values.yaml` `controller.service.externalTrafficPolicy` إلى القيمة `Local`:

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## الخطوة الثانية: تمكين متحكم الدخول من أخذ القيمة من رأس طلب HTTP `X-FORWARDED-FOR`

عادةً، يضيف أجهزة توازن الحمل رأس HTTP [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) الذي يحتوي على عنوان IP الأصلي للعميل. يمكنك العثور على اسم الرأس الدقيق في وثائق جهاز توازن الحمل.

يمكن لمتحكم الدخول الخاص بـWallarm أخذ عنوان IP الحقيقي للمستخدم النهائي من هذا الرأس إذا تم تكوين `values.yaml` للمتحكم كما يلي:

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [الوثائق الخاصة بمعلمة `enable-real-ip`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* في معلمة [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header)، يُرجى تحديد اسم رأس جهاز توازن الحمل الذي يحتوي على عنوان IP الأصلي للعميل

--8<-- "../include/ingress-controller-best-practices-intro.md"