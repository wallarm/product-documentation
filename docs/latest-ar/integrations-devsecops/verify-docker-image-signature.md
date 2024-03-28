# التحقق من تواقيع صور Docker الخاصة بـWallarm

تقوم Wallarm بتوقيع ومشاركة [المفتاح العام](https://repo.wallarm.com/cosign.pub) لصور Docker الخاصة بها، مما يتيح لك التحقق من صحتها والتخفيف من المخاطر مثل الصور المخترقة وهجمات سلسلة التوريد. تقدم هذه المقالة تعليمات للتحقق من تواقيع صور Docker الخاصة بـWallarm.

## قائمة الصور الموقعة

توقع Wallarm الصور التالية لـDocker:

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 فما فوق: [صورة Docker المبنية على NGINX](../admin-en/installation-docker-en.md) والتي تشتمل على جميع وحدات Wallarm، لتكون بمثابة مكون مستقل لنشر Wallarm
* جميع صور Docker المستخدمة بواسطة مخطط Helm لـ[نشر Ingress Controller المبني على NGINX](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* جميع صور Docker المستخدمة بواسطة مخطط Helm لـ[نشر Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## المتطلبات

لضمان صحة صور Wallarm Docker، يُستخدم [Cosign](https://docs.sigstore.dev/cosign/overview/) لكل من التوقيع والتحقق.

قبل المضي قدما في التحقق من توقيع صورة Docker، تأكد من [تثبيت](https://docs.sigstore.dev/cosign/installation/) أداة سطر الأوامر Cosign على جهازك المحلي أو ضمن سلسلة التوصيل الخاصة بك.

## تنفيذ التحقق من توقيع صورة Docker

للتحقق من توقيع صورة Docker، نفذ الأوامر التالية مع استبدال قيمة `WALLARM_DOCKER_IMAGE` بالعلامة المحددة للصورة:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

يجب أن [تُظهِر](https://docs.sigstore.dev/cosign/verify/) النتيجة كائن `docker-manifest-digest` مع بصمة الصورة، على سبيل المثال:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.com/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## استخدام محرك السياسة Kubernetes للتحقق من التواقيع

تتيح محركات مثل Kyverno أو Open Policy Agent (OPA) إمكانية التحقق من تواقيع صور Docker ضمن عنقود Kubernetes الخاص بك. من خلال إنشاء سياسة بقواعد للتحقق، تبدأ Kyverno عملية التحقق من التوقيع بناء على معايير محددة، بما في ذلك المستودعات أو العلامات. يحدث التحقق خلال نشر موارد Kubernetes.

إليك مثال على كيفية استخدام سياسة Kyverno للتحقق من تواقيع صور Wallarm Docker:

1. [قم بتثبيت Kyverno](https://kyverno.io/docs/installation/methods/) على عنقودك وتأكد من أن جميع الحاويات تعمل.
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
1. قم بنشر إما [وحدة تحكم Ingress NGINX](../admin-en/installation-kubernetes-en.md) أو [وحدة التحكم Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md) الخاصة بـWallarm، حسب متطلباتك. سيتم تطبيق السياسة من Kyverno خلال النشر لفحص توقيع الصورة.
1. قم بتحليل نتائج التحقق بتنفيذ:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

ستتلقى ملخصاً يوضح حالة التحقق من التوقيع:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

سياسة `verify-wallarm-images` المقدمة لديها المعلمة `failurePolicy: Fail`. هذا يعني أنه إذا لم ينجح التوثيق بالتوقيع، فإن عملية نشر المخطط بأكملها تفشل.