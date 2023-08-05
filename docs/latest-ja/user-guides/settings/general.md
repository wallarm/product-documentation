[link-config-parameters]:       ../../admin-ja/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/ja/general-settings-page-with-safe-blocking.png

# 一般設定

**設定**セクションの **一般** タブでは以下の設定が可能です：

* Wallarmのフィルタモードの切り替え
* 自動ログアウトタイムアウトの管理

![!一般タブ](../../images/user-guides/settings/general-tab.png)

## フィルタリングモード

Wallarmの各ノードは、HTTPリクエストレベルで攻撃を識別しブロックすることができます。この[フィルタリングモード][link-config-parameters]は、ローカル設定またはグローバル設定で定義されます：

* **ローカル設定（デフォルト）**：このモードは、フィルタノードの設定ファイルから設定を利用します。
* **安全なブロッキング**：[グレーリスト化されたIP](../ip-lists/graylist.md)からの全ての悪意のあるリクエストがブロックされます。
* **監視**：全てのリクエストが処理されますが、攻撃が検出された場合でもブロックは行われません。
* **ブロッキング**：攻撃が検出された全てのリクエストがブロックされます。

!!! info "Qrator"
    Qratorトラフィックフィルターに接続するWallarmのお客様は、*Qratorとのブロッキング*設定があります。この設定により、悪意のあるリクエストの自動ブロックが可能になります。ブロックはQratorのIP拒否リストによって行われます。Wallarmは攻撃元のIPアドレスのデータをQratorに転送します。

## ログアウト管理

[管理者](users.md#user-roles)は、企業アカウントのログアウトタイムアウトを設定することができます。設定はすべてのアカウントユーザーに影響します。アイドルタイムアウトと絶対タイムアウトを設定することができます。