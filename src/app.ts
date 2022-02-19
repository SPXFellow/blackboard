import type {LanguageId} from './register';
import type {ScopeName, TextMateGrammar, ScopeNameInfo} from './providers';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {createOnigScanner, createOnigString, loadWASM} from 'vscode-oniguruma';
import {SimpleLanguageInfoProvider} from './providers';
import {registerLanguages} from './register';
import {rehydrateRegexps} from './configuration';
import VsCodeDarkTheme from './vs-dark-plus-theme';
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness.js';
import {WebrtcProvider} from 'y-webrtc';
// @ts-expect-error
import {MonacoBinding} from 'y-monaco';

interface DemoScopeNameInfo extends ScopeNameInfo {
  path: string;
}

main('bbcode');

async function main(language: LanguageId) {
  // In this demo, the following values are hardcoded to support Python using
  // the VS Code Dark+ theme. Currently, end users are responsible for
  // extracting the data from the relevant VS Code extensions themselves to
  // leverage other TextMate grammars or themes. Scripts may be provided to
  // facilitate this in the future.
  //
  // Note that adding a new TextMate grammar entails the following:
  // - adding an entry in the languages array
  // - adding an entry in the grammars map
  // - making the TextMate file available in the grammars/ folder
  // - making the monaco.languages.LanguageConfiguration available in the
  //   configurations/ folder.
  //
  // You likely also want to add an entry in getSampleCodeForLanguage() and
  // change the call to main() above to pass your LanguageId.
  const languages: monaco.languages.ILanguageExtensionPoint[] = [
    {
      id: 'bbcode',
      extensions: ['.bbcode'],
      aliases: ['BBC'],
      filenames: [],
      firstLine: '',
    },
  ];
  const grammars: {[scopeName: string]: DemoScopeNameInfo} = {
    'text.bbcode': {
      language: 'bbcode',
      path: 'bbcode.tmLanguage.json',
    },
  };

  const fetchGrammar = async (scopeName: ScopeName): Promise<TextMateGrammar> => {
    const {path} = grammars[scopeName];
    const uri = `/grammars/${path}`;
    const response = await fetch(uri);
    const grammar = await response.text();
    const type = path.endsWith('.json') ? 'json' : 'plist';
    return {type, grammar};
  };

  const fetchConfiguration = async (
    language: LanguageId,
  ): Promise<monaco.languages.LanguageConfiguration> => {
    const uri = `/configurations/${language}.json`;
    const response = await fetch(uri);
    const rawConfiguration = await response.text();
    return rehydrateRegexps(rawConfiguration);
  };

  const data: ArrayBuffer | Response = await loadVSCodeOnigurumWASM();
  loadWASM(data);
  const onigLib = Promise.resolve({
    createOnigScanner,
    createOnigString,
  });

  const provider = new SimpleLanguageInfoProvider({
    grammars,
    fetchGrammar,
    configurations: languages.map((language) => language.id),
    fetchConfiguration,
    theme: VsCodeDarkTheme,
    onigLib,
    monaco,
  });
  registerLanguages(
    languages,
    (language: LanguageId) => provider.fetchLanguageInfo(language),
    monaco,
  );

  const value = `[b]Welcome to the SPXX Blackboard Alpha![/b] We have generated a room for you. Please type something in the editor
and it will show up for everyone who got the same url. You can also explore the advanced features just by typing [code].[/code] and the
name of the command. May be try [code].start[/code]?

Note that if everyone in the room leaves it, you will only be able to see the latest version of the file that you have
recieved and any newer changes will be completely ignored & users whojoins the room afterwards will see a blank room.
Therefore, it is recommended to keep the room open for as long as you need it and only close it when you are done.

The room is designed to be able to see other user's cursor positions and selections. However, this feature is a bit buggy
and fails a lot. If you experience any other issues, please open an issue on our GitHub page.

You can always start a new session at [url]https://b.wuguangyaostore.com/[/url]. This is an open source project lincensed under MIT and
you can visit our GitHub page at [url]https://github.com/SPXFellow/blackboard[/url].
`
  const id = 'container';
  const element = document.getElementById(id);
  if (element == null) {
    throw Error(`could not find element #${id}`);
  }

  monaco.languages.registerCompletionItemProvider('bbcode', {
    provideCompletionItems: (model, position) => {
      var word = model.getWordUntilPosition(position);
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: [
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
        ],
      };
    },
  });

  const ydoc = new Y.Doc();

  let roomName: string;

  if (location.hash.length < 1) {
    const cyrb53 = function(str: string, seed = 0) {
      let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
          ch = str.charCodeAt(i);
          h1 = Math.imul(h1 ^ ch, 2654435761);
          h2 = Math.imul(h2 ^ ch, 1597334677);
      }

      h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
      h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1>>>0);
    };
    const hash = cyrb53(crypto.getRandomValues(new Uint32Array(5)).toString()).toString(36);
    location.hash = hash;
  }
  roomName = 'spxx-' + location.hash
  document.addEventListener('hashchange', () => location.reload())
  const yprovider = new WebrtcProvider(roomName, ydoc, {
    signaling: [
      //'ws://bb.guangyaostore.com',
      'wss://signaling.yjs.dev',
      'wss://y-webrtc-signaling-eu.herokuapp.com',
      'wss://y-webrtc-signaling-us.herokuapp.com',
    ],
    password: null,
    awareness: new awarenessProtocol.Awareness(ydoc),
    maxConns: 20 + Math.floor(Math.random() * 15),
    filterBcConns: true,
    peerOpts: {},
  });
  const type = ydoc.getText('monaco');

  const editor = monaco.editor.create(element, {
    language,
    theme: 'vs-dark',
    minimap: {
      enabled: true,
    },
  });
  provider.injectCSS();

  const monacoBinding = new MonacoBinding(
    type,
    editor.getModel(),
    new Set([editor]),
    yprovider.awareness,
  );


  editor!.setValue(value);
}

// Taken from https://github.com/microsoft/vscode/blob/829230a5a83768a3494ebbc61144e7cde9105c73/src/vs/workbench/services/textMate/browser/textMateService.ts#L33-L40
async function loadVSCodeOnigurumWASM(): Promise<Response | ArrayBuffer> {
  const response = await fetch('/node_modules/vscode-oniguruma/release/onig.wasm');
  const contentType = response.headers.get('content-type');
  if (contentType === 'application/wasm') {
    return response;
  }

  // Using the response directly only works if the server sets the MIME type 'application/wasm'.
  // Otherwise, a TypeError is thrown when using the streaming compiler.
  // We therefore use the non-streaming compiler :(.
  return await response.arrayBuffer();
}
