<template>
  <ul class="breadcrumb">
    <li :class="link.style" :key="'ul-' + link.id" v-for="link in links">
        <a :href="link.url" v-if="link.url">{{ link.text }}</a>
        <span v-if="!link.url">{{ link.text }}</span>
    </li>
  </ul>    
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          id: 'home',
          style: null,
          text: 'Главная',
          url: '/',
        },
        {
          id: 'reports',
          style: null,
          text: 'Отчеты',
          url: '/report/index',
        },
        {
          id: 'payments',
          style: 'active',
          text: 'Отчет по оплатам',
          url: null,
        },
      ]
    };
  }
}
</script>
