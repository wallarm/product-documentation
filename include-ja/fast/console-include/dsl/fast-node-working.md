```
[info] TestRunの確認を待っています...
[info] TestRun#N 'DEMO TEST RUN'の基準を記録しています
[info] 新規 TestRun#N 'DEMO TEST RUN'を開始しました
[info] プロキシリクエストPOST http://ojs.example.local/rest/user/login 
[info] 基準#Xのテストセットを実行しています
...
[info] パラメータ'POST_value'に対するデフォルト拡張子'rce-dotnet-jackson'のテストを実行しています
...
[info] パラメータ'POST_JSON_DOC_HASH_email_value'に対するデフォルト拡張子'spel-oob'のテストを実行しています
[info] パラメータ'POST_JSON_DOC_HASH_email_value'に対するカスタム拡張子'mod-extension'のテストを実行しています
[info] ホスト ojs.example.local でSQLI脆弱性が見つかりました ...
...
[info] パラメータ'URI_value'に対するデフォルト拡張子'spel-oob'のテストを実行しています
パラメータ'URI_value'に対するカスタム拡張子'non-mod-extension'のテストを実行しています
[info] ホスト ojs.example.local でSQLI脆弱性が見つかりました ...
...
[info] ２つの脆弱性が見つかったため、基準#Xのテストセットに失敗マークをつけています
```