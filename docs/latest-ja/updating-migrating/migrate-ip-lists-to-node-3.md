# Wallarmノード2.18以下から4.6への許可リストと拒否リストの移行

Wallarmノード3.xから、IPアドレスの許可リストと拒否リストの設定方法が変更されました。このドキュメントでは、Wallarmノード2.18以下で設定された許可リストと拒否リストを最新のWallarmノードに移行する方法を説明します。

## 何が変わったのか？

IPアドレスの許可リストと拒否リストの設定の変更点は次の通りです:

* [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl)のNGINXディレクティブ、[`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings)のEnvoyパラメーター、および`WALLARM_ACL_*`環境変数は非推奨になりました。現在、IPリストの設定は次のように行います

    * IP許可リストまたは拒否リスト機能を有効にするための追加の手順は必要ありません。WallarmノードはデフォルトでWallarm CloudからIPアドレスリストをダウンロードし、着信リクエストの処理時にダウンロードされたデータを適用します。
    * ブロックされたリクエストに対する応答のブロックページとエラーコードの設定は、`wallarm_acl_block_page`ではなく[`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page)ディレクティブを使用して設定します。
* 許可されたIPアドレスと拒否されたIPアドレスはWallarmのコンソール経由で管理されます。
* [Wallarmの脆弱性スキャナ](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)のIPアドレスはデフォルトで許可リストに登録されています。スキャナーのIPアドレスを手動で許可リストに登録する必要はもうありません。

## 許可リストと拒否リストの設定移行の手順

1. フィルタリングノードモジュールを最新バージョンに更新し、Wallarmアカウントの新しいIPリストロジックを有効にするように[Wallarmのテクニカルサポート](mailto:support@wallarm.com)に依頼します。

    新しいIPリストロジックが有効になったら、Wallarmコンソールを開き、セクション[**IPリスト**](../user-guides/ip-lists/overview.md)が利用可能であることを確認してください。
2. マルチテナントのWallarmノードを更新する場合は、IPアドレスの拒否リストとマルチテナントのノード2.18以下の同期を行うスクリプトを削除してください。バージョン3.2からは、[IPリスト](../user-guides/ip-lists/overview.md)の手動統合はもう必要ありません。
3. フィルタリングノードモジュールをバージョン4.6まで更新し、[適切な手順](general-recommendations.md#update-process)に従ってください。
4. 許可リストから Wallarm Scanner IP アドレスをフィルタリングノードの設定ファイルから削除します。フィルタリングノード3.xから、Scanner IPアドレスはデフォルトで許可リストに登録されています。以前のWallarmノードバージョンでは、許可リストは次の方法で設定できました:

    * スキャナーIPアドレスのフィルタリングモードを無効にする（例：[NGINXの設定](/2.18/admin-en/scanner-ips-allowlisting/)、[K8sサイドカー コンテナ](/2.18/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/#step-1-creating-wallarm-configmap)、[K8s Ingress コントローラ](/2.18/admin-en/configuration-guides/wallarm-ingress-controller/best-practices/allowlist-wallarm-ip-addresses/)）。
    * NGINXディレクティブ[`allow`](https://nginx.org/en/docs/http/ngx_http_access_module.html#allow)。
5. リスト化された方法がフィルタリングノードによってブロックされるべきでない他のIPアドレスを許可リストに追加している場合は、それらを[Wallarmコンソールの許可リスト](../user-guides/ip-lists/allowlist.md)に移動してください。
6. 拒否リストが原因でリクエストがブロックされた場合に返されるブロックページとエラーコードを設定するために`wallarm_acl_block_page`ディレクティブを使用していた場合は、ディレクティブ名を `wallarm_block_page`に置き換え、その値を[手順](../admin-en/configuration-guides/configure-block-page-and-code.md)に従って更新してください。
7. [`docker run`](../admin-en/installation-guides/envoy/envoy-docker.md)コマンドから[NGINX](../admin-en/installation-docker-en.md)と[Envoy](../admin-en/installation-guides/envoy/envoy-docker.md)の環境変数 `WALLARM_ACL_*`を削除します。
8. （オプション）フィルタリングノードの設定ファイルからNGINXディレクティブ[`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl)と[`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings)のEnvoyパラメーターを削除します。