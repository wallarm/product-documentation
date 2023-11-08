[img-sample-job-ci-mode]: ../../images/fast/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]: ci-mode-recording.md#executando-um-nó-rápido-em-modo-de-gravação
[doc-testing-mode]: ci-mode-testing.md#executando-um-nó-rápido-em-modo-de-teste
[doc-proxy-configuration]: proxy-configuration.md
[doc-fast-container-stopping]: ci-mode-recording.md#parando-e-removendo-o-container-docker-com-o-nó-rápido-em-modo-de-gravação
[doc-recording-variables]: ci-mode-recording.md#variáveis-de-ambiente-em-modo-de-gravação
[doc-integration-overview]: integration-overview.md

# Integração via Nó FAST: Princípios e Etapas

Para realizar um teste de segurança no modo CI, um nó FAST deve ser executado sequencialmente em dois modos:
1. [Modo de Gravação][doc-recording-mode]
2. [Modo de Teste][doc-testing-mode]

A variável de ambiente `CI_MODE` define o modo de operação de um nó FAST. Essa variável pode assumir os seguintes valores:
* `gravação`
* `teste`

Neste cenário, o nó FAST primeiro cria um registro de teste e escreve solicitações base nele. Quando a gravação é concluída, o nó cria uma execução de teste que usa as solicitações base pré-gravadas como base para seus testes de segurança. 

Este cenário é mostrado na imagem abaixo:

![Um exemplo de um trabalho CI/CD com nó FAST no modo CI][img-sample-job-ci-mode]

As etapas correspondentes do fluxo de trabalho são:

1. Construção e implantação do aplicativo alvo.

2. [Execução do nó FAST no modo de gravação][doc-recording-mode].

    No modo gravação o nó FAST realiza as seguintes ações:

    * Faz o proxy das solicitações base da fonte das solicitações para o aplicativo alvo.
    * Grava essas solicitações base no registro de teste para criar posteriormente o conjunto de testes de segurança baseado nelas.
    
    !!! info "Nota Sobre as Execuções de Testes"
        Uma execução de teste não é criada no modo de gravação.

3. Preparação e configuração de uma ferramenta de teste:
    
    1. Implantação e configuração básica da ferramenta de teste.
    
    2. [Configuração do nó FAST como um servidor proxy][doc-proxy-configuration].
        
4. Execução dos testes existentes.
    
    O nó FAST fará o proxy e registrará solicitações base no aplicativo alvo.
    
5. Parada e remoção do contêiner do nó FAST.

    Se o nó FAST não encontrar erros críticos durante a operação, ele funcionará até que o timer [`INACTIVITY_TIMEOUT`][doc-recording-variables] expire ou a ferramenta CI/CD pare explicitamente o contêiner.
    
    Depois que os testes existentes são concluídos, o nó FAST [precisa ser interrompido][doc-fast-container-stopping]. Isso interromperá o processo de gravação das solicitações base. Em seguida, o contêiner do nó pode ser descartado.          

6. [Execução do nó FAST no modo de teste][doc-testing-mode].

    No modo de teste, o nó FAST realiza as seguintes ações:
    
    * Cria uma execução de teste baseada nas solicitações base gravadas na etapa 4.
    * Começa a criar e executar um conjunto de testes de segurança.
    
7. Obtenção dos resultados dos testes. Parada do contêiner do nó FAST.    
    
    Se o nó FAST não encontrar erros críticos durante a operação, ele funciona até que os testes de segurança estejam concluídos. O nó é desligado automaticamente. Em seguida, o contêiner do nó pode ser descartado.

##  Ciclo de Vida do Contêiner do Nó FAST (Implantação via Modo CI)

Este cenário presume que o contêiner Docker com o nó FAST primeiro é executado no modo de gravação, depois no modo de teste. 

Depois que a execução do nó FAST é concluída em qualquer dos modos, o contêiner do nó é removido. Em outras palavras, um contêiner do nó FAST é recriado toda vez que o modo de operação muda.