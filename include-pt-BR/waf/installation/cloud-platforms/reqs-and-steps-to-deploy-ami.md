## Requisitos

* Uma conta AWS
* Entendimento de AWS EC2, Security Groups
* Qualquer região AWS de sua escolha, não há restrições específicas na região para a implantação do nó Wallarm
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Console Wallarm para a [Nuvem US](https://us1.my.wallarm.com/) ou [Nuvem EU](https://my.wallarm.com/)
* Acesso a `https://us1.api.wallarm.com:444` para trabalhar com a Nuvem Wallarm US ou a `https://api.wallarm.com:444` para trabalhar com a Nuvem Wallarm EU. Se o acesso puder ser configurado apenas via servidor proxy, então use as [instruções][wallarm-api-via-proxy]
* Executando todos os comandos em uma instância Wallarm como superusuário (por exemplo, `root`)

## 1. Crie um par de chaves SSH na AWS

Durante o processo de implantação, você precisará se conectar à máquina virtual via SSH. A Amazon EC2 permite criar um par nomeado de chaves SSH públicas e privadas que podem ser usadas para se conectar à instância.

Para criar um par de chaves:

1. Navegue até a guia **Key pairs** no painel da Amazon EC2.
2. Clique no botão **Create Key Pair**.
3. Insira um nome para o par de chaves e clique no botão **Create**.

Uma chave SSH privada no formato PEM começará a ser baixada automaticamente. Salve a chave para se conectar à instância criada no futuro.

Para ver informações detalhadas sobre a criação de chaves SSH, prossiga para a [documentação da AWS][link-ssh-keys].

## 2. Crie um Grupo de Segurança

Um Grupo de Segurança define conexões de entrada e saída permitidas e proibidas para máquinas virtuais. A lista final de conexões depende do aplicativo protegido (por exemplo, permitindo todas as conexões de entrada para as portas TCP/80 e TCP/443).

Para criar um grupo de segurança para o nó de filtragem:

1. Navegue até a guia **Security Groups** no painel da Amazon EC2 e clique no botão **Create Security Group**.
2. Insira um nome para o grupo de segurança e uma descrição opcional na janela de diálogo que aparece.
3. Selecione o VPC necessário.
4. Configure as regras de conexões de entrada e saída nas guias **Inbound** e **Outbound**.
5. Clique no botão **Create** para criar o grupo de segurança.

![Criando um grupo de segurança][img-create-sg]

!!! warning "Regras para conexões de saída do grupo de segurança"
    Ao criar um grupo de segurança, todas as conexões de saída são permitidas por padrão. Se você restringir as conexões de saída do nó de filtragem, certifique-se de que ele tenha acesso a um servidor API Wallarm. A escolha do servidor API Wallarm depende da Nuvem Wallarm que você está usando:

    * Se você está usando a Nuvem US, seu nó precisa ter acesso à `us1.api.wallarm.com`.
    * Se você está usando a Nuvem EU, seu nó precisa ter acesso à `api.wallarm.com`.
    
    O nó de filtragem requer acesso a um servidor API Wallarm para operação correta.

Para ver informações detalhadas sobre a criação de um Grupo de Segurança, prossiga para a [documentação da AWS][link-sg].

## 3. Inicie uma instância do nó Wallarm

Para iniciar uma instância com o nó de filtragem Wallarm, prossiga para este [link](https://aws.amazon.com/marketplace/pp/B073VRFXSD) e inscreva-se no nó de filtragem.

Ao criar uma instância, você precisa especificar o Grupo de Segurança [criado anteriormente][anchor1] da seguinte forma:

1. Ao trabalhar com o Assistente de Lançamento de Instância, prossiga para a etapa **6. Configure Security Group** de lançamento da instância clicando na guia correspondente.
2. Escolha a opção **Select an existing security group** na configuração **Assign a security group**.
3. Selecione o grupo de segurança na lista que aparece.

Depois de especificar todas as configurações de instância necessárias, clique no botão **Review and Launch**, certifique-se de que a instância está configurada corretamente e clique no botão **Launch**.

Na janela que aparece, especifique o par de chaves [criado anteriormente][anchor2] executando as seguintes ações:

1. Na primeira lista suspensa, selecione a opção **Choose an existing key pair**.
2. Na segunda lista suspensa, selecione o nome do par de chaves.
3. Certifique-se de que você tem acesso à chave privada no formato PEM do par de chaves especificado na segunda lista suspensa e marque a caixa para confirmar isso.
4. Clique no botão **Launch Instances**.

A instância será iniciada com o nó de filtragem pré-instalado.

Para ver informações detalhadas sobre o lançamento de instâncias na AWS, prossiga para a [documentação da AWS][link-launch-instance].

## 4. Conecte-se à instância do nó de filtragem via SSH

Para ver informações detalhadas sobre maneiras de se conectar a uma instância via SSH, prossiga para a [documentação da AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).

Você precisa usar o nome de usuário `admin` para se conectar à instância.

!!! info "Usando a chave para conectar via SSH"
    Use a chave privada no formato PEM que você [criou anteriormente][anchor2] para se conectar à instância via SSH. Essa deve ser a chave privada do par de chaves SSH que você especificou ao criar uma instância.

## 5. Conecte o nó de filtragem à Nuvem Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"