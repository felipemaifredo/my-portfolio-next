# Design System — Felipe Maifredo Portfolio

## 1. Princípios de Design

- **Tech & Modernidade Minimalista**: Foco em conteúdo com estética limpa de desenvolvedor, tipografia precisa, contrastes calibrados e elementos gráficos interativos (canvas/WebGL, matrix, microinterações).
- **Consistência Adaptativa**: Suporte pleno a temas Claro (`t-light`) e Escuro (`t-dark`) combinado com 8 cores de destaque dinâmicas (`t-green`, `t-rose`, `t-blue`, `t-orange`, `t-purple`, `t-cyan`, `t-yellow`, `t-red`), garantindo sempre contraste e legibilidade.
- **Acessibilidade First (WCAG AA)**: Foco visível explícito (`:focus-visible`), contraste mínimo de 4.5:1 para texto normal e 3:1 para elementos de interface/gráficos, suporte a leitores de tela com `aria-label` e respeito a `prefers-reduced-motion`.
- **Fluidez & Responsividade**: Layouts fluidos usando `clamp()`, navegação rápida e transições de página sem atrito.

---

## 2. Tipografia

### 2.1 Famílias Tipográficas
- **Principal (Sans-serif)**: `Geist, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Uso: Textos corridos, títulos de seções, botões e navegação.
- **Código & Tags (Monospace)**: `"Geist Mono", "JetBrains Mono", Menlo, Consolas, Monaco, monospace`
  - Uso: Badges de tecnologias, contadores, trechos de código e metadados.

### 2.2 Escala Tipográfica (Modular / Fluid)
| Token | Tamanho / clamp | Line-Height | Uso Típico |
| :--- | :--- | :--- | :--- |
| `--fs-hero` | `clamp(2.75rem, 6vw, 4.5rem)` | 1.1 | Título principal da Hero |
| `--fs-h1` | `clamp(2.0rem, 4vw, 3.0rem)` | 1.2 | Títulos de páginas e seções principais |
| `--fs-h2` | `clamp(1.5rem, 2.5vw, 2.0rem)` | 1.3 | Subtítulos e títulos de cards grandes |
| `--fs-h3` | `1.25rem` (20px) | 1.4 | Títulos de blocos e cards secundários |
| `--fs-body-lg` | `1.125rem` (18px) | 1.6 | Parágrafos de destaque e resumos |
| `--fs-body` | `1rem` (16px) | 1.6 | Texto padrão e parágrafos do Sobre |
| `--fs-body-sm` | `0.875rem` (14px) | 1.5 | Legendas, tooltips e botões secundários |
| `--fs-caption` | `0.75rem` (12px) | 1.4 | Badges, tags de tecnologias e metadados |

---

## 3. Cores & Tokens de Tema

### 3.1 Superfícies e Textos por Tema

#### Tema Claro (`body[data-theme="t-light"]`)
- `--c-bg-page`: `#f8fafc` (fundo geral da aplicação)
- `--c-bg-card`: `#ffffff` (cartões e blocos elevados)
- `--c-bg-card-hover`: `#f1f5f9`
- `--c-bg-surface`: `#ffffff` (navegação, modais, tooltips)
- `--c-border-subtle`: `rgba(0, 0, 0, 0.08)`
- `--c-border-hover`: `rgba(0, 0, 0, 0.18)`
- `--c-text-primary`: `#0f172a` (títulos e textos com alto contraste)
- `--c-text-secondary`: `#475569` (descrições e parágrafos secundários)
- `--c-text-muted`: `#64748b` (metadados e placeholders)
- `--c-glass-bg`: `rgba(255, 255, 255, 0.75)`
- `--c-glass-border`: `rgba(255, 255, 255, 0.3)`

