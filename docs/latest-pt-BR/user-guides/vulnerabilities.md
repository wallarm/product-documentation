# Gerenciando Vulnerabilidades

Vulnerabilidades são falhas de segurança em uma infraestrutura que podem ser exploradas por invasores para realizar ações maliciosas não autorizadas em seu sistema. A seção **Vulnerabilidades** do Console Wallarm permite que você analise e gerencie falhas de segurança que foram detectadas pelo Wallarm em seu sistema.

A Wallarm emprega várias técnicas para [descobrir](../about-wallarm/detecting-vulnerabilities.md) fraquezas de segurança, que incluem:

* **Detecção passiva**: a vulnerabilidade foi encontrada devido ao incidente de segurança que ocorreu
* **Verificação ativa de ameaças**: a vulnerabilidade foi encontrada durante o processo de verificação de ataque
* **Scanner de Vulnerabilidade**: a vulnerabilidade foi encontrada durante o processo de varredura de [recursos expostos](scanner.md)

A Wallarm armazena o histórico de todas as vulnerabilidades detectadas na seção **Vulnerabilidades**:

![Aba de Vulnerabilidades](../images/user-guides/vulnerabilities/check-vuln.png)

## Ciclo de vida da vulnerabilidade

O ciclo de vida de uma vulnerabilidade envolve as etapas de avaliação, remediação e verificação. Em cada estágio, o Wallarm fornece os dados necessários para abordar completamente a questão e fortalecer seu sistema. Além disso, o Console Wallarm fornece a capacidade de monitorar e gerenciar o status da vulnerabilidade com facilidade, utilizando os status **Ativo** e **Fechado**.

