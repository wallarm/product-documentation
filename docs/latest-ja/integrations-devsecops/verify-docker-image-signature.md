# Wallarm Dockerイメージ署名の検証

WallarmはDockerイメージに署名し、そのための[公開鍵](https://repo.wallarm.com/cosign.pub)を共有しています。これにより、イメージの真正性を検証し、イメージの改ざんやサプライチェーン攻撃といったリスクを軽減できます。本記事では、WallarmのDockerイメージ署名の検証方法を説明します。

## 署名済みイメージの一覧

Wallarmは以下のDockerイメージに署名しています:

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1以上：すべてのWallarmモジュールを含む[NGINXベースのDockerイメージ](../admin-en/installation-docker-en.md)で、Wallarmのデプロイに使用するスタンドアロンアーティファクトです
* [NGINXベースのIngress Controllerのデプロイメント](../admin-en/installation-kubernetes-en.md)用のHelmチャートで使用されるすべてのDockerイメージ：

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [Sidecarデプロイメント](../installation/kubernetes/sidecar-proxy/deployment.md)用のHelmチャートで使用されるすべてのDockerイメージ：

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio)：Wallarmコネクタ用の[セルフホスト型Native Nodeデプロイメント向けDockerイメージ](../installation/native-node/docker-image.md)

## 前提条件

WallarmのDockerイメージの真正性を確保するため、署名および検証には[Cosign](https://docs.sigstore.dev/cosign/overview/)を使用します。 

Dockerイメージ署名の検証を開始する前に、ローカルマシンまたはCI/CDパイプラインにCosignのコマンドラインユーティリティを[インストール](https://docs.sigstore.dev/cosign/installation/)してください。

## Dockerイメージ署名の検証を実行する

Dockerイメージの署名を検証するには、`WALLARM_DOCKER_IMAGE`の値を対象のイメージタグに置き換えて次のコマンドを実行します:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

[出力](https://docs.sigstore.dev/cosign/verify/)にはイメージのダイジェストを示す`docker-manifest-digest`オブジェクトが含まれます。例:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## Kubernetesポリシーエンジンを使用した署名検証

KyvernoやOpen Policy Agent(OPA)などのエンジンを使用すると、Kubernetesクラスター内でDockerイメージの署名検証を行えます。検証のためのルールを含むポリシーを作成すると、Kyvernoはリポジトリやタグなどの定義済み条件に基づいてイメージ署名の検証を開始します。検証はKubernetesリソースのデプロイ時に実行されます。

以下は、WallarmのDockerイメージ署名を検証するためにKyvernoポリシーを使用する例です:

1. クラスターに[Kyvernoをインストール](https://kyverno.io/docs/installation/methods/)し、すべてのPodが稼働していることを確認します。
1. 次のKyverno YAMLポリシーを作成します:

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
1. ポリシーを適用します:

    ```
    kubectl apply -f <PATH_TO_POLICY_FILE>
    ```
1. 要件に応じて、Wallarmの[NGINX Ingress controller](../admin-en/installation-kubernetes-en.md)または[Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md)をデプロイします。Kyvernoポリシーはデプロイ時に適用され、イメージの署名をチェックします。
1. 次のコマンドを実行して検証結果を確認します:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

署名検証の状況を示す要約が表示されます:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

提示した`verify-wallarm-images`ポリシーには`failurePolicy: Fail`パラメータが設定されています。これは、署名の認証に失敗した場合、チャート全体のデプロイが失敗することを意味します。