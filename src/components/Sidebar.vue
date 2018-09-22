<template>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <div class="alert alert-danger" v-if="typeof user !== 'object'">Ошибка загрузки данных!</div>
    <div class="well well-sm small" v-if="typeof user === 'object' && Object.keys(user).length">
      <div v-if="!user.teacherId"><b v-if="user.name">{{ user.name }}</b></div>
      <div v-if="user.teacherId">
        <b v-if="user.name">
          <a :href="`/teacher/view?id=${user.teacherId}`">
            {{ user.name }}
          </a>
        </b>
      </div>
      <div v-if="user.role"><i>{{ user.role }}</i></div>
      <div v-if="user.roleId === '4'">{{ user.office }}</div>
    </div>
    <div v-if="typeof filters === 'object' && Object.keys(filters).length">
      <h4>Фильтры:</h4>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <select :disabled="month !== ''" class="form-control form-control-sm" v-model="week" v-if="Array.isArray(filters.weeks)">
            <option :key="`opt-${item.value}`" v-for="item in filters.weeks" :value="item.value">{{ item.text }}</option>
          </select>
        </div>
        <div class="form-group">
          <select :disabled="week !== ''" class="form-control form-control-sm" v-model="month" v-if="Array.isArray(filters.months)">
            <option :key="`opt-${item.value}`" v-for="item in filters.months" :value="item.value">{{ item.text }}</option>
          </select>
        </div>
        <div class="form-group">
          <select class="form-control form-control-sm" v-model="year" v-if="Array.isArray(filters.years)">
            <option :key="`opt-${item.value}`" v-for="item in filters.years" :value="item.value">{{ item.text }}</option>
          </select>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-sm btn-info btn-block"><span class="fa fa-filter" aria-hidden="true"></span> Применить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.week = this.filter.week;
    this.year = this.filter.year;
  },
  data() {
    return {
      month: "",
      week: "",
      year: ""
    };
  },
  methods: {
    onSubmit() {
      this.setFilter({ month: this.month, week: this.week, year: this.year });
    }
  },
  props: {
    filter: {
      required: true,
      type: Object
    },
    filters: {
      required: true,
      type: Object
    },
    setFilter: {
      required: true,
      type: Function
    },
    user: {
      required: true,
      type: Object
    }
  }
};
</script>
