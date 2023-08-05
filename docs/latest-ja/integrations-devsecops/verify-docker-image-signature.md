# Wallarm Dockerイメージ署名の確認

Wallarmは、そのDockerイメージのための[公開鍵](https://repo.wallarm.com/cosign.pub)を署名し、共有します。こうすることにより、あなたはその真正性を確認し、侵害されたイメージやサプライチェーン攻撃のようなリスクを緩和できます。本記事では、Wallarm Dockerイメージ署名の確認手順について説明します。

## 署名されたイメージのリスト

リリース4.4から、Wallarmは以下のDockerイメージを署名しています：

<!-- * [wallarm/node](https://hub.docker.com/r/wallarm/node): [NGINX-based Docker image] that includes all Wallarm modules, serving as a standalone artifact for Wallarm deployment -->
* Helm chartによって使用されるすべてのDockerイメージ（[NGINXベースのIngress Controllerデプロイメント](../admin-en/installation-kubernetes-en.md)）に対して：

    * [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx)
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/ingress-controller-chroot](https://hub.docker.com/r/wallarm/ingress-controller-chroot)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* Helm chartによって使用されるすべてのDockerイメージ（[Sidecarプロキシデプロイメント](../installation/kubernetes/sidecar-proxy/deployment.md)）に対して：

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## 前提条件

Wallarm Dockerイメージの真正性を確保するため、[Cosign](https://docs.sigstore.dev/cosign/overview/)が署名と確認の両方に使用されます。

Dockerイメージ署名の確認を始める前に、あなたのローカルマシンかCI/CDパイプライン内でCosignコマンドラインユーティリティを[インストール](https://docs.sigstore.dev/cosign/installation/)してください。

## Dockerイメージ署名の確認を実行する

Dockerイメージ署名を確認するには、以下のコマンドを実行し、`WALLARM_DOCKER_IMAGE`の値を特定のイメージタグで置き換えてください：

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

[出力](https://docs.sigstore.dev/cosign/verify/)は、イメージのダイジェストと共に`docker-manifest-digest`オブジェクトを提供するはずです。例えば：

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```