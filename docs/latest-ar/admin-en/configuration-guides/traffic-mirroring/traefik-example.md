# مثال على تكوين Traefik لعكس المرور

يوفر هذا المقال مثالًا على التكوين المطلوب لـ Traefik ل[عكس المرور وتوجيهه إلى نقطة Wallarm](overview.md).

## الخطوة 1: تكوين Traefik لعكس المرور

مثال التكوين التالي يعتمد على نهج [`ملف التكوين الديناميكي`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/). خادم الويب Traefik يدعم أيضًا أوضاع تكوين أخرى، ويمكنك تعديل المثال المقدم بسهولة لأي منها لأن لديهم هيكلًا مماثلًا.

```yaml
### ملف التكوين الديناميكي
### ملاحظة: نقاط الدخول موصوفة في ملف التكوين الثابت
http:
  services:
    ### هكذا يتم تعيين الخدمات الأصلية وخدمات wallarm.
    ### في التكوين `الموجهات` اللاحق (انظر أدناه)، من فضلك
    ### استخدم اسم هذه الخدمة (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### الخدمة لعكس المرور إليها - النقطة النهائية
    ### التي يجب أن تتلقى الطلبات المعكوسة (المنسوخة)
    ### من الخدمة الأصلية.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### الخدمة الأصلية. يجب على هذه الخدمة تلقي
    ### المرور الأصلي.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### يجب أن يكون اسم الموجه هو نفسه اسم الخدمة
    ### لكي يعمل عكس المرور (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### الموجه للمرور الأصلي.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[راجع توثيق Traefik](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## الخطوة 2: تكوين نقطة Wallarm لفلترة المرور المعكوس

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"