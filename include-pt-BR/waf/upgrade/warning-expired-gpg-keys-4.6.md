!!! atenção "O erro "assinaturas não puderam ser verificadas""
    Se as chaves GPG adicionadas expiraram, o seguinte erro seria retornado:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release: As seguintes
    assinaturas não puderam ser verificadas porque a chave pública não está disponível: NO_PUBKEY 1111FQQW999
    E: O repositório 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release' não está assinado.
    N: Atualizar a partir de tal repositório não pode ser feito de forma segura, e portanto é desativado por padrão.
    N: Consulte a página de manual apt-secure(8) para detalhes da criação de repositório e configuração do usuário.
    ```

    Para corrigir o problema, por favor importe novas chaves GPG para os pacotes Wallarm e então atualize os pacotes usando os seguintes comandos:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```