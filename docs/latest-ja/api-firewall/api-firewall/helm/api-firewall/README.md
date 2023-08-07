# Wallarm API FirewallのためのHelmチャート

このチャートは、[Helm](https://helm.sh/)パッケージマネージャを使用して、[Kubernetes](http://kubernetes.io/)クラスター上にWallarm API Firewallのデプロイメントをブートストラップします。

このチャートはまだ公開Helmレジストリにアップロードされていません。Helmチャートをデプロイするには、このリポジトリをご利用ください。

## 要件

* Kubernetes 1.16以上
* Helm 2.16以上

## デプロイメント

Wallarm API FirewallのHelmチャートをデプロイするには：

1. まだ追加していない場合は、当社のリポジトリを追加します：

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. Helmチャートの最新バージョンをフェッチします：

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. `api-firewall/values.yaml`ファイルのコードコメントに従ってチャートを設定します。

4. このHelmチャートからWallarm API Firewallをデプロイします。

このHelmチャートのデプロイメントの例を見るには、当社の[Kuberentesデモ](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)を実行できます。