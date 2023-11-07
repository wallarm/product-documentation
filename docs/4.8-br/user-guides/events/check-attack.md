[link-using-search]: ../search-and-filters/use-search.md
[link-verify-attack]: ../events/verify-attack.md

[img-attacks-tab]: ../../images/user-guides/events/check-attack.png
[img-current-attacks]: ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]: ../../images/user-guides/events/incident-vuln.png
[img-vulns-tab]: ../../images/user-guides/events/check-vulns.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]: ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action

# Verificando eventos

Você pode verificar ataques detectados e incidentes na seção **Eventos** do Console Wallarm. Para encontrar os dados necessários, use o campo de pesquisa conforme descrito [aqui][use-search] ou defina manualmente os filtros de pesquisa necessários.

## Ataques

![Aba de ataques][img-attacks-tab]

* **Data**: A data e hora da solicitação maliciosa.
   * Se várias solicitações do mesmo tipo foram detectadas em intervalos curtos, a duração do ataque aparece sob a data. A duração é o período de tempo entre a primeira solicitação de um determinado tipo e a última solicitação do mesmo tipo no período de tempo especificado.
   * Se o ataque está ocorrendo no momento atual, é exibido um [rótulo](#events-that-are-currently-happening) apropriado.
* **Solicitações (hits)**: O número de solicitações (hits) no ataque no intervalo de tempo especificado.
* **Cargas úteis**: Tipo de ataque e o número de [cargas úteis maliciosas](../../glossary-en.md#malicious-payload) únicas.
* **Top IP / Origem**: O endereço IP de onde partiram as solicitações maliciosas. Quando as solicitações maliciosas se originam de vários endereços IP, a interface mostra o endereço IP responsável pela maioria das solicitações. Também são exibidos os seguintes dados para o endereço IP:
     * O número total de endereços IP de onde partiram as solicitações no mesmo ataque durante o período de tempo especificado.
     * O país/região em que o endereço IP está registrado (se foi encontrado em bancos de dados como IP2Location ou outros)
     * O tipo de origem, como **Proxy público**, **Proxy da web**, **Tor** ou a plataforma em nuvem na qual o IP está registrado, etc (se foi encontrado em bancos de dados como IP2Location ou outros)
     * O rótulo **IPs Maliciosos** aparecerá se o endereço IP for conhecido por atividades maliciosas. Isso é baseado em registros públicos e validações de especialistas
* **Domínio / Caminho**: O domínio, caminho e o ID de aplicativo que a solicitação visava.
* **Status**: O status de bloqueio do ataque (depende do [modo de filtragem de tráfego](../../admin-en/configure-wallarm-mode.md)):
     * Bloqueado: todos os hits do ataque foram bloqueados pelo nó de filtragem.
     * Parcialmente bloqueado: alguns hits do ataque foram bloqueados e outros foram apenas registrados.
     * Monitoramento: todos os hits do ataque foram registrados, mas não bloqueados.
* **Parâmetro**: Os parâmetros da solicitação maliciosa e as tags das [análises](../rules/request-processing.md) aplicadas à solicitação.
* **Verificação ativa**: O status de verificação do ataque. Se o ataque for marcado como falso positivo, a marca correspondente será mostrada nesta coluna (**FP**) e o ataque não será verificado novamente. Para encontrar ataques pela ação falsa positiva, use o filtro de pesquisa abaixo
    ![Filtro para falso positivo][img-show-falsepositive]

Para ordenar ataques pelo tempo da última solicitação, você pode usar o botão **Ordenar pelo último hit**.

## Incidentes

![Aba de incidentes][img-incidents-tab]

Os incidentes têm os mesmos parâmetros que os ataques, exceto por uma coluna: a coluna **Vulnerabilidades** substitui a coluna **Verificação** dos ataques. A coluna **Vulnerabilidades** exibe a vulnerabilidade, que o incidente correspondente explorou.

Clicar na vulnerabilidade leva você à sua descrição detalhada e instruções sobre como corrigi-la.

Para ordenar incidentes pelo tempo da última solicitação, você pode usar o botão **Ordenar pelo último hit**.

## Eventos que estão ocorrendo no momento 

Você pode verificar eventos em tempo real. Se os recursos de sua empresa estiverem recebendo solicitações maliciosas, os seguintes dados são exibidos no Console Wallarm:

* O número de eventos que aconteceram nos últimos 5 minutos, que será exibido ao lado do nome da seção **Eventos** e dentro da seção.
* Rótulo especial, que é exibido sob a data do evento na tabela de ataques ou incidentes.

Você também pode adicionar a palavra-chave `now` ao campo de pesquisa para exibir apenas os eventos que estão ocorrendo no momento:

* `ataques agora` para mostrar ataques acontecendo agora.
* `incidentes agora` para mostrar incidentes acontecendo agora.
* `ataques incidentes agora` para mostrar ataques e incidentes acontecendo agora.

![Ataques acontecendo agora][img-current-attacks]

## Chamadas API para obter ataques e incidentes

Para obter os detalhes do ataque ou incidente, você pode [chamar a API Wallarm diretamente](../../api/overview.md) além de usar a interface do usuário do Console Wallarm. Abaixo estão alguns exemplos das chamadas API correspondentes.

**Obter os 50 primeiros ataques detectados nas últimas 24 horas**

Substitua `TIMESTAMP` pela data de 24 horas atrás convertida para o formato [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "Obtendo 100 ou mais ataques"
    Para conjuntos de ataques e hits que contêm 100 ou mais registros, é melhor recuperá-los em partes menores em vez de buscar grandes conjuntos de dados de uma só vez, a fim de otimizar o desempenho. [Explore o exemplo de solicitação correspondente](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)

**Obter os 50 primeiros incidentes confirmados nas últimas 24 horas**

A solicitação é muito semelhante ao exemplo anterior para uma lista de ataques; o termo `"!vulnid": null` é adicionado a esta solicitação. Este termo instrui a API a ignorar todos os ataques sem ID de vulnerabilidade especificado, e é assim que o sistema distingue entre ataques e incidentes.

Substitua `TIMESTAMP` pela data de 24 horas atrás convertida para o formato [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-incidents-en.md"

<!-- ## Vídeos de demonstração

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/rhigX3DEoZ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->