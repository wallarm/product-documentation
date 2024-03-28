# قيم محددة لـ Wallarm في مخطط Helm لـ Wallarm eBPF

يوفر هذا الوثيقة معلومات حول قيم مخطط Helm الخاص بـ Wallarm التي يمكن تعديلها أثناء [النشر](deployment.md) أو الترقية للحل eBPF. تتحكم هذه القيم بالتكوين العام لمخطط Helm الخاص بـ Wallarm eBPF.

جزء محدد لـ Wallarm من ملف `values.yaml` الافتراضي الذي قد تحتاج إلى تغييره يبدو كالتالي:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
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

رمز العقدة الخاصة بـ Wallarm المُنشأ في وحدة التحكم Wallarm في [الولايات المتحدة](https://us1.my.wallarm.com/nodes) أو [الاتحاد الأوروبي](https://my.wallarm.com/nodes) Cloud. مطلوب للوصول إلى API الخاصة بـ Wallarm.

## config.api.host

نقطة نهاية API الخاصة بـ Wallarm. يمكن أن تكون:

* `us1.api.wallarm.com` لـ[الغيمة الأمريكية](../../../about-wallarm/overview.md#us-cloud)
* `api.wallarm.com` لـ[الغيمة الأوروبية](../../../about-wallarm/overview.md#eu-cloud) (الافتراضي)

## config.api.port

منفذ نقطة نهاية API الخاصة بـ Wallarm. بشكل افتراضي، `443`.

## config.api.useSSL

تحديد ما إذا كان سيتم استخدام SSL للوصول إلى API الخاصة بـ Wallarm. بشكل افتراضي،`true`.

## config.agent.mirror.allNamespaces

تفعيل تقليد حركة المرور لجميع المساحات الاسمية. القيمة الافتراضية هي `false`.

!!! تحذير "غير موصى به أن يضبط على `true`"
    تفعيل هذا بضبطه على `true` قد يتسبب في تكرار البيانات وزيادة استخدام الموارد. يفضل [تقليد انتقائي](selecting-packets.md) باستخدام تصنيفات المساحات الاسمية، تعليقات الـ pod، أو `config.agent.mirror.filters` في `values.yaml`.

## config.agent.mirror.filters

يتحكم بمستوى تقليد حركة المرور. إليك مثال على البارامتر `filters`:

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

يحدد اسم الرأسية التي يستخدمها موزع الحمل لنقل عنوان IP الأصلي للعميل. راجع وثائق موزع الحمل الخاص بك لتحديد الاسم الصحيح للرأسية. بشكل افتراضي، `X-Real-IP`.

تمكن البارامتران `loadBalancerRealIPHeader` و `loadBalancerTrustedCIDRs` Wallarm eBPF من تحديد عنوان IP المصدر بدقة عند توجيه حركة المرور من خلال موزع حمل L7 (مثل AWS ALB) خارجي لمجموعة Kubernetes.

## config.agent.loadBalancerTrustedCIDRs

يحدد قائمة بيضاء لنطاقات CIDR لموزعات الحمل L7 الموثوق بها. مثال:

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

# لإضافة عدة عناصر إلى القائمة:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

يتحكم بتكوين خدمة [القياسات](../../../admin-en/configure-statistics-service.md) لعقدة Wallarm. بشكل افتراضي، الخدمة معطلة.

إذا قمت بتمكين الخدمة، يُنصح بالاحتفاظ بالقيم الافتراضية لـ `port`، `path`، و `scrapeInterval`:

```yaml
processing:
  ...
  metrics:
    enabled: true
    port: 9090
    path: /metrics
    scrapeInterval: 30s
```

## processing.affinity و processing.nodeSelector

يتحكم بالعقد Kubernetes التي يُنشر عليها مجموعة الدايمون Wallarm eBPF. بشكل افتراضي، يتم النشر على كل عقدة.

## تطبيق التغييرات

إذا قمت بتعديل ملف `values.yaml` وترغب في ترقية مخططك المنشور، استخدم الأمر التالي:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```