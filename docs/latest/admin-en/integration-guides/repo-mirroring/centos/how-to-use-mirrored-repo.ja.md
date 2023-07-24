[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-nginx]:            ../../../installation-nginx-overview.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md

#   CentOSのローカルJFrog ArtifactoryリポジトリからWallarmパッケージをインストールする方法

フィルタノード専用ホストで[JFrog Artifactoryリポジトリ][doc-repo-mirroring]からWallarmパッケージをインストールするには、このホストで以下の手順を実行してください：
1.  ドメイン名またはIPアドレス（たとえば、`http://jfrog.example.local:8081/artifactory`）を介してJFrog ArtifactoryウェブUIに移動します。

    ユーザーアカウントでWeb UIにログインします。

2.  *Artifacts*メニューエントリをクリックし、Wallarmパッケージが含まれるリポジトリを選択します。

3.  *Set Me Up*リンクをクリックします。

    ![！リポジトリでの作業][img-working-with-repo]

    ポップアップウィンドウが表示されます。「Type Password」フィールドにユーザーアカウントのパスワードを入力し、*Enter*キーを押します。これで、このウィンドウの指示にあなたの認証情報が表示されます。

    ![！認証情報の入力][img-repo-creds]

4.  `yum`構成例にスクロールし、「Copy Snippet to Clipboard」ボタンをクリックして例をクリップボードにコピーします。

    ![！構成の例][img-repo-code-snippet]

5.  `yum`構成ファイル（たとえば、`/etc/yum.repos.d/artifactory.repo`）を作成し、そこにコピーされたスニペットを貼り付けます。

    !!! warning “重要！”
        `baseurl`パラメータから`<PATH_TO_REPODATA_FOLDER>`フラグメントを削除して、`baseurl`がリポジトリのルートを指すようにしてください。

    サンプルリポジトリ `wallarm-centos-upload-local` の `/etc/yum.repos.d/artifactory.repo` ファイルの例：

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #Optional - if you have GPG signing keys installed, use the below flags to verify the repository metadata signature:
    #gpgkey=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```

6.  ホストで `epel-release` パッケージをインストールします。

    ```
    sudo yum install -y epel-release
    ```

これで、CentOSのインストール手順に従って進めることができます。ローカルリポジトリを設定したため、リポジトリが追加されるステップはスキップする必要があります