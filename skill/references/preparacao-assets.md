# Preparação de Assets Visuais

Antes de montar o `post.json` e renderizar o post com Remotion, você precisa garantir que todos os assets visuais mencionados no roteiro existam fisicamente na pasta `assets/` do post e estejam prontos para o uso.

## Onde os assets devem ficar
Todos os assets devem ser copiados ou gerados na pasta `$POSTS_DIR/AAAA-MM-DD (tema)/assets/`. Crie esta pasta se ela ainda não existir.

## 1. Avatar e Fotos de Pessoas
- **Fundo transparente**: Se a arte pede um avatar ou foto recortada (para sobreposição no layout), a imagem **deve** ser um PNG com fundo transparente.
- **Como verificar**: Você pode usar `view_file` para analisar a imagem visualmente ou executar comandos do ImageMagick via `run_command` para ter certeza:
  `identify -format '%A' "$POSTS_DIR/.../assets/avatar.png"` (Deve retornar `True` ou `Blend` para indicar canal alpha).
- Se o usuário enviou uma foto com fundo e você precisar remover o fundo, pode sugerir o uso de ferramentas externas ou pedir para ele enviar a versão `.png` correta.

## 2. Geração de Imagens com IA (Texturas, Fundos, Ilustrações)
- Se o roteiro pede uma imagem abstrata, fundo texturizado ou uma ilustração genérica, **use a ferramenta `generate_image` nativa do Antigravity**.
- Renomeie a imagem gerada (o Artifact será salvo em sua pasta local) copiando-a para a pasta `assets/` do post com um nome limpo, como `fundo-orbs.png` ou `textura-concreto.png`.
- **Limitações**: Evite gerar telas de interface de aplicativos (UI) ou mockups de código com a ferramenta de imagem, pois a IA tende a gerar "texto falso" ou botões inconsistentes.

## 3. Captura e Formatação de Tela (Prints / UIs)
- O Remotion possui os blocos `celular` e `print` que emolduram imagens automaticamente.
- Para prints web, você pode recomendar ao usuário o comando `/browser` ou apenas pedir que ele tire o print e mande o caminho.
- **Proporção correta**:
  - Para o bloco **celular**, a imagem precisa ter proporção vertical (ex: 9:16 ou próxima).
  - Se a imagem enviada for horizontal, **corte-a** com o ImageMagick ou avise o usuário.
  - Exemplo de crop vertical mantendo o centro:
    `magick "entrada.png" -gravity center -crop 1080x1920+0+0 "assets/print-celular.png"`

## 4. Edição de Vídeos e Áudios (Reels / Stories)
Você pode usar o `ffmpeg` via `run_command` para preparar trechos de vídeo ou trilhas sonoras.
- **Recortar trecho de vídeo**:
  `ffmpeg -i "original.mp4" -ss 00:00:05 -to 00:00:15 -c copy "assets/cortado.mp4"`
- **Tirar áudio do vídeo original**:
  `ffmpeg -i "original.mp4" -an -c:v copy "assets/mudo.mp4"`
- **Mudar tamanho do vídeo (Crop vertical 9:16)**:
  `ffmpeg -i "original.mp4" -vf "crop=ih*(9/16):ih" -c:a copy "assets/vertical.mp4"`
- **Converter formato ou diminuir qualidade (para posts mais leves se necessário)**:
  `ffmpeg -i "original.mp4" -vcodec libx264 -crf 23 "assets/convertido.mp4"`

## 5. Textos / Códigos
- Não é necessário tirar prints de trechos de código!
- Use `view_file` no repositório local do usuário, copie as linhas necessárias, e insira diretamente no bloco `"codigo"` do `post.json`. O Remotion se encarregará de formatar a janela do terminal ou do macOS perfeitamente, garantindo máxima legibilidade.

## Checagem Final
Antes de avançar para a Fase 6 (JSON e Render), valide:
- Todos os arquivos citados na seção "Assets necessários" do roteiro estão na pasta `assets/`?
- As imagens estão com o fundo correto (transparente vs sólido)?
- Os vídeos estão com a extensão `.mp4` suportada pelo Remotion?
- Os nomes de arquivos não contêm espaços problemáticos (prefira `print-tela.png` em vez de `print tela final.png`).
