import type {LanguageId} from './utils/register'
import type {ScopeName, TextMateGrammar, ScopeNameInfo} from './utils/providers'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import {createOnigScanner, createOnigString, loadWASM} from 'vscode-oniguruma'
import {SimpleLanguageInfoProvider} from './utils/providers'
import {registerLanguages} from './utils/register'
import {rehydrateRegexps} from './utils/configuration'
import VsCodeDarkTheme from './utils/vs-dark-plus-theme'
import * as Y from 'yjs'
import * as awarenessProtocol from 'y-protocols/awareness.js'
import {WebrtcProvider} from 'y-webrtc'
import {IndexeddbPersistence} from 'y-indexeddb'
// @ts-expect-error
import {MonacoBinding} from 'y-monaco'
import getSnippets from './utils/getSnippets'

interface DemoScopeNameInfo extends ScopeNameInfo {
  path: string
}

main('bbcode')

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
  ]
  const grammars: {[scopeName: string]: DemoScopeNameInfo} = {
    'text.bbcode': {
      language: 'bbcode',
      path: 'bbcode.tmLanguage.json',
    },
  }

  const fetchGrammar = async (scopeName: ScopeName): Promise<TextMateGrammar> => {
    const {path} = grammars[scopeName]
    const uri = `/grammars/${path}`
    const response = await fetch(uri)
    const grammar = await response.text()
    const type = path.endsWith('.json') ? 'json' : 'plist'
    return {type, grammar}
  }

  const fetchConfiguration = async (
    language: LanguageId,
  ): Promise<monaco.languages.LanguageConfiguration> => {
    const uri = `/configurations/${language}.json`
    const response = await fetch(uri)
    const rawConfiguration = await response.text()
    return rehydrateRegexps(rawConfiguration)
  }

  const data: ArrayBuffer | Response = await loadVSCodeOnigurumWASM()
  loadWASM(data)
  const onigLib = Promise.resolve({
    createOnigScanner,
    createOnigString,
  })

  const provider = new SimpleLanguageInfoProvider({
    grammars,
    fetchGrammar,
    configurations: languages.map((language) => language.id),
    fetchConfiguration,
    theme: VsCodeDarkTheme,
    onigLib,
    monaco,
  })
  registerLanguages(
    languages,
    (language: LanguageId) => provider.fetchLanguageInfo(language),
    monaco,
  )

  const id = 'container'
  const element = document.getElementById(id)
  if (element == null) {
    throw Error(`could not find element #${id}`)
  }

  monaco.languages.registerCompletionItemProvider('bbcode', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      return {
        suggestions: getSnippets(range),
      }
    },
  })

  const ydoc = new Y.Doc()

  let roomName: string

  if (location.hash.length < 1) {
    const cyrb53 = function (str: string, seed = 0) {
      let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
      }

      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
      return 4294967296 * (2097151 & h2) + (h1 >>> 0)
    }
    const hash = cyrb53(crypto.getRandomValues(new Uint32Array(5)).toString()).toString(36)
    location.hash = hash
  }
  roomName = 'spxx-' + location.hash
  document.addEventListener('hashchange', () => location.reload())

  const indexeddbProvider = new IndexeddbPersistence('count-demo', ydoc)
  indexeddbProvider.whenSynced.then(() => {
    console.log('loaded data from indexed db')
  })
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
  })
  const type = ydoc.getText('monaco')

  const editor = monaco.editor.create(element, {
    language,
    theme: 'vs-dark',
    minimap: {
      enabled: true,
    },
  })
  provider.injectCSS()

  const monacoBinding = new MonacoBinding(
    type,
    editor.getModel(),
    new Set([editor]),
    yprovider.awareness,
  )
}

// Taken from https://github.com/microsoft/vscode/blob/829230a5a83768a3494ebbc61144e7cde9105c73/src/vs/workbench/services/textMate/browser/textMateService.ts#L33-L40
async function loadVSCodeOnigurumWASM(): Promise<Response | ArrayBuffer> {
  const response = await fetch(
    new URL('../node_modules/vscode-oniguruma/release/onig.wasm', import.meta.url).href,
  )
  const contentType = response.headers.get('content-type')
  if (contentType === 'application/wasm') {
    return response
  }

  // Using the response directly only works if the server sets the MIME type 'application/wasm'.
  // Otherwise, a TypeError is thrown when using the streaming compiler.
  // We therefore use the non-streaming compiler :(.
  return await response.arrayBuffer()
}
