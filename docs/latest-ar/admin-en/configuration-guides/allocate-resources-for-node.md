# تخصيص الموارد لنود Wallarm

كمية الذاكرة وموارد المعالج المخصصة لنود التصفية تحدد جودة وسرعة معالجة الطلبات. تصف هذه التعليمات التوصيات لتخصيص ذاكرة نود التصفية.

في نود التصفية يوجد اثنان من العناصر الرئيسية المستهلكة للذاكرة والمعالج:

* [تارانتول](#tarantool)، المعروف أيضًا ب**وحدة ما بعد التحليلات**. هذا هو باك إند تحليلات البيانات المحلي والمستهلك الرئيسي للذاكرة في نود التصفية.
* [NGINX](#nginx) هو العنصر الرئيسي في نود التصفية ومكون الوكيل العكسي.

استهلاك المعالج ل NGINX يعتمد على العديد من العوامل مثل مستوى RPS، متوسط حجم الطلب والاستجابة، عدد قواعد مجموعة القوانين المخصصة المُدارة بواسطة النود، الأنواع والطبقات للتشفيرات البيانية المستخدمة مثل Base64 أو ضغط البيانات، إلخ.

بشكل عام، يمكن لنواة واحدة من المعالج التعامل مع حوالي 500 RPS. عند التشغيل في وضع الإنتاج، يُنصح بتخصيص نواة واحدة على الأقل لعملية NGINX ونواة واحدة لعملية تارانتول. في معظم الحالات، يُوصى بتخصيص موارد أكثر مما هو مطلوب لنود التصفية بشكل أولي، رؤية استخدام المعالج والذاكرة الفعلية لمستويات حركة المرور الإنتاجية الحقيقية، وتقليل الموارد المخصصة تدريجياً إلى مستوى معقول (مع وجود مساحة احتياطية لا تقل عن 2x لزيادة حركة المرور وتكرار النود).

## تارانتول

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### تخصيص الموارد في متحكم الدخول ل Kubernetes

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### تخصيص الموارد عند استخدام المثبت الشامل

يتم التحكم في حجم ذاكرة تارانتول باستخدام سمة `SLAB_ALLOC_ARENA` في ملف التكوين `/opt/wallarm/env.list`. لتخصيص الذاكرة:

1. افتح ملف `/opt/wallarm/env.list` للتحرير:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. اضبط سمة `SLAB_ALLOC_ARENA` على حجم الذاكرة. يمكن أن تكون القيمة عدد صحيح أو عائم (نقطة `.` هي فاصل عشري). على سبيل المثال:

    ```
    SLAB_ALLOC_ARENA=1.0
    ```
1. أعد تشغيل خدمات Wallarm:

    ```
    sudo systemctl restart wallarm.service
    ```

### تخصيص الموارد في خيارات النشر الأخرى

يتم التحكم في حجم ذاكرة تارانتول باستخدام سمة `SLAB_ALLOC_ARENA` في ملف التكوين `/etc/default/wallarm-tarantool`. لتخصيص الذاكرة:

<ol start="1"><li>افتح ملف التكوين لتارانتول للتحرير:</li></ol>

=== "ديبيان 10.x (باستر)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "ديبيان 11.x (بلس)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "أوبنتو 18.04 LTS (بيونيك)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "أوبنتو 20.04 LTS (فوكال)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "أوبنتو 22.04 LTS (جامي)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "سنتوس 7.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "أمازون لينكس 2.0.2021x وأقل"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "ألما لينكس، روكي لينكس أو أوراكل لينكس 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li>اضبط سمة <code>SLAB_ALLOC_ARENA</code> على حجم الذاكرة. يمكن أن تكون القيمة عدد صحيح أو عائم (نقطة <code>.</code> هي فاصل عشري). على سبيل المثال:</li></ol>

```
SLAB_ALLOC_ARENA=1.0
```

<ol start="3"><li>أعد تشغيل تارانتول:</li></ol>

=== "ديبيان 10.x (باستر)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "ديبيان 11.x (بلس)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "أوبنتو 18.04 LTS (بيونيك)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "أوبنتو 20.04 LTS (فوكال)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "أوبنتو 22.04 LTS (جامي)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "سنتوس 7.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "أمازون لينكس 2.0.2021x وأقل"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "ألما لينكس، روكي لينكس أو أوراكل لينكس 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

لمعرفة مدة قدرة مثيل تارانتول على الاحتفاظ بتفاصيل حركة المرور مع مستوى الحمل الحالي لنود التصفية، يمكنك استخدام مقياس الرصد [`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds).

## NGINX

تعتمد استهلاك ذاكرة NGINX على العديد من العوامل. بشكل عام، يمكن تقديرها كالتالي:

```
عدد الطلبات المتزامنة * متوسط حجم الطلب * 3
```

على سبيل المثال:

* نود التصفية يعالج في الذروة 10000 طلب متزامن،
* متوسط حجم الطلب هو 5 كيلوبايت.

يمكن تقدير استهلاك ذاكرة NGINX على النحو التالي:

```
10000 * 5 كيلوبايت * 3 = 150000 كيلوبايت (أو ~150 ميغابايت)
```

**لتخصيص كمية الذاكرة:**

* لقرون متحكم الدخول NGINX (`ingress-controller`)، قم بتكوين الأقسام التالية في ملف `values.yaml` باستخدام خيار `--set` في `helm install` أو `helm upgrade`:
    ```
    controller:
      resources:
        limits:
          cpu: 400m
          memory: 3280Mi
        requests:
          cpu: 200m
          memory: 1640Mi
    ```

    مثال على الأوامر التي تغير الإعدادات:

    === "تثبيت متحكم الدخول"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        هناك أيضًا [إعدادات أخرى](../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتثبيت متحكم الدخول بشكل صحيح. يرجى إدراجها أيضًا في خيار `--set`.
    === "تحديث إعدادات متحكم الدخول"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* لخيارات النشر الأخرى، استخدم ملفات تكوين NGINX.

## استكشاف الأخطاء وإصلاحها

إذا كان نود Wallarm يستهلك الذاكرة والمعالج أكثر مما كان متوقعًا، لتقليل استخدام الموارد، تعرف على التوصيات من مقالة [استكشاف الأخطاء وإصلاحها لاستخدام المعالج العالي](../../faq/cpu.md) واتبعها.