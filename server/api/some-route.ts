import OpenAI from "openai";
import { sleep } from "openai/core";

export default eventHandler(async () => {
  const openai = new OpenAI();
  // const myAssistant = await openai.beta.assistants.create({
  //   instructions: `Ты персональный помошник для программистов,
  //   твоя основная задача отвечать людям на вопросы по программированию,
  //   но если тебя спросят вопрос не технического характера,
  //   ты так же можешь ответить, если знаешь, ответ на вопрос`,
  //   name: "Developer assistant",
  //   tools: [{ type: "code_interpreter" }],
  //   model: "gpt-3.5-turbo-0125",
  // });

  // const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create("thread_QcQzQuoJwYFVJRrjbHhiwQiQ", {
    role: "user",
    content: "А что я спросил в прошлый раз?",
  });
  const run = await openai.beta.threads.runs.create(
    "thread_QcQzQuoJwYFVJRrjbHhiwQiQ",
    {
      assistant_id: "asst_sn6knv7KTmFnAonAxRwA4JPg",
    },
  );

  let run_status = await openai.beta.threads.runs.retrieve(
    "thread_QcQzQuoJwYFVJRrjbHhiwQiQ",
    run.id,
  );

  while (run_status.status != "completed" && run.status != "failed") {
    await sleep(1500);
    run_status = await openai.beta.threads.runs.retrieve(
      "thread_QcQzQuoJwYFVJRrjbHhiwQiQ",
      run.id,
    );
  }

  const assistants_response = await openai.beta.threads.messages.list(
    "thread_QcQzQuoJwYFVJRrjbHhiwQiQ",
  );
  return {
    text: assistants_response.data[0].content[0],
    thread_id: "thread_QcQzQuoJwYFVJRrjbHhiwQiQ",
    run,
  };
});
