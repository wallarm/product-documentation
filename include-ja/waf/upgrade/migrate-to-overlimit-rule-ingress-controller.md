バージョン3.6以降、Wallarm Consoleのルールを使用して`overlimit_res`攻撃検出を細かく調整できます。

従来は、[`wallarm_process_time_limit`][nginx-process-time-limit-docs]と[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]のNGINXディレクティブが使用されていました。これらのディレクティブは新しいルールのリリースに伴い非推奨となり、今後のリリースで削除されます。

上記のディレクティブで`overlimit_res`攻撃検出の設定をカスタマイズしている場合は、次のようにルールへ移行することを推奨します：

1. Wallarm Console → **Rules**を開き、[**Limit request processing time**][overlimit-res-rule-docs]ルールの設定に進みます。
1. NGINXディレクティブで行っていたのと同様にルールを構成します：

    * ルール条件は、`wallarm_process_time_limit`および`wallarm_process_time_limit_block`ディレクティブが指定されたNGINXの設定ブロックに一致するように設定します。
    * ノードが1件のリクエストを処理する時間の上限（ミリ秒）：`wallarm_process_time_limit`の値。
    
        !!! warning "システムメモリ枯渇のリスク"
            時間上限を高く設定した場合や、上限超過後もリクエスト処理を継続する設定にした場合、メモリ枯渇や時間内に完了しないリクエスト処理を引き起こす可能性があります。
        
    * ノードは、[ノードのフィルタリングモード][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックするか通過させます：

        * **monitoring**モードでは、ノードは元のリクエストをアプリケーションのアドレスに転送します。アプリケーションには、処理済み部分と未処理部分の双方に含まれる攻撃に悪用されるリスクがあります。
        * **safe blocking**モードでは、リクエストの送信元が[graylisted][graylist-docs]IPアドレスの場合、ノードはリクエストをブロックします。そうでない場合、ノードは元のリクエストをアプリケーションのアドレスに転送します。アプリケーションには、処理済み部分と未処理部分の双方に含まれる攻撃に悪用されるリスクがあります。
        * **block**モードでは、ノードはリクエストをブロックします。
1. `values.yaml`の設定ファイルから`wallarm_process_time_limit`および`wallarm_process_time_limit_block`のNGINXディレクティブを削除します。

    `overlimit_res`攻撃検出をディレクティブとルールの両方で微調整している場合、ノードはルールの設定に従ってリクエストを処理します。