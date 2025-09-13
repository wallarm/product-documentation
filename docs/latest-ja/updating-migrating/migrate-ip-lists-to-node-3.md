# Wallarm node 2.18以下から6.xへの許可リストと拒否リストの移行

Wallarm node 3.x以降、IPアドレスの許可リストと拒否リストの設定方法が変更されました。本ドキュメントでは、Wallarm node 2.18以下で設定された許可リストと拒否リストを最新のWallarm nodeへ移行する方法を説明します。

## 変更点

IPアドレスの許可リストおよび拒否リストの設定は次のように変更されました。

* NGINXディレクティブ`wallarm_acl_*`および環境変数`WALLARM_ACL_*`は非推奨になりました。現在、IPリストの設定は次のとおりです。

    * IPの許可/拒否機能を有効化するための追加手順は不要です。Wallarm nodeはデフォルトでWallarm CloudからIPアドレスリストをダウンロードし、受信リクエストの処理時にダウンロードしたデータを適用します。
    * ブロックされたリクエストへの応答として返すブロックページとエラーコードは、`wallarm_acl_block_page`ではなく[`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page)ディレクティブで設定します。
* 許可リストおよび拒否リストに登録されたIPアドレスはWallarm Consoleから管理します。
* 組織のリソースの脆弱性スキャンや追加のセキュリティテストの実行に使用される[Wallarmの脆弱性スキャン用IP](../admin-en/scanner-addresses.md)は、デフォルトで許可リストに登録されています。これらのアドレスを手動で許可リストに追加する必要はありません。

## 許可リスト/拒否リスト設定の移行手順

1. フィルタリングノードモジュールを最新バージョンに更新する旨を[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡し、お使いのWallarmアカウントで新しいIPリストロジックを有効化するよう依頼してください。

    新しいIPリストロジックが有効化されたら、Wallarm Consoleを開き、[**IP lists**](../user-guides/ip-lists/overview.md)セクションが利用可能であることを確認してください。
2. マルチテナントのWallarm nodeを更新する場合は、IPアドレス拒否リストをWallarm node 2.18以下のマルチテナントノードと同期するために使用していたスクリプトを削除してください。バージョン3.2以降は、[IPリスト](../user-guides/ip-lists/overview.md)の手動連携は不要です。 
3. 該当する[手順](general-recommendations.md#update-process)に従ってフィルタリングノードモジュールを6.xに更新してください。
4. フィルタリングノードの設定ファイルから、組織のリソースの脆弱性スキャンおよび追加のセキュリティテストの実行に使用される[Wallarmの脆弱性スキャン用IP](../admin-en/scanner-addresses.md)の許可リスト設定を削除してください。フィルタリングノード3.x以降では、これらのアドレスはデフォルトで許可リストに登録されています。
5. フィルタリングノードでブロックすべきでない他のIPアドレスの許可リスト化に上記の方法を使用している場合は、それらを[Wallarm Consoleのallowlist](../user-guides/ip-lists/overview.md)へ移行してください。
6. 拒否リストに登録されたIPが発したリクエストに対して返すブロックページとエラーコードの設定に`wallarm_acl_block_page`ディレクティブを使用している場合は、ディレクティブ名を`wallarm_block_page`に置き換え、[手順](../admin-en/configuration-guides/configure-block-page-and-code.md)に従ってその値を更新してください。
7. `docker run`コマンドから[NGINX](../admin-en/installation-docker-en.md)の環境変数`WALLARM_ACL_*`を削除してください。
8. (任意) フィルタリングノードの設定ファイルからNGINXディレクティブ`wallarm_acl_*`を削除してください。