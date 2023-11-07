[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#5-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

# Criando uma imagem com o nó de filtragem Wallarm na Plataforma Google Cloud

Para configurar o auto escalonamento dos nós de filtragem Wallarm implantados na Plataforma Google Cloud (GCP), você primeiro precisa de imagens de máquinas virtuais. Este documento descreve o procedimento para preparar uma imagem da máquina virtual com o nó de filtragem Wallarm instalado. Para obter informações detalhadas sobre a configuração do auto escalonamento, prossiga para este [link][link-docs-gcp-autoscaling].

Para criar uma imagem com o nó de filtragem Wallarm no GCP, execute os seguintes procedimentos:
1. [Criando e configurando a instância do nó de filtragem na Plataforma Google Cloud][anchor-node].
2. [Criando uma imagem de máquina virtual com base na instância de nó de filtragem configurada][anchor-gcp].

## 1. Criando e configurando a instância do nó de filtragem na Plataforma Google Cloud

Antes de criar uma imagem, você precisa realizar uma configuração inicial de um único nó de filtragem Wallarm. Para configurar um nó de filtragem, faça o seguinte:
1. [Crie e configure][link-docs-gcp-node-setup] uma instância de nó de filtragem no GCP.

    !!! warning "Forneça ao nó de filtragem uma conexão à internet"
        O nó de filtragem requer acesso a um servidor Wallarm API para um funcionamento adequado. A escolha do servidor Wallarm API depende do Wallarm Cloud que você está usando:

        * Se estiver usando a nuvem dos EUA, seu nó precisa ter acesso ao `https://us1.api.wallarm.com`.
        * Se estiver usando a nuvem da UE, seu nó precisa ter acesso ao `https://api.wallarm.com`.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2. [Conecte][link-cloud-connect-guide] o nó de filtragem à nuvem Wallarm.

    !!! warning "Use um token para se conectar à nuvem Wallarm"
        Por favor, observe que você precisa conectar o nó de filtragem à nuvem Wallarm usando um token. Vários nós de filtragem são permitidos para se conectar à nuvem Wallarm usando o mesmo token.
       
        Assim, você não precisará conectar manualmente cada um dos nós de filtragem à nuvem Wallarm quando eles criarem auto-escala.

3. [Configure][link-docs-reverse-proxy-setup] o nó de filtragem para atuar como um proxy reverso para a sua aplicação web.

4. [Certifique-se][link-docs-check-operation] de que o nó de filtragem está correctamente configurado e protege a sua aplicação web contra solicitações maliciosas.

Depois de ter terminado de configurar o nó de filtragem, desligue a máquina virtual completando as seguintes ações:
1. Navegue até a página **Instâncias de VM** na seção **Mecanismo de computação** do menu.
2. Abra o menu suspenso clicando no botão de menu à direita da coluna **Conectar**.
3. Selecione **Parar** no menu suspenso.

![Desligando a máquina virtual][img-vm-instance-poweroff]

!!! info "Desligando usando o comando `poweroff`"
    Você também pode desligar a máquina virtual conectando-se a ela através do protocolo SSH e executando o seguinte comando:
    
    ``` bash
 	poweroff
 	```

## 2. Criando uma imagem de máquina virtual

Agora você pode criar uma imagem de máquina virtual com base na instância de nó de filtragem configurada. Para criar uma imagem, execute os seguintes passos:
1. Navegue até a página **Imagens** na seção **Mecanismo de computação** do menu e clique no botão **Criar imagem**.
2. Insira o nome da imagem no campo **Nome**.
3. Selecione **Disco** na lista suspensa **Origem**.
4. Selecione o nome da [máquina virtual anteriormente criada][anchor-node] na lista suspensa **Disco de origem**.

    ![Criando uma imagem][img-create-image]

5. Clique no botão **Criar** para iniciar o processo de criação da imagem da máquina virtual.

Uma vez terminado o processo de criação da imagem, você será direcionado para uma página que contém a lista de imagens disponíveis. Certifique-se de que a imagem foi criada com sucesso e está presente na lista.

![Lista de imagens][img-check-image]

Agora você pode [configurar o auto escalonamento][link-docs-gcp-autoscaling] dos nós de filtragem Wallarm na Plataforma Google Cloud utilizando a imagem preparada.