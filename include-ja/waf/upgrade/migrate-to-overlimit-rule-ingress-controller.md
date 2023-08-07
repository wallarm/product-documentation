バージョン3.6から、Wallarm Console内のルールを使用して、 `overlimit_res`の攻撃検出を微調整することができます。

以前は、[`wallarm_process_time_limit`][nginx-process-time-limit-docs]および`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]といったNGINXディレクティブが使用されていました。上記のディレクティブは、新しいルールリリースと共に非推奨とされ、将来のリリースで削除される予定です。

`overlimit_res`の攻撃検出設定が上記のディレクティブを通じてカスタマイズされている場合、以下のようにそれらをルールに転送することを推奨します：

1. Wallarm Consoleを開いて→ **ルール** へ進み、 [**overlimit_res攻撃検出を微調整する**][overlimit-res-rule-docs]ルールの設定に進みます。
1. NGINXディレクティブを通じて行ったように、ルールを設定します：

　* ルールの条件は、 `wallarm_process_time_limit`および`wallarm_process_time_limit_block`ディレクティブが指定されたNGINX設定ブロックと一致するべきです。
　* 単一リクエストの処理時間制限（ミリ秒）：`wallarm_process_time_limit`の値。
　* リクエスト処理：**処理を停止する**オプションを推奨します。

　　　!!! warning "**システムメモリが不足する可能性あり**"
　　　　　時間制限が高い、または制限を超えた後にリクエスト処理を続けると、メモリが不足する、またはリクエスト処理が時間を超過する可能性があります。

　* overlimit_res攻撃を登録します：**イベントに登録して表示する**オプションを推奨します。

　　`wallarm_process_time_limit_block`または`process_time_limit_block`の値が`off` の場合、 **攻撃イベントを作成しない**オプションを選択してください。

　* ルールは、`wallarm_process_time_limit_block`ディレクティブの明示的な同等のオプションを持っていません。ルールが**イベントに登録して表示する**を設定すると、ノードは[node filtration mode][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックするか、パスします：

　　　* **監視**モードでは、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **セーフブロッキング**モードでは、リクエストが[graylisted][graylist-docs] IPアドレスから発生した場合、ノードはリクエストをブロックします。それ以外の場合は、ノードは元のリクエストをアプリケーションアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **ブロック**モードでは、ノードはリクエストをブロックします。
1. `values.yaml`設定ファイルから`wallarm_process_time_limit`と`wallarm_process_time_limit_block`のNGINXディレクティブを削除します。

　ディレクティブとルールの両方を使用して`overlimit_res`の攻撃検出が微調整されている場合、ノードはルールが設定するようにリクエストを処理します。