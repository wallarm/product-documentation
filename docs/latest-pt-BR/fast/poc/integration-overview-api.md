[img-sample-job-recording]:     ../../images/fast/poc/en/integration-overview/sample-job.png
[img-sample-job-no-recording]:  ../../images/fast/poc/en/integration-overview/sample-job-no-recording.png

[doc-testrun]:                  ../operations/internals.md#test-run
[doc-container-deployment]:     node-deployment.md#deployment-of-the-docker-container
[doc-testrun-creation]:         node-deployment.md#creating-a-test-run 
[doc-testrun-copying]:          node-deployment.md#copying-a-test-run     
[doc-proxy-configuration]:      proxy-configuration.md
[doc-stopping-recording]:       stopping-recording.md
[doc-testrecord]:               ../operations/internals.md#test-record
[doc-waiting-for-tests]:        waiting-for-tests.md

[anchor-recording]:             #deployment-via-the-api-when-baseline-requests-recording-takes-place 
[anchor-no-recording]:          #deployment-via-the-api-when-prerecorded-baseline-requests-are-used

[doc-integration-overview]:     integration-overview.md

#   Integração via Wallarm API

Existem vários métodos de implantação:
1.  [Implantação via API quando o registro de solicitações de linha de base ocorre.][anchor-recording]
2.  [Implantação via a API quando as solicitações de linha de base pré-gravadas são usadas.][anchor-no-recording]


##  Implantação via a API Quando o Registro de Solicitações de Linha de Base Ocorre

Uma [execução de teste][doc-testrun] é criada neste cenário. As solicitações de linha de base serão registradas em um registro de teste que corresponde à execução de teste.

Os passos correspondentes do fluxo de trabalho são:

1.  Construindo e implantando a aplicação alvo.

2.  Implantando e configurando o nó FAST:
    
    1.  [Implantando um contêiner Docker com o nó FAST][doc-container-deployment].
    
    2.  [Criando uma execução de teste][doc-testrun-creation].
    
        Após realizar estas ações, certifique-se de que o nó FAST está pronto para iniciar o processo de gravação de solicitações de linha de base.
    
3.  Preparando e configurando uma ferramenta de teste:
    
    1.  Implantando e realizando uma configuração básica da ferramenta de teste.
    
    2.  [Configurando o nó FAST como um servidor proxy][doc-proxy-configuration].
    
4.  Executando os testes existentes.
    
    O nó FAST começará a criar e executar o conjunto de testes de segurança quando receber a primeira solicitação de linha de base.
    
5.  Parando o processo de gravação de solicitações de linha de base.
    
    O processo de gravação [deve ser interrompido][doc-stopping-recording] após a execução de todos os testes existentes.
    
    Agora, o [registro de teste][doc-testrecord] que contém as solicitações de linha de base gravadas, está pronto para ser reutilizado no fluxo de trabalho de CI/CD que trabalha com as solicitações de linha de base já gravadas.  
    
6.  Aguardando a conclusão dos testes de segurança FAST.
    
    Verifique periodicamente o status da execução de teste fazendo uma solicitação de API. Isso ajuda [a determinar se os testes de segurança estão concluídos ou não][doc-waiting-for-tests].
    
7.  Obtendo os resultados do teste.

Este cenário é mostrado na imagem abaixo:

![Um exemplo de um trabalho de CI/CD com o registro de solicitações][img-sample-job-recording]


##  Implantação via a API Quando as Solicitações de Linha de Base Pré-Gravadas são Utilizadas

Uma execução de teste é copiada neste cenário. Durante a cópia, um identificador de registro de teste existente é passado para a execução de teste. O registro de teste é adquirido no fluxo de trabalho de CI/CD com registro de solicitações de linha de base.

Os passos correspondentes do fluxo de trabalho são:

1.  Construindo e implantando a aplicação alvo.

2.  Implantando e configurando o nó FAST:
    
    1.  [Implantando um contêiner Docker com o nó FAST][doc-container-deployment].
    
    2.  [Copiando uma execução de teste][doc-testrun-copying].    

3.  Extraindo as solicitações de linha de base do registro de teste fornecido com o nó FAST. 

4.  Realizando teste de segurança da aplicação alvo com o nó FAST.

5.  Aguardando a conclusão dos testes de segurança FAST.
    
    Verifique periodicamente o status da execução de teste fazendo uma solicitação de API. Isso ajuda [a determinar se os testes de segurança estão concluídos ou não][doc-waiting-for-tests].
    
6.  Obtendo os resultados do teste.

![Um exemplo de um trabalho de CI/CD com uso de solicitações pré-gravadas][img-sample-job-no-recording]   


##  O Ciclo de Vida do Contêiner do Nó FAST (Implantação via API)

Este cenário pressupõe que o contêiner Docker com o nó FAST é executado apenas uma vez para um determinado trabalho de CI/CD e é removido quando o trabalho termina.
 
Se o nó FAST não encontrar erros críticos durante a operação, ele será executado em um loop infinito, aguardando novas execuções de teste e solicitações de linha de base para testar a aplicação alvo novamente.
  
O contêiner Docker com o nó deve ser parado explicitamente pela ferramenta de CI/CD quando o trabalho de CI/CD é finalizado.

<!-- -->
Você pode referir-se ao documento [“Fluxo de trabalho de CI/CD com FAST”][doc-integration-overview], se necessário.