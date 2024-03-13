# Wallarm API Firewall用のHelmチャート

このチャートは、[Helm](https://helm.sh/)パッケージマネージャーを使用して[Kubernetes](http://kubernetes.io/)クラスター上にWallarm API Firewallのデプロイメントをブートストラップします。

このチャートはまだ公開Helmレジストリにアップロードされていません。Helmチャートをデプロイするには、このリポジトリを使用してください。

## 要件

* Kubernetes 1.16以降
* Helm 2.16以降

## デプロイメント

Wallarm API Firewall Helmチャートをデプロイするには：

1. まだ追加していない場合、リポジトリを追加してください：

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. Helmチャートの最新バージョンを取得します：

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. コードコメントに従って`api-firewall/values.yaml`ファイルを変更してチャートを構成します。

4. このHelmチャートからWallarm API Firewallをデプロイします。

このHelmチャートのデプロイメントの例を見るには、私たちの[Kuberentesデモ](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)を実行してみてください。