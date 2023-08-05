# ノードアーチファクトバージョンの目録

この文書は Wallarm ノード 4.6の利用可能な[パッチバージョン](versioning-policy.md#version-format)を異なる形態でリストします。この文書に基づいて新たなパッチバージョンのリリースを追跡し、タイムリーなアップグレードを計画できます。

## 全てが一つになったインストーラー

更新履歴は同時に x86_64 および ARM64 (ベータ) バージョンの[全てが一つになったインストーラー](../installation/nginx/all-in-one.md)に適用されます。

### 4.6.12 (2023-06-30)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## NGINX用のDEB/RPMパッケージ

[アップグレード方法](nginx-modules.md)

### 4.6.0 (2023-03-28)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## NGINX Ingressコントローラー用のヘルムチャート

[アップグレード方法](ingress-controller.md)

### 4.6.6 (2023-07-24)

* NGINX Ingress コントローラのヘルムチャートバージョンが [4.7.1](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.7.1) に上げられました。
* NGINX Ingress コントローラのバージョンが [1.8.1](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.8.1) に上げられました。
* [バグ](https://github.com/wallarm/ingress/issues/233) を解消しました。

### 4.6.5 (2023-06-19)

* 最近発見された10万以上の漏洩した鍵が含まれる最新の[漏洩した秘密鍵セット](https://github.com/wallarm/jwt-secrets)のサポート追加により、[弱いJWT検出](../attacks-vulns-list.md#weak-jwt)機能がさらに強化されました。
* Wallarm postanalytics モジュールのための割り当てられた[メモリの増加](../admin-en/configure-kubernetes-en.md#controllerwallarmtarantoolarena) 1GBまで扱われています。

### 4.6.4 (2023-06-06)

* NGINX Ingress コントローラのヘルムチャートバージョンが [4.7.0](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.7.0) に上げられました。
* NGINX Ingress コントローラのバージョンが [1.8.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.8.0) に上げられました。
* 内部改善：
   * Wallarm APIトークンを環境変数ではなく、Dockerコンテナへのボリュームとしてマウントします。
   * ヘルパーコンテナのために専用のイメージタグを使用します。

### 4.6.3 (2023-05-18)

* NGINX Ingress コントローラのヘルムチャートバージョンが [4.6.1](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.6.1) に上げられました。
* NGINX Ingress コントローラのバージョンが [1.7.1](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.7.1) に上げられました。

### 4.6.2 (2023-04-10)

* NGINX Ingress コントローラのヘルムチャートバージョンが [4.6.0](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.6.0) に上げられました。
* NGINX Ingress コントローラのバージョンが [1.7.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.7.0) に上げられました。
* Kubernetes 1.23.x のサポートはもうなくなりました (それは EOL)

### 4.6.0 (2023-03-28)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## Kong Ingressコントローラ用のヘルムチャート

[アップグレード方法](kong-ingress-controller.md)

### 4.6.1 (2023-07-21)

* Tarantoolコンポーネントのラベルが重なる問題を修正しました

### 4.6.0 (2023-03-28)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## サイドカープロキシ用のヘルムチャート

[アップグレード方法](sidecar-proxy.md)

### 4.6.4 (2023-06-27)

* [外部postanalytics（Tarantool）モジュール使用](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticsexternalenabled)のサポートが追加されました。

### 4.6.3 (2023-06-20)

* `sidecar.wallarm.io/nginx-http-snippet`、`sidecar.wallarm.io/nginx-server-snippet`、`sidecar.wallarm.io/nginx-location-snippet` のアノテーションが適切に処理されないため、サイドカーコンテナーで障害が発生するバグを修正しました。

### 4.6.2 (2023-06-19)

* 最近発見された10万以上の漏洩した鍵が含まれる最新の[漏洩した秘密鍵セット](https://github.com/wallarm/jwt-secrets)のサポートが追加され、[弱いJWT検出](../attacks-vulns-list.md#weak-jwt)機能がさらに強化されました。
* サイドカープロキシソリューションでAlpineバージョンを3.18.0に上げます。

### 4.6.1 (2023-06-07)

* [SSL/TLSの終端のサポート](../installation/kubernetes/sidecar-proxy/customization.md#ssltls-termination)が追加されました。

### 4.6.0 (2023-03-28)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## NGINXベースのDockerイメージ

[アップグレード方法](docker-container.md)

### 4.6.2-1 (2023-06-13)

* 最近発見された10万以上の漏洩した鍵が含まれる最新の[漏洩した秘密鍵セット](https://github.com/wallarm/jwt-secrets)のサポートが追加され、[弱いJWT検出](../attacks-vulns-list.md#weak-jwt)機能がさらに強化されました。

### 4.6.1-1 (2023-04-18)

* `WALLARM_LABELS`がデプロイトークンに提供されていない場合、コンテナが終了します。

### 4.6.0-1 (2023-03-28)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## EnvoyベースのDockerイメージ

[アップグレード方法](docker-container.md)

### 4.6.2-1 (2023-06-13)

* 最近発見された10万以上の漏洩した鍵が含まれる最新の[漏洩した秘密鍵セット](https://github.com/wallarm/jwt-secrets)のサポートが追加され、[弱いJWT検出](../attacks-vulns-list.md#weak-jwt)機能がさらに強化されました。

### 4.6.1-1 (2023-04-21)

* `WALLARM_LABELS`がデプロイトークンに提供されていない場合、コンテナが終了します。
* リクエスト数の計算を修正

### 4.6.0-1 (2023-03-28)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## Amazon Machine Image (AMI)

[アップグレード方法](cloud-image.md)

### 4.6.4-1 (2023-07-06)

* [CVE-2021-3177](https://nvd.nist.gov/vuln/detail/CVE-2021-3177) の脆弱性を解消しました。

   この脆弱性の存在により、バージョン 4.0.6、4.0.7、4.2.1、4.4.2-1、および4.6.0-1 のAMIが削除されました。
* 最近発見された10万以上の漏洩した鍵が含まれる最新の[漏洩した秘密鍵セット](https://github.com/wallarm/jwt-secrets)のサポートが追加され、[弱いJWT検出](../attacks-vulns-list.md#weak-jwt)機能がさらに強化されました。

### 4.6.0-1 (2023-03-28)

!!! warning "バージョンが削除されました"
    このAMIバージョンは [CVE-2021-3177](https://nvd.nist.gov/vuln/detail/CVE-2021-3177) の脆弱性の存在により削除されました。代わりに、必要な修正が施された新しいバージョン、4.6.4-1がリリースされました。

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)

## Google Cloud Platformイメージ

[アップグレード方法](cloud-image.md)

### wallarm-node-4-6-20230630-122224 (2023-07-06)

* [CVE-2021-3177](https://nvd.nist.gov/vuln/detail/CVE-2021-3177) の脆弱性を解消しました。
* 最近発見された10万以上の漏洩した鍵が含まれる最新の[漏洩した秘密鍵セット](https://github.com/wallarm/jwt-secrets)のサポートが追加され、[弱いJWT検出](../attacks-vulns-list.md#weak-jwt)機能がさらに強化されました。

### wallarm-node-4-6-20230324-114215 (2023-03-28)

* バージョン 4.6の初回リリース, [変更履歴を参照](what-is-new.md)