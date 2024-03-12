# اختيار المصادر للمراقبة

حل [Wallarm eBPF](deployment.md) يعمل على مرآة المرور ويتيح التحكم في نطاق مرآة المرور. يسمح لك بإنتاج مرآة الحزم باستخدام أسماء فضاءات Kubernetes، والوحدات، والحاويات. تشرح هذه الإرشادات كيفية إدارة عملية الاختيار.

هناك عدة طرق متاحة لاختيار الحزم للمراقبة:

* تطبيق التسمية `wallarm-mirror` على فضاء الاسم لمراقبة كل حركة المرور للوحدات داخل هذا فضاء الاسم.
* تطبيق التعليق التوضيحي `mirror.wallarm.com/enabled` على وحدة محددة لمراقبة حركة المرور الخاصة بها.
* تكوين إعداد `config.agent.mirror.filters` في ملف `values.yaml` الخاص بمخطط Helm لـ Wallarm. هذا التكوين يسمح لك بتفعيل المراقبة على مستوى فضاء الاسم، والوحدة، والحاوية، أو العقدة.

## المراقبة لفضاء الاسم باستخدام التسمية

للتحكم في المراقبة على مستوى فضاء الاسم، طبق التسمية `wallarm-mirror` على فضاء الاسم Kubernetes المطلوب واضبط قيمته إما على `enabled` أو `disabled`، على سبيل المثال:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## المراقبة للوحدة باستخدام التعليق التوضيحي

للتحكم في المراقبة على مستوى الوحدة، استخدم التعليق التوضيحي `mirror.wallarm.com/enabled` واضبط قيمته إما على `true` أو `false`، على سبيل المثال:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

## المراقبة لفضاء الاسم، والوحدة، والحاوية، أو العقدة باستخدام `values.yaml`

كتلة `config.agent.mirror.filters` في ملف `values.yaml` تسمح بالتحكم الدقيق في مستويات مراقبة حركة المرور. يُمكِّن هذا النهج من التحكم في المراقبة للكيانات التالية:

* فضاء الاسم - باستخدام المعلمة `filters.namespace`
* الوحدة - باستخدام إما  `filters.pod_labels` مع تسميات الوحدة أو `filters.pod_annotations` مع التعليقات التوضيحية للوحدة
* العقدة - باستخدام المعلمة `filters.node_name`
* الحاوية - باستخدام المعلمة `filters.container_name`

### اختيار فضاء الاسم

لتفعيل مراقبة حركة المرور لفضاء الاسم محدد، حدد اسمه في المعلمة `filters.namespace`. على سبيل المثال، لتفعيل مراقبة حركة المرور لفضاء الاسم `my-namespace` على Kubernetes:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: 'my-namespace'
```

### اختيار الوحدة

يمكنك اختيار الوحدة لمراقبة حركة المرور بواسطة تسميات وتعليقات الوحدة. إليك كيفية ذلك:

=== "اختيار الوحدة بواسطة التسمية"
    لتفعيل مراقبة حركة المرور للوحدة بتسمية محددة، استخدم المعلمة `pod_labels`.
    
    على سبيل المثال، لتفعيل مراقبة حركة المرور للوحدة بتسمية `environment: production`:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
    ```

    إذا كانت هناك حاجة لعدة تسميات لتحديد الوحدة، يمكنك تحديد عدة تسميات. على سبيل المثال، يمكِّن التكوين التالي Wallarm eBPF من مراقبة وتحليل حركة المرور للوحدات التي لها تسميات `environment: production AND (team: backend OR team: ops)`:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
                team: 'backend,ops'
    ```
=== "اختيار الوحدة بواسطة التعليق التوضيحي"
    لتفعيل مراقبة حركة المرور للوحدة بتعليق توضيحي محدد، استخدم المعلمة `pod_annotations`.
    
    على سبيل المثال، لتفعيل مراقبة حركة المرور للوحدة بالتعليق التوضيحي `app.kubernetes.io/name: myapp`:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
    ```

    إذا كانت هناك حاجة لعدة تعليقات توضيحية لتحديد الوحدة، يمكنك تحديد عدة تعليقات توضيحية. على سبيل المثال، يمكِّن التكوين التالي Wallarm eBPF من مراقبة وتحليل حركة المرور للوحدات التي لها التعليقات التوضيحية التالية:
    
    ```
    app.kubernetes.io/name: myapp AND (app.kubernetes.io/instance: myapp-instance-main OR
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

### اختيار العقدة

لتفعيل مراقبة حركة المرور لعقدة Kubernetes محددة، حدد اسم العقدة في المعلمة `filters.node_name`. على سبيل المثال، لتفعيل مراقبة حركة المرور للعقدة `my-node` على Kubernetes:

```yaml
config:
  agent:
    mirror:
      filters:
        - node_name: 'my-node'
