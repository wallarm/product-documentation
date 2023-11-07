# Criando um modelo de instância de nó de filtragem no GCP

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

Um modelo de instância de nó de filtragem será usado posteriormente como base ao criar um grupo de instâncias gerenciadas. Para criar um modelo de instância de nó de filtragem, faça o seguinte:

1. Navegue para a página **Modelos de instância** na seção **Compute Engine** do menu e clique no botão **Criar modelo de instância**.

    ![Criando um modelo de instância][img-creating-template]

2. Digite o nome do modelo no campo **Nome**.
3. Selecione o tipo de máquina virtual a ser usado para lançar uma máquina virtual com o nó de filtragem no campo **Tipo de máquina**. 

    !!! warning "Selecione o tipo de instância adequado"
        Selecione o mesmo tipo de instância que você usou quando inicialmente configurou o nó de filtragem (ou um mais poderoso).
        
        Usar um tipo de instância menos poderoso pode levar a problemas na operação do nó de filtragem.

4. Clique no botão **Alterar** na configuração **Disco de inicialização**. Na janela que aparece, navegue para a guia **Imagens personalizadas** e selecione o nome do projeto onde você criou sua imagem de máquina virtual na lista suspensa **Mostrar imagens de**. Selecione a [imagem criada anteriormente][link-creating-image] na lista de imagens disponíveis do projeto e clique no botão **Selecionar**.

    ![Selecionando uma imagem][img-selecting-image]
    
5. Para que as instâncias baseadas no modelo sejam idênticas à instância básica, configure todos os parâmetros restantes da mesma maneira que você configurou os parâmetros ao [criar sua instância básica][link-creating-image].
    
    !!! info "Configurando o firewall"
        Certifique-se de que o firewall não bloqueia o tráfego HTTP para o modelo criado. Para habilitar o tráfego HTTP, selecione a caixa de seleção **Permitir tráfego HTTP**.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6. Clique no botão **Criar** e aguarde até que o processo de criação do modelo esteja concluído. 

Após criar o modelo de instância, você pode prosseguir com a [criação de um grupo de instâncias gerenciadas][link-creating-instance-group] com dimensionamento automático ativado.