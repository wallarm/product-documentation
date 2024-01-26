[doc-about-tr-token]:   internals.md

[img-testrun-velocity]: ../../images/fast/poc/en/checking-testrun-status/testrun-velocity.png
[img-testrun-avg-rps]:  ../../images/fast/poc/en/checking-testrun-status/testrun-avg-rps.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-test-runs]:            ../../images/fast/poc/en/checking-testrun-status/test-runs.png

[link-wl-portal-testruns-in-progress]:  https://us1.my.wallarm.com/testing/?status=running

[link-integration-chapter]:         integration-overview.md
[link-vuln-list]:                   ../vuln-list.md

[anchor-testrun-estimates]:         #estimates-of-test-runs-execution-speed-and-time-to-completion

[doc-testrun-copying]:              copy-testrun.md
[doc-stop-recording]:               stop-recording.md


#   Verificação do Estado do Teste

Os processos de criação e execução das solicitações de teste começam quando são gravadas a primeira solicitação de linha de base e podem durar uma quantidade significativa de tempo depois que o processo de gravação das solicitações de linha de base foi [interrompido][doc-stop-recording]. Você pode verificar o estado da execução do teste para obter informações sobre os processos em andamento. Para isso, os seguintes métodos podem ser usados:

* [Verificação do status no Wallarm UI](#checking-the-state-via-wallarm-ui)
* [Verificação do status usando método de API](#checking-the-state-using-api-method)

## Verificando o Estado no Wallarm UI

O status da execução do teste é exibido em tempo real no Wallarm UI. Para verificar o estado:

1. Faça login em sua conta Wallarm na [nuvem dos EUA](https://us1.my.wallarm.com/) ou na [nuvem da UE](https://my.wallarm.com/).
2. Abra a seção **Execuções de teste** e clique na execução de teste necessária.

![Exemplo de execução de teste][img-test-runs]

O estado é exibido para cada solicitação de linha de base:

* **Aprovado** ![Status: Aprovado][img-status-passed]
        
    Não foram encontradas vulnerabilidades para a solicitação de linha de base dada.
        
* **Em progresso** ![Status: Em progresso][img-status-inprogress]
              
    A solicitação de linha de base está sendo testada para vulnerabilidades.

* **Falhou** ![Status: Falhou][img-status-failed]  
        
    Vulnerabilidades foram encontradas para a solicitação de linha de base dada. O número de vulnerabilidades e o link para os detalhes são exibidos para cada solicitação de linha de base.
            
* **Erro** ![Status: Erro][img-status-error]  
            
    O processo de teste foi interrompido devido ao erro exibido:

    * `Falha na conexão`: erro de rede
    * `Falha na autenticação`: os parâmetros de autenticação não são passados ou passados incorretamente
    * `Políticas inválidas`: falha ao aplicar a política de teste configurada
    * `Exceção interna`: configuração incorreta do teste de segurança
    * `Erro de gravação`: parâmetros de solicitação incorretos ou perdidos

* **Aguardando** ![Status: Aguardando][img-status-waiting]      
        
    A solicitação de linha de base está na fila para ser testada. Somente um número limitado de solicitações pode ser testado simultaneamente. 
            
* **Interrompido** ![Status: Interrompido][img-status-interrupted]
        
    O processo de teste foi interrompido pelo botão **Interromper teste** ou outra execução de teste foi executada no mesmo nó FAST.

## Verificando o Estado Usando Método de API

!!! info "Informações Necessárias"
    Para prosseguir com as etapas descritas abaixo, são necessários os seguintes dados:
    
    * um token
    * um identificador de test run
    
    Você pode obter informações detalhadas sobre a execução do teste e o token [aqui][doc-about-tr-token].
    
    Os seguintes valores são usados como valores de exemplo neste documento:

    * `token_Qwe12345` como um token.
    * `tr_1234` como um identificador de uma execução de teste.

!!! info "Como escolher o período de tempo certo para executar a verificação de uma execução de teste"
    Você pode verificar o estado da execução do teste em um período de tempo predefinido (por exemplo, 15 segundos). Alternativamente, você pode empregar o tempo estimado de conclusão para uma execução de teste para determinar quando a próxima verificação deve ser feita. Você pode obter esta estimativa enquanto verifica o estado de uma execução de teste. [Veja detalhes abaixo.][anchor-testrun-estimates]

Para realizar uma única verificação do estado da execução do teste, envie a solicitação GET para a URL `https://us1.api.wallarm.com/v1/test_run/test_run_id`:

--8<-- "../include-pt-BR/fast/operations/api-check-testrun-status.md"

Se a solicitação para o servidor API for bem-sucedida, você receberá a resposta do servidor. A resposta fornece muitas informações úteis, incluindo:

* `vulns`: uma matriz que contém informações sobre as vulnerabilidades detectadas no aplicativo alvo. Cada um dos registros de vulnerabilidade contém os seguintes dados sobre a vulnerabilidade específica:
    * `id`: um identificador da vulnerabilidade.
    
    * `threat`: o número no intervalo de 1 a 100, que descreve o nível de ameaça para a vulnerabilidade. Quanto maior o nível, mais severa é a vulnerabilidade.
    * `code`: um código atribuído à vulnerabilidade.
    * `type`: o tipo de vulnerabilidade. O parâmetro pode assumir um dos valores descritos [aqui][link-vuln-list].
    
* `state`: o estado da execução do teste. O parâmetro pode assumir um dos seguintes valores:
    * `cloning`: a clonagem das solicitações de linha de base está em andamento (ao [criar uma cópia][doc-testrun-copying] de uma execução de teste).
    * `running`: a execução do teste está em execução.
    * `paused`: a execução do teste está pausada.
    * `interrupted`: a execução do teste foi interrompida (por exemplo, uma nova execução de teste para o nó FAST foi criada enquanto a execução do teste atual estava sendo conduzida por este nó).
    * `passed`: a execução do teste foi concluída com sucesso (sem vulnerabilidades encontradas).
    * `failed`: a execução do teste foi concluída sem sucesso (algumas vulnerabilidades foram encontradas).
    
* `baseline_check_all_terminated_count`: o número de solicitações de linha de base para as quais todas as verificações de solicitação de teste estão concluídas.
    
* `baseline_check_fail_count`: o número de solicitações de linha de base para as quais algumas das verificações de solicitação de teste falharam (em outras palavras, FAST encontrou uma vulnerabilidade).
    
* `baseline_check_tech_fail_count`: o número de solicitações de linha de base para as quais algumas das verificações de solicitação de teste falharam devido a problemas técnicos (por exemplo, se o aplicativo alvo estava indisponível por algum período de tempo).
    
* `baseline_check_passed_count`: o número de solicitações de linha de base para as quais todas as verificações de solicitação de teste passaram (em outras palavras, FAST não encontrou uma vulnerabilidade). 
    
* `baseline_check_running_count`: o número de solicitações de linha de base para as quais as verificações de solicitação de teste ainda estão em andamento.
    
* `baseline_check_interrupted_count`: o número de solicitações de linha de base para as quais todas as verificações de solicitação de teste foram interrompidas (por exemplo, devido à interrupção da execução do teste)
    
* `sended_requests_count`: o número total de solicitações de teste que foram enviadas ao aplicativo alvo.
    
* `start_time` e `end_time`: horário em que a execução do teste começou e terminou, respectivamente. O tempo é especificado no formato de tempo UNIX.
    
* `domains`: a lista de nomes de domínio do aplicativo alvo para os quais as solicitações de linha de base foram direcionadas.
    
* `baseline_count`: o número de solicitações de linha de base gravadas.
    
* `baseline_check_waiting_count`: o número de solicitações de linha de base que estão aguardando para serem verificadas;

* `planing_requests_count`: o número total de solicitações de teste que estão enfileiradas para serem enviadas ao aplicativo alvo.

###  Estimativas de velocidade de execução e tempo de conclusão do teste

Há um grupo separado de parâmetros na resposta do servidor da API, que permite estimar a velocidade de execução de um teste e o tempo de conclusão. O grupo compreende os seguintes parâmetros:

* `current_rps`—a velocidade atual com que o FAST envia solicitações para o aplicativo alvo (no momento da obtenção do estado da execução do teste).

    Este valor é a média das solicitações por segundo (RPS). Esta RPS média é calculada como o número de solicitações que o FAST enviou para o aplicativo alvo no intervalo de 10 segundos antes do estado da execução do teste ser adquirido. 

    **Exemplo:**
    Se o estado da execução do teste é adquirido em 12:03:01 que o valor do parâmetro `current_rps` é calculado como *(o número de solicitações enviada no intervalo de tempo [12:02:51-12:03:01])/10*.

* `avg_rps`—a velocidade média com que o FAST envia solicitações para o aplicativo alvo (no momento da obtenção do estado da execução do teste).

    Este valor é o número médio de solicitações por segundo (RPS) que o FAST enviou para o aplicativo alvo em *todo o tempo de execução do teste*:

    * Do início da execução do teste ao momento atual se o teste ainda está em execução (o que é igual a `current time`-`start_time`).
    * Do início da execução do teste ao fim da execução do teste se a execução do teste está concluída (o que é igual a `end_time`-`start_time`).

        O valor do parâmetro `avg_rps` é calculado como *(`sended_requests_count`/(todo o tempo de execução do teste))*.
    
* `estimated_time_to_completion`—a quantidade de tempo (em segundos) após o qual a execução do teste provavelmente será concluída (no momento da obtenção do estado da execução do teste). 

    O valor do parâmetro é `null` se:
    
    * Ainda não há verificações de vulnerabilidade em andamento (por exemplo, não há solicitações de linha de base registradas para a execução do teste recém-criada até agora).
    * A execução do teste não está em execução (ou seja, está em qualquer estado, excluindo `"state":"running"`).

    O valor do parâmetro `estimated_time_to_completion` é calculado como *(`planing_requests_count`/`current_rps`)*.
    
!!! warning "Os possíveis valores dos parâmetros relacionados às estimativas de velocidade e tempo de execução do teste"
    Os valores dos parâmetros acima mencionados são `null` nos primeiros 10 segundos de uma execução de teste.

Você pode usar o valor do parâmetro `estimated_time_to_completion` para determinar quando deve ser feita a próxima verificação do estado da execução do teste. Note que o valor pode aumentar ou diminuir.

**Exemplo:**

Para verificar o estado de uma execução de teste no período de tempo `estimated_time_to_completion`, faça o seguinte:

1.  Após o início da execução do teste, adquira o estado da execução do teste várias vezes. Por exemplo, você pode fazer isso no intervalo de 10 segundos. Continue a fazer isso até que o valor do parâmetro `estimated_time_to_completion` não seja `null`.

2.  Realize a próxima verificação do estado da execução do teste após os segundos `estimated_time_to_completion`.

3.  Repita a etapa anterior até que a execução do teste esteja completa.

!!! info "A representação gráfica das estimativas"
    Você também pode obter os valores das estimativas usando a interface web Wallarm.
    
    Para fazer isso, faça login no portal Wallarm e navegue até [a lista de execuções de teste][link-wl-portal-testruns-in-progress] que estão sendo executadas agora:
    
    ![Estimativas de velocidade e tempo de execução do teste run][img-testrun-velocity]
    
    Quando a execução do teste é concluída, é apresentado o valor médio de solicitações por segundo:
    
    ![Valor médio de solicitações por segundo][img-testrun-avg-rps]