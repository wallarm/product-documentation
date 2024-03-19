[acl-access-phase]:     ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 

# フィルタリングモードの設定

フィルタリングモードは、着信リクエストの処理時のフィルタリングノードの動作を定義します。これらの指示は、利用可能なフィルタリングモードとその設定方法を説明します。

## 利用可能なフィルタリングモード

Wallarmのフィルタリングノードは、次のモード（最も軽度から最も厳格まで）で着信要求を処理できます：

* **無効化** (`off`)
* **監視** (`monitoring`)
* **安全ブロック** (`safe_blocking`)
* **ブロック** (`block`)

--8<-- "../include-ja/wallarm-modes-description-latest.md"

## フィルタリングモード設定の方法

フィルタリングモードは以下の方法で設定できます：

* フィルタリングノードの設定ファイルの`wallarm_mode`ディレクティブに値を割り当てる

    !!! warning "CDNノードの`wallarm_mode`ディレクティブのサポート"
        ご了承ください、`wallarm_mode`ディレクティブは[Wallarm CDNノード](../installation/cdn-node.md)で設定できません。CDNノードのフィルタリングモードを設定するには、他の利用可能な方法を使用してください。
* Wallarmコンソールで一般的なフィルタリングルールを定義する
* Wallarmコンソールの**Rules**セクションでフィルタリングモードルールを作成する

フィルタリングモード設定方法の優先度は、[`wallarm_mode_allow_override`ディレクティブ](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override)で決定されます。デフォルトでは、Wallarmコンソールで指定された設定は、その値の深刻度に関係なく`wallarm_mode`ディレクティブよりも優先度が高いです。

### `wallarm_mode`ディレクティブでフィルタリングモードを指定する

!!! warning "CDNノードの`wallarm_mode`ディレクティブのサポート"
    ご了承ください、`wallarm_mode`ディレクティブは[Wallarm CDNノード](../installation/cdn-node.md)で設定できません。CDNノードのフィルタリングモードを設定するには、他の利用可能な方法を使用してください。

フィルタリングノードの設定ファイルの`wallarm_mode`ディレクティブを使用して、さまざまなコンテキストのフィルタリングモードを定義できます。これらのコンテキストは以下のリストで最もグローバルから最もローカルに順序付けされています：

* `http`: `http`ブロック内のディレクティブはHTTPサーバへ送信されたリクエストに適用されます。
* `server`: `server`ブロック内のディレクティブは、バーチャルサーバへ送信されたリクエストに適用されます。
* `location`: `location`ブロック内のディレクティブは、その特定のパスを含むリクエストにのみ適用されます。

`http`、`server`、`location`ブロックで異なる`wallarm_mode`ディレクティブの値が定義されている場合、最もローカルの設定が最優先となります。

**`wallarm_mode`ディレクティブ使用例：**

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

この例では、リソースのフィルタリングモードは次のように定義されています：

1. `monitoring`モードは、HTTPサーバへ送信されたリクエストに適用されます。
2. `monitoring`モードは、バーチャルサーバ`SERVER_A`へ送信されたリクエストに適用されます。
3. `off`モードは、バーチャルサーバ`SERVER_B`へ送信されたリクエストに適用されます。
4. `off`モードは、`/main/content`、`/main/login`、または`/main/reset-password`パスを含むリクエストを除く、バーチャルサーバ`SERVER_C`へ送信されたリクエストに適用されます。
      1. `monitoring`モードは、`/main/content`パスを含むバーチャルサーバ`SERVER_C`へ送信されたリクエストに適用されます。
      2. `block`モードは、`/main/login`パスを含むバーチャルサーバ`SERVER_C`へ送信されたリクエストに適用されます。
      3. `safe_blocking`モードは、`/main/reset-password`パスを含むバーチャルサーバ`SERVER_C`へ送信されたリクエストに適用されます。

### Wallarmコンソールで一般的なフィルタリングルールを設定する

