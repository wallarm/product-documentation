# Wallarm DockerイメージのSBOM生成

ソフトウェア構成品表（SBOM）は、アプリケーションに含まれるソフトウェアコンポーネントとその依存関係（バージョン、ライセンス、脆弱性を含む）を一覧するインベントリです。本記事では、Wallarm DockerイメージのSBOM生成方法をご案内します。

Wallarm DockerイメージのSBOMは、イメージで使用される依存関係に関連する潜在的なセキュリティリスクを評価し、軽減するために必要となる場合があります。SBOMはソフトウェアコンポーネントの透明性を提供し、コンプライアンスの確保に寄与します。

## Wallarm Dockerイメージの一覧

以下は[署名済み](verify-docker-image-signature.md)のWallarm Dockerイメージ一覧です。これらのイメージの任意のタグに対してSBOMを生成できます。

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1以上：すべてのWallarmモジュールを含む[NGINXベースのDockerイメージ](../admin-en/installation-docker-en.md)で、Wallarm展開のためのスタンドアロンアーティファクトとして提供します
* Helmチャートで使用されるすべてのDockerイメージ（[NGINXベースのIngress Controller展開](../admin-en/installation-kubernetes-en.md)）:
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* Helmチャートで使用されるすべてのDockerイメージ（[Sidecar展開](../installation/kubernetes/sidecar-proxy/deployment.md)）:
    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio)：Wallarmコネクタ向けの[セルフホスト型Native Node展開用Dockerイメージ](../installation/native-node/docker-image.md)

## 必要条件

Wallarm DockerイメージのSBOMを生成するには、[syft](https://github.com/anchore/syft) CLIユーティリティを使用する必要があります。

SBOM生成を開始する前に、ローカルマシンまたはCI/CDパイプライン内に[インストール](https://github.com/anchore/syft#installation)された**syft**があることを確認してください。

## SBOM生成手順

DockerイメージのSBOMを生成するためには、以下のコマンドを使用し、指定されたイメージタグを目的のものに置き換えてください。

```bash
syft wallarm/ingress-controller:4.6.2-1
```

デフォルトでは、**syft**はSBOMをテキスト形式で返します。他の形式（CycloneDX、SPDXなど）で出力し、ファイルに保存することもできます。例:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

SBOM生成後、脆弱性スキャン、ライセンスコンプライアンスチェック、セキュリティ監査、レポート生成などのさまざまなアクションにCI/CDパイプライン内で活用できます。

すべての依存関係が実際にWallarmのものであることを確認するために、イメージ全体の[署名を確認](verify-docker-image-signature.md)するだけで十分です。弊社のイメージにデジタル署名することで、署名済みイメージが確かに弊社のものであることを保証します。結果として、この保証はSBOMにも及び、SBOMがWallarmの検証済みイメージに関連付けられることとなります。