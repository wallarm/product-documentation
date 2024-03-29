# إنشاء فاتورة بيان لمواد البرمجيات لصور Docker الخاصة بـWallarm

فاتورة بيان لمواد البرمجيات (SBOM) هي قائمة تتضمن مكونات البرمجيات واعتماداتها في تطبيق ما، بما في ذلك الإصدارات، والتراخيص، والثغرات الأمنية. هذه المقالة توجهك إلى كيفية إنشاء SBOM لصور Docker الخاصة بـWallarm.

قد تحتاج إلى الحصول على SBOM لصور Docker الخاصة بـWallarm لتقييم والتخفيف من المخاطر الأمنية المحتملة المرتبطة بالاعتمادات المستخدمة في الصور. وتوفر SBOM الشفافية فيما يتعلق بمكونات البرمجيات وتساعد على ضمان الامتثال.

## قائمة بصور Docker الخاصة بـWallarm

فيما يلي قائمة بصور Docker الخاصة بـWallarm الموقعة. يمكنك إنشاء SBOM لأي علامة من هذه الصور:

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 وما فوق: [صورة Docker المستندة إلى NGINX](../admin-en/installation-docker-en.md) التي تتضمن جميع وحدات Wallarm، بمثابة قطعة مستقلة لتنصيب Wallarm
* جميع صور Docker المستخدمة بواسطة مخطط Helm ل[تنصيب NGINX-based Ingress Controller](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* جميع صور Docker المستخدمة بواسطة مخطط Helm ل[تنصيب Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## متطلبات

لإنشاء SBOM لصور Docker الخاصة بـWallarm، ستحتاج إلى استخدام أداة CLI لـ[syft](https://github.com/anchore/syft).

قبل المتابعة في إنشاء SBOM، تأكد من [تثبيت](https://github.com/anchore/syft#installation) **syft** على جهازك المحلي أو ضمن سلسلة أدوات CI/CD الخاصة بك.

## إجراء إنشاء SBOM

لإنشاء SBOM لصورة Docker، استخدم الأمر التالي، مع استبدال علامة الصورة المحددة بالعلامة المرغوبة:

```bash
syft wallarm/ingress-controller:4.6.2-1
```

بشكل افتراضي، **syft** يعيد SBOM بصيغة نصية. يمكنك أيضًا إنشائه بصيغ أخرى مثل CycloneDX، SPDX، وحفظ الناتج إلى ملف، على سبيل المثال:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

بعد إنشاء SBOM، يمكنك الاستفادة منه ضمن سلسلة أدوات CI/CD الخاصة بك لإجراءات متنوعة، مثل فحص الثغرات الأمنية، التحقق من الامتثال للتراخيص، التدقيقات الأمنية، أو إنشاء تقارير.

للتحقق من أن جميع الاعتمادات تعود فعليًا إلى Wallarm، يمكنك ببساطة [التحقق من توقيع الصورة](verify-docker-image-signature.md) ككل. من خلال التوقيع الرقمي على صورنا، نضمن أن الصورة الموقعة هي بالفعل لنا. بناءً عليه، تمتد هذه الضمانة إلى SBOM، حيث سيتم ارتباطها بصورة Wallarm الموثقة.