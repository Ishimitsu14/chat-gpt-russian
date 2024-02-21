<script setup lang="ts">
import type { ThreadFindResponse } from "~/core/dto/thread.find.response";
import type { MessageFindResponse } from "~/core/dto/message.find.response";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Markdown from "vue3-markdown-it";
import "highlight.js/styles/monokai-sublime.min.css";
import IconChatGpt from "~/assets/images/chat-gpt.svg";

const route = useRoute();
const router = useRouter();
const { data: userSession } = useAuth();

const { data: messages } = useAsyncData("messages", () =>
  useApi<MessageFindResponse[]>("/api/messages/find", {
    query: { threadId: route.params.thread },
  }),
);
const inputValue = ref("");
const isSending = ref(false);
const isShiftDown = ref(false);

const sendMessage = async () => {
  if (!inputValue.value) return;
  isSending.value = true;

  let threadId = route.params.thread;
  if (!threadId) {
    const thread = await useApi<ThreadFindResponse>("/api/threads/create", {
      method: "post",
    });
    threadId = thread.id;
  }

  const result = await useApi<MessageFindResponse[]>("/api/messages/create", {
    method: "post",
    body: {
      message: inputValue.value,
      threadId,
      isCreateTitle: !route.params.thread,
    },
  });

  messages.value?.push(...result);

  inputValue.value = "";
  isSending.value = false;

  if (!route.params.thread) {
    await router.replace({ path: `/${threadId}` });
  }
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Shift") {
    isShiftDown.value = true;
  }
  if (
    event.key === "Enter" &&
    !isShiftDown.value &&
    inputValue.value.trim().length
  ) {
    event.preventDefault();
    sendMessage();
  }
};

const onKeyUp = (event: KeyboardEvent) => {
  if (event.key === "Shift") {
    isShiftDown.value = false;
  }
};
</script>

<template>
  <div class="chat">
    <div class="d-flex flex-column align-center w-100">
      <div class="d-flex flex-column chat__messages">
        <TransitionGroup tag="div" name="fade" mode="out-in">
          <div
            v-for="message in messages"
            :key="message.id"
            class="chat__message"
          >
            <div class="chat__left">
              <div class="chat__user-avatar">
                <v-avatar
                  v-if="message.role === 'user'"
                  :image="userSession?.user?.image || ''"
                />
                <icon-chat-gpt v-else />
              </div>
            </div>
            <div class="chat__right">
              <div class="chat__user-name">
                {{
                  message.role === "user" ? userSession?.user?.name : "Chat GPT"
                }}
              </div>
              <markdown class="chat__body" :source="message.text" />
            </div>
          </div>
        </TransitionGroup>
      </div>
      <v-form class="chat__field" @submit.prevent="sendMessage">
        <v-textarea
          v-model="inputValue"
          class="chat__text-area"
          append-inner-icon="mdi-send"
          no-resize
          rows="1"
          auto-grow
          variant="solo"
          center-affix
          color="red"
          flat
          :loading="isSending"
          @click:append-inner="sendMessage"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
        />
      </v-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  display: flex;
  align-items: flex-end;
  max-width: 770px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;

  min-height: calc(100vh - 64px);

  &__messages {
    gap: 30px;
    margin-bottom: 80px;
  }

  &__message {
    display: flex;
  }

  &__user-avatar {
    margin-right: 20px;
    svg {
      width: 40px;
      height: 40px;
    }
  }

  &__user-name {
    padding: 10px 0;
  }

  &__field {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    bottom: 0;
    padding-bottom: 10px;
    padding-top: 10px;
    z-index: 999;
  }
}
</style>

<style lang="scss">
.chat__text-area {
  max-width: 770px;
  .v-field {
    display: flex;
    align-items: center;
  }
  .v-input__details {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
