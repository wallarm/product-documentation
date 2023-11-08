[link-doc-ami-creation]:        create-image.md
[link-doc-lb-guide]:            load-balancing-guide.md

[link-ssh-keys-guide]:          ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys
[link-security-group-guide]:    ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group

[link-doc-as-faq]:              https://aws.amazon.com/autoscaling/faqs/

[img-create-lt-wizard]:         ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/create-launch-template.png
[img-create-asg-wizard]:        ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/create-asg-with-template.png
[img-asg-wizard-1]:             ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/asg-wizard-1.png
[img-asg-increase-policy]:      ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/group-size-increase.png
[img-asg-decrease-policy]:      ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/group-size-decrease.png
[img-alarm-example]:            ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/alarm-example.png
[img-check-asg-in-cloud]:       ../../../images/cloud-node-status.png

[anchor-lt]:    #1-creating-a-launch-template
[anchor-asg]:   #2-creating-an-auto-scaling-group

#   Configurando o auto scaling do nó de filtragem

!!! info "Direitos necessários"
    Antes de configurar o auto scaling, certifique-se de que sua conta da Amazon AWS tem concedido um dos seguintes direitos:
    
    *   `AutoScalingFullAccess`
    *   `AutoScalingConsoleFullAccess`

Para configurar o auto scaling do nó de filtragem, siga os seguintes passos:
1.  [Criando um Template de Lançamento][anchor-lt]
2.  [Criando um Grupo de Auto Scaling][anchor-asg]

##  1.  Criando um Template de Lançamento

Um Template de Lançamento define o tipo de instância a ser usado durante o fornecimento de uma Imagem de Máquina Amazon (AMI) e configura alguns dos parâmetros gerais da máquina virtual.

Crie um Template de Lançamento fazendo os seguintes passos:

1.  Navegue até a aba **Templates de Lançamento** no painel da Amazon EC2 e clique no botão **Criar template de lançamento**.

2.  Insira o nome do template no campo **Nome do template de lançamento**.

3.  Selecione a [Imagem de Máquina Amazon criada anteriormente][link-doc-ami-creation]. Para fazer isso, clique no link **Pesquisar por AMI** e selecione a imagem necessária do catálogo **Minhas AMIs**.

4.  Selecione o tipo de instância para lançar uma máquina virtual de nó de filtragem a partir da lista **Tipo de instância**.

    !!! warning "Selecione o tipo de instância apropriado"
        Selecione o mesmo tipo de instância que você usou quando configurou inicialmente o nó de filtragem ou um mais poderoso.
        
        Usar um tipo de instância menos poderoso pode levar a problemas na operação do nó de filtragem. 

5.  Selecione o nome do [par de chaves SSH criado anteriormente][link-ssh-keys-guide] para acessar o nó de filtragem a partir da lista **Nome do par de chaves**.

6.  Selecione o [Grupo de Segurança criado anteriormente][link-security-group-guide] a partir da lista **Grupos de Segurança**.

7.  Clique no botão **Criar template de lançamento**.

    ![Criando um Template de Lançamento][img-create-lt-wizard]
    
Aguarde até que o processo de criação do template seja concluído.

Após criar o Template de Lançamento, você pode prosseguir com a criação de um Grupo de Auto Scaling.

##  2.  Criando um Grupo de Auto Scaling

!!! info "Selecionando um método de auto scaling"
    Esta seção descreve o processo de criação de um Grupo de Auto Scaling usando o método EC2 Auto Scaling. 

    Você também pode usar o método AWS Auto Scaling. 

    Para ver um FAQ detalhado sobre métodos de auto scaling da Amazon, prossiga para este [link][link-doc-as-faq].

Para criar um Grupo de Auto Scaling, faça o seguinte:

1.  Navegue até a aba **Grupos de Auto Scaling** no painel da Amazon EC2 e clique no botão **Criar Grupo de Auto Scaling**.

2.  Selecione a opção **Template de Lançamento**, selecione o [Template de Lançamento criado anteriormente][anchor-lt] da lista e clique no botão **Próximo passo**. 

    ![Criando um Grupo de Auto Scaling][img-create-asg-wizard]
    
3.  Insira o nome desejado do Grupo de Auto Scaling no campo **Nome do grupo**.

4.  Selecione a versão **Mais recente** do Template de Lançamento a partir da lista **Versão do Template de Lançamento**.

5.  Selecione o tipo de instância necessário para o Grupo de Auto Scaling escolhendo uma das opções **Composição da frota**.

    Se você seguiu este guia ao criar um Template de Lançamento e um tipo de instância para lançar máquinas virtuais foi especificado, então você pode usar a opção **Aderir ao template de lançamento**.
    
    !!! info "Selecione o tipo de instância apropriado"
        Você também pode selecionar a opção **Combinar opções de compra e instâncias** se nenhum tipo de instância for especificado no seu Template de Lançamento ou se você quiser selecionar múltiplos tipos de instância diferentes para auto scaling.
        
        Selecione o mesmo tipo de instância que você usou quando configurou inicialmente o nó de filtragem ou um mais poderoso. Usar um tipo de instância menos poderoso pode levar a problemas na operação do nó de filtragem.

6.  Insira o tamanho inicial do Grupo de Auto Scaling no campo **Tamanho do grupo** (por exemplo, duas instâncias).

