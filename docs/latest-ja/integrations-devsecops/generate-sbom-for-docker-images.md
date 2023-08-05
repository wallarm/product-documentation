# Wallarm DockerイメージのSBOMの生成

ソフトウェアの部品目録（Software Bill of Materials、SBOM）は、バージョン、ライセンス、脆弱性を含むアプリケーション内のソフトウェアコンポーネントとその依存関係を記録する目録です。この記事では、Wallarm DockerイメージのSBOMを生成する方法をガイドいたします。

Wallarm DockerイメージのSBOMを取得する必要があるかもしれません。これは、イメージで使われている依存関係に関連する潜在的なセキュリティリスクを評価し、軽減するためです。SBOMはソフトウェアコンポーネントの透明性を提供し、コンプライアンスを確保するのに役立ちます。

## Wallarm Dockerイメージのリスト

以下は、[署名された](verify-docker-image-signature.md) Wallarm Dockerイメージのリストです。これらのイメージの任意のタグについてSBOMを生成することができます。

<!-- * [wallarm/node](https://hub.docker.com/r/wallarm/node): Wallarmの全モジュールが含まれている[NGINXベースのDockerイメージ](../admin-en/installation-docker-en.md)で、Wallarmのデプロイメント用の単体の成果物として機能します。
* [wallarm/envoy](https://hub.docker.com/r/wallarm/envoy): Wallarmの全モジュールが含まれている[EnvoyベースのDockerイメージ](../admin-en/installation-guides/envoy/envoy-docker.md)で、Wallarmのデプロイメント用の単体の成果物として機能します。 -->
* [NGINXベースのIngress Controllerデプロイメント](../admin-en/installation-kubernetes-en.md)用のHelmチャートで使用されるDockerイメージ：

     * [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx)
     * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
     * [wallarm/ingress-controller-chroot](https://hub.docker.com/r/wallarm/ingress-controller-chroot)
     * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
     * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
     * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
     * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* [Sidecar proxyデプロイメント](../installation/kubernetes/sidecar-proxy/deployment.md)用のHelmチャートで使用されるDockerイメージ：

     * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
     * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
     * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
     * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
     * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
     * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## 前提条件

Wallarm DockerイメージのSBOMを生成するためには、[syft](https://github.com/anchore/syft) CLIユーティリティを使用する必要があります。

SBOMの生成を進める前に、ローカルマシンまたはCI/CDパイプライン内に**syft**を[インストール](https://github.com/anchore/syft#installation)しておくことを確認してください。

## SBOM生成手順

DockerイメージのSBOMを生成するには、次のコマンドを使用し、指定されたイメージタグを望ましいものに置き換えます：

```bash
syft wallarm/ingress-controller:4.6.2-1
```

デフォルトでは、**syft**はテキスト形式でSBOMを返します。CycloneDX、SPDXなどの他の形式で生成したり、出力をファイルに保存することもできます。例えば：

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

SBOMを生成した後、そのSBOMを脆弱性スキャン、ライセンス遵守チェック、セキュリティ監査、レポート作成などの様々なアクションのためにCI/CDパイプライン内で活用できます。

すべての依存関係が本当にWallarmに属していることを確認するには、[イメージの署名を確認](verify-docker-image-signature.md)するだけで済みます。我々はイメージにデジタル署名を行うことで、署名されたイメージが確かに我々のものであることを保証します。したがって、この保証はSBOMにも及び、Wallarmの検証済みイメージに関連していることになります。