
<template>
  <h1>This is an example</h1>
  <h2>{{store.data}}</h2>
  <button type="button" @click="clickBtn">count is {{ count }}</button>
</template>

<script setup>
import { ref,onServerPrefetch } from "vue";
import { useMainStore } from '../../store/index'
const count = ref(0);

const store = useMainStore();

const clickBtn = () => {
    count.value++
    store.fetchData("交互请求数据" + count.value);
}

onServerPrefetch(async () => {
  // component is rendered as part of the initial request
  // pre-fetch data on server as it is faster than on the client
  console.log(123)
  await store.fetchData("首屏数据");
})

</script>
