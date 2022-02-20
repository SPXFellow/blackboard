<template>
  <n-config-provider :theme="darkTheme" :locale="zhCN" :date-locale="dateZhCN">
    <site-header />
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px;"
        title="Welcome"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showModal = false"
      >
        <p>
          <b>Welcome to the SPXX Blackboard Alpha!</b> We have generated a room for you. Please type
          something in the editor and it will show up for everyone who got the same url. You can
          also explore the advanced features just by typing <code>.</code> and the name of the
          command. May be try <code>.start</code>?
        </p>

        <p>
          Note that if everyone in the room leaves it, you will only be able to see the latest
          version of the file that you have recieved and any newer changes will be completely
          ignored & users whojoins the room afterwards will see a blank room. Therefore, it is
          recommended to keep the room open for as long as you need it and only close it when you
          are done.
        </p>

        <p>
          The room is designed to be able to see other user's cursor positions and selections.
          However, this feature is a bit buggy and fails a lot. If you experience any other issues,
          please open an issue on our GitHub page.
        </p>

        <p>
          You can always start a new session at
          <n-a href="https://b.wuguangyaostore.com/">https://b.wuguangyaostore.com/</n-a>. This is
          an open source project lincensed under MIT and you can visit our GitHub page at
          <n-a href="https://github.com/SPXFellow/blackboard"
            >https://github.com/SPXFellow/blackboard</n-a
          >.
        </p>
      </n-card>
    </n-modal>
    <blackboard-editor />
  </n-config-provider>
</template>
<script setup lang="ts">
import {NConfigProvider, NModal, NCard, NA, darkTheme, zhCN, dateZhCN} from 'naive-ui'
import SiteHeader from './components/SiteHeader.vue'
import BlackboardEditor from './components/BlackboardEditor.vue'

let showModal = $ref(true)
</script>
