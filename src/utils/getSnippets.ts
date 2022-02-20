import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default function getSnippets(range: monaco.IRange): monaco.languages.CompletionItem[] {
  return [
    {
      label: '.start',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '文章的起始部分',
      insertText: `[postbg]bg3.png[/postbg][align=center][img=965,412]\${1:https://www.minecraft.net/content/dam/games/minecraft/screenshots/candle-header.jpg}[/img]

[backcolor=Black][color=White][b]\${2:CATEGORY}[/b][/color][/backcolor]

[size=6][b][color=Silver]\${3:Title}[/color][/b][/size]
[size=6][b]\${4:标题}[/b][/size]

[size=4][b][color=Silver]\${5:Subtitle}[/color][/b][/size]
[size=4][b]\${6:副标题}[/b][/size][/align]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.tabs',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '添加两个 `[intent]`',
      insertText: `[indent][indent]\n$1\n[/indent][/indent]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.p',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '新段落',
      insertText: `[size=2][color=Silver]$1[/size]\n$2`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.url',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '新链接（译文）',
      insertText: `[url=$1][color=#388d40]$2[/color][/url]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.url.orig',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '新链接（原文）',
      insertText: `[url=$1][color=Silver]$2[/color][/url]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.code',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '代码格式（译文）',
      insertText: `[backcolor=#f1edec][color=译][font=SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace]$1[/font][/color][/backcolor]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.code.orig',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '代码格式（原文）',
      insertText: `[backcolor=#f1edec][color=Silver][font=SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace]$1[/font][/color][/backcolor]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.h2',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建新二级段落',
      insertText: `[size=5][b][color=Silver]$1[/color][/b][/size]
[size=5][b]$2[/b][/size]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.h3',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建新三级段落',
      insertText: `[size=4][b][color=Silver]$1[/color][/b][/size]
[size=5][b]$2[/b][/size]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.h4',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建新四级段落',
      insertText: `[size=3][b][color=Silver]$1[/color][/b][/size]
[size=5][b]$2[/b][/size]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.h5',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建新五级段落',
      insertText: `[size=2][b][color=Silver]$1[/color][/b][/size]
[size=5][b]$2[/b][/size]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.li',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建新六级段落',
      insertText: `[list]
[*][color=Silver]$1[/color]
[*]$2
[/list]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.img',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建单个带有 caption 的图片',
      insertText: `[align=center][img]$1[/img]
[b][size=2][color=Silver]$2[/size]
$3[/b][/align]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.quote',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建一个普通引用',
      insertText: `[quote][float=left][img=53,92]$1[/img][/float][size=2][color=Silver]$2[/color][/size]
$2

 —— $3
[/quote]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.quote',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建一个普通引用',
      insertText: `[quote][float=left][img=53,92]$1[/img][/float][size=2][color=Silver]$2[/color][/size]
$2

 —— $3
[/quote]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.greenquote',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '创建一个绿色引用',
      insertText: `[indent][size=4][color=SeaGreen][b]|[/b][/color][color=Silver]$1[/color][/size][/indent]
[indent][size=4][color=SeaGreen][b]|[/b][/color]$2[/size][/indent]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.video',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '嵌入视频',
      insertText: `[align=center][media=x,500,375]$1[/media]
视频提供：\${2:@广药} [/align]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.video.ytb',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '连接至 YouTube 视频',
      insertText: `[align=center][url=$1][img]$2[/img][/url]
（点击图片跳转到 Youtube 查看视频）[/align]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
    {
      label: '.ending',
      additionalTextEdits: [{range, text: null}],
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: '文章的结束部分',
      insertText: `[float=left][img=82,121]\${1:https://www.minecraft.net/content/dam/archive/673fbce045729846ea80943491f2a4ab-PerAvatar.png}[/img][/float]

[b]【$2 译自[url=$3][color=#388d40][u]\${3:官网} $4 年 $5 月 $6 日发布的 $7[/u][/color][/url]；原作者 $8】[/b]`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
  ]
}
