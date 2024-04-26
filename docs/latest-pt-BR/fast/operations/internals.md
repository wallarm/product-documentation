[img-testpolicy-id]:                        ../../images/fast/operations/common/internals/policy-id.png
[img-execution-timeline-recording]:         ../../images/fast/operations/en/internals/execution-timeline.png
[img-execution-timeline-no-recording]:      ../../images/fast/operations/en/internals/execution-timeline-existing-testrecord.png
[img-testrecord]:                           ../../images/fast/operations/en/internals/testrecord-explained.png           
[img-fast-node]:                            ../../images/fast/operations/common/internals/fast-node.png
[img-reuse-token]:                          ../../images/fast/operations/common/internals/reuse-token.png
[img-components-relations]:                 ../../images/fast/operations/common/internals/components-relations.png
[img-common-timeline-no-recording]:         ../../images/fast/operations/en/internals/common-timeline-existing-testrecord.png

[doc-ci-intro]:                     ../poc/integration-overview.md
[doc-node-deployment-api]:          ../poc/node-deployment.md
[doc-node-deployment-ci-mode]:      ../poc/ci-mode-recording.md
[doc-quick-start]:                  ../qsg/deployment-options.md
[doc-integration-overview]:         ../poc/integration-overview.md

[link-create-policy]:               test-policy/general.md
[link-use-policy]:                  test-policy/using-policy.md
[doc-policy-in-detail]:             test-policy/overview.md

[anchor-testpolicy]:    #fast-test-policy
[anchor-testrun]:       #test-run
[anchor-token]:         #token
[anchor-testrecord]:    #test-record

[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-about-timeout]:                create-testrun.md
[doc-node-deployment]:              ../poc/node-deployment.md#deployment-of-the-docker-container-with-the-fast-node

[link-wl-portal-new-policy]:    https://us1.my.wallarm.com/testing/policies/new#general 
[link-wl-portal-policy-tab]:    https://us1.my.wallarm.com/testing/policies
[link-wl-portal-node-tab]:      https://us1.my.wallarm.com/testing/nodes

#   Como o FAST Funciona

--8<-- "../include-pt-BR/fast/cloud-note.md"

!!! info "Uma nota curta sobre o conteúdo do documento"
    As relações entre as entidades (veja abaixo) e os cenários de teste descritos neste capítulo se relacionam com testes com o uso da API Wallarm. Esse tipo de teste emprega todas as entidades; portanto, é possível fornecer ao leitor uma compreensão integral de como essas entidades interagem umas com as outras.
    
    Ao integrar o FAST em um fluxo de trabalho CI/CD, essas entidades permanecem inalteradas; no entanto, a ordem dos passos pode diferir para um caso específico. Leia [este documento][doc-ci-intro] para detalhes adicionais.

O FAST faz uso das seguintes entidades:

* [Registro de teste.][anchor-testrecord]
* [Política de teste FAST.][anchor-testpolicy]
* [Execução de teste.][anchor-testrun]
* [Token.][anchor-token]

Há algumas relações importantes entre as entidades mencionadas anteriormente:
* Uma política de teste e um registro de teste podem ser usados por várias execuções de teste e nós FAST.
* Um token se relaciona a um único nó FAST na nuvem Wallarm, um único contêiner Docker com esse nó FAST e uma única execução de teste.
* Você pode passar o valor do token existente para um contêiner Docker com o nó FAST, desde que o token não esteja em uso por qualquer outro contêiner Docker com o nó.
* Se você criar uma nova execução de teste para o nó FAST enquanto outra execução de teste está em andamento, a execução de teste atual será interrompida e substituída pela nova.

![Relações entre os componentes][img-components-relations]

##   As Entidades Usadas pelo FAST

O nó FAST age como um proxy para todas as solicitações da fonte de solicitações para a aplicação de destino. De acordo com a terminologia Wallarm, essas solicitações são chamadas de *solicitações básicas*.

Quando o nó FAST recebe solicitações, ele as salva no objeto especial “registro de teste” para criar testes de segurança com base nelas mais tarde. De acordo com a terminologia Wallarm, esse processo é chamado de “gravação de solicitações básicas”.

Após a gravação das solicitações básicas, o nó FAST cria um conjunto de teste de segurança de acordo com uma [*política de teste*][anchor-testpolicy]. Em seguida, o conjunto de teste de segurança é executado para avaliar a aplicação de destino contra vulnerabilidades.

O registro de teste permite que solicitações básicas gravadas anteriormente sejam reutilizadas para testar a mesma aplicação de destino ou outra aplicação de destino novamente; não há necessidade de repetir o envio de solicitações básicas idênticas através do nó FAST. Isso só é possível se as solicitações básicas no registro de teste são adequadas para testar a aplicação.

### Registro de Teste

O FAST cria um conjunto de teste de segurança a partir de solicitações básicas que estão armazenadas no registro de teste.

Para povoar um registro de teste com algumas solicitações básicas, uma [execução de teste][anchor-testrun] que está vinculada a este registro de teste e a um nó FAST deve ser executada e algumas solicitações básicas devem ser enviadas através do nó FAST.  

