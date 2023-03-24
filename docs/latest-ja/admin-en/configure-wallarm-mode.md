[acl-access-phase]: ../admin-ja/configure-parameters-ja.md#wallarm_acl_access_phase

# フィルタリングモードの設定

フィルタリングモードは、着信要求を処理する際のフィルタリングノードの動作を定義します。これらの指示には、利用可能なフィルタリングモードとそれらの設定方法が記載されています。

## 利用可能なフィルタリングモード

Wallarmフィルタリングノードは、以下のモード（最も緩いものから最も厳格なものまで）で着信要求を処理することができます。

* **無効化**（`off`）
* **モニタリング**（`monitoring`）
* **安全ブロッキング**（`safe_blocking`）
* **ブロッキング**（`block`）

--8<-- "../include-ja/wallarm-modes-description-latest.md"

## フィルタリングモード設定の方法

以下の方法でフィルタリングモードを設定できます。

* フィルタリングノードの設定ファイル内の `wallarm_mode` ディレクティブに値を割り当てます

    !!! warning "CDNノードの `wallarm_mode` ディレクティブのサポート"
        CDNノードで `wallarm_mode` ディレクティブを設定できないことに注意してください。CDNノードのフィルタリングモードを設定するには、他の利用可能な方法を使用してください。
* Wallarm Console で一般的なフィルタリングルールを定義します
* Wallarm Console の **ルール** セクションで、フィルタリングモードのルールを作成します

