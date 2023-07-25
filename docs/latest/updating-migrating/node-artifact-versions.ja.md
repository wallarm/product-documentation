					# ノードアーティファクトバージョンの目録

このドキュメントは、異なる形態でのWallarmノード4.4の[パッチバージョン](versioning-policy.ja.md#version-format)をリストしています。新しいパッチバージョンのリリースを追跡し、このドキュメントに基づいて適時アップグレードを計画できます。

## DEB/RPMパッケージ for NGINX

[アップグレード方法](nginx-modules.ja.md)

### 4.4.3 (2023-02-10)

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### 4.4.0

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)

## Helmチャート for NGINX Ingressコントローラー

[アップグレード方法](ingress-controller.ja.md)

### 4.4.8 (2023-02-23)

* NGINX IngressコントローラーのHelmチャートバージョンが[4.5.2](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.5.2)に昇格しました
* NGINX Ingressコントローラーバージョンが[1.6.4](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.6.4)に昇格しました

### 4.4.7 (2023-02-13)

* WallarmヘルパーコンテナがSIGTERMシグナルを尊重しない問題を修正し、ローリングアップグレードにかかる時間が大幅に短縮されました

### 4.4.6 (2023-02-13)

* HorizontalPodAutoscalerの廃止されたAPIバージョンを修正し、v2(`autoscaling/v2beta2`→`autoscaling/v2`)へ昇格しました

### 4.4.5 (2023-02-13)

* Wallarm APIが偶発的に利用できなくなった際のポッド再起動の問題を修正
* [#185](https://github.com/wallarm/ingress/pull/185)の`synccloud`および`heardbeat`コンテナを削除

### 4.4.4 (2023-02-13)

* Helmチャートのインストールまたはアップグレード中にWallarm APIが利用できない場合のポッド再起動の問題を修正

### 4.4.3 (2023-02-10)

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### 4.4.2 (2023-01-19)

* 弱いJWT検出機能の問題を修正

### 4.4.1 (2023-01-16)

* WallarmノードトークンをKubernetesシークレットとして保存し、`existingSecret`機能を使用してHelmチャートにプルする機能。[詳細](../admin-en/configure-kubernetes-en.ja.md#controllerwallarmexistingsecret)
* Tarantoolリソース用の新しいHelmチャートパラメーター：

    * [`controller.wallarm.tarantool.terminationGracePeriodSeconds`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L789) - [K8sドキュメント](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)で詳細をご覧ください
    * [`controller.wallarm.topologySpreadConstraint`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L793) - [K8sドキュメント](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/#topologyspreadconstraints-field)で詳細をご覧ください
    * [`revisionHistoryLimit`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L870) - このグローバルパラメーターは、今後もTarantoolリソースReplicaSetsの数を維持し、[K8sドキュメント](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#revision-history-limit)でパラメーターの詳細をご覧ください
* [#170](https://github.com/wallarm/ingress/pull/170)の`exportenv` initコンテナを削除

### 4.4.0

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)

## Helmチャート for Kong Ingressコントローラー

[アップグレード方法](kong-ingress-controller.ja.md)

### 4.4.3 (2023-02-10)

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### 4.4.1

* 弱いJWT検出機能の問題を修正
* Kong API Gatewayバージョンを3.1.xにアップグレード（オープンソース版およびエンタープライズ版の両方）
* Kong Ingresコントローラーバージョンを2.8.xにアップグレード

### 4.4.0

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)

## Helmチャート for Sidecarプロキシ

[アップグレード方法](sidecar-proxy.ja.md)

### 4.4.5 (2023-02-13)

* [`config.wallarm.fallback`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.ja.md#configwallarmfallback)および[`config.wallarm.enableLibDetection`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.ja.md#configwallarmenablelibdetection)のHelm値をデフォルトで`on`に設定

### 4.4.4 (2023-02-13）

* WallarmノードトークンをKubernetesシークレットとして保存し、`existingSecret`機能を使用してHelmチャートにプルする機能。[詳細](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.ja.md#configwallarmapiexistingsecret)

### 4.4.3 (2023-02-10）

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### 4.4.1

* 弱いJWT検出機能の問題を修正

### 1.1.5

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)

## NGINXベースのDockerイメージ

[アップグレード方法](docker-container.ja.md)

### 4.4.5-1 (2023-03-03)

* 無効なカスタムルールセットがセグメンテーション違反を引き起こす問題を修正

### 4.4.3-1 (2023-02-10)

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### 4.4.0-1

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)

## EnvoyベースのDockerイメージ

[アップグレード方法](docker-container.ja.md)

### 4.4.3 (2023-02-10)

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### 4.4.0

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)

## Amazon Machine Image（AMI）

[アップグレード方法](cloud-image.ja.md)

### 4.4.2-1 (2023-02-10)

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### 4.4.1-1

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)

## Google Cloud Platformイメージ

[アップグレード方法](cloud-image.ja.md)

### wallarm-node-4-4-20230131-154432

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)および[SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)攻撃検出のサポート
* JSONおよびPrometheusフォーマットの両方で[Wallarm統計サービス](../admin-en/configure-statistics-service.ja.md)によって返される新しいパラメーター `custom_ruleset_ver`

### wallarm-node-4-4-20221122-092419

* 4.4の初回リリース、[変更履歴を参照](what-is-new.ja.md)