[img-phases-mod-overview]:              ../../images/fast/dsl/common/mod-phases.png
[img-phases-non-mod-overview]:          ../../images/fast/dsl/common/non-mod-phases.png
[img-mod-workflow]:                     ../../images/fast/dsl/common/mod-workflow.png
[img-non-mod-workflow]:                 ../../images/fast/dsl/common/non-mod-workflow.png
[img-workers]:                          ../../images/fast/dsl/en/workers.png

[img-incomplete-policy]:                ../../images/fast/dsl/common/incomplete-policy.png
[img-incomplete-policy-remediation-1]:  ../../images/fast/dsl/common/incomplete-policy-remediation-1.png
[img-incomplete-policy-remediation-2]:  ../../images/fast/dsl/common/incomplete-policy-remediation-2.png
[img-wrong-baseline]:                   ../../images/fast/dsl/common/wrong-baseline.png 

[link-policy]:                ../terms-glossary.md#test-policy
[doc-policy-in-detail]:       ../operations/test-policy/overview.md

[link-phase-collect]:         phase-collect.md
[link-phase-match]:           phase-match.md
[link-phase-modify]:          phase-modify.md
[link-phase-generate]:        phase-generate.md
[link-phase-send]:            phase-send.md
[link-phase-detect]:          detect/phase-detect.md

[doc-collect-uniq]:           phase-collect.md#the-uniqueness-condition
[doc-point-uri]:              points/parsers/http.md#uri-filter

[link-points]:                points/intro.md

# A Lógica das Extensões

A lógica da extensão pode ser descrita usando várias fases:
1. [Coletar][link-phase-collect]
2. [Combinar][link-phase-match]
3. [Modificar][link-phase-modify]
4. [Gerar][link-phase-generate]
5. [Enviar][link-phase-send]
6. [Detectar][link-phase-detect]

Combinando essas fases, FAST DSL permite que você descreva dois tipos de extensões:
* O primeiro cria um ou mais pedidos de teste alterando os parâmetros de uma solicitação de linha de base recebida.

    Esta extensão será referida como uma "extensão de modificação" ao longo deste guia.

* O segundo usa solicitações de teste predefinidas e não altera os parâmetros de uma solicitação de linha de base recebida.

    Esta extensão será referida como uma "extensão não modificadora" ao longo deste guia.

Cada tipo de extensão emprega um conjunto distinto de fases. Algumas dessas fases são obrigatórias, enquanto outras não são.

O uso da fase de Detecção é obrigatório para cada tipo de extensão. Esta fase recebe as respostas do aplicativo alvo às solicitações de teste. A extensão usa essas respostas para determinar se o aplicativo tem certas vulnerabilidades. A informação da fase de Detecção é enviada para a nuvem Wallarm.

!!! info "Sintaxe de descrição de elementos de solicitação"
    Ao criar uma extensão FAST, você precisa entender a estrutura da solicitação HTTP enviada para o aplicativo e a da resposta HTTP recebida do aplicativo para descrever corretamente os elementos da solicitação com os quais você precisa trabalhar usando os pontos.

    Para ver informações detalhadas, avance para este [link][link-points].

## Como Funciona uma Extensão de Modificação

Durante a operação de uma extensão de modificação, uma solicitação de linha de base passa sequencialmente pelas fases de Coleta, Combinação, Modificação e Geração, todas opcionais e que podem não estar incluídas na extensão. Uma única solicitação de teste ou várias solicitações de teste serão formadas como resultado do processamento dessas fases. Essas solicitações serão enviadas para o aplicativo de destino para verificar se há vulnerabilidades.

!!! info "Uma extensão sem fases opcionais"
    Se nenhuma fase opcional for aplicada à solicitação de linha de base, a solicitação de teste corresponderá à solicitação de linha de base.

![Visão geral das fases de extensão de modificação][img-phases-mod-overview]

Se uma solicitação de linha de base satisfizer uma [política de teste][doc-policy-in-detail] FAST definida, então a solicitação contém um ou mais parâmetros que são permitidos para processamento. 

A extensão de modificação itera através desses parâmetros:

1. Cada parâmetro passa pelas fases da extensão e as solicitações de teste correspondentes são criadas e executadas.
2. A extensão prossegue com o próximo parâmetro até que todos os parâmetros que estejam em conformidade com a política sejam processados.

A imagem abaixo mostra uma solicitação POST com alguns parâmetros POST como exemplo.

![Visão geral do fluxo de trabalho de extensão de modificação][img-mod-workflow]

## Como Funciona uma Extensão Não Modificadora

Durante uma operação de extensão não modificadora, a solicitação de linha de base passa por uma única fase de Envio.

Embora neste estágio, apenas o nome do host do endereço IP é derivado do valor do cabeçalho 'Host' da solicitação de linha de base. Em seguida, as solicitações de teste predefinidas são enviadas para este host.

Devido à possibilidade do nó FAST encontrar várias solicitações de linha de base recebidas com o mesmo valor de cabeçalho 'Host', essas solicitações passam pela fase Coleta implícita para coletar apenas aquelas solicitações com um valor de cabeçalho 'Host' único (consulte [“A Condição de Unicidade”][doc-collect-uniq]).

![Visão geral das fases da extensão não modificadora][img-phases-non-mod-overview]

Quando uma extensão não modificadora funciona, uma ou mais solicitações de teste predefinidas são enviadas para o host que é mencionado no cabeçalho 'Host' de cada solicitação de linha de base que é processada na fase de Envio:

![Visão geral do fluxo de trabalho da extensão não modificadora][img-non-mod-workflow]


## Como as Extensões Processam Solicitações

### Processando uma Solicitação com Várias Extensões

Várias extensões podem ser definidas para uso por um nó FAST ao mesmo tempo.
Cada solicitação de linha de base recebida passará por todas as extensões conectadas.

![Extensões usadas pelos trabalhadores][img-workers]

A cada momento, a extensão processa uma única solicitação de linha de base. O FAST suporta o processamento paralelo de solicitações de linha de base; cada uma das solicitações de linha de base recebidas será enviada para um trabalhador livre para acelerar o processamento. Diferentes trabalhadores podem executar as mesmas extensões ao mesmo tempo para diferentes solicitações de linha de base. 

A extensão define se as solicitações de teste devem ser criadas com base na solicitação de linha de base.

O número de solicitações que o nó FAST pode processar em paralelo depende do número de trabalhadores. O número de trabalhadores é definido pelo valor atribuído à variável de ambiente `WORKERS` na execução do contêiner Docker do nó FAST (o valor padrão da variável é 10).

!!! info "Detalhes da política de teste"
    Uma descrição mais detalhada de como trabalhar com políticas de teste está disponível no [link][doc-policy-in-detail].