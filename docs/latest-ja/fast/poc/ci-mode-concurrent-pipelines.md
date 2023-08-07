[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

#   FASTを並行するCI/CDワークフローに使用する

!!! info "必要なデータ"
    以下の値は、このドキュメントでの例として使用されます:

    * `token_Qwe12345` をトークンとして。
    * `rec_1111` と `rec_2222` をテストレコード識別子として。

複数のFASTノードは、並行するCI/CDワークフローで同時にデプロイすることができます。これらのノードは同じトークンを共有し、単一のクラウドFASTノードと連携します。

このデプロイスキームは、[レコーディング][doc-ci-recording]モードと[テスト][doc-ci-testing]モードの両方で稼働するFASTノードに適用可能です。

並行するFASTノードの運用中の競合を避けるために、 `BUILD_ID` 環境変数が各ノードのコンテナに渡されます。この変数は次の目的で使用されます:
1.  レコーディングモードでFASTノードによって作成されたテストレコードの追加識別子として使用します。
2.  テストモードでFASTノードによって作成されるテストランが、どのテストレコードを使用するべきかを決定することを可能にします（テストランがテストレコードに紐づく）。
3.  特定のCI/CDワークフローを識別します。

`BUILD_ID` 環境変数は、その値として任意の文字と数字の組み合わせを含むことができます。

次に、まずレコーディングモードで、次にテストモードで2つのFASTノードを同時に実行する方法について例を挙げます。以下に説明するアプローチは、スケーラブルです（必要な数のノードを使用することができ、ノード数は下記の例のように2つに限定されません）実際のCI/CDワークフローに適用可能です。

##  並行するCI/CDワークフローで使用するためのレコーディングモードでのFASTノードの実行

!!! info "例についての注意"
    下記の例では、FASTノードコンテナが起動し、稼働するために必要な最低限の環境変数セットのみを使用します。これは単純化のためです。

以下のコマンドを実行して、最初のFASTノードコンテナをレコーディングモードで起動します:

```
docker run --rm --name fast-node-1 \    # このコマンドで fast-node-1 コンテナを実行します
-e WALLARM_API_HOST=api.wallarm.com \   # Wallarm API サーバーホスト（この場合、ホストはヨーロッパの Wallarm クラウドに位置しています）
-e WALLARM_API_TOKEN='qwe_12345' \      # クラウドの FAST ノードに接続するためのトークン
-e CI_MODE=recording \                  # このノードはレコーディングモードで稼働します
-e BUILD_ID=1 \                         # BUILD_ID の値（別の並行パイプラインのものとは異なる必要があります）
-p 8080:8080 wallarm/fast               # ポートのマッピングがここで行われます。また、使用する Docker イメージもここで指定します。
```

以下のコマンドを実行して、2つ目の並行するFASTノードコンテナをレコーディングモードで起動します:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # トークンの値は、最初のFASTノードで使用されたものと同一である必要があります
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # BUILD_ID の値は、1つ目のFASTノードが使用したものとは異なる必要があります
-p 8000:8080 wallarm/fast
```

!!! info "`docker run` コマンドについての注意"
    前述のコマンドは同じDockerホスト上で実行されることを想定しています。したがって、異なる `BUILD_ID` 値に加えて、これらのコマンドは異なるコンテナ名（`fast-node-1` および `fast-node-2`）とターゲットポートの値（`8080` および `8000`）を持ちます。

    FASTノードコンテナを別のDockerホストで実行する場合、`docker run` コマンドは `BUILD_ID` の値のみで異なる場合があります。

これら2つのコマンドを実行した後、2つのFASTノードが同じクラウドFASTノードを使用してレコーディングモードで稼働しますが、**別々のテストレコードが作成されます**。

CI/CDツールのコンソール出力は、[こちら][doc-ci-recording-example]で説明されているものと同様になります。

すべての必要なベースラインリクエストでテストレコードが満たされたら、対応するFASTノードをシャットダウンし、テストモードで他のノードを起動します。

##  並行するCI/CDワークフローで使用するためのテストモードでのFASTノードの実行

レコーディングモードでの `fast-node-1` と `fast-node-2` のFASTノードの運用中に `rec_1111` と `rec_2222` のテストレコードが準備されたと仮定しましょう。

次に、テストモードでのFASTノードが `rec_1111` テストレコードを使用するように指示するには、 `BUILD_ID=1` 環境変数をノードコンテナに渡します。同様に、`rec_2222` テストレコードを使用するためには `BUILD_ID=2` 環境変数を渡します。以下の対応する `docker run` コマンドを使用してテストモードでFASTノードを実行します。

以下のコマンドを実行して、最初のFASTノードコンテナをテストモードで起動します:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # このノードはテストモードで稼働します
-e BUILD_ID=1 \                         # `BUILD_ID=1` 変数は、`rec_1111` テストレコードに対応します
wallarm/fast
```

以下のコマンドを実行して、2つ目の並行するFASTノードコンテナをテストモードで起動します:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # このノードはテストモードで稼働します
-e BUILD_ID=2 \                         # `BUILD_ID=2` 変数は、`rec_2222` テストレコードに対応します
wallarm/fast
```

CI/CDツールのコンソール出力は、[こちら][doc-ci-testing-example]で説明されているものと同様になります。

対応する `BUILD_ID` 環境変数の値をFASTノードに渡す結果として、**2つのテストランが同時に実行を開始し**、それぞれが異なるテストレコードと連携します。

したがって、`BUILD_ID` 環境変数を指定して、いくつかのFASTノードを並行するCI/CDワークフローのために実行することができ、ノード間での競合を生成せずに（新たに作成されたテストランが実行中のテストランの実行を中断することはありません）。