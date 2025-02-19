[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# 一般設定

**設定**セクションの**一般**タブでは、以下の操作が可能です:

* Wallarmのフィルトレーションモードを切り替えます
* 自動ログアウトのタイムアウトを管理します

![General tab](../../images/user-guides/settings/general-tab.png)

## フィルトレーションモード

各WallarmノードはHTTPリクエストレベルで攻撃を識別してブロックできます。この[フィルトレーションモード][link-config-parameters]は、ローカルまたはグローバルの設定によって定義されます:

* **ローカル設定 (デフォルト)**: このモードはフィルターノードの構成ファイルから設定を利用します。
* **Safe blocking**: [graylisted IPs](../ip-lists/overview.md)から発信されたすべての悪意あるリクエストをブロックします。
* **Monitoring**: すべてのリクエストは処理されますが、攻撃が検出されてもブロックされません。
* **Blocking**: 攻撃が検出されたすべてのリクエストをブロックします。

## ログアウト管理

[管理者](users.md#user-roles)は企業アカウントのログアウトタイムアウトを設定できます。この設定はすべてのアカウントユーザーに影響します。アイドルタイムアウトと絶対タイムアウトを設定できます。