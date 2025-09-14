[img-new-local-repo]:                   ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo.png
[img-artifactory-repo-settings]:        ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo-settings.png
[img-import-into-artifactory]:          ../../../../images/integration-guides/repo-mirroring/centos/common/import-repo-into-artifactory.png
[img-local-repo-ok]:                    ../../../../images/integration-guides/repo-mirroring/centos/common/local-repo-ok.png

[link-jfrog-installation]:              https://www.jfrog.com/confluence/display/RTF/Installing+on+Linux+Solaris+or+Mac+OS
[link-jfrog-comparison-matrix]:         https://www.jfrog.com/confluence/display/RTF/Artifactory+Comparison+Matrix
[link-artifactory-naming-agreement]:    https://jfrog.com/whitepaper/best-practices-structuring-naming-artifactory-repositories/

[doc-installation-from-artifactory]:    how-to-use-mirrored-repo.md

[anchor-fetch-repo]:                    #1-creating-a-local-copy-of-the-wallarm-repository
[anchor-setup-repo-artifactory]:        #2-creating-a-local-rpm-repository-in-jfrog-artifactory
[anchor-import-repo]:                   #3-importing-the-local-copy-of-the-wallarm-repository-into-jfrog-artifactory


#   CentOS için Wallarm Deposunu Aynalama

Altyapınızdaki tüm NGINX filtre düğümlerinin tek bir kaynaktan dağıtıldığından ve aynı sürüm numarasına sahip olduğundan emin olmak için Wallarm deposunun yerel bir kopyasını (ayrıca bir ayna olarak da bilinir) oluşturup kullanabilirsiniz.

Bu belge, JFrog Artifactory depo yöneticisi aracılığıyla CentOS 7 sunucusu için Wallarm deposunun aynalanması sürecinde size yol gösterecektir.


!!! info "Önkoşullar"
    İlerlemeden önce aşağıdaki koşulların sağlandığından emin olun:
    
    *   Sunucunuzda şu bileşenler kurulu:
    
        *   CentOS 7 işletim sistemi
        *   `yum-utils` ve `epel-release` paketleri
        *   RPM depoları oluşturabilen JFrog Artifactory yazılımı ([kurulum talimatları][link-jfrog-installation])
            
            JFrog Artifactory sürümleri ve özellikleri hakkında daha fazla bilgiyi [buradan][link-jfrog-comparison-matrix] edinebilirsiniz.
        
    *   JFrog Artifactory çalışır durumdadır.
    *   Sunucunun internet erişimi vardır.


Wallarm deposunun aynalanması aşağıdakilerden oluşur
1.  [Wallarm deposunun yerel bir kopyasını oluşturma][anchor-fetch-repo]
2.  [JFrog Artifactory’de yerel bir RPM deposu oluşturma][anchor-setup-repo-artifactory]
3.  [Wallarm deposunun yerel kopyasını JFrog Artifactory’ye içe aktarma][anchor-import-repo]

##  1.  Wallarm Deposunun Yerel Bir Kopyasını Oluşturma

Wallarm deposunun yerel bir kopyasını oluşturmak için aşağıdakileri yapın:
1.  Aşağıdaki komutu çalıştırarak Wallarm deposunu ekleyin:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  Geçici bir dizine (ör. `/tmp`) gidin ve aşağıdaki komutu çalıştırarak Wallarm deposunu bu dizinle eşitleyin:

    ```bash
    reposync -r wallarm-node -p .
    ```

`reposync` komutu başarıyla tamamlanırsa, Wallarm paketleri geçici dizininizin `wallarm-node/Packages` alt dizinine yerleştirilir (ör. `/tmp/wallarm-node/Packages`). 


##  2.  JFrog Artifactory’de Yerel bir RPM Deposu Oluşturma

JFrog Artifactory’de yerel bir RPM deposu oluşturmak için aşağıdakileri yapın:
1.  Alan adı veya IP adresi üzerinden JFrog Artifactory web UI’ına gidin (örn. `http://jfrog.example.local:8081/artifactory`).

    Web UI’a yönetici hesabıyla giriş yapın.

2.  *Admin* menü girdisine tıklayın, ardından *Repositories* bölümündeki *Local* bağlantısına tıklayın.

3.  Yeni bir yerel depo oluşturmak için *New* düğmesine tıklayın.

    ![Yeni bir yerel depo oluşturma][img-new-local-repo]

4.  “RPM” paket türünü seçin.

5.  *Repository Key* alanına depo adını girin. Bu ad JFrog Artifactory içinde benzersiz olmalıdır. [Artifactory depoları adlandırma en iyi uygulamalarına][link-artifactory-naming-agreement] uyan bir ad seçmenizi öneririz (örn. `wallarm-centos-upload-local`).

    *Repository* Layout açılır listesinden “maven-2-default” yerleşimini seçin.
    
    Diğer ayarları olduğu gibi bırakabilirsiniz.

    Yerel Artifactory deposunu oluşturmak için *Save & Finish* düğmesine tıklayın.
    
    ![Depo ayarları][img-artifactory-repo-settings]

    Artık, yeni oluşturulan depo yerel depo listesinde görüntülenmelidir.

Wallarm deposunun aynalanmasını tamamlamak için eşitlenen [paketleri içe aktarın][anchor-fetch-repo] ve yerel Artifactory deposuna ekleyin.


##  3.  Wallarm Deposunun Yerel Kopyasını JFrog Artifactory’ye İçe Aktarma

Wallarm paketlerini Artifactory yerel RPM deposuna içe aktarmak için aşağıdakileri yapın:
1.  Yönetici hesabıyla JFrog Artifactory web UI’ına giriş yapın.

2.  *Admin* menü girdisine tıklayın, ardından *Import & Export* bölümündeki *Repositories* bağlantısına tıklayın.

3.  *Import Repository from Path* bölümünde, *Repository from Path* açılır listesinden [daha önce oluşturduğunuz][anchor-setup-repo-artifactory] yerel depoyu seçin.

4.  *Browse* düğmesine tıklayın ve [daha önce oluşturduğunuz][anchor-fetch-repo] Wallarm paketlerini içeren dizini seçin.

5.  Dizindeki Wallarm paketlerini içe aktarmak için *Import* düğmesine tıklayın.

    ![Paketleri içe aktarma][img-import-into-artifactory]
    
6.  *Artifacts* menü girdisine tıklayın ve içe aktarılan Wallarm paketlerinin istenen yerel depoda bulunduğundan emin olun.

    ![Depodaki paketler][img-local-repo-ok]
    


Artık Wallarm deposunun yerel aynasını kullanarak [Wallarm filtre düğümlerini dağıtabilirsiniz][doc-installation-from-artifactory].