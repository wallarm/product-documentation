!!! alerta "O erro "assinaturas não puderam ser verificadas""
    Se as chaves GPG adicionadas expirarem, o seguinte erro será retornado:

    ```
    W: Erro GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: As seguintes
    assinaturas não puderam ser verificadas porque a chave pública não está disponível: NO_PUBKEY 1111FQQW999
    E: O repositório 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' não é assinado.
    N: A atualização de tal repositório não pode ser feita de forma segura e, portanto, é desativada por padrão.
    N: Consulte a página de manual apt-secure(8) para detalhes sobre a criação de repositório e configuração de usuário.
    ```

    Para resolver o problema, por favor importe novas chaves GPG para os pacotes Wallarm e então atualize os pacotes usando os seguintes comandos:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```