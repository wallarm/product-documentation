[link-docs-aws-autoscaling]: autoscaling-group-guide.md
[link-docs-aws-node-setup]: ../../../installation/cloud-platforms/aws/ami.md
[link-ssh-keys-guide]: ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys
[link-security-group-guide]: ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group
[link-cloud-connect-guide]: ../../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]: ../../../installation/cloud-platforms/aws/ami.md#6-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]: ../../installation-check-operation-en.md

[img-launch-ami-wizard]: ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]: ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]: ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

# Criando um AMI com o nodo de filtragem Wallarm

Você pode configurar o auto scaling para os nodos de filtragem Wallarm implantados na nuvem Amazon. Esta função requer imagens de máquina virtual previamente preparadas.

Este documento descreve o procedimento de preparação de uma imagem de máquina Amazon (AMI) com o nodo de filtragem Wallarm instalado. AMI é necessário para a configuração de auto scaling do nodo de filtragem. Para ver informações detalhadas sobre a configuração do auto scaling, prossiga para este [link][link-docs-aws-autoscaling].

Para criar um AMI com o nodo de filtragem Wallarm, execute os seguintes procedimentos:

1. [Criando e configurando a instância do nodo de filtragem na nuvem Amazon][anchor-node]
2. [Criando um AMI com base na instância do nodo de filtragem configurada][anchor-ami]


## 1. Criando e configurando a instância do nodo de filtragem Wallarm na nuvem Amazon

Antes de criar um AMI, você precisa executar uma configuração inicial de um único nodo de filtragem Wallarm. Para configurar um nodo de filtragem, faça o seguinte:

1. [Crie][link-docs-aws-node-setup] uma instância de nodo de filtragem na nuvem Amazon.
    
    !!! warning "Chave SSH privada"
        Certifique-se de ter acesso à chave SSH privada (armazenada no formato PEM) que você [criou][link-ssh-keys-guide] anteriormente para se conectar ao nodo de filtragem.

    !!! warning "Forneça ao nodo de filtragem uma conexão à internet"
        O nodo de filtragem requer acesso ao servidor Wallarm API para um funcionamento adequado. A escolha do servidor Wallarm API depende da nuvem Wallarm que você está utilizando:
        
        *   Se você está usando a nuvem dos EUA, seu nodo precisa ter acesso a `https://us1.api.wallarm.com`.
        * Se você está usando a nuvem da UE, seu nodo precisa ter acesso a `https://api.wallarm.com`.
        
Certifique-se de que você escolha a VPC e subredes corretas e [configure um grupo de segurança][link-security-group-guide] de uma maneira que não impeça o nodo de filtragem de acessar os servidores Wallarm API.

2. [Conecte][link-cloud-connect-guide] o nodo de filtragem à nuvem Wallarm.

    !!! warning "Use um token para se conectar à nuvem Wallarm"
        Por favor, note que você precisa conectar o nodo de filtragem à nuvem Wallarm usando um token. É permitido conectar vários nodos de filtragem à nuvem Wallarm usando o mesmo token. 
        
        Assim, ao escalar automaticamente os nodos de filtragem, você não precisará conectar manualmente cada um dos nodos de filtragem à nuvem Wallarm.

3. [Configure][link-docs-reverse-proxy-setup] o nodo de filtragem para atuar como um proxy reverso para sua aplicação web.

4. [Certifique-se][link-docs-check-operation] de que o nodo de filtragem está configurado corretamente e proteje sua aplicação web contra solicitações maliciosas.

Depois de ter configurado o nodo de filtragem, desligue a máquina virtual executando as seguintes ações:

1. Navegue até a aba **Instances** no painel Amazon EC2.
2. Selecione sua instância de nodo de filtragem configurada.
3. Selecione **Instance State** e depois **Stop** no menu suspenso **Actions**.

!!! info "Desligando com o comando `poweroff`"
    Você também pode desligar a máquina virtual conectando-se a ela via protocolo SSH e executando o seguinte comando:
    
    ``` bash
    poweroff
    ```

## 2. Criando uma imagem de máquina Amazon

Agora você pode criar uma imagem de máquina virtual com base na instância do nodo de filtragem configurada. Para criar uma imagem, execute as seguintes etapas:

1. Prossiga para a aba **Instances** no painel Amazon EC2.
2. Selecione sua instância de nodo de filtragem configurada.
3. Inicie o assistente de criação de imagens selecionando **Image** e depois **Create Image** no menu suspenso **Actions**.

    ![Iniciar o assistente de criação AMI][img-launch-ami-wizard]
    
4. O formulário **Create Image** aparecerá. Digite o nome da imagem no campo **Image name**. Você pode deixar os demais campos inalterados.

    ![Configurar parâmetros no assistente de criação AMI][img-config-ami-wizard]
    
5. Clique no botão **Create Image** para iniciar o processo de criação da imagem da máquina virtual.
    
    Quando o processo de criação da imagem estiver concluído, a mensagem correspondente será exibida. Navegue até a aba **AMIs** no painel Amazon EC2 para certificar-se de que a imagem foi criada com sucesso e tem o status **Available**.
    
    ![Explorar a AMI criada][img-explore-created-ami]

!!! info "Visibilidade da imagem"
    Como a imagem preparada contém configurações específicas para sua aplicação e o token Wallarm, não é recomendável alterar a configuração de visibilidade da imagem e torná-la pública (por padrão, as AMIs são criadas com a configuração de visibilidade **Private**).

Agora você pode [configurar][link-docs-aws-autoscaling] o auto scaling dos nodos de filtragem Wallarm na nuvem Amazon usando a imagem preparada.