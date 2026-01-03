<template>
  <div class="prompt-api-container">
    <div class="status-container">
      <div class="status-item">
        <span>Temperature:</span>
        <span>{{ sessionStats.temperature }}</span>
      </div>
      <div class="status-item">
        <span>Top K:</span>
        <span>{{ sessionStats.topK }}</span>
      </div>
      <div class="status-item">
        <span>Total Tokens:</span>
        <span>{{ sessionStats.totalTokens }}</span>
      </div>
      <div class="status-item">
        <span>Used Tokens:</span>
        <span>{{ sessionStats.usedTokens }}</span>
      </div>
      <div class="status-item">
        <span>Remaining Tokens:</span>
        <span>{{ sessionStats.remainingTokens }}</span>
      </div>
    </div>
    <div class="input-prompt">
      <textarea type="area" v-model="prompt" placeholder="Enter your prompt" />
      <div class="operation">
        <button @click="handleSubmit">Submit</button>
        <button @click="resetSession">Reset</button>
      </div>
    </div>
    <div class="response-container">
      <div v-if="loading">Loading...</div>
      <pre ref="response"></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as smd from 'streaming-markdown';
import DOMPurify from 'dompurify';

const prompt = ref('')
const response = ref<HTMLPreElement | null>(null)

const parser = ref<smd.Parser | null>(null)

const session = ref<LanguageModel | null>(null)
const sessionTemperature = ref(1)
const sessionTopK = ref(1)
const systemPrompt = ref('You are a helpful assistant.')

const sessionStats = ref({
  temperature: 0,
  topK: 0,
  totalTokens: 0,
  usedTokens: 0,
  remainingTokens: 0,
})

const updateSessionStats = () => {
  sessionStats.value = {
    temperature: session.value?.temperature ?? 0,
    topK: session.value?.topK ?? 0,
    totalTokens: session.value?.inputQuota ?? 0,
    usedTokens: session.value?.inputUsage ?? 0,
    remainingTokens: (session.value?.inputQuota ?? 0) - (session.value?.inputUsage ?? 0),
  }
}

const loading = ref(false)

const handleSubmit = async () => {
  if (!session.value || !response.value || !parser.value) {
    return
  }

  response.value.insertAdjacentHTML('beforeend', `<div class="prompt-input-item"><pre>${prompt.value}</pre></div>`);

  loading.value = true;

  try {
    const stream = session.value.promptStreaming(prompt.value);

    prompt.value = '';

    const reader = stream.getReader();

    let chunks = '';
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) {
        smd.parser_end(parser.value);
        break;
      }

      chunks += chunk;

      DOMPurify.sanitize(chunks);
      if (DOMPurify.removed.length) {
        // Immediately stop what you were doing.
        smd.parser_end(parser.value);

        alert('Insecure model output');
        return;
      }

      smd.parser_write(parser.value, chunk);
      // For the unformatted raw output.
      // response.value?.append(chunk);

      if (loading.value) {
        loading.value = false;
      }
    }

    updateSessionStats()
  } catch (e) {
    console.error(e)
  }
}

const setupSession = async () => {
  session.value = await LanguageModel.create({
    temperature: sessionTemperature.value,
    topK: sessionTopK.value,
    initialPrompts: [
      {
        role: 'user',
        content: systemPrompt.value,
      }
    ],
  });

  updateSessionStats();
}

const resetSession = async () => {
  session.value?.destroy()

  await setupSession()

  if (parser.value && response.value) {
    smd.parser_end(parser.value);
  }

  if (response.value) {
    response.value.innerHTML = '';
  }
}

onMounted(async () => {
  const availability = await LanguageModel.availability();
  if (availability !== 'available') {
    alert('AI is not available')
    return
  }

  if (!response.value) {
    console.error('Response container element not found')
    return
  }

  const renderer = smd.default_renderer(response.value);
  parser.value = smd.parser(renderer);

  setupSession()
})

</script>

<style scoped>
.prompt-api-container {
  width: 500px;
  margin: 0 auto;
}
.input-prompt {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.operation {
  text-align: start;
}

button {
  width: 100px;
  margin-right: 10px;
}

textarea {
  height: 100px;
}

.response-container {
  text-align: start;
}

:deep(.prompt-input-item) {
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

pre {
  text-wrap: auto;
}

.status-container {
  text-align: start;
  margin-bottom: 10px;
}

.status-item span:nth-child(1) {
  font-weight: bold;
  margin-right: 5px;
}
</style>