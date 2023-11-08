* A caixa de seleção "Parar na primeira falha" define se a execução do teste deve ser interrompida após a primeira vulnerabilidade ser encontrada.
* A caixa de seleção "Ignorar linhas de base duplicadas" define se as duplicatas das solicitações de linha de base recebidas anteriormente devem ser ignoradas. Se o nó FAST receber a mesma solicitação de linha de base que a recebida nesta execução de teste anteriormente, então nenhuma solicitação de teste é criada com base nela, e o console do nó FAST imprime a seguinte mensagem: `[info] A linha de base # 8921 é duplicada e já foi processada`.
* A caixa de seleção "Ignorar as seguintes extensões de arquivo" define se certos tipos de arquivo são excluídos do processo de avaliação durante os testes. Esses tipos de arquivo são especificados pela expressão regular.
    
    Por exemplo, se você definir a extensão de arquivo `ico` para ser excluída, então a solicitação de linha de base `GET /favicon.ico` não será verificada pelo FAST e será ignorada.
        
    A expressão regular pode conter uma das seguintes expressões mutuamente excludentes:
        
    * `.`: qualquer número de qualquer caractere
    * `x*`: qualquer número do caractere `x`
    * `x?`: o único caractere `x` (ou nenhum caractere `x` de todo)
    * qualquer única extensão de arquivo (por exemplo, `jpg`)
    * várias extensões delimitadas por caractere “|” ou “,” (por exemplo, `jpg | png` ou `jpg, png`)
        
    Se uma expressão regular não for especificada, então o FAST verificará as solicitações de linha de base com qualquer extensão de arquivo.
    
* O controle deslizante "RPS por execução de teste" define o limite de solicitações por segundo para a execução do teste. Essa configuração pode assumir valores de `1` a `1000`. O valor padrão é `1000`.
* O controle deslizante "RPS por linha de base" define o limite de solicitações por segundo para uma solicitação de linha de base. Essa configuração pode assumir valores de `1` a `500`. O valor padrão é `500`.
* O controle deslizante "Interromper a gravação da linha de base após" define o limite de tempo de execução do teste. Essa configuração pode assumir valores de `5 min` (5 minutos) a `1 dia` (24 horas). O valor padrão é `30 min` (30 minutos).