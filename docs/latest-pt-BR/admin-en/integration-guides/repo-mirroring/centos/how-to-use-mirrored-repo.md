[img-working-with-repo]: ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]: ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]: ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]: how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]: ../../../installation-postanalytics-en.md

# Como Instalar Pacotes Wallarm do Repositório JFrog Artifactory Local para CentOS

Para instalar pacotes Wallarm do [repositório JFrog Artifactory][doc-repo-mirroring] em um host dedicado a um nó de filtro, execute as seguintes ações neste host:
1.  Navegue até a UI da web do JFrog Artifactory por meio do nome de domínio ou endereço IP (por exemplo, `http://jfrog.exemplo.local:8081/artifactory`).

    Faça login na UI da web com uma conta de usuário.
    
2.  Clique na entrada do menu *Artifacts* e selecione um repositório que contenha os pacotes Wallarm.

3.  Clique no link *Set Me Up*.

    ![Trabalhando com o repositório][img-working-with-repo]
    
    Uma janela pop-up aparecerá. Digite a senha de sua conta de usuário no campo *Type Password* e pressione *Enter*. Agora, as instruções nesta janela conterão suas credenciais.
    
    ![Digitando as credenciais][img-repo-creds]

4.  Role para baixo até o exemplo de configuração `yum` e clique no botão `Copy Snippet to Clipboard` para copiar este exemplo para a área de transferência.

    ![Um exemplo de configuração][img-repo-code-snippet]
    
5.  Crie um arquivo de configuração `yum` (por exemplo, `/etc/yum.repos.d/artifactory.repo`) e cole o trecho copiado nele.

    !!! warning "Importante!"
        Certifique-se de remover o fragmento `<PATH_TO_REPODATA_FOLDER>` do parâmetro `baseurl` para que o `baseurl` aponte para a raiz do repositório.
    
    Um exemplo do arquivo `/etc/yum.repos.d/artifactory.repo` para o repositório de exemplo `wallarm-centos-upload-local`:

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.exemplo.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #Opcional - se você tiver chaves de assinatura GPG instaladas, use as seguintes flags para verificar a assinatura dos metadados do repositório:
    #gpgkey=http://user:password@jfrog.exemplo.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```
    
6.  Instale o pacote `epel-release` no host:
    
    ```
    sudo yum install -y epel-release
    ```

Agora você pode seguir quaisquer instruções de instalação para CentOS. Será necessário pular a etapa em que o repositório é adicionado, pois você configurou um repositório local.