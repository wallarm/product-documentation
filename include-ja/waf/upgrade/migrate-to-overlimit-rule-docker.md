バージョン3.6以降、Wallarm Consoleのルールを使用して`overlimit_res`攻撃の検出を微調整できます。

以前は、[`wallarm_process_time_limit`][nginx-process-time-limit-docs]および[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]のNGINXディレクティブが使用されていました。

これらのディレクティブとパラメータは新しいルールのリリースに伴い非推奨となり、将来のリリースで削除されます。

上記のパラメータで`overlimit_res`攻撃の検出設定をカスタマイズしている場合は、次の手順でルールに移行することを推奨します:

1. Wallarm Console → **Rules**を開き、[**Limit request processing time**][overlimit-res-rule-docs]ルールの設定に進みます。
1. マウントされた設定ファイルと同様にルールを設定します:

    * ノードが単一のリクエストを処理する時間上限(ミリ秒): `wallarm_process_time_limit`または`process_time_limit`の値です。
    
        !!! warning "システムメモリ枯渇のリスク"
            時間上限を高く設定した場合や、上限超過後もリクエスト処理を継続する設定にした場合、メモリを使い果たしたり、時間内にリクエストを処理できなくなる可能性があります。
    
    * ノードは[ノードのフィルタリングモード][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックするか通過させます:

        * **monitoring**モードでは、ノードはオリジナルのリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済み部分と未処理部分の両方に含まれる攻撃に悪用されるリスクがあります。
        * **safe blocking**モードでは、ノードは[graylisted][graylist-docs] IPアドレスからのリクエストであればブロックします。そうでない場合、ノードはオリジナルのリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済み部分と未処理部分の両方に含まれる攻撃に悪用されるリスクがあります。
        * **block**モードでは、ノードはリクエストをブロックします。
1. マウントされた設定ファイルから`wallarm_process_time_limit`、`wallarm_process_time_limit_block`のNGINXディレクティブを削除します。

    `overlimit_res`攻撃の検出がパラメータとルールの両方で微調整されている場合、ノードはルールの設定に従ってリクエストを処理します。