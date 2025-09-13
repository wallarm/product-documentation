# Wallarm DockerイメージのSBOMを生成する

Software Bill of Materials（SBOM）は、アプリケーション内のソフトウェアコンポーネントとその依存関係、バージョン、ライセンス、脆弱性などを一覧化したインベントリです。本記事では、WallarmのDockerイメージ向けにSBOMを生成する方法を説明します。

イメージで使用されている依存関係に関連する潜在的なセキュリティリスクを評価し、軽減するために、WallarmのDockerイメージのSBOMが必要になる場合があります。SBOMはソフトウェアコンポーネントの透明性を提供し、コンプライアンスの確保に役立ちます。

## WallarmのDockerイメージ一覧

以下は、[署名済み](verify-docker-image-signature.md)のWallarmのDockerイメージの一覧です。これらのイメージの任意のタグに対してSBOMを生成できます。

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1以降：すべてのWallarmモジュールを含む[NGINXベースのDockerイメージ](../admin-en/installation-docker-en.md)で、Wallarmのデプロイ用スタンドアロンアーティファクトとして機能します
* [NGINXベースのIngress Controllerデプロイ](../admin-en/installation-kubernetes-en.md)用Helmチャートで使用されるすべてのDockerイメージ：

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [Sidecarデプロイ](../installation/kubernetes/sidecar-proxy/deployment.md)用Helmチャートで使用されるすべてのDockerイメージ：

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio)：Wallarmコネクタ向け[自己ホスト型Native Nodeデプロイ用Dockerイメージ](../installation/native-node/docker-image.md)

## 要件

WallarmのDockerイメージのSBOMを生成するには、[syft](https://github.com/anchore/syft) CLIユーティリティを使用する必要があります。

SBOMの生成に進む前に、ローカルマシンまたはCI/CDパイプラインに**syft**を[インストール](https://github.com/anchore/syft#installation)していることを確認してください。

## SBOM生成手順

DockerイメージのSBOMを生成するには、次のコマンドを使用し、指定されているイメージタグを目的のものに置き換えてください。

```bash
syft wallarm/ingress-controller:4.6.2-1
```

デフォルトでは、**syft**はSBOMをテキスト形式で返します。CycloneDXやSPDXなどの他の形式でも生成でき、出力をファイルに保存できます。例：

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

SBOMを生成した後は、脆弱性スキャン、ライセンスのコンプライアンスチェック、セキュリティ監査、レポートの生成など、さまざまな処理においてCI/CDパイプライン内で活用できます。

すべての依存関係が実際にWallarmに属することを確認するには、イメージ全体の[署名を確認](verify-docker-image-signature.md)するだけで十分です。Wallarmはイメージにデジタル署名を付与しており、署名済みイメージがWallarmのものであることを保証します。そのため、この保証はSBOMにも及び、SBOMはWallarmの検証済みイメージに関連付けられます。