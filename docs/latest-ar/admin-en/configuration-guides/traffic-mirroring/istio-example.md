# مثال على تكوين Istio لتقليد حركة المرور

تقدم هذه المقالة المثال المطلوب لتكوين Istio لـ[تقليد حركة المرور وتوجيهها إلى عقدة Wallarm](overview.md).

## الخطوة 1: تكوين Istio لتقليد حركة المرور

لتمكين Istio من تقليد حركة المرور، يمكنك تكوين `VirtualService` لتقليد مسارات إما إلى النقطة النهائية الداخلية (داخلية بالنسبة لـIstio، مثل المستضافة في Kubernetes) أو إلى النقطة النهائية الخارجية بواسطة `ServiceEntry`:

* لتمكين تقليد طلبات داخل العنقود (مثلاً بين البودات)، أضف `mesh` إلى `.spec.gateways`.
* لتمكين تقليد طلبات خارجية (مثلاً عبر خدمة LoadBalancer أو NodePort)، قم بتكوين مكون `Gateway` الخاص بـIstio وأضف اسم المكون إلى `.spec.gateways` لـ`VirtualService`. يتم عرض هذا الخيار في المثال أدناه.

```yaml
---
### تكوين وجهة حركة المرور المتقلدة
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # عنوان وجهة التقليد
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # منفذ وجهة التقليد
      name: http
      protocol: HTTP
  resolution: DNS
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - ...
  gateways:
    ### اسم مكون `Gateway` Istio. مطلوب للتعامل مع حركة المرور من
    ### مصادر خارجية
    ###
    - httpbin-gateway
    ### تسمية خاصة، تمكن مسارات هذه الخدمة الافتراضية من العمل مع الطلبات
    ### من بودات Kubernetes (التواصل داخل العنقود بدون بوابات)
    ###
    - mesh
  http:
    - route:
        - destination:
            host: httpbin
            port:
              number: 80
          weight: 100
      mirror:
        host: some.external.service.tld # عنوان وجهة التقليد
        port:
          number: 8445 # منفذ وجهة التقليد
---
### للتعامل مع الطلبات الخارجية
###
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingress
    app: istio-ingress
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "httpbin.local"
```

[راجع توثيق Istio](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

## الخطوة 2: تكوين عقدة Wallarm لتصفية حركة المرور المتقلدة

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"