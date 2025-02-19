Starting from version 3.6, Wallarm Consoleのルールを用いて`overlimit_res`攻撃検出の微調整が可能です。

以前は、[`wallarm_process_time_limit`][nginx-process-time-limit-docs]および[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINXディレクティブが使用されていました。これらのディレクティブは新しいルールリリースに伴い非推奨とされ、将来のリリースで削除される予定です。

`overlimit_res`攻撃検出設定を上記ディレクティブでカスタマイズしている場合は、次の手順に従ってルールへ移行することを推奨します。

1. Wallarm Console → **Rules**を開き、[**Limit request processing time**][overlimit-res-rule-docs]ルールの設定に進みます。
1. NGINXディレクティブで行っていた設定と同様にルールを設定します:
    * ルール条件は、`wallarm_process_time_limit`および`wallarm_process_time_limit_block`ディレクティブが指定されたNGINXの設定ブロックと一致する必要があります。
    * 単一のリクエストを処理するためのノードのタイムリミット（ミリ秒）：`wallarm_process_time_limit`の値を設定します。
    
        !!! warning "システムメモリ不足のリスク"
            高いタイムリミットおよび/またはリミット超過後のリクエスト処理の継続により、メモリ枯渇または処理時間切れのリスクが発生します。
        
    * ノードは[node filtration mode][waf-mode-instr]に従い、`overlimit_res`攻撃をブロックまたは通過させます:
        * **monitoring**モードでは、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済み部分と未処理部分の双方に含まれる攻撃によって悪用されるリスクがあります。
        * **safe blocking**モードでは、リクエストの発信元が[graylisted][graylist-docs] IPアドレスである場合にノードがリクエストをブロックします。それ以外の場合、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済み部分と未処理部分の双方に含まれる攻撃によって悪用されるリスクがあります。
        * **block**モードでは、ノードがリクエストをブロックします。
1. `values.yaml`構成ファイルから`wallarm_process_time_limit`および`wallarm_process_time_limit_block` NGINXディレクティブを削除します。

`overlimit_res`攻撃検出がディレクティブとルールの両方で微調整されている場合、ノードはルール設定に従ってリクエストを処理します。