[img-search-for-anomalies]:         ../../../images/fast/operations/en/test-policy/fuzzer/search-for-anomalies-scheme.png
[img-anomaly-description]:          ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-description.png

[doc-fuzzer-configuration]:         fuzzer-configuration.md

[link-payloads-section]:            fuzzer-configuration.md#the-payloads-section
[link-stop-fuzzing-section]:        fuzzer-configuration.md#the-stop-fuzzing-if-response-section


# Princípios de Operação do Fuzzer

O fuzzer verifica 255 *bytes anômalos*: de `0x01` a `0xFF`. Um ou mais desses bytes inseridos nos pontos de solicitação podem levar a um comportamento anômalo do aplicativo alvo.

Em vez de verificar cada byte individualmente, o fuzzer adiciona uma ou mais sequências de bytes anômalos (*payloads*) de um tamanho fixo ao ponto e envia esta solicitação para o aplicativo.

Para modificar pontos permitidos, o fuzzer:

* Insere payloads em:

    * começo do valor
    * posição aleatória do valor
    * fim do valor
* Substitui o seguinte valor de payload:

    * segmentos aleatórios
    * primeiros `M` bytes
    * últimos `M` bytes
    * string inteira

Com a [configuração do fuzzer][doc-fuzzer-configuration], o tamanho `M` do payload contido na solicitação do FAST para o aplicativo é estabelecido em bytes. Isso afeta os seguintes pontos:

* número de bytes que serão adicionados ao valor do ponto se a inserção de payload for usada
* número de bytes que serão substituídos no valor do ponto se a substituição de payload for usada
* número de solicitações enviadas para o aplicativo

Se um comportamento anômalo é detectado na resposta à solicitação com o payload, então o fuzzer enviará solicitações específicas para cada byte de payload para o aplicativo. Assim, o fuzzer irá detectar bytes específicos que causaram comportamento anômalo.

![Esquema de verificação de bytes anômalos][img-search-for-anomalies]

Todos os bytes detectados são fornecidos na descrição da anomalia:

![Descrição da Anomalia][img-anomaly-description]

??? info "Exemplo de operação do fuzzer"
    Suponha que o tamanho de payload de 250 bytes [substitua](fuzzer-configuration.md#payloads-section) os primeiros 250 bytes do valor de algum ponto.

    Nestas condições, o fuzzer cria duas solicitações para enviar todos os bytes anômalos conhecidos: uma com o payload de 250 bytes e outra com o payload de 5 bytes.

    O valor do ponto inicial na solicitação base será modificado da seguinte forma:

    * Se o valor for maior que 250 bytes: inicialmente, os primeiros 250 bytes do valor serão substituídos por 250 bytes do payload e, em seguida, os primeiros 250 bytes serão substituídos por 5 bytes do payload.
    * Se o valor for menor que 250 bytes: inicialmente, o valor será totalmente substituído por 250 bytes do payload e, em seguida, o valor será totalmente substituído por 5 bytes do payload.

    Suponha que o payload de 5 bytes `ABCDE` substituiu os primeiros 250 bytes do valor de ponto longo `_250-bytes-long-head_qwerty` e causou uma anomalia. Em outras palavras, a solicitação de teste com o valor do ponto `ABCDEqwerty` causou uma anomalia.

    Neste caso, o fuzzer criará 5 solicitações adicionais para verificar cada byte com os seguintes valores de ponto:

    * `Aqwerty`
    * `Bqwerty`
    * `Cqwerty`
    * `Dqwerty`
    * `Eqwerty`

    Uma ou mais dessas solicitações causarão novamente uma anomalia e o fuzzer formará a lista de bytes anômalos detectados, por exemplo: `A`, `C`.

Depois, você pode obter informações sobre a [configuração de fuzzing][doc-fuzzer-configuration] e a descrição das regras que definem se a anomalia foi encontrada.

O fuzzer FAST processa um ponto permitido por iteração (*fuzzing*). Dependendo das [regras de parada de fuzzing][link-stop-fuzzing-section], um ou mais pontos serão processados ​​consistentemente.