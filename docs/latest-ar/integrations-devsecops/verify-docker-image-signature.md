# التحقق من توقيعات صور Docker الخاصة بـ Wallarm

تقوم Wallarm بالتوقيع على ومشاركة [المفتاح العام](https://repo.wallarm.com/cosign.pub) لصور Docker الخاصة بها، مما يتيح لك التحقق من صحتها والتخفيف من المخاطر مثل الصور المخترقة وهجمات سلسلة التوريد. يوفر هذا المقال تعليمات للتحقق من توقيعات صور Docker الخاصة بـ Wallarm.

## قائمة الصور الموقعة

تقوم Wallarm بتوقيع صور Docker التالية:

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 وما فوق: [صورة Docker القائمة على NGINX](../admin-en/installation-docker-en.md) تشمل جميع وحدات Wallarm، وتعمل كعنصر فردي لنشر Wallarm
* جميع صور Docker المستخدمة بواسطة مخطط Helm لـ [نشر Ingress Controller القائم على NGINX](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* جميع صور Docker المستخدمة بواسطة مخطط Helm لـ [نشر Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## المتطلبات

للتأكد من أصالة صور Docker الخاصة بـ Wallarm، يتم استخدام [Cosign](https://docs.sigstore.dev/cosign/overview/) لكل من التوقيع والتحقق.

قبل البدء في التحقق من توقيع صورة Docker، تأكد من [تثبيت](https://docs.sigstore.dev/cosign/installation/) أداة Cosign للأوامر على جهازك المحلي أو ضمن مسار CI/CD الخاص بك.

## تشغيل التحقق من توقيع صورة Docker

للتحقق من توقيع صورة Docker، نفذ الأوامر التالية مع استبدال قيمة `WALLARM_DOCKER_IMAGE` بالعلامة الخاصة بالصورة:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

يجب أن يوفر [الناتج](https://docs.sigstore.dev/cosign/verify/) كائن `docker-manifest-digest` بملخص الصورة، مثلاً:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## استخدام محرك سياسة Kubernetes للتحقق من التوقيع

تتيح محركات مثل Kyverno أو وكيل السياسات المفتوح (OPA) التحقق من توقيعات صور Docker ضمن عقد Kubernetes الخاص بك. من خلال صياغة سياسة بقواعد للتحقق، تبدأ Kyverno عملية التحقق من توقيع الصورة بناءً على معايير محددة، بما في ذلك المستودعات أو العلامات. يحدث التحقق أثناء نشر مورد Kubernetes.

إليك مثال على كيفية استخدام سياسة Kyverno للتحقق من توقيعات صور Docker الخاصة بـ Wallarm:

1. [قم بتثبيت Kyverno](https://kyverno.io/docs/installation/methods/) على عقدك وتأكد من تشغيل جميع الحاويات بشكل صحيح.
1. أنشئ سياسة Kyverno YAML التالية:

    ```yaml
    apiVersion: kyverno.io/v1
    kind: ClusterPolicy
    metadata:
      name: verify-wallarm-images
    spec:
      webhookTimeoutSeconds: 30
      validationFailureAction: Enforce
      background: false
      failurePolicy: Fail
      rules:
        - name: verify-wallarm-images
          match:
            any:
              - resources:
                  kinds:
                    - Pod
          verifyImages:
            - imageReferences:
                - docker.io/wallarm/ingress*
                - docker.io/wallarm/sidecar*
              attestors:
                - entries:
                    - keys:
                        kms: https://repo.wallarm.com/cosign.pub
    ```
1. طبق السياسة:

    ```
    kubectl apply -f <PATH_TO_POLICY_FILE>
    ```
1. نشر إما [متحكم Ingress NGINX](../admin-en/installation-kubernetes-en.md) الخاص بـ Wallarm أو [متحكم Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md)، حسب متطلباتك. ستطبق السياسة Kyverno أثناء النشر لفحص توقيع الصورة.
1. حلل نتائج التحقق بتنفيذ:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

ستتلقى ملخصًا يعرض حالة التحقق من التوقيع:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

تشير سياسة `verify-wallarm-images` المقدمة إلى وجود معلمة `failurePolicy: Fail`. هذا يعني أنه إذا لم ينجح التوثيق بالتوقيع، فإن عملية نشر المخطط بأكملها تفشل.