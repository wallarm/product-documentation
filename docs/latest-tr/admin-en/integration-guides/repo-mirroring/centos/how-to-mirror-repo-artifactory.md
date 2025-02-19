```markdown
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


#   CentOS için Wallarm Deposunun Aynasını Oluşturma

Altyapınızdaki tüm NGINX filtre düğümlerinin tek bir kaynaktan dağıtıldığından ve aynı sürüm numarasına sahip olduğundan emin olmak için Wallarm deposunun yerel bir kopyasını (aynı zamanda *ayna* olarak da bilinir) oluşturabilir ve kullanabilirsiniz.

Bu belge, JFrog Artifactory depo yöneticisi aracılığıyla CentOS 7 sunucusu için Wallarm deposunun aynasını oluşturma sürecinde size rehberlik edecektir.


!!! info "Ön Koşullar"
    Daha fazla adıma geçmeden önce aşağıdaki koşulların karşılandığından emin olun:
    
    *   Sunucunuzda şu bileşenlerin yüklü olduğundan emin olun:
    
        *   CentOS 7 işletim sistemi
        *   `yum-utils` ve `epel-release` paketleri
        *   RPM depoları oluşturabilen JFrog Artifactory yazılımı ([installation instructions][link-jfrog-installation])
            
            JFrog Artifactory sürümleri ve özellikleri hakkında daha fazla bilgiyi [buradan][link-jfrog-comparison-matrix] öğrenebilirsiniz.
        
    *   JFrog Artifactory çalışır durumda.
    *   Sunucunun internete erişimi var.


Wallarm deposunun aynalanması şunları içerir:
1.  [Wallarm deposunun yerel kopyasının oluşturulması][anchor-fetch-repo]
2.  [JFrog Artifactory'de yerel bir RPM deposunun oluşturulması][anchor-setup-repo-artifactory]
3.  [Wallarm deposunun yerel kopyasının JFrog Artifactory'ye aktarılması][anchor-import-repo]

##  1.  Wallarm Deposunun Yerel Kopyasının Oluşturulması

Wallarm deposunun yerel bir kopyasını oluşturmak için aşağıdakileri yapın:
1.  Aşağıdaki komutu çalıştırarak Wallarm deposunu ekleyin:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  Geçici bir dizine (örneğin, `/tmp`) gidin ve aşağıdaki komutu çalıştırarak Wallarm deposunu bu dizine senkronize edin:

    ```bash
    reposync -r wallarm-node -p .
    ```

`reposync` komutu başarıyla tamamlanırsa, Wallarm paketleri geçici dizininizde (örneğin, `/tmp/wallarm-node/Packages`) `wallarm-node/Packages` alt dizinine yerleştirilecektir. 


##  2.  JFrog Artifactory'de Yerel Bir RPM Deposunun Oluşturulması

JFrog Artifactory'de yerel bir RPM deposu oluşturmak için aşağıdakileri yapın:
1.  Alan adı veya IP adresi aracılığıyla JFrog Artifactory web arayüzüne gidin (örneğin, `http://jfrog.example.local:8081/artifactory`).

    Yönetici hesabıyla web arayüzüne giriş yapın.

2.  *Admin* menü öğesine, ardından *Repositories* bölümündeki *Local* bağlantısına tıklayın.

3.  Yeni bir yerel depo oluşturmak için *New* butonuna tıklayın.

    ![Yeni yerel depo oluşturma][img-new-local-repo]

4.  “RPM” paket tipini seçin.

5.  *Repository Key* alanına depo adını girin. Bu adın JFrog Artifactory içinde benzersiz olması gerekmektedir. [Artifactory repositories naming best practices][link-artifactory-naming-agreement] kurallarına uyan bir ad seçmenizi öneririz (örneğin, `wallarm-centos-upload-local`).

    *Repository Layout* açılır listesinden “maven-2-default” düzenini seçin.
    
    Diğer ayarları değiştirmeden bırakabilirsiniz.

    Yerel Artifactory deposunu oluşturmak için *Save & Finish* butonuna tıklayın.
    
    ![Depo ayarları][img-artifactory-repo-settings]

    Artık oluşturulan depo yerel depo listenizde görüntülenecektir.

Wallarm deposunun aynalanma işlemini tamamlamak için, senkronize edilmiş paketleri yerel Artifactory deposuna [aktarın][anchor-fetch-repo].


##  3.  Wallarm Deposunun Yerel Kopyasının JFrog Artifactory'ye Aktarılması

Wallarm paketlerini Artifactory yerel RPM deposuna aktarmak için aşağıdakileri yapın:
1.  Yönetici hesabıyla JFrog Artifactory web arayüzüne giriş yapın.

2.  *Import & Export* bölümündeki *Repositories* bağlantısına ve ardından *Admin* menü öğesine tıklayın.

3.  *Import Repository from Path* bölümünde, *Repository from Path* açılır listesinden daha önce [oluşturduğunuz yerel depo][anchor-setup-repo-artifactory] seçin.

4.  *Browse* butonuna tıklayın ve daha önce [oluşturduğunuz Wallarm paketlerinin bulunduğu dizini][anchor-fetch-repo] seçin.

5.  Wallarm paketlerini dizinden aktarmak için *Import* butonuna tıklayın.

    ![Paketlerin aktarılması][img-import-into-artifactory]
    
6.  *Artifacts* menü öğesine tıklayın ve aktarılmış Wallarm paketlerinin istenen yerel depoda bulunduğundan emin olun.

    ![Depodaki paketler][img-local-repo-ok]
    


Artık yerel aynayı kullanarak [Wallarm filtre düğümlerini dağıtabilirsiniz][doc-installation-from-artifactory].
```