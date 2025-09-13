[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# Docker NGINXベースイメージのアップグレード

本手順では、稼働中のDocker NGINXベースイメージを最新の6.xにアップグレードする手順を説明します。

!!! warning "既存のWallarm nodeの認証情報の使用"
    以前のバージョンの既存のWallarm nodeを使用することは推奨しません。本手順に従い、6.xバージョンの新しいフィルタリングノードを作成し、Dockerコンテナとしてデプロイしてください。

サポート終了のノード（3.6以下）をアップグレードする場合は、[別の手順](older-versions/docker-container.md)をご利用ください。

## 要件

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## 手順1: 更新されたフィルタリングノードイメージをダウンロードする

``` bash
docker pull wallarm/node:6.4.1
```

## 手順2: 実行中のコンテナを停止する

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## 手順3: 新しいイメージでコンテナを実行する

1. バージョン5.x以前からアップグレードする場合は、以下の重要な変更点に注意してください:

    * 以前に環境変数`TARANTOOL_MEMORY_GB`でpostanalyticsメモリを設定していた場合は、`SLAB_ALLOC_ARENA`に名称を変更してください。
    * カスタムNGINX設定ファイルをマウントしてDockerコンテナを実行している場合:

        * Alpine Linuxのディレクトリ規約に合わせ、`/etc/nginx/nginx.conf`内の`include`パスが変更されました:

            ```diff
            ...

            - include /etc/nginx/modules-enabled/*.conf;
            + include /etc/nginx/modules/*.conf;

            ...

            http {
            -     include /etc/nginx/sites-enabled/*;
            +     include /etc/nginx/http.d/*;
            }
            ```
        
        * `/etc/nginx/conf.d/wallarm-status.conf`内で、許可するIPアドレスを定義する`allow`ディレクティブのデフォルト値が変更されました:

            ```diff
            ...

            - allow 127.0.0.8/8;
            + allow 127.0.0.0/8;

            ...
            ```
        
        * バーチャルホストの設定ファイルをマウントするパスは、`/etc/nginx/sites-enabled/default`から`/etc/nginx/http.d`に変更されました。
1. Wallarm Console → **Settings** → **API Tokens**に進み、使用タイプが**Node deployment/Deployment**のトークンを生成します。
1. 生成したトークンをコピーします。
1. 新しいイメージでコンテナを実行し、更新された設定を適用します。
    
    更新されたイメージでコンテナを実行する方法は2通りあります:

    * [環境変数を渡してコンテナを実行](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [設定ファイルをマウントしてコンテナを実行](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## 手順4: フィルタリングノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 手順5: 以前のバージョンのフィルタリングノードを削除する

デプロイ済みの6.xイメージが正しく動作している場合は、Wallarm Console → **Nodes**で以前のバージョンのフィルタリングノードを削除できます。