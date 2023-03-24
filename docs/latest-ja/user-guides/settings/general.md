[link-config-parameters]:       ../../admin-ja/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/ja/general-settings-page-with-safe-blocking.png

# 一般設定

**設定**セクションの**一般**タブでは、次のことができます。

* Wallarmフィルタリングモードの切り替え
* 自動ログアウトのタイムアウトの管理

![!一般タブ](../../images/user-guides/settings/general-tab.png)

## フィルタリングモード

すべてのWallarmノードは、HTTPリクエストレベルで攻撃を識別し、ブロックすることができます。この[フィルタリングモード][link-config-parameters]は、ローカルまたはグローバル設定で定義されます。

* **ローカル設定（デフォルト）**：このモードはフィルタノード設定ファイルの設定を利用します。
* **セーフブロッキング**：[グレーリストに登録されたIP](../ip-lists/graylist.md)からのすべての悪意のあるリクエストがブロックされます。
* **モニタリング**：すべてのリクエストが処理されますが、攻撃が検出された場合でもブロックされることはありません。
* **ブロッキング**：攻撃が検出されたすべてのリクエストがブロックされます。

!!! info "Qrator"
    Qratorトラフィックフィルタに接続されたWallarmの顧客は、*Qratorとのブロッキング*設定を持っています。この設定により、悪意のあるリクエストが自動的にブロックされます。ブロッキングはQratorのIP拒否リストを用いて実行されます。Wallarmは、攻撃が発生したIPアドレスのデータをQratorに転送します。

## ログアウト管理

[管理者](users.md#user-roles)は、会社アカウントのログアウトタイムアウトを設定できます。設定はすべてのアカウントユーザに影響します。アイドルタイムアウトと絶対タイムアウトを設定できます。