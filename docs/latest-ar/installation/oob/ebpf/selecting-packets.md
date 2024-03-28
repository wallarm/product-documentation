# اختيار المصادر للمرآة

تعمل [حلول Wallarm eBPF](deployment.md) على مرآة المرور وتوفر السيطرة على نطاق مرآة المرور. تسمح لك بإنتاج مرآة الحزم بواسطة أسماء فضاءات Kubernetes والبودات والحاويات. يشرح هذا الدليل كيفية إدارة عملية الاختيار.

هناك عدة طرق متاحة لاختيار الحزم للمرآة:

* تطبيق الوسم `wallarm-mirror` على فضاء اسم لمرآة كل حركة المرور للبودات داخل هذا الفضاء.
* تطبيق الوسم `mirror.wallarm.com/enabled` على بود معين لمرآة حركة المرور الخاصة به.
* تكوين الإعداد `config.agent.mirror.filters` في ملف `values.yaml` لمخطط Helm الخاص بWallarm. يسمح هذا الإعداد بتمكين المرآة على مستويات فضاء الاسم والبود والحاوية أو العقدة.

## المرآة لفضاء اسم باستخدام الوسم

للتحكم في المرآة على مستوى فضاء الاسم، طبق وسم `wallarm-mirror` على فضاء الاسم Kubernetes المطلوب واضبط قيمته إما على `enabled` أو `disabled`، مثلاً:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## المرآة لبود باستخدام الوسم

للتحكم في المرآة على مستوى البود، استخدم الوسم `mirror.wallarm.com/enabled` واضبط قيمته إما على `true` أو `false`، مثلاً:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

## المرآة لفضاء اسم، بود، حاوية، أو عقدة باستخدام `values.yaml`

يسمح القسم `config.agent.mirror.filters` في ملف `values.yaml` بالتحكم الدقيق في مستويات المرآة لحركة المرور. يمكّن هذا النهج من التحكم في المرآة للكيانات التالية:

* فضاء الاسم - باستخدام المعلم `filters.namespace`
* البود - باستخدام إما `filters.pod_labels` مع وسوم البود أو `filters.pod_annotations` مع وسوم البود
* العقدة - باستخدام المعلم `filters.node_name`
* الحاوية - باستخدام المعلم `filters.container_name`

### اختيار فضاء اسم

لتمكين المرآة لحركة المرور لفضاء اسم معين، حدد اسمه في المعلم `filters.namespace`. على سبيل المثال، لتمكين المرآة لحركة المرور لفضاء اسم Kubernetes `my-namespace`:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: 'my-namespace'
```

### اختيار بود

يمكنك اختيار بود لمرآة حركة المرور من خلال وسوم ووسوم توضيحية للبود. وإليك كيفية القيام بذلك:

=== "اختيار بود بوسم"
    لتمكين المرآة لحركة المرور لبود يحمل وسم معين، استخدم المعلم `pod_labels`.
    
    على سبيل المثال، لتمكين المرآة لحركة المرور لبود يحمل وسم `environment: production`:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
    ```

    إذا كانت هناك حاجة لعدة وسوم لتحديد البود، يمكنك تحديد عدة وسوم. على سبيل المثال، يتيح الإعداد التالي للـ Wallarm eBPF مرآة وتحليل حركة المرور للبودات التي تحمل وسوم `environment: production و(team: backend أو team: ops)`:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
                team: 'backend,ops'
    ```
=== "اختيار بود بوسم توضيحي"
    لتمكين المرآة لحركة المرور لبود يحمل وسم توضيحي معين، استخدم المعلم `pod_annotations`.
    
    على سبيل المثال، لتمكين المرآة لحركة المرور لبود يحمل الوسم التوضيحي `app.kubernetes.io/name: myapp`:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
    ```

    إذا كانت هناك حاجة لعدة وسوم توضيحية لتحديد البود، يمكنك تحديد عدة وسوم توضيحية. على سبيل المثال، يتيح الإعداد التالي للـ Wallarm eBPF مرآة وتحليل حركة المرور للبودات التي تحمل وسوم توضيحية التالية:
    
    ```
    app.kubernetes.io/name: myapp و(app.kubernetes.io/instance: myapp-instance-main أو
    app.kubernetes.io/instance: myapp-instance-reserve)
    ```

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
                app.kubernetes.io/instance: 'myapp-instance-main,myapp-instance-reserve'
    ```

### اختيار عقدة

لتمكين المرآة لحركة المرور لعقدة Kubernetes معينة، حدد اسم العقدة في المعلم `filters.node_name`. على سبيل المثال، لتمكين المرآة لحركة المرور للعقدة `my-node` في Kubernetes:

```yaml
config:
  agent:
    mirror:
      filters:
        - node_name: 'my-node'
