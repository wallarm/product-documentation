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


#   Como Espelhar o Repositório Wallarm para CentOS

Você pode criar e usar uma cópia local (também conhecida como um *espelho*) do repositório Wallarm para garantir que todos os nós de filtro em sua infraestrutura sejam implantados a partir de uma única fonte e tenham o mesmo número de versão.

Este documento irá orientá-lo ao longo do processo de espelhamento do repositório Wallarm para um servidor CentOS 7 através do gerenciador de repositório JFrog Artifactory.


!!! info "Pré-requisitos"
    Certifique-se de que as seguintes condições foram atendidas antes de realizar qualquer outra etapa:
    
    *   Você tem estes componentes instalados em seu servidor:
    
        *   Sistema operacional CentOS 7
        *   Pacotes `yum-utils` e `epel-release`
        *   Software JFrog Artifactory capaz de criar repositórios RPM ([instruções de instalação][link-jfrog-installation])
            
            Saiba mais sobre as edições e funcionalidades do JFrog Artifactory [aqui][link-jfrog-comparison-matrix].
        
    *   O JFrog Artifactory está funcionando corretamente.
    *   O servidor possui acesso à internet.


O espelhamento do repositório Wallarm compreende
1.  [Criar uma cópia local do repositório Wallarm][anchor-fetch-repo]
2.  [Criar um repositório local RPM no JFrog Artifactory][anchor-setup-repo-artifactory]
3.  [Importar a cópia local do repositório Wallarm para o JFrog Artifactory][anchor-import-repo]

##  1.  Criando uma Cópia Local do Repositório Wallarm

Para criar uma cópia local do repositório Wallarm, faça o seguinte:
1.  Adicione o repositório Wallarm executando o seguinte comando:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  Navegue até um diretório temporário (por exemplo, `/tmp`) e sincronize o repositório Wallarm para este diretório executando o seguinte comando:

    ```bash
    reposync -r wallarm-node -p .
    ```

Se o comando `reposync` terminar com sucesso, então os pacotes Wallarm serão colocados no subdiretório `wallarm-node/Packages` do seu diretório temporário (por exemplo, `/tmp/wallarm-node/Packages`). 


##  2.  Criando um Repositório Local RPM no JFrog Artifactory

Para criar um repositório local RPM no JFrog Artifactory, faça o seguinte:
1.  Navegue até a UI web do JFrog Artifactory através do nome de domínio ou do endereço IP (por exemplo, `http://jfrog.example.local:8081/artifactory`).

    Faça login na UI web com a conta de administrador.

2.  Clique na entrada do menu *Admin*, depois no link *Local* na seção *Repositories*.

3.  Clique no botão *New* para criar um novo repositório local.

    ![Criando um novo repositório local][img-new-local-repo]

4.  Selecione o tipo de pacote “RPM”.

5.  Preencha o nome do repositório no campo *Repository Key*. Este nome deve ser único no JFrog Artifactory. Recomendamos escolher um nome que esteja em conformidade com as [melhores práticas de nomenclatura de repositórios do Artifactory][link-artifactory-naming-agreement] (por exemplo, `wallarm-centos-upload-local`).

    Selecione o layout “maven-2-default” da lista drop-down *Repository Layout*.
    
    Você pode deixar as outras configurações inalteradas.

    Clique no botão *Save & Finish* para criar o repositório local Artifactory.
    
    ![Configurações do repositório][img-artifactory-repo-settings]

    Agora, o repositório recém-criado deve ser exibido na lista de repositórios locais.

Para finalizar o espelhamento do repositório Wallarm, [importe os pacotes sincronizados][anchor-fetch-repo] para o repositório local Artifactory.


##  3.  Importando a Cópia Local do Repositório Wallarm para o JFrog Artifactory

Para importar os pacotes Wallarm para o repositório local RPM Artifactory, faça o seguinte:
1.  Faça login na UI web do JFrog Artifactory com a conta de administrador.

2.  Clique na entrada do menu *Admin*, depois no link *Repositories* na seção *Import & Export*.

3.  Na seção *Import Repository from Path*, selecione o repositório local que você [criou anteriormente][anchor-setup-repo-artifactory] da lista drop-down *Repository from Path*.

4.  Clique no botão *Browse* e selecione o diretório com os pacotes Wallarm que você [criou anteriormente][anchor-fetch-repo].

5.  Clique no botão *Import* para importar os pacotes Wallarm do diretório.

    ![Importando pacotes][img-import-into-artifactory]
    
6.  Clique na entrada do menu *Artifacts*, e certifique-se de que os pacotes Wallarm importados estão presentes no repositório local desejado.

    ![Pacotes no repositório][img-local-repo-ok]
    


Agora você pode [implantar nós de filtro Wallarm][doc-installation-from-artifactory] usando o espelho local do repositório Wallarm.