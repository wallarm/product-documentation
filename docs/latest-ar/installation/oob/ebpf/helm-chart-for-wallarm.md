# القيم المحددة لـ Wallarm في جدول Wallarm eBPF Helm

يوفر هذا المستند معلومات عن قيم جدول Helm المحددة لـ Wallarm والتي يمكن تعديلها أثناء [التوزيع](deployment.md) أو تحديث حل eBPF. تتحكم هذه القيم بالتكوين العام لجدول Helm الخاص بـ Wallarm eBPF.

يظهر الجزء المحدد لـ Wallarm من ملف `values.yaml` الافتراضي الذي قد تحتاج إلى تغييره كما يلي:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
  mutualTLS: false
  agent:
    mirror:
      allNamespaces: false
      filters: []
      # - namespace: "default"
      # - namespace: 'my-namespace'
      #   pod_labels:
      #     label_name1: 'label_value_1'
      #     label_name2: 'label_value_2,label_value_3'
      #   pod_annotations:
      #      annotation_name1: 'annotation_value_1'
      #      annotation_name2: 'annotation_value_2,annotation_value_4'
    loadBalancerRealIPHeader: 'X-Real-IP'
    loadBalancerTrustedCIDRs: []
      # - 10.0.0.0/8
      # - 192.168.0.0/16
      # - 172.16.0.0/12
      # - 127.0.0.0/8
      # - fd00::/8
    ...
processing:
  ...
  metrics:
    enabled: false
    ...

  affinity: {}
  # podAntiAffinity:
  #   preferredDuringSchedulingIgnoredDuringExecution:
  #   - weight: 100
  #     podAffinityTerm:
  #       labelSelector:
  #         matchExpressions:
  #         - key: component
  #           operator: In
  #           values:
  #           - mtls-router
  #         - key: app
  #           operator: In
  #           values:
  #           - mtls-router
  #       topologyKey: kubernetes.io/hostname
  nodeSelector:
    kubernetes.io/os: linux
```

## config.api.token

رمز عُقدة Wallarm المُنشأ في لوحة تحكم Wallarm في السحابة [الأمريكية](https://us1.my.wallarm.com/nodes) أو [الأوروبية](https://my.wallarm.com/nodes). مطلوب للوصول إلى واجهة برمجة تطبيقات Wallarm.

## config.api.host

نقطة نهاية واجهة برمجة تطبيقات Wallarm. يمكن أن يكون:

* `us1.api.wallarm.com` للسحابة [الأمريكية](../../../about-wallarm/overview.md#us-cloud)
* `api.wallarm.com` للسحابة [الأوروبية](../../../about-wallarm/overview.md#eu-cloud) (الافتراضي)

## config.api.port

منفذ نقطة نهاية واجهة برمجة تطبيقات Wallarm. بشكل افتراضي، `443`.

## config.api.useSSL

يُحدد ما إذا كان سيتم استخدام SSL للوصول إلى واجهة برمجة تطبيقات Wallarm. بشكل افتراضي، `true`.

## config.mutualTLS

يُمكّن دعم mTLS، مما يسمح لـ [عقدة معالجة Wallarm](deployment.md#how-it-works) بالتحقق من أمان حركة المرور من وكيل eBPF. بشكل افتراضي، `false` (معطل).

يتم دعم البارامتر بدءًا من إصدار جدول Helm 0.10.26.

## config.agent.mirror.allNamespaces

يُمكّن تطابق حركة المرور لكل الفضاءات الاسمية. القيمة الافتراضية هي `false`.

!!! تحذير "غير موصى به الضبط على `true`"
    تمكين هذا بضبطه على `true` قد يتسبب في تكرار البيانات وزيادة استخدام الموارد. يُفضل [التطابق الانتقائي](selecting-packets.md) باستخدام تسميات الفضاءات الاسمية، تعليقات pod، أو `config.agent.mirror.filters` في `values.yaml`.

## config.agent.mirror.filters

يتحكم في مستوى تطابق حركة المرور. إليك مثال على بارامتر `filters`:

```yaml
...
  agent:
    mirror:
      allNamespaces: false
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            label_name1: 'label_value_1'
            label_name2: 'label_value_2,label_value_3'
          pod_annotations:
            annotation_name1: 'annotation_value_1'
            annotation_name2: 'annotation_value_2,annotation_value_4'
```

[المزيد من التفاصيل](selecting-packets.md)

## config.agent.loadBalancerRealIPHeader

يحدد اسم الرأس المستخدم من قِبل موازن الحمل لنقل عنوان IP الأصلي للعميل. راجع وثائق موازن الحمل الخاص بك لتحديد اسم الرأس الصحيح. بشكل افتراضي، `X-Real-IP`.

تمكّن بارامترات `loadBalancerRealIPHeader` و`loadBalancerTrustedCIDRs` Wallarm eBPF من تحديد عنوان IP المصدر بدقة عند توجيه حركة المرور من خلال موازن حمل L7 (مثل AWS ALB) خارجي إلى مجموعة Kubernetes.

## config.agent.loadBalancerTrustedCIDRs

يُحدد قائمة بيضاء من نطاقات CIDR لموازنات الحمل L7 الموثوق بها. المثال:

```yaml
config:
  agent:
    loadBalancerTrustedCIDRs:
      - 10.10.0.0/24
      - 192.168.0.0/16
```

لتحديث هذه القيم باستخدام Helm:

```
# لإضافة عنصر واحد إلى القائمة:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24'

# لإضافة عناصر متعددة إلى القائمة:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

يتحكم في تكوين [خدمة مقاييس](../../../admin-en/configure-statistics-service.md) عقدة Wallarm. بشكل افتراضي، الخدمة معطلة.

إذا قمت بتمكين الخدمة، يوصى بالاحتفاظ بالقيم الافتراضية لـ `port`، `path`، و`scrapeInterval`:

```yaml
processing:
  ...
  metrics:
    enabled: true
    port: 9090
    path: /metrics
    scrapeInterval: 30s
```

## processing.affinity وprocessing.nodeSelector

يتحكم في العُقد Kubernetes التي يتم نشر مجموعة الشياطين Wallarm eBPF عليها. بشكل افتراضي، يتم نشرها على كل عقدة.

## تطبيق التغييرات

إذا قمت بتعديل ملف `values.yaml` وتريد ترقية الجدول الموزع لديك، استخدم الأمر التالي:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```