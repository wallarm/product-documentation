# Wallarm API FirewallのためのHelmチャート

このチャートは、[Helm](https://helm.sh/)パッケージマネージャを用いて[Kubernetes](http://kubernetes.io/)クラスター上でWallarm API Firewallのデプロイを始動します。

このチャートはまだ公開のHelmレジストリにアップロードされていません。Helmチャートのデプロイのためには、このリポジトリを使用してください。

## 必要条件

* Kubernetes 1.16 またはそれ以降
* Helm 2.16 またはそれ以降

## デプロイメント

Wallarm API Firewall Helmチャートをデプロイするには：

1. まだ追加していない場合は、リポジトリを追加してください：

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. helmチャートの最新バージョンを取得します：

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. コードコメントに従い、`api-firewall/values.yaml` ファイルを変更し、チャートを設定します。

4. このHelmチャートからWallarm API Firewallをデプロイします。

このHelmチャートのデプロイ示例を確認したい場合は、私たちの[Kuberentesデモ](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)を参照していただけます。