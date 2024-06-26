# تثبيت وحدة تحكم دخول Wallarm المبنية على NGINX

تسرد هذه الدليل للتوجيه الخطوات العامة للمشكلات التي قد تواجهها أثناء [نشر وحدة تحكم دخول Wallarm المبنية على NGINX](../admin-en/installation-kubernetes-en.md). إذا لم تجد التفاصيل ذات الصلة هنا، يُرجى التواصل مع [دعم Wallarm التقني](mailto:support@wallarm.com).

## كيف يمكن التحقق من عناوين IP للعملاء التي تقوم وحدة تحكم الدخول باكتشافها/استخدامها؟

* اطلع على سجل حاوية وحدة التحكم وابحث عن سجلات الطلبات التي تم التعامل معها. في تنسيق السجل الافتراضي، الحقل الأول المُبلغ عنه هو عنوان IP للعميل المكتشف. `25.229.38.234` هو عنوان IP المكتشف في المثال أدناه:
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f
```

* اذهب إلى وحدة تحكم Wallarm الخاصة بك للسحابة [الأمريكية](https://us1.my.wallarm.com) أو للسحابة [الأوروبية](https://my.wallarm.com) → قسم **الهجمات** وتوسع تفاصيل الطلب. يتم عرض عنوان IP في حقل *المصدر*. على سبيل المثال:

    ![عنوان IP الذي تم إرسال الطلب منه](../images/request-ip-address.png)

    إذا كانت قائمة الهجمات فارغة، يمكنك إرسال [هجوم اختبار](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) إلى التطبيق المحمي بواسطة وحدة تحكم دخول Wallarm.
    
## كيف يمكن التحقق من استقبال وحدة تحكم الدخول لرأس الطلب X-FORWARDED-FOR؟

يرجى الذهاب إلى وحدة تحكم Wallarm للسحابة [الأمريكية](https://us1.my.wallarm.com) أو للسحابة [الأوروبية](https://my.wallarm.com) → قسم **الهجمات** وتوسيع تفاصيل الطلب. في تفاصيل الطلب المعروضة، انتبه إلى رأس `X-FORWARDED-FOR`. على سبيل المثال:

![رأس X-FORWARDED-FOR للطلب](../images/x-forwarded-for-header.png)

إذا كانت قائمة الهجمات فارغة، يمكنك إرسال [هجوم اختبار](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) إلى التطبيق المحمي بواسطة وحدة تحكم دخول Wallarm.