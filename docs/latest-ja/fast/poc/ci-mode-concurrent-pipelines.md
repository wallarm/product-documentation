[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

# FASTを使用した並行CI/CDワークフローでの利用

!!! info "必要なデータ" 
    このドキュメントでは以下の値を例として使用しています:

    * `token_Qwe12345` をトークンとして使用します。
    * `rec_1111` および `rec_2222` をテストレコードの識別子として使用します。

複数のFASTノードを、同一のトークンを共有し単一のクラウドFASTノードと連携する状態で、並行CI/CDワークフロー内で同時に展開できます。

この展開方式は、[recording][doc-ci-recording]モードおよび[testing][doc-ci-testing]モードで動作するFASTノードに適用できます。

並行して実行されるFASTノード間の競合を回避するために、各ノードのコンテナへBUILD_ID環境変数を渡します。この変数は以下の目的に利用されます:
1. recordingモードでFASTノードが作成するテストレコードの追加識別子として利用されます。
2. testingモードでFASTノードが作成するテスト実行がどのテストレコードを使用すべきかを判断できるようにします（その結果、テスト実行が特定のテストレコードに紐付けられます）。
3. 特定のCI/CDワークフローを識別します。

BUILD_ID環境変数は、その値として任意の文字および数字の組み合わせを用いることができます。

次に、まずrecordingモードで、続いてtestingモードで2つのFASTノードを同時に起動する例を示します。以下に説明する手法はスケーラブルであり、必要に応じて任意の数のノードを利用できるため、例にある2つに限定されず実際のCI/CDワークフローにも適用できます。

## 並行CI/CDワークフローで利用するためのFASTノードをrecordingモードで実行する

!!! info "例に関する注意事項"
    以下の例では、FASTノードコンテナが起動し動作可能なために必要最小限の環境変数のみを使用しています。これは簡潔さを保つためです。

以下のコマンドを実行して、最初のFASTノードコンテナをrecordingモードで起動します:

```
docker run --rm --name fast-node-1 \    # fast-node-1コンテナを実行します
-e WALLARM_API_HOST=api.wallarm.com \   # Wallarm APIサーバーホスト（この場合ホストは欧州のWallarmクラウドに配置されています）
-e WALLARM_API_TOKEN='qwe_12345' \      # クラウドFASTノードに接続するためのトークンです
-e CI_MODE=recording \                  # このノードはrecordingモードで動作します
-e BUILD_ID=1 \                         # BUILD_IDの値（並行パイプライン用に他と異なる必要があります）
-p 8080:8080 wallarm/fast               # ここでポートマッピングが行われ、使用するDockerイメージが指定されています。
```

以下のコマンドを実行して、2番目の並行FASTノードコンテナをrecordingモードで起動します:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # トークンの値は最初のFASTノードで使用したものと同一である必要があります。
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # BUILD_IDの値は、別のCI/CDワークフローで最初のFASTノードで使用したものと異なります。
-p 8000:8080 wallarm/fast
```

!!! info "「docker run」コマンドに関する注意事項"
    上記のコマンドは同一のDockerホスト上で実行されることを想定しており、異なるBUILD_IDの値に加え、コンテナ名（fast-node-1およびfast-node-2）やターゲットポートの値（8080および8000）も異なります。
    
    もしFASTノードコンテナを別々のDockerホスト上で実行する場合、docker runコマンドはBUILD_IDの値のみ異なる可能性があります。

これら二つのコマンドを実行すると、同一のクラウドFASTノードを利用して二つのFASTノードがrecordingモードで動作しますが、**異なるテストレコードが作成されます**。

CI/CDツールのコンソール出力は[こちら][doc-ci-recording-example]に記述されているものに類似します。

テストレコードに必要なベースラインリクエストがすべて入力されたら、該当するFASTノードをシャットダウンし、testingモードの他のノードを起動します。

## 並行CI/CDワークフローで利用するためのFASTノードをtestingモードで実行する

recordingモードでFASTノードfast-node-1およびfast-node-2が動作している際に、`rec_1111`および`rec_2222`のテストレコードが作成されたと仮定します。

その後、testingモードでFASTノードに`rec_1111`テストレコードを使用させるには、ノードコンテナに`BUILD_ID=1`環境変数を渡してください。同様に、`rec_2222`テストレコードを使用するには`BUILD_ID=2`環境変数を渡します。以下の対応するdocker runコマンドを用いて、FASTノードをtestingモードで実行します。

以下のコマンドを実行して、最初のFASTノードコンテナをtestingモードで起動します:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # このノードはtestingモードで動作します
-e BUILD_ID=1 \                         # BUILD_ID=1の値はrec_1111テストレコードに対応します
wallarm/fast
```

以下のコマンドを実行して、2番目の並行FASTノードコンテナをtestingモードで起動します:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # このノードはtestingモードで動作します
-e BUILD_ID=2 \                         # BUILD_ID=2の値はrec_2222テストレコードに対応します
wallarm/fast
```

CI/CDツールのコンソール出力は[こちら][doc-ci-testing-example]に記述されているものに類似します。

FASTノードに対応するBUILD_ID環境変数の値を渡すことで、**異なるテストレコードを使用した2つのテスト実行が同時に開始されます**。

そのため、BUILD_ID環境変数を指定することで、ノード間に競合を生じることなく並行CI/CDワークフロー用に複数のFASTノードを実行できます（新たに作成されたテスト実行は実行中のテスト実行を中断しません）。