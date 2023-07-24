# ノードの操作に必要なファイルへのアクセス権の設定

通常、`wallarm-worker`および`nginx`サービスは、proton.dbやカスタムルールセットファイルなど、フィルタリングノードの操作に必要なファイルの内容を読み取る権限が自動的に付与されます。しかし、テストでアクセスがないことが示された場合は、以下で権限がどのように提供され、どのように手動で設定できるかについて説明しています。

## ファイルへのアクセスの設定

ノードの操作に必要なファイルへのアクセスを提供するパラメータは、`node.yaml`ファイル内で明示的に設定することができます。このファイルは、`register-node`スクリプトを実行した後に自動的に作成されます。ファイルへのデフォルトのパスは`/etc/wallarm/node.yaml`です。このパスは[`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf)ディレクティブを介して変更することができます。

`node.yaml`ファイルには、以下のファイルアクセスパラメータを含めることができます：

| パラメータ | 説明 |
|--------------|-------------|
| `syncnode.owner` | フィルタリングノードの操作に必要なファイルの所有者。 |
| `syncnode.group` | フィルタリングノードの操作に必要なファイルのグループ。 |
| `syncnode.mode`  | フィルタリングノードの操作に必要なファイルへのアクセス権。 |

アルゴリズムは、以下の手順を実行してファイルの権限を検索します（前の手順が結果を得られなかった場合にのみ次の手順に進みます）：

1. `node.yaml`ファイル内で明示的に設定された`syncnode.(TYPE).(user,group,mode)`パラメータ。

    `(TYPE)`を使用して、パラメータが設定されている特定のファイルを指定できます。可能な値は`proton.db`または`lom`です。

    !!! 警告： "`lom`の値の意味"
        `lom`の値が[カスタムルールセット](../user-guides/rules/compiling.md)ファイル`/etc/wallarm/custom_ruleset`を指していることに注意してください。

1. `node.yaml`ファイル内で明示的に設定された`syncnode.(user,group,mode)`パラメータ。
1. NGINXベースのインストールの場合、`/usr/share/wallarm-common/engine/*`ファイル内の`nginx_group`の値。

    インストールされているすべてのエンジンパッケージは、`nginx_group=<VALUE>`を含むファイル`/usr/share/wallarm-common/engine/*`を提供します。

    モジュールのあるパッケージは、それが意図されたNGINXに応じて`group`パラメータの値を設定します：

    * nginx.orgからのNGINXのためのモジュールは`group`を`nginx`に設定します。
    * NGINXディストリビューション用モジュールは`group`を`www-data`に設定します。
    * カスタムモジュールは、クライアントによって提供された値を使用します。

1. デフォルト：
    * `owner`：`root`
    * `group`：`wallarm`
    * `mode`：`0640`

アルゴリズムが自動的に達成した結果があなたのニーズに合わない場合のみ、明示的にアクセス権を設定する必要があることに注意してください。アクセス権を設定した後、`wallarm-worker`と`nginx`サービスがフィルタリングノードの操作に必要なファイルの内容を読み取ることができることを確認してください。

## 設定例

`node.yaml`ファイルには、この記事で説明されているファイルアクセスパラメータ（`syncnode`セクション）のほかに、フィルタリングノードが[クラウドへのアクセス](configure-cloud-node-synchronization-en.md)を提供するパラメータ（一般および`api`セクション）も含まれることに注意してください。

--8<-- "../include/node-cloud-sync-configuration-example.md"