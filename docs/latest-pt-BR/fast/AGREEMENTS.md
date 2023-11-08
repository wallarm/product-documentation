# Convenções de formatação de texto

Ao longo dos guias, você será apresentado a um certo número de strings de texto e comandos a serem inseridos ou executados. Serão fornecidos diferentes formatos de algumas strings e palavras-chave de comando quando necessário. As seguintes regras são aplicáveis em todos os guias:


| Regra de formatação                | Descrição |
| -----------------------------  | ------------------------------------------------------------    |
|`regular` | Strings que são escritas em fonte mono espaçada regular são informativas e não devem ser inseridas pelo leitor.<br>Essas strings podem representar a saída de um comando ou outra informação.|
|Exemplo: | O convite de um shell Bash:<br>`$`                     |
|**`negrito`**  | Strings que são escritas em fonte mono espaçada em negrito devem ser inseridas pelo leitor “como estão.” |
|Exemplo: | Para ver informações do sistema no Linux, insira o seguinte comando:<br>`$` **`uname -a`** |
|*`itálico`* ou  *`<itálico>`* | Strings que estão escritas em fonte mono espaçada em itálico representam valores que devem ser fornecidos pelo leitor. Por exemplo, se um argumento de comando for formatado como *`<name>`*, você deve fornecer algum valor como esse nome, em vez de *`<name>*`.<br>Se uma entrada não puder ser descrita em uma única palavra, a string é colocada entre um par de colchetes <...>. Você deve omitir os colchetes ao inserir um valor. Por exemplo, se um argumento de comando for formatado como *`<senha do usuário>`*, você deve inserir a senha sem os símbolos < e >. |
|Exemplo: | O comando `cat` pode ser usado para visualizar o conteúdo de um arquivo no Linux da seguinte maneira:<br>`$` **`cat`** *`nome do arquivo`*<br>`$` **`cat`** *`<nome do arquivo>`*<br><br>Se você precisa visualizar o conteúdo do arquivo chamado MeuArquivo.txt, execute o seguinte comando:<br>`cat MeuArquivo.txt` |