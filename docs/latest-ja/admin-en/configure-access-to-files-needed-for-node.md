					# ノード運用に必要なファイルへのアクセス権を設定する

通常、`wallarm-worker`と`nginx`のサービスは、proton.dbやカスタムルールセットファイルなど、フィルタリングノードの運用に必要なファイルの内容を読むための権限が自動的に与えられます。しかし、テストがアクセスを示さない場合は、以下に権限がどのように与えられ、どのように手動で設定できるかの説明を読んでください。

## ファイルアクセスの設定

ノードの運用に必要なファイルへのアクセスを提供するパラメータは、`node.yaml`ファイルで明示的に設定することができます。このファイルは`register-node`スクリプトを実行した後に自動的に作成されます。ファイルへのデフォルトのパスは`/etc/wallarm/node.yaml`です。このパスは[`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf)ディレクティブを通じて変更することができます。

`node.yaml`ファイルには、以下のファイルアクセスパラメータが含まれることがあります：

| パラメータ    | 説明 |
|--------------|-------------|
| `syncnode.owner` | フィルタリングノードの運用に必要なファイルの所有者。 |
| `syncnode.group` | フィルタリングノードの運用に必要なファイルのグループ。 |
| `syncnode.mode`  | フィルタリングノードの運用に必要なファイルへのアクセス権。 |

アルゴリズムはファイル権限を検索し、以下の手順を実行します（前の手順が結果を出さなかった場合のみ次の手順を行います）：

1. `node.yaml`ファイルの明示的に設定された`syncnode.(TYPE).(user,group,mode)`パラメータ。

    `(TYPE)`は、パラメータが設定されている特定のファイルを指定することができます。可能な値は`proton.db`または`lom`です。

    !!! warning "`lom` value meaning"
         `lom`値が[カスタムルールセット](../user-guides/rules/rules.md)ファイル`/etc/wallarm/custom_ruleset` を指していることに注意してください。

1. `node.yaml`ファイル内の明示的に設定された`syncnode.(user,group,mode)`パラメータ。
1. NGINXベースのインストールの場合、`/usr/share/wallarm-common/engine/*`ファイルの`nginx_group`の値。

    すべてのインストール済みエンジンパッケージは、`nginx_group=<VALUE>`を含むファイル`/usr/share/wallarm-common/engine/*`を提供します。

    モジュールが含まれた各パッケージは、想定されているNGINXに応じて`group`パラメータの値を設定します：

    * nginx.orgからのNGINX用のモジュールは`group`を`nginx`に設定します。
    * NGINXディストリビューション用のモジュールは`group`を`www-data`に設定します。
    * カスタムモジュールは、クライアントが提供する値を使用します。

1. デフォルト：
    * `owner`: `root`
    * `group`: `wallarm`
    * `mode`: `0640`

アルゴリズムが自動的に行う結果があなたのニーズに合わない場合のみ、明示的にアクセス権を設定する必要があることに注意してください。アクセス権を設定した後、`wallarm-worker`と`nginx`のサービスがフィルタリングノードの運用に必要なファイルの内容を読むことができることを確認してください。

## 設定例

`node.yaml`ファイルは、この記事で説明されているファイルアクセスパラメータ(`syncnode`セクション)に加えて、フィルタリングノードの[Cloudへのアクセス](configure-cloud-node-synchronization-en.md)（一般セクションと`api`セクション）を提供するパラメータも含むことに注意してください。

--8<-- "../include-ja/node-cloud-sync-configuration-example.md"
