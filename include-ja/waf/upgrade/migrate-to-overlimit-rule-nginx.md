バージョン3.6から、Wallarm Console内のルールを使用して `overlimit_res` 攻撃検出の設定を最適化することが可能になります。

以前は、 [`wallarm_process_time_limit`][nginx-process-time-limit-docs] および [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]のNGINXディレクティブが使用されていました。これらのディレクティブは、新ルールのリリースに伴い、非推奨となり、今後のリリースで削除される予定です。

`overlimit_res` 攻撃検出の設定が上記のディレクティブを介してカスタマイズされている場合、以下のようにしてそれらをルールに移行することをおすすめします。

1. Wallarm Consoleを開き、**Rules** を選択し、[**overlimit_res攻撃検出の最適化**][overlimit-res-rule-docs]ルールの設定に進みます。
1. NGINXディレクティブを使用してルールを設定します :

    * ルール条件は、`wallarm_process_time_limit`および`wallarm_process_time_limit_block`ディレクティブを指定したNGINX設定ブロックと一致する必要があります。
    * ノードが単一のリクエストを処理する時間制限（ミリ秒）： `wallarm_process_time_limit`の値。
    * リクエストの処理： **Stop processing**オプションが推奨されます。

        !!! warning  "システムメモリの枯渇のリスク"
            リクエスト処理が制限を超えて続くか、時間制限が高すぎると、メモリ枯渇や待ち時間を超えたリクエスト処理を引き起こす可能性があります。

    * overlimit_res攻撃の登録： **Register and display in the events**オプションが推奨されます。

        `wallarm_process_time_limit_block`または`process_time_limit_block`の値が`off`の場合は、**Do not create attack event**オプションを選択してください。

    * ルールは、`wallarm_process_time_limit_block`ディレクティブに対する明示的な同等のオプションを持っていません。ルールが**Register and display in the events**を設定している場合、ノードは[node filtration mode][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックするか、パスします :

        * **monitoring**モードでは、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **safe blocking**モードでは、リクエストが[graylisted][graylist-docs]IPアドレスから発行された場合、ノードはリクエストをブロックします。それ以外の場合、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **block**モードでは、ノードはリクエストをブロックします。
1. NGINX設定ファイルから`wallarm_process_time_limit`および`wallarm_process_time_limit_block`NGINXディレクティブを削除します。

    `overlimit_res`攻撃検出がディレクティブとルールの両方を用いて最適化されている場合、ノードはルールに設定されたようにリクエストを処理します。