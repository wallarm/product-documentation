# قيم Wallarm الخاصة بخريطة Helm لحل eBPF من Wallarm

هذا الوثيق يقدم معلومات حول قيم خريطة Helm الخاصة بـWallarm التي يمكن تعديلها أثناء [التوظيف](deployment.md) أو ترقية حل eBPF. هذه القيم تتحكم في التكوين العام لخريطة Helm الخاصة بـWallarm eBPF.

جزء Wallarm الخاص من ملف `values.yaml` الافتراضي الذي قد تحتاج لتغييره يبدو كالتالي:

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

رمز العقدة Wallarm الذي أنشئ في وحدة تحكم Wallarm في السحابة [الأمريكية](https://us1.my.wallarm.com/nodes) أو [الأوروبية](https://my.wallarm.com/nodes). مطلوب للوصول إلى API Wallarm.

## config.api.host

نقطة نهاية API Wallarm. يمكن أن تكون:

* `us1.api.wallarm.com` للسحابة [الأمريكية](../../../about-wallarm/overview.md#us-cloud)
* `api.wallarm.com` للسحابة [الأوروبية](../../../about-wallarm/overview.md#eu-cloud) (الافتراضية)

## config.api.port

منفذ نقطة نهاية API Wallarm. بشكل افتراضي، `443`.

## config.api.useSSL

يحدد ما إذا كان سيتم استخدام SSL للوصول إلى API Wallarm. بشكل افتراضي، `true`. 

## config.agent.mirror.allNamespaces

يمكن التأمين لجميع الأسماء. القيمة الافتراضية هي `false`.

!!! تحذير "غير موصى به أن يتم ضبطه على `true`"
    تمكين هذا بضبطه على `true` يمكن أن يسبب تكرار البيانات وزيادة استخدام الموارد. يفضل [التأمين الانتقائي](selecting-packets.md) باستخدام تسميات الأسماء، تعليقات التدوين، أو `config.agent.mirror.filters` في `values.yaml`.

## config.agent.mirror.filters

يتحكم في مستوى التأمين للترافيك. إليك مثال لمعلم `filters`:

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

يحدد اسم العنوان الذي يستخدمه موازن الحمل لنقل عنوان IP الأصلي للعميل. ارجع إلى وثائق موازن الحمل الخاص بك لتحديد اسم العنوان الصحيح. بشكل افتراضي، `X-Real-IP`.

معامل `loadBalancerRealIPHeader` و `loadBalancerTrustedCIDRs` يتيحان لـWallarm eBPF تحديد عنوان IP المصدر بدقة عندما يتم توجيه الترافيك من خلال موازن حمل L7 (مثل AWS ALB) خارجي لمجموعة Kubernetes.

## config.agent.loadBalancerTrustedCIDRs

يحدد قائمة بيضاء من نطاقات CIDR لموازنات الحمل L7 الموثوقة. مثال:

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

يتحكم في تكوين [خدمة الإحصائيات](../../../admin-en/configure-statistics-service.md) لعقدة Wallarm. بشكل افتراضي، الخدمة معطلة.

إذا قمت بتمكين الخدمة، يُوصى بالاحتفاظ بالقيم الافتراضية لـ`port`، `path`، و`scrapeInterval`:

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

يتحكم في العقد Kubernetes التي يتم نشر عليها daemonSet الخاص بـWallarm eBPF. بشكل افتراضي، يتم نشرها على كل عقدة.

## تطبيق التغييرات

إذا قمت بتعديل ملف `values.yaml` وترغب في ترقية الخريطة المنتشرة لديك، استخدم الأمر التالي:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```