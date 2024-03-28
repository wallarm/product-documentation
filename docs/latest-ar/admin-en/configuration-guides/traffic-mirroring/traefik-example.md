# مثال على تكوين Traefik لعكس حركة المرور

توفر هذه المقالة مثالاً على التكوين المطلوب لـ Traefik لـ[عكس حركة المرور وتوجيهها إلى عقدة Wallarm](overview.md).

## الخطوة 1: تكوين Traefik لعكس حركة المرور

يعتمد مثال التكوين التالي على نهج ملف التكوين [`الديناميكي`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/). يدعم خادم الويب Traefik أيضاً أوضاع تكوين أخرى، ويمكنك تعديل التكوين المقدم بسهولة لأي منها حيث أن لديهم بنية مماثلة.

```yaml
### ملف التكوين الديناميكي
### ملاحظة: نقاط الدخول موصوفة في ملف التكوين الثابت
http:
  services:
    ### كيفية تعيين خدمات original وwallarm.
    ### في تكوين `الموجهين` اللاحق (انظر أدناه)، يرجى
    ### استخدام اسم هذه الخدمة (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### الخدمة لعكس حركة المرور إليها - نقطة النهاية
    ### التي يجب أن تتلقى الطلبات المعكوسة (المنسوخة)
    ### من الخدمة الأصلية.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### الخدمة الأصلية. يجب على هذه الخدمة تلقي
    ### حركة المرور الأصلية.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### يجب أن يكون اسم الموجه هو نفسه اسم الخدمة
    ### لكي تعمل عكس حركة المرور (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### الموجه لحركة المرور الأصلية.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[راجع توثيق Traefik](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## الخطوة 2: تكوين عقدة Wallarm لتصفية حركة المرور المعكوسة

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"