[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md

#   CentOS用のローカルJFrog ArtifactoryリポジトリからWallarmパッケージをインストールする方法

フィルタノードに専用のホスト上で[doc-repo-mirroring][JFrog Artifactoryレポジトリ]からWallarmパッケージをインストールするには、以下の手順を実行します。
1.  ドメイン名またはIPアドレス (`http://jfrog.example.local:8081/artifactory`など)を介してJFrog Artifactory web UIに移動します。

    ユーザーアカウントを使用してweb UIにログインします。
    
2.  *Artifacts*メニューをクリックし、Wallarmパッケージを含むリポジトリを選択します。

3.  *Set Me Up*リンクをクリックします。

    ![リポジトリの操作][img-working-with-repo]
    
    ポップアップウィンドウが表示されます。*Type Password*フィールドにユーザーアカウントのパスワードを入力し、*Enter*を押します。このウィンドウの指示書にはあなたの資格情報が含まれています。
    
    ![資格情報の入力][img-repo-creds]

4.  `yum`の設定例にスクロールダウンし、`Copy Snippet to Clipboard`ボタンをクリックしてこの例をクリップボードにコピーします。

    ![設定の例][img-repo-code-snippet]
    
5.  `yum`の設定ファイル(`/etc/yum.repos.d/artifactory.repo`など)を作成し、そこにコピーしたスニペットを貼り付けます。

    !!! warning "重要！"
        `baseurl`パラメータから`<PATH_TO_REPODATA_FOLDER>`フラグメントを削除し、`baseurl`がリポジトリのルートを指すようにします。
    
    `wallarm-centos-upload-local`サンプルリポジトリの`/etc/yum.repos.d/artifactory.repo`ファイルの例:

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #オプション - GPG署名キーがインストールされていれば、以下のフラグを使用してリポジトリメタデータの署名を確認します：
    #gpgkey=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```
    
6.  ホスト上で`epel-release`パッケージをインストールします：
    
    ```
    sudo yum install -y epel-release
    ```

これで、CentOSの任意のインストール手順に従うことができます。リポジトリを追加するステップは省略する必要があります。代わりにローカルリポジトリを設定しました。