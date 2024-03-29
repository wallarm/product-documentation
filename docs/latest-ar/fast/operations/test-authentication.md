# تكوين مصادقة تشغيل الاختبارات

إذا كانت الطلبات الموجهة إلى تطبيقك تحتاج إلى مصادقة، فإن اختبارات الأمان تتطلب أيضًا المصادقة. توفر هذه التعليمات طريقة لتمرير بيانات الاعتماد للمصادقة بنجاح على تشغيل الاختبارات.

## طريقة تكوين مصادقة تشغيل الاختبار

لتمرير بيانات الاعتماد لمصادقة تشغيل الاختبار، قم بتنفيذ الخطوات التالية قبل [نشر](../qsg/deployment.md#4-deploy-the-fast-node-docker-container) حاوية دوكر لعقدة FAST:

1. قم بإنشاء الملف المحلي بامتداد `.yml` أو `.yaml`. على سبيل المثال: `auth_dsl.yaml`.
2. حدد معلمات المصادقة في الملف المُنشأ باستخدام لغة [FAST DSL](../dsl/intro.md) بالطريقة التالية:
    1. أضف قسم [`modify`](../dsl/phase-modify.md) إلى الملف.
    2. في قسم `modify`، حدد جزء الطلب الذي يتم فيه تمرير معلمات المصادقة. يجب تحديد جزء الطلب بصيغة [point](../dsl/points/basics.md).

        !!! info "مثال على point لمعلمة الرمز"
            إذا تم استخدام رمز للمصادقة على الطلب وتم تمرير قيمته في معلمة `token` في رأس الطلب `Cookie`، فيمكن أن يبدو الpoint مثل `HEADER_COOKIE_COOKIE_token_value`.
    
    3. حدد قيم معلمات المصادقة بالطريقة التالية:
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        لا يقتصر عدد معلمات المصادقة المستخدمة.
3. قم بتركيب المجلد الذي يحتوي على ملف `.yml`/`.yaml` في حاوية دوكر لعقدة FAST باستخدام خيار `-v {path_to_folder}:/opt/dsl_auths` عند نشر الحاوية. على سبيل المثال:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! warning "الملفات في المجلد المركب"
        يرجى ملاحظة أن المجلد المركب يجب أن يحتوي على الملف بيانات الاعتماد للمصادقة فقط.

## أمثلة على ملفات .yml/.yaml بمعلمات المصادقة المحددة

تعتمد مجموعة المعلمات المُعرفة في ملف `.yml`/`.yaml` على طريقة المصادقة المستخدمة في تطبيقك.

فيما يلي أمثلة على تحديد أكثر طرق المصادقة شيوعًا لطلبات API:

* يتم تمرير معلمات `username` و `password` في رأس الطلب `Cookie`

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* يتم تمرير معلمة `token` في رأس الطلب `Cookie`

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```