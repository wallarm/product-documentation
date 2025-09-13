[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# 一般設定

**Settings**セクションの**General**タブでは、以下の操作が可能です:

* Wallarmのフィルタリングモードの切り替え
* 自動ログアウトのタイムアウトの管理

![General tab](../../images/user-guides/settings/general-tab.png)

## フィルタリングモード

すべてのWallarmノードは、HTTPリクエストレベルで攻撃を検知してブロックできます。この[フィルタリングモード][link-config-parameters]は、ローカル設定またはグローバル設定によって定義されます:

* **Local settings (default)**: このモードでは、フィルタノードの構成ファイルの設定が適用されます。
* **Safe blocking**: [グレーリストのIP](../ip-lists/overview.md)から送信されたすべての不正リクエストはブロックされます。
* **Monitoring**: すべてのリクエストが処理されますが、攻撃が検知されてもブロックは行われません。
* **Blocking**: 攻撃が検知されたすべてのリクエストがブロックされます。

## ログアウトの管理

[管理者](users.md#user-roles)は会社アカウントのログアウトタイムアウトを設定できます。設定はすべてのアカウントユーザーに適用されます。アイドルタイムアウトと絶対タイムアウトを設定できます。