# ضبط توثيق جلسات الاختبار

إذا كانت الطلبات إلى تطبيقك تحتاج إلى توثيق، فإن الاختبارات الأمنية تحتاج إلى توثيق أيضاً. تقدم هذه التعليمات الطريقة لإرسال بيانات الاعتماد لتوثيق جلسات الاختبار بنجاح.

## طريقة ضبط توثيق جلسات الاختبار

لإرسال بيانات الاعتماد لتوثيق جلسة الاختبار، قم بتنفيذ الخطوات التالية قبل [نشر](../qsg/deployment.md#4-deploy-the-fast-node-docker-container) حاوية Docker لعقدة FAST:

1. أنشئ الملف المحلي بامتداد `.yml` أو `.yaml`. على سبيل المثال: `auth_dsl.yaml`.
2. حدد معلمات التوثيق في الملف المُنشأ باستخدام تركيب لغة [FAST DSL](../dsl/intro.md) بالطريقة التالية:
    1. أضف قسم [`modify`](../dsl/phase-modify.md) إلى الملف.
    2. في قسم `modify`، حدد جزء الطلب الذي يتم فيه تمرير معلومات التوثيق. يجب أن يتم تحديد جزء الطلب بتنسيق [نقطة](../dsl/points/basics.md).

        !!! info "مثال على نقطة لمعامل token"
            إذا كان يتم استخدام الرمز لتوثيق الطلب وتمرير قيمته في معامل `token` في رأس الطلب `Cookie`، فقد تبدو النقطة كالتالي `HEADER_COOKIE_COOKIE_token_value`.
    
    3. حدد قيم معلمات التوثيق بالطريقة التالية:
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        عدد معلمات التوثيق المستخدمة غير محدود.
3. قم بتثبيت دليل الملف بامتداد `.yml`/`.yaml` داخل حاوية Docker لعقدة FAST باستخدام خيار `-v {مسار_المجلد}:/opt/dsl_auths` عند نشر الحاوية. على سبيل المثال:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! warning "ملفات في الدليل المُثبت"
        يرجى ملاحظة أن الدليل المُثبت يجب أن يحتوي فقط على الملف ببيانات التوثيق.

## أمثلة على ملفات .yml/.yaml بمعلمات توثيق محددة

يعتمد مجموعة المعلمات المحددة في ملف `.yml`/`.yaml` على طريقة التوثيق المستخدمة في تطبيقك.

فيما يلي أمثلة على تحديد أكثر طرق توثيق طلبات الـAPI شيوعًا:

* يتم تمرير معلمات `username` و `password` في رأس الطلب `Cookie`

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* يتم تمرير معلم `token` في رأس الطلب `Cookie`

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```