#### Tema Escuro (`body[data-theme="t-dark"]`)
- `--c-bg-page`: `#090d16` (fundo principal imersivo)
- `--c-bg-card`: `#111827` (cartões e blocos)
- `--c-bg-card-hover`: `#1e293b`
- `--c-bg-surface`: `#111827` (navegação, menus flutuantes)
- `--c-border-subtle`: `rgba(255, 255, 255, 0.08)`
- `--c-border-hover`: `rgba(255, 255, 255, 0.18)`
- `--c-text-primary`: `#f8fafc` (títulos e textos principais)
- `--c-text-secondary`: `#cbd5e1` (parágrafos e descrições)
- `--c-text-muted`: `#94a3b8` (metadados e placeholders)
- `--c-glass-bg`: `rgba(17, 24, 39, 0.75)`
- `--c-glass-border`: `rgba(255, 255, 255, 0.1)`

### 3.2 Cores de Acento (`data-color`)
Cada cor de acento possui calibração dedicada para manter contraste no tema claro e no escuro:

| Identificador | Nome | Cor Claro (`t-light`) | Cor Escuro (`t-dark`) |
| :--- | :--- | :--- | :--- |
| `t-green` | Verde | `#16a34a` | `#4ade80` |
| `t-rose` | Rosa | `#db2777` | `#f472b6` |
| `t-blue` | Azul | `#2563eb` | `#60a5fa` |
| `t-orange` | Laranja | `#ea580c` | `#fb923c` |
| `t-purple` | Roxo | `#9333ea` | `#c084fc` |
| `t-cyan` | Ciano | `#0284c7` | `#38bdf8` |
| `t-yellow` | Amarelo | `#ca8a04` | `#facc15` |
| `t-red` | Vermelho | `#dc2626` | `#f87171` |

- `--c-primary-glow`: Versão com transparência (15-20%) da cor ativa para sombras, anéis de foco e gradientes.

---

## 4. Espaçamento, Grid e Dimensões

### 4.1 Escala de Espaçamento (Base 4px / 8px)
- `--space-1`: `0.25rem` (4px)
- `--space-2`: `0.5rem` (8px)
- `--space-3`: `0.75rem` (12px)
- `--space-4`: `1rem` (16px)
- `--space-5`: `1.25rem` (20px)
- `--space-6`: `1.5rem` (24px)
- `--space-8`: `2rem` (32px)
- `--space-10`: `2.5rem` (40px)
- `--space-12`: `3rem` (48px)
- `--space-16`: `4rem` (64px)
- `--space-20`: `5rem` (80px)

### 4.2 Containers & Breakpoints
- `--w-max-width`: `1200px` (conteúdo centralizado)
- Padding lateral padrão da página:
  - Mobile (< 640px): `1rem` (16px)
  - Tablet (640px - 1024px): `2rem` (32px)
  - Desktop (> 1024px): `3rem` (48px)

---

## 5. Bordas, Sombras e Efeitos Visuais

### 5.1 Arredondamento (`border-radius`)
- `--radius-sm`: `6px` (badges, tags menores)
- `--radius-md`: `10px` (botões, inputs de formulário)
- `--radius-lg`: `16px` (cards de projetos e modais)
- `--radius-xl`: `24px` (containers de destaque, dock de navegação)
- `--radius-full`: `9999px` (círculos, pills, avatares)

