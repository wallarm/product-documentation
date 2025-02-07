# Wallarm Dockerイメージ署名の検証

WallarmはDockerイメージ用の[公開鍵](https://repo.wallarm.com/cosign.pub)に署名し、共有しています。これにより、イメージの信頼性を検証し、改竄されたイメージやサプライチェーン攻撃などのリスクを軽減できます。本記事では、Wallarm Dockerイメージの署名検証手順を説明します。

## 署名済みイメージの一覧

Wallarmは以下のDockerイメージに署名しています。

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1以降：全てのWallarmモジュールを含み、Wallarm展開用のスタンドアロンアーティファクトとして提供される[NGINXベースのDockerイメージ](../admin-en/installation-docker-en.md)
* Helmチャートによる[NGINXベースのIngress Controller展開](../admin-en/installation-kubernetes-en.md)で使用される全てのDockerイメージ:
  
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* Helmチャートによる[Sidecar展開](../installation/kubernetes/sidecar-proxy/deployment.md)で使用される全てのDockerイメージ:
  
    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio)：Wallarmコネクタ向けのセルフホスト型Native Node展開用[Dockerイメージ](../installation/native-node/docker-image.md)

## 必要条件

Wallarm Dockerイメージの信頼性を担保するため、署名および検証には[Cosign](https://docs.sigstore.dev/cosign/overview/)を使用します。

Dockerイメージの署名検証を実施する前に、ローカルマシンまたはCI/CDパイプライン内にCosignコマンドラインユーティリティを[インストール](https://docs.sigstore.dev/cosign/installation/)してください。

## Dockerイメージ署名検証の実行

Dockerイメージ署名を検証するには、以下のコマンドを実行してください。なお、`WALLARM_DOCKER_IMAGE`の値は特定のイメージタグに置き換えてください。

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

[出力](https://docs.sigstore.dev/cosign/verify/)には、イメージのダイジェストを含む`docker-manifest-digest`オブジェクトが表示されます。例:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## Kubernetesポリシーエンジンを使用した署名検証

KyvernoやOpen Policy Agent (OPA)などのエンジンを使用すれば、Kubernetesクラスター内でDockerイメージの署名検証が可能です。検証用ルールを含むポリシーを作成すると、Kyvernoは定義された条件（リポジトリやタグなど）に基づいてイメージの署名検証を実行します。検証はKubernetesリソースのデプロイ時に行われます。

以下は、Kyvernoポリシーを使用してWallarm Dockerイメージ署名を検証する例です。

1. クラスターに[Kyverno](https://kyverno.io/docs/installation/methods/)をインストールし、全てのPodが正常に稼働していることを確認してください。
1. 以下のKyverno YAMLポリシーを作成します:

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
1. 要件に応じて、Wallarmの[NGINX Ingress controller](../admin-en/installation-kubernetes-en.md)または[Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md)をデプロイします。デプロイ時にKyvernoポリシーがイメージ署名の検証を行います。
1. 次のコマンドを実行し、検証結果を確認します:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

以下は署名検証状況の概要です:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

提供された`verify-wallarm-images`ポリシーには`failurePolicy: Fail`が設定されています。これは、署名認証が成功しない場合、チャート全体のデプロイが失敗することを意味します。