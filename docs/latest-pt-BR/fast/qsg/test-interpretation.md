[img-dashboard]:            ../../images/fast/qsg/common/test-interpretation/25-qsg-fast-test-int-dashboard.png
[img-testrun]:              ../../images/fast/qsg/common/test-interpretation/27-qsg-fast-test-int-testrun-screen.png
[img-test-run-expanded]:    ../../images/fast/qsg/common/test-interpretation/28-qsg-fast-testrun-opened.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-testrun-expanded]:     ../../images/fast/qsg/common/test-interpretation/29-qsg-fast-test-int-testrun-expanded.png
[img-log]:                  ../../images/fast/qsg/common/test-interpretation/30-qsg-fast-test-int-testrun-log.png
[img-vuln-description]:     ../../images/fast/qsg/common/test-interpretation/31-qsg-fast-test-int-events-vuln-description.png     
[img-vuln-details]:         ../../images/fast/qsg/common/test-interpretation/32-qsg-fast-int-issue-details.png

[link-previous-chapter]:    test-run.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-how-to-search]:       https://docs.wallarm.com/en/user-en/use-search-en.html    


# Interpretando os resultados dos testes

Este capítulo fornecerá uma visão geral das ferramentas de interpretação dos resultados dos testes no [Portal My Wallarm][link-wl-console]. Ao término deste capítulo, você terá obtido mais informações sobre a vulnerabilidade XSS descoberta no [capítulo anterior][link-previous-chapter].

1. Clique na aba "Painéis → FAST" para ter uma visão rápida do que está acontecendo. O painel fornece um resumo de todas as execuções de teste e seus status, juntamente com as contagens de vulnerabilidade para um período de tempo escolhido.

    ![Painel][img-dashboard]

2.  Se você selecionar a aba “Execuções de teste”, poderá observar a lista de todas as execuções de teste, juntamente com algumas informações breves sobre cada uma delas, como:

    * Status da execução do teste (em andamento, bem-sucedido ou falho)
    * Se um registro de solicitação base está em andamento
    * Quantas solicitações base foram registradas
    * Quais vulnerabilidades foram encontradas (se houver)
    * O nome de domínio do aplicativo de destino
    * Onde o processo de geração e execução do teste ocorreu (nó ou nuvem)

    ![Execuções de teste][img-testrun]

3.  Explore uma execução do teste em detalhe clicando nela:

    ![Execução do teste expandida][img-test-run-expanded]

    Você pode obter as seguintes informações de uma execução de teste expandida:

    * O número de solicitações base processadas
    * A data de criação da execução do teste
    * A duração da execução do teste
    * O número de solicitações que foram enviadas para o aplicativo de destino
    * O status do processo de teste de solicitações base:

        * **Aprovado** ![Status: Aprovado][img-status-passed]
        
            Nenhuma vulnerabilidade foi encontrada para a dada solicitação base (depende da política de teste escolhida - se você escolher outra, algumas vulnerabilidades podem ser encontradas) ou a política de teste não é aplicável à solicitação.
        
        * **Falhou** ![Status: Falhou][img-status-failed]  
        
            Vulnerabilidades foram encontradas para a dada solicitação base.
            
        * **Em andamento** ![Status: Em andamento][img-status-inprogress]
              
            A solicitação base está sendo testada para vulnerabilidades.
            
        * **Erro** ![Status: Erro][img-status-error]  
            
            O processo de teste foi interrompido devido a erros.
            
        * **Aguardando** ![Status: Aguardando][img-status-waiting]      
        
            A solicitação base está na fila para teste. Apenas um número limitado de solicitações pode ser testado simultaneamente.
            
        * **Interrompido** ![Status: Interrompido][img-status-interrupted]
        
            O processo de teste foi interrompido manualmente («Ações» → «Interromper») ou outra execução de teste foi realizada no mesmo nó FAST.

4.  Para explorar uma solicitação base em detalhe, clique nela:

    ![Execução do teste expandida][img-testrun-expanded]
    
    Para cada solicitação base individual, são fornecidas as seguintes informações:

    * Hora de criação
    * O número de solicitações de teste que foram geradas e enviadas para o aplicativo de destino
    * A política de teste em utilização
    * O status do processamento da solicitação

5.  Para visualizar o log completo do processamento da solicitação, selecione o link “Detalhes” à extrema direita:

    ![Log de processamento da solicitação][img-log]

6.  Para obter uma visão geral das vulnerabilidades encontradas, clique no link “Problema”:

    ![Breve descrição das vulnerabilidades][img-vuln-description]

    Para explorar uma vulnerabilidade em detalhe, clique na descrição da vulnerabilidade:

    ![Detalhes da vulnerabilidade][img-vuln-details]
            
Agora, você deve estar familiarizado com as ferramentas que ajudam a interpretar os resultados dos testes.