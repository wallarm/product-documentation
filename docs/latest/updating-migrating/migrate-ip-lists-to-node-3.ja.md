					# Wallarmノード2.18以下から4.4への許可リストと拒否リストの移行

Wallarmノード3.x以降では、IPアドレスの許可リストと拒否リストの設定方法が変更されました。このドキュメントでは、Wallarmノード2.18以前で設定された許可リストと拒否リストを最新のWallarmノードに移行する方法について説明します。

## 何が変わったのか？

IPアドレスの許可リストと拒否リストの設定が以下のように変更されました。

* [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) NGINXディレクティブ、[`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings) Envoyパラメータ、および`WALLARM_ACL_*`環境変数は廃止されました。現在、IPリストは次のように設定されます。

    * 許可リストまたは拒否リスト機能を有効にするための追加手順は不要です。WallarmノードはデフォルトでWallarm CloudからIPアドレスリストをダウンロードし、受信リクエストの処理時にダウンロードされたデータを適用します。
    * ブロックされたリクエストへの応答で返されるブロックページとエラーコードは、`wallarm_acl_block_page`ではなく[`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page)ディレクティブを使用して設定されます。
* 許可リストおよび拒否リストのIPアドレスは、Wallarmコンソールを介して管理されます。
* [Wallarm脆弱性スキャナ](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)のIPアドレスはデフォルトで許可リストに登録されます。スキャナーIPアドレスの手動許可リスト登録は不要です。

## 許可リストと拒否リスト設定の移行手順

1. [Wallarm技術サポート](mailto:support@wallarm.com)に、フィルタリングノードモジュールを最新バージョンに更新する予定であることを通知し、新しいIPリストロジックをWallarmアカウントに有効にするよう依頼してください。

    新しいIPリストロジックが有効になったら、Wallarmコンソールを開き、[**IPリスト**](../user-guides/ip-lists/overview.md)セクションが利用可能であることを確認してください。
2. マルチテナントWallarmノードを更新する場合は、IPアドレス拒否リストとマルチテナントノード2.18以下を同期するために使用されたスクリプトを削除してください。バージョン3.2以降では、[IPリスト](../user-guides/ip-lists/overview.md)の手動統合は不要です。
3. フィルタリングノードモジュールを[適切な手順](general-recommendations.md#update-process)に従ってバージョン4.4に更新します。
4. フィルタリングノードの設定ファイルからWallarm Scanner IPアドレスの許可リストを削除します。フィルタリングノード3.x以降では、スキャナーIPアドレスはデフォルトで許可リストに登録されます。以前のWallarmノードバージョンでは、許可リストは次の方法で設定されていました。

    * スキャナーIPアドレスに対して無効化されたフィルターションモード（例：[NGINX設定](/2.18/admin-en/scanner-ips-allowlisting/)、[K8sサイドカーコンテナ](/2.18/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/#step-1-creating-wallarm-configmap)、[K8s Ingressコントローラ](/2.18/admin-en/configuration-guides/wallarm-ingress-controller/best-practices/allowlist-wallarm-ip-addresses/)）。
    * NGINXディレクティブ [`allow`](https://nginx.org/en/docs/http/ngx_http_access_module.html#allow)。
5. 上記の方法がフィルタリングノードによってブロックされるべきではない他のIPアドレスの許可リストに使用されている場合は、[Wallarmコンソールの許可リスト](../user-guides/ip-lists/allowlist.md)に移動してください。
6. 拒否リストに登録されたIPがリクエストを生成した場合に、ブロックページとエラーコードを返すように設定するために`wallarm_acl_block_page`ディレクティブを使用していた場合は、ディレクティブ名を`wallarm_block_page`に変更し、[指示](../admin-en/configuration-guides/configure-block-page-and-code.md)に従って値を更新してください。
7. [NGINX](../admin-en/installation-docker-en.md)および[Envoy](../admin-en/installation-guides/envoy/envoy-docker.md)環境変数`WALLARM_ACL_*`を`docker run`コマンドから削除します。
8. (オプション) フィルタリングノードの設定ファイルからNGINXディレクティブ[`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl)および[`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings) Envoyパラメーターを削除します。