# Exemplos de Política de Teste

Alguns exemplos de políticas de teste FAST são apresentados neste documento, incluindo os seguintes usados ​​na documentação do FAST. Estes exemplos demonstram todos os aspectos do trabalho com as políticas.

!!! info "Sintaxe de descrição do elemento de requisição"
    Uma política de teste FAST permite ou nega permissão a um nó FAST para trabalhar com elementos específicos de uma solicitação de linha de base.

    Esses elementos são descritos usando os [pontos](../../dsl/points/intro.md).

    Nas políticas de teste de amostra abaixo, cada elemento da solicitação de linha de base é seguido pelo ponto correspondente, assim: qualquer parâmetro GET (`GET_.*`).

!!! info "Detecção de vulnerabilidades"
    [A lista de vulnerabilidades que o FAST pode detectar](../../vuln-list.md)

    Note-se que a escolha dos tipos de vulnerabilidade durante a configuração de uma política de teste influencia quais das extensões FAST incorporadas (também conhecidas como detectadas) serão executadas.

    As extensões FAST personalizadas tentarão detectar o tipo de vulnerabilidade para o qual foram projetadas, mesmo se este tipo de vulnerabilidade não foi selecionado ao configurar uma política.

    Por exemplo, uma política pode permitir o teste de uma aplicação alvo para RCE, mas uma extensão personalizada testará o aplicativo para vulnerabilidades do SQLi.

## Política de Teste Padrão

Esta é uma política de teste inalterável que permite trabalhar com elementos de solicitação comuns e testar vulnerabilidades típicas.

**Esta política permite trabalhar com os seguintes elementos:**

* quaisquer parâmetros GET e POST (`GET_.*` e `POST_.*`)
* URI (`URI`)
* quaisquer caminhos na URI (`PATH_.*`)
* nome da ação URL e extensão (`ACTION_NAME` e `ACTION_EXT`)

**O aplicativo alvo será testado pelas extensões FAST incorporadas para** vulnerabilidades PTRAV, RCE, SQLI, XSS e XXE.

**As especificidades desta política são as seguintes:** não suporta difusação de fuzzing. Para habilitar o fuzzer, crie uma política de teste separada ([exemplo](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)).

![Exemplo de política](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "Nota"
    Por favor, leve em consideração o seguinte:

    * Ao criar uma nova política de teste, as configurações serão idênticas às utilizadas na política padrão. Você pode modificar as configurações da nova política conforme necessário.
    * Esta política pode ser usada no [exemplo](../../poc/examples/circleci.md) de integração do FAST no CI/CD.

## Política que permite trabalhar com todos os parâmetros GET e POST

Esta política de teste permite trabalhar com todos os parâmetros GET (`GET_.*`) e POST (`POST_.*`) em uma solicitação.

**O aplicativo alvo será testado pelas extensões FAST incorporadas para** vulnerabilidade XSS.

**As especificidades desta política são as seguintes:** o fuzzer está desabilitado.

![Exemplo de política](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "Nota"
    No guia de início rápido, esta política pode ser usada para realizar testes de segurança do aplicativo alvo [Google Gruyere](../../qsg/test-run.md).

## Política que Permite Trabalhar com URI e Parâmetros POST de Email Codificado (Apenas Extensões FAST Personalizadas São Permitidas para Executar)

Essa política de teste permite trabalhar com URI (`URI`) e parâmetros POST de `email` em uma solicitação. O parâmetro `email` é codificado em JSON (`POST_JSON_DOC_HASH_email_value`).

**As especificidades desta política são as seguintes:**

* Apenas extensões FAST personalizadas são permitidas para executar, não serão executadas detecções FAST incorporadas.
* Fuzzer está desativado.

![Exemplo de política](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "Nota"
    Essa política pode ser usada para executar as [extensões personalizadas de amostra](../../dsl/using-extension.md).

## Política que Permite Trabalhar com URI e Parâmetros POST de Email Codificado (Fuzzer está habilitado)

Esta política permite trabalhar com parâmetros POST de `email` em uma solicitação. O parâmetro `email` é codificado em JSON (`POST_JSON_DOC_HASH_email_value`).

**As especificidades desta política são as seguintes:**

* Fuzzer está habilitado.
* Todas as extensões FAST incorporadas estão desativadas (nenhuma vulnerabilidade é selecionada). Isso é possível de fazer ao usar o fuzzer.

**Nesta política de amostra, o fuzzer é configurado da seguinte forma:**

* Payloads de até 123 bytes devem ser inseridos no início do valor decodificado de um ponto (neste caso específico, há o único ponto `POST_JSON_DOC_HASH_email_value`).
* É presumido que

    * Uma anomalia é encontrada se a string `SQLITE_ERROR` estiver presente no corpo da resposta do servidor.
    * Nenhuma anomalia é encontrada se o valor do código de resposta do servidor for menor que `500`.
    * O fuzzer para sua execução se todos os payloads tiverem sido verificados ou se mais de duas anomalias forem encontradas.

![Exemplo de política](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "Nota"
    Esta política pode ser usada para encontrar vulnerabilidades no [formulário de login do OWASP Juice Shop](../../dsl/extensions-examples/overview.md).

## Política que Nega Trabalhar com o Valor de um Ponto Específico

Essa política de teste permite trabalhar com todos os parâmetros GET (`GET_.*`) em uma solicitação, exceto para o parâmetro GET `sessionid` (`GET_sessionid_value`).

Pode ser útil configurar um comportamento como este se for necessário negar ao FAST o trabalho com um ponto específico (por exemplo, se a modificação não intencional do valor do parâmetro específico pode interromper a operação do aplicativo alvo).

**O aplicativo alvo será testado pelas extensões FAST incorporadas para** vulnerabilidades AUTH e IDOR.

**As especificidades desta política são as seguintes:** o fuzzer está desabilitado.

![Exemplo da política](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)
