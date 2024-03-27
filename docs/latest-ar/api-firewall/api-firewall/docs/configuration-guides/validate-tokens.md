# التحقق من صحة رموز المصادقة للطلبات

عند استخدام OAuth 2.0 للمصادقة، يمكن ضبط جدار الحماية الخاص بالواجهة البرمجية للتطبيقات للتحقق من صحة رموز الدخول قبل توجيه الطلبات إلى خادم التطبيق الخاص بك. يتوقع جدار الحماية الرمز في رأس الطلب `Authorization: Bearer`.

يعتبر جدار الحماية الرمز صالحًا إذا كانت النطاقات المحددة في [المواصفات](https://swagger.io/docs/specification/authentication/oauth2/) وفي معلومات الرمز الوصفية متطابقة. إذا كانت قيمة `APIFW_REQUEST_VALIDATION` هي `BLOCK`، يقوم جدار الحماية بحظر الطلبات ذات الرموز الغير صالحة. في وضع `LOG_ONLY`، يتم تسجيل الطلبات ذات الرموز الغير صالحة فقط.

!!! info "توافر الميزة"
    هذه الميزة متاحة فقط عند تشغيل جدار الحماية الخاص بالواجهة البرمجية للتطبيقات لتصفية طلبات [REST API](../installation-guides/docker-container.md).

لضبط سير عمل التحقق من صحة رمز OAuth 2.0، استخدم المتغيرات البيئية التالية:

| المتغير البيئي | الوصف |
| -------------------- | ----------- |
| `APIFW_SERVER_OAUTH_VALIDATION_TYPE` | نوع التحقق من صحة رمز المصادقة:<ul><li>`JWT` إذا كنت تستخدم JWT لمصادقة الطلب. قم بإجراء المزيد من الضبط من خلال المتغيرات `APIFW_SERVER_OAUTH_JWT_*`.</li><li>`INTROSPECTION` إذا كنت تستخدم أنواع رموز أخرى يمكن التحقق من صحتها بواسطة خدمة تفتيش الرمز محددة. قم بإجراء المزيد من الضبط من خلال المتغيرات `APIFW_SERVER_OAUTH_INTROSPECTION_*`.</li></ul> |
| `APIFW_SERVER_OAUTH_JWT_SIGNATURE_ALGORITHM` | الخوارزمية المستخدمة لتوقيع JWTs: `RS256`، `RS384`، `RS512`، `HS256`، `HS384` أو `HS512`.<br><br>لا يمكن التحقق من صحة JWTs الموقعة باستخدام خوارزمية `ECDSA` بواسطة جدار الحماية. |
| `APIFW_SERVER_OAUTH_JWT_PUB_CERT_FILE` | إذا تم توقيع JWTs باستخدام خوارزمية RS256، RS384 أو RS512، مسار الملف الذي يحتوي على المفتاح العام لـ RSA (`*.pem`). يجب تركيب هذا الملف إلى حاوية Docker الخاصة بجدار الحماية. |
| `APIFW_SERVER_OAUTH_JWT_SECRET_KEY` | إذا تم توقيع JWTs باستخدام خوارزمية HS256، HS384 أو HS512، قيمة المفتاح السري المستخدمة لتوقيع JWTs. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT` | [نقطة نهاية تفتيش الرمز](https://www.oauth.com/oauth2-servers/token-introspection-endpoint/). أمثلة على النقاط:<ul><li>`https://www.googleapis.com/oauth2/v1/tokeninfo` إذا كنت تستخدم جوجل OAuth</li><li>`http://sample.com/restv1/introspection` لرموز Gluu OAuth 2.0</li></ul> |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD` | طريقة الطلبات إلى نقطة نهاية تفتيش الرمز. يمكن أن تكون `GET` أو `POST`.<br><br>القيمة الافتراضية هي `GET`. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_TOKEN_PARAM_NAME` | اسم المعلم مع قيمة الرمز في الطلبات إلى نقطة نهاية التفتيش. حسب قيمة `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD`، يعتبر جدار الحماية الخاص بالواجهة البرمجية للتطبيقات المعلم تلقائيًا إما على أنه المعلم الاستعلام أو معلم الجسم. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_CLIENT_AUTH_BEARER_TOKEN` | قيمة الرمز Bearer لمصادقة الطلبات إلى نقطة نهاية التفتيش. |
| <a name="apifw-server-oauth-introspection-content-type"></a>`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE` | قيمة رأس `Content-Type` التي تشير إلى نوع وسائط خدمة تفتيش الرمز. القيمة الافتراضية هي `application/octet-stream`. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_REFRESH_INTERVAL` | وقت الحياة لبيانات وصف الرمز المخبأة. يقوم جدار الحماية بتخبئة بيانات الرمز الوصفية وإذا كان يتلقى طلبات ذات نفس الرموز، يحصل على بياناتها الوصفية من الذاكرة المخبأة.<br><br>يمكن ضبط الفترة بالساعات (`h`)، الدقائق (`m`)، الثواني (`s`) أو بالتنسيق المركب (مثل `1h10m50s`).<br><br>القيمة الافتراضية هي `10m` (10 دقائق).  