バージョン3.6から、Wallarm Consoleのルールを使用して `overlimit_res` の攻撃検出を微調整できるようになりました。

以前は、[`wallarm_process_time_limit`][nginx-process-time-limit-docs] および [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] のNGINXディレクティブが使用されていました。上記のディレクティブは、新しいルールリリースで非推奨と見なされ、今後のリリースで削除される予定です。

`overlimit_res` 攻撃検出設定がリストされたディレクティブ経由でカスタマイズされている場合、次のようにルールに転送することが推奨されます:

1. Wallarm Console を開き、**Rules** に進み、[**overlimit_res 攻撃検出の微調整**][overlimit-res-rule-docs]ルール設定を行います。
1. ルールをNGINXディレクティブのように設定します:

    * ルール条件は、`wallarm_process_time_limit` および `wallarm_process_time_limit_block` ディレクティブが指定されている NGINX の設定ブロックと一致する必要があります。
    * ノードが1つのリクエストを処理するための時間制限（ミリ秒）：`wallarm_process_time_limit` の値。
    * リクエスト処理: **Stop processing** オプションが推奨されます。
    
        !!! warning "システムメモリ不足のリスク"
            高い時間制限および/または制限を超えた後のリクエスト処理の継続が、メモリ枯渇や時間内に処理されないリクエストを引き起こす可能性があります。
    
    * overlimit_res 攻撃を登録する:**Register and display in the events** オプションが推奨されます。

        `wallarm_process_time_limit_block` または `process_time_limit_block` の値が `off` の場合、**Do not create attack event** オプションを選択してください。
    
    * ルールは `wallarm_process_time_limit_block` ディレクティブに対する明示的な同等オプションを持っていません。ルールが **Register and display in the events** を設定すると、ノードは [ノードフィルタリングモード][waf-mode-instr] に応じて `overlimit_res` 攻撃をブロックまたは通過させます。

        * **monitoring** モードでは、ノードはオリジナルのリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **safe blocking** モードでは、リクエストの送信元が [グレイリストに登録された][graylist-docs] IPアドレスの場合、ノードはリクエストをブロックします。それ以外の場合、ノードはオリジナルのリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **block** モードでは、ノードはリクエストをブロックします。
1. `values.yaml` 設定ファイルから `wallarm_process_time_limit` および `wallarm_process_time_limit_block` の NGINX ディレクティブを削除します。

    `overlimit_res` 攻撃検出がディレクティブとルールの両方を使用して微調整されている場合、ノードはルールが設定するようにリクエストを処理します。