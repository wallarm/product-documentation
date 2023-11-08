!!! aviso "Problema com as chaves GPG do CentOS"
    Se você já adicionou o repositório Wallarm e obteve um erro relacionado a chaves GPG do CentOS inválidas, então siga estes passos:

    1. Remova o repositório adicionado usando o comando `yum remove wallarm-node-repo`.
    2. Adicione o repositório usando o comando da aba apropriada acima.

    Possíveis mensagens de erro:

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] a assinatura repomd.xml não pôde ser verificada para wallarm-node_2.14`
    * `Um dos repositórios configurados falhou (Wallarm Node para CentOS 7 - 2.14), e o yum não tem dados suficientes em cache para continuar.`