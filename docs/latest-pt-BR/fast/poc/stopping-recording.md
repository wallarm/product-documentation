[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run

[doc-about-recording]:              ../operations/internals.md#test-run
[doc-stop-recording]:               ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]:            waiting-for-tests.md

[doc-integration-overview]:         integration-overview.md

# Parando o Processo de Gravação

!!! info "Pré-requisitos do Capítulo"
    Para seguir as etapas descritas neste capítulo, você precisa obter:
        
    * [Token][doc-get-token]
    * [Identificador][doc-get-testrun-id] de uma execução de teste
    
    Os seguintes valores são usados ​​como valores de exemplo ao longo do capítulo:

    * `token_Qwe12345` como um token
    * `tr_1234` como um identificador de uma execução de teste

Pare o processo de gravação de solicitações de linha de base via API seguindo as etapas descritas [aqui][doc-stop-recording].

O processo de testar a aplicação-alvo contra as vulnerabilidades pode durar muito tempo após a parada do processo de gravação. Use as informações de [este documento][doc-waiting-for-tests] para determinar se os testes de segurança FAST foram concluídos.

Se necessário, você pode se referir de volta ao documento [“Workflow CI/CD com FAST”][doc-integration-overview].