Alternativamente, é possível povoar um registro de teste sem a criação de uma execução de teste. Para fazer isso, você deve executar o nó FAST no modo de gravação. Veja [este documento][doc-node-deployment-ci-mode] para detalhes. 

Dado que o registro de teste está povoado com solicitações, é possível usá-lo com outra execução de teste se uma aplicação em teste pode ser avaliada por vulnerabilidades usando um subconjunto das solicitações básicas armazenadas no registro de teste.  

Um único registro de teste pode ser empregado por vários nós FAST e execuções de teste. Isso pode ser útil se:
* A mesma aplicação de destino está sendo testada novamente.
* Várias aplicações de destino estão sendo testadas simultaneamente com as mesmas solicitações básicas.

![Trabalhando com um registro de teste][img-testrecord]
 

### Política de Teste FAST

Uma *política de teste* define um conjunto de regras para a realização do processo de detecção de vulnerabilidades. Em particular, você pode selecionar os tipos de vulnerabilidade para os quais a aplicação deve ser testada. Além disso, a política determina quais parâmetros na solicitação básica são elegíveis para serem processados durante a criação de um conjunto de teste de segurança. Esses dados são usados pelo FAST para criar solicitações de teste que são usadas para descobrir se a aplicação de destino é explorável.

Você pode [criar][link-create-policy] uma nova política ou [usar uma existente][link-use-policy].

!!! info "Escolhendo a Política de Teste Apropriada"
    A escolha da política de teste depende de como a aplicação de destino testada funciona. É recomendável que você crie uma política de teste distinta para cada uma das aplicações que você testa.

!!! info "Informação Adicional"

    * [Exemplo de política de teste][doc-testpolicy-creation-example] do guia Quick Start
    * [Detalhes da política de teste][doc-policy-in-detail]
### Execução de Teste

Uma *execução de teste* descreve a única iteração do processo de teste de vulnerabilidade.

A execução de teste contém:

* Identificador da [política de teste][anchor-testpolicy]
* Identificador do [registro de teste][anchor-testrecord]

O nó FAST emprega esses valores ao conduzir um teste de segurança de uma aplicação de destino.

Cada execução de teste está intimamente vinculada a um único nó FAST. Se você criar uma nova execução de teste `B` para o nó FAST enquanto outra execução de teste `A` está em progresso para este nó, a execução do teste `A` é abortada e substituída pela execução de teste `B`.

É possível criar uma execução de teste para dois diferentes cenários de teste:
* No primeiro cenário, uma aplicação de destino está sendo testada para vulnerabilidades e as gravações de solicitações básicas estão ocorrendo simultaneamente (para um novo registro de teste). As solicitações devem fluir da fonte de solicitações para a aplicação de destino através do nó FAST para que as solicitações básicas sejam gravadas. 

    Uma criação de uma execução de teste para este cenário será referida como “criação de execução de teste”  ao longo do guia.

* No segundo cenário, uma aplicação de destino está sendo testada para vulnerabilidades com as solicitações básicas extraídas de um registro de teste existente e não-vazio. Neste cenário, não é necessário implantar nenhuma fonte de solicitação.

    Uma criação de uma execução de teste para este cenário será referida como “cópia de execução de teste”  ao longo do guia.

Quando você cria ou copia uma execução de teste, sua execução começa imediatamente. Dependendo do cenário de teste em ação, o processo de execução seguirá diferentes passos (veja abaixo).

### Fluxo de Execução de Teste (gravação de solicitações básicas ocorre)

Quando você cria uma execução de teste, sua execução começa imediatamente e segue os seguintes passos:

1.  Um nó FAST aguarda uma execução de teste. 

    Quando o nó FAST determina que a execução de teste começou, o nó busca os identificadores de política de teste e de registro de teste da execução de teste.
    
2.  Depois de obter os identificadores, o *processo de gravação de solicitações básicas* começa.
    
    Agora o nó FAST está pronto para receber solicitações da fonte de solicitações para a aplicação de destino.
    
3.  Dado que a gravação de solicitação está ativa, é hora de iniciar a execução de testes existentes. As solicitações HTTP e HTTPS são enviadas através do nó FAST, que as reconhece como solicitações básicas.

    Todas as solicitações básicas serão armazenadas no registro de teste que corresponde à execução de teste.
    
4.  Após a execução do teste ser concluída, você pode interromper o processo de gravação.
    
    Há um valor de tempo limite especial definido após a criação de uma execução de teste. Ele determina quanto tempo o FAST deve esperar por novas solicitações básicas antes de interromper o processo de gravação devido à ausência de solicitações básicas (o parâmetro [`inactivity_timeout`][doc-about-timeout]).
    
    Se você não interromper o processo de gravação manualmente, então: 
    
    * A execução de teste continua sua execução até que o valor de tempo limite expire, mesmo que os testes de segurança FAST já tenham terminado.
    * Outras execuções de teste não podem reutilizar o registro de teste até que esta execução de teste pare. 
    
    Você pode interromper o processo de gravação no nó FAST se não houver mais solicitações básicas aguardando. Note o seguinte:

    *  Os processos de criação e execução dos testes de segurança não devem ser interrompidos. A execução de teste para quando a avaliação da aplicação de destino contra as vulnerabilidades termina. Este comportamento ajuda a reduzir o tempo de execução do trabalho CI/CD.
    *  Outras execuções de teste ganham a capacidade de reutilizar o registro de teste uma vez que a gravação é interrompida.
    
