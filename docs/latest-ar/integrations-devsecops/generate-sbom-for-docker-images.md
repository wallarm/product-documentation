# إنشاء قائمة بمكونات البرامج لصور دوكر الخاصة بوالارم

قائمة بمكونات البرامج (SBOM) هي قائمة جرد تعدد مكونات البرمجيات وتبعياتها في تطبيق، بما في ذلك الإصدارات، والتراخيص، والثغرات الأمنية. يرشدك هذا المقال على كيفية إنشاء SBOM لصور دوكر الخاصة بوالارم.

قد تحتاج إلى الحصول على SBOM لصور دوكر الخاصة بوالارم لتقييم وتخفيف المخاطر الأمنية المحتملة المرتبطة بالتبعيات المستخدمة في الصور. توفر SBOM شفافية في مكونات البرمجيات وتساعد على ضمان الامتثال.

## قائمة صور دوكر الخاصة بوالارم

أدناه قائمة [الموقعة](verify-docker-image-signature.md) من صور دوكر الخاصة بوالارم. يمكنك إنشاء SBOM لأي علامة من هذه الصور.

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 وما فوق: [صورة دوكر المعتمدة على NGINX](../admin-en/installation-docker-en.md) التي تتضمن جميع وحدات والارم، بمثابة قطعة منفصلة لنشر والارم
* كل صور دوكر المستخدمة بواسطة مخطط هيلم لنشر [NGINX-based Ingress Controller](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* كل صور دوكر المستخدمة بواسطة مخطط هيلم لنشر [Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## المتطلبات

لإنشاء SBOM لصور دوكر الخاصة بوالارم، ستحتاج إلى استخدام أداة سطر الأوامر [syft](https://github.com/anchore/syft).

قبل المتابعة في إنشاء SBOM، تأكد من [تثبيت](https://github.com/anchore/syft#installation) **syft** على جهازك المحلي أو ضمن عملية البناء/التوزيع المستمر الخاصة بك.

## إجراء إنشاء SBOM

لإنشاء SBOM لصورة دوكر، استخدم الأمر التالي، بتبديل علامة الصورة المحددة بالعلامة المرغوبة:

```bash
syft wallarm/ingress-controller:4.6.2-1
```

بشكل افتراضي، تعيد **syft** SBOM بتنسيق نصي. يمكنك أيضًا إنشاؤها بتنسيقات أخرى مثل CycloneDX، SPDX، وحفظ الناتج في ملف، على سبيل المثال:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

بعد إنشاء SBOM، يمكنك استخدامها ضمن عملية البناء/التوزيع المستمر الخاصة بك لأفعال متنوعة، مثل فحص الثغرات الأمنية، التحقق من التزام التراخيص، التدقيقات الأمنية، أو إنشاء التقارير.

للتحقق من أن جميع التبعيات تنتمي فعلاً إلى والارم، يمكنك ببساطة [فحص توقيع الصورة](verify-docker-image-signature.md) ككل. من خلال التوقيع الرقمي على صورنا، نضمن أن الصورة الموقعة هي بالفعل لنا. نتيجة لذلك، تمتد هذه الضمانة إلى SBOM، كونها سترتبط بصورة والارم الموثقة.