* O status **Ativo** indica que a vulnerabilidade existe na infraestrutura.
* O status **Fechado** é usado quando a vulnerabilidade foi resolvida do lado do aplicativo ou determinada como um falso positivo.

    Um [falso positivo](../about-wallarm/detecting-vulnerabilities.md#false-positives) ocorre quando uma entidade legítima é erroneamente identificada como uma vulnerabilidade. Se você encontrar uma vulnerabilidade que acredita ser um falso positivo, você pode reportá-la utilizando a opção apropriada no menu de vulnerabilidade. Isso ajudará a melhorar a precisão da detecção de vulnerabilidades da Wallarm. O Wallarm reclassifica a vulnerabilidade como um falso positivo, muda seu status para **Fechado** e não a submete a mais [reverificações](#verifying-vulnerabilities).

Ao gerenciar vulnerabilidades, você pode alternar manualmente os status de vulnerabilidade. Além disso, a Wallarm regularmente [reverifica](#verifying-vulnerabilities) as vulnerabilidades e muda o status das vulnerabilidades automaticamente de acordo com os resultados.

![Ciclo de vida da vulnerabilidade](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

As mudanças no ciclo de vida da vulnerabilidade são refletidas no histórico de mudanças da vulnerabilidade.

## Avaliando e remediando vulnerabilidades

A Wallarm fornece a cada vulnerabilidade os detalhes que ajudam a avaliar o nível de risco e a tomar medidas para resolver problemas de segurança:

* O identificador único da vulnerabilidade no sistema Wallarm
* Nível de risco indicando o perigo das consequências da exploração da vulnerabilidade

    A Wallarm indica automaticamente o risco da vulnerabilidade usando a estrutura Common Vulnerability Scoring System (CVSS), a probabilidade de uma vulnerabilidade ser explorada, seu impacto potencial no sistema, etc. Você pode alterar o nível de risco para seu próprio valor com base em seus requisitos únicos de sistema e prioridades de segurança.
* [Tipo de vulnerabilidade](../attacks-vulns-list.md) que também corresponde ao tipo de ataques que exploram a vulnerabilidade
* Domínio e caminho nos quais a vulnerabilidade existe
* Parâmetro que pode ser usado para passar uma carga útil maliciosa explorando a vulnerabilidade
* Método pelo qual a vulnerabilidade foi [detectada](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)
* O componente alvo que pode ser impactado se uma vulnerabilidade for explorada, pode ser **Servidor**, **Cliente**, **Banco de dados**
* Data e hora em que a vulnerabilidade foi detectada
* Última [data de verificação](#verifying-vulnerabilities) da vulnerabilidade
* Descrição detalhada da vulnerabilidade, exemplo de exploração e etapas de remediação recomendadas
* Incidentes relacionados
* Histórico de mudanças de status da vulnerabilidade

Você pode filtrar vulnerabilidades usando a [linha de pesquisa](search-and-filters/use-search.md) e filtros predefinidos.

![Informações detalhadas da vulnerabilidade](../images/user-guides/vulnerabilities/vuln-info.png)

Todas as vulnerabilidades devem ser corrigidas no lado do aplicativo porque tornam seu sistema mais vulnerável a ações maliciosas. Se uma vulnerabilidade não puder ser corrigida, o uso da regra de [pacth virtual](rules/vpatch-rule.md) pode ajudar a bloquear ataques relacionados e eliminar o risco de um incidente.

## Verificando vulnerabilidades <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

A Wallarm regularmente reverifica as vulnerabilidades ativas e fechadas. Isso envolve repetir o teste de uma infraestrutura para um problema de segurança que foi descoberto anteriormente. Se o resultado da rechecagem indicar que a vulnerabilidade não existe mais, a Wallarm muda seu status para **Fechado**. Isso também pode acontecer se o servidor estiver temporariamente indisponível. Por outro lado, se a rechecagem de uma vulnerabilidade fechada indicar que ela ainda existe no aplicativo, a Wallarm muda seu status de volta para **Ativo**.

As vulnerabilidades ativas e as vulnerabilidades corrigidas há menos de um mês são reverificadas uma vez por dia. As vulnerabilidades que foram corrigidas há mais de um mês são reverificadas uma vez por semana.

Dependendo do método inicial de detecção de vulnerabilidade, o teste é realizado pelo **Scanner de Vulnerabilidade** ou pelo módulo **Verificação de Ameaça Ativa**. As configurações para o processo de reverificação automatizada podem ser controladas através do botão [**Configurar**](#configuring-vulnerability-detection).

Não é possível reverificar vulnerabilidades que foram detectadas passivamente.

Se você precisar reverificar uma vulnerabilidade manualmente, pode acionar o processo de reverificação usando a opção apropriada no menu de vulnerabilidade:

![Uma vulnerabilidade que pode ser reverificada](../images/user-guides/vulnerabilities/recheck-vuln.png)

## Configurando a detecção de vulnerabilidades

A configuração de detecção de vulnerabilidade pode ser ajustada usando o botão **Configurar**, com as seguintes opções:

* Você pode escolher os tipos específicos de vulnerabilidades que deseja detectar usando o Scanner de Vulnerabilidade. Por padrão, o Scanner está configurado para atingir todos os tipos de vulnerabilidade disponíveis.
* Ativar/Desativar **Funcionalidade básica do Scanner** que inclui os processos de descoberta de vulnerabilidade e [recurso exposto](scanner.md). Por padrão, esta funcionalidade está ativada.

    Você também pode encontrar o mesmo interruptor de alternância na seção **Scanner**. Alterar o interruptor em uma seção atualizará automaticamente a configuração na outra seção também.
* Ativar / desativar a reverificação de vulnerabilidades com o Scanner usando a opção **Reverificar vulnerabilidades**.
* Ativar / desativar o módulo **Verificação de ameaça ativa** para detecção e reverificação de vulnerabilidades. Observe que essa opção controla o módulo em si, não apenas o processo de reverificação.

    Por padrão, este módulo está desativado, aprenda suas melhores práticas de configuração [melhores práticas](../vulnerability-detection/threat-replay-testing/setup.md) antes de ativá-lo.

![Configurações de verificação de vulnerabilidade](../images/user-guides/vulnerabilities/vuln-scan-settings.png)

Além disso, na seção [**Scanner**](scanner.md) da interface do usuário, você pode controlar quais recursos expostos devem ser verificados pelo Scanner de Vulnerabilidade e qual RPS/RPM gerado pelo Scanner é permitido para cada recurso.

## Baixando o relatório de vulnerabilidades

Você pode exportar os dados de vulnerabilidade para um relatório em PDF ou CSV usando o botão correspondente na interface do usuário. O Wallarm enviará o relatório para o endereço especificado.

O PDF é bom para apresentar relatórios visualmente ricos com resumos de vulnerabilidade e incidente, enquanto o CSV é melhor para fins técnicos, fornecendo informações detalhadas sobre cada vulnerabilidade. O CSV pode ser usado para criar painéis, produzir uma lista dos hosts/APIs mais vulneráveis e mais.

## Chamada de API para obter vulnerabilidades

Para obter detalhes de vulnerabilidades, você pode [chamar a API Wallarm diretamente](../api/overview.md) além de usar a interface do usuário do Console Wallarm. Abaixo está o exemplo da chamada de API correspondente.

Para obter as primeiras 50 vulnerabilidades no status **Ativo** nas últimas 24 horas, use a seguinte solicitação substituindo `TIMESTAMP` pela data de 24 horas atrás convertida para o formato [Unix Timestamp](https://www.unixtimestamp.com/):

--8<-- "../include-pt-BR/api-request-examples/get-vulnerabilities.md"