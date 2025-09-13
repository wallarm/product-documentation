バージョン3.6以降、Wallarm Consoleのルールを使用して`overlimit_res`攻撃の検出を細かく調整できます。

これまでは、[`wallarm_process_time_limit`][nginx-process-time-limit-docs]と[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]のNGINXディレクティブが使用されていました。新しいルールのリリースに伴い、これらのディレクティブは非推奨となり、今後のリリースで削除される予定です。

上記のディレクティブで`overlimit_res`攻撃の検出設定をカスタマイズしている場合は、次の手順で設定をルールへ移行することを推奨します:

1. Wallarm Console → **Rules**を開き、[**Limit request processing time**][overlimit-res-rule-docs]ルールの設定に進みます。
1. NGINXディレクティブで行っていた内容に合わせてルールを設定します:

    * ルール条件は、`wallarm_process_time_limit`および`wallarm_process_time_limit_block`ディレクティブが指定されたNGINXの設定ブロックに一致するようにします。
    * ノードが単一のリクエストを処理するための時間制限（ミリ秒）：`wallarm_process_time_limit`の値。
    
        !!! warning "システムメモリ枯渇のリスク"
            高い時間制限の設定や、制限超過後もリクエスト処理を継続する設定は、メモリ枯渇や許容時間を超えたリクエスト処理を引き起こす可能性があります。
    
    * ノードは、[ノードのフィルタリングモード][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックするか通過させます:

        * **monitoring**モードでは、ノードは元のリクエストをアプリケーションのアドレスに転送します。アプリケーションは、処理済み部分と未処理部分の両方に含まれる攻撃に悪用されるリスクがあります。
        * **safe blocking**モードでは、リクエストの送信元が[graylisted][graylist-docs]のIPアドレスである場合、ノードはリクエストをブロックします。それ以外の場合、ノードは元のリクエストをアプリケーションのアドレスに転送します。アプリケーションは、処理済み部分と未処理部分の両方に含まれる攻撃に悪用されるリスクがあります。
        * **block**モードでは、ノードはリクエストをブロックします。
1. NGINXの設定ファイルから`wallarm_process_time_limit`と`wallarm_process_time_limit_block`のNGINXディレクティブを削除します。

    `overlimit_res`攻撃の検出がディレクティブとルールの両方で微調整されている場合、ノードはルールの設定に従ってリクエストを処理します。