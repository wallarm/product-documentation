# All-in-Oneインストーラーでのデプロイ

All-in-Oneインストーラーは、Linuxベースの環境で[インラインでのトラフィックフィルタリング][inline-docs]を行うために、NGINXの動的モジュールとしてWallarmノードをインストールするよう設計されています。このインストーラーは、お使いのOSとNGINXのバージョンを自動的に判別し、必要な依存関係をすべてインストールします。

All-in-Oneインストーラーは、次の処理を自動で実行することで、ノードのインストールを簡単にします。

1. OSとNGINXのバージョンを確認します。
1. 検出されたOSとNGINXのバージョンに対応するWallarmリポジトリを追加します。
1. これらのリポジトリからWallarmパッケージをインストールします。
1. インストール済みのWallarmモジュールをNGINXに接続します。
1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続します。

## ユースケース

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## 要件

--8<-- "../include/waf/installation/all-in-one-requirements-latest.md"

## 手順1: NGINXと依存関係をインストールします

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## 手順2: Wallarmトークンを準備します

--8<-- "../include/waf/installation/all-in-one-token.md"

## 手順3: All-in-OneのWallarmインストーラーをダウンロードします

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## 手順4: All-in-OneのWallarmインストーラーを実行します

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

以降の手順で使用するコマンドは、x86_64およびARM64のインストールで同一です。

## 手順5: トラフィック解析のためにWallarmノードを有効化します

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 手順6: NGINXを再起動します

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## 手順7: トラフィックをWallarmノードに送信するよう設定します

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 手順8: Wallarmノードの動作をテストします

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 手順9: デプロイ済みソリューションを微調整します

デフォルト設定の動的Wallarmモジュールがインストールされています。フィルタリングノードは、デプロイ後に追加の設定が必要になる場合があります。

Wallarmの設定は、[NGINXディレクティブ][waf-directives-instr]またはWallarm Console UIで定義します。ディレクティブは、Wallarmノードがあるマシン上の次のファイルに設定します。

* `/etc/nginx/sites-available/default`（サーバーレベルおよびlocationレベルの設定）
* `/etc/nginx/nginx.conf`（httpレベルの設定）
* `/etc/nginx/wallarm-status.conf`（Wallarmノードの監視設定。詳細は[リンク][wallarm-status-instr]にあります）

以下に、必要に応じて適用できる代表的な設定をいくつか示します。

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノードへのリソース割り当て][memory-instr]
* [Wallarmノード変数のログ出力][logging-instr]
* [フィルタリングノード背後のプロキシサーバーのバランサーを使用する][proxy-balancer-instr]
* [ディレクティブ`wallarm_process_time_limit`で単一リクエストの処理時間を制限する][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`でサーバー応答の待機時間を制限する](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`で最大リクエストサイズを制限する](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]

## 起動オプション

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## インストールを最初からやり直す

Wallarmノードのインストールを削除して最初からやり直す必要がある場合は、以下の手順に従ってください。

!!! warning "インストールのやり直しによる影響"
    インストールをやり直すと、稼働中のWallarmサービスを停止して削除することになり、再インストールが完了するまでトラフィックのフィルタリングが一時停止します。本番環境や重要なトラフィックを扱う環境では、トラフィックがフィルタリングされずリスクが生じるため、注意してください。

    既存ノードをアップグレードする場合（例: 4.10から5.0）は、[アップグレード手順][upgrade-docs]を参照してください。

1. Wallarmプロセスを終了し、設定ファイルを削除します:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. [手順2](#step-2-prepare-wallarm-token)のセットアップ手順に従って、再インストールを続行します。