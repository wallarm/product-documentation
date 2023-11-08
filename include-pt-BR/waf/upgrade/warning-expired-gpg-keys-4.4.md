!!! aviso "O erro "assinaturas não puderam ser verificadas""
    Se as chaves GPG adicionadas expiraram, o erro a seguir será retornado:

    ```
    W: Erro GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release: As seguintes
    assinaturas não puderam ser verificadas porque a chave pública não está disponível: NO_PUBKEY 1111FQQW999
    E: O repositório 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release' não está assinado.
    N: A atualização de um repositório como este não pode ser feita de forma segura e, portanto, está desativada por padrão.
    N: Veja a página do manual apt-secure(8) para detalhes sobre a criação de repositórios e configurações do usuário.
    ```

    Para corrigir o problema, por favor importe as novas chaves GPG para os pacotes Wallarm e, em seguida, atualize os pacotes usando os seguintes comandos:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```