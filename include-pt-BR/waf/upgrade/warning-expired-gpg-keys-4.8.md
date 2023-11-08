!!! warning "O erro "as assinaturas não puderam ser verificadas""
    Se as chaves GPG adicionadas expirarem, o seguinte erro será retornado:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Release:As seguintes
    assinaturas não puderam ser verificadas porque a chave pública não está disponível: NO_PUBKEY 1111FQQW999
    E: O repositório 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Release' não está assinado.
    N: Atualizar a partir de tal repositório não pode ser feito de maneira segura, e é, portanto, desativado por padrão.
    N: Veja a página man do apt-secure(8) para detalhes da criação de repositório e configuração do usuário.
    ```

    Para corrigir o problema, importe novas chaves GPG para os pacotes Wallarm e então atualize os pacotes usando os seguintes comandos:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```
