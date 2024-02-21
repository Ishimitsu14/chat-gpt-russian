<script setup async lang="ts">
import type { ThreadFindResponse } from "~/core/dto/thread.find.response";

const route = useRoute();
const router = useRouter();
const { signOut } = useAuth();

const currentThreadId = computed(() => route.params.thread);

const { data: threads } = await useAsyncData(
  "threads",
  () => useApi<ThreadFindResponse[]>("/api/threads/find"),
  {
    watch: [currentThreadId],
  },
);

const { data: sessionData } = useAuth();
const { isDark, toggleTheme } = useToggleTheme();

const createThread = async () => {
  await router.push("/");
};
const deleteThread = async (threadId: string) => {
  if (threads.value?.length) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    threads.value = threads.value?.filter((thread) => thread.id !== threadId);
  }

  await useApi("/api/threads/delete", {
    method: "DELETE",
    body: {
      threadId,
    },
  });
};
</script>

<template>
  <client-only>
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer>
        <v-list>
          <v-list-item
            :prepend-avatar="sessionData?.user?.image || ''"
            :title="sessionData?.user?.name || ''"
            :subtitle="sessionData?.user?.email || ''"
          />
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item
            prepend-icon="mdi-chat-plus"
            title="Create new chat"
            @click="createThread"
          />
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item v-for="thread in threads" :key="thread.id">
            <template #title>
              <div class="cursor-pointer" @click="router.push(`/${thread.id}`)">
                <v-icon class="mr-4"> mdi-message-text </v-icon>
                {{ thread.title || thread.id }}
              </div>
            </template>
            <template #append>
              <v-icon @click="deleteThread(thread.id)"> mdi-delete </v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar title="Chat GPT">
        <v-btn @click="signOut"> Logout </v-btn>
        <v-btn class="theme-toggle" @click="toggleTheme">
          <v-icon v-if="isDark">mdi-white-balance-sunny</v-icon>
          <v-icon v-else>mdi-moon-waning-crescent</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main class="d-flex align-center justify-center">
        <slot />
      </v-main>
    </v-layout>
  </client-only>
</template>

<style scoped></style>
