Starting from the version 3.6, Wallarm Console のルールを使用して `overlimit_res` 攻撃検知を微調整できます。

以前は、以下のオプションが使用されていました：

* [`wallarm_process_time_limit`][nginx-process-time-limit-docs] および [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINXディレクティブ  
<!-- * [`process_time_limit`][envoy-process-time-limit-docs] および [`process_time_limit_block`][envoy-process-time-limit-block-docs] Envoyパラメータ -->

これらのディレクティブおよびパラメータは、新しいルールのリリースに伴い非推奨とされ、今後のリリースで削除されます。

一覧のパラメータを用いて `overlimit_res` 攻撃検知設定をカスタマイズしている場合、以下の手順に従ってルールに移行することを推奨します：

1. Wallarm Console → **Rules** にアクセスして、[**Limit request processing time**][overlimit-res-rule-docs] ルール設定に進みます。
1. マウントされた設定ファイルで実施されたようにルールを設定します：

    <!-- * ルール条件は、`wallarm_process_time_limit` および `wallarm_process_time_limit_block` ディレクティブまたは `process_time_limit` および `process_time_limit_block` パラメータが指定された NGINX または Envoy の設定ブロックと一致する必要があります。 -->
    * ノードが単一リクエストを処理する時間制限（ミリ秒）：`wallarm_process_time_limit` または `process_time_limit` の値。

        !!! warning "システムメモリ枯渇のリスク"
            高い時間制限および/または制限超過後のリクエスト処理の継続は、メモリの枯渇や時間切れによるリクエスト処理を引き起こす可能性があります。

    * ノードは [node filtration mode][waf-mode-instr] に基づいて `overlimit_res` 攻撃をブロックまたは通過させます：

        * **monitoring** モードの場合、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済みおよび未処理のリクエスト部分に含まれる攻撃によって悪用されるリスクがあります。
        * **safe blocking** モードの場合、[graylisted][graylist-docs] IPアドレスから発生したリクエストはノードがブロックします。それ以外の場合、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済みおよび未処理のリクエスト部分に含まれる攻撃によって悪用されるリスクがあります。
        * **block** モードの場合、ノードはリクエストをブロックします。
1. マウントされた設定ファイルから `wallarm_process_time_limit`、`wallarm_process_time_limit_block` NGINXディレクティブを削除します。

もし、パラメータとルールの両方で `overlimit_res` 攻撃検知の微調整が行われている場合、ノードはルールに従ってリクエストを処理します。