フィルタリングモードの設定方法の優先順位は、[`wallarm_mode_allow_override` ディレクティブ](#wallarm_mode_allow_override-を使用してフィルタリングモードの設定方法の優先順位を設定する)で決定されます。デフォルトでは、Wallarm Consoleで指定された設定は、値の厳格さに関係なく、`wallarm_mode` ディレクティブよりも高い優先順位があります。

### `wallarm_mode` ディレクティブでのフィルタリングモードの指定

!!! warning "CDNノードの `wallarm_mode` ディレクティブのサポート"
    CDNノードで `wallarm_mode` ディレクティブを設定できないことに注意してください。CDNノードのフィルタリングモードを設定するには、他の利用可能な方法を使用してください。

フィルタリングノードの設定ファイル内の `wallarm_mode` ディレクティブを使用して、異なるコンテキストに対するフィルタリングモードを定義できます。以下のリストでは、最もグローバルなものから最もローカルなものまでの順に、これらのコンテキストが並べられています。

* `http`: `http` ブロックの内部のディレクティブは、HTTPサーバー에送信されるリクエストに適用されます。
* `server`: `server` ブロックの内部のディレクティブは、仮想サーバーに送信されるリクエストに適用されます。
* `location`: `location` ブロックの内部のディレクティブは、特定のパスを含むリクエストにのみ適用されます。

`http`、`server`、および `location` ブロックに異なる `wallarm_mode` ディレクティブ値が定義されている場合、最もローカルの設定が最も高い優先順位を持ちます。

**`wallarm_mode` ディレクティブの使用例:**

```bash
http {

    wallarm_mode monitoring;

    server {
        server_name SERVER_A;
    }

    server {
        server_name SERVER_B;
        wallarm_mode off;
    }

    server {
        server_name SERVER_C;
        wallarm_mode off;

        location /main/content {
            wallarm_mode monitoring;
        }

        location /main/login {
            wallarm_mode block;
        }

        location /main/reset-password {
            wallarm_mode safe_blocking;
        }
    }
}
```

この例では、リソースに対して次のようなフィルタリングモードが定義されています:

1. `monitoring` モードが HTTP サーバーに送信されるリクエストに適用されます。
2. `monitoring` モードが仮想サーバー `SERVER_A` に送信されるリクエストに適用されます。
3. `off` モードが仮想サーバー `SERVER_B` に送信されるリクエストに適用されます。
4. `off` モードが仮想サーバー `SERVER_C` に送信されるリクエストに適用されますが、パスに `/main/content`、`/main/login`、または `/main/reset-password` が含まれるリクエストを除きます。
      1. `monitoring` モードが仮想サーバー `SERVER_C` に送信され、パスに `/main/content` が含まれるリクエストに適用されます。
      2. `block` モードが仮想サーバー `SERVER_C` に送信され、パスに `/main/login` が含まれるリクエストに適用されます。
      3. `safe_blocking` モードが仮想サーバー `SERVER_C` に送信され、パスに `/main/reset-password` が含まれるリクエストに適用されます。

### Wallarm Consoleで、一般フィルタリングルールを設定する

[US Wallarm Cloud](https://us1.my.wallarm.com/settings/general)または[EU Wallarm Cloud](https://my.wallarm.com/settings/general) の Wallarm Console 設定の **一般** タブ上のラジオボタンで、すべての着信リクエストの一般的なフィルタリングモードが定義されます。`http` ブロックに定義された `wallarm_mode` ディレクティブ値は、これらのボタンと同じアクションスコープを持ちます。

Wallarm Console の **ルール** タブ上のローカルフィルタリングモードの設定は、 **グローバル** タブ上のグローバル設定よりも高い優先順位があります。

**一般** タブでは、以下のフィルタリングモードのいずれかを指定できます。

* **ローカル設定（デフォルト）**：[`wallarm_mode` ディレクティブ](#wallarm_mode-ディレクティブでのフィルタリングモードの指定) で定義されたフィルタリングモードが適用されます
* [**モニタリング**](#利用可能なフィルタリングモード)
* [**安全ブロッキング**](#利用可能なフィルタリングモード)
* [**ブロッキング**](#利用可能なフィルタリングモード)

![!The general settings tab](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

!!! info "Wallarm Cloud とフィルタリングノードの同期"
    Wallarm Consoleで定義されたルールは、Wallarm Cloudとフィルタリングノードの同期プロセス中に適用され、2〜4分ごとに実行されます。

    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-ja.md)

### "Rules" タブでのフィルタリングルールの設定

Wallarm Console の **ルール** タブで、カスタム条件に一致するリクエストを処理するためのフィルタリングモードを細かく調整できます。これらのルールは、[Wallarm Console で設定された一般的なフィルタリングルール](#wallarm-console-で一般フィルタリングルールを設定する) よりも優先順位が高いです。

* [**ルール** タブでのルール作業の詳細はこちら→](../user-guides/rules/intro.md)
* [フィルタリングモードを管理するルールを作成するためのステップバイステップガイド→](../user-guides/rules/wallarm-mode-rule.md)

!!! info "Wallarm Cloud とフィルタリングノードの同期"
    Wallarm Consoleで定義されたルールは、Wallarm Cloud とフィルタリングノードの同期プロセス中に適用され、2〜4分ごとに実行されます。

    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-ja.md)`wallarm_mode_allow_override` を使用してフィルタリングモードの設定方法の優先度を設定する

!!! warning "`wallarm_mode_allow_override` ディレクティブの CDN ノードでのサポート"
    `wallarm_mode_allow_override` ディレクティブは、[Wallarm CDN ノード](../installation/cdn-node.md)では設定できません。

`wallarm_mode_allow_override` ディレクティブは、フィルタリングノードの設定ファイルの `wallarm_mode` ディレクティブの値を使用する代わりに、Wallarm Console で定義されたルールを適用する機能を管理します。

`wallarm_mode_allow_override` ディレクティブには、以下の値が有効です。

* `off`: Wallarm Console で指定されたルールは無視されます。設定ファイルの `wallarm_mode` ディレクティブで指定されたルールが適用されます。
* `strict`: 設定ファイルの `wallarm_mode` ディレクティブで定義されたものよりも厳密なフィルタリングモードを定義する Wallarm Cloud 内のルールのみが適用されます。

    穏やかなものから最も厳しいものまでの利用可能なフィルタリングモードが [上記](#available-filtration-modes) に記載されています。

* `on` (デフォルト): Wallarm Console で指定されたルールが適用されます。設定ファイルの `wallarm_mode` ディレクティブで指定されたルールは無視されます。

`wallarm_mode_allow_override` ディレクティブの値を定義できるコンテキストが、最もグローバルから最もローカルまでの順序で以下のリストに示されています。

* `http`: `http` ブロック内のディレクティブは、HTTP サーバーに送信された要求に適用されます。
* `server`: `server` ブロック内のディレクティブは、仮想サーバーに送信された要求に適用されます。
* `location`: `location` ブロック内のディレクティブは、その特定のパスを含む要求にのみ適用されます。

`http`, `server`, `location` ブロックで異なる `wallarm_mode_allow_override` ディレクティブ値が定義されている場合、最もローカルな設定が最も高い優先順位を持ちます。

**`wallarm_mode_allow_override` ディレクティブの使用例:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
        wallarm_mode_allow_override off;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode_allow_override on;
        
        location /main/login {
            wallarm_mode_allow_override strict;
        }
    }
}
```

この設定例では、Wallarm Console からのフィルタリングモードのルールが次のように適用されます。

1. Wallarm Console で定義されたフィルタリングモードのルールは、仮想サーバー `SERVER_A` に送信された要求には適用されません。`SERVER_A` サーバーに対応する `server` ブロックには `wallarm_mode` ディレクティブが指定されていないため、そのような要求には `http` ブロックで指定された `monitoring` フィルタリングモードが適用されます。
2. `/main/login` パスを除く仮想サーバー `SERVER_B` に送信された要求に対して、Wallarm Console で定義されたフィルタリングモードのルールが適用されます。
3. 仮想サーバー `SERVER_B` に送信され、パスに `/main/login` を含む要求に対しては、`monitoring` モードよりも厳密なフィルタリングモードを定義する Wallarm Console で定義されたフィルタリングモードのルールが適用されます。

## フィルタリングモードの設定例

上記で述べたすべての方法を使用してフィルタリングモードを設定する例を検討してみましょう。

### フィルタリングノードの設定ファイルでのフィルタリングモードの設定

```bash
http {
    
    wallarm_mode block;
        
    server { 
        server_name SERVER_A;
        wallarm_mode monitoring;
        wallarm_mode_allow_override off;
        
        location /main/login {
            wallarm_mode block;
            wallarm_mode_allow_override strict;
        }
        
        location /main/signup {
            wallarm_mode_allow_override strict;
        }
        
        location /main/apply {
            wallarm_mode block;
            wallarm_mode_allow_override on;
        }
    }
}
```

### Wallarm Console でのフィルタリングモードの設定

* [一般的なフィルタリングルール](#setting-up-the-general-filtration-rule-in-wallarm-console)：**モニタリング**
* [フィルタリングルール](#setting-up-the-filtration-rules-on-the-rules-tab)
    * 要求が以下の条件を満たす場合：
        * メソッド：`POST`
        * パスの最初の部分：`main`
        * パスの二番目の部分：`apply`
        
        その場合は、**デフォルト**のフィルタリングモードを適用します。
        
    * 要求が以下の条件を満たす場合：
        * パスの最初の部分：`main`
        
        その場合は、**ブロッキング** フィルタリングモードを適用します。
        
    * 要求が以下の条件を満たす場合：
        * パスの最初の部分：`main`
        * パスの二番目の部分：`login`
        
        その場合は、**モニタリング** フィルタリングモードを適用します。

### サーバー `SERVER_A` に送信された要求の例

設定されたサーバー `SERVER_A` に送信された要求の例と、Wallarm フィルタリングノードが適用するアクションは以下の通りです。

* `/news` パスの悪意のある要求は、サーバー `SERVER_A` の `wallarm_mode monitoring;` 設定のため、処理されますがブロックされません。

* `/main` パスの悪意のある要求は、サーバー `SERVER_A` の `wallarm_mode monitoring;` 設定のため、処理されますがブロックされません。

    Wallarm Console で定義された **ブロッキング** ルールは、サーバー `SERVER_A` の `wallarm_mode_allow_override off;` 設定のため適用されません。

* `/main/login` パスの悪意のある要求は、`/main/login` パスの要求に対して `wallarm_mode block;` 設定があるため、ブロックされます。

    フィルタリングノードの設定ファイルの `wallarm_mode_allow_override strict;` 設定のため、Wallarm Console で定義された **モニタリング** ルールは適用されません。

* `/main/signup` パスの悪意のある要求は、`/main/signup` パスの要求に対して `wallarm_mode_allow_override strict;` 設定があり、また、`/main` パスの要求に対して Wallarm Console で定義された **ブロッキング** ルールがあるため、ブロックされます。
* `GET` メソッドの `/main/apply` パスの悪意のある要求は、`/main/apply` パスの要求に対して `wallarm_mode_allow_override on;` 設定があり、また、`/main` パスの要求に対して Wallarm Console で定義された **ブロッキング** ルールがあるため、ブロックされます。
* `POST` メソッドの `/main/apply` パスの悪意のある要求は、`/main/apply` パスの要求に対して `wallarm_mode_allow_override on;` 設定があり、また、Wallarm Console で定義された **デフォルト** ルールがあり、さらに、フィルタリングノードの設定ファイルの `/main/apply` パスの要求に対して `wallarm_mode block;` 設定があるため、ブロックされます。