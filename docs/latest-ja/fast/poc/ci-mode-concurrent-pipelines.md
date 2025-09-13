[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

# 並行CI/CDワークフローでのFASTの使用

!!! info "必要なデータ" 
    本ドキュメントでは以下の値を例として使用します。

    * トークンとして`token_Qwe12345`を使用します。
    * テストレコード識別子として`rec_1111`および`rec_2222`を使用します。

並行CI/CDワークフローでは、複数のFASTノードを同時にデプロイできます。これらのノードは同じトークンを共有し、単一のクラウドFASTノードで動作します。

このデプロイ方式は、[記録][doc-ci-recording]および[テスト][doc-ci-testing]の両モードで動作するFASTノードに適用できます。

並行実行されるFASTノードの動作中に競合を避けるため、`BUILD_ID`環境変数を各ノードのコンテナに渡します。この変数は次の目的で使用します:
1.  記録モードのFASTノードが作成するテストレコードの追加識別子として使用します。
2.  テストモードのFASTノードが作成するテスト実行がどのテストレコードを使用すべきかを特定できるようにします（テスト実行がそのテストレコードに紐付けられます）。
3.  特定のCI/CDワークフローを識別します。

`BUILD_ID`環境変数の値には、英字と数字の任意の組み合わせを指定できます。

次に、2つのFASTノードを同時に実行する方法の例を示します。まず記録モード、その後テストモードです。以下のアプローチはスケーラブルで（必要な数だけノードを使用できます。以下の例のように2つに限定されません）、実際のCI/CDワークフローに適用できます。


## 並行CI/CDワークフローで使用するためのFASTノードの記録モード実行

!!! info "例に関する注意"
    以下の例では、FASTノードコンテナが起動して動作するのに必要な最小限の環境変数のみを使用しています。説明を簡単にするためです。 

最初のFASTノードコンテナを記録モードで実行するには、次のコマンドを実行します:

```
docker run --rm --name fast-node-1 \    # このコマンドはfast-node-1コンテナを実行します
-e WALLARM_API_HOST=api.wallarm.com \   # Wallarm APIサーバーホスト（この例ではホストは欧州のWallarm Cloudにあります）
-e WALLARM_API_TOKEN='qwe_12345' \      # クラウドFASTノードに接続するためのトークンです
-e CI_MODE=recording \                  # このノードは記録モードで動作します
-e BUILD_ID=1 \                         # BUILD_IDの値（並行する別のパイプラインで使用する値とは異なる必要があります）
-p 8080:8080 wallarm/fast               # ここでポートマッピングを行います。また、使用するDockerイメージもここで指定します。
```

2つ目の同時実行FASTノードコンテナを記録モードで実行するには、次のコマンドを実行します:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # トークンの値は、最初のFASTノードで使用したものと同一である必要があります
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # BUILD_IDの値は、別のCI/CDワークフローで最初のFASTノードに使用したものと異なる値です。
-p 8000:8080 wallarm/fast
```

!!! info "`docker run`コマンドに関する注意"
    前述のコマンドは同一のDockerホスト上で実行することを想定しています。そのため、`BUILD_ID`の値が異なることに加えて、コンテナ名（`fast-node-1`と`fast-node-2`）およびターゲットポートの値（`8080`と`8000`）も異なります。
    
    FASTノードコンテナを別々のDockerホストで実行する場合、`docker run`コマンドの相違点は`BUILD_ID`の値のみになる場合があります。

これら2つのコマンドを実行すると、2つのFASTノードが同じクラウドFASTノードを使用して記録モードで動作しますが、**別々のテストレコードが作成されます**。

CI/CDツールのコンソール出力は[こちら][doc-ci-recording-example]に記載のものと同様になります。

テストレコードに必要なベースラインリクエストがすべて揃ったら、該当するFASTノードを停止し、テストモードのノードを起動します。

## 並行CI/CDワークフローで使用するためのFASTノードのテストモード実行

記録モードで動作していたFASTノード`fast-node-1`および`fast-node-2`の運用中に、`rec_1111`と`rec_2222`のテストレコードが準備されたと仮定します。  

次に、テストモードのFASTノードに`rec_1111`のテストレコードを使用させるには、`BUILD_ID=1`環境変数をノードコンテナに渡します。同様に、`rec_2222`のテストレコードを使用するには`BUILD_ID=2`環境変数を渡します。以下の対応する`docker run`コマンドを使用して、FASTノードをテストモードで実行します。

最初のFASTノードコンテナをテストモードで実行するには、次のコマンドを実行します:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # このノードはテストモードで動作します
-e BUILD_ID=1 \                         # `BUILD_ID=1`の変数は`rec_1111`のテストレコードに対応します
wallarm/fast
```

2つ目の同時実行FASTノードコンテナをテストモードで実行するには、次のコマンドを実行します:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # このノードはテストモードで動作します
-e BUILD_ID=2 \                         # `BUILD_ID=2`の変数は`rec_2222`のテストレコードに対応します
wallarm/fast
```

CI/CDツールのコンソール出力は[こちら][doc-ci-testing-example]に記載のものと同様になります。

`BUILD_ID`環境変数の対応する値をFASTノードに渡すことで、**2つのテスト実行が同時に開始されます**。それぞれが別々のテストレコードで動作します。

したがって、`BUILD_ID`環境変数を指定することで、ノード間の競合を発生させることなく並行CI/CDワークフロー向けに複数のFASTノードを実行できます（新しく作成されたテスト実行が、実行中のテスト実行を中断することはありません）。