[US Wallarm Cloud](https://us1.my.wallarm.com/settings/general)または[EU Wallarm Cloud](https://my.wallarm.com/settings/general)のWallarmコンソール設定の**General**タブのラジオボタンは、すべての入力リクエストに対する一般的なフィルタリングモードを定義します。`http`ブロックの設定ファイルに定義された`wallarm_mode`ディレクティブの値とこれらのボタンは同じアクション範囲を持ちます。

Wallarmコンソールの**Rules**タブのローカルフィルタリングモード設定は、**Global**タブのグローバル設定よりも優先度が高いです。

**General**タブでは、次のいずれかのフィルタリングモードを指定できます：

* **ローカル設定（デフォルト）**：[`wallarm_mode`ディレクティブ](#specifying-the-filtering-mode-in-the-wallarm_mode-directive)を使用して定義されたフィルタリングモードが適用されます
* [**監視**](#available-filtration-modes)
* [**安全ブロック**](#available-filtration-modes)
* [**ブロック**](#available-filtration-modes)
    
![The general settings tab](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

!!! info "Wallarm Cloudとフィルタリングノードの同期"
    Wallarmコンソールで定義されたルールは、Wallarm Cloudとフィルタリングノードの同期プロセス中に適用されます。このプロセスは、2～4分ごとに行われます。

    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-en.md)

### "Rules"タブでフィルタリングルールを設定する

Wallarmコンソールの**Rules**タブで、カスタム条件に一致するリクエストの処理に対するフィルタリングモードを微調整できます。これらのルールは、[Wallarmコンソールで設定された一般的なフィルタリングルール](#setting-up-the-general-filtration-rule-in-wallarm-console)よりも優先度が高いです。

* [**Rules**タブでのルール作業の詳細 →](../user-guides/rules/rules.md)
* [フィルタリングモードを管理するルールの作成ガイド →](../admin-en/configure-wallarm-mode.md)

!!! info "Wallarm Cloudとフィルタリングノードの同期"
    Wallarmコンソールで定義されたルールは、Wallarm Cloudとフィルタリングノードの同期プロセス中に適用されます。このプロセスは、2～4分ごとに行われます。

    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-en.md)

### `wallarm_mode_allow_override`を使用したフィルタリングモード設定方法の優先度設定

!!! warning "CDNノードの`wallarm_mode_allow_override`ディレクティブのサポート"
    ご了承ください、`wallarm_mode_allow_override`ディレクティブは[Wallarm CDNノード](../installation/cdn-node.md)で設定できません。

`wallarm_mode_allow_override`ディレクティブは、Wallarmコンソール上で定義されたルールを`wallarm_mode`ディレクティブの値を使用してフィルタリングノードの設定ファイルから適用する能力を管理します。

`wallarm_mode_allow_override`ディレクティブには以下の値が有効です：

* `off`: Wallarmコンソールで指定されたルールは無視されます。設定ファイルの`wallarm_mode`ディレクティブで指定されたルールが適用されます。
* `strict`: 設定ファイルの`wallarm_mode`ディレクティブで定義されたものよりも厳格なフィルタリングモードを定義するWallarm Cloudで指定されたルールのみが適用されます。

    利用可能なフィルタリングモードを最も軽度から最も厳格に順序付けたものが[上記](#available-filtration-modes)に記載されています。

* `on`（デフォルト）：Wallarmコンソールで指定されたルールが適用されます。設定ファイルの`wallarm_mode`ディレクティブで指定されたルールは無視されます。

`wallarm_mode_allow_override`ディレクティブの値が定義できるコンテキストは、最もグローバルから最もローカルの順で、次のリストに示されています：

* `http`: `http`ブロック内のディレクティブはHTTPサーバへ送信されたリクエストに適用されます。
* `server`: `server`ブロック内のディレクティブは、バーチャルサーバへ送信されたリクエストに適用されます。
* `location`: `location`ブロック内のディレクティブは、その特定のパスを含むリクエストにのみ適用されます。

`http`、`server`、`location`ブロックで異なる`wallarm_mode_allow_override`ディレクティブの値が定義されている場合、最もローカルの設定が最高の優先度となります。

**`wallarm_mode_allow_override`ディレクティブ使用例：**

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

この設定例は、次のとおりWallarmコンソールからのフィルタリングモードルール適用を結果とします：

1. バーチャルサーバ`SERVER_A`へ送信されたリクエストに対してWallarmコンソールで定義されたフィルタリングモードルールは無視されます。`SERVER_A`サーバに対応する`server`ブロックで`wallarm_mode`ディレクティブが指定されていないため、そのようなリクエストに対しては`http`ブロックで指定された`monitoring`フィルタリングモードが適用されます。
2. `/main/login`パスを含まないバーチャルサーバ`SERVER_B`へ送信されたリクエストに対してWallarmコンソールで定義されたフィルタリングモードルールが適用されます。
3. `/main/login`パスを含むバーチャルサーバ`SERVER_B`へ送信されたリクエストは、Wallarmコンソールで定義されたルールが`monitoring`モードよりも厳格なフィルタリングモードを定義する場合にのみ適用されます。

## フィルタリングモードの設定例

上記で述べたすべての方法を使用したフィルタリングモード設定の例を考えてみましょう。

### フィルタリングノードの設定ファイルでのフィルタリングモード設定

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

### Wallarmコンソールでのフィルタリングモード設定

* [一般的なフィルタリングルール](#setting-up-the-general-filtration-rule-in-wallarm-console)：**監視**。
* [フィルタリングルール](#setting-up-the-filtration-rules-on-the-rules-tab)：
    * リクエストが以下の条件を満たしている場合：
        * メソッド：`POST`
        * パスの第1部分：`main`
        * パスの第2部分：`apply`,
        
        その後は**デフォルト**のフィルタリングモードを適用します。
        
    * リクエストが以下の条件を満たす場合：
        * パスの第1部分：`main`,
        
        その後は**ブロック**のフィルタリングモードを適用します。
        
    * リクエストが以下の条件を満たす場合：
        * パスの第1部分：`main`
        * パスの第2部分：`login`,
        
        その後は**監視**のフィルタリングモードを適用します。

### `SERVER_A`サーバへ送信されるリクエスト例

設定されたサーバー`SERVER_A`へ送信されるリクエストの例と、Wallarmフィルタリングノードが適用するアクションは以下の通りです：

* `/news`パスを持つ悪意のあるリクエストは処理されますが、サーバー`SERVER_A`の`wallarm_mode monitoring;`設定のためブロックされません。

* `/main`パスを持つ悪意のあるリクエストは処理されますが、サーバー`SERVER_A`の`wallarm_mode monitoring;`設定のためブロックされません。

    Wallarmコンソールで定義された**Blocking**ルールは、サーバー`SERVER_A`の`wallarm_mode_allow_override off;`設定のため適用されません。

* `/main/login`パスを持つ悪意のあるリクエストは、`wallarm_mode block;`設定が`/main/login`パスを持つリクエストに適用されるためブロックされます。

    フィルタリングノードの設定ファイルの`wallarm_mode_allow_override strict;`設定のため、Wallarmコンソールで定義された**Monitoring**ルールは適用されません。

* `/main/signup`パスを持つ悪意のあるリクエストは、`/main/signup`パスを持つリクエストに対する`wallarm_mode_allow_override strict;`設定と、`/main`パスを持つリクエストに対するWallarmコンソールで定義された**Blocking**ルールのため、ブロックされます。
* `GET`方法で`/main/apply`パスを持つ悪意のあるリクエストは、`/main/apply`パスを持つリクエストに対する`wallarm_mode_allow_override on;`設定と、`/main`パスを持つリクエストに対するWallarmコンソールで定義された**Blocking**ルールのため、ブロックされます。
* `POST`方法で`/main/apply`パスを持つ悪意のあるリクエストは、`/main/apply`パスを持つリクエストに対する`wallarm_mode_allow_override on;`設定と、Wallarmコンソールで定義された**Default**ルールと、フィルタリングノードの設定ファイルの`/main/apply`パスを持つリクエストに対する`wallarm_mode block;`設定のため、ブロックされます。