7.  Selecione o VPC correto a partir da lista drop-down **Rede**.

8.  Selecione as sub-redes corretas a partir da lista drop-down **Sub-redes**.

    !!! warning "Forneça uma conexão com a internet para o nó de filtragem"
        O nó de filtragem requer acesso ao servidor API Wallarm para funcionamento adequado. A escolha do servidor API Wallarm depende da Nuvem Wallarm que você está usando:
        
        * Se você estiver usando a Nuvem US, seu nó precisa ter acesso concedido a `https://us1.api.wallarm.com`.
        * Se você estiver usando a Nuvem EU, seu nó precisa ter acesso concedido a `https://api.wallarm.com`.

        Certifique-se de escolher o VPC e as sub-redes corretos e [configurar um grupo de segurança][link-security-group-guide] de forma a não impedir o acesso do nó de filtragem aos servidores API da Wallarm.

    ![Configurações gerais do Grupo de Auto Scaling][img-asg-wizard-1]
    
9.  Navegue para a página **Configurar políticas de scaling** clicando no botão **Próximo: Configurar políticas de scaling**.

10. Selecione a opção **Use políticas de scaling para ajustar a capacidade deste grupo** para ativar o auto scaling.

11. Insira o tamanho mínimo e máximo do Grupo de Auto Scaling.

    !!! info "Tamanho do Grupo de Auto Scaling"
        Note que o tamanho mínimo do Grupo de Auto Scaling pode ser menor que o tamanho inicial do grupo especificado no sexto passo.
    
12. Ative o modo de configuração de políticas passo a passo selecionando a opção **Escale o Grupo de Auto Scaling usando políticas de scaling passo a passo ou simples**.

13. Configure a política de aumento do tamanho do grupo usando o grupo de parâmetros **Aumentar Tamanho do Grupo**.

    ![Política de aumento do tamanho do Grupo de Auto Scaling][img-asg-increase-policy]
    
    1.  Se necessário, especifique o nome da política de aumento do tamanho do grupo usando o parâmetro **Nome**.

    2.  Selecione o evento a partir do **Execute a política quando** para especificar o evento que provocará o aumento do tamanho do grupo. Se você não criou nenhum evento anteriormente, clique no botão **Adicionar Alarme** para criar um evento.

    3.  Você pode configurar um nome de evento, uma métrica para monitorar e notificações sobre ocorrências de eventos.
    
        !!! info "Funções necessárias para configurar notificações"
            Sua conta Amazon AWS precisa da função **AutoScalingNotificationAccessRole** para a configuração de notificações.
        
        !!! info "Exemplo"
            Você pode configurar a ativação de um evento com o nome **Utilização alta da CPU** ao atingir uma carga média do processador de 60% em cinco minutos:
            
            ![Um exemplo de alarme][img-alarm-example]
        
        
        
        !!! info "Métricas padrão disponíveis da nuvem Amazon"
            *   Utilização da CPU (em percentuais)
            *   Leituras de Disco (em bytes)
            *   Gravações de Disco (em bytes)
            *   Contagem de Operações de Leitura de Disco  
            *   Contagem de Operações de Gravação de Disco 
            *   Entrada de Rede (em bytes) 
            *   Saída de Rede (em bytes)

    4.  Clique no botão **Criar Alarme** para criar um evento.
    
    5.  Selecione a ação a ser tomada no caso do evento **Utilização alta da CPU** ser acionado. Por exemplo, você pode configurar uma política de auto scaling para adicionar (usando a ação **Adicionar**) uma instância quando o evento for acionado.
    
    6.  O evento pode ser acionado cedo se ocorrerem picos no consumo de recursos após a adição de uma nova instância. Para evitar isso, você pode configurar um período de aquecimento em segundos usando o parâmetro **Instâncias precisam de `X` segundos para aquecer**. Nenhum evento será acionado durante este período de tempo.
    
14. Similarmente, use o grupo de parâmetros **Diminuir Tamanho do Grupo** para configurar a política de diminuição do tamanho do grupo.

    ![Política de diminuição do tamanho do grupo][img-asg-decrease-policy]
    
15. Se necessário, configure notificações e tags para o Grupo de Auto Scaling ou prossiga para a revisão das mudanças clicando no botão **Revisar**.

16. Certifique-se de que todos os parâmetros estão corretamente especificados e depois inicie o processo de criação do Grupo de Auto Scaling clicando no botão **Criar Grupo de Auto Scaling**.

O número especificado de instâncias será lançado automaticamente após a criação bem-sucedida do Grupo de Auto Scaling.

Você pode verificar que o Grupo de Auto Scaling foi criado corretamente visualizando o número de instâncias lançadas no grupo e comparando esses dados com o número de nós de filtragem conectados à Nuvem Wallarm.

Você pode fazer isso usando o Console Wallarm. Por exemplo, se duas instâncias com nós de filtragem estiverem operando simultaneamente, o Console Wallarm exibirá esse número para o nó Wallarm correspondente na seção **Nós**.

![Checando o status do Grupo de Auto Scaling][img-check-asg-in-cloud]

Agora você pode prosseguir com a [criação e configuração][link-doc-lb-guide] de um balanceador de carga.