5.  O nó FAST cria uma ou mais solicitações de teste com base em cada uma das solicitações básicas de entrada (apenas se a solicitação básica satisfaz a política de teste aplicada).
     
6.  O nó FAST executa as solicitações de teste enviando-as para a aplicação de destino.

Interromper o processo de gravação de solicitações básicas não tem impacto nos processos de criação e execução das solicitações de teste.

Os processos de gravação de solicitações básicas e a criação e execução dos testes de segurança FAST ocorrem paralelamente:

![Fluxo de execução de teste (gravação de solicitação básica ocorre)][img-execution-timeline-recording]

Nota: o gráfico acima mostra o fluxo descrito no [guia rápido de início (FAST quick start guide)][doc-quick-start]. Um fluxo com gravação de solicitações básicas é adequado para teste de segurança manual ou teste de segurança automatizado usando ferramentas CI/CD.

Neste cenário, a API Wallarm é necessária para manipular a execução de teste. Veja [este documento][doc-node-deployment-api] para detalhes. 


### Fluxo de Execução de Teste (solicitações básicas pré-gravadas são usadas)

Quando você copia uma execução de teste, sua execução começa imediatamente e segue os seguintes passos:

1.  Um nó FAST aguarda uma execução de teste. 

    Quando o nó FAST determina que a execução de teste começou, o nó busca os identificadores de política de teste e de registro de teste da execução de teste.
    
2.  Depois de obter os identificadores, o nó extrai as solicitações básicas do registro de teste.

3.  O nó FAST cria uma ou mais solicitações de teste com base em cada uma das solicitações básicas extraídas (apenas se a solicitação básica satisfaz a política de teste aplicada).

4.  O nó FAST executa as solicitações de teste enviando-as para a aplicação de destino.

O processo de extração de solicitações básicas ocorre antes da criação e execução dos testes de segurança FAST:

![Fluxo de execução de teste (solicitações básicas pré-gravadas são usadas)][img-execution-timeline-no-recording]

Note que este é o fluxo de execução que é usado no [guia rápido de início (FAST quick start guide)][doc-quick-start]. O fluxo que utiliza solicitações básicas pré-gravadas é adequado para teste de segurança automatizado com o uso de ferramentas CI/CD.

Neste cenário, a API Wallarm ou o nó FAST em modo CI podem ser usados para manipular a execução de teste. Veja [este documento][doc-integration-overview] para detalhes.

O gráfico abaixo mostra o fluxo de trabalho CI/CD mais comumente encontrado, que está de acordo com a linha do tempo mostrada acima:

![Fluxo de execução de teste (Modo CI)][img-common-timeline-no-recording]


##  Trabalhando com Execuções de Teste

Enquanto lê este guia, você aprenderá como gerenciar o processo de execução de teste usando chamadas de API, especificamente:
* Como interromper o processo de gravação de solicitações básicas se não houver mais solicitações da fonte de solicitações.
* Como verificar o status de execução do teste.

Você precisa obter um [*token*][anchor-token] para fazer tais chamadas de API e para vincular a execução de teste ao nó FAST.

### Token

Um nó FAST é composto por:
* O contêiner Docker em execução com o software FAST.
    
    É aqui que o processo de proxy de tráfego, criação de teste de segurança, execução ocorre.
    
* O nó FAST na nuvem Wallarm.

Um token vincula o contêiner Docker em execução com o nó FAST na nuvem:

![Nó FAST][img-fast-node]

Para implantar um nó FAST, faça o seguinte:
1.  Crie um nó FAST na nuvem Wallarm usando o [portal Wallarm][link-wl-portal-node-tab]. Copie o token fornecido.
2.  Implante um contêiner Docker com o nó e passe o valor do token para o contêiner (este processo é descrito em detalhes [aqui][doc-node-deployment]).

O token serve aos seguintes propósitos também:
* Conectando a execução de teste com o nó FAST.
* Permitindo que você gerencie o processo de execução de teste fazendo chamadas de API.

Você pode criar quantos nós FAST na nuvem Wallarm forem necessários e obter um token para cada um dos nós. Por exemplo, se você tem vários trabalhos CI/CD onde o FAST é necessário, você pode ativar um nó FAST na nuvem para cada trabalho.

É possível reutilizar tokens obtidos anteriormente se os tokens não estiverem em uso por outros contêineres Docker ativos com o nó FAST (por exemplo, qualquer contêiner Docker com um nó que emprega o mesmo token está parado ou removido):

![Reutilizando o token][img-reuse-token]