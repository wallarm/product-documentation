[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-test-run
[doc-get-testrun-status]:       ../operations/check-testrun-status.md

[doc-get-testrun-status]:   ../operations/check-testrun-status.md

[doc-integration-overview]:         integration-overview.md

# Aguardando o término do teste

!!! info "Pré-requisitos do Capítulo"
    Para seguir os passos descritos neste capítulo, você precisa obter:
    
    * um [token][doc-get-token].
    * um [identificador][doc-get-testrun-id] de uma execução de teste.
    
    Os seguintes valores são usados como exemplos ao longo do capítulo:
        
    * `token_Qwe12345` como um token.
    * `tr_1234` como um identificador de execução de teste.

O processo de criação e execução das solicitações de teste começa quando a primeira solicitação de baseline é registrada e pode levar um tempo significativo após o processo de gravação das solicitações de baseline ter sido interrompido. Você pode verificar o estado da execução do teste periodicamente para obter informações sobre os processos em andamento.

Após executar [a chamada API][doc-get-testrun-status], você receberá uma resposta do servidor API com informações sobre o estado da execução do teste.

É possível tirar conclusões sobre a presença ou ausência de vulnerabilidades na aplicação com base nos valores dos parâmetros `state` e `vulns`.

??? info "Exemplo"
    Um processo que está consultando o estado da execução do teste, realizando periodicamente a chamada da API, pode terminar com o código de saída `0` se o parâmetro `state:passed` for encontrado na resposta do servidor API e com o código de saída `1` se o parâmetro `state:failed` for encontrado na resposta do servidor API.

    O valor do código de saída pode ser usado pela ferramenta CI/CD para calcular o status geral do trabalho de CI/CD.

    Se um nó FAST for implantado via [modo CI](integration-overview-ci-mode.md), então o código de saída do nó FAST pode ser suficiente para interpretar o status geral do trabalho de CI/CD.

    É possível estabelecer uma lógica ainda mais complexa de como o trabalho de CI/CD habilitado para FAST deve interagir com a ferramenta CI/CD. Para fazer isso, use outras peças de dados que podem ser encontradas na resposta do servidor API.

Você pode retornar ao documento [“CI/CD Workflow with FAST”][doc-integration-overview] se necessário.