# Wallarm node 2.18以下から5.0への許可リストおよび拒否リストの移行

Wallarm node 3.x以降、IPアドレスの許可リストおよび拒否リストの設定方法が変更されました。本書では、Wallarm node 2.18以下で設定された許可リストおよび拒否リストを最新のWallarm nodeへ移行する方法を説明します。

## 何が変更されましたか？

IPアドレスの許可リストおよび拒否リストの設定は以下のように変更されました：

* NGINXディレクティブ `wallarm_acl_*`、Envoyパラメーター `acl`および`WALLARM_ACL_*`環境変数は非推奨となりました。IPリストは以下の方法で設定されます：
    * IPの許可リストまたは拒否リスト機能を有効にするための追加手順は必要ありません。Wallarm nodeはデフォルトでWallarm CloudからIPアドレスリストをダウンロードし、受信リクエストの処理時にダウンロードしたデータを適用します。
    * ブロックされたリクエストに対して返すブロックページおよびエラーコードは、`wallarm_acl_block_page`の代わりに[`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page)ディレクティブを使用して設定されます。
* 許可リストおよび拒否リストに登録されたIPアドレスはWallarm Consoleで管理されます。
* [Wallarm Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)のIPアドレスはデフォルトで許可リストに登録されます。ScannerのIPアドレスを手動で許可リストに登録する必要はありません。

## 許可リストおよび拒否リストの設定移行手順

1. Wallarm accountに対して最新バージョンまでフィルタリングノードモジュールを更新している旨を[Wallarm technical support](mailto:support@wallarm.com)に連絡し、新しいIPリストロジックを有効にするよう依頼してください。

    新しいIPリストロジックが有効になった場合、Wallarm Consoleを開いて、[**IP lists**](../user-guides/ip-lists/overview.md)セクションが利用可能であることをご確認ください。
2. マルチテナントのWallarm nodeを更新する場合、Wallarm node 2.18以下でIPアドレス拒否リストを同期するために使用されていたスクリプトを削除してください。Wallarm node 3.2以降、[IP lists](../user-guides/ip-lists/overview.md)の手動統合は不要です。
3. [appropriate instructions](general-recommendations.md#update-process)に従い、フィルタリングノードモジュールをバージョン5.0まで更新してください。
4. フィルタリングノードの設定ファイルからWallarm ScannerのIPアドレスの許可リスト設定を削除してください。フィルタリングノード3.x以降、Scanner IPアドレスはデフォルトで許可リストに登録されます。
5. 上記の方法が、フィルタリングノードによってブロックされてはならないその他のIPアドレスの許可リスト設定に使用されている場合、それらを[Wallarm Consoleの許可リスト](../user-guides/ip-lists/overview.md)に移行してください。
6. denylistedなIPアドレスからのリクエスト時に返すブロックページおよびエラーコードの設定に`wallarm_acl_block_page`ディレクティブを使用している場合は、ディレクティブ名を`wallarm_block_page`に置き換え、[instructions](../admin-en/configuration-guides/configure-block-page-and-code.md)に従い、その値を更新してください。
7. `docker run`コマンドから、[NGINX](../admin-en/installation-docker-en.md)及び[Envoy](../admin-en/installation-guides/envoy/envoy-docker.md)環境変数`WALLARM_ACL_*`を削除してください。
8. （オプション）フィルタリングノードの設定ファイルからNGINXディレクティブ`wallarm_acl_*`およびEnvoyパラメーター`acl`を削除してください。