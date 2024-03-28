# تخصيص الموارد لعقدة Wallarm

كمية الذاكرة وموارد المعالج المخصصة لعقدة التصفية تحدد جودة وسرعة معالجة الطلبات. تصف هذه التعليمات التوصيات لتخصيص ذاكرة عقدة التصفية.

في عقدة التصفية هناك مستهلكين رئيسيين للذاكرة والمعالج:

* [Tarantool](#tarantool)، يُسمى أيضًا **وحدة postanalytics**. هذا هو النظام الخلفي لتحليلات البيانات المحلية والمستهلك الأساسي للذاكرة في عقدة التصفية.
* [NGINX](#nginx) هو العقدة الرئيسية للتصفية ومكون الوكيل المعكوس.

يعتمد استخدام المعالج لـNGINX على العديد من العوامل مثل مستوى RPS، والحجم الوسطي للطلب والاستجابة، وعدد قواعد مجموعة القواعد المخصصة التي تتعامل معها العقدة، وأنواع وطبقات ترميزات البيانات المستخدمة مثل Base64 أو ضغط البيانات، إلخ.

بمتوسط، يمكن لنواة المعالج التعامل مع حوالي 500 RPS. عند التشغيل في وضع الإنتاج، يُوصى بتخصيص نواة واحدة على الأقل لعملية NGINX ونواة واحدة لعملية Tarantool. في معظم الحالات يُوصى بإفراط في تخصيص التوفير لعقدة التصفية في البداية، رؤية الاستخدام الفعلي للمعالج والذاكرة لمستويات حركة المرور الإنتاجية الفعلية، وتقليل الموارد المخصصة تدريجياً إلى مستوى معقول (مع وجود مجال لتقلبات حركة المرور وتكرار العقدة بمقدار 2x على الأقل).

## Tarantool

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### تخصيص الموارد في Kubernetes Ingress Controller

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### تخصيص الموارد إذا كنت تستخدم البرنامج المثبت كلياً

يتم التحكم في حجم ذاكرة Tarantool باستخدام صفة `SLAB_ALLOC_ARENA` في ملف التكوين `/opt/wallarm/env.list`. لتخصيص ذاكرة:

1. افتح ملف `/opt/wallarm/env.list` للتعديل:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. حدد صفة `SLAB_ALLOC_ARENA` إلى حجم الذاكرة. يمكن أن تكون القيمة عدداً صحيحاً أو عائماً (نقطة `.` هي فاصل عشري). على سبيل المثال:

    ```
    SLAB_ALLOC_ARENA=1.0
    ```
1. أعد تشغيل خدمات Wallarm:

    ```
    sudo systemctl restart wallarm.service
    ```

### تخصيص الموارد في خيارات النشر الأخرى

يتم التحكم في حجم ذاكرة Tarantool باستخدام صفة `SLAB_ALLOC_ARENA` في ملف التكوين `/etc/default/wallarm-tarantool`. لتخصيص ذاكرة:

<ol start="1"><li>افتح ملف تكوين Tarantool للتعديل:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li>حدد صفة <code>SLAB_ALLOC_ARENA</code> إلى حجم الذاكرة. يمكن أن تكون القيمة عدداً صحيحاً أو عائماً (نقطة <code>.</code> هي فاصل عشري). على سبيل المثال:</li></ol>

```
SLAB_ALLOC_ARENA=1.0
```

<ol start="3"><li>أعد تشغيل Tarantool:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
لمعرفة المدة التي يمكن لمثيل Tarantool الاحتفاظ بتفاصيل حركة المرور مع المستوى الحالي لتحميل عقدة التصفية، يمكنك استخدام مقياس الرصد [`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds).

## NGINX

يعتمد استهلاك ذاكرة NGINX على العديد من العوامل. بمتوسط يمكن تقديره كما يلي:

```
عدد الطلبات المتزامنة * حجم الطلب الوسطي * 3
```

على سبيل المثال:

* تعمل عقدة التصفية على معالجة 10000 طلب متزامن في الذروة،
* حجم الطلب الوسطي هو 5 kB.

يمكن تقدير استهلاك ذاكرة NGINX على النحو التالي:

```
10000 * 5 kB * 3 = 150000 kB (أو ~150 MB)
```

**لتخصيص كمية الذاكرة:**

* لوحدة pod NGINX Ingress controller (`ingress-controller`)، قم بضبط الأقسام التالية في ملف `values.yaml` باستخدام خيار `--set` من `helm install` أو `helm upgrade`:
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

    === "تثبيت Ingress controller"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        هناك أيضاً [إعدادات أخرى](../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتثبيت Ingress controller بشكل صحيح. يرجى تمريرها في خيار `--set` أيضاً.
    === "تحديث إعدادات Ingress controller"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* لخيارات النشر الأخرى، استخدم ملفات تكوين NGINX.

## استكشاف الأخطاء وإصلاحها

إذا استهلكت عُقدة Wallarm مزيداً من الذاكرة والمعالج مما كان متوقعاً، لتقليل استخدام الموارد، اطلع على التوصيات من مقال [استكشاف مشاكل الاستخدام العالي للمعالج](../../faq/cpu.md) واتبعها.