### 5.2 Sombras e Elevação
- `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
- `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`
- `--shadow-floating`: `0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15)`
- `--shadow-accent`: `0 0 20px var(--c-primary-glow)`

### 5.3 Glassmorphism
- Classes e utilitários de vidro utilizam:
  - `background: var(--c-glass-bg);`
  - `backdrop-filter: blur(12px);`
  - `-webkit-backdrop-filter: blur(12px);`
  - `border: 1px solid var(--c-glass-border);`

---

## 6. Componentes e Padrões de Interface

### 6.1 Barra de Navegação Flutuante (`Nav`)
- Fixa na tela (lateral ou base/dock conforme viewport).
- Ícones intuitivos com tooltips com atraso suave (0.15s).
- Indicador ativo dinâmico na cor de acento ativa.
- Acessibilidade: Navegação por teclado (`Tab`, `Enter`, `Space`) com indicador visível de foco.

### 6.2 Botões & Ações
- **Primário**: Fundo com `--c-primary`, texto com contraste correspondente, microinteração `whileHover: { scale: 1.03 }` e `whileTap: { scale: 0.97 }`.
- **Secundário / Outline**: Fundo transparente, borda sutil `--c-border-subtle`, cor de texto `--c-text-primary`.
- **Ghost / Ícone**: Botão de ícone transparente com hover preenchendo com `--c-bg-card-hover`.
- **Estados**:
  - Hover: Leve aumento de elevação e brilho.
  - Ativo/Pressionado: Efeito de escala reduzida sutil.
  - Foco: `outline: 2px solid var(--c-primary); outline-offset: 2px;`.

### 6.3 Cards de Projetos & Trabalhos
- Efeito de hover sutil com elevação e destaque na borda (`border-color: var(--c-primary)`).
- Tags de tecnologias em estilo badge (`--fs-caption`, `var(--radius-sm)`).
- Ações claras (Link para visualização ao vivo e repositório/detalhes).

### 6.4 Formulário de Contato
- Inputs com espaçamento confortável (`--space-3` vertical, `--space-4` horizontal).
- Borda com transição de foco para `--c-primary` e anel de foco sutil (`box-shadow: 0 0 0 3px var(--c-primary-glow)`).
- Mensagens de validação e feedback com ícones e cores semânticas (sucesso/erro).

### 6.5 Seletor de Temas (`ThemeSwitcher`)
- Botão flutuante acessível no canto da tela com ícone indicativo do estado atual.
- Painel popover organizado em 3 seções:
  1. Alternador de Modo (Claro / Escuro).
  2. Paleta de Cores de Acento (8 opções com seleção visual).
  3. Alternador de Idioma (PT / EN).
- Fechamento com tecla `Escape` ou clique externo.

---

## 7. Animações e Microinterações (Motion)

- **Biblioteca**: `framer-motion`.
- **Curva de Bézier Padrão**: `cubic-bezier(0.16, 1, 0.3, 1)` (suave, sem sensação mecânica).
- **Tempos de Transição**:
  - Microinterações (botões, ícones, badges): `150ms` a `200ms`.
  - Transições de cards e menus: `250ms` a `350ms`.
  - Revelação de seções (scroll): `500ms` a `700ms` com stagger de `100ms` por item.
- **Acessibilidade de Movimento**:
  - `@media (prefers-reduced-motion: reduce)`: Desativa movimentos de translação excessivos, mantendo apenas fade in/out sutil.

---

## 8. Regras de Código e Arquitetura

- **Estilização**: Uso preferencial de **CSS Modules** (`*.module.css`) em todos os componentes.
- **Aspas**: Sempre use aspas duplas `"`, reservando aspas simples `'` apenas quando estritamente necessário.
- **Pontuação**: Usar ponto e vírgula `;` somente quando necessário (evitar nos finais de linha em TS/JS).
- **Tipagens**: Preferir `type` em vez de `interface`.
- **Funções & JSX**:
  - Usar `const` somente para elementos JSX.
  - Usar `function` para funções puras sem retorno JSX.
- **Estrutura de Pastas**:
  - `src/app`: Rotas e layouts do Next.js.
  - `src/ui`: `pages/` e `components/` (e subcomponentes).
  - `src/lib`: `utils/` e `hooks/`.
  - `src/resources`: `assets/`, `fonts/`, `texts/` (e `messages/`).
- **Ordem de Imports**:
  Organizar os imports no topo com comentários descritivos:
  1. `//Libs` (React, Next.js, framer-motion, next-intl, etc.)
  2. `//Imports` (componentes, estilos CSS Modules, utilitários)
  3. `//Types` (declarações de tipo importadas)
  4. `//Consts` (constantes auxiliares)
  5. `//Funcs` (funções auxiliares)
  6. `//Main` (componente principal)
