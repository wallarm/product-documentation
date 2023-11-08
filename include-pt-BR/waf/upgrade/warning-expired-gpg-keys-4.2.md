!!! Atenção "O erro "as assinaturas não puderam ser verificadas""
    Se as chaves GPG adicionadas expiraram, o seguinte erro será retornado:

    ```
    W: Erro GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ Release:As seguintes
    assinaturas não puderam ser verificadas porque a chave pública não está disponível: NO_PUBKEY 1111FQQW999
    E: O repositório 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ Release' não é assinado.
    N: A atualização de um repositório como esse não pode ser feita de maneira segura e, portanto, está desativada por padrão.
    N: Consulte a página do manual apt-secure(8) para obter detalhes sobre a criação do repositório e configuração do usuário.
    ```

    Para corrigir o problema, importe novas chaves GPG para os pacotes Wallarm e faça um upgrade dos pacotes usando os seguintes comandos:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```