```

### اختيار حاوية

لتمكين المرآة لحركة المرور لحاوية Kubernetes معينة، حدد اسم الحاوية في المعلم `filters.container_name`. على سبيل المثال، لتمكين المرآة لحركة المرور للحاوية `my-container` في Kubernetes:

```yaml
config:
  agent:
    mirror:
      filters:
        - container_name: 'my-container'
```

### تطبيق التغييرات

إذا قمت بتعديل ملف `values.yaml` وأردت ترقية مخططك المنشور، استخدم الأمر التالي:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## الأولويات بين الوسوم والوسوم التوضيحية والمرشحات

عند استخدام طرق اختيار متعددة وتمكين المرآة على مستوى أعلى، يأخذ المستوى الأقل تكويناً الأسبقية.

إذا تم تعطيل المرآة على المستوى الأعلى، لا يتم تطبيق الإعدادات الأدنى منه على الإطلاق، حيث يكون للمستوى الأعلى الأولوية عند تعطيل المرآة لحركة المرور.

في حالة تحديد نفس الكائن للمرآة من خلال وسائل مختلفة (على سبيل المثال، باستخدام وسم بود Wallarm وقسم `filters` في ملف `values.yaml`)، يأخذ وسم بود Wallarm الأسبقية.

## أمثلة

توفر الوسوم والوسوم التوضيحية والمرشحات درجة عالية من المرونة في تحديد مستوى المرآة وتحليل حركة المرور. ومع ذلك، يمكن أن تتداخل مع بعضها البعض. إليك بعض أمثلة التكوين لمساعدتك على فهم كيفية عملها معًا.

### تكوين متعدد المستويات في `values.yaml`

فكر في التكوين `values.yaml` التالي:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            environment: 'production'
            team: 'backend,ops'
          pod_annotations:
            app.kubernetes.io/name: 'myapp'
```

يتم تطبيق المرشحات كما يلي:

```
namespace: default أو(namespace: my-namespace وenvironment: production و(team: backend
أو team: ops) وapp.kubernetes.io/name: myapp)
```

### دمج وسوم فضاء الاسم، ووسوم توضيحية البود، ومرشحات `values.yaml`

| التكوين | النتيجة |
| ------------- | ------ |
| <ul><li>القيمة في `values.yaml` → `config.agent.mirror.allNamespaces` تم ضبطها على `true` و</li><li>وسم فضاء الاسم هو `wallarm-mirror=disabled`</li></ul> | لا يتم مرآة فضاء الاسم |
| <ul><li>وسم فضاء الاسم هو `wallarm-mirror=enabled` و</li><li>الوسم التوضيحي للبود هو `mirror.wallarm.com/enabled=false`</li></ul> | لا يتم مرآة البود |
| <ul><li>وسم فضاء الاسم هو `wallarm-mirror=disabled` و</li><li>الوسم التوضيحي للبود هو `mirror.wallarm.com/enabled=true`، أو أي إعداد آخر منخفض المستوى مختار للمرآة لحركة المرور</li></ul> | لا يتم مرآة البود |
| <ul><li>وسم فضاء الاسم هو `wallarm-mirror=disabled` و</li><li>يتم اختيار نفس فضاء الاسم في `values.yaml` → `config.agent.mirror.filters`</li></ul> | لا يتم مرآة فضاء الاسم
| <ul><li>الوسم التوضيحي للبود هو `mirror.wallarm.com/enabled=false` و</li><li>يتم اختيار نفس البود في `values.yaml` → `config.agent.mirror.filters`</li></ul> | لا يتم مرآة البود