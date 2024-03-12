# مثال على تهيئة Istio لعكس الحركة

تقدم هذه المقالة المثال المطلوب للتهيئة لـ Istio لـ [عكس الحركة وتوجيهها إلى عقدة Wallarm](overview.md).

## الخطوة 1: تهيئة Istio لعكس الحركة

لتمكين Istio من عكس الحركة، يمكنك تهيئة `VirtualService` لعكس المسارات إما إلى نقطة النهاية الداخلية (الداخلية لـ Istio، مثل المستضافة في Kubernetes) أو إلى نقطة النهاية الخارجية مع `ServiceEntry`:

* لتمكين عكس طلبات داخل العقد (مثل بين الحاويات)، أضف `mesh` إلى `.spec.gateways`.
* لتمكين عكس طلبات الخارجية (مثل عبر خدمة LoadBalancer أو NodePort)، قم بتهيئة مكون `Gateway` الخاص بـ Istio وأضف اسم المكون إلى `.spec.gateways` الخاص بـ `VirtualService`. تُعرض هذه الخيار في المثال أدناه.

```yaml
---
### تهيئة وجهة الحركة المعكوسة
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # عنوان وجهة العكس
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # منفذ وجهة العكس
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
    ### اسم مكون `Gateway` الخاص بـ istio. مطلوب للتعامل مع الحركة من
    ### مصادر خارجية
    ###
    - httpbin-gateway
    ### تسمية خاصة، تمكن مسارات هذه الخدمة الافتراضية من العمل مع طلبات
    ### من حاويات Kubernetes (التواصل داخل العقدة غير عبر البوابات)
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
        host: some.external.service.tld # عنوان وجهة العكس
        port:
          number: 8445 # منفذ وجهة العكس
---
### للتعامل مع طلبات الخارجية
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

## الخطوة 2: تهيئة عقدة Wallarm لتصفية الحركة المعكوسة

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"