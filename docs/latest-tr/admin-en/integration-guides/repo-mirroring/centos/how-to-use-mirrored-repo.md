[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


#   CentOS için Yerel JFrog Artifactory Deposundan Wallarm Paketleri Nasıl Yüklenir

NGINX filtre düğümüne ayrılmış bir ana bilgisayar üzerinde [JFrog Artifactory deposu][doc-repo-mirroring]ndan Wallarm paketlerini yüklemek için, bu ana bilgisayarda aşağıdaki işlemleri gerçekleştirin:
1.  JFrog Artifactory web UI'ına alan adı veya IP adresi üzerinden gidin (örn., `http://jfrog.example.local:8081/artifactory`).

    Web UI'a bir kullanıcı hesabıyla giriş yapın.
    
2.  *Artifacts* menü girdisine tıklayın ve Wallarm paketlerini içeren bir depo seçin.

3.  *Set Me Up* bağlantısına tıklayın.

    ![Depo ile çalışma][img-working-with-repo]
    
    Bir açılır pencere görüntülenecektir. *Type Password* alanına kullanıcı hesabınızın parolasını yazın ve *Enter* tuşuna basın. Artık bu penceredeki talimatlar kimlik bilgilerinizi içerecektir.
    
    ![Kimlik bilgilerinin girilmesi][img-repo-creds]

4.  `yum` yapılandırma örneğine kadar aşağı kaydırın ve bu örneği panoya kopyalamak için `Copy Snippet to Clipboard` düğmesine tıklayın.

    ![Yapılandırma örneği][img-repo-code-snippet]
    
5.  Bir `yum` yapılandırma dosyası oluşturun (örn., `/etc/yum.repos.d/artifactory.repo`) ve kopyaladığınız parçacığı içine yapıştırın.

    !!! warning "Önemli!"
        `baseurl` parametresinden `<PATH_TO_REPODATA_FOLDER>` parçasını kaldırdığınızdan emin olun; böylece `baseurl` deponun kökünü işaret eder.
    
    `wallarm-centos-upload-local` örnek deposu için `/etc/yum.repos.d/artifactory.repo` dosyasına örnek:

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #Opsiyonel - GPG imzalama anahtarlarınız yüklüyse, depo meta verisi imzasını doğrulamak için aşağıdaki bayrakları kullanın:
    #gpgkey=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```
    
6.  Ana bilgisayara `epel-release` paketini yükleyin:
    
    ```
    sudo yum install -y epel-release
    ```

Artık CentOS için herhangi bir kurulum talimatını izleyebilirsiniz. Yerel bir depo kurduğunuz için, deponun eklendiği adımı atlamanız gerekecektir.