```

### اختيار الحاوية

لتفعيل مراقبة حركة المرور لحاوية Kubernetes محددة، حدد اسم الحاوية في المعلمة `filters.container_name`. على سبيل المثال، لتفعيل مراقبة حركة المرور للحاوية `my-container` على Kubernetes:

```yaml
config:
  agent:
    mirror:
      filters:
        - container_name: 'my-container'
```

### تطبيق التغييرات

إذا قمت بتعديل ملف `values.yaml` وأردت ترقية الرسم البياني الخاص بك المُنتشر، استخدم الأمر التالي:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## الأولويات بين التسميات، والتعليقات التوضيحية، والفلاتر

عند استخدام عدة طرق انتقاء وتفعيل المراقبة على مستوى أعلى، يكون لمستوى التكوين الأدنى الأسبقية.

إذا تم تعطيل المراقبة على المستوى الأعلى، فإن الإعدادات الأدنى لا يتم تطبيقها على الإطلاق، حيث يكون للمستوى الأعلى الأسبقية عند تعطيل مراقبة حركة المرور.

في حالة تحديد الكائن نفسه للمراقبة من خلال وسائل مختلفة (على سبيل المثال، باستخدام تعليق توضيحي لوحدة Wallarm وكتلة الفلاتر في ملف `values.yaml`)، يأخذ تعليق توضيحي لوحدة Wallarm الأسبقية.

## أمثلة

توفر التسميات، والتعليقات التوضيحية، والفلاتر درجة عالية من المرونة في تحديد مستوى مراقبة وتحليل حركة المرور. ومع ذلك، يمكن أن تتداخل مع بعضها البعض. إليك بعض الأمثلة على التكوينات لمساعدتك على فهم كيفية عملها معًا.

### تكوين متعدد المستويات في `values.yaml`

فكر في التكوين التالي لـ `values.yaml`:

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

يتم تطبيق الفلاتر كما يلي:

```
namespace: default OR (namespace: my-namespace AND environment: production AND (team: backend
OR team: ops) AND app.kubernetes.io/name: myapp)
```

### الخلط بين تسميات فضاء الاسم، وتعليقات الوحدة التوضيحية وفلاتر `values.yaml`

| الاعداد          | النتيجة |
| ------------- | ------ |
| <ul><li>القيمة في `values.yaml` → `config.agent.mirror.allNamespaces` مضبوطة على `true` و</li><li>تسمية فضاء الاسم هي `wallarm-mirror=disabled`</li></ul> | فضاء الاسم ليس تحت المراقبة |
| <ul><li>تسمية فضاء الاسم هي `wallarm-mirror=enabled` و</li><li>التعليق التوضيحي للوحدة هو `mirror.wallarm.com/enabled=false`</li></ul> | لا يتم مراقبة الوحدة |
| <ul><li>تسمية فضاء الاسم هي `wallarm-mirror=disabled` و</li><li>التعليق التوضيحي للوحدة هو `mirror.wallarm.com/enabled=true`، أو يتم اختيار أي إعداد آخر أدنى المستوى لمراقبة حركة المرور</li></ul> | لا يتم مراقبة الوحدة |
| <ul><li>تسمية فضاء الاسم هي `wallarm-mirror=disabled` و</li><li>فضاء الاسم نفسه مختار في `values.yaml` → `config.agent.mirror.filters`</li></ul> | فضاء الاسم ليس تحت المراقبة
| <ul><li>التعليق التوضيحي للوحدة هو `mirror.wallarm.com/enabled=false` و</li><li>الوحدة نفسها مختارة في `values.yaml` → `config.agent.mirror.filters`</li></ul> | لا يتم مراقبة الوحدة