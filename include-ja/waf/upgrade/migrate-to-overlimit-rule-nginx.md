バージョン3.6から、Wallarm Consoleのルールを使って`overlimit_res`攻撃検出を微調整できるようになりました。

以前は、[`wallarm_process_time_limit`][nginx-process-time-limit-docs]と[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]のNGINXディレクティブが使用されていました。これらのディレクティブは、新しいルールリリースで非推奨とみなされ、今後のリリースで削除される予定です。

`overlimit_res`の攻撃検出設定が上記のディレクティブでカスタマイズされている場合は、次のようにしてルールに移行することをお勧めします：

1. Wallarm Consoleを開き、**Rules** → [**overlimit_res攻撃検出の微調整**][overlimit-res-rule-docs]のルール設定に進む。
1. NGINXディレクティブを通じて行われるようにルールを設定する：

    * ルール条件は、`wallarm_process_time_limit`および`wallarm_process_time_limit_block`ディレクティブが指定されているNGINX設定ブロックと一致する必要があります。
    * ノードが1つの要求を処理するための時間制限（ミリ秒）：`wallarm_process_time_limit`の値。
    * 要求処理：**処理を停止**オプションが推奨されます。
    
        !!! warning "システムメモリ不足のリスク"
            高い時間制限および/または制限を超えた後の要求処理の継続は、メモリ不足や時間内にリクエスト処理が完了しないことが原因となる可能性があります。
    
    * overlimit_res攻撃を登録：**登録してイベントに表示**オプションを推奨します。

        `wallarm_process_time_limit_block`または`process_time_limit_block`の値が`off`の場合、**攻撃イベントを作成しない**オプションを選択します。
    
    * ルールには`wallarm_process_time_limit_block`ディレクティブの明示的な同等オプションがありません。ルールが**登録してイベントに表示**を設定する場合、ノードは[node filtration mode][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックするかどうかを決定します：

        * **モニタリング**モードでは、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済みおよび未処理のリクエスト部分に含まれる攻撃によって悪用されるリスクがあります。
        * **セーフブロッキング**モードでは、リクエストが[灰色リスト][graylist-docs]のIPアドレスから発信された場合、ノードはリクエストをブロックします。それ以外の場合、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理済みおよび未処理のリクエスト部分に含まれる攻撃によって悪用されるリスクがあります。
        * **ブロック**モードでは、ノードはリクエストをブロックします。
1. NGINXの設定ファイルから`wallarm_process_time_limit`および`wallarm_process_time_limit_block`のNGINXディレクティブを削除する。

    `overlimit_res`の攻撃検出がディレクティブとルールの両方を使用して微調整されている場合、ノードはルールが設定するようにリクエストを処理します。